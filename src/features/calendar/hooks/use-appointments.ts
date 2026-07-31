"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchAppointmentsInRange } from "../queries/appointment-queries";
import { calendarKeys } from "../queries/keys";
import type { DateRange } from "../types";

export function useAppointments(range: DateRange | null) {
  return useQuery({
    queryKey: calendarKeys.range(range ?? { start: "", end: "" }),
    queryFn: () => fetchAppointmentsInRange(range as DateRange),
    enabled: Boolean(range),
    placeholderData: keepPreviousData,
  });
}
