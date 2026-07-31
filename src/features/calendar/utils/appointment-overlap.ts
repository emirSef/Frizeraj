import type { AppointmentStatus } from "@/types";

import { NON_BLOCKING_STATUSES } from "../schemas/appointment-schema";

export interface OverlapAppointment {
  id: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
}

export interface OverlapCheckParams {
  startTime: string;
  endTime: string;
  excludeId?: string;
}

/**
 * Two ranges overlap when each starts before the other ends.
 * Times must be comparable strings (e.g. "HH:mm:ss" sorts chronologically).
 */
export function hasAppointmentOverlap(
  appointments: OverlapAppointment[],
  params: OverlapCheckParams,
): boolean {
  return appointments.some((row) => {
    if (params.excludeId && row.id === params.excludeId) return false;
    if (NON_BLOCKING_STATUSES.includes(row.status)) return false;
    return params.startTime < row.end_time && params.endTime > row.start_time;
  });
}

export function assertNoAppointmentOverlap(
  appointments: OverlapAppointment[],
  params: OverlapCheckParams,
): void {
  if (hasAppointmentOverlap(appointments, params)) {
    throw new Error("This time slot overlaps an existing appointment.");
  }
}
