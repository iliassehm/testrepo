import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import { useCurrentRoute } from "../../../../../../../hooks/useCurrentRoute";
import { useToast } from "../../../../../../../hooks/useToast";
import {
  AssetGroup,
  CustomerAsset,
  GlobalSearchParams,
} from "../../../../../../../types";
import { AssetCreationLogic } from "../../../wealth/AssetCreation/AssetCreation.logic";
import { RealEstateAssetData } from "../types";

export const useMainResidenceMutations = (
  customerId: string,
  companyId: string,
  refetchCustomerWealth: () => void,
  mainResidence?: CustomerAsset | null,
  onMainResidenceCreated?: (newResidence: CustomerAsset) => void
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
    await queryClient.invalidateQueries(["asset_detail", mainResidence?.id]);
    await queryClient.invalidateQueries([
      "real_estate_detail",
      mainResidence?.id,
    ]);
  };

  const assetUpdateMutation = useMutation(
    (data: RealEstateAssetData) =>
      AssetCreationLogic.update({
        customerId,
        companyId,
        assetId: mainResidence?.id as string,
        name: data.name ?? "",
        group: AssetGroup.HeritageRealEstate,
        values: { ...data },
        investments: [],
        isUnderManagement: mainResidence?.underManagement ?? false,
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
    (data: RealEstateAssetData) =>
      AssetCreationLogic.creation({
        customerId,
        companyId,
        name: data.name ?? "",
        group: AssetGroup.HeritageRealEstate,
        values: {
          ...data,
          categoryName: "primary",
        },
        isUnderManagement: false,
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

        if (data?.created) {
          onMainResidenceCreated?.({ ...data.created });
        }

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

  return {
    assetUpdateMutation,
    assetCreationMutation,
  };
};
