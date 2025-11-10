import { Controller, useFormContext } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/lib/components/ui/Field/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/Select/select";
import { CareerFormValues } from "@/lib/schemas/careerFormSchema";
import { SCREENING_SETTINGS } from "@/lib/utils/careerConstants";

import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/Card/card";
import { Textarea } from "@/lib/components/ui/Textarea/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/components/ui/Tooltip/tooltip";
import { GlimmerGradient } from "@/lib/icons";
import "@/lib/styles/forms/career-step-two.scss";

export default function CVScreeningCard() {
  const { control } = useFormContext<CareerFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. CV Review Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {/* CV Screening */}
          <Controller
            name="cvScreeningSetting"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cv-screening-select">CV Screening</FieldLabel>
                <FieldDescription>
                  Jia automatically endorses candidates who meet the chosen criteria.
                </FieldDescription>
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="cv-screening-select"
                    aria-invalid={fieldState.invalid}
                    className="career-step-two__select-trigger"
                  >
                    <SelectValue placeholder="Select CV Screening Setting" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCREENING_SETTINGS.map((setting) => (
                      <SelectItem key={setting.label} value={setting.label}>
                        <i className={setting.icon}></i>
                        {setting.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <FieldSeparator />
          {/* CV Secret Prompt */}
          <Controller
            name="cvSecretPrompt"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="d-flex align-items-center">
                  <GlimmerGradient />
                  <FieldLabel htmlFor="cv-secret-prompt" className="mx-2">
                    CV Secret Prompt
                  </FieldLabel>
                  <span className="career-step-two__muted">(optional)</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <i className="la la-question-circle ml-2 career-step-two__icon"></i>
                    </TooltipTrigger>
                    <TooltipContent>
                      These prompts remain hidden from candidates and the public job portal.
                      <br />
                      Additionally, only Admins and the Job Owner can view the secret prompt.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FieldDescription>
                  Secret Prompts give you extra control over Jia’s evaluation style, complementing
                  her accurate assessment of requirements from the job description.
                </FieldDescription>
                <Textarea
                  id="cv-secret-prompt"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter a secret prompt (e.g. Give higher fit scores to candidates who participate in hackathons or competitions.)"
                  {...field}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
