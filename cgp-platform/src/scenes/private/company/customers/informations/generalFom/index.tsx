import React from "react";
import { FormProvider } from "react-hook-form";

import { Button } from "../../../../../../components";
import { EnteringRelationship } from "../../conformity/LCB/EnteringRelationship";
import { useCustomerContext } from "../../customerContext";
import { IdentityForm } from "./identityForm";
import { MaritalForm } from "./maritalForm";
import { OtherInformationForm } from "./otherInformationForm";
import { ProfessionalSituationForm } from "./professionalSituationForm";

const GeneralInformationsForm: React.FC = () => {
  const {
    generalInfosForm: form,
    updateForms,
    onSubmit,
  } = useCustomerContext();

  return (
    <FormProvider {...form}>
      <form className="w-full" onSubmit={onSubmit}>
        <Button
          label="actions.save"
          type="submit"
          className="absolute top-0 right-0 flex w-fit self-end"
          loading={updateForms.isLoading}
        />

        <div className={"grid grid-cols-2 gap-12"}>
          <div className={"col-span-full"}>
            <EnteringRelationship />
          </div>
          <div className={"flex flex-col gap-4 col-span-1"}>
            <MaritalForm />
            <ProfessionalSituationForm />
          </div>
          <div className={"flex flex-col gap-8 col-span-1"}>
            <IdentityForm />
            <OtherInformationForm />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default GeneralInformationsForm;
