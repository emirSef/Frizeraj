import { describe, expect, it } from "vitest";

import { serviceRecordSchema } from "./service-record-schema";

describe("serviceRecordSchema", () => {
  it("accepts empty optional fields", () => {
    expect(
      serviceRecordSchema.safeParse({
        hair_condition: "",
        treatment: "",
        products_used: "",
        color_formula: "",
        notes: "",
        recommendations: "",
        before_image_url: "",
        after_image_url: "",
      }).success,
    ).toBe(true);
  });

  it("accepts valid image URLs", () => {
    expect(
      serviceRecordSchema.safeParse({
        hair_condition: "Healthy",
        treatment: "Balayage",
        products_used: "Olaplex",
        color_formula: "7/0 + 8/1",
        notes: "",
        recommendations: "",
        before_image_url: "https://example.com/before.jpg",
        after_image_url: "https://example.com/after.jpg",
      }).success,
    ).toBe(true);
  });

  it("rejects invalid image URLs", () => {
    const result = serviceRecordSchema.safeParse({
      hair_condition: "",
      treatment: "",
      products_used: "",
      color_formula: "",
      notes: "",
      recommendations: "",
      before_image_url: "not-a-url",
      after_image_url: "",
    });
    expect(result.success).toBe(false);
  });
});
