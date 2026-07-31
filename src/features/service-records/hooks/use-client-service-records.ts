"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchClientServiceRecords } from "../queries/service-record-queries";
import { serviceRecordKeys } from "../queries/keys";

export function useClientServiceRecords(clientId: string | null) {
  return useQuery({
    queryKey: serviceRecordKeys.byClient(clientId ?? "none"),
    queryFn: () => fetchClientServiceRecords(clientId as string),
    enabled: Boolean(clientId),
  });
}
