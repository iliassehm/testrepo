import { useParams } from "@tanstack/react-router";
import i18next from "i18next";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { AggregationEntitiesForms } from "../../../../../../shared/schemas/customerInfo";
import { InvestorProfileFormInputs } from "../../../../../../shared/schemas/investorProfileFormSchema";
import { budgetsToCategories } from "../../../../../helpers/budget";
import { useCustomerWealth } from "../../../../../hooks/useCustomerWealth";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import {
  AssetGroup,
  Budget,
  CustomerWealthQuery,
  InvestorProfileQuery,
  Period,
  PublicCustomerWealthQuery,
} from "../../../../../types";
import {
  annualExpensesNames,
  annualIncomesNames,
} from "../budget/budgetPerson";
import { CustomersConformityLogic } from "./conformity.logic";
import { InvestorProfileView } from "./InvestorProfileView";

export type InvestmentFormDataType = {
  contactDontAnswer: boolean;
};

export const InvestorProfile = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  }) as Record<string, string>;

  // Query

  // Take rage from 7 days ago to now
  const range = useMemo(
    () => ({
      min: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      max: new Date(),
    }),
    []
  );

  // Queries
  const wealthQuery = useCustomerWealth({
    customerId: customerId,
    company: companyId,
    search: {
      period: Period.weekly,
      range: {
        min: range.min.getTime(),
        max: range.max.getTime(),
      },
    },
  });

  const queryKey = ["investorProfile", companyId, customerId];
  const { data, isLoading } = useQuery(
    queryKey,
    () =>
      gql.client.request(CustomersConformityLogic.investorProfileQueries(), {
        id: customerId,
        companyID: companyId,
        customerID: customerId,
      }),
    {
      select: (data) => {
        const investorProfileForm = (data?.investorProfileForm ??
          {}) as InvestorProfileFormInputs;
        const informations = (data?.customer?.informations ?? {}) as {
          general?: AggregationEntitiesForms["generalForm"];
          details?: AggregationEntitiesForms["detailsForm"];
        };
        const budgetListData = (data?.budgetList ?? []) as Budget[];

        const selectedData = selectInvestorProfileData({
          investorProfileForm,
          informations,
          budgetListData,
          wealthData: wealthQuery.data ?? {},
        });

        return selectedData;
      },
      enabled: !!wealthQuery,
    }
  );

  // Mutation
  const { mutate: mutateInvestorProfileUpdate } = useMutation(
    (input: InvestmentFormDataType) =>
      gql.client.request(CustomersConformityLogic.investorProfileMutation(), {
        companyID: companyId,
        customerID: customerId,
        input,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "investorProfile",
          companyId,
          customerId,
        ]);
        toast.current?.show({
          severity: "success",
          detail: i18next.t("forms.fields.notifications.success.save"),
        });
      },
    }
  );

  const investorProfileFormUpdate = useMutation(
    "investor_profile_form_update",
    (data: {
      input: InvestorProfileFormInputs;
      hideNotification?: boolean;
      scrollToTop?: boolean;
    }) => {
      return gql.client.request(
        CustomersConformityLogic.investorProfileFormUpdate(),
        {
          companyID: companyId,
          customerID: customerId,
          input: data.input,
        }
      );
    },
    {
      onSuccess: (data, params) => {
        queryClient.invalidateQueries(queryKey);

        // Stats query
        queryClient.invalidateQueries([
          "investorProfileStats_",
          companyId,
          customerId,
        ]);

        // notify
        if (!params.hideNotification) {
          toast.current?.show({
            severity: "success",
            detail: i18next.t("forms.fields.notifications.success.save"),
          });
        }

        // scroll to top
        if (params.scrollToTop)
          window.scrollTo({ top: 0, behavior: "instant" });
      },
    }
  );

  const handleSyncBudget = () => {
    investorProfileFormUpdate.mutate({
      input: {
        ...data?.investorProfileForm,
        financialSituation: {
          ...data?.investorProfileForm?.budgetListData,
          annualAssets: {
            ...data?.investorProfileForm?.annualAssetsListData,
          },
        },
      } as InvestorProfileFormInputs,
    });
  };

  return (
    <InvestorProfileView
      isLoading={isLoading}
      customerId={customerId}
      companyId={companyId}
      handleSyncBudget={handleSyncBudget}
      investorProfileForm={
        data?.investorProfileForm as unknown as InvestorProfileFormInputs
      }
      investorProfile={data?.customer?.investorProfile}
      mutateInvestorProfileUpdate={mutateInvestorProfileUpdate}
      onInvestorProfileFormUpdate={investorProfileFormUpdate.mutate}
    />
  );
};

export function selectInvestorProfileData({
  investorProfileForm,
  informations,
  budgetListData,
  customer,
  wealthData,
}: {
  investorProfileForm: InvestorProfileFormInputs;
  informations: {
    general?: AggregationEntitiesForms["generalForm"];
    details?: AggregationEntitiesForms["detailsForm"];
  };
  budgetListData: Budget[];
  customer?: InvestorProfileQuery["customer"];
  wealthData: CustomerWealthQuery | PublicCustomerWealthQuery;
}) {
  const personalSituation = (investorProfileForm?.personalSituation ??
    {}) as InvestorProfileFormInputs["personalSituation"];
  const details = informations?.details ?? {};
  const infoGender = informations.general?.gender;

  const incomesData = budgetListData.filter((item) =>
    annualIncomesNames.some((incomeCategory) =>
      incomeCategory.items.some((income) => income.value === item.name)
    )
  );
  const expensesData = budgetListData.filter((item) =>
    annualExpensesNames.some((expenseCategory) =>
      expenseCategory.items.some((expense) => expense.value === item.name)
    )
  );

  const structuredIncomes = budgetsToCategories(
    incomesData,
    annualIncomesNames
  );
  const structuredExpenses = budgetsToCategories(
    expensesData,
    annualExpensesNames
  );

  const structuredAssets = customerWealthAssetToCategories(
    wealthData,
    investorProfileForm.financialSituation?.annualAssets ?? {}
  );

  let civility = personalSituation.civility;

  if (!civility) {
    if (infoGender === "male") civility = "MR";
    else if (infoGender === "female") civility = "MRS";
  }

  let familySituation = personalSituation.familySituation;
  if (!familySituation) {
    if (informations.general?.familySituation) {
      switch (informations.general.familySituation) {
        case "single":
          familySituation = "SINGLE";
          break;
        case "freeUnion":
          familySituation = "FREE_UNION";
          break;
        case "married":
          familySituation = "MARRIED";
          break;
        case "widowed":
          familySituation = "WIDOWER";
          break;
        case "divorced":
          familySituation = "DIVORCED";
          break;
        case "civilUnion":
          familySituation = "CIVIL_PARTNERSHIP";
          break;
        case "separated":
          familySituation = "SEPARATED";
          break;
        case "deceased":
          familySituation = "DECEASED";
          break;
      }
    }
  }

  return {
    investorProfileForm: {
      ...investorProfileForm,
      personalSituation: {
        ...(investorProfileForm.personalSituation ?? {}),
        civility,
        mainZipCode: personalSituation.mainZipCode || details.zipCode,
        familySituation,
      },
      financialSituation: {
        ...(investorProfileForm.financialSituation ?? {}),
        annualIncome: {
          ...structuredIncomes,
          ...(investorProfileForm.financialSituation?.annualIncome ?? {}),
        },
        annualCharges: {
          ...structuredExpenses,
          ...(investorProfileForm.financialSituation?.annualCharges ?? {}),
        },
        annualAssets: {
          ...structuredAssets,
          ...(investorProfileForm.financialSituation?.annualAssets ?? {}),
        },
      },
      budgetListData: {
        annualIncome: {
          ...structuredIncomes,
        },
        annualCharges: {
          ...structuredExpenses,
        },
      },
      annualAssetsListData: customerWealthAssetToCategories(wealthData),
    },
    customer,
  };
}

function customerWealthAssetToCategories(
  data: CustomerWealthQuery,
  annualAssets?: InvestorProfileFormInputs["financialSituation"]["annualAssets"]
): InvestorProfileFormInputs["financialSituation"]["annualAssets"] {
  const savings = Math.round(
    data.financialWealth?.reduce((acc, curr) => {
      return acc + curr.amount.value;
    }, 0) ?? 0
  );

  const realEstateAndLand = Math.round(
    data.nonfinancialWealth
      ?.filter((item) => item.name === AssetGroup.HeritageRealEstate)
      .reduce((sum, item) => sum + item.amount.value, 0) ?? 0
  );

  const businessAssets = Math.round(
    data.nonfinancialWealth
      ?.filter(
        (item) =>
          item.name === AssetGroup.ProfessionalRealEstate ||
          item.name === AssetGroup.CommercialRealEstate ||
          item.name === AssetGroup.RockPaper
      )
      .reduce((sum, item) => sum + item.amount.value, 0) ?? 0
  );

  const combinedWealth = [
    ...(data.nonfinancialWealth ?? []),
    ...(data.benefitsWealth ?? []),
  ];

  const otherMovablePropertyAndClaims = Math.round(
    combinedWealth
      ?.filter(
        (item) =>
          item.name === AssetGroup.Exotic || item.name === AssetGroup.Benefits
      )
      .reduce((sum, item) => sum + item.amount.value, 0) ?? 0
  );

  return {
    savings: annualAssets?.savings ?? savings,
    realEstateAndLand: annualAssets?.savings ?? realEstateAndLand,
    businessAssets: annualAssets?.businessAssets ?? businessAssets,
    otherMovablePropertyAndClaims:
      annualAssets?.otherMovablePropertyAndClaims ??
      otherMovablePropertyAndClaims,
    annualAssetsTotal:
      annualAssets?.annualAssetsTotal ??
      (savings || 0) +
        (realEstateAndLand || 0) +
        (businessAssets || 0) +
        (otherMovablePropertyAndClaims || 0),
  };
}
