import philippineCitiesAndProvinces from "../../../public/philippines-locations.json";

export const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time"] as const;

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export const WORK_SETUPS = ["Full Remote", "Onsite", "Hybrid"] as const;

export type WorkSetup = (typeof WORK_SETUPS)[number];

export const SCREENING_SETTINGS = [
  { label: "Good Fit and Above", icon: "la la-check" },
  { label: "Only Strong Fit", icon: "la la-check-double" },
  { label: "No Automatic Promotion", icon: "la la-times" },
] as const;

export const SCREENING_SETTING_VALUES = SCREENING_SETTINGS.map((setting) => setting.label);

export type ScreeningSetting = (typeof SCREENING_SETTING_VALUES)[number];

type Province = {
  name: string;
  region: string;
  key: string;
};

type City = {
  name: string;
  province: string;
  city?: boolean;
};

export const PROVINCES: Province[] = philippineCitiesAndProvinces.provinces;

export const PROVINCE_KEYS = PROVINCES.map((province) => province.key);

export const CITIES: City[] = philippineCitiesAndProvinces.cities;

// Question types
export const QUESTION_TYPES = [
  "short-answer",
  "long-answer",
  "dropdown",
  "checkbox",
  "range",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export const MINIMUM_OPTIONS = 2;

export const INTERVIEW_QUESTIONS_CATEGORIES = [
  "CV Validation / Experience",
  "Technical",
  "Behavioral",
  "Analytical",
  "Others",
] as const;

export type InterviewQuestionsCategory = (typeof INTERVIEW_QUESTIONS_CATEGORIES)[number];
