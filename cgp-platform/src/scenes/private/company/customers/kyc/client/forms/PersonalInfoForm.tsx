import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "../../../../../../../components";
import {
  countriesOptions,
  gendersOptions,
} from "../../../../../../../constants";
import { useDebounce } from "../../../../../../../hooks/useDebounce";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../../../UIComponents/RadioGroup/RadioGroup";
import Select, {
  Option,
} from "../../../../../../../UIComponents/Select/Select";
import { PersonalInfoFormData } from "../types";

interface PersonalInfoFormProps {
  data?: PersonalInfoFormData;
  onSubmit: (data: PersonalInfoFormData) => void;
  isLoading: boolean;
}

export default function PersonalInfoForm({
  data,
  onSubmit,
  isLoading,
}: PersonalInfoFormProps) {
  const { t } = useTranslation();
  const { handleSubmit, control, reset } = useForm<PersonalInfoFormData>({
    defaultValues: data,
  });

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  const debouncedOnSubmit = useDebounce(() => handleSubmit(onSubmit)(), 3000);

  const handleBlur = () => {
    debouncedOnSubmit();
  };

  const prefixField = "personalInfo-";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.gender")}
              </Label>
              <Select
                id={prefixField + field.name}
                {...field}
                name={prefixField + field.name}
                value={gendersOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => {
                  field.onChange(option?.value);
                  handleBlur();
                }}
                options={gendersOptions}
              />
            </div>
          )}
        />
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.firstName")}
              </Label>
              <FieldText
                id={prefixField + field.name}
                data-testid={prefixField + field.name}
                {...field}
                onBlur={handleBlur}
              />
            </div>
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.lastName")}
              </Label>
              <FieldText
                id={prefixField + field.name}
                data-testid={prefixField + field.name}
                {...field}
                onBlur={handleBlur}
              />
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Controller
          name="birthName"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.customers.details.birthName")}
              </Label>
              <FieldText
                id={prefixField + field.name}
                data-testid={prefixField + field.name}
                {...field}
                onBlur={handleBlur}
              />
            </div>
          )}
        />
        <Controller
          name="firstPhoneNumber"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.phone")}
              </Label>
              <FieldText
                id={prefixField + field.name}
                data-testid={prefixField + field.name}
                {...field}
                onBlur={handleBlur}
              />
            </div>
          )}
        />
        <Controller
          name="personalEmail"
          control={control}
          render={({ field }) => (
            <div className="md:col-span-2">
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.email")}
              </Label>
              <FieldText
                id={prefixField + field.name}
                data-testid={prefixField + field.name}
                {...field}
                onBlur={handleBlur}
              />
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Controller
          name="street"
          control={control}
          render={({ field }) => (
            <div className="md:col-span-2">
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.street")}
              </Label>
              <FieldText
                id={prefixField + field.name}
                data-testid={prefixField + field.name}
                {...field}
                onBlur={handleBlur}
              />
            </div>
          )}
        />
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.country")}
              </Label>
              <Select
                id={prefixField + field.name}
                {...field}
                name={prefixField + field.name}
                value={countriesOptions?.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => {
                  field.onChange(option?.value);
                  handleBlur();
                }}
                options={countriesOptions as Option[]}
              />
            </div>
          )}
        />
        <Controller
          name="zipCode"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.postalCode")}
              </Label>
              <FieldText
                id={prefixField + field.name}
                data-testid={prefixField + field.name}
                {...field}
                onBlur={handleBlur}
              />
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="birthCity"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.customers.details.birthCity")}
              </Label>
              <FieldText
                id={prefixField + field.name}
                data-testid={prefixField + field.name}
                {...field}
                onBlur={handleBlur}
              />
            </div>
          )}
        />
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.birthDate")}
              </Label>
              <FieldDate
                id={prefixField + field.name}
                {...field}
                data-testid={prefixField + field.name}
                name={prefixField + field.name}
                onValueChange={(e) => {
                  field.onChange(e);
                  handleBlur();
                }}
              />
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Controller
          name="nationality"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.customers.details.nationality")}
              </Label>
              <Select
                id={prefixField + field.name}
                {...field}
                name={prefixField + field.name}
                value={countriesOptions?.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => {
                  field.onChange(option?.value);
                  handleBlur();
                }}
                options={countriesOptions as Option[]}
              />
            </div>
          )}
        />
        <Controller
          name="fiscalAddress"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.customers.details.taxResidence")}
              </Label>
              <Select
                id={prefixField + field.name}
                {...field}
                name={prefixField + field.name}
                value={countriesOptions?.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => {
                  field.onChange(option?.value);
                  handleBlur();
                }}
                options={countriesOptions as Option[]}
              />
            </div>
          )}
        />
        <Controller
          name="studiesLevel"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.customers.details.studiesLevel")}
              </Label>
              <FieldText
                id={prefixField + field.name}
                data-testid={prefixField + field.name}
                {...field}
                onBlur={handleBlur}
              />
            </div>
          )}
        />
        <Controller
          name="occupation"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={prefixField + field.name}>
                {t("forms.fields.customers.details.occupation")}
              </Label>
              <FieldText
                id={prefixField + field.name}
                data-testid={prefixField + field.name}
                {...field}
                onBlur={handleBlur}
              />
            </div>
          )}
        />
      </div>
      <Controller
        name="usPerson"
        control={control}
        render={({ field }) => (
          <div className="flex space-x-4">
            <Label className="font-normal">
              {t("forms.fields.customers.details.usPerson")}
            </Label>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value === "true");
                handleBlur();
              }}
              defaultValue={field.value + ""}
              className="flex"
              data-testid={prefixField + field.name}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id="usPerson-true"
                  value="true"
                  className="bg-white border-[#04182B]"
                  data-testid={prefixField + field.name + "-true"}
                />
                <Label htmlFor="usPerson-true" className="cursor-pointer">
                  {t("forms.fields.yes")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id="usPerson-false"
                  value="false"
                  className="bg-white border-[#04182B]"
                  data-testid={prefixField + field.name + "-false"}
                />
                <Label htmlFor="usPerson-false" className="cursor-pointer">
                  {t("forms.fields.no")}
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}
      />

      <div className="flex justify-end">
        <Button
          id={prefixField + "submit"}
          type="submit"
          size="small"
          label="forms.fields.actions.save"
          isLoading={isLoading}
        />
      </div>
    </form>
  );
}
