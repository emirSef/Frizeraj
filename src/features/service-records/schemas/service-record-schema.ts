import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid URL")
  .max(2000)
  .optional()
  .or(z.literal(""));

export const serviceRecordSchema = z.object({
  hair_condition: optionalText(1000),
  treatment: optionalText(1000),
  products_used: optionalText(1000),
  color_formula: optionalText(1000),
  notes: optionalText(2000),
  recommendations: optionalText(1000),
  before_image_url: optionalUrl,
  after_image_url: optionalUrl,
});

export type ServiceRecordFormValues = z.infer<typeof serviceRecordSchema>;

export const serviceRecordFormDefaults: ServiceRecordFormValues = {
  hair_condition: "",
  treatment: "",
  products_used: "",
  color_formula: "",
  notes: "",
  recommendations: "",
  before_image_url: "",
  after_image_url: "",
};
