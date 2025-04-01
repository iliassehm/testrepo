import { t } from "i18next";
import { InputNumber } from "primereact/inputnumber";
import { Controller, useForm } from "react-hook-form";

import { Button } from "../../../../../../components";
import { Widget } from "../../../../../../components/Widget";
import { getFormErrorMessage } from "../../../../../../constants";
import { AssetGroup, CustomerAsset } from "../../../../../../types";
import FieldAmount from "../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { FieldTextarea } from "../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../UIComponents/Label/Label";
import Select, { Option } from "../../../../../../UIComponents/Select/Select";

interface StandardAssetFormData {
  bankName: string;
  accountType: string;
  amount?: number | null;
  currency: string;
  date: Date;
  categoryName: string;
  comment: string;
}

export const categoryNames = [
  { label: t("asset_categories.compte_courant"), value: "compte_courant" },
  {
    label: t("asset_categories.compte_sur_livret"),
    value: "compte_sur_livret",
  },
  { label: t("asset_categories.ldds"), value: "ldds" },
  { label: t("asset_categories.livret_a"), value: "livret_a" },
  { label: t("asset_categories.lep"), value: "lep" },
  { label: t("asset_categories.livret_jeune"), value: "livret_jeune" },
  { label: t("asset_categories.cel"), value: "cel" },
  { label: t("asset_categories.compte_terme"), value: "compte_terme" },
  {
    label: t("asset_categories.compte_courant_associ"),
    value: "compte_courant_associ",
  },
  { label: t("asset_categories.pel"), value: "pel" },
  { label: t("asset_categories.pep"), value: "pep" },
  { label: t("asset_categories.others_account"), value: "others_account" },
  { label: t("asset_categories.peg"), value: "peg" },
];

export const StandardAssetForm = ({
  asset,
  onSubmit,
  type,
  isLoading,
}: {
  asset?: CustomerAsset;
  onSubmit: (data: StandardAssetFormData) => void;
  type: AssetGroup;
  referenceInstrument: string;
  isLoading?: boolean;
}) => {
  const defaultValues: StandardAssetFormData = {
    bankName: asset?.metadata?.bank ?? "",
    accountType: asset?.metadata?.accountType ?? "",
    amount: asset?.activity?.value ?? null,
    currency: asset?.activity?.instrument ?? "",
    date: asset?.metadata?.date ?? new Date(),
    categoryName: asset?.categoryName ?? categoryNames[0].value,
    comment: asset?.metadata?.comment ?? "",
  };

  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({ defaultValues });

  const currencyOptions: Option[] = [
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
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div>
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
          {[AssetGroup.Banking, AssetGroup.RetirementEmployee].includes(
            type
          ) && (
            <div>
              <Controller
                name="bankName"
                control={control}
                rules={{
                  required: t(`forms.fields.wealth.bankName.error`) as string,
                }}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.bankName.label`)}
                    </Label>
                    <FieldText
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full border bg-slate-50"
                      placeholder={
                        t(`forms.fields.wealth.bankName.placeholder`) || ""
                      }
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>
          )}
          <div>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: t(`forms.fields.wealth.amount.error`) as string,
                validate: (value) =>
                  value !== null ||
                  (t(`forms.fields.wealth.amount.label`) as string),
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.amount.label`)}
                  </Label>
                  <InputNumber
                    id={field.name}
                    value={field.value as number}
                    onChange={(e) => field.onChange(e.value as number)}
                    className="w-full border bg-slate-50"
                    inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                    mode="currency"
                    currency={currencyValue ? currencyValue : "EUR"}
                    locale="fr-FR"
                    maxFractionDigits={2}
                    placeholder={
                      t(`forms.fields.wealth.amount.placeholder`) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div>
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
                    placeholder={
                      t(`forms.fields.wealth.currency.placeholder`) || ""
                    }
                    options={currencyOptions}
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
          <div>
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
                    className="bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.date.placeholder`) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>

          <div className="col-span-2 md:col-span-2 md:col-start-2">
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
