"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchCustomers } from "../queries/customer-queries";
import { customerKeys } from "../queries/keys";
import type { CustomerListParams } from "../types";

export function useCustomers(params: CustomerListParams) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => fetchCustomers(params),
    placeholderData: keepPreviousData,
  });
}
