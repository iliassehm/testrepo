import { useTranslation } from "react-i18next";
import { useMutation, UseMutationOptions, useQueryClient } from "react-query";

import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import { DeleteFavoriteSearchMutation } from "../../../../../types";
import { CompanyCustomersSearchLogic } from "./search.logic";

type UseMutationProps = UseMutationOptions<
  DeleteFavoriteSearchMutation,
  unknown,
  string
>;

type UseDeleteSearchProps = Omit<UseMutationProps, "mutationFn">;

export function useDeleteSearch(props?: UseDeleteSearchProps) {
  const toast = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    ...props,
    onSuccess: (...data) => {
      toast.current?.show({
        summary: "Succès",
        detail: t("scenes.customersSearch.success.favoriteDelete"),
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
            : t("scenes.customersSearch.errors.favoriteDelete"),
        severity: "error",
      });
      props?.onError?.(...err);
    },
    mutationFn: async (id: string) => {
      return gql.client.request(
        CompanyCustomersSearchLogic.deleteFavoriteSearch(),
        {
          id,
        }
      );
    },
  });
}
