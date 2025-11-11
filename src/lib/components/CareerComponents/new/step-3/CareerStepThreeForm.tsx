import AIInterviewQuestionsCard from "@/lib/components/CareerComponents/new/step-3/AIInterviewQuestionsCard";
import AIInterviewSettingsCard from "@/lib/components/CareerComponents/new/step-3/AIInterviewSettingsCard";
import "@/lib/styles/career/career-step-three.scss";

export default function CareerStepThreeForm() {
  return (
    <div className="career-step-three">
      <AIInterviewSettingsCard />
      <AIInterviewQuestionsCard />
    </div>
  );
}
