import { graphql } from "../../../../../../types";

export namespace RegulationLogic {
  export function queries() {
    return graphql(`
      query conformityStatus($companyID: ID!, $customerID: ID!) {
        conformityStatus(companyID: $companyID, customerID: $customerID) {
          conformityId
          engagementLetter {
            date
            status
            info
            documentId
          }
          officialDocuments {
            date
            status
            info
          }
          informationCollections {
            date
            status
            info
          }
          investorProfile {
            date
            status
            info
            documentId
          }
          LCB {
            date
            status
            info
          }
          DER {
            date
            status
            info
            documentId
          }
          objectivesHeritage {
            date
            status
            info
            documentId
          }
        }
      }
    `);
  }

  export function addDocumentToConformity() {
    return graphql(`
      mutation addDocumentToConformity(
        $companyID: ID!
        $customerID: ID!
        $conformityID: ID
        $input: DocumentToConformityInput!
      ) {
        addDocumentToConformity(
          companyID: $companyID
          customerID: $customerID
          conformityID: $conformityID
          input: $input
        ) {
          conformityId
          engagementLetter {
            date
            status
            info
          }
          officialDocuments {
            date
            status
            info
          }
          informationCollections {
            date
            status
            info
          }
          investorProfile {
            date
            status
            info
          }
          LCB {
            date
            status
            info
          }
          DER {
            date
            status
            info
          }
        }
      }
    `);
  }
}
