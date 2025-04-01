import { graphql } from "../../../../types";

export namespace CompanyComplianceLogic {
  export function queries() {
    return graphql(`
      query CompanyCompliance($company: ID!) {
        customersCompliance(company: $company) {
          category {
            key
            name
          }
          levels {
            valid
            unvalid
            waiting
          }
        }
        globalCompliance(companyID: $company) {
          valid
          unvalid
          waiting
        }
      }
    `);
  }
}
