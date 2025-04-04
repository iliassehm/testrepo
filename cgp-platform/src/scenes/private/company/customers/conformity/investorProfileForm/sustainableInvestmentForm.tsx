import type { UseFormReturn } from "react-hook-form";

import * as formData from "./investorProfileFormData";
import type { InvestorProfileFormInputs } from "@shared-schemas/investorProfileFormSchema";
import { Text } from "../../../../../../components";
import { CheckBoxList, RadioList } from "./utils";

export function SustainableInvestmentForm({
  control,
  register,
  sustainabilityConditions,
  handleBlur,
}: {
  control: UseFormReturn<InvestorProfileFormInputs>["control"];
  register: UseFormReturn<InvestorProfileFormInputs>["register"];
  sustainabilityConditions: [
    "NO" | "YES" | null | undefined,
    "NO" | "YES" | null | undefined,
  ];
  handleBlur: () => void;
}) {
  return (
    <div>
      <Text
        as="h3"
        className="font-bold text-blue-800 mb-4 mt-4"
        label="scenes.customers.conformity.investorProfile.form.sustainableInvestment.title"
      />

      <div className="ml-5 mr-5">
        <RadioList
          list={formData.includeEnvironmentalSocialGovernanceDimension}
          i18nKey="sustainableInvestment.includeEnvironmentalSocialGovernanceDimension"
          name="sustainableInvestment.includeEnvironmentalSocialGovernanceDimension"
          register={register}
          submitOnValueChange={handleBlur}
        />
        {!sustainabilityConditions ||
          (sustainabilityConditions[0] === "YES" && (
            <>
              <RadioList
                list={formData.optionsDefineSustainabilityComponent}
                i18nKey="sustainableInvestment.optionsDefineSustainabilityComponent"
                name="sustainableInvestment.optionsDefineSustainabilityComponent"
                register={register}
                submitOnValueChange={handleBlur}
              />

              <RadioList
                list={formData.taxonomyAlignment}
                i18nKey="sustainableInvestment.taxonomyAlignment"
                name="sustainableInvestment.taxonomyAlignment"
                info="sustainableInvestment.taxonomyAlignment.info"
                register={register}
                submitOnValueChange={handleBlur}
              />

              <RadioList
                list={formData.preferredASGDimension}
                i18nKey="sustainableInvestment.preferredASGDimension"
                name="sustainableInvestment.preferredASGDimension"
                register={register}
                submitOnValueChange={handleBlur}
              />
              <RadioList
                list={formData.excludeNegativeActivitiesEnvironmentalSocial}
                i18nKey="sustainableInvestment.excludeNegativeActivitiesEnvironmentalSocial"
                name="sustainableInvestment.excludeNegativeActivitiesEnvironmentalSocial"
                register={register}
                submitOnValueChange={handleBlur}
              />

              {!sustainabilityConditions ||
                (sustainabilityConditions[1] === "YES" && (
                  <CheckBoxList
                    name="sustainableInvestment.issuesMinimizeNegativeImpacts"
                    data={formData.issuesMinimizeNegativeImpacts}
                    i18nKey="sustainableInvestment.issuesMinimizeNegativeImpacts"
                    register={register}
                    control={control}
                    submitOnValueChange={handleBlur}
                  />
                ))}
            </>
          ))}
      </div>
    </div>
  );
}
