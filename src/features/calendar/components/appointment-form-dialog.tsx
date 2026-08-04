"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppointmentForm } from "./appointment-form";
import {
  useCreateAppointment,
  useUpdateAppointment,
} from "../hooks/use-appointment-mutations";
import { useClientsLookup, useServices } from "../hooks/use-lookups";
import { useTranslations } from "@/i18n";
import {
  appointmentFormDefaults,
  type AppointmentFormValues,
} from "../schemas/appointment-schema";
import type { CalendarAppointment, CalendarClient } from "../types";

interface AppointmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided the dialog edits an existing appointment. */
  appointment?: CalendarAppointment | null;
  /** Prefilled values (used when creating from an empty calendar slot). */
  defaults?: Partial<AppointmentFormValues>;
  /** Ensures this client appears selected even before the lookup finishes. */
  preferredClient?: CalendarClient | null;
  /** Locks the customer field (e.g. when opened from customer details). */
  lockClient?: boolean;
  /** Returns to the previous modal instead of just closing. */
  onBack?: () => void;
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
  preferredClient,
  lockClient = false,
  onBack,
}: AppointmentFormDialogProps) {
  const t = useTranslations();
  const servicesQuery = useServices();
  const clientsQuery = useClientsLookup();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();

  const isEditing = Boolean(appointment);
  const isSubmitting = createAppointment.isPending || updateAppointment.isPending;

  const formValues: AppointmentFormValues = appointment
    ? toFormValues(appointment)
    : { ...appointmentFormDefaults, ...defaults };

  const clients = React.useMemo(() => {
    const list = clientsQuery.data ?? [];
    if (!preferredClient) return list;
    if (list.some((client) => client.id === preferredClient.id)) return list;
    return [preferredClient, ...list];
  }, [clientsQuery.data, preferredClient]);

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
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-sm bg-background p-0 sm:max-w-xl dark:bg-background">
        <DialogHeader className="border-b px-6 py-5 pr-12">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {isEditing ? t("calendar.editAppointment") : t("calendar.createNew")}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          <AppointmentForm
            key={
              appointment?.id ??
              `new-${formValues.client_id}-${formValues.date}-${formValues.start_time}`
            }
            defaultValues={formValues}
            services={servicesQuery.data ?? []}
            clients={clients}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel={t("common.save")}
            showStatus={isEditing}
            lockClient={lockClient}
            onBack={onBack}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
