"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchServiceRecordByAppointment } from "../queries/service-record-queries";
import { serviceRecordKeys } from "../queries/keys";

export function useServiceRecordByAppointment(appointmentId: string | null) {
  return useQuery({
    queryKey: serviceRecordKeys.byAppointment(appointmentId ?? "none"),
    queryFn: () => fetchServiceRecordByAppointment(appointmentId as string),
    enabled: Boolean(appointmentId),
  });
}
