import { Controller } from "react-hook-form";

import SalaryInput from "@/lib/components/CareerComponents/new/SalaryInput";
import { QuestionRendererProps } from "@/lib/components/CareerComponents/new/step-2/question-renderers/types";
import { Field, FieldError, FieldLabel } from "@/lib/components/ui/Field/field";
import { Separator } from "@/lib/components/ui/Separator/separator";

import "./style.scss";

export default function RangeRenderer({ control, questionIndex }: QuestionRendererProps) {
  return (
    <div className="range-renderer">
      <div className="range-renderer__content">
        <Controller
          name={`preScreeningQuestions.${questionIndex}.salaryMin`}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="minimum-salary">Minimum</FieldLabel>
              <SalaryInput id="minimum-salary" aria-invalid={fieldState.invalid} {...field} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name={`preScreeningQuestions.${questionIndex}.salaryMax`}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="maximum-salary">Maximum</FieldLabel>
              <SalaryInput id="maximum-salary" aria-invalid={fieldState.invalid} {...field} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Separator className="range-renderer__separator" />
    </div>
  );
}
