import { createClient } from "@/lib/supabase/client";
import type {
  CustomerAppointment,
  CustomerListParams,
  CustomerListResult,
  CustomerSortField,
} from "../types";

const SORT_COLUMNS: Record<CustomerSortField, string> = {
  name: "first_name",
  email: "email",
  phone: "phone",
  city: "city",
  created_at: "created_at",
};

/** Strip characters that would break a PostgREST `or` filter expression. */
function sanitizeSearch(search: string): string {
  return search.replace(/[,()%*\\]/g, " ").trim();
}

/**
 * Fetches a page of customers with server-side search, sorting and pagination.
 * The latest appointment date is embedded (one per customer) to derive the
 * "Last appointment" column and Active/New status without extra round-trips.
 */
export async function fetchCustomers(params: CustomerListParams): Promise<CustomerListResult> {
  const supabase = createClient();

  const from = (params.page - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  let query = supabase
    .from("clients")
    .select("*, appointments(date)", { count: "exact" })
    .order(SORT_COLUMNS[params.sortField], { ascending: params.sortOrder === "asc" })
    .order("date", { referencedTable: "appointments", ascending: false })
    .limit(1, { referencedTable: "appointments" })
    .range(from, to);

  if (params.sortField === "name") {
    query = query.order("last_name", { ascending: params.sortOrder === "asc" });
  }

  // "active"/"new" is derived from whether the embedded appointments exist, so
  // both branches filter the parent rows through the embedded resource.
  if (params.status === "active") {
    query = query.not("appointments", "is", null);
  } else if (params.status === "new") {
    query = query.is("appointments", null);
  }

  if (params.gender !== "all") {
    query = query.eq("gender", params.gender);
  }

  const search = sanitizeSearch(params.search);
  if (search) {
    query = query.or(
      [
        `first_name.ilike.%${search}%`,
        `last_name.ilike.%${search}%`,
        `email.ilike.%${search}%`,
        `phone.ilike.%${search}%`,
      ].join(","),
    );
  }

  const { data, error, count } = await query;
  if (error) throw error;

  const rows = (data ?? []).map((row) => {
    const { appointments, ...client } = row as typeof row & {
      appointments: { date: string }[] | null;
    };
    return {
      ...client,
      last_appointment: appointments?.[0]?.date ?? null,
    };
  });

  return { rows, count: count ?? 0 };
}

/** Loads a customer's appointment history, newest first. */
export async function fetchCustomerAppointments(
  customerId: string,
): Promise<CustomerAppointment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select("*, service:services(name, color)")
    .eq("client_id", customerId)
    .order("date", { ascending: false })
    .order("start_time", { ascending: false });

  if (error) throw error;
  return (data ?? []) as CustomerAppointment[];
}
