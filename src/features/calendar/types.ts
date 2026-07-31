import type { Appointment } from "@/types";

/** A service option used in the calendar (select + event coloring). */
export interface CalendarService {
  id: string;
  name: string;
  color: string;
  duration: number;
  default_price: number;
}

/** A lightweight client option used to populate the customer select. */
export interface CalendarClient {
  id: string;
  first_name: string;
  last_name: string;
}

/** An appointment with its service and client joined for calendar rendering. */
export interface CalendarAppointment extends Appointment {
  service: { id: string; name: string; color: string; duration: number } | null;
  client: { id: string; first_name: string; last_name: string } | null;
}

/** Inclusive date range (yyyy-MM-dd) used to fetch a window of appointments. */
export interface DateRange {
  start: string;
  end: string;
}

/** Payload for drag & drop / resize updates coming from the calendar. */
export interface AppointmentTimeUpdate {
  date: string;
  start_time: string;
  end_time: string;
}

export function clientLabel(client: Pick<CalendarClient, "first_name" | "last_name"> | null): string {
  if (!client) return "Unknown customer";
  return `${client.first_name} ${client.last_name}`.trim();
}

export { addMinutesToTime } from "./utils/appointment-time";
