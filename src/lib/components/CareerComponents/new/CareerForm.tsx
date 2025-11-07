import CareerStepOneForm from "@/lib/components/CareerComponents/new/CareerStepOneForm";
import CareerSteps from "@/lib/components/CareerComponents/new/CareerSteps";
import TipsCard from "@/lib/components/CareerComponents/new/TipsCard";
import { Separator } from "@/lib/components/ui/Separator/separator";
import "@/lib/styles/forms/career-form.scss";

export default function CareerForm() {
  const isFormValid = () => false; // Replace with your actual validation
  const isSavingCareer = false; // Replace with your actual state

  function confirmSaveCareer(status: string) {
    console.log("Saving career as:", status);
  }

  const isDisabled = !isFormValid() || isSavingCareer;

  return (
    <div className="career-form">
      <div className="career-form__header">
        <h1 className="career-form__heading">Add new career</h1>
        <div className="career-form__actions">
          <button
            disabled={isDisabled}
            className={`career-form__button career-form__button--unpublished`}
            onClick={() => confirmSaveCareer("inactive")}
          >
            Save as Unpublished
          </button>
          <button
            disabled={isDisabled}
            className={`career-form__button career-form__button--published`}
            onClick={() => confirmSaveCareer("active")}
          >
            <i className="career-form__button__icon la la-check-circle"></i>
            Save as Published
          </button>
        </div>
      </div>
      <CareerSteps />
      <Separator className="career-form__separator" />
      <div className="career-form__content">
        <div className="career-form__main">
          <CareerStepOneForm />
        </div>
        <TipsCard
          tips={[
            {
              emphasis: "Use clear, standard job titles",
              text: "for better searchability (e.g., “Software Engineer” instead of “Code Ninja” or “Tech Rockstar”).",
            },
            {
              emphasis: "Avoid abbreviations",
              text: "or internal role codes that applicants may not understand (e.g., use “QA Engineer” instead of “QE II” or “QA-TL”).",
            },
            {
              emphasis: "Keep it concise",
              text: "– job titles should be no more than a few words (2–4 max), avoiding fluff or marketing terms.",
            },
          ]}
        />
      </div>
    </div>
  );
}
