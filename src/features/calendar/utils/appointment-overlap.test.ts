import { describe, expect, it } from "vitest";

import {
  assertNoAppointmentOverlap,
  hasAppointmentOverlap,
  type OverlapAppointment,
} from "./appointment-overlap";

const existing: OverlapAppointment[] = [
  {
    id: "a1",
    start_time: "10:00:00",
    end_time: "11:00:00",
    status: "confirmed",
  },
  {
    id: "a2",
    start_time: "14:00:00",
    end_time: "15:00:00",
    status: "cancelled",
  },
];

describe("hasAppointmentOverlap", () => {
  it("detects overlapping appointments", () => {
    expect(
      hasAppointmentOverlap(existing, {
        startTime: "10:30:00",
        endTime: "11:30:00",
      }),
    ).toBe(true);
  });

  it("allows adjacent slots (end equals next start)", () => {
    expect(
      hasAppointmentOverlap(existing, {
        startTime: "11:00:00",
        endTime: "12:00:00",
      }),
    ).toBe(false);
  });

  it("ignores cancelled and no-show appointments", () => {
    expect(
      hasAppointmentOverlap(existing, {
        startTime: "14:00:00",
        endTime: "15:00:00",
      }),
    ).toBe(false);
  });

  it("ignores no-show appointments", () => {
    const withNoShow: OverlapAppointment[] = [
      {
        id: "a3",
        start_time: "16:00:00",
        end_time: "17:00:00",
        status: "no_show",
      },
    ];

    expect(
      hasAppointmentOverlap(withNoShow, {
        startTime: "16:15:00",
        endTime: "16:45:00",
      }),
    ).toBe(false);
  });

  it("excludes the appointment being edited", () => {
    expect(
      hasAppointmentOverlap(existing, {
        startTime: "10:00:00",
        endTime: "11:00:00",
        excludeId: "a1",
      }),
    ).toBe(false);
  });
});

describe("assertNoAppointmentOverlap", () => {
  it("throws a user-friendly error on clash", () => {
    expect(() =>
      assertNoAppointmentOverlap(existing, {
        startTime: "10:15:00",
        endTime: "10:45:00",
      }),
    ).toThrow("This time slot overlaps an existing appointment.");
  });
});
