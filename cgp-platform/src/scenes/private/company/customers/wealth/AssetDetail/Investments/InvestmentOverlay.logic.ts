import { graphql } from "../../../../../../../types";

export namespace InvestmentOverlayLogic {
  export function searchInstrument() {
    return graphql(`
      query SearchInstrument($name: String!, $group: AssetGroup!) {
        searchInstrument(name: $name, group: $group) {
          name
          code
          price
        }
      }
    `);
  }

  export function investmentCreation() {
    return graphql(`
      mutation CustomerInvestmentCreation(
        $companyID: ID!
        $customerID: ID!
        $assetID: ID!
        $input: CustomerInvestmentCreation!
      ) {
        customerInvestmentCreation(
          companyID: $companyID
          customerID: $customerID
          assetID: $assetID
          input: $input
        ) {
          name
        }
      }
    `);
  }
}
