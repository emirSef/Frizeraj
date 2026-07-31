"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchActiveServices, fetchClientsForSelect } from "../queries/appointment-queries";
import { calendarKeys } from "../queries/keys";

export function useServices() {
  return useQuery({
    queryKey: calendarKeys.services(),
    queryFn: fetchActiveServices,
    staleTime: 5 * 60 * 1000,
  });
}

export function useClientsLookup() {
  return useQuery({
    queryKey: calendarKeys.clients(),
    queryFn: fetchClientsForSelect,
    staleTime: 5 * 60 * 1000,
  });
}
