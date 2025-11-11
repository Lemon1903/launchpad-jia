import { useSortable } from "@dnd-kit/react/sortable";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/lib/components/ui/Button/button";
import { Input } from "@/lib/components/ui/Input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/Select/select";
import { questionRendererRegistry } from "@/lib/config/career/questionRendererRegistry";
import { DragHandle } from "@/lib/icons";
import { CareerFormValues } from "@/lib/schemas/careerFormSchema";
import { PreScreeningQuestion } from "@/lib/schemas/cvScreeningSchema";
import "@/lib/styles/career/career-step-two.scss";
import { QuestionType } from "@/lib/utils/careerConstants";

interface QuestionCardProps {
  questionIndex: number;
  question: PreScreeningQuestion;
  onDeleteQuestion?: (index: number) => void;
}

type QuestionObject = {
  type: QuestionType;
  icon: string;
};

const questionTypes: QuestionObject[] = [
  { type: "dropdown", icon: "la la-chevron-circle-down" },
  { type: "checkbox", icon: "la la-check-square" },
  { type: "range", icon: "la la-sliders-h" },
  { type: "short-answer", icon: "la la-font" },
  { type: "long-answer", icon: "la la-align-left" },
];

export default function QuestionCard({
  questionIndex,
  question,
  onDeleteQuestion,
}: QuestionCardProps) {
  const { control, setValue } = useFormContext<CareerFormValues>();

  // Always derive current values from RHF to trigger re-render when select changes
  const name = `preScreeningQuestions.${questionIndex}` as const;
  const watchedQuestion = useWatch({ control, name }) || question;
  const currentType = watchedQuestion?.type || question.type;

  // Setup sortable functionality
  const { ref, handleRef, isDragging } = useSortable({
    id: question.id,
    index: questionIndex,
    data: { index: questionIndex },
  });

  const { renderer: RenderComponent } = questionRendererRegistry[currentType];

  if (!RenderComponent) {
    throw new Error(`No renderer found for question type: ${currentType}`);
  }

  function handleOnTypeChange(onChange: (value: string) => void) {
    return (value: string) => {
      // Get the default value for the NEW type, not the current one
      const newType = value as QuestionType;
      const { defaultValue } = questionRendererRegistry[newType];

      // Reset question-specific fields when type changes
      setValue(`preScreeningQuestions.${questionIndex}`, {
        id: watchedQuestion.id,
        isSuggested: watchedQuestion.isSuggested,
        question: watchedQuestion.question,
        type: newType,
        ...defaultValue,
      } as PreScreeningQuestion);

      onChange(newType);
    };
  }

  return (
    <div ref={ref} className="career-step-two__question-card">
      <DragHandle ref={handleRef} className="career-step-two__question-card__drag-handle" />
      <div className={"career-step-two__question-card__content" + (isDragging ? " dragging" : "")}>
        {/* Question Header */}
        <div className="career-step-two__question-card__header">
          {/* Question Text | Input */}
          {question.isSuggested ? (
            <span className="career-step-two__question-card__question">{question.question}</span>
          ) : (
            <Controller
              name={`preScreeningQuestions.${questionIndex}.question`}
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id={`question-${questionIndex}`}
                  aria-invalid={fieldState.invalid}
                  placeholder="Write your question..."
                />
              )}
            />
          )}
          {/* Question Type */}
          <Controller
            name={`preScreeningQuestions.${questionIndex}.type`}
            control={control}
            render={({ field, fieldState }) => (
              <Select
                name={field.name}
                value={field.value}
                onValueChange={handleOnTypeChange(field.onChange)}
              >
                <SelectTrigger
                  id={`question-${questionIndex}-type`}
                  aria-invalid={fieldState.invalid}
                  disabled={question.isSuggested}
                  className="career-step-two__question-card__trigger"
                >
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map((qt) => (
                    <SelectItem key={qt.type} value={qt.type}>
                      <i className={qt.icon}></i>
                      {qt.type.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {/* Question Options */}
        <div className="career-step-two__question-card__options">
          <RenderComponent
            questionIndex={questionIndex}
            control={control}
            question={watchedQuestion}
          />
          <Button
            variant="destructive"
            size="sm"
            className="career-step-two__question-card__delete-button"
            onClick={() => onDeleteQuestion?.(questionIndex)}
          >
            <i className="la la-trash"></i>
            Delete Question
          </Button>
        </div>
      </div>
    </div>
  );
}
