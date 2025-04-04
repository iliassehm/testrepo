import { t } from "i18next";
import { InputNumber } from "primereact/inputnumber";
import { Controller, useForm } from "react-hook-form";

import { Button } from "../../../../../../components";
import { Widget } from "../../../../../../components/Widget";
import { getFormErrorMessage } from "../../../../../../constants";
import { AssetGroup, CustomerAsset } from "../../../../../../types";
import FieldAmount from "../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import FieldPercentage from "../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { FieldTextarea } from "../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../UIComponents/Label/Label";
import Select, { Option } from "../../../../../../UIComponents/Select/Select";

interface CrowdfundingFormData {
  provider: string;
  investDomain: string;
  startDate: Date;
  endDate: Date;
  yield: number;
  investedCapital?: number | null;
  currency: string;
  categoryName: string;
  comment: string;
}

export const categoryNames = [
  {
    label: t("asset_categories.crowdfunding_realestate"),
    value: "crowdfunding_realestate",
  },
  {
    label: t("asset_categories.crowdfunding_entreprises"),
    value: "crowdfunding_entreprises",
  },
  {
    label: t("asset_categories.crowdfunding_others"),
    value: "crowdfunding_others",
  },
];

export const CrowdfundingForm = ({
  asset,
  onSubmit,
  isLoading,
}: {
  asset?: CustomerAsset;
  onSubmit: (data: CrowdfundingFormData) => void;
  type: AssetGroup;
  referenceInstrument: string;
  isLoading?: boolean;
}) => {
  const defaultValues: CrowdfundingFormData = {
    provider: asset?.metadata?.providerName ?? "",
    investDomain: asset?.metadata?.investmentField ?? "",
    investedCapital: asset?.activity?.value ?? null,
    currency: asset?.activity?.instrument ?? "EUR",
    yield: asset?.metadata?.efficiency ?? 1,
    startDate: asset?.metadata?.date ?? new Date(),
    endDate: asset?.metadata?.endDate ?? new Date(),
    categoryName: asset?.categoryName ?? categoryNames[0].value,
    comment: asset?.metadata?.comment ?? "",
  };

  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({ defaultValues });

  const currencyOptions = [
    { label: "Euro", value: "EUR" },
    { label: "Dollar", value: "USD" },
  ];

  const currencyValue = watch("currency");

  return (
    <Widget className="pt-4">
      <form
        className="flex flex-col items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-xl bg-white">
            <Controller
              name="categoryName"
              control={control}
              rules={{
                required: t(`forms.fields.wealth.currency.error`) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.category`)}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={{
                      value: field.value,
                      label: t("asset_categories." + field.value) as string,
                    }}
                    onChange={(option) => field.onChange(option?.value)}
                    options={categoryNames}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "var(--bg-slate-50)",
                        borderColor: "var(--input-border-color)",
                        zIndex: 9999,
                      }),
                    }}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="provider"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.crowdfunding.provider.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.crowdfunding.provider.label`)}
                  </Label>
                  <FieldText
                    id={field.name}
                    {...field}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(
                        `forms.fields.wealth.crowdfunding.provider.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="investDomain"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.crowdfunding.investDomain.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.crowdfunding.investDomain.label`)}
                  </Label>
                  <FieldText
                    id={field.name}
                    {...field}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(
                        `forms.fields.wealth.crowdfunding.investDomain.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="startDate"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.crowdfunding.startDate.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.crowdfunding.startDate.label`)}
                  </Label>
                  <FieldDate
                    id={field.name}
                    {...field}
                    onValueChange={field.onChange}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(
                        `forms.fields.wealth.crowdfunding.startDate.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="endDate"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.crowdfunding.endDate.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.crowdfunding.endDate.label`)}
                  </Label>
                  <FieldDate
                    id={field.name}
                    {...field}
                    onValueChange={field.onChange}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(
                        `forms.fields.wealth.crowdfunding.endDate.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="yield"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.crowdfunding.yield.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(`forms.fields.wealth.crowdfunding.yield.label`) as string),
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.crowdfunding.yield.label`)}
                  </Label>
                  <FieldPercentage
                    id={field.name}
                    {...field}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.crowdfunding.yield.placeholder`) ||
                      ""
                    }
                  />
                </>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="investedCapital"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.crowdfunding.investedCapital.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.crowdfunding.investedCapital.label`
                  ) as string),
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(
                      `forms.fields.wealth.crowdfunding.investedCapital.label`
                    )}
                  </Label>
                  <InputNumber
                    id={field.name}
                    value={field.value as number}
                    onChange={(e) => field.onChange(e.value as number)}
                    className="w-full border bg-slate-50"
                    inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                    mode="currency"
                    currency={currencyValue}
                    locale="fr-FR"
                    maxFractionDigits={2}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="currency"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.crowdfunding.currency.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.currency.label`)}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={currencyOptions?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                    options={currencyOptions}
                    placeholder={
                      t(`forms.fields.wealth.currency.placeholder`) || ""
                    }
                    className="w-full"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "var(--bg-slate-50)",
                        borderColor: "var(--input-border-color)",
                      }),
                    }}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
        </div>
        <div className="grid mt-6 w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
          <div className="col-span-2 md:col-span-3 md:col-start-2">
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.comment`)}
                  </Label>
                  <FieldTextarea
                    className="pl-2 pr-2"
                    id={field.name}
                    {...field}
                    value={field.value as string}
                  />
                </>
              )}
            />
          </div>
        </div>
        <Button
          label={
            asset?.id
              ? t(`forms.fields.actions.update`)
              : t(`forms.fields.actions.add`)
          }
          type="submit"
          icon="pi pi-plus"
          className="mx-auto mt-10"
          loading={isLoading}
        />
      </form>
    </Widget>
  );
};
