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
import {
  accountType,
  categoryNames,
  scheduledPaymentList,
} from "../../../wealth/AssetCreation/RetirementEmployeeForm";
import { RetirementEmployeeFormData } from "../types";

interface RetirementEmployeeFormProps {
  asset?: CustomerAsset;
  onSubmit: (data: RetirementEmployeeFormData) => void;
  isLoading?: boolean;
}

export const RetirementEmployeeForm = ({
  asset,
  onSubmit,
  isLoading,
}: RetirementEmployeeFormProps) => {
  const defaultValues: RetirementEmployeeFormData = {
    categoryName: asset?.categoryName ?? categoryNames[0].value,
    contractName: asset?.name ?? "",
    accountNumber: asset?.accountNumber ?? "",
    insuranceCompany: asset?.metadata?.bank ?? "",
    date: asset?.openDate ? new Date(asset?.openDate) : new Date(),
    beneficiaryClause: asset?.metadata?.beneficiary_clause ?? "",
    transfersAmount: asset?.metadata?.transfersAmount ?? 0,
    scheduledPaymentList:
      asset?.metadata?.scheduledPaymentList ?? scheduledPaymentList[0].value,
    scheduledPayment: asset?.metadata?.scheduledPayment ?? 0,
    accountType: asset?.metadata?.type ?? accountType[0].value,
    isUnderManagement: asset?.underManagement ?? true,
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const prefixField = "retirementEmployee-";

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
                  inputId={`retirementEmployee-${field.name}`}
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
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
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
            name="contractName"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.lifeInsurance.contractName.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.lifeInsurance.contractName.label`)}
                </Label>
                <FieldText
                  id={field.name}
                  data-testid={prefixField + field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(
                      `forms.fields.wealth.lifeInsurance.contractName.placeholder`
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
            name="accountNumber"
            control={control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.lifeInsurance.contractNumber`)}
                </Label>
                <FieldText
                  id={field.name}
                  data-testid={prefixField + field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(`forms.fields.wealth.lifeInsurance.contractNumber`) || ""
                  }
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="insuranceCompany"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.lifeInsurance.insuranceCompany.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(
                    `forms.fields.wealth.lifeInsurance.insuranceCompany.label`
                  )}
                </Label>
                <FieldText
                  id={field.name}
                  data-testid={prefixField + field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(
                      `forms.fields.wealth.lifeInsurance.insuranceCompany.placeholder`
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
            name="date"
            control={control}
            rules={{
              required: t(`forms.fields.wealth.lifeInsurance.date`) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.lifeInsurance.date`)}
                </Label>
                <FieldDate
                  id={field.name}
                  {...field}
                  name={prefixField + field.name}
                  onValueChange={field.onChange}
                  className="bg-slate-50"
                  placeholder={
                    t(`forms.fields.wealth.lifeInsurance.date`) || ""
                  }
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
        <div>
          <Controller
            name="beneficiaryClause"
            control={control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(
                    `forms.fields.wealth.longTermAsset.beneficiaryClause.label`
                  )}
                </Label>
                <FieldText
                  id={field.name}
                  data-testid={prefixField + field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(
                      `forms.fields.wealth.longTermAsset.beneficiaryClause.placeholder`
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
            name="transfersAmount"
            control={control}
            render={({ field }) => (
              <div className="">
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
                    t(
                      `forms.fields.wealth.longTermAsset.transfersAmount.placeholder`
                    ) || ""
                  }
                />
                {getFormErrorMessage(field.name, errors)}
              </div>
            )}
          />
        </div>
        <div>
          <Controller
            name="scheduledPaymentList"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.longTermAsset.scheduledPayment.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(
                    `forms.fields.wealth.longTermAsset.scheduledPayment.label`
                  )}
                </Label>
                <Select
                  id={field.name}
                  name={prefixField + field.name}
                  value={{
                    value: field.value,
                    label: t("forms.fields.cycles." + field.value) as string,
                  }}
                  onChange={(option) => field.onChange(option?.value)}
                  options={scheduledPaymentList}
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
            name="scheduledPayment"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.longTermAsset.scheduledPayment.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(
                    `forms.fields.wealth.longTermAsset.scheduledPayment.preLabel`
                  )}
                </Label>
                <FieldAmount
                  id={field.name}
                  data-testid={prefixField + field.name}
                  {...field}
                  value={field.value as number}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(
                      `forms.fields.wealth.longTermAsset.scheduledPayment.placeholder`
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
            name="accountType"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.lifeInsurance.accountType.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.lifeInsurance.accountType.label`)}
                </Label>
                <Select
                  id={field.name}
                  name={prefixField + field.name}
                  value={{
                    value: field.value,
                    label: t(
                      "forms.fields.wealth.lifeInsurance.accountType." +
                        field.value
                    ) as string,
                  }}
                  onChange={(option) => field.onChange(option?.value)}
                  options={accountType}
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
