import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/ui/Accordion/accordion";
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
import { steps } from "@/lib/config/career/steps";
import { CareerFormValues } from "@/lib/schemas/careerFormSchema";
import "@/lib/styles/career/results.scss";

interface CareerDetailsProps extends Partial<CareerFormValues> {
  onEditClick: () => void;
}

export default function CareerDetails({ onEditClick, ...careerData }: CareerDetailsProps) {
  return (
    <AccordionItem value={steps[0].label}>
      <Card>
        <CardHeader>
          <CardTitle>
            <AccordionTrigger />
            <span>Career Details & Team Access</span>
          </CardTitle>
          <CardAction>
            <Button variant="outline" size="icon-sm" onClick={onEditClick}>
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
                <FieldContent>{careerData?.jobTitle || "--"}</FieldContent>
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
                  <FieldContent>{careerData?.employmentType || "--"}</FieldContent>
                </Field>
                <Field className="career-form-results__field">
                  <FieldLabel>Work Arrangement</FieldLabel>
                  <FieldContent>{careerData?.workSetup || "--"}</FieldContent>
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
                  <FieldContent>{careerData?.country || "--"}</FieldContent>
                </Field>
                <Field className="career-form-results__field">
                  <FieldLabel>State / Province</FieldLabel>
                  <FieldContent>{careerData?.province || "--"}</FieldContent>
                </Field>
                <Field className="career-form-results__field">
                  <FieldLabel>City</FieldLabel>
                  <FieldContent>{careerData?.location || "--"}</FieldContent>
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
                    {careerData.salaryNegotiable ? "Negotiable" : careerData?.minimumSalary || "--"}
                  </FieldContent>
                </Field>
                <Field className="career-form-results__field">
                  <FieldLabel>Maximum Salary</FieldLabel>
                  <FieldContent>
                    {careerData.salaryNegotiable ? "Negotiable" : careerData?.maximumSalary || "--"}
                  </FieldContent>
                </Field>
              </FieldGroup>
              <FieldSeparator />
              {/* Job Description */}
              <FieldGroup className="career-form-results__field-group">
                <Field className="career-form-results__field">
                  <FieldLabel>Job Description</FieldLabel>
                  <FieldContent
                    dangerouslySetInnerHTML={{ __html: careerData?.description || "No job description added." }}
                  />
                </Field>
              </FieldGroup>
            </FieldGroup>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
