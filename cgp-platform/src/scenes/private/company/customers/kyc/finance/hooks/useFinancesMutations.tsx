import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import { useToast } from "../../../../../../../hooks/useToast";
import { gql } from "../../../../../../../service/client";
import {
  AssetGroup,
  InvestmentValues,
  WealthFilter,
} from "../../../../../../../types";
import { GlobalWealthLogic } from "../../../../globalWealth/globalWealth.logic";
import { AssetCreationLogic } from "../../../wealth/AssetCreation/AssetCreation.logic";
import { AssetDetailLogic } from "../../../wealth/AssetDetail/assetDetail.logic";

export function useFinancesMutations(
  companyId: string,
  customerId: string,
  refetchAssetGroups: () => void
) {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  const assetCreation = useMutation(
    "asset_creation",
    (data: {
      name?: string;
      type: AssetGroup;
      values: unknown;
      investments?: InvestmentValues[];
      isUnderManagement: boolean;
    }) => {
      const values = data.values;
      return AssetCreationLogic.creation({
        customerId: customerId as string,
        companyId: companyId as string,
        name: (values as { name?: string }).name ?? "",
        group: data.type,
        values: values,
        investments: data.investments,
        isUnderManagement: data.isUnderManagement,
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
        refetchAssetGroups();
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

  const assetUpdate = useMutation(
    "asset_update",
    (data: {
      assetId: string;
      name?: string;
      type: AssetGroup;
      values: unknown;
      investments?: InvestmentValues[];
      isUnderManagement: boolean;
    }) => {
      const values = data.values;
      return AssetCreationLogic.update({
        customerId: customerId as string,
        companyId: companyId as string,
        assetId: data.assetId,
        name: (values as { name?: string }).name ?? "",
        group: data.type,
        values: values,
        investments: data.investments,
        isUnderManagement: data.isUnderManagement,
      });
    },
    {
      onSuccess: async (data, params) => {
        assetManagementSwitch.mutate({
          assetId: data?.updated?.id,
          assetIsUnderManagement: params.isUnderManagement,
          assetName: data?.updated?.name,
        });
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

  const assetManagementSwitch = useMutation(
    "switch_asset_management",
    (data: {
      assetId: string;
      assetIsUnderManagement: boolean;
      assetName: string;
    }) => {
      return GlobalWealthLogic.managementSwitch({
        id: data.assetId,
        customerID: customerId,
        companyID: companyId,
        domain: data.assetIsUnderManagement
          ? WealthFilter.UnderManagements
          : WealthFilter.Customers,
      });
    },
    {
      onSuccess: async (data) => {
        toast?.current?.show({
          severity: "success",
          summary: t("scenes.wealth.update.success.summary") as string,
          detail: t("scenes.wealth.update.success.detail", {
            name: data?.asset?.name,
          }),
        });
        refetchAssetGroups();
      },
      async onError(error, variables) {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t("scenes.wealth.update.error.summary") as string,
          detail: t("scenes.wealth.update.error.detail", {
            name: variables.assetName,
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
      onSuccess: (res) => {
        queryClient.invalidateQueries([res.assetDeletion?.id]);
        queryClient.invalidateQueries(["customer_wealth"]);
        toast?.current?.show({
          severity: "success",
          summary: t("forms.fields.notifications.success.delete") as string,
        });
        refetchAssetGroups();
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
    assetCreation,
    assetDelete,
    assetUpdate,
    isFinancesMutationsLoading:
      assetCreation.isLoading || assetDelete.isLoading || assetUpdate.isLoading,
  };
}
