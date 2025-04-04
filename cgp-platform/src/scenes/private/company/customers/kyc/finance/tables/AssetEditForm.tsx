import { kycAssetTypes } from "..";
import { AssetGroup, CustomerAsset } from "../../../../../../../types";
import { BankingForm } from "../forms/BankingForm";
import { BenefitsForm } from "../forms/BenefitsForm";
import { CrowdfundingForm } from "../forms/CrowdfundingForm";
import { ExoticForm } from "../forms/ExoticForm";
import { LifeInsuranceCapitalizationForm } from "../forms/LifeInsuranceCapitalizationForm";
import { PrivateEquityForm } from "../forms/PrivateEquityForm";
import { RetirementEmployeeForm } from "../forms/RetirementEmployeeForm";
import { RockPaperForm } from "../forms/RockPaperForm";
import { SecuritiesForm } from "../forms/SecuritiesForm";
import {
  BankingFormData,
  BenefitsFormData,
  CrowdfundingFormData,
  ExoticFormData,
  LifeInsuranceCapitalizationFormData,
  PrivateEquityFormData,
  RetirementEmployeeFormData,
  RockPaperFormData,
  SecuritiesFormData,
} from "../types";

export enum FormDataType {
  Banking = "BankingFormData",
  Benefits = "BenefitsFormData",
  Crowdfunding = "CrowdfundingFormData",
  Exotic = "ExoticFormData",
  LifeInsuranceCapitalization = "LifeInsuranceCapitalizationFormData",
  PrivateEquity = "PrivateEquityFormData",
  RetirementEmployee = "RetirementEmployeeFormData",
  RockPaper = "RockPaperFormData",
  Securities = "SecuritiesFormData",
}

interface AssetEditFormProps {
  currentAssetType: (typeof kycAssetTypes)[number]["value"];
  editingAsset: CustomerAsset | null;
  onUpdateAsset: (
    data: unknown,
    assetId: string,
    assetIsUnderManagement: boolean
  ) => void;
  setEditingAsset: (asset: CustomerAsset | null) => void;
  isLoading: boolean;
}

export const AssetEditForm: React.FC<AssetEditFormProps> = ({
  currentAssetType,
  editingAsset,
  onUpdateAsset,
  setEditingAsset,
  isLoading,
}) => {
  const getFormComponent = () => {
    const commonProps = {
      asset: (editingAsset as CustomerAsset) || {},
      isLoading,
    };

    const formMap: Record<
      | AssetGroup.Banking
      | AssetGroup.Crowdfunding
      | AssetGroup.Securities
      | AssetGroup.LifeInsuranceCapitalization
      | AssetGroup.RetirementEmployee
      | AssetGroup.PrivateEquity
      | AssetGroup.Benefits
      | AssetGroup.RockPaper
      | AssetGroup.Exotic,
      | {
          component: React.FC<any>;
          transformData: (data: any) => void;
        }
      | undefined
    > = {
      [AssetGroup.Banking]: {
        component: BankingForm,
        transformData: (data: BankingFormData) => ({
          ...data,
        }),
      },
      [AssetGroup.Crowdfunding]: {
        component: CrowdfundingForm,
        transformData: (data: CrowdfundingFormData) => ({
          ...data,
          comment: "",
        }),
      },
      [AssetGroup.Securities]: {
        component: SecuritiesForm,
        transformData: (data: SecuritiesFormData) => ({
          ...data,
          activity: {
            value: data.transfersAmount,
            instrument: "EUR",
          },
          metadata: {
            transfersAmount: data.transfersAmount,
            comment: "",
          },
        }),
      },
      [AssetGroup.LifeInsuranceCapitalization]: {
        component: LifeInsuranceCapitalizationForm,
        transformData: (data: LifeInsuranceCapitalizationFormData) => ({
          ...data,
          activity: {
            value: data.transfersAmount,
            instrument: "EUR",
          },
          metadata: {
            insuranceCompany: data.insuranceCompany,
            beneficiaryClause: data.beneficiaryClause,
            transfersAmount: data.transfersAmount,
            scheduledPaymentList: data.scheduledPaymentList,
            scheduledPayment: data.scheduledPayment,
            accountType: data.accountType,
            comment: "",
          },
        }),
      },
      [AssetGroup.RetirementEmployee]: {
        component: RetirementEmployeeForm,
        transformData: (data: RetirementEmployeeFormData) => ({
          ...data,
          activity: {
            value: data.transfersAmount,
            instrument: "EUR",
          },
          metadata: {
            insuranceCompany: data.insuranceCompany,
            beneficiaryClause: data.beneficiaryClause,
            transfersAmount: data.transfersAmount,
            scheduledPaymentList: data.scheduledPaymentList,
            scheduledPayment: data.scheduledPayment,
            accountType: data.accountType,
            comment: "",
          },
        }),
      },
      [AssetGroup.PrivateEquity]: {
        component: PrivateEquityForm,
        transformData: (data: PrivateEquityFormData) => ({
          ...data,
          activity: {
            value: data.value,
            instrument: data.currency,
          },
          metadata: {
            establishment: {
              name: data.name,
            },
            valuation: data.valuation,
            ownership: data.ownership,
            socialCapital: data.socialCapital,
            unitPrice: data.unitPrice,
            quantity: data.quantity,
            opened: data.opened,
            comment: "",
          },
        }),
      },
      [AssetGroup.Benefits]: {
        component: BenefitsForm,
        transformData: (data: BenefitsFormData) => ({
          ...data,
          activity: {
            value: 0,
            instrument: "EUR",
          },
          metadata: {
            insuranceCompany: data.insuranceCompany,
            scheduledPaymentList: data.scheduledPaymentList,
            scheduledPayment: data.scheduledPayment,
            accountType: data.accountType,
            guarantees: {
              maintenance_salary: {
                isChecked: data.maintenanceSalaryIsChecked,
                label: data.maintenanceSalaryLabel,
              },
              maintenance_disability: {
                isChecked: data.maintenanceDisabilityIsChecked,
                label: data.maintenanceDisabilityLabel,
              },
              maintenance_death: {
                isChecked: data.maintenanceDeathIsChecked,
                label: data.maintenanceDeathLabel,
              },
            },
            comment: "",
          },
        }),
      },
      [AssetGroup.RockPaper]: {
        component: RockPaperForm,
        transformData: (data: RockPaperFormData) => ({
          ...data,
          activity: {
            value: data.transfersAmount,
            instrument: "EUR",
          },
          metadata: {
            insuranceCompany: data.insuranceCompany,
            transfersAmount: data.transfersAmount,
            scheduledPaymentList: data.scheduledPaymentList,
            scheduledPayment: data.scheduledPayment,
            accountType: data.accountType,
            comment: "",
            fees: {},
          },
        }),
      },
      [AssetGroup.Exotic]: {
        component: ExoticForm,
        transformData: (data: ExoticFormData) => ({
          ...data,
        }),
      },
    };

    const formConfig = formMap[currentAssetType as keyof typeof formMap];
    if (!formConfig) return null;
    const { component: FormComponent, transformData } = formConfig;
    return (
      <FormComponent
        {...commonProps}
        onSubmit={(data: any) => {
          const transformedData = transformData(data);
          onUpdateAsset(
            transformedData,
            editingAsset?.id ?? "",
            data.isUnderManagement
          );
          setEditingAsset(null);
        }}
      />
    );
  };

  return getFormComponent();
};
