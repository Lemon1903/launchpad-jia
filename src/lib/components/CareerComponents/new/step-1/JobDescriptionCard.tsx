import { Controller, useFormContext } from "react-hook-form";

import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/Card/card";
import { Field, FieldError } from "@/lib/components/ui/Field/field";
import { CareerFormValues } from "@/lib/schemas/careerFormSchema";
import "@/lib/styles/forms/career-step-one.scss";

export default function JobDescriptionCard() {
  const { control } = useFormContext<CareerFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Job Description</CardTitle>
      </CardHeader>
      <CardContent>
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <RichTextEditor
                text={field.value}
                setText={field.onChange}
                hasError={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </CardContent>
    </Card>
  );
}
