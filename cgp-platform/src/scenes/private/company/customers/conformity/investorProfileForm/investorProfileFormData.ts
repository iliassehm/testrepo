import {
  bestDescribesType,
  civilityType,
  closestAttitudesType,
  comingEvolutionType,
  currentPastProfessionType,
  employmentStabilityType,
  experienceRangeType,
  familySituationType,
  financialInvestmentsTimeType,
  formationLevelType,
  franceEconomisClimateOpinionNext3YearsType,
  incomeForUnexpectedExpensesType,
  informationSourcesForInvestmentsType,
  investissorRateType,
  investment15000Over10YearsType1,
  investment15000Over10YearsType2,
  investment15000Over10YearsType3,
  investment15000Over10YearsType4,
  investment15000Over10YearsType5,
  investment15000Over10YearsType6,
  issuesMinimizeNegativeImpactsType,
  managementModesType,
  observedDecreaseValueType,
  optionsDefineSustainabilityComponentType,
  preferredASGDimensionType,
  preferredReturnType,
  professionalStatusType,
  reactionToDecreaseInvestmentValueType,
  taxonomyAlignmentType,
  yesNoType,
} from "../../../../../../../shared/schemas/investorProfileFormSchema";
import { InvestorProfileListItem } from "./utils";

const civilityValues = civilityType._def.values as string[];
export const civility: InvestorProfileListItem[] = civilityValues.map(
  (value) => ({
    value,
  })
);

const familySituationValues = familySituationType._def.values as string[];
export const familySituation: InvestorProfileListItem[] =
  familySituationValues.map((value) => ({
    value,
  }));

const formationLevelValues = formationLevelType._def.values as string[];
export const formationLevel: InvestorProfileListItem[] =
  formationLevelValues.map((value) => ({
    value,
  }));

const professionalStatusValues = professionalStatusType._def.values as string[];
export const professionalStatus: InvestorProfileListItem[] =
  professionalStatusValues.map((value) => ({
    value,
  }));

/*
 *  Part 2
 */

const currentPastProfessionValues = currentPastProfessionType._def
  .values as string[];
export const currentPastProfession: InvestorProfileListItem[] =
  currentPastProfessionValues.map((value) => ({
    value,
  }));

const experienceRangeValues = experienceRangeType._def.values as string[];
export const experienceRange: InvestorProfileListItem[] =
  experienceRangeValues.map((value) => ({
    value,
  }));

export const employmentStabilityValues = employmentStabilityType._def
  .values as string[];
export const employmentStability: InvestorProfileListItem[] =
  employmentStabilityValues.map((value) => ({
    value,
  }));

const comingEvolutionTypeValues = comingEvolutionType._def.values as string[];
export const comingEvolutionType_: InvestorProfileListItem[] =
  comingEvolutionTypeValues.map((value) => ({
    value,
  }));

const incomeForUnexpectedExpensesValues = incomeForUnexpectedExpensesType._def
  .values as string[];
export const incomeForUnexpectedExpenses: InvestorProfileListItem[] =
  incomeForUnexpectedExpensesValues.map((value) => ({
    value,
  }));

const investissorRateValues = investissorRateType._def.values as string[];
export const investissorRate: InvestorProfileListItem[] =
  investissorRateValues.map((value) => ({
    value,
  }));

const financialInvestmentsTimeValues = financialInvestmentsTimeType._def
  .values as string[];
export const financialInvestmentsTime: InvestorProfileListItem[] =
  financialInvestmentsTimeValues.map((value) => ({
    value,
  }));

const bestDescribesValues = bestDescribesType._def.values as string[];
export const bestDescribes: InvestorProfileListItem[] = bestDescribesValues.map(
  (value) => ({
    value,
  })
);

const observedDecreaseValue = observedDecreaseValueType._def.values as string[];
export const observedDecreaseValue_: InvestorProfileListItem[] =
  observedDecreaseValue.map((value) => ({
    value,
  }));

const managementModesValue = managementModesType._def.values as string[];
const knownManagementModesMap = new Map(
  managementModesValue.map((value, index) => [
    `financialKnowledgeAndExperience.knownManagementModes._${index + 1}`,
    value,
  ])
);
export const knownManagementModes = Object.fromEntries(knownManagementModesMap);
const choiceManagementModesMap = new Map(
  managementModesValue.map((value, index) => [
    `financialKnowledgeAndExperience.choiceManagementModes._${index + 1}`,
    value,
  ])
);
export const choiceManagementModes = Object.fromEntries(
  choiceManagementModesMap
);

const informationSourcesForInvestmentsValue =
  informationSourcesForInvestmentsType._def.values as string[];
const informationSourcesForInvestmentsMap = new Map(
  informationSourcesForInvestmentsValue.map((value, index) => [
    `financialKnowledgeAndExperience.informationSourcesForInvestments._${index + 1}`,
    value,
  ])
);
export const informationSourcesForInvestments = Object.fromEntries(
  informationSourcesForInvestmentsMap
);

/*
 *  Part 4
 */

const yesNoValue = yesNoType._def.values as string[];
export const includeEnvironmentalSocialGovernanceDimension: InvestorProfileListItem[] =
  yesNoValue.map((value) => ({
    value,
  }));

const optionsDefineSustainabilityComponentValue =
  optionsDefineSustainabilityComponentType._def.values as string[];
export const optionsDefineSustainabilityComponent: InvestorProfileListItem[] =
  optionsDefineSustainabilityComponentValue.map((value) => ({
    value,
  }));

const taxonomyAlignmentValues = taxonomyAlignmentType._def.values as string[];
export const taxonomyAlignment: InvestorProfileListItem[] =
  taxonomyAlignmentValues.map((value) => ({
    value,
  }));

const preferredASGDimensionValue = preferredASGDimensionType._def
  .values as string[];
export const preferredASGDimension: InvestorProfileListItem[] =
  preferredASGDimensionValue.map((value) => ({
    value,
  }));

export const excludeNegativeActivitiesEnvironmentalSocial: InvestorProfileListItem[] =
  yesNoValue.map((value) => ({
    value,
  }));

const issuesMinimizeNegativeImpactsValue = issuesMinimizeNegativeImpactsType
  ._def.values as string[];
const issuesMinimizeNegativeImpactsMap = new Map(
  issuesMinimizeNegativeImpactsValue.map((value, index) => [
    `sustainableInvestment.issuesMinimizeNegativeImpacts._${index + 1}`,
    value,
  ])
);
export const issuesMinimizeNegativeImpacts = Object.fromEntries(
  issuesMinimizeNegativeImpactsMap
);

/*
 *  Part 5
 */

const franceEconomisClimateOpinionNext3YearsValue =
  franceEconomisClimateOpinionNext3YearsType._def.values as string[];
export const franceEconomisClimateOpinionNext3Years: InvestorProfileListItem[] =
  franceEconomisClimateOpinionNext3YearsValue.map((value) => ({
    value,
  }));

const closestAttitudesValue = closestAttitudesType._def.values as string[];
export const closestAttitudes: InvestorProfileListItem[] =
  closestAttitudesValue.map((value) => ({
    value,
  }));

const reactionToDecreaseInvestmentValue = reactionToDecreaseInvestmentValueType
  ._def.values as string[];
export const reactionToDecreaseInvestmentValue_: InvestorProfileListItem[] =
  reactionToDecreaseInvestmentValue.map((value) => ({
    value,
  }));

const preferredReturnValue = preferredReturnType._def.values as string[];
export const preferredReturn: InvestorProfileListItem[] =
  preferredReturnValue.map((value) => ({
    value,
  }));

const investment15000Over10Years1Value = investment15000Over10YearsType1._def
  .values as string[];
export const investment15000Over10Years1: InvestorProfileListItem[] =
  investment15000Over10Years1Value.map((value) => ({
    value,
  }));

const investment15000Over10Years2Value = investment15000Over10YearsType2._def
  .values as string[];
export const investment15000Over10Years2: InvestorProfileListItem[] =
  investment15000Over10Years2Value.map((value) => ({
    value,
  }));

const investment15000Over10Years3Value = investment15000Over10YearsType3._def
  .values as string[];
export const investment15000Over10Years3: InvestorProfileListItem[] =
  investment15000Over10Years3Value.map((value) => ({
    value,
  }));

const investment15000Over10Years4Value = investment15000Over10YearsType4._def
  .values as string[];
export const investment15000Over10Years4: InvestorProfileListItem[] =
  investment15000Over10Years4Value.map((value) => ({
    value,
  }));

const investment15000Over10Years5Value = investment15000Over10YearsType5._def
  .values as string[];
export const investment15000Over10Years5: InvestorProfileListItem[] =
  investment15000Over10Years5Value.map((value) => ({
    value,
  }));

const investment15000Over10Years6Values = investment15000Over10YearsType6._def
  .values as string[];
export const investment15000Over10Years6: InvestorProfileListItem[] =
  investment15000Over10Years6Values.map((value) => ({
    value,
  }));
