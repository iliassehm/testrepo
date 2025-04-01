import { graphql } from "../../../../../types";

export namespace CompanyCustomersFiscalityLogic {
  export function queries() {
    return graphql(`
      query CustomerFiscality($customerID: ID!, $companyID: ID!, $year: Int!) {
        customer(id: $customerID, companyID: $companyID) {
          fiscality(year: $year)
        }
      }
    `);
  }

  export function updateFiscality() {
    return graphql(`
      mutation UpdateFiscality(
        $companyID: ID!
        $customerID: ID!
        $input: FiscalityInformations!
        $year: Int!
      ) {
        customerFiscality(
          companyID: $companyID
          id: $customerID
          input: $input
          year: $year
        )
      }
    `);
  }
}
