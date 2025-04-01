import { graphql } from "../../../../types";

export namespace CompanySettingsLogic {
  export function queries() {
    return graphql(`
      query CompanySettings($companyID: ID!) {
        company(id: $companyID) {
          managerList {
            id
            name
            email
            phone
          }
          logo
        }
        authenticated {
          id
          manager {
            id
            name
            email
            companyList {
              id
              name
              logo
            }
          }
        }
        companyManagersStats(companyID: $companyID) {
          id
          name
          email
          claims
          nbClients
          nbContracts
          lastActive
        }
      }
    `);
  }

  export function deleteCompany() {
    return graphql(`
      mutation CompanyDeletion($companyID: ID!) {
        companyDeletion(companyID: $companyID)
      }
    `);
  }
}
