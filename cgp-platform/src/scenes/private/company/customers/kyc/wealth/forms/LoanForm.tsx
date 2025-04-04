import { InputNumber } from "primereact/inputnumber";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "../../../../../../../components";
import { getFormErrorMessage } from "../../../../../../../constants";
import { CustomerAsset } from "../../../../../../../types";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldNumber } from "../../../../../../../UIComponents/FieldNumber/FieldNumber";
import FieldPercentage from "../../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import Select, {
  Option,
} from "../../../../../../../UIComponents/Select/Select";
import { LoanAssetFormData } from "../types";

interface LoanFormProps {
  asset?: CustomerAsset;
  onSubmit: (data: LoanAssetFormData) => void;
  isLoading?: boolean;
  customerHeritageRealEstateAssets: CustomerAsset[];
}

export default function LoanForm({
  asset,
  onSubmit,
  isLoading,
  customerHeritageRealEstateAssets = [],
}: LoanFormProps) {
  const { t } = useTranslation();

  const assetsRealEstateListOptions = customerHeritageRealEstateAssets.map(
    (asset) => ({
      label: asset.name,
      value: asset.id,
    })
  );

  const defaultValues: LoanAssetFormData = {
    loanType: asset?.metadata?.type ?? "amortissable",
    loanAmount: asset?.metadata?.loanedAmount ?? null,
    date: asset?.metadata?.start ?? new Date(),
    endDate: asset?.metadata?.endDate ?? new Date(),
    loanPeriod: asset?.metadata?.duration ?? null,
    interestRate: asset?.metadata?.interests ?? 0,
    insuranceAmount: asset?.metadata?.assuranceFee ?? null,
    monthlyAmount: asset?.metadata?.monthlyPayment ?? null,
    loanOwnership: asset?.metadata?.loanOwnership
      ? asset?.metadata?.loanOwnership * 100
      : 100,
    applicationFees: asset?.metadata?.applicationFee ?? 0,
    currency: asset?.activity?.instrument ?? "EUR",
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const loanTypeOptions: Option[] = [
    {
      label: t(`scenes.customers.kyc.loanTypes.amortissable`) as string,
      value: "amortissable",
    },
    {
      label: t(`scenes.customers.kyc.loanTypes.in-fine`) as string,
      value: "in-fine",
    },
    {
      label: t(`scenes.customers.kyc.loanTypes.differe-total`) as string,
      value: "differe-total",
    },
    {
      label: t(`scenes.customers.kyc.loanTypes.differe-partiel`) as string,
      value: "differe-partiel",
    },
  ];

  const currencyOptions: Option[] = [
    { label: "Euro", value: "EUR" },
    { label: "Dollar", value: "USD" },
  ];

  const prefixField = "loan-";

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((e) =>
        onSubmit({
          ...e,
          name:
            assetsRealEstateListOptions.find(
              (option) => option.value === e.bindToProperty
            )?.label || "",
          loanOwnership: e.loanOwnership / 100,
        })
      )}
    >
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Controller
            name="bindToProperty"
            control={control}
            defaultValue={
              assetsRealEstateListOptions.find((e) => e.label === asset?.name)
                ?.value
            }
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.accountName.label`)}
                </Label>
                <Select
                  id={field.name}
                  {...field}
                  name={prefixField + field.name}
                  value={assetsRealEstateListOptions?.find(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                  options={assetsRealEstateListOptions}
                  placeholder={
                    t(`forms.fields.wealth.accountName.placeholder`) || ""
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
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Controller
            name="loanType"
            control={control}
            rules={{
              required: t(`forms.fields.wealth.loan.loanType.error`) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.loan.loanType.label`)}
                </Label>
                <Select
                  id={field.name}
                  {...field}
                  name={prefixField + field.name}
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
              </>
            )}
          />
        </div>
        <div>
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
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.loan.loanAmount.label`)}
                </Label>
                <InputNumber
                  id={field.name}
                  data-testid={prefixField + field.name}
                  value={field.value as number}
                  onChange={(e) => field.onChange(e.value as number)}
                  className="w-full"
                  inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                            ring-offset-background placeholder:text-muted-foreground text-right"
                  mode="currency"
                  currency="EUR"
                  locale="fr-FR"
                  maxFractionDigits={2}
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="interestRate"
            control={control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.loan.interestRate.label`)}
                </Label>
                <FieldPercentage
                  id={field.name}
                  data-testid={prefixField + field.name}
                  {...field}
                  placeholder={
                    t(`forms.fields.wealth.loan.interestRate.placeholder`) || ""
                  }
                />
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
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.loan.date.label`)}
                </Label>
                <FieldDate
                  id={field.name}
                  name={prefixField + field.name}
                  onValueChange={field.onChange}
                  placeholder={
                    t(`forms.fields.wealth.loan.date.placeholder`) || ""
                  }
                  className="w-full"
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="loanPeriod"
            control={control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.loan.loanPeriod.label`)}
                </Label>
                <FieldNumber
                  id={field.name}
                  data-testid={prefixField + field.name}
                  {...field}
                  value={field.value as number}
                  className="w-full"
                  placeholder={
                    t(`forms.fields.wealth.loan.loanPeriod.placeholder`) || ""
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
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.loan.endDate.label`)}
                </Label>
                <FieldDate
                  id={field.name}
                  name={prefixField + field.name}
                  onValueChange={field.onChange}
                  placeholder={
                    t(`forms.fields.wealth.loan.endDate.placeholder`) || ""
                  }
                  className="w-full"
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="insuranceAmount"
            control={control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.loan.insuranceAmount.label`)}
                </Label>
                <InputNumber
                  id={field.name}
                  data-testid={prefixField + field.name}
                  value={field.value as number}
                  onChange={(e) => field.onChange(e.value as number)}
                  className="w-full"
                  inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                  mode="currency"
                  currency="EUR"
                  locale="fr-FR"
                  maxFractionDigits={2}
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
            name="monthlyAmount"
            control={control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.loan.monthlyAmount.label`)}
                </Label>
                <InputNumber
                  id={field.name}
                  data-testid={prefixField + field.name}
                  value={field.value as number}
                  onChange={(e) => field.onChange(e.value as number)}
                  className="w-full"
                  inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                  mode="currency"
                  currency="EUR"
                  locale="fr-FR"
                  maxFractionDigits={2}
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
        <div>
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
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.loan.loanOwnership.label`)}
                </Label>
                <FieldPercentage
                  id={field.name}
                  data-testid={prefixField + field.name}
                  {...field}
                  placeholder={
                    t(`forms.fields.wealth.loan.loanOwnership.placeholder`) ||
                    ""
                  }
                />
              </>
            )}
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Controller
            name="applicationFees"
            control={control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.loan.applicationFees.label`)}
                </Label>
                <InputNumber
                  id={field.name}
                  data-testid={prefixField + field.name}
                  value={field.value as number}
                  onChange={(e) => field.onChange(e.value as number)}
                  className="w-full"
                  inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                  mode="currency"
                  currency="EUR"
                  locale="fr-FR"
                  maxFractionDigits={2}
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
          type="submit"
          size="small"
          label={
            asset ? "forms.fields.actions.save" : "forms.fields.actions.add"
          }
          isLoading={isLoading}
        />
      </div>
    </form>
  );
}
