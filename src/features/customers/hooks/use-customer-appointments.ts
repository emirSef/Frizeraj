"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchCustomerAppointments } from "../queries/customer-queries";
import { customerKeys } from "../queries/keys";

export function useCustomerAppointments(customerId: string | null) {
  return useQuery({
    queryKey: customerKeys.appointments(customerId ?? "none"),
    queryFn: () => fetchCustomerAppointments(customerId as string),
    enabled: Boolean(customerId),
  });
}
