"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errors";
import { calendarKeys } from "@/features/calendar/queries/keys";
import { customerKeys } from "@/features/customers/queries/keys";
import { completeAppointment } from "../actions/service-record-actions";
import { serviceRecordKeys } from "../queries/keys";

export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeAppointment,
    onSuccess: (_data, variables) => {
      // Calendar events reflect the new "completed" status.
      queryClient.invalidateQueries({ queryKey: calendarKeys.appointments() });
      // Customer appointment history + list (status/last appointment).
      queryClient.invalidateQueries({ queryKey: customerKeys.appointments(variables.clientId) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      // Service record views for this appointment + client.
      queryClient.invalidateQueries({
        queryKey: serviceRecordKeys.byClient(variables.clientId),
      });
      queryClient.invalidateQueries({
        queryKey: serviceRecordKeys.byAppointment(variables.appointmentId),
      });
      toast.success("Appointment completed");
    },
    onError: (error) =>
      toast.error("Could not complete appointment", { description: getErrorMessage(error) }),
  });
}
