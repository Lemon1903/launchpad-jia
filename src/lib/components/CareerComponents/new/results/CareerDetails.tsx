import { useFormContext } from "react-hook-form";

import { AccordionContent, AccordionTrigger } from "@/lib/components/ui/Accordion/accordion";
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
import { CareerFormValues } from "@/lib/schemas/careerFormSchema";
import "@/lib/styles/forms/results.scss";

export default function CareerDetails({ onStepClick }: { onStepClick: () => void }) {
  const { getValues } = useFormContext<CareerFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <AccordionTrigger />
          <span>Career Details & Team Access</span>
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
              <FieldLabel>Job Title</FieldLabel>
              <FieldContent>{getValues().jobTitle}</FieldContent>
            </Field>
            <FieldSeparator />
            {/* Second Row */}
            <FieldGroup
              className="career-form-results__field-group"
              data-orientation="horizontal"
              data-columns="3"
            >
              <Field className="career-form-results__field">
                <FieldLabel>Employment Type</FieldLabel>
                <FieldContent>{getValues().employmentType}</FieldContent>
              </Field>
              <Field className="career-form-results__field">
                <FieldLabel>Work Arrangement</FieldLabel>
                <FieldContent>{getValues().workSetup}</FieldContent>
              </Field>
            </FieldGroup>
            <FieldSeparator />
            {/* Third Row */}
            <FieldGroup
              className="career-form-results__field-group"
              data-orientation="horizontal"
              data-columns="3"
            >
              <Field className="career-form-results__field">
                <FieldLabel>Country</FieldLabel>
                <FieldContent>{getValues().country}</FieldContent>
              </Field>
              <Field className="career-form-results__field">
                <FieldLabel>State / Province</FieldLabel>
                <FieldContent>{getValues().province}</FieldContent>
              </Field>
              <Field className="career-form-results__field">
                <FieldLabel>City</FieldLabel>
                <FieldContent>{getValues().location}</FieldContent>
              </Field>
            </FieldGroup>
            <FieldSeparator />
            {/* Fourth Row */}
            <FieldGroup
              className="career-form-results__field-group"
              data-orientation="horizontal"
              data-columns="3"
            >
              <Field className="career-form-results__field">
                <FieldLabel>Minimum Salary</FieldLabel>
                <FieldContent>
                  {getValues().salaryNegotiable ? "Negotiable" : getValues().minimumSalary}
                </FieldContent>
              </Field>
              <Field className="career-form-results__field">
                <FieldLabel>Maximum Salary</FieldLabel>
                <FieldContent>
                  {getValues().salaryNegotiable ? "Negotiable" : getValues().maximumSalary}
                </FieldContent>
              </Field>
            </FieldGroup>
            <FieldSeparator />
            {/* Job Description */}
            <FieldGroup className="career-form-results__field-group">
              <Field className="career-form-results__field">
                <FieldLabel>Job Description</FieldLabel>
                <FieldContent dangerouslySetInnerHTML={{ __html: getValues().description }} />
              </Field>
            </FieldGroup>
          </FieldGroup>
        </CardContent>
      </AccordionContent>
    </Card>
  );
}
