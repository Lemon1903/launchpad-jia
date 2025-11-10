import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import CareerSteps from "@/lib/components/CareerComponents/new/CareerSteps";
import TipsCard from "@/lib/components/CareerComponents/new/TipsCard";
import { Button } from "@/lib/components/ui/Button/button";
import { Separator } from "@/lib/components/ui/Separator/separator";
import { sampleFSJuniorDeveloper } from "@/lib/config/career/sampleDefaultValues";
import { steps } from "@/lib/config/career/steps";
import { careerFormSchema, CareerFormValues } from "@/lib/schemas/careerFormSchema";
import "@/lib/styles/forms/career-form.scss";
import { removeEmptyFields } from "@/lib/utils/helpers";

export default function CareerForm() {
  const form = useForm({
    resolver: zodResolver(careerFormSchema),
    defaultValues: sampleFSJuniorDeveloper,
    // defaultValues: {
    //   title: "",
    //   description: "",
    //   employmentType: "Full-Time",
    //   arrangement: "",
    //   country: "Philippines",
    //   province: "",
    //   city: "",
    //   salaryNegotiable: false,
    //   salaryMin: "",
    //   salaryMax: "",
    //   cvScreeningSetting: "Good Fit and Above",
    //   preScreeningQuestions: [],
    //   aiScreeningSetting: "Good Fit and Above",
    //   videoRequired: false,
    //   questions: aiQuestions,
    // },
  });

  const {
    trigger,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = form;

  // Will fetch step from API if draft exist else start from 0
  const [currentStep, setCurrentStep] = useState(0);
  const [highestStepReached, setHighestStepReached] = useState(currentStep);
  const highestStepHasErrors = steps[highestStepReached]?.fields.some((field) => !!errors[field]);
  const StepFormComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;

  function confirmSaveCareer(status: string, data?: Partial<CareerFormValues>) {
    console.log("Persist career:", { status, data });
    clearErrors();
    // TODO: API call
  }

  // Prevent jumping to future uncompleted steps
  // User must complete current step first
  async function onStepClick(stepIndex: number) {
    // Allow clicking on current step (no-op but allowed)
    if (stepIndex === currentStep) return;

    // Allow going back to any completed step (up to highestStepReached)
    if (stepIndex <= highestStepReached) {
      setCurrentStep(stepIndex);
      return;
    }
  }

  // Save & Continue (validate only current step fields)
  async function onContinue() {
    const valid = await trigger(steps[currentStep].fields);

    // if has errors, do not proceed and make it the highest step reached
    if (!valid) {
      console.error("Validation errors:", errors);
      setHighestStepReached(currentStep);
      return;
    }

    console.log("Current form values:", getValues());

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    // Update highest step reached
    if (nextStep > highestStepReached) {
      setHighestStepReached(nextStep);
    }
  }

  // Save as Draft (validate only filled fields; ignore empty required)
  async function onSaveDraft() {
    const values = getValues();
    console.log("Draft raw values:", values);

    // remove empty fields so Zod treats them as truly absent (not just empty strings)
    const filledValues = removeEmptyFields(values, 1);
    console.log("Draft filled values:", filledValues);
    // const valuesWithUndefined = emptyStringsToUndefined(values);
    // console.log("Draft values with undefined:", valuesWithUndefined);
    // makes all fields optional
    const partialSchema = careerFormSchema.partial();
    const result = partialSchema.safeParse(filledValues);

    if (!result.success) {
      console.error("Draft validation errors:", result.error.issues);
      // Set errors for invalid filled fields
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path.join(".") as keyof CareerFormValues;
        setError(fieldName, { message: issue.message });
      });
      return;
    }

    confirmSaveCareer("draft", result.data);
  }

  // Unified submit handler: detect which submit button triggered the event
  // This only runs for PUBLISH/UNPUBLISH buttons (last step, full validation)
  function onSubmit(data: CareerFormValues, e?: React.BaseSyntheticEvent) {
    const submitter = (e?.nativeEvent as SubmitEvent | undefined)?.submitter as
      | HTMLButtonElement
      | undefined;
    const action = submitter?.value as "publish" | "unpublish" | undefined;

    console.log("Submit action:", action);

    // Check if action is defined
    if (!action) return;

    // Last step: decide between publish vs unpublish
    return confirmSaveCareer(action === "publish" ? "active" : "inactive", data);
  }

  return (
    <FormProvider {...form}>
      <form
        className="career-form"
        onSubmit={isLastStep ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
      >
        <div className="career-form__header">
          <h1 className="career-form__heading">Add new career</h1>
          <div className="career-form__actions">
            {isLastStep ? (
              <Fragment>
                <Button
                  variant="outline"
                  type="submit"
                  name="action"
                  value="unpublish"
                  disabled={isSubmitting}
                >
                  Save as Unpublished
                </Button>
                <Button type="submit" name="action" value="publish" disabled={isSubmitting}>
                  <i className="career-form__button__icon la la-check-circle"></i>
                  Publish
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                <Button variant="outline" type="button" onClick={onSaveDraft}>
                  Save as Draft
                </Button>
                <Button type="button" disabled={isSubmitting} onClick={onContinue}>
                  Save and Continue
                </Button>
              </Fragment>
            )}
          </div>
        </div>
        <CareerSteps
          currentStep={currentStep}
          highestStep={highestStepReached}
          hasError={highestStepHasErrors}
          onStepClick={onStepClick}
        />
        <Separator className="career-form__separator" />
        <div className="career-form__content">
          <div className="career-form__main">
            <StepFormComponent onStepClick={onStepClick} />
          </div>
          {steps[currentStep].tips && <TipsCard tips={steps[currentStep].tips} />}
        </div>
      </form>
    </FormProvider>
  );
}
