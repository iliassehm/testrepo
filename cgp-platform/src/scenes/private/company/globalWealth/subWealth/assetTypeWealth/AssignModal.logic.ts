import { graphql } from "../../../../../../types";

export namespace AssignModalLogic {
  export function queries() {
    return graphql(`
      query CustomerSearch(
        $companyID: ID!
        $text: String
        $suggestionsTokens: [String!]
      ) {
        searchCustomer(
          companyID: $companyID
          text: $text
          suggestionsTokens: $suggestionsTokens
        ) {
          id
          name
          email
        }
      }
    `);
  }

  export function assetAffectation() {
    return graphql(`
      mutation AssetAffectation(
        $companyID: ID!
        $selectedCustomerID: ID!
        $assets: [ID!]!
      ) {
        assetsAffectation(
          companyID: $companyID
          customerID: $selectedCustomerID
          assets: $assets
        ) {
          id
        }
      }
    `);
  }
}
