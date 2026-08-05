import { toDateString } from "@/lib/timezone";
import type { ServiceRecord } from "@/types";

/** A service record with its service and appointment joined for display. */
export interface ClientServiceRecord extends ServiceRecord {
  service: { name: string; color: string } | null;
  appointment: { date: string } | null;
}

/**
 * The effective calendar date to show for a record.
 * Prefers the appointment's civil `date`; falls back to `created_at` in Europe/Sarajevo.
 */
export function serviceRecordDate(record: Pick<ClientServiceRecord, "appointment" | "created_at">): string {
  if (record.appointment?.date) return record.appointment.date;
  return toDateString(new Date(record.created_at));
}
