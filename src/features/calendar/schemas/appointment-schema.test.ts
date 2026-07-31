import { describe, expect, it } from "vitest";

import { appointmentSchema } from "./appointment-schema";

const validBase = {
  client_id: "550e8400-e29b-41d4-a716-446655440000",
  service_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  date: "2026-07-15",
  start_time: "09:00",
  status: "scheduled" as const,
  price: "25.00",
  treatment: "",
  products: "",
  notes: "",
};

describe("appointmentSchema", () => {
  it("accepts valid appointment data", () => {
    expect(appointmentSchema.safeParse(validBase).success).toBe(true);
  });

  it("accepts HH:mm:ss start time", () => {
    expect(
      appointmentSchema.safeParse({ ...validBase, start_time: "09:00:00" }).success,
    ).toBe(true);
  });

  it("rejects invalid UUIDs", () => {
    const result = appointmentSchema.safeParse({ ...validBase, client_id: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = appointmentSchema.safeParse({ ...validBase, date: "15/07/2026" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid price format", () => {
    const result = appointmentSchema.safeParse({ ...validBase, price: "25,00" });
    expect(result.success).toBe(false);
  });

  it("allows empty optional price", () => {
    expect(appointmentSchema.safeParse({ ...validBase, price: "" }).success).toBe(true);
  });
});
