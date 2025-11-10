import AIInterviewSetup from "@/lib/components/CareerComponents/new/results/AIInterviewSetup";
import CareerDetails from "@/lib/components/CareerComponents/new/results/CareerDetails";
import CVReview from "@/lib/components/CareerComponents/new/results/CVReview";
import { Accordion, AccordionItem } from "@/lib/components/ui/Accordion/accordion";
import { StepProps } from "@/lib/config/career/steps";
import "@/lib/styles/forms/results.scss";

export default function CareerFormResults({ onStepClick }: StepProps) {
  return (
    <div className="career-form-results">
      <Accordion
        type="multiple"
        defaultValue={["career-details", "cv-review", "ai-interview-setup"]}
      >
        <AccordionItem value="career-details">
          <CareerDetails onStepClick={() => onStepClick?.(0)} />
        </AccordionItem>
        <AccordionItem value="cv-review">
          <CVReview onStepClick={() => onStepClick?.(1)} />
        </AccordionItem>
        <AccordionItem value="ai-interview-setup">
          <AIInterviewSetup onStepClick={() => onStepClick?.(2)} />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
