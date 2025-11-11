import CVScreeningCard from "@/lib/components/CareerComponents/new/step-2/CVScreeningCard";
import PreScreeningQuestionsCard from "@/lib/components/CareerComponents/new/step-2/PreScreeningQuestionsCard";
import "@/lib/styles/career/career-step-two.scss";

export default function CareerStepTwoForm() {
  return (
    <div className="career-step-two">
      <CVScreeningCard />
      <PreScreeningQuestionsCard />
    </div>
  );
}
