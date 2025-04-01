import { useQuery } from "react-query";

import { SupportLogic } from "../../../../../components/SupportSelection/support.logic";
import { gql } from "../../../../../service/client";
import {
  ContractIsSelectedArgs,
  QueryContractListingArgs,
  QueryInstrumentListingWithFavoritesArgs,
} from "../../../../../types";
import { ContractLogic } from "./contract.logic";

type UseContractListProps = QueryContractListingArgs & ContractIsSelectedArgs;

export function useContractList(props: UseContractListProps) {
  return useQuery({
    queryKey: [
      "contractList",
      props.companyID,
      props?.filters,
      props?.pagination,
    ],
    queryFn: () => {
      return gql.client.request(ContractLogic.contractList(), {
        filters: props.filters,
        pagination: props.pagination,
        companyID: props.companyID,
      });
    },
    staleTime: 1000 * 60,
    keepPreviousData: true,
  });
}
