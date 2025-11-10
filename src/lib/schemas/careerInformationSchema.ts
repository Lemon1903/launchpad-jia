// Zod v4 schema
import * as z from "zod";

import { salarySchema } from "@/lib/schemas/salarySchema";
import {
  CITIES,
  EMPLOYMENT_TYPES,
  PROVINCE_KEYS,
  PROVINCES,
  WORK_SETUPS,
} from "@/lib/utils/careerConstants";

// Strip commas before coercion
const stripCommas = (v: unknown) => (typeof v === "string" ? v.replace(/,/g, "").trim() : v);

// Strip HTML tags to get plain text length
const stripHtml = (v: unknown): string => {
  if (typeof v !== "string") return "";
  return v.replace(/<[^>]*>/g, "").trim();
};

export const careerInformationSchema = salarySchema.safeExtend({
  jobTitle: z.string().trim().min(10, "Job title must be at least 10 characters."),
  description: z.string().refine((val) => stripHtml(val).length >= 30, {
    error: "Job description must be at least 30 characters.",
  }),
  employmentType: z.enum(EMPLOYMENT_TYPES, {
    error: "Select a valid employment type.",
  }),
  workSetup: z
    .string()
    .min(1, "Select a work arrangement.")
    .refine(
      (val) => {
        return WORK_SETUPS.includes(val as any);
      },
      { error: "Invalid work arrangement." },
    ),
  country: z
    .string()
    .min(1, "Country is required.")
    .refine((val) => val === "Philippines", {
      error: "Currently, only Philippines is supported.",
    }),
  province: z
    .string()
    .min(1, "Province is required.")
    .refine((val) => PROVINCES.some((province) => province.name === val), {
      error: "Invalid province.",
    }),
  location: z.string().min(1, "City is required."),
  salaryNegotiable: z.boolean().default(false),
});

export type CareerInformationValues = z.infer<typeof careerInformationSchema>;

export function customCareerInfoValidation(data: CareerInformationValues, ctx: z.RefinementCtx) {
  // Add a custom validation for city based on selected province
  const isCityValid = CITIES.find(
    (city) => city.name === data.location && PROVINCE_KEYS.includes(city.province),
  );

  if (!isCityValid) {
    ctx.addIssue({
      path: ["location"],
      code: "custom",
      message: "City does not belong to selected province.",
    });
  }
}
