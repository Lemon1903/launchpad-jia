"use client";

import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import SalaryInput from "@/lib/components/CareerComponents/new/SalaryInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/Card/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/lib/components/ui/Field/field";
import { Input } from "@/lib/components/ui/Input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/Select/select";
import { Switch } from "@/lib/components/ui/Switch/switch";
import { CareerFormValues } from "@/lib/schemas/careerFormSchema";
import "@/lib/styles/forms/career-step-one.scss";
import { CITIES, EMPLOYMENT_TYPES, PROVINCES, WORK_SETUPS } from "@/lib/utils/careerConstants";

export default function CareerInformationCard() {
  const { control, setValue } = useFormContext<CareerFormValues>();
  const [cities, setCities] = useState(CITIES.filter((city) => city.province === PROVINCES[0].key));

  function handleSelectProvince(provinceName: string, onChange: (value: string) => void) {
    const province = PROVINCES.find((p) => p.name === provinceName);
    if (province) {
      const cities = CITIES.filter((city) => city.province === province.key);
      setCities(cities);
      setValue("location", ""); // Reset city selection
      onChange(provinceName);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Career Information</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {/* Basic Information */}
          <FieldSet>
            <FieldLegend>Basic Information</FieldLegend>
            {/* Job Title */}
            <Controller
              name="jobTitle"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="job-title">Job Title</FieldLabel>
                  <Input
                    {...field}
                    id="job-title"
                    placeholder="Enter job title"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldSet>

          {/* Work Setting */}
          <FieldSet>
            <FieldLegend>Work Setting</FieldLegend>
            <div className="career-step-one__row">
              {/* Employment Type */}
              <Controller
                name="employmentType"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="employment-type">Employment Type</FieldLabel>
                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="employment-type" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Choose Employment Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMPLOYMENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {/* Work Arrangement */}
              <Controller
                name="workSetup"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="work-arrangement">Arrangement</FieldLabel>
                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="work-arrangement" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Choose Work Arrangement" />
                      </SelectTrigger>
                      <SelectContent>
                        {WORK_SETUPS.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldSet>

          {/* Location */}
          <FieldSet>
            <FieldLegend>Location</FieldLegend>
            <div className="career-step-one__row">
              {/* Country */}
              <Controller
                name="country"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="country">Country</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled
                    >
                      <SelectTrigger id="country" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Philippines" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Philippines">Philippines</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {/* State / Province */}
              <Controller
                name="province"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="state">State / Province</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={(value) => handleSelectProvince(value, field.onChange)}
                    >
                      <SelectTrigger id="state" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Choose State / Province" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVINCES.map((province) => (
                          <SelectItem key={province.key} value={province.name}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {/* City */}
              <Controller
                name="location"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="city" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Choose City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldSet>

          {/* Salary */}
          <FieldSet className="career-step-one__salary-fieldset">
            <div className="career-step-one__salary-header">
              <FieldLegend>Salary</FieldLegend>
              {/* Negotiable */}
              <Controller
                name="salaryNegotiable"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                    className="career-step-one__salary-toggle"
                  >
                    <Switch
                      id="negotiable"
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel htmlFor="negotiable">Negotiable</FieldLabel>
                  </Field>
                )}
              />
            </div>
            <div className="career-step-one__row">
              {/* Minimum Salary */}
              <Controller
                name="minimumSalary"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="minimum-salary">Minimum Salary</FieldLabel>
                    <SalaryInput id="minimum-salary" aria-invalid={fieldState.invalid} {...field} />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {/* Maximum Salary */}
              <Controller
                name="maximumSalary"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="maximum-salary">Maximum Salary</FieldLabel>
                    <SalaryInput id="maximum-salary" aria-invalid={fieldState.invalid} {...field} />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldSet>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
