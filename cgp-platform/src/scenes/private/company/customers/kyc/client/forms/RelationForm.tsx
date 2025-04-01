import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CustomerRelationForm } from "../../../../../../../../shared/schemas/relation";
import { Button } from "../../../../../../../components";
import {
  countriesOptions,
  denominationFamilyStatusOptions,
  maritalStatusOptions,
} from "../../../../../../../constants";
import { formatDateBykeys } from "../../../../../../../helpers";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import Select, {
  Option,
} from "../../../../../../../UIComponents/Select/Select";

interface RelationFormProps {
  sectionName: string;
  isLoading?: boolean;
  defaultValues?: CustomerRelationForm;
  onSubmit: (data: CustomerRelationForm) => void;
  isUpdate?: boolean;
}

export default function RelationForm({
  sectionName,
  isLoading,
  defaultValues,
  onSubmit,
  isUpdate,
}: RelationFormProps) {
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm<CustomerRelationForm>({
    defaultValues: formatDateBykeys(defaultValues as object, ["birthDate"]),
  });

  const _onSubmit = (data: CustomerRelationForm) => {
    if (!data.firstName || !data.lastName) return;
    onSubmit(data);
  };

  const filterDenominations = (options: Option[]) => {
    switch (sectionName) {
      case "childrens":
        return options.filter((option) =>
          ["sonOf", "daughterOf"].includes(`${option.value}`)
        );
      case "grandChildrens":
        return options.filter((option) =>
          ["hasGrandfather", "hasGrandmother"].includes(`${option.value}`)
        );
      case "maternalParents":
        return options.filter((option) =>
          ["hasMaternalParent"].includes(`${option.value}`)
        );
      case "paternalParents":
        return options.filter((option) =>
          ["hasPaternalParent"].includes(`${option.value}`)
        );
      default:
        return options;
    }
  };

  const prefixField = `relation-${sectionName}-`;
  const fieldSuffix = isUpdate ? "update" : "";

  return (
    <form onSubmit={handleSubmit(_onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + fieldSuffix}>
                {t("forms.fields.firstName")}
              </Label>
              <FieldText
                data-testid={prefixField + field.name}
                id={field.name + fieldSuffix}
                {...field}
              />
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
              <FieldText
                data-testid={prefixField + field.name}
                id={field.name + fieldSuffix}
                {...field}
              />
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
                name={prefixField + field.name}
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
                name={prefixField + field.name}
                onValueChange={field.onChange}
              />
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Controller
          name="denomination"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + fieldSuffix}>
                {t("forms.fields.denomination")}
              </Label>
              <Select
                id={field.name + fieldSuffix}
                {...field}
                name={prefixField + field.name}
                value={denominationFamilyStatusOptions.find(
                  (option) => option?.value === field.value
                )}
                onChange={(option) => field.onChange(option?.value)}
                options={filterDenominations(denominationFamilyStatusOptions)}
              />
            </div>
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + fieldSuffix}>
                {t("forms.fields.phone")}
              </Label>
              <FieldText
                data-testid={prefixField + field.name}
                id={field.name + fieldSuffix}
                {...field}
                type="tel"
              />
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
                data-testid={prefixField + field.name}
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
              <FieldText
                data-testid={prefixField + field.name}
                id={field.name + fieldSuffix}
                {...field}
              />
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
                name={prefixField + field.name}
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
                name={prefixField + field.name}
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
          id={prefixField + "submit"}
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
