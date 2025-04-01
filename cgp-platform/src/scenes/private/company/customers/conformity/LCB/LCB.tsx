import React from "react";
import { FormProvider } from "react-hook-form";

import { LCBForm } from "../../../../../../../shared/schemas/lcb";
import { Button, Loading } from "../../../../../../components";
import { useCustomerContext } from "../../customerContext";
import { AdvisersOpinion } from "./AdvisersOpinion";
import { CharacteristicsCustomer } from "./CharacteristicsCustomer";
import { EnteringRelationship } from "./EnteringRelationship";
import { PersonalInformations } from "./PersonalInformations";
import { ProfessionalActivity } from "./ProfessionalActivity";

export type LcbExtendedValidationSchema = Omit<
  LCBForm,
  | "birthDate"
  | "entryDateIntoRelationship"
  | "remoteOpening"
  | "dateLastMeeting"
  | "entryIntoRelationshipNote"
  | "consistency"
  | "riskyActivity"
  | "potentialRisk"
  | "suspicionTaxFraud"
> & {
  birthDate?: string;
  entryDateIntoRelationship?: string;
  remoteOpening?: string | boolean;
  consistency?: string | boolean;
  riskyActivity?: string | boolean;
  potentialRisk?: string | boolean;
  suspicionTaxFraud?: string | boolean;
};

export const LCB = () => {
  const { customerQuery } = useCustomerContext();

  if (customerQuery.isLoading) return <Loading />;

  return <LCBForms />;
};

function LCBForms() {
  const { lcbForm: form, updateForms, onSubmit } = useCustomerContext();

  return (
    <FormProvider {...form}>
      <form className="flex w-full flex-col pb-10" onSubmit={onSubmit}>
        <div className="flex justify-end items-start">
          <div className="flex space-x-2">
            <Button
              label="actions.save"
              size="small"
              type="submit"
              loading={updateForms.isLoading}
            />
          </div>
        </div>

        <CharacteristicsCustomer />
        <EnteringRelationship  />
        <PersonalInformations />
        <ProfessionalActivity />
        <AdvisersOpinion />
      </form>
    </FormProvider>
  );
}
