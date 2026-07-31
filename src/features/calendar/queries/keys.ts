import type { DateRange } from "../types";

export const calendarKeys = {
  all: ["calendar"] as const,
  appointments: () => [...calendarKeys.all, "appointments"] as const,
  range: (range: DateRange) => [...calendarKeys.appointments(), range] as const,
  services: () => [...calendarKeys.all, "services"] as const,
  clients: () => [...calendarKeys.all, "clients"] as const,
};
