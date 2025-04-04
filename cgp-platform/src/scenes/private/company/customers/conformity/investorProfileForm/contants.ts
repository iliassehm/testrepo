import { useTranslation } from "react-i18next";

export const useTranslatedStaticData = () => {
  const { t } = useTranslation();

  const knowledgeAndExperience = [
    {
      id: 0,
      label: t("scenes.customers.conformity.investorProfile.nonDefined"),
    },
    { id: 1, label: t("scenes.customers.conformity.investorProfile.beginner") },
    { id: 2, label: t("scenes.customers.conformity.investorProfile.informed") },
    {
      id: 3,
      label: t("scenes.customers.conformity.investorProfile.experienced"),
    },
  ];

  const riskProfile = [
    {
      id: 0,
      label: t("scenes.customers.conformity.investorProfile.nonDefined"),
    },
    {
      id: 1,
      label: t("scenes.customers.conformity.investorProfile.offensive"),
    },
    {
      id: 2,
      label: t("scenes.customers.conformity.investorProfile.experienced"),
    },
    { id: 3, label: t("scenes.customers.conformity.investorProfile.balanced") },
    {
      id: 4,
      label: t("scenes.customers.conformity.investorProfile.defensive"),
    },
    { id: 5, label: t("scenes.customers.conformity.investorProfile.secure") },
  ];

  const newRiskProfile = [
    {
      id: 0,
      label: t("scenes.customers.conformity.investorProfile.nonDefined"),
    },
    {
      id: 1,
      label: t("scenes.customers.conformity.investorProfile.secure"),
    },
    {
      id: 2,
      label: t("scenes.customers.conformity.investorProfile.defensive"),
    },
    { id: 3, label: t("scenes.customers.conformity.investorProfile.balanced") },
    {
      id: 4,
      label: t("scenes.customers.conformity.investorProfile.experienced"),
    },
    {
      id: 5,
      label: t("scenes.customers.conformity.investorProfile.offensive"),
    },
  ];

  const nonFinancialSensitivity = [
    {
      id: 0,
      label: t(
        "scenes.customers.conformity.investorProfile.sensibilityNeutral"
      ),
    },
    { id: 1, label: t("scenes.customers.conformity.investorProfile.neutral") },
    { id: 2, label: t("scenes.customers.conformity.investorProfile.moderate") },
    {
      id: 3,
      label: t("scenes.customers.conformity.investorProfile.significant"),
    },
    { id: 4, label: t("scenes.customers.conformity.investorProfile.strong") },
  ];

  const environmentalActivities = [
    { id: 1, label: t("scenes.customers.conformity.investorProfile.sensible") },
    { id: 2, label: t("scenes.customers.conformity.investorProfile.neutral") },
    {
      id: 3,
      label: t("scenes.customers.conformity.investorProfile.unSensile"),
    },
  ];

  const environmentalSocialGoal = [
    { id: 1, label: t("scenes.customers.conformity.investorProfile.sensible") },
    { id: 2, label: t("scenes.customers.conformity.investorProfile.neutral") },
    {
      id: 3,
      label: t("scenes.customers.conformity.investorProfile.unSensile"),
    },
  ];

  return {
    knowledgeAndExperience,
    riskProfile,
    newRiskProfile,
    nonFinancialSensitivity,
    environmentalActivities,
    environmentalSocialGoal,
  };
};
