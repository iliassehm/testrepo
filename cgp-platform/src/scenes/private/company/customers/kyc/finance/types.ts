import { z } from "zod";

import { AssetGroup, CustomerAsset } from "../../../../../../types";

const BankingFormSchema = z.object({
  bankName: z.string(),
  accountType: z.string(),
  amount: z.number().nullable().optional(),
  currency: z.string(),
  date: z.date(),
  categoryName: z.string(),
  isUnderManagement: z.boolean(),
});

export type BankingFormData = z.infer<typeof BankingFormSchema>;

const SecuritiesFormSchema = z.object({
  categoryName: z.string(),
  name: z.string(),
  accountNumber: z.string(),
  openDate: z.date(),
  transfersAmount: z.number(),
  isUnderManagement: z.boolean(),
});

export type SecuritiesFormData = z.infer<typeof SecuritiesFormSchema>;

const LifeInsuranceCapitalizationFormSchema = z.object({
  categoryName: z.string(),
  contractName: z.string(),
  accountNumber: z.string().optional(),
  insuranceCompany: z.string(),
  date: z.date(),
  beneficiaryClause: z.string().optional(),
  transfersAmount: z.number(),
  scheduledPaymentList: z.string(),
  scheduledPayment: z.number(),
  accountType: z.string(),
  isUnderManagement: z.boolean(),
});

export type LifeInsuranceCapitalizationFormData = z.infer<
  typeof LifeInsuranceCapitalizationFormSchema
>;

const RetirementEmployeeFormSchema = z.object({
  categoryName: z.string(),
  contractName: z.string(),
  accountNumber: z.string().optional(),
  insuranceCompany: z.string(),
  date: z.date(),
  beneficiaryClause: z.string().optional(),
  transfersAmount: z.number(),
  scheduledPaymentList: z.string(),
  scheduledPayment: z.number(),
  accountType: z.string(),
  isUnderManagement: z.boolean(),
});

export type RetirementEmployeeFormData = z.infer<
  typeof RetirementEmployeeFormSchema
>;

const CrowdfundingFormSchema = z.object({
  categoryName: z.string(),
  provider: z.string(),
  investDomain: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  yield: z.number(),
  investedCapital: z.number().nullable().optional(),
  currency: z.string(),
  isUnderManagement: z.boolean(),
});

export type CrowdfundingFormData = z.infer<typeof CrowdfundingFormSchema>;

const PrivateEquityFormSchema = z.object({
  categoryName: z.string(),
  name: z.string(),
  valuation: z.number().nullable(),
  ownership: z.number(),
  socialCapital: z.number().nullable(),
  unitPrice: z.number().nullable(),
  quantity: z.number().nullable(),
  value: z.number().nullable(),
  currency: z.string(),
  opened: z.date(),
  isUnderManagement: z.boolean(),
});

export type PrivateEquityFormData = z.infer<typeof PrivateEquityFormSchema>;

const BenefitsFormSchema = z.object({
  categoryName: z.string(),
  accountNumber: z.string(),
  insuranceCompany: z.string(),
  name: z.string(),
  date: z.date(),
  scheduledPayment: z.number(),
  scheduledPaymentList: z.string(),
  accountType: z.string(),
  maintenanceSalaryIsChecked: z.boolean(),
  maintenanceSalaryLabel: z.string().optional(),
  maintenanceDisabilityIsChecked: z.boolean(),
  maintenanceDisabilityLabel: z.string().optional(),
  maintenanceDeathIsChecked: z.boolean(),
  maintenanceDeathLabel: z.string().optional(),
  isUnderManagement: z.boolean(),
});

export type BenefitsFormData = z.infer<typeof BenefitsFormSchema>;

const RockPaperFormSchema = z.object({
  categoryName: z.string(),
  name: z.string(),
  accountNumber: z.string().optional(),
  insuranceCompany: z.string(),
  date: z.date().optional(),
  transfersAmount: z.number(),
  scheduledPaymentList: z.string(),
  scheduledPayment: z.number(),
  accountType: z.string(),
  isUnderManagement: z.boolean(),
});

export type RockPaperFormData = z.infer<typeof RockPaperFormSchema>;

const ExoticFormSchema = z.object({
  name: z.string(),
  category: z.string(),
  buyingValue: z.number().nullable(),
  currentValue: z.number().nullable(),
  quantity: z.number().nullable(),
  currency: z.string(),
  ownership: z.number(),
  date: z.date(),
  isUnderManagement: z.boolean(),
});

export type ExoticFormData = z.infer<typeof ExoticFormSchema>;

export interface DataAssetGroup {
  group: AssetGroup;
  amount: any;
  assets: CustomerAsset[];
}

export const repartitionTypes = [
  AssetGroup.Banking,
  AssetGroup.Exotic,
  AssetGroup.Crypto,
  AssetGroup.Securities,
  AssetGroup.LifeInsuranceCapitalization,
  AssetGroup.Crowdfunding,
  AssetGroup.RetirementEmployee,
  AssetGroup.HeritageRealEstate,
  AssetGroup.PrivateEquity,
  AssetGroup.RockPaper,
  AssetGroup.HomeLoan,
  AssetGroup.Benefits,
  AssetGroup.Unrecognized,
];

export const assetGroupsNeedDetails = [
  AssetGroup.Securities,
  AssetGroup.LifeInsuranceCapitalization,
  AssetGroup.RetirementEmployee,
  AssetGroup.Benefits,
  AssetGroup.RockPaper,
];
