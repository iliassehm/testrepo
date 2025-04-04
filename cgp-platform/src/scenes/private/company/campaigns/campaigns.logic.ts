import { graphql } from "../../../../types";

export namespace CampaignLogic {
  export function queries() {
    return graphql(`
      query Campaigns($companyID: ID!) {
        campaignList(companyID: $companyID) {
          id
          name
          assetGroup
          provider
          customersCount
          totalInvestment
          contractList {
            id
            investment
            status
            customer {
              id
              name
            }
          }
        }
      }
    `);
  }

  export function documentList() {
    return graphql(`
      query CampaignsDocumentList(
        $companyID: ID!
        $contractID: ID!
        $customerID: ID!
      ) {
        documentList(
          companyID: $companyID
          contractID: $contractID
          customerID: $customerID
        ) {
          id
          name
          expiration
          treatement
        }
      }
    `);
  }

  export function create() {
    return graphql(`
      mutation CampaignCreation($companyID: ID!, $input: CampaignCreation!) {
        campaignCreation(companyID: $companyID, input: $input) {
          id
          name
        }
      }
    `);
  }

  export function update() {
    return graphql(`
      mutation CampaignModification(
        $campaignID: ID!
        $companyID: ID!
        $update: CampaignModification
      ) {
        campaignModification(
          companyID: $companyID
          campaignID: $campaignID
          update: $update
        ) {
          id
          name
        }
      }
    `);
  }

  export function updateContract() {
    return graphql(`
      mutation CampaignContractModification(
        $contractID: ID!
        $companyID: ID!
        $update: CampaignContractModification
      ) {
        campaignContractModification(
          companyID: $companyID
          contractID: $contractID
          update: $update
        ) {
          id
        }
      }
    `);
  }
}
