import { ComponentType } from "react";
import { Control } from "react-hook-form";

import { CareerFormValues } from "@/lib/schemas/careerFormSchema";
import { BasePreScreeningQuestion, PreScreeningQuestion } from "@/lib/schemas/cvScreeningSchema";
import { QuestionType } from "@/lib/utils/careerConstants";

export interface QuestionRendererProps {
  questionIndex: number;
  control: Control<CareerFormValues>;
  question: PreScreeningQuestion;
}

export interface QuestionRendererConfig<T extends PreScreeningQuestion = PreScreeningQuestion> {
  renderer: ComponentType<QuestionRendererProps>;
  defaultValue: Omit<T, keyof BasePreScreeningQuestion>;
}

export type QuestionRenderer = {
  [K in QuestionType]: QuestionRendererConfig<Extract<PreScreeningQuestion, { type: K }>>;
};
