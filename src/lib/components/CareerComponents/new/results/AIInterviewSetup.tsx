import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/ui/Accordion/accordion";
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
import { steps } from "@/lib/config/career/steps";
import { GlimmerGradient } from "@/lib/icons";
import { CareerFormValues } from "@/lib/schemas/careerFormSchema";
import "@/lib/styles/career/results.scss";
import { ScreeningSetting } from "@/lib/utils/careerConstants";

interface AIInterviewSetupProps extends Partial<CareerFormValues> {
  onEditClick: () => void;
}

export default function AIInterviewSetup({ onEditClick, ...careerData }: AIInterviewSetupProps) {
  function getTotalQuestions(): number {
    if (!careerData?.questions) return 0;
    return careerData.questions.reduce((acc, cat) => acc + cat.questions.length, 0);
  }

  return (
    <AccordionItem value={steps[2].label}>
      <Card>
        <CardHeader>
          <CardTitle>
            <AccordionTrigger />
            <span>AI Interview Setup</span>
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
                <FieldLabel>AI Interview Screening</FieldLabel>
                <FieldContent className="career-form-results__field-content">
                  {getScreeningDescription(careerData?.aiScreeningSetting)}
                </FieldContent>
              </Field>
              <FieldSeparator />
              {/* Second Row */}
              <Field
                className="career-form-results__field align-items-center"
                orientation="horizontal"
              >
                <FieldLabel>Require Video on Interview</FieldLabel>
                <FieldContent>
                  {careerData?.requireVideo ? (
                    <span className="d-flex align-items-center justify-content-end">
                      Yes
                      <Badge className="career-form-results__badge ml-2">
                        <i className="la la-check"></i>
                      </Badge>
                    </span>
                  ) : (
                    <span className="d-flex align-items-center justify-content-end">
                      No
                      <Badge className="career-form-results__badge ml-2" variant="destructive">
                        <i className="la la-times"></i>
                      </Badge>
                    </span>
                  )}
                </FieldContent>
              </Field>
              <FieldSeparator />
              {/* Third Row */}
              <Field className="career-form-results__field">
                <FieldLabel>
                  <GlimmerGradient /> AI Secret Prompt
                </FieldLabel>
                <FieldContent>
                  {careerData.aiSecretPrompt || "No AI secret prompt added."}
                </FieldContent>
              </Field>
              <FieldSeparator />
              {/* Fourth Row */}
              <Field className="career-form-results__field">
                <FieldLabel>
                  Interview Questions <Badge variant="accent">{getTotalQuestions()}</Badge>
                </FieldLabel>
                <FieldContent>
                  {getTotalQuestions() > 0 ? (
                    <ol className="career-form-results__question-list">
                      {careerData?.questions?.map(
                        (q, catIndex) =>
                          q.questions.length > 0 && (
                            <div key={catIndex} className="career-form-results__question-group">
                              <span className="career-form-results__question-category">
                                {q.category}
                              </span>
                              {q.questions.map((question, questionIndex) => (
                                <li key={questionIndex}>{question.question}</li>
                              ))}
                            </div>
                          ),
                      )}
                    </ol>
                  ) : (
                    <em>No interview questions added.</em>
                  )}
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}

function getScreeningDescription(screening?: ScreeningSetting) {
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
      return "Not specified.";
  }
}
