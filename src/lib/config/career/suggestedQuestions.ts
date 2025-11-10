import { PreScreeningQuestion } from "@/lib/schemas/cvScreeningSchema";

export interface SuggestedQuestion {
  title: string;
  question: PreScreeningQuestion;
}

export const suggestedQuestions: SuggestedQuestion[] = [
  {
    title: "Notice Period",
    question: {
      id: crypto.randomUUID(),
      type: "dropdown",
      isSuggested: true,
      question: "How long is your notice period?",
      options: [{ value: "Immediately" }, { value: "< 30 days" }, { value: "> 30 days" }],
    },
  },
  {
    title: "Work Setup",
    question: {
      id: crypto.randomUUID(),
      type: "dropdown",
      isSuggested: true,
      question: "How often are you willing to report to the office each week?",
      options: [
        { value: "At most 1-2x a week" },
        { value: "At most 3-4x a week" },
        { value: "Open to fully onsite work" },
        { value: "Only open to fully remote work" },
      ],
    },
  },
  {
    title: "Asking Salary",
    question: {
      id: crypto.randomUUID(),
      type: "range",
      isSuggested: true,
      question: "How much is your expected monthly salary?",
      minimumSalary: 40000,
      maximumSalary: 60000,
    },
  },
];
