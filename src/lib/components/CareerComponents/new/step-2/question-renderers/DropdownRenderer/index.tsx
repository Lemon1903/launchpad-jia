import { Controller, useFieldArray } from "react-hook-form";

import { QuestionRendererProps } from "@/lib/components/CareerComponents/new/step-2/question-renderers/types";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/lib/components/ui/InputGroup/input-group";

import { Button } from "@/lib/components/ui/Button/button";
import { Field, FieldContent, FieldError } from "@/lib/components/ui/Field/field";
import { Separator } from "@/lib/components/ui/Separator/separator";
import { MINIMUM_OPTIONS } from "@/lib/utils/careerConstants";

import "./style.scss";

export default function DropdownRenderer({
  questionIndex,
  control,
  question,
}: QuestionRendererProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `preScreeningQuestions.${questionIndex}.options`,
  });

  function handleAddOption() {
    append({ value: "" });
  }

  function handleRemoveOption(index: number) {
    remove(index);
  }

  return (
    <div className="dropdown-renderer">
      {fields.map((field, index) => (
        <Controller
          key={field.id}
          name={`preScreeningQuestions.${questionIndex}.options.${index}.value`}
          control={control}
          render={({ field: controllerField, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <div className="dropdown-renderer__option">
                  <InputGroup>
                    <InputGroupInput
                      {...controllerField}
                      id={`question-${questionIndex}-option-${index}`}
                      aria-invalid={fieldState.invalid}
                      placeholder={`Option ${index + 1}`}
                    />
                    <InputGroupAddon>
                      <div>{index + 1}</div>
                    </InputGroupAddon>
                  </InputGroup>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => handleRemoveOption(index)}
                    disabled={fields.length <= MINIMUM_OPTIONS}
                  >
                    <i className="la la-times"></i>
                  </Button>
                </div>
                {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
              </FieldContent>
            </Field>
          )}
        />
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="dropdown-renderer__add-option"
        onClick={handleAddOption}
      >
        <i className="la la-plus"></i> Add Option
      </Button>
      <Separator className="mt-1" />
    </div>
  );
}
