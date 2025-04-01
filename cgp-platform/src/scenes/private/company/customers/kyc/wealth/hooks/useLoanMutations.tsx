import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import { useToast } from "../../../../../../../hooks/useToast";
import { gql } from "../../../../../../../service/client";
import { AssetGroup } from "../../../../../../../types";
import { AssetCreationLogic } from "../../../wealth/AssetCreation/AssetCreation.logic";
import { AssetDetailLogic } from "../../../wealth/AssetDetail/assetDetail.logic";

export function useLoanMutations(
  companyId: string,
  customerId: string,
  refetchCustomerWealth: () => void
) {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  const loanCreation = useMutation(
    "asset_creation",
    (data: { name?: string; type: AssetGroup; values: unknown }) => {
      const values = data.values;
      return AssetCreationLogic.creation({
        customerId: customerId as string,
        companyId: companyId as string,
        name: (values as { name?: string }).name ?? "",
        group: data.type,
        values: values,
        isUnderManagement: true,
      });
    },
    {
      onSuccess: async (data) => {
        toast?.current?.show({
          severity: "success",
          summary: t("scenes.wealth.creation.success.summary") as string,
          detail: t("scenes.wealth.creation.success.detail", {
            name: data?.created?.name,
          }),
        });
        await queryClient.invalidateQueries([
          "customer_wealth",
          customerId,
          companyId,
        ]);
        await queryClient.invalidateQueries([
          "layout_customer",
          companyId,
          customerId,
        ]);
        refetchCustomerWealth();
      },
      async onError(error, variables) {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t("scenes.wealth.creation.error.summary") as string,
          detail: t("scenes.wealth.creation.error.detail", {
            name: variables.name,
          }),
        });
      },
    }
  );

  const loanUpdate = useMutation(
    "asset_update",
    (data: {
      assetId: string;
      name?: string;
      type: AssetGroup;
      values: unknown;
    }) => {
      const values = data.values;
      return AssetCreationLogic.update({
        customerId: customerId as string,
        companyId: companyId as string,
        assetId: data.assetId,
        name: (values as { name?: string }).name ?? "",
        group: data.type,
        values: values,
        isUnderManagement: true,
      });
    },
    {
      onSuccess: async (data) => {
        toast?.current?.show({
          severity: "success",
          summary: t("scenes.wealth.update.success.summary") as string,
          detail: t("scenes.wealth.update.success.detail", {
            name: data?.updated?.name,
          }),
        });
        await queryClient.invalidateQueries([
          "customer_wealth",
          customerId,
          companyId,
        ]);
        await queryClient.invalidateQueries([
          "layout_customer",
          companyId,
          customerId,
        ]);
        refetchCustomerWealth();
      },
      async onError(error, variables) {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t("scenes.wealth.update.error.summary") as string,
          detail: t("scenes.wealth.update.error.detail", {
            name: variables.name,
          }),
        });
      },
    }
  );

  const loanDelete = useMutation(
    "asset_delete",
    (assetID: string) =>
      gql.client.request(AssetDetailLogic.deletion(), {
        assetID,
        companyID: companyId,
      }),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries([res.assetDeletion?.id]);
        queryClient.invalidateQueries(["customer_wealth"]);
        toast?.current?.show({
          severity: "success",
          summary: t("forms.fields.notifications.success.delete") as string,
        });
        refetchCustomerWealth();
      },
      onError: () => {
        toast?.current?.show({
          severity: "error",
          summary: t("forms.fields.notifications.error.delete") as string,
        });
      },
    }
  );

  return {
    loanCreation,
    loanDelete,
    loanUpdate,
    mutationsLoading:
      loanCreation.isLoading || loanDelete.isLoading || loanUpdate.isLoading,
  };
}
