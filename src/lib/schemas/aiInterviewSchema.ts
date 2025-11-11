import sanitizeHtml from "sanitize-html";
import * as z from "zod";

import {
  INTERVIEW_QUESTIONS_CATEGORIES,
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

const questionSchema = z.object({
  id: z.uuid(),
  question: z.string().min(10, "Question must be at least 10 characters long."),
});

const interviewQuestionsSchema = z.object({
  id: z.uuid(),
  category: z.enum(INTERVIEW_QUESTIONS_CATEGORIES, {
    error: "Select a valid question category.",
  }),
  questionCountToAsk: z.coerce.number().min(1, "Must ask at least 1 question.").nullable(),
  questions: z.array(questionSchema),
});

export type InterviewQuestionsValues = z.infer<typeof interviewQuestionsSchema>;

export const aiInterviewSchema = z.object({
  aiScreeningSetting: z.enum(SCREENING_SETTING_VALUES, {
    error: "Select a valid CV screening setting.",
  }),
  requireVideo: z.boolean().default(false),
  aiSecretPrompt: z
    .string()
    .min(10, "AI secret prompt must be at least 10 characters long.")
    .optional(),
  questions: z.array(interviewQuestionsSchema),
});

export type AIInterviewValues = z.infer<typeof aiInterviewSchema>;

export function customAIInterviewValidation(data: AIInterviewValues, ctx: z.RefinementCtx) {
  let overallTotalQuestions = 0;

  // Validate questionCountToAsk for each category
  data.questions.forEach((category, index) => {
    const totalQuestions = category.questions.length;
    const countToAsk = category.questionCountToAsk;
    overallTotalQuestions += totalQuestions;

    // null is ok if no questions in that category
    if (totalQuestions === 0) return;

    if (countToAsk == null) {
      ctx.addIssue({
        code: "custom",
        message: `Please specify how many questions to ask for the ${category.category} category.`,
        path: [`questions`, index, `questionCountToAsk`],
      });
      return;
    }

    if (countToAsk > totalQuestions) {
      ctx.addIssue({
        code: "custom",
        message: `Cannot ask more questions (${countToAsk}) than available (${totalQuestions}) in the ${category.category} category.`,
        path: [`questions`, index, `questionCountToAsk`],
      });
      return;
    }
  });

  // At least 5 questions must be asked overall
  if (overallTotalQuestions < 5) {
    ctx.addIssue({
      code: "custom",
      message: `Please add at least 5 interview questions.`,
      path: [`questions`],
    });
  }
}
