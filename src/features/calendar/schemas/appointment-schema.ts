import { z } from "zod";

import type { AppointmentStatus } from "@/types";

/**
 * Status options with the color used to indicate status on calendar events.
 * The event background comes from the service; the status is shown via the
 * event border / accent so both requirements are respected.
 */
export const STATUS_OPTIONS: ReadonlyArray<{
  value: AppointmentStatus;
  label: string;
  color: string;
}> = [
  { value: "scheduled", label: "Scheduled", color: "#3b82f6" },
  { value: "confirmed", label: "Confirmed", color: "#8b5cf6" },
  { value: "in_progress", label: "In Progress", color: "#f59e0b" },
  { value: "completed", label: "Completed", color: "#22c55e" },
  { value: "cancelled", label: "Cancelled", color: "#ef4444" },
  { value: "no_show", label: "No Show", color: "#6b7280" },
];

/** Statuses that do NOT block a time slot (they free the slot up). */
export const NON_BLOCKING_STATUSES: ReadonlyArray<AppointmentStatus> = ["cancelled", "no_show"];

export function statusLabel(status: AppointmentStatus): string {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

export function statusColor(status: AppointmentStatus): string {
  return STATUS_OPTIONS.find((option) => option.value === status)?.color ?? "#64748b";
}

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const appointmentSchema = z.object({
  client_id: z.string().uuid("Select a customer"),
  service_id: z.string().uuid("Select a service"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Select a date"),
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Select a start time"),
  status: z.enum([
    "scheduled",
    "confirmed",
    "in_progress",
    "completed",
    "cancelled",
    "no_show",
  ]),
  price: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price")
    .optional()
    .or(z.literal("")),
  treatment: optionalText(200),
  products: optionalText(500),
  notes: optionalText(2000),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export const appointmentFormDefaults: AppointmentFormValues = {
  client_id: "",
  service_id: "",
  date: "",
  start_time: "09:00",
  status: "scheduled",
  price: "",
  treatment: "",
  products: "",
  notes: "",
};
