import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  duration: z
    .string()
    .trim()
    .regex(/^\d+$/, "Enter duration in minutes")
    .refine((value) => Number(value) > 0 && Number(value) <= 600, "Must be between 1 and 600 minutes"),
  default_price: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price"),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #6366f1"),
  is_active: z.boolean(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const serviceFormDefaults: ServiceFormValues = {
  name: "",
  duration: "30",
  default_price: "0",
  color: "#6366f1",
  is_active: true,
};
