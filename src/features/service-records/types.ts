import type { ServiceRecord } from "@/types";

/** A service record with its service and appointment joined for display. */
export interface ClientServiceRecord extends ServiceRecord {
  service: { name: string; color: string } | null;
  appointment: { date: string } | null;
}

/** The effective date to show for a record (appointment date, else created_at). */
export function serviceRecordDate(record: Pick<ClientServiceRecord, "appointment" | "created_at">): string {
  return record.appointment?.date ?? record.created_at;
}
