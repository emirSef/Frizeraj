import { describe, expect, it } from "vitest";

import { serviceSchema } from "./service-schema";

describe("serviceSchema", () => {
  it("accepts valid service data", () => {
    expect(
      serviceSchema.safeParse({
        name: "Women's Haircut",
        duration: "45",
        default_price: "35.00",
        color: "#6366f1",
        is_active: true,
      }).success,
    ).toBe(true);
  });

  it("rejects duration outside 1–600 minutes", () => {
    expect(
      serviceSchema.safeParse({
        name: "Test",
        duration: "0",
        default_price: "10",
        color: "#6366f1",
        is_active: true,
      }).success,
    ).toBe(false);

    expect(
      serviceSchema.safeParse({
        name: "Test",
        duration: "601",
        default_price: "10",
        color: "#6366f1",
        is_active: true,
      }).success,
    ).toBe(false);
  });

  it("rejects invalid hex color", () => {
    expect(
      serviceSchema.safeParse({
        name: "Test",
        duration: "30",
        default_price: "10",
        color: "blue",
        is_active: true,
      }).success,
    ).toBe(false);
  });
});
