import { InputNumber } from "primereact/inputnumber";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "../../../../../../components";
import { Widget } from "../../../../../../components/Widget";
import { getFormErrorMessage } from "../../../../../../constants";
import { AssetGroup, CustomerAsset } from "../../../../../../types";
import FieldAmount from "../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldNumber } from "../../../../../../UIComponents/FieldNumber/FieldNumber";
import FieldPercentage from "../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { FieldTextarea } from "../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../UIComponents/Label/Label";
import Select, { Option } from "../../../../../../UIComponents/Select/Select";

interface ExoticFormData {
  name: string;
  category: string;
  buyingValue: number | null;
  currentValue: number | null;
  quantity: number | null;
  currency: string;
  ownership: number;
  date: Date;
  comment: string;
}

export const ExoticForm = ({
  asset,
  onSubmit,
  isLoading,
  customerId,
}: {
  asset?: CustomerAsset;
  onSubmit: (data: ExoticFormData) => void;
  type: AssetGroup;
  referenceInstrument: string;
  isLoading?: boolean;
  customerId: string;
}) => {
  const { t } = useTranslation();

  const defaultValues: ExoticFormData = {
    name: asset?.name ?? "",
    category: asset?.metadata?.category ?? "",
    buyingValue: asset?.metadata?.buyingValue ?? null,
    currentValue: asset?.activity?.value ?? null,
    quantity: asset?.metadata?.quantity ?? null,
    currency: asset?.activity?.instrument ?? "EUR",
    ownership: asset?.owners?.find((owner) => owner.entity?.id === customerId)
      ?.ownership
      ? (asset.owners.find((owner) => owner.entity?.id === customerId)
          ?.ownership ?? 0) * 100
      : 100,
    date: asset?.metadata?.purchaseDate ?? new Date(),
    comment: asset?.metadata?.comment ?? "",
  };

  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<ExoticFormData>({ defaultValues });

  const currencyOptions = [
    { label: "Euro", value: "EUR" },
    { label: "Dollar", value: "USD" },
  ];

  const currencyValue = watch("currency");

  const exoticCategoriTypes = t("asset_categories_exotic", {
    returnObjects: true,
  }) as Record<string, string>;
  const exoticCategories = Object.keys(exoticCategoriTypes).map((key) => ({
    label: exoticCategoriTypes[key],
    value: key,
  }));

  return (
    <Widget className="pt-4">
      <form
        className="flex flex-col items-center"
        onSubmit={handleSubmit((data) =>
          onSubmit({
            ...data,
            ownership: data.ownership / 100,
          })
        )}
      >
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-xl bg-white">
            <Controller
              name="name"
              control={control}
              rules={{
                required: t(`forms.fields.wealth.exotic.name.error`) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.exotic.name.label`)}
                  </Label>

                  <FieldText
                    id={field.name}
                    {...field}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.exotic.name.placeholder`) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="category"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.exotic.category.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.exotic.category.label`)}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={exoticCategories.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                    options={exoticCategories as Option[]}
                    className="w-full"
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="buyingValue"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.exotic.buyingValue.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(`forms.fields.wealth.exotic.buyingValue.label`) as string),
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.exotic.buyingValue.label`)}
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
                    placeholder={
                      t(`forms.fields.wealth.exotic.buyingValue.placeholder`) ||
                      ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="currentValue"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.exotic.currentValue.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.exotic.currentValue.label`
                  ) as string),
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.exotic.currentValue.label`)}
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
                    placeholder={
                      t(
                        `forms.fields.wealth.exotic.currentValue.placeholder`
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
              name="quantity"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.exotic.quantity.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(`forms.fields.wealth.exotic.quantity.label`) as string),
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.exotic.quantity.label`)}
                  </Label>
                  <FieldNumber
                    id={field.name}
                    {...field}
                    value={field.value as number}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.exotic.quantity.placeholder`) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="ownership"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.exotic.ownership.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(`forms.fields.wealth.exotic.ownership.label`) as string),
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.exotic.ownership.label`)}
                  </Label>
                  <FieldPercentage
                    id={field.name}
                    {...field}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.exotic.ownership.placeholder`) ||
                      ""
                    }
                    type="percent"
                    maxVal={100}
                  />
                </>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="currency"
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
          <div className="rounded-xl bg-white">
            <Controller
              name="date"
              control={control}
              rules={{
                required: t(`forms.fields.wealth.requiredDate.error`) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.date.label`)}
                  </Label>
                  <FieldDate
                    id={field.name}
                    {...field}
                    onValueChange={field.onChange}
                    className="border bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.date.placeholder`) || ""
                    }
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
