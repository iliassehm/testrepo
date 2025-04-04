import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "../../../../../../../components";
import { getFormErrorMessage } from "../../../../../../../constants";
import { AppartmentType, CustomerAsset } from "../../../../../../../types";
import FieldAmount from "../../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import FieldPercentage from "../../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import Select from "../../../../../../../UIComponents/Select/Select";
import { RealEstateAssetData } from "../types";

interface MainResidenceFormProps {
  isLoading: boolean;
  mainResidence: CustomerAsset | null;
  onSubmit: (data: RealEstateAssetData) => void;
}

export default function MainResidenceForm({
  isLoading,
  mainResidence,
  onSubmit,
}: MainResidenceFormProps) {
  const { t } = useTranslation();
  const maxBuyingDate = new Date(new Date().setDate(new Date().getDate() - 1));

  const housingOptions = [
    {
      label: t(`forms.fields.wealth.realEstate.type.apartment`) as string,
      value: AppartmentType.Simplex,
    },
    {
      label: t(`forms.fields.wealth.realEstate.type.home`) as string,
      value: AppartmentType.House,
    },
  ];

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RealEstateAssetData>({
    defaultValues: {
      name: "",
      annualRevenues: 0,
      source: "",
      ownership: 100,
      price: 0,
      valuation: 0,
      buyingDate: maxBuyingDate,
      typeId: AppartmentType.Simplex,
    },
  });

  useEffect(() => {
    if (mainResidence) {
      reset({
        name: mainResidence.name ?? "",
        annualRevenues: mainResidence.metadata?.annualRevenues ?? 0,
        source: mainResidence.metadata?.source ?? "",
        ownership: mainResidence.metadata?.ownership
          ? mainResidence.metadata?.ownership * 100
          : 100,
        price: mainResidence.metadata?.price ?? 0,
        buyingDate: mainResidence.metadata?.buyingDate ?? maxBuyingDate,
        typeId: mainResidence.metadata?.typeId ?? AppartmentType.Simplex,
        valuation: mainResidence.valuation ?? 0,
      });
    }
  }, [mainResidence, reset]);

  const prefixField = "mainResidence-";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Controller
          name="name"
          control={control}
          rules={{
            required: t(`forms.fields.wealth.realEstate.name.error`) as string,
            validate: (value) =>
              value !== "" ||
              (t(`forms.fields.wealth.realEstate.name.error`) as string),
          }}
          render={({ field }) => (
            <div>
              <Label
                htmlFor={field.name}
                data-testid={`${prefixField}${field.name}-label`}
              >
                {t(`forms.fields.wealth.realEstate.name.label`)}
              </Label>
              <FieldText
                id={field.name}
                data-testid={prefixField + field.name}
                {...field}
                placeholder={
                  t(`forms.fields.wealth.realEstate.name.placeholder`) || ""
                }
              />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />
        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <div>
              <Label
                htmlFor={field.name}
                data-testid={`${prefixField}${field.name}-label`}
              >
                {t(`forms.fields.wealth.realEstate.location.label`)}
              </Label>
              <FieldText
                id={field.name}
                data-testid={prefixField + field.name}
                {...field}
                placeholder={
                  t(`forms.fields.wealth.realEstate.location.placeholder`) || ""
                }
                value={field.value as string}
              />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />
        <Controller
          name="typeId"
          control={control}
          render={({ field }) => (
            <div>
              <Label
                htmlFor={field.name}
                data-testid={`${prefixField}${field.name}-label`}
              >
                {t(`forms.fields.wealth.realEstate.type.label`)}
              </Label>
              <Select
                id={field.name}
                {...field}
                name={prefixField + field.name}
                value={housingOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => {
                  if (option) {
                    field.onChange(option.value as AppartmentType);
                  }
                }}
                options={housingOptions}
                placeholder={
                  t(`forms.fields.wealth.realEstate.type.placeholder`) as string
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: "var(--bg-slate-50)",
                    borderColor: "var(--input-border-color)",
                  }),
                }}
              />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />
        <Controller
          name="buyingDate"
          control={control}
          render={({ field }) => (
            <div>
              <Label
                htmlFor={field.name}
                data-testid={`${prefixField}${field.name}-label`}
              >
                {t(`forms.fields.wealth.realEstate.buyingDate.label`)}
              </Label>
              <FieldDate
                id={field.name}
                {...field}
                name={prefixField + field.name}
                onValueChange={field.onChange}
                placeholder={
                  t(
                    `forms.fields.wealth.realEstate.buyingDate.placeholder`
                  ) as string
                }
              />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <div>
              <Label
                htmlFor={field.name}
                data-testid={`${prefixField}${field.name}-label`}
              >
                {t(`forms.fields.wealth.realEstate.buyingPrice.label`)}
              </Label>
              <FieldAmount
                id={field.name}
                data-testid={prefixField + field.name}
                {...field}
                value={field.value as number}
                placeholder={
                  t(`forms.fields.wealth.realEstate.buyingPrice.placeholder`) ||
                  ""
                }
              />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />
        <Controller
          name="ownership"
          control={control}
          rules={{
            required: t(
              `forms.fields.wealth.realEstate.detention.error`
            ) as string,
            validate: (value) =>
              value !== null ||
              (t(`forms.fields.wealth.realEstate.detention.error`) as string),
          }}
          render={({ field }) => (
            <div>
              <Label
                htmlFor={field.name}
                data-testid={`${prefixField}${field.name}-label`}
              >
                {t(`forms.fields.wealth.realEstate.detention.label`)}
              </Label>
              <FieldPercentage
                id={field.name}
                data-testid={prefixField + field.name}
                {...field}
                placeholder={
                  t(`forms.fields.wealth.realEstate.detention.placeholder`) ||
                  ""
                }
              />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />
        <Controller
          name="annualRevenues"
          control={control}
          render={({ field }) => (
            <div>
              <Label
                htmlFor={field.name}
                data-testid={`${prefixField}${field.name}-label`}
              >
                {t(`forms.fields.wealth.realEstate.annualRevenues.label`)}
              </Label>
              <FieldAmount
                id={field.name}
                data-testid={prefixField + field.name}
                {...field}
                value={field.value as number}
                className="w-full border bg-slate-50"
                placeholder={
                  t(
                    `forms.fields.wealth.realEstate.annualRevenues.placeholder`
                  ) || ""
                }
              />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />
        <Controller
          name="valuation"
          control={control}
          rules={{
            required: t(
              `forms.fields.wealth.realEstate.valuation.error`
            ) as string,
            validate: (value) =>
              value !== 0 ||
              (t(`forms.fields.wealth.realEstate.valuation.error`) as string),
          }}
          render={({ field }) => (
            <div>
              <Label
                htmlFor={field.name}
                data-testid={`${prefixField}${field.name}-label`}
              >
                {t(`forms.fields.wealth.realEstate.valuation.label`)}
              </Label>
              <FieldAmount
                id={field.name}
                data-testid={prefixField + field.name}
                {...field}
                value={field.value as number}
                className="w-full border bg-slate-50"
                placeholder={
                  t(`forms.fields.wealth.realEstate.valuation.placeholder`) ||
                  ""
                }
              />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />
      </div>

      <div className="flex justify-end">
        <Button
          data-testid={`${prefixField}submit`}
          label={
            mainResidence?.id
              ? t(`forms.fields.actions.update`)
              : t(`forms.fields.actions.add`)
          }
          type="submit"
          icon="pi pi-plus"
          loading={isLoading}
        />
      </div>
    </form>
  );
}
