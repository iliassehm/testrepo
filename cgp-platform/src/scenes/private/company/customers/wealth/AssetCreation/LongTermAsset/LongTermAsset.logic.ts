import { graphql } from "../../../../../../../types";

export namespace LongTermAssetLogic {
  export function mutation() {
    return graphql(`
      mutation CustomerAssetInvestmentUpdate(
        $customerID: ID!
        $companyID: ID!
        $assetID: ID!
        $update: [InvestmentValues!]!
      ) {
        customerAssetInvestmentUpdate(
          customerID: $customerID
          companyID: $companyID
          assetID: $assetID
          update: $update
        ) {
          id
        }
      }
    `);
  }
}
