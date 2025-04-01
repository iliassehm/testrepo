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
import { SubCategory } from "../../../wealth/AssetCreation/RealEstateForm";
import { AssetDetailLogic } from "../../../wealth/AssetDetail/assetDetail.logic";
import { WealthLogic } from "../../../wealth/wealth.logic";
import { repartitionTypes } from "../../finance/types";

export function useMainResidenceQueries(customerId: string, companyId: string) {
  const [mainResidence, setMainResidence] = useState<CustomerAsset | null>(
    null
  );
  const [customerRealEstateAssets, setCustomerRealEstateAssets] = useState<
    CustomerAsset[]
  >([]);
  const [customerHomeLoansAssets, setCustomerHomeLoansAssets] = useState<
    CustomerAsset[]
  >([]);

  // Query for customer wealth data
  const {
    isLoading: isCustomerWealthQueryLoading,
    refetch: refetchCustomerWealth,
  } = useQuery(["customer_wealth", customerId, companyId], () =>
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
        // Join all real estate assets
        const allAssetsGroups = [
          ...(data?.nonfinancialWealth?.find(
            (category) => category.name === AssetGroup.HeritageRealEstate
          )?.data || []),
          ...(data?.nonfinancialWealth?.find(
            (category) => category.name === AssetGroup.ProfessionalRealEstate
          )?.data || []),
          ...(data?.nonfinancialWealth?.find(
            (category) => category.name === AssetGroup.CommercialRealEstate
          )?.data || []),
        ];
        /* Store Real Estates */
        const newCustomerRealEstateAssets: CustomerAsset[] = (
          await Promise.all(
            allAssetsGroups.map(async (item) => {
              try {
                const assetDetail = await gql.client.request(
                  AssetDetailLogic.queries(),
                  {
                    id: item.id,
                  }
                );
                return assetDetail.asset;
              } catch (error) {
                console.error(
                  `Error fetching asset detail for ${item.id}:`,
                  error
                );
                return null;
              }
            })
          )
        ).filter((asset): asset is CustomerAsset => asset !== undefined);
        setCustomerRealEstateAssets(newCustomerRealEstateAssets);
        /* Store Home Loans */
        const customerHomeLoansAssets: CustomerAsset[] = (
          await Promise.all(
            (
              data?.passiveWealth?.find(
                (category) => category.name === AssetGroup.HomeLoan
              )?.data || []
            ).map(async (item) => {
              try {
                const assetDetail = await gql.client.request(
                  AssetDetailLogic.queries(),
                  {
                    id: item.id,
                  }
                );
                return assetDetail.asset;
              } catch (error) {
                console.error(
                  `Error fetching asset detail for ${item.id}:`,
                  error
                );
                return null;
              }
            })
          )
        ).filter((asset): asset is CustomerAsset => asset !== undefined);
        setCustomerHomeLoansAssets(customerHomeLoansAssets);

        /* Find and store main residence */
        const mainResidenceAsset = data?.nonfinancialWealth
          ?.find((category) => category.name === AssetGroup.HeritageRealEstate)
          ?.data?.find(
            (item) => item.categoryName === SubCategory.PRIMARY_RESIDENCE
          );
        if (mainResidenceAsset?.id) {
          try {
            const assetDetail = await gql.client.request(
              AssetDetailLogic.queries(),
              {
                id: mainResidenceAsset.id,
              }
            );
            if (assetDetail.asset)
              setMainResidence({
                ...assetDetail.asset,
                valuation: mainResidenceAsset.valuation,
              } as CustomerAsset);
          } catch (error) {
            console.error(
              `Error fetching main residence detail for ${mainResidenceAsset.id}:`,
              error
            );
          }
        }

        return data;
      })
  );

  return {
    isCustomerWealthQueryLoading: isCustomerWealthQueryLoading,
    mainResidence,
    customerRealEstateAssets,
    customerHomeLoansAssets,
    setMainResidence,
    refetchCustomerWealth,
  };
}
