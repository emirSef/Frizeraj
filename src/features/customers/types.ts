import type { Appointment, Client, ClientGender } from "@/types";

export type Customer = Client;

export type CustomerSortField = "name" | "email" | "phone" | "city" | "created_at";
export type SortOrder = "asc" | "desc";

/** A customer is "active" once they have at least one appointment, otherwise "new". */
export type CustomerStatus = "active" | "new";

export type CustomerStatusFilter = "all" | CustomerStatus;
export type CustomerGenderFilter = "all" | ClientGender;

export interface CustomerFilters {
  status: CustomerStatusFilter;
  gender: CustomerGenderFilter;
}

export const DEFAULT_CUSTOMER_FILTERS: CustomerFilters = { status: "all", gender: "all" };

/** Number of narrowing filters currently applied, for the toolbar badge. */
export function countActiveFilters(filters: CustomerFilters): number {
  return Object.values(filters).filter((value) => value !== "all").length;
}

export interface CustomerListParams extends CustomerFilters {
  search: string;
  /** 1-based page index. */
  page: number;
  pageSize: number;
  sortField: CustomerSortField;
  sortOrder: SortOrder;
}

/** How the customer list is laid out on the page. */
export type CustomerViewMode = "list" | "grid";

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

export function getCustomerStatus(
  item: Pick<CustomerListItem, "last_appointment">,
): CustomerStatus {
  return item.last_appointment ? "active" : "new";
}
