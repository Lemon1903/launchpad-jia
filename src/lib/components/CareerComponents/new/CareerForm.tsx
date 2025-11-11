"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { CareerResponse, createCareer, updateCareer } from "@/lib/api";
import CareerSteps from "@/lib/components/CareerComponents/new/CareerSteps";
import TipsCard from "@/lib/components/CareerComponents/new/TipsCard";
import { Button } from "@/lib/components/ui/Button/button";
import { Separator } from "@/lib/components/ui/Separator/separator";
import { defaultCareerFormValues } from "@/lib/config/career/careerFormDefaultValues";
import { steps } from "@/lib/config/career/steps";
import { useAppContext } from "@/lib/context/AppContext";
import { careerFormSchema, CareerFormValues } from "@/lib/schemas/careerFormSchema";
import "@/lib/styles/career/career-form.scss";
import { errorToast, successToast } from "@/lib/Utils";
import { removeEmptyFields } from "@/lib/utils/helpers";
import { Career, CareerStatus } from "@/types";

interface CareerFormProps {
  existingCareer?: Career;
  step?: number | null;
}

export default function CareerForm({ existingCareer, step }: CareerFormProps) {
  const { user, orgID } = useAppContext();
  const router = useRouter();

  const form = useForm<CareerFormValues>({
    resolver: zodResolver(careerFormSchema) as any,
    defaultValues: existingCareer || defaultCareerFormValues,
  });

  const {
    trigger,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { isSubmitting, errors, dirtyFields },
  } = form;

  // Determine initial step to start on
  let stepToStart = 0;
  if (step && existingCareer) {
    stepToStart = Math.min(step, existingCareer.step);
  }

  const [currentStep, setCurrentStep] = useState(stepToStart);
  const [highestStepReached, setHighestStepReached] = useState(existingCareer?.step ?? currentStep);
  const [isSaving, setIsSaving] = useState(false);

  // Track the career ID - starts with existingCareer?.id, or gets set after first save
  const [careerId, setCareerId] = useState(existingCareer?.id);

  const highestStepHasErrors = steps[highestStepReached]?.fields.some((field) => !!errors[field]);
  const StepFormComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;

  // Check if current step fields have changed using dirtyFields
  function hasCurrentStepChanged(): boolean {
    const currentStepFields = steps[currentStep].fields;

    // Check if any field in the current step is marked as dirty
    return currentStepFields.some((field) => {
      // dirtyFields can have nested structure, so we need to check if the field exists
      return dirtyFields[field] !== undefined;
    });
  }

  async function confirmSaveCareer(status: CareerStatus, data?: Partial<CareerFormValues>) {
    setIsSaving(true);
    try {
      console.log("Saving career:", { status, data, careerId });

      if (!user || !orgID) {
        throw new Error("User not authenticated or organization not selected");
      }

      let result: CareerResponse;

      // If careerId exists, update the existing career
      if (careerId) {
        result = await updateCareer(careerId, {
          ...data,
          status,
          step: Math.min(currentStep + 1, steps.length - 1),
          lastEditedBy: user,
        });
      } else {
        // First save: create new career
        result = await createCareer({
          ...data,
          status,
          step: Math.min(currentStep + 1, steps.length - 1),
          orgID,
          createdBy: user,
          lastEditedBy: user,
        });

        // Store the career ID for subsequent saves
        if (!careerId) {
          setCareerId(result.career.id);
        }
      }

      console.log("Career saved successfully:", result);
      clearErrors();

      // Reset form with current values to mark all fields as "not dirty"
      // This makes dirtyFields track changes from this saved state going forward
      reset(getValues(), { keepValues: true });

      // Show success message based on status
      const isUpdate = !!careerId;
      if (status === "draft") {
        successToast(isUpdate ? "Draft updated successfully!" : "Draft saved successfully!", 2000);
      } else if (status === "active") {
        successToast(
          isUpdate ? "Career updated and published!" : "Career published successfully!",
          2000,
        );
      } else if (status === "inactive") {
        successToast(
          isUpdate ? "Career updated as unpublished!" : "Career saved as unpublished!",
          2000,
        );
      }

      // If new career created, redirect to edit page with career ID
      if (status === "active" || status === "inactive") {
        const searchParams = new URLSearchParams({
          tab: "job-description",
        });
        router.push(`/recruiter-dashboard/careers/manage/${result.career.id}?${searchParams}`);
      }
    } catch (error) {
      console.error("Error saving career:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save career";
      errorToast(errorMessage, 3000);
    } finally {
      setIsSaving(false);
    }
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
  async function onContinue(e: React.BaseSyntheticEvent) {
    e.preventDefault();
    const valid = await trigger(steps[currentStep].fields);

    // if has errors, do not proceed and make it the highest step reached
    if (!valid) {
      console.error("Validation errors:", errors);
      errorToast("Please fix the validation errors before continuing", 3000);
      setHighestStepReached(currentStep);
      return;
    }

    // Check if current step data has changed
    const hasChanged = hasCurrentStepChanged();

    // Save if:
    // 1. Moving to a new highest step (first time completing this step), OR
    // 2. User made changes to current step (even if going back)
    const shouldSave = currentStep === highestStepReached || hasChanged;

    if (shouldSave) {
      const values = getValues();
      console.log("Current form values:", values);
      console.log(
        "Saving because:",
        currentStep === highestStepReached ? "New step" : "Data changed",
      );

      // Save current form values as draft
      const filledValues = removeEmptyFields(values, 1);
      await confirmSaveCareer("draft", filledValues);
    } else {
      console.log("No changes detected, skipping save");
    }

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
      errorToast("Please fix the validation errors before saving", 3000);
      // Set errors for invalid filled fields
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path.join(".") as keyof CareerFormValues;
        setError(fieldName, { message: issue.message });
      });
      return;
    }

    await confirmSaveCareer("draft", result.data);
  }

  // Unified submit handler: detect which submit button triggered the event
  // This only runs for PUBLISH/UNPUBLISH buttons (last step, full validation)
  async function onSubmit(data: CareerFormValues, e?: React.BaseSyntheticEvent) {
    const submitter = (e?.nativeEvent as SubmitEvent | undefined)?.submitter as
      | HTMLButtonElement
      | undefined;
    const action = submitter?.value as "publish" | "unpublish" | undefined;

    console.log("Submit action:", action);

    // Check if action is defined
    if (!action) return;

    // Last step: decide between publish vs unpublish
    await confirmSaveCareer(action === "publish" ? "active" : "inactive", data);
  }

  return (
    <FormProvider {...form}>
      <form
        className="career-form"
        onSubmit={isLastStep ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
      >
        <div className="career-form__header">
          <h1 className="career-form__heading">
            {getValues().jobTitle ? (
              <>
                {existingCareer?.status === "active" ? (
                  <span className="career-form__muted">[Published] </span>
                ) : (
                  <span className="career-form__muted">[Draft] </span>
                )}
                {getValues().jobTitle}
              </>
            ) : (
              "Add new career"
            )}
          </h1>
          <div className="career-form__actions">
            {isLastStep ? (
              <Fragment>
                <Button
                  variant="outline"
                  type="submit"
                  name="action"
                  value="unpublish"
                  disabled={isSubmitting || isSaving}
                >
                  Save as Unpublished
                </Button>
                <Button
                  type="submit"
                  name="action"
                  value="publish"
                  disabled={isSubmitting || isSaving}
                >
                  <i className="career-form__button__icon la la-check-circle"></i>
                  Publish
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                <Button variant="outline" type="button" onClick={onSaveDraft} disabled={isSaving}>
                  Save as Draft
                </Button>
                <Button type="button" disabled={isSaving} onClick={onContinue}>
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
