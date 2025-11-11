import { useRouter } from "next/navigation";

import CareerLink from "@/lib/components/CareerComponents/CareerLink";
import DirectInterviewLinkV2 from "@/lib/components/CareerComponents/DirectInterviewLinkV2";
import AdvancedSettings from "@/lib/components/CareerComponents/new/AdvancedSettings";
import AIInterviewSetup from "@/lib/components/CareerComponents/new/results/AIInterviewSetup";
import CareerDetails from "@/lib/components/CareerComponents/new/results/CareerDetails";
import CVReview from "@/lib/components/CareerComponents/new/results/CVReview";
import { Accordion } from "@/lib/components/ui/Accordion/accordion";
import { steps } from "@/lib/config/career/steps";
import "@/lib/styles/career/job-description.scss";
import { Career } from "@/types";

interface JobDescriptionProps extends Career {
  onEditClick?: (stepIndex: number) => void;
}

export default function JobDescription({ onEditClick, ...career }: JobDescriptionProps) {
  const router = useRouter();

  function handleEditClick(stepIndex: number) {
    const searchParams = new URLSearchParams({
      step: stepIndex.toString(),
    });
    router.push(`/recruiter-dashboard/careers/edit-career/${career.id}?${searchParams.toString()}`);
  }

  return (
    <div className="job-description">
      <Accordion
        type="multiple"
        defaultValue={steps.map((step) => step.label)}
        className="job-description__accordion"
      >
        <CareerDetails {...career} onEditClick={() => handleEditClick(0)} />
        <CVReview {...career} onEditClick={() => handleEditClick(1)} />
        <AIInterviewSetup {...career} onEditClick={() => handleEditClick(2)} />
      </Accordion>
      <div className="job-description__sidebar">
        <CareerLink career={career} />
        <DirectInterviewLinkV2 career={career} />
        <AdvancedSettings careerId={career.id} />
      </div>
    </div>
  );
}
