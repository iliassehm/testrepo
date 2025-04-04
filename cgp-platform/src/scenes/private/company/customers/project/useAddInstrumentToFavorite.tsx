import { useMutation } from "react-query";

import { gql } from "../../../../../service/client";
import { InstrumentsLogic } from "./instruments.logic";

type UseInstrumentToFavoriteProps = {
  code: string;
  isFavorite: boolean;
  companyID: string;
};

export const useInstrumentToFavorite = () => {
  const { mutateAsync, isLoading, error } = useMutation({
    mutationKey: ["instrumentToFavorite"],
    mutationFn: ({
      code,
      isFavorite,
      companyID,
    }: UseInstrumentToFavoriteProps) =>
      gql.client.request(InstrumentsLogic.setInstrumentFavorite(), {
        code,
        isFavorite,
        companyID,
      }),
  });

  return { mutateAsync, isLoading, error };
};
