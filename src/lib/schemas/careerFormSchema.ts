import * as z from "zod";

import { aiInterviewSchema, customAIInterviewValidation } from "@/lib/schemas/aiInterviewSchema";
import {
  careerInformationSchema,
  customCareerInfoValidation,
} from "@/lib/schemas/careerInformationSchema";
import { cvScreeningSchema } from "@/lib/schemas/cvScreeningSchema";

export const careerFormSchema = careerInformationSchema
  .safeExtend({
    ...cvScreeningSchema.shape,
    ...aiInterviewSchema.shape,
  })
  .superRefine((data, ctx) => {
    customCareerInfoValidation(data, ctx);
    customAIInterviewValidation(data, ctx);
  });

export type CareerFormValues = z.infer<typeof careerFormSchema>;
