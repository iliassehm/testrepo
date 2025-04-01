import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Text } from "../../../../../../components";
import FieldAmount from "../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldNumber } from "../../../../../../UIComponents/FieldNumber/FieldNumber";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../UIComponents/Label/Label";
import Select from "../../../../../../UIComponents/Select/Select";

export function ProfessionalSituationForm() {
  const { t } = useTranslation();
  const { control } = useFormContext();

  const heritageOriginList = t(
    "forms.fields.customers.details.heritageOriginList",
    {
      returnObjects: true,
    }
  ) as Record<string, string>;

  const heritageOriginOptions = useMemo(
    () =>
      Object.entries(heritageOriginList).map((key) => ({
        label: key[1],
        value: key[0],
      })) ?? [],
    []
  );

  return (
    <>
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="scenes.customers.details.professionnalSituation"
      />
      <div className="flex flex-col gap-4">
        <Controller
          name="studiesLevel"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="studiesLevel">
                {t("forms.fields.customers.details.studiesLevel")}
              </Label>
              <FieldText
                id="studiesLevel"
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="occupation"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="occupation">
                {t("forms.fields.customers.details.occupation")}
              </Label>
              <FieldText
                id="occupation"
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="occupationWording"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="occupationWording">
                {t("forms.fields.customers.details.occupationWording")}
              </Label>
              <FieldText
                id="occupationWording"
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="retirementAge"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="retirementAge">
                {t("forms.fields.customers.details.retirementAge")}
              </Label>
              <FieldNumber id="retirementAge" {...field} value={field.value} />
            </div>
          )}
        />
        <Controller
          name="annualIncome"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="annualIncome">
                {t("forms.fields.customers.details.annualIncome")}
              </Label>
              <FieldAmount
                id="annualIncome"
                name={field.name}
                onValueChange={(e) => {
                  field.onChange(e);
                }}
                defaultValue={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="heritageOrigin"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="heritageOrigin">
                {t("forms.fields.customers.details.heritageOrigin")}
              </Label>
              <Select
                id={field.name}
                {...field}
                value={heritageOriginOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => {
                  field.onChange(option?.value);
                }}
                options={heritageOriginOptions}
              />
            </div>
          )}
        />
      </div>
    </>
  );
}
