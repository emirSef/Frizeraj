import { z } from "zod";

import type { ClientGender } from "@/types";

export const GENDER_OPTIONS: ReadonlyArray<{ value: ClientGender; label: string }> = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const customerSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(100),
  last_name: z.string().trim().min(1, "Last name is required").max(100),
  email: z
    .string()
    .trim()
    .max(255)
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  phone: optionalText(30),
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker")
    .optional()
    .or(z.literal("")),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).nullable().optional(),
  country: optionalText(100),
  city: optionalText(100),
  notes: optionalText(2000),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

export const customerFormDefaults: CustomerFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  birth_date: "",
  gender: null,
  country: "",
  city: "",
  notes: "",
};
