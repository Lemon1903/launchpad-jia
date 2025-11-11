import { useFormContext } from "react-hook-form";

import AIInterviewSetup from "@/lib/components/CareerComponents/new/results/AIInterviewSetup";
import CareerDetails from "@/lib/components/CareerComponents/new/results/CareerDetails";
import CVReview from "@/lib/components/CareerComponents/new/results/CVReview";
import { Accordion } from "@/lib/components/ui/Accordion/accordion";
import { StepProps, steps } from "@/lib/config/career/steps";
import { CareerFormValues } from "@/lib/schemas/careerFormSchema";
import "@/lib/styles/career/results.scss";

export default function CareerFormResults({ onStepClick }: StepProps) {
  const { getValues } = useFormContext<CareerFormValues>();

  return (
    <div className="career-form-results">
      <Accordion type="multiple" defaultValue={steps.map((step) => step.label)}>
        <CareerDetails {...getValues()} onEditClick={() => onStepClick?.(0)} />
        <CVReview {...getValues()} onEditClick={() => onStepClick?.(1)} />
        <AIInterviewSetup {...getValues()} onEditClick={() => onStepClick?.(2)} />
      </Accordion>
    </div>
  );
}
