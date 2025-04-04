import { UseFormReturn } from "react-hook-form";

import * as formData from "./investorProfileFormData";
import { InvestorProfileFormInputs } from "../../../../../../../shared/schemas/investorProfileFormSchema";
import { Text } from "../../../../../../components";
import { Radio2Images, RadioList, RadioListGraph } from "./utils";

export function AttitudeTowardsRiskForm({
  register,
  handleBlur,
}: {
  control: UseFormReturn<InvestorProfileFormInputs>["control"];
  register: UseFormReturn<InvestorProfileFormInputs>["register"];
  handleBlur: () => void;
}) {
  return (
    <div>
      <Text
        as="h3"
        className="font-bold text-blue-800 mb-4 mt-4"
        label="scenes.customers.conformity.investorProfile.form.attitudeTowardsRisk.title"
      />

      <div className="ml-5 mr-5">
        <RadioList
          list={formData.franceEconomisClimateOpinionNext3Years}
          i18nKey="attitudeTowardsRisk.franceEconomisClimateOpinionNext3Years"
          name="attitudeTowardsRisk.franceEconomisClimateOpinionNext3Years"
          register={register}
          submitOnValueChange={handleBlur}
        />
        <RadioList
          list={formData.closestAttitudes}
          i18nKey="attitudeTowardsRisk.closestAttitudes"
          name="attitudeTowardsRisk.closestAttitudes"
          register={register}
          submitOnValueChange={handleBlur}
        />
        <RadioList
          list={formData.reactionToDecreaseInvestmentValue_}
          i18nKey="attitudeTowardsRisk.reactionToDecreaseInvestmentValue"
          name="attitudeTowardsRisk.reactionToDecreaseInvestmentValue"
          register={register}
          submitOnValueChange={handleBlur}
        />

        <RadioListGraph
          list={formData.preferredReturn}
          i18nKey="attitudeTowardsRisk.preferredReturn"
          name="attitudeTowardsRisk.preferredReturn"
          register={register}
          submitOnValueChange={handleBlur}
        />

        <Radio2Images
          data={formData.investment15000Over10Years2}
          i18nKey="attitudeTowardsRisk.investment15000Over10Years2"
          name="attitudeTowardsRisk.investment15000Over10Years2"
          color1="investment15000Over10YearsRed"
          color2="investment15000Over10YearsGreen"
          imageSrc1="/images/investorProfileForm/GraphRing11.png"
          imageSrc2="/images/investorProfileForm/GraphRing180_less4.png"
          register={register}
          submitOnValueChange={handleBlur}
        />

        <Radio2Images
          data={formData.investment15000Over10Years1}
          i18nKey="attitudeTowardsRisk.investment15000Over10Years1"
          name="attitudeTowardsRisk.investment15000Over10Years1"
          color1="investment15000Over10YearsRed"
          color2="investment15000Over10YearsGreen"
          imageSrc1="/images/investorProfileForm/GraphRing11.png"
          imageSrc2="/images/investorProfileForm/GraphRing180_less6.png"
          register={register}
          submitOnValueChange={handleBlur}
        />

        <Radio2Images
          data={formData.investment15000Over10Years4}
          i18nKey="attitudeTowardsRisk.investment15000Over10Years4"
          name="attitudeTowardsRisk.investment15000Over10Years4"
          color1="investment15000Over10YearsRed"
          color2="investment15000Over10YearsGreen"
          imageSrc1="/images/investorProfileForm/GraphRing15.png"
          imageSrc2="/images/investorProfileForm/GraphRing70_less25_2.png"
          register={register}
          submitOnValueChange={handleBlur}
        />

        <Radio2Images
          data={formData.investment15000Over10Years3}
          i18nKey="attitudeTowardsRisk.investment15000Over10Years3"
          name="attitudeTowardsRisk.investment15000Over10Years3"
          color1="investment15000Over10YearsRed"
          color2="investment15000Over10YearsGreen"
          imageSrc1="/images/investorProfileForm/GraphRing15.png"
          imageSrc2="/images/investorProfileForm/GraphRing70_less25_1.png"
          register={register}
          submitOnValueChange={handleBlur}
        />

        <Radio2Images
          data={formData.investment15000Over10Years6}
          i18nKey="attitudeTowardsRisk.investment15000Over10Years6"
          name="attitudeTowardsRisk.investment15000Over10Years6"
          color1="investment15000Over10YearsGreen"
          color2="investment15000Over10YearsGreen"
          imageSrc1="/images/investorProfileForm/GraphRing15.png"
          imageSrc2="/images/investorProfileForm/GraphRing10_360_2.png"
          register={register}
          submitOnValueChange={handleBlur}
        />

        <Radio2Images
          data={formData.investment15000Over10Years5}
          i18nKey="attitudeTowardsRisk.investment15000Over10Years5"
          name="attitudeTowardsRisk.investment15000Over10Years5"
          color1="investment15000Over10YearsGreen"
          color2="investment15000Over10YearsGreen"
          imageSrc1="/images/investorProfileForm/GraphRing15.png"
          imageSrc2="/images/investorProfileForm/GraphRing10_360_1.png"
          register={register}
          submitOnValueChange={handleBlur}
        />
      </div>
    </div>
  );
}
