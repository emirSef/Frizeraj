"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ServiceRecordInsert } from "@/types";
import {
  serviceRecordSchema,
  type ServiceRecordFormValues,
} from "../schemas/service-record-schema";

export interface CompleteAppointmentInput {
  appointmentId: string;
  clientId: string;
  serviceId: string | null;
  values: ServiceRecordFormValues;
}

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

function blankToNull(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value.trim() : null;
}

/**
 * Saves the service record for an appointment and marks the appointment as
 * completed. The record is upserted on `appointment_id`, so re-completing an
 * appointment edits the existing record instead of creating a duplicate.
 */
export async function completeAppointment(input: CompleteAppointmentInput): Promise<void> {
  const parsed = serviceRecordSchema.parse(input.values);
  const { supabase } = await requireUser();

  const record: ServiceRecordInsert = {
    appointment_id: input.appointmentId,
    client_id: input.clientId,
    service_id: input.serviceId,
    hair_condition: blankToNull(parsed.hair_condition),
    treatment: blankToNull(parsed.treatment),
    products_used: blankToNull(parsed.products_used),
    color_formula: blankToNull(parsed.color_formula),
    notes: blankToNull(parsed.notes),
    recommendations: blankToNull(parsed.recommendations),
    before_image_url: blankToNull(parsed.before_image_url),
    after_image_url: blankToNull(parsed.after_image_url),
  };

  const { error: recordError } = await supabase
    .from("service_records")
    .upsert(record, { onConflict: "appointment_id" });

  if (recordError) throw new Error(recordError.message);

  const { error: statusError } = await supabase
    .from("appointments")
    .update({ status: "completed" })
    .eq("id", input.appointmentId);

  if (statusError) throw new Error(statusError.message);

  revalidatePath("/calendar");
  revalidatePath("/customers");
}
