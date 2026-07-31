import { createClient } from "@/lib/supabase/client";
import type { CalendarAppointment, CalendarClient, CalendarService, DateRange } from "../types";

/** Fetches every appointment whose date falls within the inclusive range. */
export async function fetchAppointmentsInRange(range: DateRange): Promise<CalendarAppointment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select(
      "*, service:services(id, name, color, duration), client:clients(id, first_name, last_name)",
    )
    .gte("date", range.start)
    .lte("date", range.end)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw error;
  return (data ?? []) as CalendarAppointment[];
}

/** Active services, used both for the select and for event coloring. */
export async function fetchActiveServices(): Promise<CalendarService[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("services")
    .select("id, name, color, duration, default_price")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as CalendarService[];
}

/** Clients for the customer select, ordered by name. */
export async function fetchClientsForSelect(): Promise<CalendarClient[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("id, first_name, last_name")
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as CalendarClient[];
}
