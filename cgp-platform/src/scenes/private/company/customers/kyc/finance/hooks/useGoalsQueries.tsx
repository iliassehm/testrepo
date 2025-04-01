import { useQuery } from "react-query";

import { gql } from "../../../../../../../service/client";
import { CustomersConformityLogic } from "../../../conformity/conformity.logic";

export function useGoalsQueries(companyId: string, customerId: string) {
  const { data, isLoading } = useQuery(
    ["customerConformityObjectives", companyId, customerId],
    () =>
      gql.client.request(
        CustomersConformityLogic.customerConformityObjectives(),
        {
          companyID: companyId as string,
          customerID: customerId as string,
        }
      )
  );

  return {
    goalsData: data,
    isGoalsQueryLoading: isLoading,
  };
}
