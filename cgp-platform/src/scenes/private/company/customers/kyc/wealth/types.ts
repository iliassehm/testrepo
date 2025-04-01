import { z } from "zod";

import { AppartmentType, CustomerAsset } from "../../../../../../types";

export const RealEstateAssetFormSchema = z.object({
  name: z.string(),
  source: z.string().nullable().optional(),
  typeId: z.nativeEnum(AppartmentType),
  buyingDate: z.date().optional(),
  price: z.number().nullable(),
  ownership: z.number(),
  annualRevenues: z.number(),
  valuation: z.number(),
});

export type RealEstateAssetData = z.infer<typeof RealEstateAssetFormSchema>;

export interface CustomerRealEstateSectionState {
  assets: CustomerAsset[];
  showModal: CustomerAsset | null;
  isExpanded: boolean;
}

export const LoanAssetFormSchema = z.object({
  loanType: z.string().nullable(),
  date: z.date(),
  endDate: z.date(),
  loanAmount: z.number().nullable(),
  loanPeriod: z.number().nullable(),
  interestRate: z.number(),
  insuranceAmount: z.number().nullable(),
  monthlyAmount: z.number().nullable(),
  loanOwnership: z.number(),
  applicationFees: z.number(),
  currency: z.string().nullable(),
  bindToProperty: z.string().optional(),
  name: z.string().optional(),
});

export type LoanAssetFormData = z.infer<typeof LoanAssetFormSchema>;
