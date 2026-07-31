"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppointmentForm } from "./appointment-form";
import {
  useCreateAppointment,
  useUpdateAppointment,
} from "../hooks/use-appointment-mutations";
import { useClientsLookup, useServices } from "../hooks/use-lookups";
import {
  appointmentFormDefaults,
  type AppointmentFormValues,
} from "../schemas/appointment-schema";
import type { CalendarAppointment } from "../types";

interface AppointmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided the dialog edits an existing appointment. */
  appointment?: CalendarAppointment | null;
  /** Prefilled values (used when creating from an empty calendar slot). */
  defaults?: Partial<AppointmentFormValues>;
}

function toFormValues(appointment: CalendarAppointment): AppointmentFormValues {
  return {
    client_id: appointment.client_id,
    service_id: appointment.service_id ?? "",
    date: appointment.date,
    start_time: appointment.start_time.slice(0, 5),
    status: appointment.status,
    price: appointment.price != null ? String(appointment.price) : "",
    treatment: appointment.treatment ?? "",
    products: appointment.products ?? "",
    notes: appointment.notes ?? "",
  };
}

export function AppointmentFormDialog({
  open,
  onOpenChange,
  appointment,
  defaults,
}: AppointmentFormDialogProps) {
  const servicesQuery = useServices();
  const clientsQuery = useClientsLookup();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();

  const isEditing = Boolean(appointment);
  const isSubmitting = createAppointment.isPending || updateAppointment.isPending;

  const formValues: AppointmentFormValues = appointment
    ? toFormValues(appointment)
    : { ...appointmentFormDefaults, ...defaults };

  function handleSubmit(values: AppointmentFormValues) {
    if (appointment) {
      updateAppointment.mutate(
        { id: appointment.id, values },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createAppointment.mutate(values, { onSuccess: () => onOpenChange(false) });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit appointment" : "New appointment"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this appointment."
              : "Book a new appointment. The end time is set from the service duration."}
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          key={appointment?.id ?? `new-${formValues.date}-${formValues.start_time}`}
          defaultValues={formValues}
          services={servicesQuery.data ?? []}
          clients={clientsQuery.data ?? []}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={isEditing ? "Save changes" : "Create appointment"}
        />
      </DialogContent>
    </Dialog>
  );
}
