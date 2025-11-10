import { InterviewQuestionsValues } from "@/lib/schemas/aiInterviewSchema";

export const aiQuestions: InterviewQuestionsValues[] = [
  {
    id: crypto.randomUUID(),
    category: "CV Validation / Experience",
    questionCountToAsk: null,
    questions: [],
  },
  {
    id: crypto.randomUUID(),
    category: "Technical",
    questionCountToAsk: null,
    questions: [],
  },
  {
    id: crypto.randomUUID(),
    category: "Behavioral",
    questionCountToAsk: null,
    questions: [],
  },
  {
    id: crypto.randomUUID(),
    category: "Analytical",
    questionCountToAsk: null,
    questions: [],
  },
  {
    id: crypto.randomUUID(),
    category: "Others",
    questionCountToAsk: null,
    questions: [],
  },
];
