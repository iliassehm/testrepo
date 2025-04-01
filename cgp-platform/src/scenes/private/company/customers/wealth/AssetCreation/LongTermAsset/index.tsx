import { t } from "i18next";
import { useForm } from "react-hook-form";

import { Widget } from "../../../../../../../components/Widget";
import {
  AssetGroup,
  CustomerAsset,
  InvestmentValues,
} from "../../../../../../../types";
import { LongTermAssetType } from "../AssetCreation";
import { InvestmentInstrumentTableRow } from "./components/data-table";
import { LongTermAssetForm } from "./LongTermAssetForm";
import { LongTermAssetTable } from "./LongTermAssetTable";

export interface LongTermAssetFormData {
  name: string;
  contractName?: string;
  accountNumber?: string;
  managementCompany?: string;
  accountType?: string;
  categoryName?: string;
  provider: string;
  value: number;
  beneficiaryClause?: string;
  scheduledPayment?: number;
  scheduledPaymentList?: string;
  date: Date;
  metadata?: {
    fixedFees?: number;
    variableFees?: {
      percentage?: number;
      companyPercentage?: number;
    };
    contractFixedFees?: number;
    contractVariableFees?: {
      percentage?: number;
      companyPercentage?: number;
    };
  };
}

export const scpiList = [
  { label: t("Via assurance vie"), value: "Via assurance vie" },
  { label: t("Via PER"), value: "Via PER" },
  { label: t("En direct"), value: "En direct" },
];

export const contraTypeList = [
  { label: t("PER"), value: "PER" },
  { label: t("PERP"), value: "PERP" },
  { label: t("PERCO / PERCOI"), value: "PERCO / PERCOI" },
  { label: t("PEE / PEI"), value: "PEE / PEI" },
  { label: t("Contrat Article 82"), value: "Contrat Article 82" },
  { label: t("Contrat Article 83"), value: "Contrat Article 83" },
  { label: t("Contrat Loi Madelin"), value: "Contrat Loi Madelin" },
  { label: t("Autres"), value: "Autres" },
];

export const scheduledPaymentList = [
  { label: t("forms.fields.cycles.yearly"), value: "yearly" },
  { label: t("forms.fields.cycles.monthly"), value: "monthly" },
  { label: t("forms.fields.cycles.quarterly"), value: "quarterly" },
  { label: t("forms.fields.cycles.biannual"), value: "biannual" },
  { label: t("forms.fields.cycles.other"), value: "other" },
];

type LongTermAssetCreationProps = {
  asset?: CustomerAsset;
  onSubmit: (data: unknown, investments?: InvestmentValues[]) => void;
  type: LongTermAssetType;
  referenceInstrument: string;
  isLoading?: boolean;
};
export function LongTermAssetCreation(props: LongTermAssetCreationProps) {
  const defaultValues: LongTermAssetFormData = {
    name: props?.asset?.name ?? "",
    accountNumber: props?.asset?.accountNumber ?? undefined,
    contractName: props?.asset?.name ?? "",
    provider:
      props.type === AssetGroup.LifeInsuranceCapitalization
        ? props?.asset?.metadata?.bank
        : props.type === AssetGroup.RetirementEmployee
          ? props?.asset?.name
          : props?.asset?.metadata?.provider ?? "",
    value:
      props.type === AssetGroup.LifeInsuranceCapitalization ||
      props.type === AssetGroup.RetirementEmployee
        ? props?.asset?.metadata?.transfersAmount
        : props?.asset?.metadata?.value ?? 0,
    date:
      props?.asset?.group === AssetGroup.RockPaper ||
      props.asset?.group === AssetGroup.RetirementEmployee
        ? props?.asset?.activity?.start
        : props?.asset?.openDate ?? new Date(),
    categoryName: props?.asset?.categoryName ?? "",
    beneficiaryClause: props?.asset?.metadata?.beneficiary_clause ?? undefined,
    scheduledPayment: props?.asset?.metadata?.scheduledPayment ?? 0,
    scheduledPaymentList:
      props?.asset?.metadata?.scheduledPaymentList ?? undefined,
    metadata: {
      fixedFees: props?.asset?.metadata?.fixedFees ?? 0,
      variableFees: props?.asset?.metadata?.variableFees ?? {
        percentage: 0,
        companyPercentage: 0,
      },
      contractFixedFees: props?.asset?.metadata?.contractFixedFees ?? 0,
      contractVariableFees: props?.asset?.metadata?.contractVariableFees ?? {
        percentage: 0,
        companyPercentage: 0,
      },
    },
    ...(props.type === AssetGroup.RockPaper
      ? {
          managementCompany:
            props?.asset?.metadata?.managementCompany ?? undefined,
        }
      : {}),
    ...(props.type === AssetGroup.RetirementEmployee
      ? {
          accountType:
            props?.asset?.metadata?.accountType ?? contraTypeList[0].value,
        }
      : {}),
    ...(props.type === AssetGroup.RockPaper
      ? {
          accountType: props?.asset?.metadata?.accountType ?? scpiList[0].value,
        }
      : {}),
  };

  const formState = useForm({
    defaultValues,
    // todo: add zod resolver
  });
  const formValues = formState.watch();
  const value = formValues.value;
  const variableFeeAmount =
    Math.round(
      value * ((formValues.metadata?.variableFees?.percentage || 0) / 100) * 100
    ) / 100;

  const totalFees = variableFeeAmount + (formValues.metadata?.fixedFees || 0);

  const investmentList: InvestmentInstrumentTableRow[] =
    props?.asset?.investmentList
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

  return (
    <form className="flex flex-col gap-4">
      <Widget className="pt-4">
        <LongTermAssetForm
          {...props}
          variableFeeAmount={variableFeeAmount}
          form={formState}
        />
      </Widget>

      <Widget className="pt-4">
        <LongTermAssetTable
          form={formState}
          type={props.type}
          totalFees={totalFees}
          investmentList={investmentList}
          onSubmit={async (data) => {
            const information = formState.getValues();
            const isFormValid = await formState.trigger();
            if (isFormValid) {
              props.onSubmit(
                {
                  ...information,
                  name: information.provider,
                  currency: "EUR",
                  currentValue: value - totalFees,
                  transfersAmount: value,
                  insuranceCompany: information.provider,
                },
                data
              );
            }
          }}
        />
      </Widget>
    </form>
  );
}
