import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Text } from "../../../../../../components";
import {
  countriesOptions,
  gendersOptions,
  maritalStatusOptions,
  matrimonialRegimeOptions,
} from "../../../../../../constants";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../UIComponents/Label/Label";
import Select, { Option } from "../../../../../../UIComponents/Select/Select";

export function MaritalForm() {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <>
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label={`scenes.customers.details.maritalStatus`}
      />
      <div className="flex flex-col gap-4">
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>{t("forms.fields.gender")}</Label>
              <Select
                id={field.name}
                {...field}
                value={gendersOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => {
                  field.onChange(option?.value);
                }}
                options={gendersOptions}
              />
            </div>
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.lastName")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="birthName"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.birthName")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.firstName")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.birthDate")}
              </Label>
              <FieldDate id={field.name} {...field} value={field.value} />
            </div>
          )}
        />
        <Controller
          name="birthCity"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.birthCity")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="birthZipCode"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.birthZipCode")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="familySituation"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.familySituation")}
              </Label>
              <Select
                id={field.name}
                {...field}
                value={maritalStatusOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => {
                  field.onChange(option?.value);
                }}
                options={maritalStatusOptions}
              />
            </div>
          )}
        />
        <Controller
          name="nationality"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.nationality")}
              </Label>
              <Select
                id={field.name}
                {...field}
                value={countriesOptions?.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => {
                  field.onChange(option?.value);
                }}
                options={countriesOptions as Option[]}
              />
            </div>
          )}
        />
        <Controller
          name="matrimonialRegime"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.matrimonialRegime")}
              </Label>
              <Select
                id={field.name}
                {...field}
                value={matrimonialRegimeOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => {
                  field.onChange(option?.value);
                }}
                options={matrimonialRegimeOptions}
              />
            </div>
          )}
        />
        <Controller
          name="deathDate"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.deathDate")}
              </Label>
              <FieldDate id={field.name} {...field} value={field.value} />
            </div>
          )}
        />
      </div>
    </>
  );
}
