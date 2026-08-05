"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getErrorMessage } from "@/lib/errors";
import { useTranslations } from "@/i18n";
import type { ServiceRecord } from "@/types";
import type { CalendarAppointment } from "@/features/calendar/types";
import {
  ServiceRecordForm,
  type ServiceRecordPhotoChanges,
} from "./service-record-form";
import { useCompleteAppointment } from "../hooks/use-complete-appointment";
import { useServiceRecordByAppointment } from "../hooks/use-service-record-by-appointment";
import {
  deleteServiceRecordPhoto,
  uploadServiceRecordPhoto,
} from "../lib/upload-photos";
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
  const t = useTranslations();
  const recordQuery = useServiceRecordByAppointment(open ? (appointment?.id ?? null) : null);
  const completeAppointment = useCompleteAppointment();
  const [isUploading, setIsUploading] = React.useState(false);

  if (!appointment) return null;

  const existingRecord = recordQuery.data ?? null;
  const isEditing = Boolean(existingRecord) || appointment.status === "completed";

  const defaultValues: ServiceRecordFormValues = existingRecord
    ? recordToForm(existingRecord)
    : {
        ...serviceRecordFormDefaults,
        treatment: appointment.treatment ?? "",
        products_used: appointment.products ?? "",
      };

  async function handleSubmit(
    values: ServiceRecordFormValues,
    photos: ServiceRecordPhotoChanges,
  ) {
    if (!appointment) return;

    const previousBefore = existingRecord?.before_image_url ?? "";
    const previousAfter = existingRecord?.after_image_url ?? "";
    const uploaded: string[] = [];

    setIsUploading(true);
    let beforeUrl = values.before_image_url;
    let afterUrl = values.after_image_url;

    try {
      if (photos.beforeFile) {
        beforeUrl = await uploadServiceRecordPhoto(
          photos.beforeFile,
          appointment.id,
          "before",
        );
        uploaded.push(beforeUrl);
      } else if (photos.clearBefore) {
        beforeUrl = "";
      }

      if (photos.afterFile) {
        afterUrl = await uploadServiceRecordPhoto(photos.afterFile, appointment.id, "after");
        uploaded.push(afterUrl);
      } else if (photos.clearAfter) {
        afterUrl = "";
      }
    } catch (error) {
      await Promise.allSettled(uploaded.map((url) => deleteServiceRecordPhoto(url)));
      toast.error(t("serviceRecords.couldNotUpload"), {
        description: getErrorMessage(error),
      });
      setIsUploading(false);
      return;
    }

    try {
      await completeAppointment.mutateAsync({
        appointmentId: appointment.id,
        clientId: appointment.client_id,
        serviceId: appointment.service_id,
        values: {
          ...values,
          before_image_url: beforeUrl,
          after_image_url: afterUrl,
        },
      });

      const deletions: Promise<void>[] = [];
      if ((photos.beforeFile || photos.clearBefore) && previousBefore && previousBefore !== beforeUrl) {
        deletions.push(deleteServiceRecordPhoto(previousBefore));
      }
      if ((photos.afterFile || photos.clearAfter) && previousAfter && previousAfter !== afterUrl) {
        deletions.push(deleteServiceRecordPhoto(previousAfter));
      }
      await Promise.allSettled(deletions);

      onOpenChange(false);
    } catch {
      await Promise.allSettled(uploaded.map((url) => deleteServiceRecordPhoto(url)));
    } finally {
      setIsUploading(false);
    }
  }

  const clientName = appointment.client
    ? `${appointment.client.first_name} ${appointment.client.last_name}`.trim()
    : t("serviceRecords.thisCustomer");

  const isSubmitting = isUploading || completeAppointment.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("calendar.editServiceRecord") : t("calendar.completeAppointment")}
          </DialogTitle>
          <DialogDescription>
            {t("serviceRecords.dialogDescription", {
              name: clientName,
              service: appointment.service?.name ? ` · ${appointment.service.name}` : "",
            })}
          </DialogDescription>
        </DialogHeader>

        {recordQuery.isLoading ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 py-10 text-sm">
            <Loader2Icon className="size-4 animate-spin" />
            {t("common.loading")}
          </div>
        ) : (
          <ServiceRecordForm
            key={existingRecord?.id ?? `new-${appointment.id}`}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel={
              isEditing ? t("serviceRecords.saveRecord") : t("calendar.completeAppointment")
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
