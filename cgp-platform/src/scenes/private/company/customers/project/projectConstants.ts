/**
 * This file contains temporary constants that are used in the project. These constants will be replaced with data from the backend in the future.
 */
import { t } from "i18next";

import { ProjectType } from "../../../../../types";

// type ProductCategory = "cei" | "lifeInsurance" | "all";
export enum ProductCategory {
  CIF = "cif",
  LifeInsurance = "lifeInsurance",
  All = "all",
}

export enum AssetType {
  Financial = "financial",
  RealEstate = "realEstate",
}

export const projectTypes = [
  {
    name: "scenes.customers.projects.types.subscription",
    id: "subscription",
  },
  {
    name: "scenes.customers.projects.types.arbitrage",
    id: "arbitrage",
  },
  {
    name: "scenes.customers.projects.types.redemption",
    id: ProjectType.Redemption,
  },
  {
    name: "scenes.customers.projects.types.complementary",
    id: "complementary",
  },
];

export const projectProducts: {
  category: ProductCategory;
  id: string;
}[] = [
  {
    category: ProductCategory.All,
    id: "all",
  },
  {
    category: ProductCategory.LifeInsurance,
    id: "article83Contract",
  },
  {
    category: ProductCategory.LifeInsurance,
    id: "lifeInsuranceContract",
  },
  {
    category: ProductCategory.LifeInsurance,
    id: "capitalizationContract",
  },
  {
    category: ProductCategory.LifeInsurance,
    id: "madelinContract",
  },
  {
    category: ProductCategory.LifeInsurance,
    id: "pepLifeInsurance",
  },
  {
    category: ProductCategory.LifeInsurance,
    id: "per",
  },
  // {
  //   category: ProductCategory.LifeInsurance,
  //   id: "perp",
  // },
  {
    category: ProductCategory.LifeInsurance,
    id: "perco",
  },
  {
    category: ProductCategory.LifeInsurance,
    id: "pee",
  },
  // {
  //   category: ProductCategory.LifeInsurance,
  //   id: "article82Contract",
  // },
  {
    category: ProductCategory.CIF,
    id: "otherDepositsCash",
  },
  {
    category: ProductCategory.LifeInsurance,
    id: "otherLifeInsurance",
  },
  {
    category: ProductCategory.CIF,
    id: "otherSecurities",
  },
  {
    category: ProductCategory.CIF,
    id: "housingSavingsAccount",
  },
  {
    category: ProductCategory.CIF,
    id: "termAccount",
  },
  {
    category: ProductCategory.CIF,
    id: "partnersCurrentAccount",
  },
  {
    category: ProductCategory.CIF,
    id: "cashAccount",
  },
  {
    category: ProductCategory.CIF,
    id: "savingsAccount",
  },
  {
    category: ProductCategory.CIF,
    id: "ordinarySecuritiesAccount",
  },
  {
    category: ProductCategory.CIF,
    id: "businessCrowdfunding",
  },
  {
    category: ProductCategory.CIF,
    id: "realEstateCrowdfunding",
  },
  {
    category: ProductCategory.CIF,
    id: "industrialGirardin",
  },
  {
    category: ProductCategory.CIF,
    id: "sustainableDevelopmentAccount",
  },
  {
    category: ProductCategory.CIF,
    id: "popularSavingsAccount",
  },
  {
    category: ProductCategory.CIF,
    id: "livretA",
  },
  {
    category: ProductCategory.CIF,
    id: "youthSavingsAccount",
  },
  {
    category: ProductCategory.CIF,
    id: "scpi",
  },
  {
    category: ProductCategory.CIF,
    id: "SOFICAShare",
  },
  {
    category: ProductCategory.CIF,
    id: "FCPIShare",
  },
  {
    category: ProductCategory.CIF,
    id: "FCPRShare",
  },
  {
    category: ProductCategory.CIF,
    id: "FIPShare",
  },
  {
    category: ProductCategory.CIF,
    id: "IFIHoldingShare",
  },
  {
    category: ProductCategory.CIF,
    id: "equitySavingsPlan",
  },
  {
    category: ProductCategory.CIF,
    id: "equitySavingsPlanPME",
  },
  {
    category: ProductCategory.CIF,
    id: "housingSavingsPlan",
  },
  {
    category: ProductCategory.CIF,
    id: "popularSavingsPlan",
  },
  {
    category: ProductCategory.CIF,
    id: "terroir_placement",
  },
];
export const projectProductsSelectList = projectProducts
  .filter((v) => v.id !== "all")
  .map((value) => ({
    value: value.id,
    label: t(`scenes.customers.projects.products.${value.id}`),
    optgroup: t(`scenes.customers.projects.productCategory.${value.category}`),
  }));

export const projectTypesSelectList = [
  {
    value: "arbitrage",
    label: t("scenes.customers.projects.types.arbitrage"),
  },
  {
    value: "redemption",
    label: t("scenes.customers.projects.types.redemption"),
  },
  {
    value: "complementary",
    label: t("scenes.customers.projects.types.complementary"),
  },
  ...projectProductsSelectList,
];

export const projectObjectives = [
  {
    id: "retirement",
  },
  {
    id: "taxOptimization",
  },
  {
    id: "emergencyFund",
  },
  {
    id: "longTermCapital",
  },
  {
    id: "wealthCreation",
  },
  {
    id: "immediateIncome",
  },
  {
    id: "professionalManagement",
  },
  {
    id: "ifiReduction",
  },
  {
    id: "realEstatePurchase",
  },
  {
    id: "supportChildren",
  },
  {
    id: "geographicMobility",
  },
  {
    id: "lifeAccidentsProtection",
  },
  {
    id: "survivingSpouseProtection",
  },
  {
    id: "familyProtection",
  },
  {
    id: "wealthTransmission",
  },
  {
    id: "businessTransmission",
  },
  {
    id: "additionalIncome",
  },
  {
    id: "investmentProfitability",
  },
];

export const fundsOrigins = [
  "inheritance",
  "donation",
  "acquisitionThroughWork",
  "financialInvestments",
  "personalBusiness",
  "lotteryOrGamingWinnings",
  "personalSavings",
  "matrimonialProperty",
  "saleOfProperty",
  "gifts",
  "annuitiesOrPensions",
  "copyrightsOrPatents",
  "rentalIncome",
  "stockMarketCapitalization",
  "subsidiesOrGrants",
  "otherUnspecifiedSources",
] as const;
