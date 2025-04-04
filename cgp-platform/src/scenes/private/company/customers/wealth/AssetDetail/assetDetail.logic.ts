import { graphql } from "../../../../../../types";

export namespace AssetDetailLogic {
  export function queries() {
    return graphql(`
      query AssetDetail($id: ID!) {
        asset: customerAsset(id: $id) {
          id
          name
          group
          activity
          underManagement
          categoryName
          accountNumber
          isManual
          metadata
          openDate
          owners {
            entity {
              id
            }
            ownership
          }
          # performance(start: $start, end: $end) {
          performance {
            gain
            evolution
          }
          investmentList {
            logo
            code
            name
            category
            managementCompany
            unitPrice
            unitValue
            created
            quantity
            valuation
            riskIndicator
            # performance(start: $start, end: $end) {
            performance {
              gain
              evolution
            }
          }
        }
      }
    `);
  }

  export function retrieveOtherOwner() {
    return graphql(`
      query RetrieveOtherOwner($assetId: ID!, $currentOwnerId: ID!) {
        otherOwner: retrieveOtherOwner(
          assetId: $assetId
          currentOwnerId: $currentOwnerId
        ) {
          id
          name
          firstName
          lastName
        }
      }
    `);
  }

  export function getUsersInCustomerReference() {
    return graphql(`
      query GetUsersInCustomerReference($companyId: ID!, $customerId: ID!) {
        users: getUsersInCustomerReference(
          companyId: $companyId
          customerId: $customerId
        ) {
          id
          name
          firstName
          lastName
          type
        }
      }
    `);
  }

  export function deletion() {
    return graphql(`
      mutation AssetDeletion($companyID: ID!, $assetID: ID!) {
        assetDeletion(companyID: $companyID, id: $assetID) {
          id
        }
      }
    `);
  }
}
