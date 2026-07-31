import type { Appointment, Client } from "@/types";

export type Customer = Client;

export type CustomerSortField = "name" | "email" | "phone" | "city" | "created_at";
export type SortOrder = "asc" | "desc";

export interface CustomerListParams {
  search: string;
  /** 1-based page index. */
  page: number;
  pageSize: number;
  sortField: CustomerSortField;
  sortOrder: SortOrder;
}

/** A customer is "active" once they have at least one appointment, otherwise "new". */
export type CustomerStatus = "active" | "new";

export interface CustomerListItem extends Client {
  last_appointment: string | null;
}

export interface CustomerListResult {
  rows: CustomerListItem[];
  count: number;
}

export interface CustomerAppointment extends Appointment {
  service: { name: string; color: string } | null;
}

export function getCustomerStatus(item: Pick<CustomerListItem, "last_appointment">): CustomerStatus {
  return item.last_appointment ? "active" : "new";
}
