import { t } from "i18next";
import { Checkbox } from "primereact/checkbox";
import { InputSwitch } from "primereact/inputswitch";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "../../../../../../../components";
import { getFormErrorMessage } from "../../../../../../../constants";
import { CustomerAsset } from "../../../../../../../types";
import FieldAmount from "../../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { FieldTextarea } from "../../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import Select from "../../../../../../../UIComponents/Select/Select";
import {
  accountType,
  scheduledPaymentList,
} from "../../../wealth/AssetCreation/BenefitsForm";
import { categoryNames } from "../../../wealth/AssetCreation/BenefitsForm";
import { BenefitsFormData } from "../types";

interface BenefitsFormProps {
  asset?: CustomerAsset;
  onSubmit: (data: BenefitsFormData) => void;
  isLoading?: boolean;
}

export const BenefitsForm = ({
  asset,
  onSubmit,
  isLoading,
}: BenefitsFormProps) => {
  const defaultValues: BenefitsFormData = {
    categoryName: asset?.categoryName ?? categoryNames[0].value,
    accountNumber: asset?.accountNumber ?? "",
    insuranceCompany: asset?.metadata?.bank ?? "",
    name: asset?.name ?? "",
    date: new Date(asset?.openDate) ?? new Date(),
    scheduledPayment: asset?.metadata?.scheduledPayment ?? 0,
    scheduledPaymentList:
      asset?.metadata?.scheduledPaymentList ?? scheduledPaymentList[0].value,
    accountType: asset?.metadata?.type ?? accountType[0].value,
    maintenanceSalaryIsChecked:
      asset?.metadata?.guarantees?.maintenance_salary?.isChecked ?? false,
    maintenanceSalaryLabel:
      asset?.metadata?.guarantees?.maintenance_salary?.label ?? "",
    maintenanceDisabilityIsChecked:
      asset?.metadata?.guarantees?.maintenance_disability?.isChecked ?? false,
    maintenanceDisabilityLabel:
      asset?.metadata?.guarantees?.maintenance_disability?.label ?? "",
    maintenanceDeathIsChecked:
      asset?.metadata?.guarantees?.maintenance_death?.isChecked ?? false,
    maintenanceDeathLabel:
      asset?.metadata?.guarantees?.maintenance_death?.label ?? "",
    isUnderManagement: asset?.underManagement ?? true,
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const maintenanceSalaryChecked = useWatch({
    control,
    name: "maintenanceSalaryIsChecked",
  });
  const maintenanceDisabilityChecked = useWatch({
    control,
    name: "maintenanceDisabilityIsChecked",
  });
  const maintenanceDeathChecked = useWatch({
    control,
    name: "maintenanceDeathIsChecked",
  });

  const prefixField = "benefits-";

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
                  inputId={`benefits-${field.name}`}
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
            name="accountNumber"
            control={control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.benefits.accountNumber`)}
                </Label>
                <FieldText
                  id={field.name}
                  data-testid={prefixField + field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(`forms.fields.wealth.benefits.accountNumber`) || ""
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
                `forms.fields.wealth.benefits.insuranceCompany.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.benefits.insuranceCompany.label`)}
                </Label>
                <FieldText
                  id={field.name}
                  data-testid={prefixField + field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(
                      `forms.fields.wealth.benefits.insuranceCompany.placeholder`
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
            name="name"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.benefits.contractName.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.benefits.contractName.label`)}
                </Label>
                <FieldText
                  id={field.name}
                  data-testid={prefixField + field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(
                      `forms.fields.wealth.benefits.contractName.placeholder`
                    ) || ""
                  }
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
            name="date"
            control={control}
            rules={{
              required: t(`forms.fields.wealth.benefits.date`) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.benefits.date`)}
                </Label>
                <FieldDate
                  id={field.name}
                  {...field}
                  name={prefixField + field.name}
                  onValueChange={field.onChange}
                  className="bg-slate-50 w-full"
                  placeholder={t(`forms.fields.wealth.benefits.date`) || ""}
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
                `forms.fields.wealth.benefits.scheduledPayment.error`
              ) as string,
              validate: (value) =>
                value !== null ||
                (t(
                  `forms.fields.wealth.benefits.scheduledPayment.error`
                ) as string),
            }}
            render={({ field }) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.benefits.scheduledPayment.label`)}
                </Label>
                <FieldAmount
                  id={field.name}
                  data-testid={prefixField + field.name}
                  {...field}
                  value={field.value as number}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(
                      `forms.fields.wealth.benefits.scheduledPayment.placeholder`
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
                `forms.fields.wealth.benefits.scheduledPayment.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.benefits.scheduledPayment.preLabel`)}
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
            name="accountType"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.scpi.accountType.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.scpi.accountType.label`)}
                </Label>
                <Select
                  id={field.name}
                  name={prefixField + field.name}
                  value={{
                    value: field.value,
                    label: t(
                      "forms.fields.wealth.scpi.accountType." + field.value
                    ) as string,
                  }}
                  onChange={(option) => field.onChange(option?.value)}
                  options={accountType}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "var(--bg-slate-50)",
                      borderColor: "var(--input-border-color)",
                      zIndex: 9,
                    }),
                  }}
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <div className="mb-2">
            <Controller
              name="maintenanceSalaryIsChecked"
              control={control}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="mr-4 font-medium text-xs text-blue-1000"
                  >
                    {t(
                      `forms.fields.wealth.benefits.guarantees.maintenance_salary`
                    )}
                  </Label>
                  <Checkbox
                    id="maintenance_disability"
                    data-testid={prefixField + field.name}
                    name="guarantees-maintenance_disability"
                    checked={field.value ?? false}
                    onChange={() => {
                      field.onChange(!field.value);
                    }}
                  />
                </>
              )}
            />
          </div>
          <div className="bg-slate-50">
            <Controller
              name="maintenanceSalaryLabel"
              control={control}
              render={({ field }) => (
                <>
                  <FieldTextarea
                    className="px-2"
                    disabledValue={!maintenanceSalaryChecked}
                    id={field.name}
                    {...field}
                    value={field.value as string}
                  />
                </>
              )}
            />
          </div>
        </div>
        <div>
          <div className="mb-2">
            <Controller
              name="maintenanceDisabilityIsChecked"
              control={control}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="mr-4 font-medium text-xs text-blue-1000"
                  >
                    {t(
                      `forms.fields.wealth.benefits.guarantees.maintenance_disability`
                    )}
                  </Label>
                  <Checkbox
                    id="maintenance_disability"
                    data-testid={prefixField + field.name}
                    name="guarantees-maintenance_disability"
                    checked={field.value ?? false}
                    onChange={() => {
                      field.onChange(!field.value);
                    }}
                  />
                </>
              )}
            />
          </div>
          <div className="bg-slate-50">
            <Controller
              name="maintenanceDisabilityLabel"
              control={control}
              render={({ field }) => (
                <>
                  <FieldTextarea
                    className="px-2"
                    disabledValue={!maintenanceDisabilityChecked}
                    id={field.name}
                    {...field}
                    value={field.value as string}
                  />
                </>
              )}
            />
          </div>
        </div>
        <div>
          <div className="mb-2">
            <Controller
              name="maintenanceDeathIsChecked"
              control={control}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="mr-4 font-medium text-xs text-blue-1000"
                  >
                    {t(
                      `forms.fields.wealth.benefits.guarantees.maintenance_death`
                    )}
                  </Label>
                  <Checkbox
                    id="maintenance_death"
                    data-testid={prefixField + field.name}
                    name="guarantees-maintenance_death"
                    checked={field.value ?? false}
                    onChange={() => {
                      field.onChange(!field.value);
                    }}
                  />
                </>
              )}
            />
          </div>
          <div className="bg-slate-50">
            <Controller
              name="maintenanceDeathLabel"
              control={control}
              render={({ field }) => (
                <>
                  <FieldTextarea
                    className="px-2"
                    disabledValue={!maintenanceDeathChecked}
                    id={field.name}
                    {...field}
                    value={field.value as string}
                  />
                </>
              )}
            />
          </div>
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
