import { t } from "i18next";
import { InputNumber } from "primereact/inputnumber";
import { Controller, useForm } from "react-hook-form";

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
import Select from "../../../../../../UIComponents/Select/Select";

interface PrivateEquityFormData {
  categoryName: string;
  metadata: {
    establishment: {
      name: string;
    };
    valuation: number;
    ownership: number;
    socialCapital: null;
    unitPrice: number | null;
    quantity: number | null;

    opened: Date;
    comment: string;
  };
  activity: {
    value: number;
    instrument: string;
  };
}

export const categoryNames = [
  { label: t("asset_categories.unlisted_company"), value: "unlisted_company" },
  {
    label: t("asset_categories.risk_capital"),
    value: "risk_capital",
  },
  {
    label: t("asset_categories.sme_direct_investment"),
    value: "sme_direct_investment",
  },
  { label: t("asset_categories.holding"), value: "holding" },
];
export const PrivateEquityForm = ({
  asset,
  onSubmit,
  isLoading,
  customerId,
}: {
  asset?: CustomerAsset;
  onSubmit: (data: PrivateEquityFormData) => void;
  type: AssetGroup;
  referenceInstrument: string;
  isLoading?: boolean;
  customerId: string;
}) => {
  const defaultValues: PrivateEquityFormData = {
    categoryName: asset?.categoryName ?? categoryNames[0].value,
    metadata: {
      establishment: {
        name: asset?.metadata?.establishment.name ?? "",
      },
      valuation: asset?.metadata?.valuation ?? null,
      ownership: asset?.owners?.find((owner) => owner.entity?.id === customerId)
        ?.ownership
        ? (asset.owners.find((owner) => owner.entity?.id === customerId)
            ?.ownership ?? 0) * 100
        : 100,
      socialCapital: asset?.metadata?.socialCapital ?? null,
      unitPrice: asset?.metadata?.unitPrice ?? null,
      quantity: asset?.metadata?.quantity ?? null,
      opened: asset?.metadata?.opened ?? new Date(),
      comment: asset?.metadata?.comment ?? "",
    },
    activity: {
      value: asset?.activity?.value ?? null,
      instrument: asset?.activity?.instrument ?? "EUR",
    },
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<PrivateEquityFormData>({ defaultValues });

  const formValues = watch();
  const currencyOptions = [
    { label: "Euro", value: "EUR" },
    { label: "Dollar", value: "USD" },
  ];

  return (
    <Widget className="pt-4">
      <form
        className="flex flex-col items-center"
        onSubmit={handleSubmit((data) =>
          onSubmit({
            ...data,
            metadata: {
              ...data.metadata,
              ownership: data.metadata.ownership / 100,
            },
          })
        )}
      >
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-xl bg-white">
            <Controller
              name="categoryName"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.privateEquity.categoryName.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.privateEquity.categoryName.label`)}
                  </Label>
                  <Select
                    id={field.name}
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
              name="metadata.establishment.name"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.privateEquity.name.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.privateEquity.name.label`)}
                  </Label>
                  <FieldText
                    id={field.name}
                    {...field}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.privateEquity.name.placeholder`) ||
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
              name="metadata.valuation"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.privateEquity.valuation.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.privateEquity.valuation.label`
                  ) as string),
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.privateEquity.valuation.label`)}
                  </Label>
                  <InputNumber
                    id={field.name}
                    value={field.value as number}
                    onChange={(e) => field.onChange(e.value as number)}
                    className="w-full border bg-slate-50"
                    inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                    mode="currency"
                    currency={formValues.activity.instrument}
                    locale="fr-FR"
                    maxFractionDigits={2}
                    placeholder={
                      t(
                        `forms.fields.wealth.privateEquity.valuation.placeholder`
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
              name="metadata.ownership"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.privateEquity.ownership.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.privateEquity.ownership.label`
                  ) as string),
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.privateEquity.ownership.label`)}
                  </Label>
                  <FieldPercentage
                    id={field.name}
                    {...field}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(
                        `forms.fields.wealth.privateEquity.ownership.placeholder`
                      ) || ""
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
              name="metadata.socialCapital"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.privateEquity.socialCapital.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.privateEquity.socialCapital.label`
                  ) as string),
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.privateEquity.socialCapital.label`)}
                  </Label>
                  <FieldAmount
                    id={field.name}
                    {...field}
                    value={field.value ?? ""}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(
                        `forms.fields.wealth.privateEquity.socialCapital.placeholder`
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
              name="metadata.unitPrice"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.privateEquity.unitPrice.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.privateEquity.unitPrice.label`
                  ) as string),
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.privateEquity.unitPrice.label`)}
                  </Label>
                  <InputNumber
                    id={field.name}
                    value={field.value as number}
                    onChange={(e) => {
                      field.onChange(e.value);
                      if (e.value && formValues.metadata.quantity) {
                        setValue(
                          "activity.value",
                          e.value * formValues.metadata.quantity
                        );
                      }
                    }}
                    className="w-full border bg-slate-50"
                    inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                    mode="currency"
                    currency={formValues.activity.instrument}
                    locale="fr-FR"
                    maxFractionDigits={2}
                    placeholder={
                      t(
                        `forms.fields.wealth.privateEquity.unitPrice.placeholder`
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
              name="metadata.quantity"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.privateEquity.quantity.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.privateEquity.quantity.label`
                  ) as string),
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.privateEquity.quantity.label`)}
                  </Label>
                  <FieldNumber
                    id={field.name}
                    {...field}
                    value={field.value as number}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(
                        `forms.fields.wealth.privateEquity.quantity.placeholder`
                      ) || ""
                    }
                    onChange={(quantity) => {
                      field.onChange(quantity);
                      if (formValues.metadata.unitPrice && quantity) {
                        setValue(
                          "activity.value",
                          formValues.metadata.unitPrice * quantity
                        );
                      }
                    }}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>

          <div className="rounded-xl bg-white">
            <Controller
              name="activity.value"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.privateEquity.value.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.privateEquity.value.label`
                  ) as string),
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.privateEquity.value.label`)}
                  </Label>
                  <InputNumber
                    id={field.name}
                    value={field.value as number}
                    onChange={(e) => field.onChange(e.value as number)}
                    className="w-full border bg-slate-50"
                    inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                    mode="currency"
                    currency={formValues.activity.instrument}
                    locale="fr-FR"
                    maxFractionDigits={2}
                    placeholder={
                      t(
                        `forms.fields.wealth.privateEquity.value.placeholder`
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
              name="activity.instrument"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.privateEquity.instrument.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.privateEquity.instrument.label`)}
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
                      t(
                        `forms.fields.wealth.privateEquity.instrument.placeholder`
                      ) || ""
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
              name="metadata.opened"
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
                    {t(`forms.fields.wealth.privateEquity.opened.label`)}
                  </Label>
                  <FieldDate
                    id={field.name}
                    {...field}
                    onValueChange={field.onChange}
                    className="border bg-slate-50"
                    placeholder={
                      t(
                        `forms.fields.wealth.privateEquity.opened.placeholder`
                      ) || ""
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
              name="metadata.comment"
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
