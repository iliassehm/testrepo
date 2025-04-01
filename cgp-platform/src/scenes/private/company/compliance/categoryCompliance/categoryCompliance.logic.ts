import { graphql } from "../../../../../types";

export namespace DocumentCategoryLogic {
  export function documentQuery() {
    return graphql(`
      query DocumentCustomerList(
        $company: String!
        $documentCategory: String
        $input: DocumentCustomer
      ) {
        documentCustomerList(
          company: $company
          documentCategory: $documentCategory
          input: $input
        ) {
          category {
            key
            name
          }
          totalCount
          edges {
            node {
              id
              name
              expiration
              signature {
                signed
                validated
                digital
                customer
                manager
                signatories
              }
              customer {
                id
                name
              }
            }
          }
        }
      }
    `);
  }

  export function documentNotificationMutation() {
    return graphql(`
      mutation DocumentNotification(
        $documentID: ID!
        $requests: [NotificationRequest!]!
      ) {
        notifyDocumentStatus(documentID: $documentID, requests: $requests) {
          id
        }
      }
    `);
  }
}
