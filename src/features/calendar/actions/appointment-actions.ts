"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { AppointmentInsert } from "@/types";
import { appointmentSchema, type AppointmentFormValues } from "../schemas/appointment-schema";
import type { AppointmentTimeUpdate } from "../types";
import {
  assertNoAppointmentOverlap,
  type OverlapAppointment,
} from "../utils/appointment-overlap";
import { addMinutesToTime, isEndAfterStart, normalizeTime } from "../utils/appointment-time";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You must be signed in to perform this action.");
  }
  return { supabase, user };
}

/** Loads a service's duration + default price, needed to derive the end time. */
async function getService(supabase: SupabaseServerClient, serviceId: string) {
  const { data, error } = await supabase
    .from("services")
    .select("duration, default_price")
    .eq("id", serviceId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Enforces the "appointments cannot overlap" rule. Cancelled and no-show
 * appointments do not block a slot. Times are compared as "HH:mm:ss" strings,
 * which sort lexicographically in chronological order.
 */
async function assertNoOverlap(
  supabase: SupabaseServerClient,
  params: { date: string; startTime: string; endTime: string; excludeId?: string },
) {
  const { data, error } = await supabase
    .from("appointments")
    .select("id, start_time, end_time, status")
    .eq("date", params.date);

  if (error) throw new Error(error.message);

  assertNoAppointmentOverlap((data ?? []) as OverlapAppointment[], params);
}

function toRow(
  values: AppointmentFormValues,
  endTime: string,
): Omit<AppointmentInsert, "created_by"> {
  const blankToNull = (value: string | null | undefined) =>
    value && value.trim().length > 0 ? value.trim() : null;

  return {
    client_id: values.client_id,
    service_id: values.service_id,
    date: values.date,
    start_time: normalizeTime(values.start_time),
    end_time: endTime,
    status: values.status,
    price: values.price && values.price.trim() ? Number(values.price) : null,
    treatment: blankToNull(values.treatment),
    products: blankToNull(values.products),
    notes: blankToNull(values.notes),
  };
}

export async function createAppointment(values: AppointmentFormValues): Promise<void> {
  const parsed = appointmentSchema.parse(values);
  const { supabase, user } = await requireUser();

  const service = await getService(supabase, parsed.service_id);
  const startTime = normalizeTime(parsed.start_time);
  const endTime = addMinutesToTime(startTime, service.duration, "HH:mm:ss");

  await assertNoOverlap(supabase, { date: parsed.date, startTime, endTime });

  const { error } = await supabase
    .from("appointments")
    .insert({ ...toRow(parsed, endTime), created_by: user.id });

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}

export async function updateAppointment(id: string, values: AppointmentFormValues): Promise<void> {
  const parsed = appointmentSchema.parse(values);
  const { supabase } = await requireUser();

  const service = await getService(supabase, parsed.service_id);
  const startTime = normalizeTime(parsed.start_time);
  const endTime = addMinutesToTime(startTime, service.duration, "HH:mm:ss");

  await assertNoOverlap(supabase, {
    date: parsed.date,
    startTime,
    endTime,
    excludeId: id,
  });

  const { error } = await supabase.from("appointments").update(toRow(parsed, endTime)).eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}

/**
 * Persists a drag & drop move or a resize. The times are provided by the
 * calendar (a move keeps the duration, a resize changes the end time), so we
 * only validate the overlap rule and store them.
 */
export async function updateAppointmentTime(
  id: string,
  update: AppointmentTimeUpdate,
): Promise<void> {
  const { supabase } = await requireUser();

  const startTime = normalizeTime(update.start_time);
  const endTime = normalizeTime(update.end_time);

  if (!isEndAfterStart(startTime, endTime)) {
    throw new Error("End time must be after the start time.");
  }

  await assertNoOverlap(supabase, {
    date: update.date,
    startTime,
    endTime,
    excludeId: id,
  });

  const { error } = await supabase
    .from("appointments")
    .update({ date: update.date, start_time: startTime, end_time: endTime })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}

export async function deleteAppointment(id: string): Promise<void> {
  const { supabase } = await requireUser();

  const { error } = await supabase.from("appointments").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}
