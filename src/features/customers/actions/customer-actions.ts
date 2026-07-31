"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ClientInsert } from "@/types";
import { customerSchema, type CustomerFormValues } from "../schemas/customer-schema";

/** Convert form values (which use "" for blanks) into a nullable DB row. */
function toClientRow(values: CustomerFormValues): Omit<ClientInsert, "id" | "created_by"> {
  const blankToNull = (value: string | null | undefined) =>
    value && value.trim().length > 0 ? value.trim() : null;

  return {
    first_name: values.first_name.trim(),
    last_name: values.last_name.trim(),
    email: blankToNull(values.email),
    phone: blankToNull(values.phone),
    birth_date: blankToNull(values.birth_date),
    gender: values.gender ?? null,
    country: blankToNull(values.country),
    city: blankToNull(values.city),
    notes: blankToNull(values.notes),
  };
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

export async function createCustomer(values: CustomerFormValues): Promise<void> {
  const parsed = customerSchema.parse(values);
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("clients")
    .insert({ ...toClientRow(parsed), created_by: user.id });

  if (error) throw new Error(error.message);
  revalidatePath("/customers");
}

export async function updateCustomer(id: string, values: CustomerFormValues): Promise<void> {
  const parsed = customerSchema.parse(values);
  const { supabase } = await requireUser();

  const { error } = await supabase.from("clients").update(toClientRow(parsed)).eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/customers");
}

export async function deleteCustomer(id: string): Promise<void> {
  const { supabase } = await requireUser();

  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/customers");
}
