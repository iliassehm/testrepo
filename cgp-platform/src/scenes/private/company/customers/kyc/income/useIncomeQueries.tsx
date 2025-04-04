import { useQuery } from "react-query";

import { gql } from "../../../../../../service/client";
import { BudgetLogic } from "../../budget/budget.logic";
import { Income } from "./types";

export function useIncomeQueries(companyId: string, customerId: string) {
  const {
    data,
    isLoading: isBudgetQueryLoading,
    refetch: refetchIncomes,
  } = useQuery(
    ["budget", companyId, customerId],
    () =>
      gql.client.request(BudgetLogic.queries(), {
        companyID: companyId,
        customerID: customerId,
      }),
    {
      select: (data) => data?.budgetList as Income[],
    }
  );

  return {
    incomes: data || [],
    isBudgetQueryLoading,
    refetchIncomes,
  };
}
