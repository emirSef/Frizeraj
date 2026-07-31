import type { CustomerListParams } from "../types";

export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (params: CustomerListParams) => [...customerKeys.lists(), params] as const,
  appointments: (customerId: string) =>
    [...customerKeys.all, "appointments", customerId] as const,
};
