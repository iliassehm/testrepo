import {
  InstrumentsSchemaKeys,
  InvestorProfileFormInputs,
} from "@shared-schemas/investorProfileFormSchema";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import * as formData from "./investorProfileFormData";
import { Text } from "../../../../../../components";
import { CheckBoxList, RadioList, Table } from "./utils";

export function FinancialKnowledgeAndExperienceForm({
  register,
  control,
  handleBlur,
}: {
  control: UseFormReturn<InvestorProfileFormInputs>["control"];
  register: UseFormReturn<InvestorProfileFormInputs>["register"];
  handleBlur: () => void;
}) {
  const { t } = useTranslation();
  const categories: InstrumentsSchemaKeys[] = [
    "equities",
    "bonds",
    "euroFunds",
    "financialRealEstate",
    "structuredProducts",
    "ventureCapital",
    "ucits",
    "leveragedProducts",
    "savingsAccounts",
    "lifeInsurance",
    "peaSecuritiesAccount",
  ];

  return (
    <div>
      <Text
        as="h3"
        className="font-bold text-blue-800 mb-4 mt-4"
        label="scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.title"
      />

      <div className="ml-5 mr-5">
        <div className="mb-6">
          <Text
            className="text-base mb-2 bg-grey-400 pl-5"
            label={
              "scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.title"
            }
          />
          <Table
            register={register}
            control={control}
            list={categories}
            name="radioCheckboxTable"
            submitOnValueChange={handleBlur}
          />
        </div>
        <div>
          <RadioList
            list={formData.investissorRate}
            i18nKey="financialKnowledgeAndExperience.investissorRate"
            name="financialKnowledgeAndExperience.investissorRate"
            register={register}
            submitOnValueChange={handleBlur}
          />
          <RadioList
            list={formData.financialInvestmentsTime}
            i18nKey="financialKnowledgeAndExperience.financialInvestmentsTime"
            name="financialKnowledgeAndExperience.financialInvestmentsTime"
            register={register}
            submitOnValueChange={handleBlur}
          />
          <RadioList
            list={formData.bestDescribes}
            i18nKey="financialKnowledgeAndExperience.bestDescribes"
            name="financialKnowledgeAndExperience.bestDescribes"
            register={register}
            submitOnValueChange={handleBlur}
          />
          <RadioList
            list={formData.observedDecreaseValue_}
            i18nKey="financialKnowledgeAndExperience.observedDecreaseValue"
            name="financialKnowledgeAndExperience.observedDecreaseValue"
            register={register}
            submitOnValueChange={handleBlur}
          />

          <CheckBoxList
            name="financialKnowledgeAndExperience.knownManagementModes"
            data={formData.knownManagementModes}
            i18nKey="financialKnowledgeAndExperience.knownManagementModes"
            register={register}
            control={control}
            submitOnValueChange={handleBlur}
          />
          <CheckBoxList
            name="financialKnowledgeAndExperience.choiceManagementModes"
            data={formData.choiceManagementModes}
            i18nKey="financialKnowledgeAndExperience.choiceManagementModes"
            register={register}
            control={control}
            submitOnValueChange={handleBlur}
          />

          <CheckBoxList
            name="financialKnowledgeAndExperience.informationSourcesForInvestments"
            data={formData.informationSourcesForInvestments}
            i18nKey="financialKnowledgeAndExperience.informationSourcesForInvestments"
            register={register}
            control={control}
            submitOnValueChange={handleBlur}
          />
        </div>
      </div>
    </div>
  );
}
