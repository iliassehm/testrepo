import { Control } from "react-hook-form";

import {
  CompanyActivitiesSchema,
  CompanyFinancialSchema,
  HoldingCompanyInfo,
  HoldingManagerSchema,
  NbHoldingManagerSchema,
} from "../../../../../../../../shared/schemas/companyHolding";

export type HoldingCompanyFormValues = {
  socialReason: string;
  siren: string;
  siret: string;
  ape: string;
  creationDate: Date;
  socialCapital: number;
  headOfficeAddress: string;
  phone: string;
  email: string;

  lastNameFirstName: string;
  function: string;
  birthDate: string;
  nationality: string;
  personalAddress: string;
  personalPhoneNumber: string;
  personalEmailAddress: string;
  shareholderInformation: string;

  mainActivities: string;
  secondaryActivities: string;
  clients: string;
  suppliers: string;
  competitors: string;

  banks: string;
  iban: string;
  bankAccountNumbers: string;
  bic: string;
} & {
  [key: `lastNameFirstName-${number}`]: string;
  [key: `function-${number}`]: string;
  [key: `birthDate-${number}`]: string;
  [key: `nationality-${number}`]: string;
  [key: `personalAddress-${number}`]: string;
  [key: `personalPhoneNumber-${number}`]: string;
  [key: `personalEmailAddress-${number}`]: string;
};

export interface FormProps {
  control: Control<
    | CompanyActivitiesSchema
    | CompanyFinancialSchema
    | HoldingCompanyInfo
    | HoldingManagerSchema
    | NbHoldingManagerSchema
  >;
}
