"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ServiceInsert } from "@/types";
import { serviceSchema, type ServiceFormValues } from "../schemas/service-schema";

/**
 * Ensures the caller is an authenticated admin or manager. RLS also enforces
 * this at the database level; this gives a clear error message up front.
 */
async function requireManager() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You must be signed in to perform this action.");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "admin" && profile.role !== "manager")) {
    throw new Error("You do not have permission to manage services.");
  }

  return { supabase };
}

function toRow(values: ServiceFormValues): Omit<ServiceInsert, "id"> {
  return {
    name: values.name.trim(),
    duration: Number(values.duration),
    default_price: Number(values.default_price),
    color: values.color.trim().toLowerCase(),
    is_active: values.is_active,
  };
}

export async function createService(values: ServiceFormValues): Promise<void> {
  const parsed = serviceSchema.parse(values);
  const { supabase } = await requireManager();

  const { error } = await supabase.from("services").insert(toRow(parsed));
  if (error) throw new Error(error.message);
  revalidatePath("/services");
}

export async function updateService(id: string, values: ServiceFormValues): Promise<void> {
  const parsed = serviceSchema.parse(values);
  const { supabase } = await requireManager();

  const { error } = await supabase.from("services").update(toRow(parsed)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/services");
}

/** Deactivate (or reactivate) a service instead of hard deleting it. */
export async function setServiceActive(id: string, isActive: boolean): Promise<void> {
  const { supabase } = await requireManager();

  const { error } = await supabase.from("services").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/services");
}
