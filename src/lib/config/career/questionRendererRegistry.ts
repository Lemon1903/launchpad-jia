// config/questionRendererRegistry.ts
import CheckboxRenderer from "@/lib/components/CareerComponents/new/step-2/question-renderers/CheckboxRenderer";
import DropdownRenderer from "@/lib/components/CareerComponents/new/step-2/question-renderers/DropdownRenderer";
import RangeRenderer from "@/lib/components/CareerComponents/new/step-2/question-renderers/RangeRenderer";
import { QuestionRenderer } from "@/lib/components/CareerComponents/new/step-2/question-renderers/types";

export const questionRendererRegistry: QuestionRenderer = {
  "short-answer": {
    renderer: () => null,
    defaultValue: {},
  },
  "long-answer": {
    renderer: () => null,
    defaultValue: {},
  },
  dropdown: {
    renderer: DropdownRenderer,
    defaultValue: { options: [{ value: "" }, { value: "" }] },
  },
  checkbox: {
    renderer: CheckboxRenderer,
    defaultValue: { options: [{ value: "" }, { value: "" }] },
  },
  range: {
    renderer: RangeRenderer,
    defaultValue: { minimumSalary: 0, maximumSalary: 0 },
  },
};
