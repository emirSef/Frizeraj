"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errors";
import {
  createAppointment,
  deleteAppointment,
  updateAppointment,
  updateAppointmentTime,
} from "../actions/appointment-actions";
import { calendarKeys } from "../queries/keys";
import type { AppointmentFormValues } from "../schemas/appointment-schema";
import type { AppointmentTimeUpdate } from "../types";

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: AppointmentFormValues) => createAppointment(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.appointments() });
      toast.success("Appointment created");
    },
    onError: (error) =>
      toast.error("Could not create appointment", { description: getErrorMessage(error) }),
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: AppointmentFormValues }) =>
      updateAppointment(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.appointments() });
      toast.success("Appointment updated");
    },
    onError: (error) =>
      toast.error("Could not update appointment", { description: getErrorMessage(error) }),
  });
}

export function useUpdateAppointmentTime() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, update }: { id: string; update: AppointmentTimeUpdate }) =>
      updateAppointmentTime(id, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.appointments() });
      toast.success("Appointment rescheduled");
    },
    onError: (error) =>
      toast.error("Could not reschedule appointment", { description: getErrorMessage(error) }),
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.appointments() });
      toast.success("Appointment deleted");
    },
    onError: (error) =>
      toast.error("Could not delete appointment", { description: getErrorMessage(error) }),
  });
}
