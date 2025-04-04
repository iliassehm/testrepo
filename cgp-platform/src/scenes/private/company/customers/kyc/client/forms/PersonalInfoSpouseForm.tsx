import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CustomerRelationForm } from "../../../../../../../../shared/schemas/relation";
import { Button } from "../../../../../../../components";
import {
  countriesOptions,
  maritalStatusOptions,
} from "../../../../../../../constants";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import Select, {
  Option,
} from "../../../../../../../UIComponents/Select/Select";

interface PersonalInfoFormProps {
  defaultValues?: CustomerRelationForm;
  onSubmit: (data: CustomerRelationForm) => void;
  isLoading: boolean;
  isUpdate?: boolean;
}

export default function PersonalInfoSpouseForm({
  defaultValues,
  onSubmit,
  isLoading,
  isUpdate,
}: PersonalInfoFormProps) {
  const { t } = useTranslation();
  const { handleSubmit, control, reset } = useForm<CustomerRelationForm>();

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
    else
      reset({
        lastName: "",
        firstName: "",
        countryOfBirth: "",
        birthDate: undefined,
        birthPlace: "",
        email: "",
        maritalStatus: "",
        phone: "",
        nationality: "",
      });
  }, [defaultValues, reset]);

  const fieldSuffix = isUpdate ? "update" : "";
  return (
    <form
      onSubmit={handleSubmit((form) =>
        onSubmit({ ...form, denomination: "spouseOf" })
      )}
      className="space-y-4 p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + fieldSuffix}>
                {t("forms.fields.firstName")}
              </Label>
              <FieldText id={field.name + fieldSuffix} {...field} />
            </div>
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + fieldSuffix}>
                {t("forms.fields.lastName")}
              </Label>
              <FieldText id={field.name + fieldSuffix} {...field} />
            </div>
          )}
        />
        <Controller
          name="nationality"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + fieldSuffix}>
                {t("forms.fields.customers.details.nationality")}
              </Label>
              <Select
                id={field.name + fieldSuffix}
                {...field}
                value={countriesOptions?.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => field.onChange(option?.value)}
                options={countriesOptions as Option[]}
              />
            </div>
          )}
        />
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + fieldSuffix}>
                {t("forms.fields.birthDate")}
              </Label>
              <FieldDate
                id={field.name + fieldSuffix}
                {...field}
                onValueChange={field.onChange}
              />
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + fieldSuffix}>
                {t("forms.fields.phone")}
              </Label>
              <FieldText id={field.name + fieldSuffix} {...field} type="tel" />
            </div>
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + fieldSuffix}>
                {t("forms.fields.email")}
              </Label>
              <FieldText
                id={field.name + fieldSuffix}
                {...field}
                type="email"
              />
            </div>
          )}
        />
        <Controller
          name="birthPlace"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + fieldSuffix}>
                {t("forms.fields.customers.details.birthCity")}
              </Label>
              <FieldText id={field.name + fieldSuffix} {...field} />
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Controller
          name="countryOfBirth"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + fieldSuffix}>
                {t("forms.fields.country")}
              </Label>
              <Select
                id={field.name + fieldSuffix}
                {...field}
                value={countriesOptions?.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => field.onChange(option?.value)}
                options={countriesOptions as Option[]}
              />
            </div>
          )}
        />
        <Controller
          name="maritalStatus"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + fieldSuffix}>
                {t("forms.fields.customers.details.familySituation")}
              </Label>
              <Select
                id={field.name + fieldSuffix}
                {...field}
                value={maritalStatusOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => field.onChange(option?.value)}
                options={maritalStatusOptions}
              />
            </div>
          )}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="small"
          label={
            defaultValues
              ? "forms.fields.actions.save"
              : "forms.fields.actions.add"
          }
          isLoading={isLoading}
        />
      </div>
    </form>
  );
}
