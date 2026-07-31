"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchServices } from "../queries/service-queries";
import { serviceKeys } from "../queries/keys";

export function useServicesList() {
  return useQuery({
    queryKey: serviceKeys.list(),
    queryFn: fetchServices,
  });
}
