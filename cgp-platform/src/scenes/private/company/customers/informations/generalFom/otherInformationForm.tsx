import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Text } from "../../../../../../components";
import { countriesOptions } from "../../../../../../constants";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../UIComponents/Label/Label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../../UIComponents/RadioGroup/RadioGroup";
import Select, {
  type Option,
} from "../../../../../../UIComponents/Select/Select";

const legalCapacityOptions: Option[] = [
  { label: "Aucune", value: "Aucune" },
  {
    label: "Administrateur Ad Hoc Art. 455 et 456",
    value: "Administrateur Ad Hoc Art. 455 et 456",
  },
  {
    label: "Administration Légale Art. 389 & suiv.",
    value: "Administration Légale Art. 389 & suiv.",
  },
  {
    label: "Ancienne Tutelle d'état Art. 411",
    value: "Ancienne Tutelle d'état Art. 411",
  },
  {
    label: "Ancienne Tutelle en gérance",
    value: "Ancienne Tutelle en gérance",
  },
  {
    label: "Curatelle Anc. Art 511",
    value: "Curatelle Anc. Art 511",
  },
  {
    label: "Curatelle Anc. Art 512",
    value: "Curatelle Anc. Art 512",
  },
  {
    label: "Curatelle Art. 440 & suiv.",
    value: "Curatelle Art. 440 & suiv.",
  },
  {
    label: "Curatelle Renforcée Art. 472",
    value: "Curatelle Renforcée Art. 472",
  },
  {
    label: "Habilitation Familiale Assistance Art.494-1 & suiv.",
    value: "Habilitation Familiale Assistance Art.494-1 & suiv.",
  },
  {
    label: "Habilitation Familiale Représentation Art.494-1 & suiv",
    value: "Habilitation Familiale Représentation Art.494-1 & suiv",
  },
  {
    label: "Mandat de Protection Future Art 477 à 494",
    value: "Mandat de Protection Future Art 477 à 494",
  },
  {
    label: "Mandat à Effet Posthume Art. 812 & suiv.",
    value: "Mandat à Effet Posthume Art. 812 & suiv.",
  },
  {
    label: "Sauvegarde de justice Art. 433 & suiv.",
    value: "Sauvegarde de justice Art. 433 & suiv.",
  },
  { label: "Tutelle Art. 440", value: "Tutelle Art. 440" },
  {
    label: "Tutelle sous gestion privée Art 505",
    value: "Tutelle sous gestion privée Art 505",
  },
];

export function OtherInformationForm() {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <>
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="scenes.customers.details.others"
      />
      <div className="flex flex-col gap-4">
        <Controller
          name="idNIF"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="idNIF">
                {t("forms.fields.customers.details.idNIF")}
              </Label>
              <FieldText id="idNIF" {...field} value={field.value as string} />
            </div>
          )}
        />
        <Controller
          name="idMIF"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="idMIF">
                {t("forms.fields.customers.details.idMIF")}
              </Label>
              <FieldText id="idMIF" {...field} value={field.value as string} />
            </div>
          )}
        />
        <Controller
          name="taxResidence"
          control={control}
          render={({ field }) => (
            <div>
              <Label
                htmlFor={field.name}
                className="font-normal text-s text-blue-1000"
              >
                {t("forms.fields.customers.details.taxResidence")}
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
                className="w-full"
              />
            </div>
          )}
        />

        <Controller
          name="customerClassificationMIF"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="customerClassificationMIF">
                {t("forms.fields.customers.details.customerClassificationMIF")}
              </Label>
              <FieldText
                id="customerClassificationMIF"
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="classificationDate"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="classificationDate">
                {t("forms.fields.customers.details.classificationDate")}
              </Label>
              <FieldDate
                id="classificationDate"
                {...field}
                onValueChange={() => {
                  //
                }}
                value={field.value}
              />
            </div>
          )}
        />
        <Controller
          name="pep"
          control={control}
          render={({ field }) => (
            <div>
              <Text
                as="h3"
                className="leading-6 text-blue-1100 font-normal"
                label="forms.fields.customers.details.pep"
              />
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value === "true");
                }}
                defaultValue={`${field.value}`}
                className="flex"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="pep-true" value="true" />
                  <Label htmlFor="pep-true">{t("forms.fields.yes")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="pep-false" value="false" />
                  <Label htmlFor="pep-false">{t("forms.fields.no")}</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        />
        <Controller
          name="usPerson"
          control={control}
          render={({ field }) => (
            <div>
              <Text
                as="h3"
                className="leading-6 text-blue-1100 font-normal"
                label="forms.fields.customers.details.usPerson"
              />
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value === "true");
                }}
                defaultValue={`${field.value}`}
                className="flex"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="usPerson-true" value="true" />
                  <Label htmlFor="usPerson-true">{t("forms.fields.yes")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="usPerson-false" value="false" />
                  <Label htmlFor="usPerson-false">{t("forms.fields.no")}</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        />

        <Controller
          name="legalCapacity"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.customers.details.legalCapacity")}
              </Label>
              <Select
                id={field.name}
                {...field}
                value={legalCapacityOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => {
                  field.onChange(option?.value);
                }}
                options={legalCapacityOptions}
              />
            </div>
          )}
        />

        <Controller
          name="tag"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="tag">
                {t("forms.fields.customers.details.tag")}
              </Label>
              <FieldText
                id="idNumber"
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
      </div>
    </>
  );
}
