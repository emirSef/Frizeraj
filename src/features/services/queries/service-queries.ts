import { createClient } from "@/lib/supabase/client";
import type { Service } from "@/types";

/** All services (active and inactive), ordered by name — for management. */
export async function fetchServices(): Promise<Service[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Service[];
}
