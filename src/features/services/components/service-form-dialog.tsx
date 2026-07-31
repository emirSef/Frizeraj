"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceForm } from "./service-form";
import { useCreateService, useUpdateService } from "../hooks/use-service-mutations";
import { serviceFormDefaults, type ServiceFormValues } from "../schemas/service-schema";
import type { ServiceItem } from "../types";

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided the dialog edits an existing service, otherwise it creates one. */
  service?: ServiceItem | null;
}

function toFormValues(service: ServiceItem): ServiceFormValues {
  return {
    name: service.name,
    duration: String(service.duration),
    default_price: String(service.default_price),
    color: service.color,
    is_active: service.is_active,
  };
}

export function ServiceFormDialog({ open, onOpenChange, service }: ServiceFormDialogProps) {
  const createService = useCreateService();
  const updateService = useUpdateService();

  const isEditing = Boolean(service);
  const isSubmitting = createService.isPending || updateService.isPending;

  function handleSubmit(values: ServiceFormValues) {
    if (service) {
      updateService.mutate({ id: service.id, values }, { onSuccess: () => onOpenChange(false) });
    } else {
      createService.mutate(values, { onSuccess: () => onOpenChange(false) });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit service" : "Add service"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this service's details."
              : "Add a new service to your salon's menu."}
          </DialogDescription>
        </DialogHeader>

        <ServiceForm
          key={service?.id ?? "new"}
          defaultValues={service ? toFormValues(service) : serviceFormDefaults}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={isEditing ? "Save changes" : "Create service"}
        />
      </DialogContent>
    </Dialog>
  );
}
