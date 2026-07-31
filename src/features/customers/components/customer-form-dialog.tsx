"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomerForm } from "./customer-form";
import { useCreateCustomer, useUpdateCustomer } from "../hooks/use-customer-mutations";
import { customerFormDefaults, type CustomerFormValues } from "../schemas/customer-schema";
import type { CustomerListItem } from "../types";

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided the dialog edits an existing customer, otherwise it creates one. */
  customer?: CustomerListItem | null;
}

function toFormValues(customer: CustomerListItem): CustomerFormValues {
  return {
    first_name: customer.first_name,
    last_name: customer.last_name,
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    birth_date: customer.birth_date ?? "",
    gender: customer.gender,
    country: customer.country ?? "",
    city: customer.city ?? "",
    notes: customer.notes ?? "",
  };
}

export function CustomerFormDialog({ open, onOpenChange, customer }: CustomerFormDialogProps) {
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const isEditing = Boolean(customer);
  const isSubmitting = createCustomer.isPending || updateCustomer.isPending;

  function handleSubmit(values: CustomerFormValues) {
    if (customer) {
      updateCustomer.mutate(
        { id: customer.id, values },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createCustomer.mutate(values, { onSuccess: () => onOpenChange(false) });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Customer" : "Add New Customer"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this customer's details."
              : "Fill in the details to add a new customer."}
          </DialogDescription>
        </DialogHeader>

        <CustomerForm
          key={customer?.id ?? "new"}
          defaultValues={customer ? toFormValues(customer) : customerFormDefaults}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={isEditing ? "Save changes" : "Save"}
        />
      </DialogContent>
    </Dialog>
  );
}
