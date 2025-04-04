import { useQuery } from "react-query";

import { AppLogic } from "../App/App.logic";
import { gql } from "../service/client";

export function useClaims({ companyID }: { companyID: string }) {
  return useQuery(
    ["claims", companyID],
    () =>
      gql.client.request(AppLogic.claimsQuery(), {
        companyID,
      }),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}
