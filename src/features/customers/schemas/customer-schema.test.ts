import { describe, expect, it } from "vitest";

import { customerSchema } from "./customer-schema";

describe("customerSchema", () => {
  it("accepts minimal required fields", () => {
    expect(
      customerSchema.safeParse({
        first_name: "Ana",
        last_name: "Kovač",
        email: "",
        phone: "",
        birth_date: "",
        gender: null,
        country: "",
        city: "",
        notes: "",
      }).success,
    ).toBe(true);
  });

  it("rejects missing first name", () => {
    const result = customerSchema.safeParse({
      first_name: "",
      last_name: "Kovač",
      email: "",
      phone: "",
      birth_date: "",
      gender: null,
      country: "",
      city: "",
      notes: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = customerSchema.safeParse({
      first_name: "Ana",
      last_name: "Kovač",
      email: "not-an-email",
      phone: "",
      birth_date: "",
      gender: null,
      country: "",
      city: "",
      notes: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid email", () => {
    const result = customerSchema.safeParse({
      first_name: "Ana",
      last_name: "Kovač",
      email: "ana@example.com",
      phone: "",
      birth_date: "",
      gender: null,
      country: "",
      city: "",
      notes: "",
    });
    expect(result.success).toBe(true);
  });
});
