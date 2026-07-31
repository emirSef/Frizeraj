"use client";

import { Loader2Icon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ServiceRecord } from "@/types";
import type { CalendarAppointment } from "@/features/calendar/types";
import { ServiceRecordForm } from "./service-record-form";
import { useCompleteAppointment } from "../hooks/use-complete-appointment";
import { useServiceRecordByAppointment } from "../hooks/use-service-record-by-appointment";
import {
  serviceRecordFormDefaults,
  type ServiceRecordFormValues,
} from "../schemas/service-record-schema";

interface CompleteAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: CalendarAppointment | null;
}

function recordToForm(record: ServiceRecord): ServiceRecordFormValues {
  return {
    hair_condition: record.hair_condition ?? "",
    treatment: record.treatment ?? "",
    products_used: record.products_used ?? "",
    color_formula: record.color_formula ?? "",
    notes: record.notes ?? "",
    recommendations: record.recommendations ?? "",
    before_image_url: record.before_image_url ?? "",
    after_image_url: record.after_image_url ?? "",
  };
}

export function CompleteAppointmentDialog({
  open,
  onOpenChange,
  appointment,
}: CompleteAppointmentDialogProps) {
  const recordQuery = useServiceRecordByAppointment(open ? (appointment?.id ?? null) : null);
  const completeAppointment = useCompleteAppointment();

  if (!appointment) return null;

  const existingRecord = recordQuery.data ?? null;
  const isEditing = Boolean(existingRecord) || appointment.status === "completed";

  // Prefill from an existing record, otherwise seed from the appointment.
  const defaultValues: ServiceRecordFormValues = existingRecord
    ? recordToForm(existingRecord)
    : {
        ...serviceRecordFormDefaults,
        treatment: appointment.treatment ?? "",
        products_used: appointment.products ?? "",
      };

  function handleSubmit(values: ServiceRecordFormValues) {
    if (!appointment) return;
    completeAppointment.mutate(
      {
        appointmentId: appointment.id,
        clientId: appointment.client_id,
        serviceId: appointment.service_id,
        values,
      },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  const clientName = appointment.client
    ? `${appointment.client.first_name} ${appointment.client.last_name}`.trim()
    : "this customer";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit service record" : "Complete appointment"}</DialogTitle>
          <DialogDescription>
            Record what was done for {clientName}
            {appointment.service?.name ? ` · ${appointment.service.name}` : ""}. Saving marks the
            appointment as completed.
          </DialogDescription>
        </DialogHeader>

        {recordQuery.isLoading ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 py-10 text-sm">
            <Loader2Icon className="size-4 animate-spin" />
            Loading…
          </div>
        ) : (
          <ServiceRecordForm
            key={existingRecord?.id ?? `new-${appointment.id}`}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isSubmitting={completeAppointment.isPending}
            submitLabel={isEditing ? "Save service record" : "Complete appointment"}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
