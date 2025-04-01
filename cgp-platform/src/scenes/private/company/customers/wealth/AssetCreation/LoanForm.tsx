import { InputNumber } from "primereact/inputnumber";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "../../../../../../components";
import { Widget } from "../../../../../../components/Widget";
import { getFormErrorMessage } from "../../../../../../constants";
import { AssetGroup, CustomerAsset } from "../../../../../../types";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldNumber } from "../../../../../../UIComponents/FieldNumber/FieldNumber";
import FieldPercentage from "../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldTextarea } from "../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../UIComponents/Label/Label";
import Select, { Option } from "../../../../../../UIComponents/Select/Select";

interface LoanFormData {
  loanType: string | null;
  date: Date;
  loanAmount: number | null;
  loanPeriod: number | null;
  interestRate: number;
  insuranceAmount: number | null;
  monthlyAmount: number | null;
  loanOwnership: number;
  settledLoan: boolean;
  applicationFees: number;
  currency: string;
  comment: string;
}

export const LoanForm = ({
  asset,
  onSubmit,
  isLoading,
  customerId,
}: {
  asset?: CustomerAsset;
  onSubmit: (data: LoanFormData) => void;
  type: AssetGroup;
  referenceInstrument: string;
  isLoading?: boolean;
  customerId: string;
}) => {
  const { t } = useTranslation();

  const defaultValues: LoanFormData = {
    loanType: asset?.metadata?.type ?? "amortissable",
    date: asset?.metadata?.start ?? new Date(),
    loanAmount: asset?.metadata?.loanedAmount ?? null,
    loanPeriod: asset?.metadata?.duration ?? null,
    interestRate: asset?.metadata?.interests ?? 0,
    insuranceAmount: asset?.metadata?.assuranceFee ?? null,
    monthlyAmount: asset?.metadata?.monthlyPayment ?? null,
    loanOwnership: asset?.owners?.find(
      (owner) => owner.entity?.id === customerId
    )?.ownership
      ? (asset.owners.find((owner) => owner.entity?.id === customerId)
          ?.ownership ?? 0) * 100
      : 100,
    applicationFees: asset?.metadata?.applicationFee ?? 0,
    currency: asset?.activity?.instrument ?? "EUR",
    settledLoan: asset?.metadata?.settledLoan ?? false,
    comment: asset?.metadata?.comment ?? "",
  };

  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({ defaultValues });

  const loanTypeOptions: Option[] = [
    { label: "Prêt amortissable", value: "amortissable" },
    { label: "Prêt in fine", value: "in-fine" },
    { label: "Prêt avec différé total", value: "differe-total" },
    { label: "Prêt avec différé partiel", value: "differe-partiel" },
  ];

  const currencyOptions: Option[] = [
    { label: "Euro", value: "EUR" },
    { label: "Dollar", value: "USD" },
  ];

  const settledLoanOptions: Option[] = [
    { label: t("boolean.true"), value: true },
    { label: t("boolean.false"), value: false },
  ];

  const currencyValue = watch("currency");

  return (
    <Widget className="pt-4">
      <form
        className="flex flex-col items-center"
        onSubmit={handleSubmit((data) =>
          onSubmit({
            ...data,
            loanOwnership: data.loanOwnership / 100,
          })
        )}
      >
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-xl bg-white">
            <Controller
              name="loanType"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.loan.loanType.error`
                ) as string,
              }}
              render={({ field }) => (
                <div className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.loan.loanType.label`)}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={loanTypeOptions?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                    options={loanTypeOptions}
                    placeholder={
                      t(`forms.fields.wealth.loan.loanType.placeholder`) || ""
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
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.loan.date.label`)}
                  </Label>
                  <FieldDate
                    id={field.name}
                    {...field}
                    onValueChange={field.onChange}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.loan.date.placeholder`) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="loanAmount"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.loan.loanAmount.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(`forms.fields.wealth.loan.loanAmount.label`) as string),
              }}
              render={({ field }) => (
                <div className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.loan.loanAmount.label`)}
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
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="loanPeriod"
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.loan.loanPeriod.label`)}
                  </Label>
                  <FieldNumber
                    id={field.name}
                    {...field}
                    value={field.value as number}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.loan.loanPeriod.placeholder`) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="interestRate"
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.loan.interestRate.label`)}
                  </Label>
                  <FieldPercentage
                    id={field.name}
                    {...field}
                    placeholder={
                      t(`forms.fields.wealth.loan.interestRate.placeholder`) ||
                      ""
                    }
                  />
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="insuranceAmount"
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.loan.insuranceAmount.label`)}
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
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="monthlyAmount"
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.loan.monthlyAmount.label`)}
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
                </div>
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
                <div className="w-full">
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
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="loanOwnership"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.loan.loanOwnership.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(`forms.fields.wealth.loan.loanOwnership.label`) as string),
              }}
              render={({ field }) => (
                <div className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.loan.loanOwnership.label`)}
                  </Label>
                  <FieldPercentage
                    id={field.name}
                    {...field}
                    placeholder={
                      t(`forms.fields.wealth.loan.loanOwnership.placeholder`) ||
                      ""
                    }
                  />
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="applicationFees"
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.loan.applicationFees.label`)}
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
                </div>
              )}
            />
          </div>
          <div className="rounded-xl bg-white">
            <Controller
              name="settledLoan"
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t("forms.fields.wealth.loan.settledLoan.label")}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={settledLoanOptions?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                    placeholder={
                      t("forms.fields.wealth.loan.settledLoan.placeholder") ||
                      ""
                    }
                    options={settledLoanOptions}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
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
