"use client";

import * as React from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getErrorMessage } from "@/lib/errors";
import { useTranslations } from "@/i18n";
import { CustomerForm } from "./customer-form";
import { useCreateCustomer, useUpdateCustomer } from "../hooks/use-customer-mutations";
import { uploadCustomerAvatar } from "../lib/upload-avatar";
import { customerFormDefaults, type CustomerFormValues } from "../schemas/customer-schema";
import type { CustomerListItem } from "../types";

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided the dialog edits an existing customer, otherwise it creates one. */
  customer?: CustomerListItem | null;
  /** Returns to the previous modal (e.g. customer details) instead of just closing. */
  onBack?: () => void;
}

function toFormValues(customer: CustomerListItem): CustomerFormValues {
  return {
    first_name: customer.first_name,
    last_name: customer.last_name,
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    birth_date: customer.birth_date ?? "",
    gender: customer.gender ?? "male",
    country: customer.country ?? "",
    city: customer.city ?? "",
    notes: customer.notes ?? "",
    avatar_url: customer.avatar_url ?? "",
  };
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
  onBack,
}: CustomerFormDialogProps) {
  const t = useTranslations();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const [isUploading, setIsUploading] = React.useState(false);

  const isEditing = Boolean(customer);
  const isSubmitting =
    isUploading || createCustomer.isPending || updateCustomer.isPending;

  async function handleSubmit(values: CustomerFormValues, avatarFile: File | null) {
    try {
      let nextValues = values;

      if (avatarFile) {
        setIsUploading(true);
        const avatarUrl = await uploadCustomerAvatar(avatarFile, customer?.id);
        nextValues = { ...values, avatar_url: avatarUrl };
      }

      if (customer) {
        updateCustomer.mutate(
          { id: customer.id, values: nextValues },
          { onSuccess: () => onOpenChange(false) },
        );
      } else {
        createCustomer.mutate(nextValues, { onSuccess: () => onOpenChange(false) });
      }
    } catch (error) {
      toast.error(t("customers.couldNotUpload"), { description: getErrorMessage(error) });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-sm bg-background p-0 sm:max-w-2xl dark:bg-background">
        <DialogHeader className="border-b px-6 py-5 pr-12">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {isEditing ? t("customers.edit") : t("customers.addNew")}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          <CustomerForm
            key={customer?.id ?? "new"}
            defaultValues={customer ? toFormValues(customer) : customerFormDefaults}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel={t("common.save")}
            onBack={onBack}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
