import { gql } from "../../../../../../service/client";
import {
  Company,
  Customer,
  CustomerAsset,
  graphql,
} from "../../../../../../types";

export namespace OwnershipEditionLogic {
  export async function relatedEntities(
    companyId: Company["id"],
    assetId: CustomerAsset["id"],
    customerId: Customer["id"]
  ) {
    const operation = graphql(`
      query RelatedEntities($companyID: ID!, $assetID: ID!, $customerID: ID!) {
        referenceEntities: getUsersInCustomerReference(
          companyId: $companyID
          customerId: $customerID
        ) {
          id
          name
        }
        asset: customerAsset(id: $assetID) {
          owners {
            entity {
              id
              name
            }
            ownership
            mode
          }
        }
      }
    `);

    const result = await gql.client.request(operation, {
      companyID: companyId,
      assetID: assetId,
      customerID: customerId,
    });

    const list = (result.asset?.owners ?? [])
      .filter((owner) => owner?.entity != undefined)
      .map((owner) => ({
        id: owner.entity?.id,
        name: owner.entity?.name,
        ownership: owner.ownership ?? 0,
        mode: owner.mode,
      })) as {
      id: Customer["id"];
      name: Customer["name"];
      ownership: number;
      mode: string | null | undefined;
    }[];

    const possibleRelatedEntities = (result.referenceEntities ?? [])
      .filter((entity) => !list.some((owner) => owner.id === entity.id))
      .map((entity) => ({
        id: entity.id,
        name: entity.name,
        ownership: 0,
        mode: null,
      }));

    list.push(...possibleRelatedEntities);

    return list;
  }

  export async function updateAssetOwnership(
    companyId: Company["id"],
    assetId: CustomerAsset["id"],
    values: {
      id: Customer["id"];
      ownership: number;
      mode?: string | null;
    }[]
  ) {
    const operation = graphql(`
      mutation updateAssetOwnership(
        $companyID: ID!
        $assetID: ID!
        $values: [AssetOwnerInput!]!
      ) {
        updated: assetsUpdateOwners(
          companyID: $companyID
          assetID: $assetID
          values: $values
        ) {
          id
          owners {
            entity {
              id
            }
            ownership
            mode
          }
        }
      }
    `);

    const result = await gql.client.request(operation, {
      companyID: companyId,
      assetID: assetId,
      values: values,
    });

    return result;
  }
}
