import { t } from "i18next";
import { InputSwitch } from "primereact/inputswitch";
import { Controller, useForm } from "react-hook-form";

import { Button } from "../../../../../../../components";
import { getFormErrorMessage } from "../../../../../../../constants";
import { CustomerAsset } from "../../../../../../../types";
import FieldAmount from "../../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import FieldPercentage from "../../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import Select, {
  Option,
} from "../../../../../../../UIComponents/Select/Select";
import { categoryNames } from "../../../wealth/AssetCreation/CrowdfundingForm";
import { CrowdfundingFormData } from "../types";

interface CrowdfundingFormProps {
  asset?: CustomerAsset;
  onSubmit: (data: CrowdfundingFormData) => void;
  isLoading?: boolean;
}

export const CrowdfundingForm = ({
  asset,
  onSubmit,
  isLoading,
}: CrowdfundingFormProps) => {
  const defaultValues: CrowdfundingFormData = {
    provider: asset?.metadata?.providerName ?? "",
    investDomain: asset?.metadata?.investmentField ?? "",
    investedCapital: asset?.valuation ?? null,
    currency: asset?.activity?.instrument ?? "EUR",
    yield: asset?.metadata?.efficiency ?? 100,
    startDate: asset?.metadata?.date ?? new Date(),
    endDate: asset?.metadata?.endDate ?? new Date(),
    categoryName: asset?.categoryName ?? categoryNames[0].value,
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

  const prefixField = "crowdfunding-";

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                  inputId={`crowdfunding-${field.name}`}
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
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.crowdfunding.provider.label`)}
                </Label>
                <FieldText
                  id={field.name}
                  data-testid={prefixField + field.name}
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
        <div>
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
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.crowdfunding.investDomain.label`)}
                </Label>
                <FieldText
                  id={field.name}
                  data-testid={prefixField + field.name}
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
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
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
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.crowdfunding.yield.label`)}
                </Label>
                <FieldPercentage
                  id={field.name}
                  data-testid={prefixField + field.name}
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
        <div>
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
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.crowdfunding.startDate.label`)}
                </Label>
                <FieldDate
                  id={field.name}
                  {...field}
                  name={prefixField + field.name}
                  onValueChange={field.onChange}
                  className="bg-slate-50 w-full"
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
        <div>
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
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.crowdfunding.endDate.label`)}
                </Label>
                <FieldDate
                  id={field.name}
                  {...field}
                  name={prefixField + field.name}
                  onValueChange={field.onChange}
                  className="bg-slate-50 w-full"
                  placeholder={
                    t(`forms.fields.wealth.crowdfunding.endDate.placeholder`) ||
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
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.crowdfunding.investedCapital.label`)}
                </Label>
                <FieldAmount
                  id={field.name}
                  data-testid={prefixField + field.name}
                  {...field}
                  value={field.value as number}
                  className="w-full border bg-slate-50"
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
