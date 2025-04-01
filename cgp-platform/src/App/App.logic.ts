import { graphql } from "../types";

export namespace AppLogic {
  export function authenticatedQuery() {
    return graphql(`
      query Authenticated {
        authenticated {
          id
          manager {
            id
            name
            email
            phone
            disabledFeatures
            companyList {
              id
              name
              logo
              parentCompanyId
              isParentCompany
            }
            parentCompany {
              id
              name
              logo
            }
          }
        }
      }
    `);
  }

  export function claimsQuery() {
    return graphql(`
      query ManagerClaims($companyID: ID!) {
        authenticated {
          manager {
            claims(companyID: $companyID)
          }
        }
      }
    `);
  }
}
