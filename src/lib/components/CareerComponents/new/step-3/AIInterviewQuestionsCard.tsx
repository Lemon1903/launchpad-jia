import { CollisionPriority, Modifier } from "@dnd-kit/abstract";
import { DragDropManager } from "@dnd-kit/dom";
import { RestrictToElement } from "@dnd-kit/dom/modifiers";
import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import axios from "axios";
import { useRef, useState } from "react";
import { Controller, useFieldArray, useFormContext, useFormState } from "react-hook-form";

import FullScreenLoadingAnimation from "@/lib/components/CareerComponents/FullScreenLoadingAnimation";
import InterviewQuestionModal from "@/lib/components/CareerComponents/InterviewQuestionModal";
import { Button } from "@/lib/components/ui/Button/button";
import { Field, FieldError, FieldLabel } from "@/lib/components/ui/Field/field";
import { Input } from "@/lib/components/ui/Input/input";
import { DragHandle, Glimmer, StepError } from "@/lib/icons";
import { CareerFormValues } from "@/lib/schemas/careerFormSchema";
import { candidateActionToast, errorToast, guid } from "@/lib/Utils";

class RestrictToVerticalAxis extends Modifier<DragDropManager> {
  apply({ transform }: any) {
    return { x: 0, y: transform.y };
  }
}

export default function AIInterviewQuestionsCard() {
  const { control, getValues, trigger } = useFormContext<CareerFormValues>();
  const { fields, replace, update, move } = useFieldArray({
    control,
    name: "questions",
  });
  const { errors } = useFormState({ control });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState("");
  const [questionModalCategoryIndex, setQuestionModalCategoryIndex] = useState<number | null>(null);
  const [questionModalQuestion, setQuestionModalQuestion] = useState<any>(null);
  const previousFieldsOrder = useRef<number[]>([]);
  const draggedQuestionRef = useRef<{
    questionId: string;
    sourceCategoryIndex: number;
  } | null>(null);

  const totalQuestions = fields.reduce((acc, group) => acc + group.questions.length, 0);

  async function generateAllQuestions() {
    const jobTitle = getValues("jobTitle");
    const description = getValues("description");

    if (!jobTitle?.trim() || !description?.trim()) {
      errorToast("Please fill in job title and description first", 1500);
      return;
    }

    setIsGenerating(true);

    try {
      const categories = fields.map((f) => f.category);
      const questionCount = 5;

      const response = await axios.post("/api/llm-engine", {
        systemPrompt: "You are a helpful assistant that can answer questions and help with tasks.",
        prompt: `Generate ${questionCount * categories.length} interview questions for the following Job opening:
        Job Title: ${jobTitle}
        Job Description: ${description}
        
        Categories: ${categories.join(", ")}
        
        ${categories.map((cat) => `${questionCount} questions for ${cat}`).join(", ")}
        
        Return it in json format following this for each element {category: "category", questions: ["question1", "question2", "question3", "question4", "question5"]}
        Return only the json array, nothing else, no markdown format just pure json code.`,
      });

      let generated = response.data.result.replace(/```json|```/g, "");
      const parsedQuestions = JSON.parse(generated);

      const newFields = [...fields];
      parsedQuestions.forEach((group: { category: string; questions: string[] }) => {
        const categoryIndex = newFields.findIndex((f) => f.category === group.category);
        if (categoryIndex !== -1) {
          const newQuestions = group.questions.map((q) => ({
            id: guid(),
            question: q,
          }));
          newFields[categoryIndex].questions = [
            ...newFields[categoryIndex].questions,
            ...newQuestions,
          ];
          // Automatically set questionCountToAsk to the total number of questions
          newFields[categoryIndex].questionCountToAsk = newFields[categoryIndex].questions.length;
        }
      });

      replace(newFields);

      candidateActionToast(
        <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27", marginLeft: 8 }}>
          Questions generated successfully
        </span>,
        1500,
        <i className="la la-check-circle" style={{ color: "#039855", fontSize: 32 }}></i>,
      );
    } catch (err) {
      console.error(err);
      errorToast("Error generating questions, please try again", 1500);
    } finally {
      setIsGenerating(false);
    }
  }

  async function generateCategoryQuestions(categoryIndex: number) {
    const jobTitle = getValues("jobTitle");
    const description = getValues("description");

    if (!jobTitle?.trim() || !description?.trim()) {
      errorToast("Please fill in job title and description first", 1500);
      return;
    }

    setIsGenerating(true);

    try {
      const category = fields[categoryIndex].category;
      const questionCount = 5;

      const response = await axios.post("/api/llm-engine", {
        systemPrompt: "You are a helpful assistant that can answer questions and help with tasks.",
        prompt: `Generate ${questionCount} interview questions for the following Job opening:
        Job Title: ${jobTitle}
        Job Description: ${description}
        
        Interview Category: ${category}
        
        Return it as a json object following this format {category: "${category}", questions: ["question1", "question2", "question3"]}`,
      });

      let generated = response.data.result.replace(/```json|```/g, "");
      const parsed = JSON.parse(generated);

      const newQuestions = parsed.questions.map((q: string) => ({
        id: guid(),
        question: q,
      }));

      const allQuestions = [...fields[categoryIndex].questions, ...newQuestions];

      const updatedField = {
        ...fields[categoryIndex],
        questions: allQuestions,
        // Automatically set questionCountToAsk to the total number of questions
        questionCountToAsk: allQuestions.length,
      };

      update(categoryIndex, updatedField);

      candidateActionToast(
        <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27", marginLeft: 8 }}>
          Questions generated successfully
        </span>,
        1500,
        <i className="la la-check-circle" style={{ color: "#039855", fontSize: 32 }}></i>,
      );
    } catch (err) {
      console.error(err);
      errorToast("Error generating questions, please try again", 1500);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleQuestionCountChange(categoryIndex: number, count: string) {
    const value = count === "" ? null : parseInt(count);
    const maxCount = fields[categoryIndex].questions.length;

    const updatedField = {
      ...fields[categoryIndex],
      questionCountToAsk: value !== null && value > maxCount ? maxCount : value,
    };

    update(categoryIndex, updatedField);
  }

  function addQuestion(categoryIndex: number, newQuestion: string) {
    if (categoryIndex >= 0 && categoryIndex < fields.length) {
      const newQuestions = [
        ...fields[categoryIndex].questions,
        {
          id: guid(),
          question: newQuestion,
        },
      ];
      const updatedField = {
        ...fields[categoryIndex],
        questions: newQuestions,
        questionCountToAsk: newQuestions.length > 0 ? newQuestions.length : null,
      };
      update(categoryIndex, updatedField);
    }
  }

  function editQuestion(categoryIndex: number, updatedQuestion: string, questionId: string) {
    if (categoryIndex >= 0 && categoryIndex < fields.length) {
      const updatedQuestions = fields[categoryIndex].questions.map((q) =>
        q.id === questionId ? { ...q, question: updatedQuestion } : q,
      );
      const updatedField = {
        ...fields[categoryIndex],
        questions: updatedQuestions,
      };
      update(categoryIndex, updatedField);
    }
  }

  function deleteQuestion(categoryIndex: number, questionId: string) {
    if (categoryIndex >= 0 && categoryIndex < fields.length) {
      const updatedQuestions = fields[categoryIndex].questions.filter((q) => q.id !== questionId);

      const updatedField = {
        ...fields[categoryIndex],
        questions: updatedQuestions,
        questionCountToAsk: updatedQuestions.length > 0 ? updatedQuestions.length : null,
      };
      update(categoryIndex, updatedField);
    }
  }

  return (
    <DragDropProvider
      modifiers={[RestrictToVerticalAxis, RestrictToElement]}
      onDragStart={(event) => {
        // Save current state for potential cancellation
        previousFieldsOrder.current = fields as any;

        // Track if we're dragging a question
        const source = event.operation.source;
        if (source && source.data.type === "question") {
          const questionId = source.id as string;
          const sourceCategoryIndex = source.data.categoryIndex as number;

          draggedQuestionRef.current = {
            questionId,
            sourceCategoryIndex,
          };
        } else {
          draggedQuestionRef.current = null;
        }
      }}
      onDragOver={(event) => {
        const { source, target } = event.operation;
        if (!source || !target) return;

        const sourceType = source.data.type;
        const targetType = target.data.type;

        // Handle category reordering - this uses move() which has smooth transitions
        if (!sourceType && !targetType) {
          const sourceCategoryIndex = source.data.categoryIndex as number;
          const targetCategoryIndex = target.data.categoryIndex as number;

          if (
            sourceCategoryIndex !== undefined &&
            targetCategoryIndex !== undefined &&
            sourceCategoryIndex !== targetCategoryIndex
          ) {
            move(sourceCategoryIndex, targetCategoryIndex);
          }
        }

        // Handle question dragging
        if (sourceType === "question") {
          const sourceQuestionIndex = source.data.questionIndex as number;
          const sourceCategoryIndex = source.data.categoryIndex as number;

          // Dragging over another question
          if (targetType === "question") {
            const targetQuestionIndex = target.data.questionIndex as number;
            const targetCategoryIndex = target.data.categoryIndex as number;

            // Handle same-category reordering
            if (
              sourceCategoryIndex === targetCategoryIndex &&
              sourceQuestionIndex !== targetQuestionIndex
            ) {
              const updatedCategory = { ...fields[sourceCategoryIndex] };
              const questions = [...updatedCategory.questions];
              const [movedQuestion] = questions.splice(sourceQuestionIndex, 1);
              questions.splice(targetQuestionIndex, 0, movedQuestion);
              updatedCategory.questions = questions;
              update(sourceCategoryIndex, updatedCategory);
            }
            // Handle cross-category moves
            else if (sourceCategoryIndex !== targetCategoryIndex) {
              const sourceCategory = { ...fields[sourceCategoryIndex] };
              const targetCategory = { ...fields[targetCategoryIndex] };

              const [movedQuestion] = sourceCategory.questions.splice(sourceQuestionIndex, 1);
              targetCategory.questions.splice(targetQuestionIndex, 0, movedQuestion);

              // Auto-update question counts for both categories (null if empty)
              sourceCategory.questionCountToAsk =
                sourceCategory.questions.length > 0 ? sourceCategory.questions.length : null;
              targetCategory.questionCountToAsk =
                targetCategory.questions.length > 0 ? targetCategory.questions.length : null;

              const updatedFields = [...fields];
              updatedFields[sourceCategoryIndex] = sourceCategory;
              updatedFields[targetCategoryIndex] = targetCategory;
              replace(updatedFields);
            }
          }
          // Dragging over an empty category or droppable area (not over a specific question)
          else if (!targetType || target.id.toString().startsWith("droppable-")) {
            const targetCategoryIndex = target.data.categoryIndex as number;

            if (sourceCategoryIndex !== targetCategoryIndex) {
              const sourceCategory = { ...fields[sourceCategoryIndex] };
              const targetCategory = { ...fields[targetCategoryIndex] };

              const [movedQuestion] = sourceCategory.questions.splice(sourceQuestionIndex, 1);
              // Append to end of target category
              targetCategory.questions.push(movedQuestion);

              // Auto-update question counts for both categories (null if empty)
              sourceCategory.questionCountToAsk =
                sourceCategory.questions.length > 0 ? sourceCategory.questions.length : null;
              targetCategory.questionCountToAsk =
                targetCategory.questions.length > 0 ? targetCategory.questions.length : null;

              const updatedFields = [...fields];
              updatedFields[sourceCategoryIndex] = sourceCategory;
              updatedFields[targetCategoryIndex] = targetCategory;
              replace(updatedFields);
            }
          }
        }
      }}
      onDragEnd={(event) => {
        const { source } = event.operation;

        // Handle canceled category drags
        if (event.canceled && !source?.data.type && previousFieldsOrder.current.length > 0) {
          previousFieldsOrder.current.forEach((oldIndex, newIndex) => {
            if (oldIndex !== newIndex) {
              move(newIndex, oldIndex);
            }
          });
        }

        // Handle canceled question drags - revert to previous state
        if (event.canceled && source?.data.type === "question") {
          replace(previousFieldsOrder.current as any);
        }

        // Clear the dragged question reference
        draggedQuestionRef.current = null;

        // Re-validate to update error positions after reordering
        if (!event.canceled) {
          trigger("questions");
        }
      }}
    >
      <>
        <div className="layered-card-middle career-step-three__questions-card">
          <div className="career-step-three__questions-card__header">
            <div className="career-step-three__questions-card__title">
              <span>2. Interview Questions</span>
              <div className="career-step-three__questions-card__badge">{totalQuestions}</div>
            </div>
            <Button size="sm" onClick={generateAllQuestions} disabled={isGenerating}>
              <Glimmer /> Generate all Questions
            </Button>
          </div>

          <div className="layered-card-content career-step-three__questions-card__content">
            {/* Display root questions error */}
            {errors.questions && (
              <div className="career-step-three__questions-card__error">
                <StepError />
                <FieldError errors={[errors.questions]} />
              </div>
            )}

            {fields.map((category, categoryIndex) => (
              <CategoryCard
                key={category.id}
                category={category}
                categoryIndex={categoryIndex}
                control={control}
                categoryErrors={(errors.questions as any)?.[categoryIndex]}
                actualCategory={category}
                onGenerateQuestions={() => generateCategoryQuestions(categoryIndex)}
                onAddQuestion={() => {
                  setShowQuestionModal("add");
                  setQuestionModalCategoryIndex(categoryIndex);
                }}
                onEditQuestion={(questionIndex) => {
                  setShowQuestionModal("edit");
                  setQuestionModalCategoryIndex(categoryIndex);
                  setQuestionModalQuestion(category.questions[questionIndex]);
                }}
                onDeleteQuestion={(questionIndex) => {
                  setShowQuestionModal("delete");
                  setQuestionModalCategoryIndex(categoryIndex);
                  setQuestionModalQuestion(category.questions[questionIndex]);
                }}
                onCountChange={(count) => handleQuestionCountChange(categoryIndex, count)}
                isGenerating={isGenerating}
              />
            ))}
          </div>
        </div>

        {showQuestionModal && questionModalCategoryIndex !== null && (
          <InterviewQuestionModal
            groupId={questionModalCategoryIndex}
            questionToEdit={
              questionModalQuestion
                ? {
                    id: 0, // Dummy ID for modal display (not used for edit/delete)
                    question: questionModalQuestion.question,
                  }
                : undefined
            }
            action={showQuestionModal}
            onAction={(action, categoryIndex, question, questionId) => {
              setShowQuestionModal("");
              const questionIdToUse = questionModalQuestion?.id; // Store the original string ID
              setQuestionModalQuestion(null);
              setQuestionModalCategoryIndex(null);

              if (action === "add" && categoryIndex !== undefined && question) {
                addQuestion(categoryIndex, question);
              }

              if (action === "edit" && categoryIndex !== undefined && question && questionIdToUse) {
                editQuestion(categoryIndex, question, questionIdToUse);
              }

              if (action === "delete" && categoryIndex !== undefined && questionIdToUse) {
                deleteQuestion(categoryIndex, questionIdToUse);
              }
            }}
          />
        )}

        {isGenerating && (
          <FullScreenLoadingAnimation
            title="Generating questions..."
            subtext="Please wait while Jia is generating the questions"
          />
        )}
      </>
    </DragDropProvider>
  );
}

interface CategoryCardProps {
  category: any;
  categoryIndex: number;
  control: any;
  categoryErrors: any;
  actualCategory: any; // The actual category from fields to get current order
  onGenerateQuestions: () => void;
  onAddQuestion: () => void;
  onEditQuestion: (questionIndex: number) => void;
  onDeleteQuestion: (questionIndex: number) => void;
  onCountChange: (count: string) => void;
  isGenerating: boolean;
}

function CategoryCard({
  category,
  categoryIndex,
  control,
  categoryErrors,
  actualCategory,
  onGenerateQuestions,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onCountChange,
  isGenerating,
}: CategoryCardProps) {
  const { ref, handleRef, isDragging } = useSortable({
    id: category.id,
    index: categoryIndex,
    data: { categoryIndex },
  });

  // Make the category droppable for questions
  const { ref: droppableRef } = useDroppable({
    id: `droppable-${category.id}`,
    type: "question",
    collisionPriority: CollisionPriority.Low,
    data: { categoryIndex, categoryId: category.id },
  });

  return (
    <div
      ref={ref}
      className={`career-step-three__category-card ${isDragging ? "career-step-three__category-card--dragging" : ""}`}
    >
      <div className="career-step-three__category-header">
        <DragHandle ref={handleRef} className="career-step-three__drag-handle" />
        <h3>{category.category}</h3>
      </div>

      <div ref={droppableRef} className="career-step-three__questions-list">
        {actualCategory.questions.map((question: any, questionIndex: number) => (
          <QuestionItem
            key={`${question.id}-${questionIndex}`}
            question={question}
            questionIndex={questionIndex}
            categoryId={category.id}
            categoryIndex={categoryIndex}
            control={control}
            onEdit={() => onEditQuestion(questionIndex)}
            onDelete={() => onDeleteQuestion(questionIndex)}
          />
        ))}
      </div>

      <div className="career-step-three__category-footer">
        <div className="career-step-three__category-actions">
          <Button size="sm" onClick={onGenerateQuestions} disabled={isGenerating}>
            <Glimmer /> Generate Questions
          </Button>
          <Button variant="outline" size="sm" onClick={onAddQuestion}>
            <i className="la la-plus-circle"></i> Manually Add
          </Button>
        </div>

        {category.questions.length > 0 && (
          <Controller
            name={`questions.${categoryIndex}.questionCountToAsk`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Field orientation="horizontal" className="career-step-three__question-count">
                <FieldLabel># of Questions to Ask:</FieldLabel>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? null : parseInt(value));
                    onCountChange(value);
                  }}
                  min={0}
                  max={category.questions.length}
                  className="career-step-three__question-count-input"
                />
                {error && <FieldError>{error.message}</FieldError>}
              </Field>
            )}
          />
        )}
      </div>
    </div>
  );
}

interface QuestionItemProps {
  question: any;
  questionIndex: number;
  categoryId: string;
  categoryIndex: number;
  control: any;
  onEdit: () => void;
  onDelete: () => void;
}

function QuestionItem({
  question,
  questionIndex,
  categoryId,
  categoryIndex,
  control,
  onEdit,
  onDelete,
}: QuestionItemProps) {
  const { ref, handleRef, isDragging } = useSortable({
    id: question.id,
    index: questionIndex,
    group: categoryId,
    type: "question",
    data: { questionIndex, categoryIndex, categoryId, type: "question" },
  });

  // Get errors directly from form state to ensure it's always current
  const { errors } = useFormState({ control });
  const error = (errors.questions as any)?.[categoryIndex]?.questions?.[questionIndex]?.question;

  return (
    <div className="career-step-three__question-wrapper">
      <div
        ref={ref}
        className={`career-step-three__question-item ${isDragging ? "career-step-three__question-item--dragging" : ""} ${error ? "career-step-three__question-item--error" : ""}`}
      >
        <div ref={handleRef} className="career-step-three__question-content">
          <DragHandle className="career-step-three__drag-handle" />
          <span>{question.question}</span>
        </div>
        <div className="career-step-three__question-actions">
          <button className="career-step-three__edit-btn" onClick={onEdit}>
            <i className="la la-pencil-alt"></i>
            <span>Edit</span>
          </button>
          <button className="career-step-three__delete-btn" onClick={onDelete}>
            <i className="la la-trash"></i>
          </button>
        </div>
      </div>
      {error && !isDragging && (
        <div className="career-step-three__question-error">
          <FieldError errors={[error]} />
        </div>
      )}
    </div>
  );
}
