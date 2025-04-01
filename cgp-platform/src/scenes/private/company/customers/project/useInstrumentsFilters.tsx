import { useQuery } from "react-query";

import { gql } from "../../../../../service/client";
import { InstrumentsLogic } from "./instruments.logic";

export function useInstrumentsFilters() {
  return useQuery({
    queryKey: ["instrumentsFilters"],
    queryFn: () => {
      return gql.client.request(InstrumentsLogic.instrumentFiltersQuery());
    },
  });
}
