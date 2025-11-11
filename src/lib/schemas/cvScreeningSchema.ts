import sanitizeHtml from "sanitize-html";
import * as z from "zod";

import { salarySchema } from "@/lib/schemas/salarySchema";
import {
  MINIMUM_OPTIONS,
  QUESTION_TYPES,
  QuestionType,
  SCREENING_SETTING_VALUES,
} from "@/lib/utils/careerConstants";

// Sanitize HTML input to prevent XSS
const sanitizeHtmlInput = (v: unknown): string => {
  if (typeof v !== "string") return "";
  return sanitizeHtml(v, {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    allowedAttributes: {},
  });
};

// Base schema shared by all question types
const baseQuestionSchema = z.object({
  id: z.uuid(),
  type: z.enum(QUESTION_TYPES),
  isSuggested: z.boolean().default(false),
  question: z.string().min(1, "Question is required"),
});

export type BasePreScreeningQuestion = z.infer<typeof baseQuestionSchema>;

const optionSchema = z.object({
  value: z.string().min(1, "Option cannot be empty"),
});

// Dropdown question schema - requires options array
const dropdownQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("dropdown" satisfies QuestionType),
  options: z
    .array(optionSchema)
    .min(MINIMUM_OPTIONS, `At least ${MINIMUM_OPTIONS} options required`),
});

// Checkbox question schema - requires options array
const checkboxQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("checkbox" satisfies QuestionType),
  options: z
    .array(optionSchema)
    .min(MINIMUM_OPTIONS, `At least ${MINIMUM_OPTIONS} options required`),
});

// Range question schema - requires min and max
const rangeQuestionSchema = salarySchema.safeExtend({
  ...baseQuestionSchema.shape,
  type: z.literal("range" satisfies QuestionType),
  step: z.number().optional(),
});

// Text question schema (short-answer and long-answer)
const textQuestionSchema = baseQuestionSchema.extend({
  type: z.union([
    z.literal("short-answer" satisfies QuestionType),
    z.literal("long-answer" satisfies QuestionType),
  ]),
});

// Discriminated union - TypeScript knows which fields exist based on type
export const preScreeningQuestionSchema = z.discriminatedUnion("type", [
  dropdownQuestionSchema,
  checkboxQuestionSchema,
  rangeQuestionSchema,
  textQuestionSchema,
]);

export type PreScreeningQuestion = z.infer<typeof preScreeningQuestionSchema>;

// Main CV screening schema
export const cvScreeningSchema = z.object({
  cvScreeningSetting: z.enum(SCREENING_SETTING_VALUES, {
    error: "Select a valid CV screening setting.",
  }),
  cvSecretPrompt: z
    .string()
    .min(10, "CV secret prompt must be at least 10 characters long.")
    .optional(),
  preScreeningQuestions: z.array(preScreeningQuestionSchema),
});

export type CvScreeningValues = z.infer<typeof cvScreeningSchema>;
