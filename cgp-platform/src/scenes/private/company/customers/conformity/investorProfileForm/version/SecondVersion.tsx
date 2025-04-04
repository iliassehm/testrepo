import { zodResolver } from "@hookform/resolvers/zod";
import {
  type InvestorProfileFormInputs,
  investorProfileFormSchema,
} from "@shared-schemas/investorProfileFormSchema";
import { pick } from "@tanstack/react-router";
import { t } from "i18next";
import { type KeyboardEvent, useEffect } from "react";
import {
  Controller,
  type FieldErrors,
  type FormState,
  useForm,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { calculateTotalScore } from "../../../../../../../../shared/utils/calculateInvestorProfile";
import { Button, Text } from "../../../../../../../components";
import { isEmpty } from "../../../../../../../helpers";
import { useDebounce } from "../../../../../../../hooks/useDebounce";
import { useToast } from "../../../../../../../hooks/useToast";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { useCustomerContext } from "../../../customerContext";
import { AttitudeTowardsRiskForm } from "../attitudeTowardsRiskForm";
import { FinancialAndAssetSituationForm } from "../financialAndAssetSituationForm";
import { FinancialKnowledgeAndExperienceForm } from "../financialKnowledgeAndExperienceForm";
import type { InvestorProfileForm } from "../investorProfileForm";
import { PersonalProfessionalSituationForm } from "../personalProfessionalSituationForm";
import { SustainableInvestmentForm } from "../sustainableInvestmentForm";

interface InvestorProfileFormSecondVersion {
  defaultValue: InvestorProfileFormInputs;
  onSubmit: (data: {
    data: InvestorProfileFormInputs;
    hideNotification?: boolean;
    scrollToTop?: boolean;
  }) => void;
  isLoading?: boolean;
  disableAutoSubmit?: boolean;
  handleSyncBudget?: () => void;
}

export function InvestorProfileFormSecondVersion({
  onSubmit,
  isLoading = false,
  defaultValue: defaultValues = {} as InvestorProfileFormInputs,
  disableAutoSubmit = false,
  handleSyncBudget,
}: InvestorProfileForm) {
  const { t } = useTranslation();
  const {
    generalInfosForm: { getValues, ...generalInfosForm },
  } = useCustomerContext();
  const { control, register, watch, setValue, reset, ...form } =
    useForm<InvestorProfileFormInputs>({
      resolver: zodResolver(investorProfileFormSchema),
      values: defaultValues,
      resetOptions: {
        keepValues: false,
        keepDefaultValues: false,
        keepDirtyValues: false,
        keepDirty: false,
      },
    });

  const handleSubmit = (scrollToTop = false) => {
    const data = form.getValues();
    const updatedData = calculateTotalScore(data, {
      birthDate: getValues("birthDate"),
    });
    const oldVersionData = pick(defaultValues, [
      "q1",
      "q2",
      "q4",
      "q5",
      "q6",
      "q7",
      "q8",
      "q10",
      "q11",
      "q12",
      "q13",
      "q14",
      "q15",
      "q16",
      "q17",
      "q18",
      "q19",
      "q9a",
      "q9b",
    ]);
    onSubmit({
      input: { ...updatedData, ...oldVersionData },
      hideNotification: false,
      scrollToTop,
    });
  };

  const debouncedOnSubmit = useDebounce(() => handleSubmit(false), 3000);

  const handleBlur = () => {
    if (disableAutoSubmit) return;
    debouncedOnSubmit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleReset = () => {
    const newValues = {} as InvestorProfileFormInputs;
    reset(newValues);

    onSubmit({ input: newValues });
  };

  useUpdateFinancialAndAssetSituationTotals(watch, setValue);
  useToastFormError(form.formState);

  const sustainabilityConditions = watch([
    "sustainableInvestment.includeEnvironmentalSocialGovernanceDimension",
    "sustainableInvestment.excludeNegativeActivitiesEnvironmentalSocial",
  ]);
  const [
    includeEnvironmentalSocialGovernanceDimension,
    excludeNegativeActivitiesEnvironmentalSocial,
  ] = sustainabilityConditions;

  useEffect(() => {
    if (includeEnvironmentalSocialGovernanceDimension !== "YES") {
      setValue(
        "sustainableInvestment.optionsDefineSustainabilityComponent",
        null
      );
      setValue("sustainableInvestment.taxonomyAlignment", null);
      setValue("sustainableInvestment.preferredASGDimension", null);
      setValue(
        "sustainableInvestment.excludeNegativeActivitiesEnvironmentalSocial",
        null
      );
      setValue("sustainableInvestment.issuesMinimizeNegativeImpacts", null);
    }
    if (excludeNegativeActivitiesEnvironmentalSocial !== "YES") {
      setValue("sustainableInvestment.issuesMinimizeNegativeImpacts", null);
    }
  }, [
    includeEnvironmentalSocialGovernanceDimension,
    excludeNegativeActivitiesEnvironmentalSocial,
    setValue,
  ]);

  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(true);
      }}
      onKeyDown={handleKeyDown}
    >
      <Button
        type="reset"
        variant="bordered"
        size="small"
        className="py-1 rounded-md absolute -top-12 right-0"
        label="forms.fields.conformity.investorProfile.reset"
        onClick={handleReset}
      />
      <Text
        as="h3"
        className="font-bold text-blue-800 mb-4 bg-grey-400 pl-5"
        label="scenes.customers.conformity.investorProfile.form.profile.title"
      />
      <div className="flex ml-5 mr-5 mb-4">
        <Controller
          name="lastName"
          control={generalInfosForm.control}
          render={({ field }) => (
            <div className="flex flex-1 flex-row items-center mb-2">
              <div className="flex items-center h-12">
                <Text htmlFor={field.name} className="text-base pl-5">
                  {
                    t(
                      "scenes.customers.conformity.investorProfile.form.profile.name"
                    ) as string
                  }
                </Text>
              </div>
              <div className="flex-1">
                <FieldText
                  id={field.name}
                  {...field}
                  className="w-fit ml-4"
                  onBlur={handleBlur}
                />
              </div>
            </div>
          )}
        />
        <Controller
          name="firstName"
          control={generalInfosForm.control}
          render={({ field }) => (
            <div className="flex flex-1 flex-row items-center mb-2">
              <div className="flex items-center h-12">
                <Text htmlFor={field.name} className="text-base pl-5">
                  {
                    t(
                      "scenes.customers.conformity.investorProfile.form.profile.firstName"
                    ) as string
                  }
                </Text>
              </div>
              <div className="flex-1">
                <FieldText
                  id={field.name}
                  {...field}
                  className="w-fit p-4 m-2 pr-8"
                  onBlur={handleBlur}
                />
              </div>
            </div>
          )}
        />
        <Controller
          name="birthDate"
          control={generalInfosForm.control}
          render={({ field }) => (
            <div className="flex flex-1 flex-row items-center mb-2">
              <div className="flex items-center h-12">
                <Text htmlFor={field.name} className="text-base pl-5">
                  {
                    t(
                      "scenes.customers.conformity.investorProfile.form.profile.birthDate"
                    ) as string
                  }
                </Text>
              </div>
              <div className="flex-1">
                <FieldDate
                  id={field.name}
                  {...field}
                  onValueChange={() => {
                    field.onChange;
                    handleBlur();
                  }}
                  className=" p-4 m-2 pr-8"
                />
              </div>
            </div>
          )}
        />
      </div>

      <PersonalProfessionalSituationForm
        control={control}
        register={register}
        handleBlur={handleBlur}
      />
      <FinancialAndAssetSituationForm
        control={control}
        register={register}
        handleBlur={handleBlur}
        handleSyncBudget={handleSyncBudget}
      />
      <FinancialKnowledgeAndExperienceForm
        control={control}
        register={register}
        handleBlur={handleBlur}
      />
      <SustainableInvestmentForm
        control={control}
        register={register}
        sustainabilityConditions={sustainabilityConditions}
        handleBlur={handleBlur}
      />
      <AttitudeTowardsRiskForm
        control={control}
        register={register}
        handleBlur={handleBlur}
      />

      <Button
        label="forms.fields.actions.save"
        type="submit"
        className="mt-6"
        loading={
          isLoading ||
          form.formState.isSubmitting ||
          form.formState.isValidating
        }
      />
    </form>
  );
}

function getError(formState: FormState<InvestorProfileFormInputs>) {
  const keys = Object.keys(formState.errors);
  if (!keys.length) return;

  const firstKey = keys[0] as keyof InvestorProfileFormInputs;
  const errors = formState.errors[firstKey];
  const fieldName = Object.keys(
    errors as unknown as Record<string, string>
  )?.[0];
  const error = errors?.[fieldName as keyof typeof errors] as FieldErrors;

  let field = "";

  switch (firstKey) {
    case "personalSituation":
      field = t(
        `scenes.customers.conformity.investorProfile.form.personalProfessionalSituation.personalSituation.${fieldName}.title`
      );
      break;
    case "professionalSituation":
      field = t(
        `scenes.customers.conformity.investorProfile.form.personalProfessionalSituation.professionalSituation.${fieldName}.title`
      );
      break;
    case "financialKnowledgeAndExperience":
      field = t(
        "scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.title"
      );
      break;
    case "sustainableInvestment":
      field = t(
        `scenes.customers.conformity.investorProfile.form.sustainableInvestment.${fieldName}.title`
      );
      break;
    case "attitudeTowardsRisk":
      field = t(
        `scenes.customers.conformity.investorProfile.form.attitudeTowardsRisk.${fieldName}.title`
      );
      break;
    default:
      break;
  }

  if (!error) return;

  return { error, field };
}

function useToastFormError(formState: FormState<InvestorProfileFormInputs>) {
  const toast = useToast();

  useEffect(() => {
    const errors = formState.errors;

    if (!isEmpty(errors)) {
      let detail: string = t("forms.fields.actions.error");
      const error = getError(formState);

      if (error) {
        detail = t("forms.errorOnField", {
          field: error.field,
        });
      }

      toast?.current?.show({
        severity: "error",
        summary: "Error",
        detail,
      });
    }
  }, [formState, toast]);
}

function useUpdateFinancialAndAssetSituationTotals(
  watch: UseFormWatch<InvestorProfileFormInputs>,
  setValue: UseFormSetValue<InvestorProfileFormInputs>
) {
  const annualIncomes = watch("financialSituation.annualIncome");
  const annualCharges = watch("financialSituation.annualCharges");
  const annualAssets = watch("financialSituation.annualAssets");
  const budgetListData = watch("budgetListData");
  const annualAssetsListData = watch("annualAssetsListData");

  // Watch income fields to automatically calculate the total
  const employmentIncome = watch(
    "financialSituation.annualIncome.employmentIncome"
  );
  const investmentIncome = watch(
    "financialSituation.annualIncome.investmentIncome"
  );
  const companyIncome = watch("financialSituation.annualIncome.companyIncome");
  const propertyIncome = watch(
    "financialSituation.annualIncome.propertyIncome"
  );
  const retirementIncome = watch(
    "financialSituation.annualIncome.retirementIncome"
  );
  const socialSecurityBenefits = watch(
    "financialSituation.annualIncome.socialSecurityBenefits"
  );
  const otherIncome = watch("financialSituation.annualIncome.otherIncome");

  useEffect(() => {
    const total =
      (employmentIncome || 0) +
      (investmentIncome || 0) +
      (companyIncome || 0) +
      (propertyIncome || 0) +
      (retirementIncome || 0) +
      (socialSecurityBenefits || 0) +
      (otherIncome || 0);
    setValue("financialSituation.annualIncome.annualIncome1Total", total);
  }, [
    employmentIncome,
    investmentIncome,
    companyIncome,
    propertyIncome,
    retirementIncome,
    socialSecurityBenefits,
    otherIncome,
    annualIncomes,
    budgetListData,
    setValue,
  ]);

  // Watch fields to automatically calculate the total
  const housingCosts = watch("financialSituation.annualCharges.housingCosts");
  const livingExpenses = watch(
    "financialSituation.annualCharges.livingExpenses"
  );
  const financialExpenses = watch(
    "financialSituation.annualCharges.financialExpenses"
  );
  const taxeGeneral = watch("financialSituation.annualCharges.taxeGeneral");
  const educationChildcare = watch(
    "financialSituation.annualCharges.educationChildcare"
  );
  const entertainmentAndLeisureExpenses = watch(
    "financialSituation.annualCharges.entertainmentAndLeisureExpenses"
  );
  const otherExpenses = watch("financialSituation.annualCharges.otherExpenses");

  useEffect(() => {
    const total =
      (housingCosts || 0) +
      (livingExpenses || 0) +
      (financialExpenses || 0) +
      (taxeGeneral || 0) +
      (educationChildcare || 0) +
      (entertainmentAndLeisureExpenses || 0) +
      (otherExpenses || 0);
    setValue("financialSituation.annualCharges.annualChargesTotal", total);
  }, [
    housingCosts,
    livingExpenses,
    financialExpenses,
    taxeGeneral,
    educationChildcare,
    entertainmentAndLeisureExpenses,
    otherExpenses,
    annualCharges,
    budgetListData,
    setValue,
  ]);

  // Watch fields to automatically calculate the total
  const savings = watch("financialSituation.annualAssets.savings");
  const realEstateAndLand = watch(
    "financialSituation.annualAssets.realEstateAndLand"
  );
  const businessAssets = watch(
    "financialSituation.annualAssets.businessAssets"
  );
  const otherMovablePropertyAndClaims = watch(
    "financialSituation.annualAssets.otherMovablePropertyAndClaims"
  );

  useEffect(() => {
    const total =
      (savings || 0) +
      (realEstateAndLand || 0) +
      (businessAssets || 0) +
      (otherMovablePropertyAndClaims || 0);
    setValue("financialSituation.annualAssets.annualAssetsTotal", total);
  }, [
    savings,
    realEstateAndLand,
    businessAssets,
    otherMovablePropertyAndClaims,
    annualAssets,
    annualAssetsListData,
    setValue,
  ]);
}
