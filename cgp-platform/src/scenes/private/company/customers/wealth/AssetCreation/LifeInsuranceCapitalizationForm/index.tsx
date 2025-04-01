import { t } from "i18next";
import { InputNumber } from "primereact/inputnumber";
import { Controller, useForm } from "react-hook-form";

import { Button } from "../../../../../../../components";
import { Widget } from "../../../../../../../components/Widget";
import { getFormErrorMessage } from "../../../../../../../constants";
import { useCurrentRoute } from "../../../../../../../hooks/useCurrentRoute";
import {
  Customer,
  CustomerAsset,
  GlobalSearchParams,
  InvestmentValues,
  WealthCreationParams,
} from "../../../../../../../types";
import FieldAmount from "../../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import FieldPercentage from "../../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { FieldTextarea } from "../../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import Select from "../../../../../../../UIComponents/Select/Select";
import { InvestmentInstrumentTableRow } from "../LongTermAsset/components/data-table";
import { RealEstateFormType } from "../RealEstateForm";
import { LifeInsuranceCapitalizationTable } from "./LifeInsuranceCapitalizationTable";

export interface LifeInsuranceCapitalizationFormData {
  categoryName: string;
  contractName: string;
  accountNumber: string;
  date: Date;

  metadata: {
    insuranceCompany: string;
    beneficiaryClause: string;
    transfersAmount: number;
    scheduledPaymentList: string;
    scheduledPayment: number;
    ownership: number;
    accountType: string;
    otherOwners?: string;

    comment: string;
    fees: {
      managementEuroFunds?: {
        totalPercentage?: number;
        totalAmount?: number;
        contractPercentage?: number;
        contractAmount?: number;
        companyPercentage?: number;
        companyAmount?: number;
      };
      managementUC?: {
        totalPercentage?: number;
        totalAmount?: number;
        contractPercentage?: number;
        contractAmount?: number;
        companyPercentage?: number;
        companyAmount?: number;
      };
      opening?: {
        totalPercentage?: number;
        totalAmount?: number;
        contractPercentage?: number;
        contractAmount?: number;
        companyPercentage?: number;
        companyAmount?: number;
      };
      arbitration?: {
        totalPercentage?: number;
        totalAmount?: number;
        contractPercentage?: number;
        contractAmount?: number;
        companyPercentage?: number;
        companyAmount?: number;
      };
      exit?: {
        totalPercentage?: number;
        totalAmount?: number;
        contractPercentage?: number;
        contractAmount?: number;
        companyPercentage?: number;
        companyAmount?: number;
      };
      advice?: {
        totalPercentage?: number;
        totalAmount?: number;
        contractPercentage?: number;
        contractAmount?: number;
        companyPercentage?: number;
        companyAmount?: number;
      };
      surperformance?: {
        totalPercentage?: number;
        totalAmount?: number;
        contractPercentage?: number;
        contractAmount?: number;
        companyPercentage?: number;
        companyAmount?: number;
      };
    };
  };
  activity: {
    value: number;
    instrument: string;
  };
}

export const categoryNames = [
  {
    label: t("asset_categories.life_insurance"),
    value: "life_insurance",
  },
  {
    label: t("asset_categories.contrat_capitalisation"),
    value: "contrat_capitalisation",
  },
  {
    label: t("asset_categories.pep_life_insurance"),
    value: "pep_life_insurance",
  },
];

export const accountType = [
  {
    label: t("forms.fields.wealth.lifeInsurance.accountType.fullProperty"),
    value: "fullProperty",
  },
  {
    label: t("forms.fields.wealth.lifeInsurance.accountType.property"),
    value: "property",
  },
  {
    label: t("forms.fields.wealth.lifeInsurance.accountType.usufruct"),
    value: "usufruct",
  },
];

export const scheduledPaymentList = [
  { label: t("forms.fields.cycles.yearly"), value: "yearly" },
  { label: t("forms.fields.cycles.monthly"), value: "monthly" },
  { label: t("forms.fields.cycles.quarterly"), value: "quarterly" },
  { label: t("forms.fields.cycles.biannual"), value: "biannual" },
  { label: t("forms.fields.cycles.weekly"), value: "weekly" },
];

export const LifeInsuranceCapitalizationForm = ({
  asset,
  onSubmit,
  isLoading,
  formType,
  otherOwners,
  otherOwner,
  customerId,
}: {
  asset?: CustomerAsset;
  onSubmit: (
    data: LifeInsuranceCapitalizationFormData,
    investments?: InvestmentValues[]
  ) => void;
  isLoading?: boolean;
  formType?: RealEstateFormType;
  otherOwners: { value: string; label: string }[];
  otherOwner?: Customer;
  customerId: string;
}) => {
  const currentRoute = useCurrentRoute();
  const search = currentRoute.search as GlobalSearchParams &
    WealthCreationParams;

  let defaultValues: LifeInsuranceCapitalizationFormData = {
    categoryName: asset?.categoryName ?? categoryNames[0].value,
    contractName: asset?.name ?? "",
    accountNumber: asset?.accountNumber ?? "",
    date: new Date(asset?.openDate) ?? new Date(),
    metadata: {
      insuranceCompany: asset?.metadata?.bank ?? "",
      transfersAmount: asset?.metadata?.transfersAmount ?? 0,
      beneficiaryClause: asset?.metadata?.beneficiary_clause ?? "",
      scheduledPaymentList:
        asset?.metadata?.scheduledPaymentList ?? scheduledPaymentList[0].value,
      scheduledPayment: asset?.metadata?.scheduledPayment ?? 0,
      ownership: asset?.owners?.find((owner) => owner.entity?.id === customerId)
        ?.ownership
        ? (asset.owners.find((owner) => owner.entity?.id === customerId)
            ?.ownership ?? 0) * 100
        : 100,
      accountType: asset?.metadata?.accountType ?? accountType[0].value,
      otherOwners: otherOwner?.id ?? "",
      comment: asset?.metadata?.comment ?? "",
      fees: {
        managementEuroFunds: {
          totalPercentage:
            asset?.metadata?.fees?.managementEuroFunds?.totalPercentage ?? 0,
          totalAmount:
            asset?.metadata?.fees?.managementEuroFunds?.totalAmount ?? 0,
          contractPercentage:
            asset?.metadata?.fees?.managementEuroFunds?.contractPercentage ?? 0,
          contractAmount:
            asset?.metadata?.fees?.managementEuroFunds?.contractAmount ?? 0,
          companyPercentage:
            asset?.metadata?.fees?.managementEuroFunds?.companyPercentage ?? 0,
          companyAmount:
            asset?.metadata?.fees?.managementEuroFunds?.companyAmount ?? 0,
        },
        managementUC: {
          totalPercentage:
            asset?.metadata?.fees?.managementUC?.totalPercentage ?? 0,
          totalAmount: asset?.metadata?.fees?.managementUC?.totalAmount ?? 0,
          contractPercentage:
            asset?.metadata?.fees?.managementUC?.contractPercentage ?? 0,
          contractAmount:
            asset?.metadata?.fees?.managementUC?.contractAmount ?? 0,
          companyPercentage:
            asset?.metadata?.fees?.managementUC?.companyPercentage ?? 0,
          companyAmount:
            asset?.metadata?.fees?.managementUC?.companyAmount ?? 0,
        },
        opening: {
          totalPercentage: asset?.metadata?.fees?.opening?.totalPercentage ?? 0,
          totalAmount: asset?.metadata?.fees?.opening?.totalAmount ?? 0,
          contractPercentage:
            asset?.metadata?.fees?.opening?.contractPercentage ?? 0,
          contractAmount: asset?.metadata?.fees?.opening?.contractAmount ?? 0,
          companyPercentage:
            asset?.metadata?.fees?.opening?.companyPercentage ?? 0,
          companyAmount: asset?.metadata?.fees?.opening?.companyAmount ?? 0,
        },
        arbitration: {
          totalPercentage:
            asset?.metadata?.fees?.arbitration?.totalPercentage ?? 0,
          totalAmount: asset?.metadata?.fees?.arbitration?.totalAmount ?? 0,
          contractPercentage:
            asset?.metadata?.fees?.arbitration?.contractPercentage ?? 0,
          contractAmount:
            asset?.metadata?.fees?.arbitration?.contractAmount ?? 0,
          companyPercentage:
            asset?.metadata?.fees?.arbitration?.companyPercentage ?? 0,
          companyAmount: asset?.metadata?.fees?.arbitration?.companyAmount ?? 0,
        },
        exit: {
          totalPercentage: asset?.metadata?.fees?.exit?.totalPercentage ?? 0,
          totalAmount: asset?.metadata?.fees?.exit?.totalAmount ?? 0,
          contractPercentage:
            asset?.metadata?.fees?.exit?.contractPercentage ?? 0,
          contractAmount: asset?.metadata?.fees?.exit?.contractAmount ?? 0,
          companyPercentage:
            asset?.metadata?.fees?.exit?.companyPercentage ?? 0,
          companyAmount: asset?.metadata?.fees?.exit?.companyAmount ?? 0,
        },
        advice: {
          totalPercentage: asset?.metadata?.fees?.advice?.totalPercentage ?? 0,
          totalAmount: asset?.metadata?.fees?.advice?.totalAmount ?? 0,
          contractPercentage:
            asset?.metadata?.fees?.advice?.contractPercentage ?? 0,
          contractAmount: asset?.metadata?.fees?.advice?.contractAmount ?? 0,
          companyPercentage:
            asset?.metadata?.fees?.advice?.companyPercentage ?? 0,
          companyAmount: asset?.metadata?.fees?.advice?.companyAmount ?? 0,
        },
        surperformance: {
          totalPercentage:
            asset?.metadata?.fees?.surperformance?.totalPercentage ?? 0,
          totalAmount: asset?.metadata?.fees?.surperformance?.totalAmount ?? 0,
          contractPercentage:
            asset?.metadata?.fees?.surperformance?.contractPercentage ?? 0,
          contractAmount:
            asset?.metadata?.fees?.surperformance?.contractAmount ?? 0,
          companyPercentage:
            asset?.metadata?.fees?.surperformance?.companyPercentage ?? 0,
          companyAmount:
            asset?.metadata?.fees?.surperformance?.companyAmount ?? 0,
        },
      },
    },
    activity: {
      value: asset?.activity?.value ?? null,
      instrument: asset?.activity?.instrument ?? "EUR",
    },
  };

  if (search.form)
    defaultValues = { ...(search.form as LifeInsuranceCapitalizationFormData) };

  const form = useForm({
    defaultValues,
  });
  const {
    control,
    formState,
    handleSubmit,
    watch,
    trigger,
    getValues,
    setValue,
  } = form;
  const { errors } = formState;

  const investmentList: InvestmentInstrumentTableRow[] =
    asset?.investmentList
      ?.filter((investment) => investment.code !== "XXliquidity")
      .map((investment) => ({
        amount: investment.valuation.value,
        category: investment.category,
        code: investment.code as string,
        managementCompany: investment.managementCompany,
        label: investment.name,
        percent: 0,
        riskIndicator: investment.riskIndicator,
        quantity: investment.quantity ?? 0,
        valuation: {
          value: investment.unitValue,
          instrument: investment.valuation.instrument,
        },
        // buyingDate: investment.created,
        buyingPrice: investment.unitPrice ?? 0,
      })) || [];

  const formValues = watch();
  let totalFees = 0;
  for (const fees of Object.keys(formValues.metadata.fees) as Array<
    keyof typeof formValues.metadata.fees
  >) {
    // if (fees === "arbitration") {
    //   totalFees += formValues.metadata.fees?.arbitration?.totalAmount
    //     ? formValues.metadata.fees?.arbitration?.totalAmount *
    //       investmentList.length
    //     : 0;
    // } else
    if (!["ttf", "exchange", "srd_fee", "srd"].includes(fees)) {
      totalFees += formValues.metadata.fees[fees]?.totalAmount ?? 0;
    }

    // const totalPercentage =
    //   (formValues.metadata.fees[fees]?.contractPercentage ?? 0) +
    //   (formValues.metadata.fees[fees]?.companyPercentage ?? 0);
    // if (totalPercentage !== formValues.metadata.fees[fees]?.totalPercentage) {
    //   setValue(
    //     `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.totalPercentage`,
    //     totalPercentage
    //   );
    // }

    // variableFeeAmount +=
    //   Math.round(value * (totalPercentage / 100) * 100) / 100;
  }

  if (formType === RealEstateFormType.SIMPLIFIED) {
    return (
      <form
        className="flex flex-col items-center"
        onSubmit={handleSubmit((information) =>
          onSubmit({
            ...information,
            metadata: {
              ...information.metadata,
              ownership: information.metadata.ownership / 100,
            },
            activity: {
              ...information.activity,
              value: information.metadata.transfersAmount,
            },
          })
        )}
      >
        <Widget className="pt-4">
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
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.lifeInsurance.contractName.label`
                      )}
                    </Label>
                    <FieldText
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      //   onChange={(e) => setName(e.target.value)}
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
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.lifeInsurance.contractNumber`)}
                    </Label>
                    <FieldText
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      //   onChange={(e) => setName(e.target.value)}
                      className="w-full border bg-slate-50"
                      placeholder={
                        t(`forms.fields.wealth.lifeInsurance.contractNumber`) ||
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
                name="metadata.insuranceCompany"
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
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.lifeInsurance.insuranceCompany.label`
                      )}
                    </Label>
                    <FieldText
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      //   onChange={(e) => setName(e.target.value)}
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
                  required: t(
                    `forms.fields.wealth.lifeInsurance.date`
                  ) as string,
                }}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.lifeInsurance.date`)}
                    </Label>
                    <FieldDate
                      id={field.name}
                      {...field}
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

            <div>
              <Controller
                name="metadata.beneficiaryClause"
                control={control}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.longTermAsset.beneficiaryClause.label`
                      )}
                    </Label>
                    <FieldText
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      //   onChange={(e) => setName(e.target.value)}
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
                name="metadata.transfersAmount"
                control={control}
                render={({ field }) => (
                  <div className="">
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.longTermAsset.transfersAmount.label`
                      )}
                    </Label>
                    <InputNumber
                      id={field.name}
                      value={field.value as number}
                      onChange={(e) => field.onChange(e.value as number)}
                      className="w-full border bg-slate-50"
                      inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                      mode="currency"
                      currency="EUR"
                      locale="fr-FR"
                      maxFractionDigits={2}
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
                name="metadata.scheduledPaymentList"
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
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.longTermAsset.scheduledPayment.label`
                      )}
                    </Label>
                    <Select
                      id={field.name}
                      value={{
                        value: field.value,
                        label: t(
                          "forms.fields.cycles." + field.value
                        ) as string,
                      }}
                      onChange={(option) => field.onChange(option?.value)}
                      options={scheduledPaymentList}
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
            <div>
              <Controller
                name="metadata.scheduledPayment"
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
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.longTermAsset.scheduledPayment.preLabel`
                      )}
                    </Label>
                    <InputNumber
                      id={field.name}
                      value={field.value as number}
                      onChange={(e) => field.onChange(e.value as number)}
                      className="w-full border bg-slate-50"
                      inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                      mode="currency"
                      currency="EUR"
                      locale="fr-FR"
                      maxFractionDigits={2}
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

            <div></div>

            <Controller
              name="metadata.ownership"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.realEstate.detention.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(`forms.fields.wealth.ownership.label`) as string),
              }}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.ownership.label`)}
                  </Label>
                  <FieldPercentage
                    id={field.name}
                    {...field}
                    className="border bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.ownership.placeholder`) || ""
                    }
                    maxVal={100}
                  />
                </div>
              )}
            />

            <Controller
              name="metadata.accountType"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.lifeInsurance.accountType.error`
                ) as string,
              }}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.lifeInsurance.accountType.label`)}
                  </Label>
                  <Select
                    id={field.name}
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
                        zIndex: 9999,
                      }),
                    }}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />

            {watch("metadata.ownership") < 100 && (
              <Controller
                name="metadata.otherOwners"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.otherOwners.error`
                  ) as string,
                }}
                render={({ field }) => (
                  <div>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.otherOwners.label`)}
                    </Label>
                    <Select
                      id={field.name}
                      value={otherOwners.find((o) => o.value === field.value)}
                      onChange={(option) => field.onChange(option?.value)}
                      options={otherOwners}
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
                  </div>
                )}
              />
            )}

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
          <div className="flex">
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
          </div>
        </Widget>
      </form>
    );
  }
  return (
    <div className="flex flex-col items-center">
      <Widget className="pt-4">
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
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.lifeInsurance.contractName.label`)}
                  </Label>
                  <FieldText
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    //   onChange={(e) => setName(e.target.value)}
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
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.lifeInsurance.contractNumber`)}
                  </Label>
                  <FieldText
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    //   onChange={(e) => setName(e.target.value)}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.lifeInsurance.contractNumber`) ||
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
              name="metadata.insuranceCompany"
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
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(
                      `forms.fields.wealth.lifeInsurance.insuranceCompany.label`
                    )}
                  </Label>
                  <FieldText
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    //   onChange={(e) => setName(e.target.value)}
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
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.lifeInsurance.date`)}
                  </Label>
                  <FieldDate
                    id={field.name}
                    {...field}
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

          <div>
            <Controller
              name="metadata.beneficiaryClause"
              control={control}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(
                      `forms.fields.wealth.longTermAsset.beneficiaryClause.label`
                    )}
                  </Label>
                  <FieldText
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    //   onChange={(e) => setName(e.target.value)}
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
          <div className="">
            <Controller
              name="metadata.transfersAmount"
              control={control}
              render={({ field }) => (
                <div className="">
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(
                      `forms.fields.wealth.longTermAsset.transfersAmount.label`
                    )}
                  </Label>
                  <InputNumber
                    id={field.name}
                    value={field.value as number}
                    onChange={(e) => field.onChange(e.value as number)}
                    className="w-full border bg-slate-50"
                    inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                    mode="currency"
                    currency="EUR"
                    locale="fr-FR"
                    maxFractionDigits={2}
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
              name="metadata.scheduledPaymentList"
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
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(
                      `forms.fields.wealth.longTermAsset.scheduledPayment.label`
                    )}
                  </Label>
                  <Select
                    id={field.name}
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
                        zIndex: 9999,
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
              name="metadata.scheduledPayment"
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
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(
                      `forms.fields.wealth.longTermAsset.scheduledPayment.preLabel`
                    )}
                  </Label>
                  <InputNumber
                    id={field.name}
                    value={field.value as number}
                    onChange={(e) => field.onChange(e.value as number)}
                    className="w-full border bg-slate-50"
                    inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                    mode="currency"
                    currency="EUR"
                    locale="fr-FR"
                    maxFractionDigits={2}
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
          <div></div>

          <Controller
            name="metadata.ownership"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.realEstate.detention.error`
              ) as string,
              validate: (value) =>
                value !== null ||
                (t(`forms.fields.wealth.ownership.label`) as string),
            }}
            render={({ field }) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.ownership.label`)}
                </Label>
                <FieldPercentage
                  id={field.name}
                  {...field}
                  className="border bg-slate-50"
                  placeholder={
                    t(`forms.fields.wealth.ownership.placeholder`) || ""
                  }
                  maxVal={100}
                />
              </div>
            )}
          />

          <Controller
            name="metadata.accountType"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.lifeInsurance.accountType.error`
              ) as string,
            }}
            render={({ field }) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.lifeInsurance.accountType.label`)}
                </Label>
                <Select
                  id={field.name}
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
                      zIndex: 9999,
                    }),
                  }}
                />
                {getFormErrorMessage(field.name, errors)}
              </div>
            )}
          />

          {watch("metadata.ownership") < 100 && (
            <Controller
              name="metadata.otherOwners"
              control={control}
              rules={{
                required: t(`forms.fields.wealth.otherOwners.error`) as string,
              }}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.otherOwners.label`)}
                  </Label>
                  <Select
                    id={field.name}
                    value={otherOwners.find((o) => o.value === field.value)}
                    onChange={(option) => field.onChange(option?.value)}
                    options={otherOwners}
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
                </div>
              )}
            />
          )}
        </div>
        <div className="grid gap-4 grid-cols-3 bg-blue-800 text-white py-2 px-4 mt-5 mb-7 rounded-xl">
          <div className="flex justify-center items-center">
            {t(`forms.fields.wealth.lifeInsurance.totalFees`)}
          </div>
          <div className="flex justify-center items-center">
            {t(`forms.fields.wealth.lifeInsurance.contractPart`)}
          </div>
          <div className="flex justify-center items-center">
            {t(`forms.fields.wealth.lifeInsurance.companyPart`)}
          </div>
        </div>
        <div className="">
          {Object.keys(formValues.metadata.fees).map((fees, index) => (
            <div className="grid gap-4 grid-cols-3 pl-2" key={index}>
              <div className="flex items-center">
                <div className="text-xs">
                  {t(`forms.fields.wealth.lifeInsurance.fees.${fees}`)}
                </div>
                <div className="flex ml-auto">
                  <div className="">
                    <Controller
                      name={`metadata.fees.${fees as keyof typeof formValues.metadata.fees}.totalPercentage`}
                      control={control}
                      render={({ field }) => (
                        <div className="w-32">
                          <FieldPercentage
                            id={field.name}
                            {...field}
                            className="w-full bg-slate-50 h-10"
                            onChange={(value) => {
                              field.onChange(value);
                              const totalAmount =
                                Math.round(
                                  formValues.metadata.transfersAmount *
                                    (value / 100) *
                                    100
                                ) / 100;
                              setValue(
                                `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.totalAmount`,
                                totalAmount
                              );
                              setValue(
                                `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.contractAmount`,
                                (totalAmount *
                                  (formValues.metadata.fees[
                                    fees as keyof typeof formValues.metadata.fees
                                  ]?.contractPercentage ?? 0)) /
                                  100
                              );
                              setValue(
                                `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.companyAmount`,
                                (totalAmount *
                                  (formValues.metadata.fees[
                                    fees as keyof typeof formValues.metadata.fees
                                  ]?.companyPercentage ?? 0)) /
                                  100
                              );
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="ml-4">
                    <Controller
                      name={`metadata.fees.${fees as keyof typeof formValues.metadata.fees}.totalAmount`}
                      control={control}
                      render={({ field }) => (
                        <div className="w-32">
                          <FieldAmount
                            id={field.name}
                            {...field}
                            value={field.value as number}
                            className="w-full bg-slate-50 h-10"
                            placeholder={"€"}
                            onChange={(value) => {
                              field.onChange(value);
                              const totalPercentage =
                                formValues.metadata.transfersAmount > 0
                                  ? Math.round(
                                      (value /
                                        formValues.metadata.transfersAmount) *
                                        100 *
                                        100
                                    ) / 100 // 2 decimals precision
                                  : 0;
                              setValue(
                                `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.totalPercentage`,
                                totalPercentage
                              );
                              setValue(
                                `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.contractAmount`,
                                (value *
                                  (formValues.metadata.fees[
                                    fees as keyof typeof formValues.metadata.fees
                                  ]?.contractPercentage ?? 0)) /
                                  100
                              );
                              setValue(
                                `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.companyAmount`,
                                (value *
                                  (formValues.metadata.fees[
                                    fees as keyof typeof formValues.metadata.fees
                                  ]?.companyPercentage ?? 0)) /
                                  100
                              );
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center border-l border-r pb-2">
                <div className="">
                  <Controller
                    name={`metadata.fees.${fees as keyof typeof formValues.metadata.fees}.contractPercentage`}
                    control={control}
                    render={({ field }) => (
                      <div className="w-32">
                        <FieldPercentage
                          id={field.name}
                          {...field}
                          className="w-full bg-slate-50 h-10"
                          onChange={(value) => {
                            field.onChange(value);
                            const contractAmount = Math.round(
                              (formValues.metadata.fees[
                                fees as keyof typeof formValues.metadata.fees
                              ]?.totalAmount ?? 0) *
                                (value / 100)
                            );
                            setValue(
                              `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.contractAmount`,
                              contractAmount
                            );
                            setValue(
                              `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.companyAmount`,
                              (formValues.metadata.fees[
                                fees as keyof typeof formValues.metadata.fees
                              ]?.totalAmount ?? 0) - contractAmount
                            );
                            setValue(
                              `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.companyPercentage`,
                              100 - value
                            );
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
                <div className="ml-4">
                  <Controller
                    name={`metadata.fees.${fees as keyof typeof formValues.metadata.fees}.contractAmount`}
                    control={control}
                    render={({ field }) => (
                      <div className="w-32">
                        <FieldAmount
                          id={field.name}
                          {...field}
                          value={field.value as number}
                          className="w-full bg-slate-50 h-10"
                          placeholder={"€"}
                          onChange={(value) => {
                            field.onChange(value);
                            const totalAmount =
                              formValues.metadata.fees[
                                fees as keyof typeof formValues.metadata.fees
                              ]?.totalAmount ?? 0;
                            const contractPercentage =
                              totalAmount > 0
                                ? Math.round((value / totalAmount) * 100)
                                : 0;
                            setValue(
                              `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.contractPercentage`,
                              contractPercentage
                            );
                            setValue(
                              `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.companyAmount`,
                              (formValues.metadata.fees[
                                fees as keyof typeof formValues.metadata.fees
                              ]?.totalAmount ?? 0) - value
                            );
                            setValue(
                              `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.companyPercentage`,
                              100 - contractPercentage
                            );
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="">
                  <Controller
                    name={`metadata.fees.${fees as keyof typeof formValues.metadata.fees}.companyPercentage`}
                    control={control}
                    render={({ field }) => (
                      <div className="w-32">
                        <FieldPercentage
                          id={field.name}
                          {...field}
                          className="w-full bg-slate-50 h-10"
                          onChange={(value) => {
                            field.onChange(value);
                            const companyAmount = Math.round(
                              (formValues.metadata.fees[
                                fees as keyof typeof formValues.metadata.fees
                              ]?.totalAmount ?? 0) *
                                (value / 100)
                            );
                            setValue(
                              `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.companyAmount`,
                              companyAmount
                            );
                            setValue(
                              `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.contractAmount`,
                              (formValues.metadata.fees[
                                fees as keyof typeof formValues.metadata.fees
                              ]?.totalAmount ?? 0) - companyAmount
                            );
                            setValue(
                              `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.contractPercentage`,
                              100 - value
                            );
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
                <div className="ml-4">
                  <Controller
                    name={`metadata.fees.${fees as keyof typeof formValues.metadata.fees}.companyAmount`}
                    control={control}
                    render={({ field }) => (
                      <div className="w-32">
                        <FieldAmount
                          id={field.name}
                          {...field}
                          value={field.value as number}
                          className="w-full bg-slate-50 h-10"
                          placeholder={"€"}
                          onChange={(value) => {
                            field.onChange(value);
                            const totalAmount =
                              formValues.metadata.fees[
                                fees as keyof typeof formValues.metadata.fees
                              ]?.totalAmount ?? 0;
                            const companyPercentage =
                              totalAmount > 0
                                ? Math.round((value / totalAmount) * 100)
                                : 0;
                            setValue(
                              `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.companyPercentage`,
                              companyPercentage
                            );
                            setValue(
                              `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.contractAmount`,
                              (formValues.metadata.fees[
                                fees as keyof typeof formValues.metadata.fees
                              ]?.totalAmount ?? 0) - value
                            );
                            setValue(
                              `metadata.fees.${fees as keyof typeof formValues.metadata.fees}.contractPercentage`,
                              100 - companyPercentage
                            );
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
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
      </Widget>

      <Widget className="mt-4 pt-4">
        <LifeInsuranceCapitalizationTable
          form={form}
          totalFees={totalFees}
          investmentList={investmentList}
          onSubmit={async (data) => {
            const information = getValues();
            const isFormValid = await trigger();
            if (isFormValid) {
              onSubmit(
                {
                  ...information,
                  metadata: {
                    ...information.metadata,
                    ownership: information.metadata.ownership / 100,
                  },
                  activity: {
                    ...information.activity,
                    value: information.metadata.transfersAmount - totalFees,
                  },
                },
                data
              );
            }
          }}
        />
      </Widget>
    </div>
  );
};
