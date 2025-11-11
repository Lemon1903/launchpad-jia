import CareerInformationCard from "@/lib/components/CareerComponents/new/step-1/CareerInformationCard";
import JobDescriptionCard from "@/lib/components/CareerComponents/new/step-1/JobDescriptionCard";
import "@/lib/styles/career/career-step-one.scss";

export default function CareerStepOneForm() {
  return (
    <div className="career-step-one">
      <CareerInformationCard />
      <JobDescriptionCard />
      {/* <TeamAccessCard /> */}
    </div>
  );
}
