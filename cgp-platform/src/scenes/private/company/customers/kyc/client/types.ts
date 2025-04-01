/* Personal Info Form */
import { z } from "zod";

import { CustomerRelationForm } from "../../../../../../../shared/schemas/relation";
import { Customer } from "../../../../../../types";

export const PersonalInfoFormSchema = z.object({
  gender: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  birthName: z.string().optional(),
  firstPhoneNumber: z.string().optional(),
  personalEmail: z.string().optional(),
  street: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  birthDate: z.string().optional(),
  birthCity: z.string().optional(),
  familySituation: z.string().optional(),
  nationality: z.string().optional(),
  fiscalAddress: z.string().optional(),
  studiesLevel: z.string().optional(),
  occupation: z.string().optional(),
  matrimonialRegime: z.string().optional(),
  usPerson: z.boolean().optional(),
});

export type PersonalInfoFormData = z.infer<typeof PersonalInfoFormSchema>;

export interface SectionState {
  relations: CustomerRelationForm[];
  linkedRelations: Customer[];
  showEditModal: CustomerRelationForm | null;
  isExpanded: boolean;
}
