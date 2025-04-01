import { t } from "i18next";
import { InputSwitch } from "primereact/inputswitch";
import { Controller, useForm } from "react-hook-form";

import { Button } from "../../../../../../../components";
import { getFormErrorMessage } from "../../../../../../../constants";
import { CustomerAsset } from "../../../../../../../types";
import FieldAmount from "../../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldNumber } from "../../../../../../../UIComponents/FieldNumber/FieldNumber";
import FieldPercentage from "../../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import Select, {
  Option,
} from "../../../../../../../UIComponents/Select/Select";
import { ExoticFormData } from "../types";

interface ExoticFormProps {
  asset?: CustomerAsset;
  onSubmit: (data: ExoticFormData) => void;
  isLoading?: boolean;
}

export const ExoticForm = ({ asset, onSubmit, isLoading }: ExoticFormProps) => {
  const defaultValues: ExoticFormData = {
    name: asset?.name ?? "",
    category: asset?.metadata?.category ?? "",
    buyingValue: asset?.metadata?.buyingValue ?? null,
    currentValue: asset?.valuation ?? null,
    quantity: asset?.metadata?.quantity ?? null,
    currency: asset?.activity?.instrument ?? "EUR",
    ownership: asset?.metadata?.ownership
      ? asset?.metadata?.ownership * 100
      : 100,
    date: asset?.metadata?.purchaseDate ?? new Date(),
    isUnderManagement: asset?.underManagement ?? true,
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const currencyOptions: Option[] = [
    { label: "Euro", value: "EUR" },
    { label: "Dollar", value: "USD" },
  ];

  const exoticCategoriTypes = t("asset_categories_exotic", {
    returnObjects: true,
  }) as Record<string, string>;
  const exoticCategories = Object.keys(exoticCategoriTypes).map((key) => ({
    label: exoticCategoriTypes[key],
    value: key,
  }));

  const prefixField = "exotic-";

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((e) =>
        onSubmit({ ...e, ownership: e.ownership / 100 })
      )}
    >
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Controller
            name="isUnderManagement"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Label htmlFor={field.name} className="text-blue-1000">
                  {field.value
                    ? t(`forms.fields.wealth.isUnderManagement`)
                    : t(`forms.fields.wealth.isNotUnderManagement`)}
                </Label>
                <InputSwitch
                  inputId={`banking-${field.name}`}
                  checked={field.value}
                  onChange={field.onChange}
                  name={field.name}
                  ref={field.ref}
                />
              </div>
            )}
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
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
                  data-testid={prefixField + field.name}
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
        <div>
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
                  name={prefixField + field.name}
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
        <div>
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
                <FieldAmount
                  id={field.name}
                  data-testid={prefixField + field.name}
                  {...field}
                  value={field.value as number}
                  className="w-full border bg-slate-50"
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
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Controller
            name="currentValue"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.exotic.currentValue.error`
              ) as string,
              validate: (value) =>
                value !== null ||
                (t(`forms.fields.wealth.exotic.currentValue.label`) as string),
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.exotic.currentValue.label`)}
                </Label>
                <FieldAmount
                  id={field.name}
                  data-testid={prefixField + field.name}
                  {...field}
                  value={field.value as number}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(`forms.fields.wealth.exotic.currentValue.placeholder`) ||
                    ""
                  }
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
        <div>
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
                  data-testid={prefixField + field.name}
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
        <div>
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
                  data-testid={prefixField + field.name}
                  {...field}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(`forms.fields.wealth.exotic.ownership.placeholder`) || ""
                  }
                  type="percent"
                />
              </>
            )}
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
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
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.currency.label`)}
                </Label>
                <Select
                  id={field.name}
                  {...field}
                  name={prefixField + field.name}
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
                  name={prefixField + field.name}
                  onValueChange={field.onChange}
                  className="border bg-slate-50"
                  placeholder={t(`forms.fields.wealth.date.placeholder`) || ""}
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          id={prefixField + "submit"}
          label={
            asset?.id
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
};
