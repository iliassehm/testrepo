import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import { useCurrentRoute } from "../../../../../../../hooks/useCurrentRoute";
import { useToast } from "../../../../../../../hooks/useToast";
import { gql } from "../../../../../../../service/client";
import { AssetGroup, GlobalSearchParams } from "../../../../../../../types";
import { AssetCreationLogic } from "../../../wealth/AssetCreation/AssetCreation.logic";
import { AssetDetailLogic } from "../../../wealth/AssetDetail/assetDetail.logic";
import { RealEstateAssetData } from "../types";

export const useCustomerRealEstateMutations = (
  customerId: string,
  companyId: string,
  refetchCustomerWealth: () => void
) => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const route = useCurrentRoute();
  const search = route.search as GlobalSearchParams;

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries([
      "customer_wealth",
      customerId,
      companyId,
    ]);
    await queryClient.invalidateQueries([
      "layout_customer",
      companyId,
      customerId,
      search.period,
    ]);
  };

  const assetUpdateMutation = useMutation(
    (data: RealEstateAssetData & { assetId?: string; group: AssetGroup }) =>
      AssetCreationLogic.update({
        customerId,
        companyId,
        assetId: data.assetId ?? "",
        name: data.name ?? "",
        group: data.group,
        values: { ...data, assetId: undefined, group: undefined },
        investments: [],
        isUnderManagement: true,
      }),
    {
      onSuccess: async (data) => {
        toast?.current?.show({
          severity: "success",
          summary: t("scenes.wealth.update.success.summary"),
          detail: t("scenes.wealth.update.success.detail", {
            name: data?.updated?.name,
          }),
        });
        await invalidateQueries();
        refetchCustomerWealth();
      },
      onError: (error, variables) => {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t("scenes.wealth.update.error.summary"),
          detail: t("scenes.wealth.update.error.detail", {
            name: variables.name,
          }),
        });
      },
    }
  );

  const assetCreationMutation = useMutation(
    (data: RealEstateAssetData & { group: AssetGroup }) =>
      AssetCreationLogic.creation({
        customerId,
        companyId,
        name: data.name ?? "",
        group: data.group,
        values: {
          ...data,
          group: undefined,
        },
        isUnderManagement: true,
      }),
    {
      onSuccess: async (data) => {
        toast?.current?.show({
          severity: "success",
          summary: t("scenes.wealth.creation.success.summary"),
          detail: t("scenes.wealth.creation.success.detail", {
            name: data?.created?.name,
          }),
        });
        await invalidateQueries();
        refetchCustomerWealth();
      },
      onError: (error, variables) => {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t("scenes.wealth.creation.error.summary"),
          detail: t("scenes.wealth.creation.error.detail", {
            name: variables.name,
          }),
        });
      },
    }
  );

  const assetDelete = useMutation(
    "asset_delete",
    (assetID: string) =>
      gql.client.request(AssetDetailLogic.deletion(), {
        assetID,
        companyID: companyId,
      }),
    {
      onSuccess: async (result) => {
        queryClient.invalidateQueries(["underManagementAssetGroups"]);
        queryClient.invalidateQueries([result.assetDeletion?.id]);
        await invalidateQueries();
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
    assetUpdateMutation,
    assetCreationMutation,
    assetDelete,
  };
};
