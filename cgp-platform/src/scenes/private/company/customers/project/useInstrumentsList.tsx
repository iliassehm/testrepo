import { useQuery } from "react-query";

import { SupportLogic } from "../../../../../components/SupportSelection/support.logic";
import { gql } from "../../../../../service/client";
import {
  ContractIsSelectedArgs,
  QueryContractListingArgs,
  QueryInstrumentListingWithFavoritesArgs,
} from "../../../../../types";
import { InstrumentsLogic } from "./instruments.logic";

type UseInstrumentsListProps = QueryInstrumentListingWithFavoritesArgs &
  ContractIsSelectedArgs;
export function useInstrumentsList(props: UseInstrumentsListProps) {
  return useQuery({
    queryKey: [
      "instrumentsList",
      props?.filters,
      props?.pagination,
      props.companyID,
    ],
    queryFn: () => {
      return gql.client.request(InstrumentsLogic.instrumentsList(), {
        filters: props.filters,
        pagination: props.pagination,
        companyID: props.companyID,
      });
    },
    staleTime: 1000 * 60,
    keepPreviousData: true,
  });
}

export function useFavoriteInstrumentsList(props: UseInstrumentsListProps) {
  return useQuery({
    queryKey: [
      "favoriteInstrumentsList",
      props?.filters,
      props?.pagination,
      props.companyID,
    ],
    queryFn: () => {
      return gql.client.request(InstrumentsLogic.favoriteInstrumentsList(), {
        filters: props.filters,
        pagination: props.pagination,
        companyID: props.companyID,
      });
    },
    staleTime: 1000 * 60,
    keepPreviousData: true,
  });
}
