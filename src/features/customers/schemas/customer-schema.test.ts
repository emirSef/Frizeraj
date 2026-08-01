import { describe, expect, it } from "vitest";

import { customerFormDefaults, customerSchema } from "./customer-schema";

describe("customerSchema", () => {
  it("accepts minimal required fields", () => {
    expect(
      customerSchema.safeParse({
        ...customerFormDefaults,
        first_name: "Ana",
        last_name: "Kovač",
      }).success,
    ).toBe(true);
  });

  it("rejects missing first name", () => {
    const result = customerSchema.safeParse({
      ...customerFormDefaults,
      first_name: "",
      last_name: "Kovač",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = customerSchema.safeParse({
      ...customerFormDefaults,
      first_name: "Ana",
      last_name: "Kovač",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid email", () => {
    const result = customerSchema.safeParse({
      ...customerFormDefaults,
      first_name: "Ana",
      last_name: "Kovač",
      email: "ana@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("accepts avatar_url and personal_id", () => {
    const result = customerSchema.safeParse({
      ...customerFormDefaults,
      first_name: "Ana",
      last_name: "Kovač",
      personal_id: "ABC123",
      avatar_url: "https://example.com/avatar.jpg",
    });
    expect(result.success).toBe(true);
  });
});
