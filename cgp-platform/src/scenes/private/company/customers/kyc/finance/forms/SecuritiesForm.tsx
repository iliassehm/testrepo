import { t } from "i18next";
import { InputSwitch } from "primereact/inputswitch";
import { Controller, useForm } from "react-hook-form";

import { Button } from "../../../../../../../components";
import { getFormErrorMessage } from "../../../../../../../constants";
import { CustomerAsset } from "../../../../../../../types";
import FieldAmount from "../../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import Select from "../../../../../../../UIComponents/Select/Select";
import { categoryNames } from "../../../wealth/AssetCreation/SecuritiesForm";
import { SecuritiesFormData } from "../types";

interface SecuritiesFormProps {
  asset?: CustomerAsset;
  onSubmit: (data: SecuritiesFormData) => void;
  isLoading?: boolean;
}

export const SecuritiesForm = ({
  asset,
  onSubmit,
  isLoading,
}: SecuritiesFormProps) => {
  const defaultValues: SecuritiesFormData = {
    categoryName: asset?.categoryName ?? categoryNames[0].value,
    name: asset?.name ?? "",
    accountNumber: asset?.accountNumber ?? "",
    openDate: new Date(asset?.openDate) ?? new Date(),
    transfersAmount: asset?.metadata?.transfersAmount ?? 0,
    isUnderManagement: asset?.underManagement ?? true,
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const prefixField = "securities-";

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
                  inputId={`securities-${field.name}`}
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
              required: t(`forms.fields.wealth.walletName.error`) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.walletName.label`)}
                </Label>
                <FieldText
                  id={field.name}
                  data-testid={prefixField + field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(`forms.fields.wealth.walletName.placeholder`) || ""
                  }
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="accountNumber"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.securities.accountNumber`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.securities.accountNumber`)}
                </Label>
                <FieldText
                  id={field.name}
                  data-testid={prefixField + field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(`forms.fields.wealth.securities.accountNumber`) || ""
                  }
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>

        <div>
          <Controller
            name="openDate"
            control={control}
            rules={{
              required: t(`forms.fields.wealth.securities.date`) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.securities.date`)}
                </Label>
                <FieldDate
                  id={field.name}
                  {...field}
                  name={prefixField + field.name}
                  onValueChange={field.onChange}
                  className="bg-slate-50"
                  placeholder={t(`forms.fields.wealth.securities.date`) || ""}
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="transfersAmount"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.longTermAsset.transfersAmount.error`
              ) as string,
              validate: (value) =>
                value !== null ||
                (t(
                  `forms.fields.wealth.longTermAsset.transfersAmount.error`
                ) as string),
            }}
            render={({ field }) => (
              <div className="w-60">
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.longTermAsset.transfersAmount.label`)}
                </Label>
                <FieldAmount
                  id={field.name}
                  data-testid={prefixField + field.name}
                  {...field}
                  value={field.value as number}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(`forms.fields.wealth.amount.placeholder`) || ""
                  }
                />
                {getFormErrorMessage(field.name, errors)}
              </div>
            )}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          id={prefixField + "submit"}
          data-testid={prefixField + "submit"}
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
