import { useQuery } from "react-query";

import { CompanyFeatures } from "../../shared/schemas/company.features";
import { AppLogic } from "../App/App.logic";
import { gql } from "../service/client";

export function useDisabledFeatures() {
  return useQuery(
    "authenticated",
    () => gql.client.request(AppLogic.authenticatedQuery()),
    {
      retry: false,
      refetchOnWindowFocus: false,
      select: (data) => {
        const safeParse = CompanyFeatures.safeParse(
          data?.authenticated?.manager?.disabledFeatures
        );
        return safeParse.success ? safeParse.data : [];
      },
    }
  );
}
