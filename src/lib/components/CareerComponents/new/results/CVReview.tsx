import { useFormContext } from "react-hook-form";

import { AccordionContent, AccordionTrigger } from "@/lib/components/ui/Accordion/accordion";
import { Badge } from "@/lib/components/ui/Badge/badge";
import { Button } from "@/lib/components/ui/Button/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/Card/card";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/lib/components/ui/Field/field";
import { GlimmerGradient } from "@/lib/icons";
import { CareerFormValues } from "@/lib/schemas/careerFormSchema";
import "@/lib/styles/forms/results.scss";
import { ScreeningSetting } from "@/lib/utils/careerConstants";

function getScreeningDescription(screening: ScreeningSetting) {
  switch (screening) {
    case "Only Strong Fit":
      return (
        <>
          Automatically endorse candidates who are <Badge>Strong Fit</Badge>
        </>
      );
    case "Good Fit and Above":
      return (
        <>
          Automatically endorse candidates who are <Badge variant="secondary">Good Fit</Badge> and
          above
        </>
      );
    case "No Automatic Promotion":
      return "Do not automatically endorse candidates";
    default:
      return null;
  }
}

export default function CVReview({ onStepClick }: { onStepClick: () => void }) {
  const { getValues } = useFormContext<CareerFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <AccordionTrigger />
          <span>CV Review & Pre-Screening Questions</span>
        </CardTitle>
        <CardAction>
          <Button variant="outline" size="icon-sm" onClick={onStepClick}>
            <i className="la la-pencil"></i>
          </Button>
        </CardAction>
      </CardHeader>
      <AccordionContent>
        <CardContent>
          <FieldGroup className="career-form-results__field-group">
            {/* First Row */}
            <Field className="career-form-results__field">
              <FieldLabel>CV Screening</FieldLabel>
              <FieldContent className="career-form-results__field-content">
                {getScreeningDescription(getValues().cvScreeningSetting)}
              </FieldContent>
            </Field>
            <FieldSeparator />
            {/* Second Row */}
            <Field className="career-form-results__field">
              <FieldLabel>
                <GlimmerGradient /> CV Secret Prompt
              </FieldLabel>
              <FieldContent>{getValues().cvSecretPrompt}</FieldContent>
            </Field>
            <FieldSeparator />
            {/* Third Row */}
            <Field>
              <FieldLabel>
                Pre-Screening Questions{" "}
                <Badge variant="accent">{getValues().preScreeningQuestions.length}</Badge>
              </FieldLabel>
              <FieldContent>
                {getValues().preScreeningQuestions.length > 0 ? (
                  <ol className="career-form-results__pre-screening-questions">
                    {getValues().preScreeningQuestions.map((q, index) => (
                      <li key={index}>
                        {q.type === "dropdown" || q.type === "checkbox" ? (
                          <>
                            <span>{q.question}</span>
                            <ul className="career-form-results__pre-screening-options">
                              {q.options.map((option) => (
                                <li key={option.value}>{option.value}</li>
                              ))}
                            </ul>
                          </>
                        ) : q.type === "range" ? (
                          <div className="career-form-results__pre-screening-range">
                            Preferred: PHP {q.minimumSalary} - PHP {q.maximumSalary}
                          </div>
                        ) : (
                          <span>{q.question}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <em>No pre-screening questions added.</em>
                )}
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
      </AccordionContent>
    </Card>
  );
}
