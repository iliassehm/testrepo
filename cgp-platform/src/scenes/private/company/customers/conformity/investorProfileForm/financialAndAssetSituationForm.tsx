import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import * as formData from "./investorProfileFormData";
import { InvestorProfileFormInputs } from "../../../../../../../shared/schemas/investorProfileFormSchema";
import { Button, Text } from "../../../../../../components";
import FieldAmount from "../../../../../../UIComponents/FieldAmount/FieldAmount";
import { RadioList } from "./utils";

export function FinancialAndAssetSituationForm({
  control,
  register,
  handleBlur,
  handleSyncBudget,
}: {
  control: UseFormReturn<InvestorProfileFormInputs>["control"];
  register: UseFormReturn<InvestorProfileFormInputs>["register"];
  handleBlur: () => void;
  handleSyncBudget?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Text
          as="h3"
          className="font-bold text-blue-800 mb-4 mt-4"
          label="scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.title"
        />
        {handleSyncBudget && (
          <Button
            id="financialSituation-syncBudget"
            label={t(
              "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.syncBudget"
            )}
            onClick={() => handleSyncBudget?.()}
            type="button"
          />
        )}
      </div>
      <div className="ml-5 mr-5 mb-4">
        <div>
          <Text
            as="h3"
            className="font-bold text-black-800 mb-2 bg-grey-400 pl-5"
            label="scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualIncome1.title"
          />
          <Controller
            name="financialSituation.annualIncome.employmentIncome"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualIncome1.employmentIncome"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualIncome.investmentIncome"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualIncome1.investmentIncome"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualIncome.companyIncome"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualIncome1.companyIncome"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualIncome.propertyIncome"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualIncome1.propertyIncome"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualIncome.retirementIncome"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualIncome1.retirementIncome"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualIncome.socialSecurityBenefits"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualIncome1.socialSecurityBenefits"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualIncome.otherIncome"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualIncome1.otherIncome"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualIncome.annualIncome1Total"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text
                      htmlFor={field.name}
                      className="font-bold text-blue-800 text-base pl-5"
                    >
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualIncome1.annualIncome1Total"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    disabled
                    className="w-fit ml-4 mt-2"
                  />
                </div>
              </div>
            )}
          />
        </div>

        <div>
          <Text
            as="h3"
            className="font-bold text-black-800 mb-2 bg-grey-400 pl-5"
            label="scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualCharges.title"
          />
          <Controller
            name="financialSituation.annualCharges.housingCosts"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualCharges.housingCosts"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualCharges.livingExpenses"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualCharges.livingExpenses"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualCharges.financialExpenses"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualCharges.financialExpenses"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualCharges.taxeGeneral"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualCharges.taxeGeneral"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualCharges.educationChildcare"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualCharges.educationChildcare"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualCharges.entertainmentAndLeisureExpenses"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualCharges.entertainmentAndLeisureExpenses"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualCharges.otherExpenses"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualCharges.otherExpenses"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualCharges.annualChargesTotal"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text
                      htmlFor={field.name}
                      className="font-bold text-blue-800 text-base pl-5"
                    >
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualCharges.annualChargesTotal"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    disabled
                    className="w-fit ml-4 mt-2"
                  />
                </div>
              </div>
            )}
          />
        </div>

        <div>
          <Text
            as="h3"
            className="font-bold text-black-800 mb-2 bg-grey-400 pl-5"
            label="scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualAssets.title"
          />
          <Controller
            name="financialSituation.annualAssets.savings"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualAssets.savings"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualAssets.realEstateAndLand"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualAssets.realEstateAndLand"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualAssets.businessAssets"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualAssets.businessAssets"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualAssets.otherMovablePropertyAndClaims"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text htmlFor={field.name} className="text-base pl-5">
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualAssets.otherMovablePropertyAndClaims"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    className="w-fit ml-4 mt-2"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="financialSituation.annualAssets.annualAssetsTotal"
            control={control}
            render={({ field }) => (
              <div className="flex flex-row mb-2">
                <div className="flex-1">
                  <div className="flex items-center h-12">
                    <Text
                      htmlFor={field.name}
                      className="font-bold text-blue-800 text-base pl-5"
                    >
                      {
                        t(
                          "scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.annualAssets.annualAssetsTotal"
                        ) as string
                      }
                    </Text>
                  </div>
                </div>
                <div className="flex-1">
                  <FieldAmount
                    id={field.name}
                    {...field}
                    disabled
                    className="w-fit ml-4 mt-2"
                  />
                </div>
              </div>
            )}
          />
        </div>
      </div>

      <div className="ml-5 mr-5">
        <Text
          as="h3"
          className="font-bold text-black-800"
          label="scenes.customers.conformity.investorProfile.form.financialAndAssetSituation.financialAssetSituationEvolution.title"
        />

        <RadioList
          list={formData.comingEvolutionType_}
          i18nKey="financialAndAssetSituation.financialAssetSituationEvolution.professionalIncomeComingEvolution"
          name="financialSituation.financialAssetSituationEvolution.professionalIncomeComingEvolution"
          register={register}
          submitOnValueChange={handleBlur}
        />
        <RadioList
          list={formData.comingEvolutionType_}
          i18nKey="financialAndAssetSituation.financialAssetSituationEvolution.heritageComingEvolution"
          name="financialSituation.financialAssetSituationEvolution.heritageComingEvolution"
          register={register}
          submitOnValueChange={handleBlur}
        />
        <RadioList
          list={formData.incomeForUnexpectedExpenses}
          i18nKey="financialAndAssetSituation.financialAssetSituationEvolution.incomeForUnexpectedExpenses"
          name="financialSituation.financialAssetSituationEvolution.incomeForUnexpectedExpenses"
          register={register}
          submitOnValueChange={handleBlur}
        />
      </div>
    </div>
  );
}
