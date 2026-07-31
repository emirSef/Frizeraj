import type { Database } from "./database.types";

export type {
  Database,
  Json,
  UserRole,
  ClientGender,
  AppointmentStatus,
} from "./database.types";

type Tables = Database["public"]["Tables"];

export type AppUser = Tables["users"]["Row"];
export type Client = Tables["clients"]["Row"];
export type Service = Tables["services"]["Row"];
export type Appointment = Tables["appointments"]["Row"];
export type ServiceRecord = Tables["service_records"]["Row"];

export type ClientInsert = Tables["clients"]["Insert"];
export type ClientUpdate = Tables["clients"]["Update"];
export type ServiceInsert = Tables["services"]["Insert"];
export type ServiceUpdate = Tables["services"]["Update"];
export type AppointmentInsert = Tables["appointments"]["Insert"];
export type AppointmentUpdate = Tables["appointments"]["Update"];
export type ServiceRecordInsert = Tables["service_records"]["Insert"];
export type ServiceRecordUpdate = Tables["service_records"]["Update"];

/**
 * Standard shape for paginated list responses from the service layer.
 */
export interface Paginated<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}

/**
 * Generic result wrapper for operations that can fail without throwing.
 */
export type Result<T, E = string> = { success: true; data: T } | { success: false; error: E };

export type Nullable<T> = T | null;

export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
