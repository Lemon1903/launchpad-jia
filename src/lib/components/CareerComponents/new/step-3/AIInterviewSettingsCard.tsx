"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/Card/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/lib/components/ui/Field/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/Select/select";
import { Switch } from "@/lib/components/ui/Switch/switch";
import { Textarea } from "@/lib/components/ui/Textarea/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/components/ui/Tooltip/tooltip";
import { GlimmerGradient } from "@/lib/icons";
import { CareerFormValues } from "@/lib/schemas/careerFormSchema";
import { SCREENING_SETTINGS } from "@/lib/utils/careerConstants";

export default function AIInterviewSettingsCard() {
  const { control } = useFormContext<CareerFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. AI Interview Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {/* CV Screening */}
          <Controller
            name="aiScreeningSetting"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cv-screening-select">AI Interview Screening</FieldLabel>
                <FieldDescription>
                  Jia automatically endorses candidates who meet the chosen criteria.
                </FieldDescription>
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="cv-screening-select"
                    aria-invalid={fieldState.invalid}
                    className="career-step-three__select-trigger"
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
          {/* Require Viedeo */}
          <Controller
            name="requireVideo"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldSet>
                  <FieldLegend>Require Video on Interview</FieldLegend>
                  <FieldDescription>
                    Require candidates to keep their camera on. Recordings will appear on their
                    analysis page.
                  </FieldDescription>
                  <Field orientation="horizontal" className="career-step-three__checkbox-field">
                    <div className="career-step-three__checkbox-label">
                      <i className="la la-video"></i>
                      <FieldLabel htmlFor="video-required-select">
                        Require Video Interview
                      </FieldLabel>
                    </div>
                    <Switch
                      id="video-required-select"
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                </FieldSet>
              </Field>
            )}
          />
          <FieldSeparator />
          {/* CV Secret Prompt */}
          <Controller
            name="aiSecretPrompt"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="d-flex align-items-center">
                  <GlimmerGradient />
                  <FieldLabel htmlFor="cv-secret-prompt" className="mx-2">
                    AI Interview Secret Prompt
                  </FieldLabel>
                  <span className="career-step-three__muted">(optional)</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <i className="la la-question-circle ml-2 career-step-three__icon"></i>
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
                  id="ai-secret-prompt"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter a secret prompt (e.g. Treat candidates who speak in Taglish, English, or Tagalog equally. Focus on clarity, coherence, and confidence rather than language preference or accent.)"
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
