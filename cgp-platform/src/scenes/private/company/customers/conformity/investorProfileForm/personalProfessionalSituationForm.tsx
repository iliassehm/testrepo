import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import * as formData from "./investorProfileFormData";
import { InvestorProfileFormInputs } from "../../../../../../../shared/schemas/investorProfileFormSchema";
import { Text } from "../../../../../../components";
import { FieldNumber } from "../../../../../../UIComponents/FieldNumber/FieldNumber";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { RadioList } from "./utils";

export function PersonalProfessionalSituationForm({
  control,
  register,
  handleBlur,
}: {
  control: UseFormReturn<InvestorProfileFormInputs>["control"];
  register: UseFormReturn<InvestorProfileFormInputs>["register"];
  handleBlur: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div>
      <Text
        as="h3"
        className="font-bold text-blue-800 mb-4 mt-4"
        label="scenes.customers.conformity.investorProfile.form.personalProfessionalSituation.title"
      />
      <div className="ml-5 mr-5">
        <Text
          as="h3"
          className="font-bold text-black-800 mb-2"
          label="scenes.customers.conformity.investorProfile.form.personalProfessionalSituation.personalSituation.title"
        />
        <RadioList
          list={formData.civility}
          i18nKey="personalProfessionalSituation.personalSituation.civility"
          name="personalSituation.civility"
          register={register}
          submitOnValueChange={handleBlur}
        />
        <Controller
          name="personalSituation.mainZipCode"
          control={control}
          render={({ field }) => (
            <div className="mb-6">
              <Text
                htmlFor={field.name}
                className="text-base mb-2 bg-grey-400 pl-5"
                label="scenes.customers.conformity.investorProfile.form.personalProfessionalSituation.personalSituation.mainZipCode"
              />
              <FieldText
                id={field.name}
                {...field}
                className="w-fit ml-4 mt-2"
                onBlur={handleBlur}
              />
            </div>
          )}
        />
        <RadioList
          list={formData.familySituation}
          i18nKey="personalProfessionalSituation.personalSituation.familySituation"
          name="personalSituation.familySituation"
          register={register}
          submitOnValueChange={handleBlur}
        />
        <Controller
          name="personalSituation.dependentsNb"
          control={control}
          render={({ field }) => (
            <div className="mb-6">
              <Text
                htmlFor={field.name}
                className="text-base mb-2 bg-grey-400 pl-5"
                label="scenes.customers.conformity.investorProfile.form.personalProfessionalSituation.personalSituation.dependentsNb"
              />
              <FieldNumber
                id={field.name}
                {...field}
                min={0}
                className="w-fit ml-4 mt-2"
                onBlur={handleBlur}
              />
            </div>
          )}
        />
        <RadioList
          list={formData.formationLevel}
          i18nKey="personalProfessionalSituation.personalSituation.formationLevel"
          name="personalSituation.formationLevel"
          register={register}
          submitOnValueChange={handleBlur}
        />
      </div>
      <div className="ml-5 mr-5">
        <Text
          as="h3"
          className="font-bold text-black-800 mb-2"
          label="scenes.customers.conformity.investorProfile.form.personalProfessionalSituation.professionalSituation.title"
        />
        <RadioList
          list={formData.professionalStatus}
          i18nKey="personalProfessionalSituation.professionalSituation.professionalStatus"
          name="professionalSituation.professionalStatus"
          register={register}
          submitOnValueChange={handleBlur}
        />
        <RadioList
          list={formData.employmentStability}
          i18nKey="personalProfessionalSituation.professionalSituation.employmentStability"
          name="professionalSituation.employmentStability"
          register={register}
          submitOnValueChange={handleBlur}
        />
        <RadioList
          list={formData.experienceRange}
          i18nKey="personalProfessionalSituation.professionalSituation.experienceRange"
          name="professionalSituation.experienceRange"
          register={register}
          submitOnValueChange={handleBlur}
        />
        <RadioList
          list={formData.currentPastProfession}
          i18nKey="personalProfessionalSituation.professionalSituation.currentPastProfession"
          name="professionalSituation.currentPastProfession"
          register={register}
          submitOnValueChange={handleBlur}
        />
        <Controller
          name="professionalSituation.agePensionEnvisage"
          control={control}
          render={({ field }) => (
            <div className="mb-6">
              <Text
                htmlFor={field.name}
                className="text-base mb-2 bg-grey-400 pl-5"
                label="scenes.customers.conformity.investorProfile.form.personalProfessionalSituation.professionalSituation.agePensionEnvisage"
              />
              <FieldNumber
                id={field.name}
                {...field}
                className="w-fit ml-4 mt-2"
                onBlur={handleBlur}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}
