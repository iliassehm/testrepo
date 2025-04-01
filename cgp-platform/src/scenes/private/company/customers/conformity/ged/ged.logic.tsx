import { HttpResponse, graphql as mswGraphl } from "msw";

import {
  type CategoryDocumentsListQuery,
  type DocumentCategoryCreationMutation,
  type DocumentCategoryListOnlyQuery,
  type DocumentInfoQuery,
  DocumentSignatureState,
  type DocumentUrlQuery,
  graphql,
  Treatement,
} from "../../../../../../types";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GedLogic {
  // Envelope
  export function envelopeList() {
    return graphql(`
      query EnvelopeList($companyID: ID!, $customerID: ID!) {
        envelopeList(companyID: $companyID, customerID: $customerID) {
          name
          id
          created
          treatement: conformity
          documents: documentList {
            id
            created
            name
            url
            expiration
            extension
            category {
              key
              name
            }
            notes
            treatement
            signature {
              digital
              signatories
            }
          }
        }
      }
    `);
  }

  export function envelopeDeletion() {
    return graphql(`
      mutation EnvelopeDeletion(
        $companyID: ID!
        $customerID: ID!
        $envelopeID: ID!
      ) {
        envelopeDeletion(
          companyID: $companyID
          customerID: $customerID
          envelopeID: $envelopeID
        ) {
          id
        }
      }
    `);
  }

  export function envelopeUpdate() {
    return graphql(`
      mutation EnvelopeUpdate(
        $companyID: ID!
        $customerID: ID!
        $input: EnvelopeAccess!
      ) {
        envelopeUpdate(
          companyID: $companyID
          customerID: $customerID
          input: $input
        ) {
          id
        }
      }
    `);
  }

  // Envelope CategoryListOnly
  export function envelopeCategoryListOnly() {
    return graphql(`
      query EnvelopeListOnly($companyID: ID!, $customerID: ID!) {
        envelopeList(companyID: $companyID, customerID: $customerID) {
          name
          id
          created
          treatement: conformity
        }
      }
    `);
  }

  // Envelope CategoryDocumentsList
  export function envelopeCategoryDocumentsList() {
    return graphql(`
      query EnvelopeCategoryDocumentsList($id: ID!) {
        envelope(id: $id) {
          documentList {
            id
            name
            created
            treatement
          }
        }
      }
    `);
  }
  // Document Category

  export function categoryCreation() {
    return graphql(`
      mutation DocumentCategoryCreation(
        $companyID: ID!
        $name: String!
        $customerVisibility: Boolean!
      ) {
        documentCategoryCreation(
          companyID: $companyID
          name: $name
          customerVisibility: $customerVisibility
        ) {
          name
        }
      }
    `);
  }

  export function gedDocumentCategoryQuery() {
    return graphql(`
      query GedDocumentCategoryList($companyID: ID!, $customerID: ID!) {
        documentCategoryList(companyID: $companyID) {
          key
          name
          documents(companyID: $companyID, customerID: $customerID) {
            id
            name
            envelope {
              name
            }
          }
        }
      }
    `);
  }

  export function documentAdd() {
    return graphql(`
      mutation DocumentAdd(
        $companyID: ID!
        $customerID: ID!
        $input: DocumentAdd!
      ) {
        documentAdd(
          companyID: $companyID
          customerID: $customerID
          input: $input
        ) {
          id
        }
      }
    `);
  }

  export function documentCategoryUpdate() {
    return graphql(`
      mutation DocumentCategoryUpdate(
        $companyID: ID!
        $key: String!
        $updatedName: String!
        $customerVisibility: Boolean!
      ) {
        documentCategoryUpdate(
          companyID: $companyID
          key: $key
          updatedName: $updatedName
          customerVisibility: $customerVisibility
        ) {
          name
        }
      }
    `);
  }

  export function documentCategoryDeletion() {
    return graphql(`
      mutation DocumentCategoryDeletion($companyID: ID!, $key: String!) {
        documentCategoryDeletion(companyID: $companyID, key: $key) {
          name
        }
      }
    `);
  }

  export function documentByCategoryQuery() {
    return graphql(`
      query documentList(
        $companyID: ID!
        $customerID: ID!
        $categories: [String!]
      ) {
        documentList(
          companyID: $companyID
          customerID: $customerID
          categories: $categories
        ) {
          name
          created
        }
      }
    `);
  }

  export function documentCategoryListQuery() {
    return graphql(`
      query DocumentCategoryListOnly($companyID: ID!) {
        documentCategoryList(companyID: $companyID) {
          key
          name
          customerVisibility
        }
      }
    `);
  }

  export function categoryDocumentsListQuery() {
    return graphql(`
      query CategoryDocumentsList(
        $companyID: ID!
        $customerID: ID!
        $categoryKey: String!
      ) {
        documentCategory(companyID: $companyID, categoryKey: $categoryKey) {
          documents(companyID: $companyID, customerID: $customerID) {
            id
            name
            created
            treatement
          }
        }
      }
    `);
  }
  export function documentInfoQuery() {
    return graphql(`
      query DocumentInfo($companyID: ID!, $customerID: ID!, $id: ID!) {
        document(companyID: $companyID, customerID: $customerID, id: $id) {
          id
          created
          name
          expiration
          category {
            key
            name
          }
          treatement
          notes
          extension
          signature {
            signed
            validated
            digital
            customer
            manager
            signatories
          }
          envelope {
            id
            name
          }
        }
      }
    `);
  }
  // Get only the url
  export function documentUrlQuery() {
    return graphql(`
      query DocumentUrl($companyID: ID!, $customerID: ID!, $id: ID!) {
        document(companyID: $companyID, customerID: $customerID, id: $id) {
          url
        }
      }
    `);
  }

  // Mock

  export function documentCategoryListMock() {
    const categories = [
      {
        key: "category-1",
        name: "Category 1",
        customerVisibility: true,
      },
      {
        key: "category-2",
        name: "Category 2",
        customerVisibility: false,
      },
      {
        key: "category-3",
        name: "Category 3",
        customerVisibility: true,
      },
    ];

    return mswGraphl.query<DocumentCategoryListOnlyQuery>(
      "DocumentCategoryListOnly",
      () => {
        return HttpResponse.json({
          data: {
            documentCategoryList: categories,
          },
        });
      }
    );
  }

  export function categoryCreationMock() {
    return mswGraphl.mutation<DocumentCategoryCreationMutation>(
      "DocumentCategoryCreation",
      ({ variables }) => {
        const newCategory = {
          key: variables.name.toLowerCase(),
          name: variables.name,
          customerVisibility: variables.customerVisibility,
        };

        return HttpResponse.json({
          data: {
            documentCategoryCreation: newCategory,
          },
        });
      }
    );
  }

  export function categoryDocumentsListQueryMock() {
    return mswGraphl.query<CategoryDocumentsListQuery>(
      "CategoryDocumentsList",
      () => {
        return HttpResponse.json({
          data: {
            documentCategory: {
              documents: [
                {
                  id: "document-1",
                  name: "Document 1",
                  created: new Date(),
                  treatement: Treatement.Unvalid,
                },
                {
                  id: "document-2",
                  name: "Document 2",
                  created: new Date(),
                  treatement: Treatement.Valid,
                },
                {
                  id: "document-3",
                  name: "Document 3",
                  created: new Date(),
                  treatement: Treatement.Waiting,
                },
              ],
            },
          },
        });
      }
    );
  }

  export function documentInfoQueryMock() {
    return mswGraphl.query<DocumentInfoQuery>("DocumentInfo", () => {
      return HttpResponse.json({
        data: {
          document: {
            id: "1",
            name: "Document 1",
            created: new Date(),
            expiration: new Date(),
            extension: "pdf",
            category: {
              key: "1",
              name: "Category 1",
            },
            treatement: Treatement.Unvalid,
            notes: "Notes",
            signature: {
              signed: false,
              validated: false,
              digital: false,
              customer: DocumentSignatureState.Pending,
              manager: DocumentSignatureState.Signed,
            },
            envelope: {
              id: "1",
              name: "Envelope 1",
            },
          },
        },
      });
    });
  }

  export function documentUrlQueryMock() {
    return mswGraphl.query<DocumentUrlQuery>("DocumentUrl", () => {
      return HttpResponse.json({
        data: {
          document: {
            url: "https://www.google.com",
          },
        },
      });
    });
  }

  export const handlers = [
    documentCategoryListMock(),
    categoryCreationMock(),
    categoryDocumentsListQueryMock(),
    documentInfoQueryMock(),
    documentUrlQueryMock(),
  ];
}
