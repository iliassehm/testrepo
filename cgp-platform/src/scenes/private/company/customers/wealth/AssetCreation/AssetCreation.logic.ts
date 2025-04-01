import { gql } from "../../../../../../service/client";
import {
  AssetGroup,
  CustomerAsset,
  graphql,
  InvestmentValues,
  WealthFilter,
} from "../../../../../../types";
import { GlobalWealthLogic } from "../../../globalWealth/globalWealth.logic";

export namespace AssetCreationLogic {
  // Queries
  export function SCPIList() {
    return graphql(`
      query SCPIList($name: String!) {
        SCPIList(name: $name) {
          name
          subscription_price
        }
      }
    `);
  }

  // Mutations
  export async function creation(data: {
    companyId: string;
    customerId: string;
    name: string;
    group: AssetGroup;
    values: unknown;
    investments?: InvestmentValues[];
    isUnderManagement: boolean;
  }): Promise<{ created: CustomerAsset }> {
    const operation = graphql(`
      mutation AssetCreation(
        $customerID: ID!
        $companyID: ID!
        $name: String!
        $group: AssetGroup!
        $values: CustomerAssetCreationValues!
        $investments: [InvestmentValues!]
      ) {
        created: assetCreation(
          customerID: $customerID
          companyID: $companyID
          name: $name
          group: $group
          values: $values
          investments: $investments
        ) {
          id
          name
        }
      }
    `);

    const asset = (await gql.client.request(operation, {
      customerID: data.customerId,
      companyID: data.companyId,
      name: data.name,
      group: data.group,
      values: data.values,
      investments: data.investments,
    })) as { created: CustomerAsset };

    if (!asset.created) {
      throw new Error("Asset creation failed");
    }

    if (data.isUnderManagement) {
      GlobalWealthLogic.managementSwitch({
        id: asset.created.id,
        companyID: data.companyId,
        customerID: data.customerId,
        domain: WealthFilter.UnderManagements,
      });
    }

    return asset;
  }

  export async function update(data: {
    companyId: string;
    customerId: string;
    assetId: string;
    name: string;
    group: AssetGroup;
    values: unknown;
    investments?: InvestmentValues[];
    isUnderManagement: boolean;
  }): Promise<{ updated: CustomerAsset }> {
    const operation = graphql(`
      mutation AssetUpdate(
        $customerID: ID!
        $companyID: ID!
        $assetID: ID!
        $name: String!
        $group: AssetGroup!
        $values: CustomerAssetCreationValues!
        $investments: [InvestmentValues!]
      ) {
        updated: assetUpdate(
          customerID: $customerID
          companyID: $companyID
          assetID: $assetID
          name: $name
          group: $group
          values: $values
          investments: $investments
        ) {
          id
          name
        }
      }
    `);

    const asset = (await gql.client.request(operation, {
      customerID: data.customerId,
      companyID: data.companyId,
      assetID: data.assetId,
      name: data.name,
      group: data.group,
      values: data.values,
      investments: data.investments,
    })) as { updated: CustomerAsset };

    if (!asset.updated) {
      throw new Error("Asset update failed");
    }

    return asset;
  }

  export async function assetUpdateDatesAndStatus(data: {
    customerID: string;
    companyID: string;
    assetID: string;
    openDate: Date;
    closeDate: Date;
    status: string;
  }): Promise<{ updated: CustomerAsset }> {
    const result = await graphql(`
      mutation AssetUpdateDatesAndStatus(
        $customerID: ID!
        $companyID: ID!
        $assetID: ID!
        $openDate: DateTime!
        $closeDate: DateTime
        $status: String!
      ) {
        updated: assetUpdateDatesAndStatus(
          customerID: $customerID
          companyID: $companyID
          assetID: $assetID
          openDate: $openDate
          closeDate: $closeDate
          status: $status
        ) {
          id
          name
        }
      }
    `);

    const asset = (await gql.client.request(result, {
      customerID: data.customerID,
      companyID: data.companyID,
      assetID: data.assetID,
      openDate: data.openDate,
      closeDate: data.closeDate,
      status: data.status,
    })) as { updated: CustomerAsset };

    if (!asset.updated) {
      throw new Error("Asset update failed");
    }

    return asset;
  }

  export async function updateGroup(data: {
    companyId: string;
    assets: string[];
    group: AssetGroup;
    categoryName?: string;
  }): Promise<{ updated: CustomerAsset[] }> {
    const operation = graphql(`
      mutation AssetUpdateGroup(
        $companyID: ID!
        $assets: [ID!]!
        $group: AssetGroup!
        $categoryName: String
      ) {
        updated: assetUpdateGroup(
          companyID: $companyID
          assets: $assets
          group: $group
          categoryName: $categoryName
        ) {
          id
          name
          group
          categoryName
        }
      }
    `);

    const assetsUpdated = (await gql.client.request(operation, {
      companyID: data.companyId,
      assets: data.assets,
      group: data.group,
      categoryName: data.categoryName,
    })) as { updated: CustomerAsset[] };

    if (!assetsUpdated.updated) {
      throw new Error("Assets group update failed");
    }

    return assetsUpdated;
  }
}
