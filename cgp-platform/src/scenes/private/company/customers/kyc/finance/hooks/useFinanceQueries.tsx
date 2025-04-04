import { useState } from "react";
import { useQuery } from "react-query";

import {
  benefitsAssetGroups,
  financialAssetGroups,
  nonFinancialAssetGroups,
  othersAssetGroups,
  passiveAssetGroups,
} from "../../../../../../../constants/assets";
import { gql } from "../../../../../../../service/client";
import { AssetGroup, CustomerAsset } from "../../../../../../../types";
import { AssetDetailLogic } from "../../../wealth/AssetDetail/assetDetail.logic";
import { WealthLogic } from "../../../wealth/wealth.logic";
import {
  assetGroupsNeedDetails,
  DataAssetGroup,
  repartitionTypes,
} from "../types";

async function fetchAssetDetails(group: any) {
  const detailedAssets: CustomerAsset[] = (
    await Promise.all(
      (group.data || []).map(async (item: CustomerAsset) => {
        try {
          const assetDetail = await gql.client.request(
            AssetDetailLogic.queries(),
            {
              id: item.id,
            }
          );
          return assetDetail.asset;
        } catch (error) {
          console.error(`Error fetching asset detail for ${item.id}:`, error);
          return null;
        }
      })
    )
  ).filter((asset): asset is CustomerAsset => asset !== undefined);

  return detailedAssets;
}

export function useFinanceQueries(companyId: string, customerId: string) {
  const [dataAssetGroups, setDataAssetGroups] = useState<DataAssetGroup[]>([]);
  const [isAssetDetailQueriesLoading, setIsAssetDetailQueriesLoading] =
    useState<boolean>(false);

  const { isLoading: isAssetGroupsQueryLoading, refetch: refetchAssetGroups } =
    useQuery(["Asset Groups", companyId, customerId], () =>
      gql.client
        .request(WealthLogic.queries(), {
          id: customerId,
          company: companyId,
          financialTypes: financialAssetGroups,
          nonFinancialTypes: nonFinancialAssetGroups,
          passiveTypes: passiveAssetGroups,
          benefitsTypes: benefitsAssetGroups,
          othersTypes: othersAssetGroups,
          repartitionTypes: repartitionTypes,
        })
        .then(async (data) => {
          /* Loading for asset details (only on the first fetch) */
          if (dataAssetGroups.length === 0)
            setIsAssetDetailQueriesLoading(true);
          const newDataAssetGroups: DataAssetGroup[] = [];
          const wealthCategories = [
            data.financialWealth,
            data.nonfinancialWealth,
            data.othersWealth,
            data.passiveWealth,
            data.benefitsWealth,
          ];

          await Promise.all(
            wealthCategories.map(async (category) => {
              if (category) {
                await Promise.all(
                  category.map(async (group) => {
                    if (assetGroupsNeedDetails.includes(group.name)) {
                      const detailedAssets = await fetchAssetDetails(group);
                      newDataAssetGroups.push({
                        group: group.name,
                        amount: group.amount,
                        assets: detailedAssets,
                      });
                    } else {
                      newDataAssetGroups.push({
                        group: group.name,
                        amount: group.amount,
                        assets: (group.data as CustomerAsset[]) ?? [],
                      });
                    }
                  })
                );
              }
            })
          ).finally(() => {
            setDataAssetGroups(newDataAssetGroups);
            setIsAssetDetailQueriesLoading(false);
          });
        })
    );

  return {
    dataAssetGroups,
    isAssetGroupsQueryLoading:
      isAssetGroupsQueryLoading || isAssetDetailQueriesLoading,
    refetchAssetGroups,
  };
}
