import { useTranslation } from "react-i18next";
import { useMutation, UseMutationOptions, useQueryClient } from "react-query";

import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import { SaveFavoriteSearchMutation } from "../../../../../types";
import { CompanyCustomersSearchLogic } from "./search.logic";

type UseMutationProps = UseMutationOptions<
  SaveFavoriteSearchMutation,
  unknown,
  unknown
>;

type UseSaveSearchProps = Omit<UseMutationProps, "mutationFn">;

export function useSaveSearch(props?: UseSaveSearchProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    ...props,
    onSuccess: (...data) => {
      toast.current?.show({
        summary: "Succès",
        detail: t("scenes.customersSearch.success.favoriteSave"),
        severity: "success",
      });
      queryClient.invalidateQueries(["favoritesSearches"]);
      props?.onSuccess?.(...data);
    },
    onError: (...err) => {
      toast.current?.show({
        summary: "Error",
        detail:
          err[0] instanceof Error
            ? err[0].message
            : t("scenes.customersSearch.errors.favoriteSave"),
        severity: "error",
      });
      props?.onError?.(...err);
    },
    mutationFn: async (schema: unknown) => {
      return gql.client.request(
        CompanyCustomersSearchLogic.saveFavoriteSearch(),
        {
          schema,
        }
      );
    },
  });
}
