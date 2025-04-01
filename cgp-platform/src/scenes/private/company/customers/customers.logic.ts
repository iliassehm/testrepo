import { graphql } from "../../../../types";

export namespace CompanyCustomersLogic {
  export function queries() {
    return graphql(`
      query Customers($companyID: ID!, $input: CustomersInput) {
        company(id: $companyID) {
          id
          customerList(input: $input) {
            totalCount
            edges {
              node {
                id
                name
                lastName
                firstName
                email
                type
                plan
                phoneNumber
                hasB2CAccount
                informations {
                  details
                  general
                }
                wealth(companyID: $companyID)
                conformity(companyID: $companyID)
                manager(companyID: $companyID) {
                  name
                }
              }
            }
          }
        }
      }
    `);
  }

  export function customerDetails() {
    return graphql(`
      query CustomerDetails($companyID: ID!) {
        company(id: $companyID) {
          wealth
        }
        customerDetails(companyID: $companyID) {
          count
          managedWealth
          averageWealth
        }
      }
    `);
  }

  export function exportCustomers() {
    return graphql(`
      mutation exportCustomerList($companyID: ID!, $input: CustomersInput!) {
        url: exportCustomerList(companyID: $companyID, input: $input)
      }
    `);
  }

  export function customerDetailsUpdate() {
    return graphql(`
      mutation CustomerDetailsUpdate(
        $companyID: ID!
        $input: CustomerDetailsUpdateInput!
      ) {
        customerDetailsUpdate(companyID: $companyID, input: $input) {
          count
        }
      }
    `);
  }

  export function customerDeletion() {
    return graphql(`
      mutation CustomerDeletion($companyID: ID!, $customerID: ID!) {
        customerDeletion(companyID: $companyID, customerID: $customerID)
      }
    `);
  }

  export function customerManager() {
    return graphql(`
      query CustomerManager($id: ID!, $companyID: ID!) {
        customer(id: $id, companyID: $companyID) {
          manager(companyID: $companyID) {
            id
            name
            email
            phone
            providerCode
          }
        }
      }
    `);
  }
}
