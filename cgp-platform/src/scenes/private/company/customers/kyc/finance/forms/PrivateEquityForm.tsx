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
import { categoryNames } from "../../../wealth/AssetCreation/PrivateEquityForm";
import { PrivateEquityFormData } from "../types";

interface PrivateEquityFormProps {
  asset?: CustomerAsset;
  onSubmit: (data: PrivateEquityFormData) => void;
  isLoading?: boolean;
}

export const PrivateEquityForm = ({
  asset,
  onSubmit,
  isLoading,
}: PrivateEquityFormProps) => {
  const defaultValues: PrivateEquityFormData = {
    categoryName: asset?.categoryName ?? categoryNames[0].value,
    name: asset?.metadata?.establishment?.name ?? "",
    valuation: asset?.metadata?.valuation ?? null,
    ownership: asset?.metadata?.ownership
      ? asset?.metadata?.ownership * 100
      : 100,
    socialCapital: asset?.metadata?.socialCapital ?? null,
    unitPrice: asset?.metadata?.unitPrice ?? null,
    quantity: asset?.metadata?.quantity ?? null,
    opened: asset?.metadata?.opened ?? new Date(),
    value: asset?.valuation ?? null,
    currency: asset?.activity?.instrument ?? "EUR",
    isUnderManagement: asset?.underManagement ?? true,
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({ defaultValues });

  const formValues = watch();
  const currencyOptions: Option[] = [
    { label: "Euro", value: "EUR" },
    { label: "Dollar", value: "USD" },
  ];

  const prefixField = "privateEquity-";

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
                  inputId={`privateEquity-${field.name}`}
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
            name="categoryName"
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
                  {t(`forms.fields.category`)}
                </Label>
                <Select
                  id={field.name}
                  name={prefixField + field.name}
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
            name="name"
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
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.privateEquity.name.label`)}
                </Label>
                <FieldText
                  id={field.name}
                  data-testid={prefixField + field.name}
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
        <div>
          <Controller
            name="valuation"
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
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.privateEquity.valuation.label`)}
                </Label>
                <FieldAmount
                  id={field.name}
                  data-testid={prefixField + field.name}
                  {...field}
                  value={field.value as number}
                  className="w-full border bg-slate-50"
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
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Controller
            name="ownership"
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
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.privateEquity.ownership.label`)}
                </Label>
                <FieldPercentage
                  id={field.name}
                  data-testid={prefixField + field.name}
                  {...field}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(
                      `forms.fields.wealth.privateEquity.ownership.placeholder`
                    ) || ""
                  }
                  type="percent"
                />
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="socialCapital"
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
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.privateEquity.socialCapital.label`)}
                </Label>
                <FieldAmount
                  id={field.name}
                  data-testid={prefixField + field.name}
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
        <div>
          <Controller
            name="unitPrice"
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
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.privateEquity.unitPrice.label`)}
                </Label>
                <FieldAmount
                  id={field.name}
                  data-testid={prefixField + field.name}
                  {...field}
                  value={field.value as number}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(
                      `forms.fields.wealth.privateEquity.unitPrice.placeholder`
                    ) || ""
                  }
                  onChange={(unitPrice) => {
                    field.onChange(unitPrice);
                    if (unitPrice && formValues.quantity) {
                      setValue("value", unitPrice * formValues.quantity);
                    }
                  }}
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
            name="quantity"
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
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.privateEquity.quantity.label`)}
                </Label>
                <FieldNumber
                  id={field.name}
                  data-testid={prefixField + field.name}
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
                    if (formValues.unitPrice && quantity) {
                      setValue("value", formValues.unitPrice * quantity);
                    }
                  }}
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="value"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.privateEquity.value.error`
              ) as string,
              validate: (value) =>
                value !== null ||
                (t(`forms.fields.wealth.privateEquity.value.label`) as string),
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.privateEquity.value.label`)}
                </Label>
                <FieldAmount
                  id={field.name}
                  data-testid={prefixField + field.name}
                  {...field}
                  value={field.value as number}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(`forms.fields.wealth.privateEquity.value.placeholder`) ||
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
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Controller
            name="opened"
            control={control}
            rules={{
              required: t(`forms.fields.wealth.requiredDate.error`) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.privateEquity.opened.label`)}
                </Label>
                <FieldDate
                  id={field.name}
                  {...field}
                  name={prefixField + field.name}
                  onValueChange={field.onChange}
                  className="border bg-slate-50"
                  placeholder={
                    t(`forms.fields.wealth.privateEquity.opened.placeholder`) ||
                    ""
                  }
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
