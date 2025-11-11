"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/lib/components/ui/Button/button";
import { Field, FieldError, FieldLabel } from "@/lib/components/ui/Field/field";
import { Input } from "@/lib/components/ui/Input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/Select/select";
import { Textarea } from "@/lib/components/ui/Textarea/textarea";
import { PreScreeningQuestion } from "@/lib/schemas/cvScreeningSchema";

import SalaryInput from "@/lib/components/CareerComponents/new/SalaryInput";
import { salarySchema } from "@/lib/schemas/salarySchema";
import styles from "@/lib/styles/screens/uploadCV.module.scss";

// Create dynamic schema based on questions
function createPreScreeningSchema(questions: PreScreeningQuestion[]) {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  questions.forEach((question) => {
    const key = `question_${question.id}`;

    switch (question.type) {
      case "short-answer":
      case "long-answer":
        schemaShape[key] = z.string().min(1, "This field is required");
        break;
      case "dropdown":
        schemaShape[key] = z.string().min(1, "Please select an option");
        break;
      case "checkbox":
        schemaShape[key] = z.array(z.string()).min(1, "Please select at least one option");
        break;
      case "range":
        schemaShape[key] = salarySchema;
        break;
    }
  });

  return z.object(schemaShape);
}

type PreScreeningFormProps = {
  questions: PreScreeningQuestion[];
  onSubmit: (answers: Record<string, any>) => void;
  isSubmitting?: boolean;
};

export default function PreScreeningForm({
  questions,
  onSubmit,
  isSubmitting = false,
}: PreScreeningFormProps) {
  const schema = createPreScreeningSchema(questions);
  type FormValues = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: questions.reduce(
      (acc, question) => {
        const key = `question_${question.id}`;
        if (question.type === "checkbox") {
          acc[key] = [];
        } else if (question.type === "range") {
          acc[key] = { minimumSalary: 0, maximumSalary: 0 };
        } else {
          acc[key] = "";
        }
        return acc;
      },
      {} as Record<string, any>,
    ),
  });

  const onFormSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <form className={styles.preScreeningForm} onSubmit={handleSubmit(onFormSubmit)}>
      <div className={styles.cvDetailsContainer}>
        {questions.map((question, index) => {
          const fieldKey = `question_${question.id}`;

          return (
            <div key={question.id} className={styles.gradient}>
              <div className={styles.cvDetailsCard}>
                <span className={styles.sectionTitle}>
                  {index + 1}. {question.question}
                </span>
                <div className={styles.detailsContainer}>
                  {question.type === "short-answer" && (
                    <Controller
                      name={fieldKey as any}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          {/* @ts-ignore */}
                          <Input
                            {...field}
                            placeholder="Enter your answer"
                            aria-invalid={fieldState.invalid}
                            className={[styles.input, styles.pl_14].join(" ")}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  )}

                  {question.type === "long-answer" && (
                    <Controller
                      name={fieldKey as any}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          {/* @ts-ignore */}
                          <Textarea
                            {...field}
                            placeholder="Enter your answer"
                            rows={4}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  )}

                  {question.type === "dropdown" && (
                    <Controller
                      name={fieldKey as any}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          {/* @ts-ignore */}
                          <Select
                            name={field.name}
                            value={field.value as string}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              aria-invalid={fieldState.invalid}
                              className={`${styles.selectTrigger}`}
                            >
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              {question.options?.map((option, optIndex) => (
                                <SelectItem key={optIndex} value={option.value}>
                                  {option.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  )}

                  {question.type === "checkbox" && (
                    <Controller
                      name={fieldKey as any}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className={styles.checkboxField}>
                          {question.options?.map((option, optIndex) => (
                            <FieldLabel key={optIndex} className={styles.check}>
                              {/* @ts-ignore */}
                              <input
                                type="checkbox"
                                value={option.value}
                                checked={(field.value as string[])?.includes(option.value)}
                                onChange={(e) => {
                                  const currentValue = field.value as string[] || [];
                                  const newValue = e.target.checked
                                    ? [...currentValue, option.value]
                                    : currentValue.filter((v: string) => v !== option.value);
                                  field.onChange(newValue);
                                }}
                              />
                              <span>{option.value}</span>
                            </FieldLabel>
                          ))}
                        </Field>
                      )}
                    />
                  )}

                  {question.type === "range" && (
                    <div className={styles.rangeInputContainer}>
                      <Controller
                        name={`${fieldKey}.minimumSalary` as any}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="cv-upl-min-salary">Minimum Salary</FieldLabel>
                            {/* @ts-ignore */}
                            <SalaryInput
                              {...field}
                              id="cv-upl-min-salary"
                              type="number"
                              placeholder="Min"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              aria-invalid={fieldState.invalid}
                              className={styles.input}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        name={`${fieldKey}.maximumSalary` as any}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="cv-upl-max-salary">Maximum Salary</FieldLabel>
                            {/* @ts-ignore */}
                            <SalaryInput
                              {...field}
                              id="cv-upl-max-salary"
                              type="number"
                              placeholder="Max"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              aria-invalid={fieldState.invalid}
                              className={styles.input}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button type="submit" disabled={isSubmitting} className={styles.continueButton}>
        Continue
      </Button>
    </form>
  );
}
