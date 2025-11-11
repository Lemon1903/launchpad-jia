import { ComponentType } from "react";

import CareerFormResults from "@/lib/components/CareerComponents/new/results/CareerFormResults";
import CareerStepOneForm from "@/lib/components/CareerComponents/new/step-1/CareerStepOneForm";
import CareerStepTwoForm from "@/lib/components/CareerComponents/new/step-2/CareerStepTwoForm";
import CareerStepThreeForm from "@/lib/components/CareerComponents/new/step-3/CareerStepThreeForm";
import { CareerFormValues } from "@/lib/schemas/careerFormSchema";

export interface StepProps {
  onStepClick?: (stepIndex: number) => void;
}

export interface Tips {
  emphasis: string;
  text: string;
}

export interface Step {
  label: string;
  fields: (keyof CareerFormValues)[];
  component: ComponentType<StepProps>;
  tips?: Tips[];
}

export const steps: Step[] = [
  {
    label: "Career Details & Team Access",
    fields: [
      "jobTitle",
      "description",
      "employmentType",
      "workSetup",
      "country",
      "province",
      "location",
      "salaryNegotiable",
      "minimumSalary",
      "maximumSalary",
    ],
    component: CareerStepOneForm,
    tips: [
      {
        emphasis: "Use clear, standard job titles",
        text: "for better searchability (e.g., “Software Engineer” instead of “Code Ninja” or “Tech Rockstar”).",
      },
      {
        emphasis: "Avoid abbreviations",
        text: "or internal role codes that applicants may not understand (e.g., use “QA Engineer” instead of “QE II” or “QA-TL”).",
      },
      {
        emphasis: "Keep it concise",
        text: "– job titles should be no more than a few words (2–4 max), avoiding fluff or marketing terms.",
      },
    ],
  },
  {
    label: "CV Review & Pre-screening",
    fields: ["cvScreeningSetting", "cvSecretPrompt", "preScreeningQuestions"],
    component: CareerStepTwoForm,
    tips: [
      {
        emphasis: "Add a Secret Prompt",
        text: "to fine-tune how Jia scores and evaluates submitted CVs.",
      },
      {
        emphasis: "Add Pre-Screening questions",
        text: "to collect key details such as notice period, work setup, or salary expectations to guide your review and candidate discussions.",
      },
    ],
  },
  {
    label: "AI Interview Setup",
    fields: ["aiScreeningSetting", "aiSecretPrompt", "requireVideo", "questions"],
    component: CareerStepThreeForm,
    tips: [
      {
        emphasis: "Add a Secret Prompt",
        text: "to fine-tune how Jia scores and evaluates the interview responses.",
      },
      {
        emphasis: "Use “Generate Questions”",
        text: "to quickly create tailored interview questions, then refine or mix them with your own for balanced results.",
      },
    ],
  },
  // { label: "Pipeline Stages", component: CareerStepOneForm },
  { label: "Review Career", fields: [], component: CareerFormResults },
];
