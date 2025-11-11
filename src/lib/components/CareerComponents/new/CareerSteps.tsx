import { steps } from "@/lib/config/career/steps";
import { StepCircle, StepCompleted, StepError } from "@/lib/icons";
import "@/lib/styles/career/career-steps.scss";

interface CareerStepsProps {
  currentStep: number;
  highestStep: number;
  hasError: boolean;
  onStepClick?: (stepIndex: number) => void;
}

export default function CareerSteps({
  currentStep,
  highestStep,
  hasError,
  onStepClick,
}: CareerStepsProps) {
  function getStepIcon(index: number) {
    // Current step with error
    if (hasError && highestStep === index) {
      return <StepError className="career-steps__icon--error" />;
    }

    // Completed steps
    if (index < highestStep) {
      return <StepCompleted className="career-steps__icon--completed" />;
    }

    // Current or future steps
    return (
      <StepCircle
        className={"career-steps__icon--circle" + (index === highestStep ? " active" : "")}
      />
    );
  }

  function getLineState(index: number) {
    // Completed: step before this line is completed
    if (index < highestStep) {
      return "completed";
    }
    // In progress: currently on the step before this line
    if (index === highestStep) {
      return "in-progress";
    }
    // Not started
    return "not-started";
  }

  return (
    <div className="career-steps">
      {steps.map(({ label }, index) => (
        <div key={label} className="career-steps__step">
          <div className="career-steps__top">
            <div
              className={"career-steps__icon " + (currentStep === index ? "active" : "")}
              onClick={() => onStepClick?.(index)}
            >
              {getStepIcon(index)}
            </div>
            {index < steps.length - 1 && (
              <div className="career-steps__line-wrapper">
                <div className="career-steps__line" />
                {!(hasError && index === highestStep) && (
                  <div className="career-steps__line-progress" data-state={getLineState(index)} />
                )}
              </div>
            )}
          </div>
          <div className="career-steps__label">{label}</div>
        </div>
      ))}
    </div>
  );
}
