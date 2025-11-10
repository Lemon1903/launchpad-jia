import { Modifier } from "@dnd-kit/abstract";
import { DragDropManager } from "@dnd-kit/dom";
import { RestrictToElement } from "@dnd-kit/dom/modifiers";
import { DragDropProvider } from "@dnd-kit/react";
import { useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Separator } from "@/lib/components/ui/Separator/separator";
import { CareerFormValues } from "@/lib/schemas/careerFormSchema";
import { PreScreeningQuestion } from "@/lib/schemas/cvScreeningSchema";
import "@/lib/styles/forms/career-step-two.scss";

import QuestionCard from "@/lib/components/CareerComponents/new/step-2/QuestionCard";
import SuggestedQuestions from "@/lib/components/CareerComponents/new/step-2/SuggestedQuestions";
import { Badge } from "@/lib/components/ui/Badge/badge";
import { Button } from "@/lib/components/ui/Button/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/Card/card";

// Custom modifier to restrict movement to vertical axis only
class RestrictToVerticalAxis extends Modifier<DragDropManager> {
  apply({ transform }: any) {
    return {
      x: 0, // Lock horizontal movement
      y: transform.y, // Allow vertical movement
    };
  }
}

export default function PreScreeningQuestionsCard() {
  const { control } = useFormContext<CareerFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "preScreeningQuestions",
  });
  const previousFieldsOrder = useRef<number[]>([]);

  function handleAddCustomQuestion() {
    append({
      id: crypto.randomUUID(),
      type: "dropdown",
      isSuggested: false,
      question: "",
      options: [{ value: "" }, { value: "" }],
    });
  }

  function isSuggestedQuestionAdded(question: PreScreeningQuestion) {
    return fields.some((field) => field.question === question.question);
  }

  return (
    <DragDropProvider
      modifiers={[RestrictToVerticalAxis, RestrictToElement]}
      onDragStart={() => {
        // Store the current order before drag starts
        previousFieldsOrder.current = fields.map((_, index) => index);
      }}
      onDragOver={(event) => {
        const { source, target } = event.operation;

        if (!source || !target) return;

        const sourceIndex = source.data.index as number;
        const targetIndex = target.data.index as number;

        if (sourceIndex !== targetIndex) {
          move(sourceIndex, targetIndex);
        }
      }}
      onDragEnd={(event) => {
        // Revert to previous order if drag was canceled
        if (event.canceled && previousFieldsOrder.current.length > 0) {
          previousFieldsOrder.current.forEach((oldIndex, newIndex) => {
            if (oldIndex !== newIndex) {
              move(newIndex, oldIndex);
            }
          });
        }
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <span>
              2. Pre-Screening Questions <span className="career-step-two__muted">(optional)</span>{" "}
              <Badge variant="accent">{fields.length}</Badge>
            </span>
          </CardTitle>
          <CardAction>
            <Button size="sm" onClick={handleAddCustomQuestion}>
              <i className="la la-plus"></i> Add Custom
            </Button>
          </CardAction>
        </CardHeader>

        {/* Questions List */}
        <CardContent>
          <div className="career-step-two__questions">
            {!fields || fields.length === 0 ? (
              <div className="career-step-two__questions__empty">
                No pre-screening questions added yet.
              </div>
            ) : (
              fields.map((field, index) => (
                <QuestionCard
                  key={field.id}
                  questionIndex={index}
                  question={field}
                  onDeleteQuestion={remove}
                />
              ))
            )}
          </div>

          <Separator className="my-3" />
          <SuggestedQuestions
            isSuggestedQuestionAdded={isSuggestedQuestionAdded}
            onAddSuggestedQuestion={append}
          />
        </CardContent>
      </Card>
    </DragDropProvider>
  );
}
