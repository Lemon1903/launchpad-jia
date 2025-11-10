import * as z from "zod";

// Strip commas before coercion
const stripCommas = (v: unknown) => (typeof v === "string" ? v.replace(/,/g, "").trim() : v);

export const salarySchema = z
  .object({
    minimumSalary: z.preprocess(
      stripCommas,
      z.coerce.number().min(1, "Minimum salary must be greater than or equal to 1"),
    ),
    maximumSalary: z.preprocess(
      stripCommas,
      z.coerce.number().min(1, "Maximum salary must be greater than or equal to 1"),
    ),
  })
  .superRefine((data, ctx) => {
    // Ensure numbers are valid (coerce can produce NaN)
    if (Number.isNaN(data.minimumSalary)) {
      ctx.addIssue({
        path: ["minimumSalary"],
        code: "custom",
        message: "Minimum salary is required.",
      });
    }

    if (Number.isNaN(data.maximumSalary)) {
      ctx.addIssue({
        path: ["maximumSalary"],
        code: "custom",
        message: "Maximum salary is required.",
      });
    }

    if (
      !Number.isNaN(data.minimumSalary) &&
      !Number.isNaN(data.maximumSalary) &&
      data.maximumSalary <= data.minimumSalary
    ) {
      ctx.addIssue({
        path: ["maximumSalary"],
        code: "custom",
        message: "Maximum salary must be greater than minimum salary.",
      });
    }
  });
