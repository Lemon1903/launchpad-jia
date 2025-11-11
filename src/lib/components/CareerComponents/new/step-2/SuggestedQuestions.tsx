import { Button } from "@/lib/components/ui/Button/button";
import { suggestedQuestions } from "@/lib/config/career/suggestedQuestions";
import { PreScreeningQuestion } from "@/lib/schemas/cvScreeningSchema";
import "@/lib/styles/career/career-step-two.scss";

interface SuggestedQuestionsProps {
  isSuggestedQuestionAdded: (question: PreScreeningQuestion) => boolean;
  onAddSuggestedQuestion: (question: PreScreeningQuestion) => void;
}

export default function SuggestedQuestions({
  isSuggestedQuestionAdded,
  onAddSuggestedQuestion,
}: SuggestedQuestionsProps) {
  return (
    <div className="career-step-two__suggested-questions">
      <p className="career-step-two__suggested-question__title">
        Suggested Pre-screening Questions:
      </p>
      <div className="career-step-two__suggested-questions__list">
        {suggestedQuestions.map(({ title, question: sq }) => (
          <div key={title} className="d-flex career-step-two__suggested-question">
            <div
              className={
                "career-step-two__suggested-question__content" +
                (isSuggestedQuestionAdded(sq) ? " added" : "")
              }
            >
              <div className="career-step-two__suggested-question__title">{title}</div>
              <div className="career-step-two__suggested-question__question">{sq.question}</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={isSuggestedQuestionAdded(sq)}
              onClick={() => onAddSuggestedQuestion(sq)}
            >
              {isSuggestedQuestionAdded(sq) ? "Added" : "Add"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
