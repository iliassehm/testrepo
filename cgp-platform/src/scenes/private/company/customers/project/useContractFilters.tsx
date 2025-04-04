import { useQuery } from "react-query";

import { gql } from "../../../../../service/client";
import { ContractLogic } from "./contract.logic";

export function useContractFilters() {
  return useQuery({
    queryKey: ["contractFilters"],
    queryFn: () => {
      return gql.client.request(ContractLogic.contractFilters());
    },
  });
}
