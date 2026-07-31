import { createClient } from "@/lib/supabase/client";
import type { ServiceRecord } from "@/types";
import type { ClientServiceRecord } from "../types";

/** A client's service records, newest first, with service + appointment joined. */
export async function fetchClientServiceRecords(clientId: string): Promise<ClientServiceRecord[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("service_records")
    .select("*, service:services(name, color), appointment:appointments(date)")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ClientServiceRecord[];
}

/** The existing service record for an appointment (if any), used to prefill edits. */
export async function fetchServiceRecordByAppointment(
  appointmentId: string,
): Promise<ServiceRecord | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("service_records")
    .select("*")
    .eq("appointment_id", appointmentId)
    .maybeSingle();

  if (error) throw error;
  return (data as ServiceRecord | null) ?? null;
}
