"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errors";
import { calendarKeys } from "@/features/calendar/queries/keys";
import { createService, setServiceActive, updateService } from "../actions/service-actions";
import { serviceKeys } from "../queries/keys";
import type { ServiceFormValues } from "../schemas/service-schema";

/** Refresh both this module's list and the calendar's active-services select. */
function useInvalidateServices() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    queryClient.invalidateQueries({ queryKey: calendarKeys.services() });
  };
}

export function useCreateService() {
  const invalidate = useInvalidateServices();
  return useMutation({
    mutationFn: (values: ServiceFormValues) => createService(values),
    onSuccess: () => {
      invalidate();
      toast.success("Service created");
    },
    onError: (error) =>
      toast.error("Could not create service", { description: getErrorMessage(error) }),
  });
}

export function useUpdateService() {
  const invalidate = useInvalidateServices();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: ServiceFormValues }) =>
      updateService(id, values),
    onSuccess: () => {
      invalidate();
      toast.success("Service updated");
    },
    onError: (error) =>
      toast.error("Could not update service", { description: getErrorMessage(error) }),
  });
}

export function useSetServiceActive() {
  const invalidate = useInvalidateServices();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      setServiceActive(id, isActive),
    onSuccess: (_data, variables) => {
      invalidate();
      toast.success(variables.isActive ? "Service activated" : "Service deactivated");
    },
    onError: (error) =>
      toast.error("Could not update service", { description: getErrorMessage(error) }),
  });
}
