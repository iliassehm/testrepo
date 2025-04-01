import { useQuery } from "react-query";

import { gql } from "../../../../../../service/client";
import { BudgetLogic } from "../../budget/budget.logic";
import { Charge } from "./types";

export function useChargeQueries(companyId: string, customerId: string) {
  const {
    data,
    isLoading: isBudgetQueryLoading,
    refetch: refetchCharges,
  } = useQuery(
    ["budget", companyId, customerId],
    () =>
      gql.client.request(BudgetLogic.queries(), {
        companyID: companyId,
        customerID: customerId,
      }),
    {
      select: (data) => data?.budgetList as Charge[],
    }
  );

  return {
    charges: data || [],
    isBudgetQueryLoading,
    refetchCharges,
  };
}
