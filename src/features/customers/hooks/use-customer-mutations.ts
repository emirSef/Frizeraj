"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errors";
import { createCustomer, deleteCustomer, updateCustomer } from "../actions/customer-actions";
import { customerKeys } from "../queries/keys";
import type { CustomerFormValues } from "../schemas/customer-schema";

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CustomerFormValues) => createCustomer(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success("Customer created");
    },
    onError: (error) =>
      toast.error("Could not create customer", { description: getErrorMessage(error) }),
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: CustomerFormValues }) =>
      updateCustomer(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success("Customer updated");
    },
    onError: (error) =>
      toast.error("Could not update customer", { description: getErrorMessage(error) }),
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success("Customer deleted");
    },
    onError: (error) =>
      toast.error("Could not delete customer", { description: getErrorMessage(error) }),
  });
}
