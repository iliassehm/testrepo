import { gql } from "../../../../../service/client";
import {
  Customer,
  EnvelopeUrlQueryVariables,
  graphql,
} from "../../../../../types";

export namespace CustomersConformityLogic {
  // queries

  export function customerConformityObjectives() {
    return graphql(`
      query CustomerConformityObjectives($customerID: ID!, $companyID: ID!) {
        customer(id: $customerID, companyID: $companyID) {
          conformityObjectives
        }
      }
    `);
  }

  export function envelopDocumentTemplateList() {
    return graphql(`
      query EnvelopDocumentTemplateList($companyID: ID!, $available: Boolean!) {
        documentTemplateList(companyID: $companyID, available: $available) {
          id
          name
          category
          creator
          productType
        }
      }
    `);
  }

  export function ConformityQueries() {
    return graphql(`
      query CustomerConformity(
        $companyID: ID!
        $customerID: ID!
        $officialCategories: [String!]
        $legalCategories: [String!]
        $arbitraryCategories: [String!]
      ) {
        officialList: documentList(
          companyID: $companyID
          customerID: $customerID
          categories: $officialCategories
        ) {
          id
          name
          category {
            key
            name
          }
          treatement
          expiration
        }
        legalList: documentList(
          companyID: $companyID
          customerID: $customerID
          categories: $legalCategories
        ) {
          id
          name
          category {
            key
            name
          }
          treatement
          expiration
        }
        envelopeList(
          companyID: $companyID
          customerID: $customerID
          categories: $arbitraryCategories
        ) {
          id
          name
          access
          expiration
          conformity
          documentList(categories: $arbitraryCategories) {
            id
            name
            category {
              key
              name
            }
            treatement
            expiration
          }
        }
      }
    `);
  }

  export function getDocument() {
    return graphql(`
      query ConformityDocument($companyID: ID!, $customerID: ID!, $id: ID!) {
        document(companyID: $companyID, customerID: $customerID, id: $id) {
          url
          name
        }
      }
    `);
  }

  export function searchCampaign() {
    return graphql(`
      query SearchCampaign($companyID: ID!, $text: String) {
        searchCampaign(companyID: $companyID, text: $text) {
          id
          name
          assetGroup
        }
      }
    `);
  }

  export function investorProfileQueries() {
    return graphql(`
      query InvestorProfile($companyID: ID!, $customerID: ID!) {
        customer(id: $customerID, companyID: $companyID) {
          investorProfile
          informations {
            details
            general
          }
        }
        investorProfileForm(companyID: $companyID, customerID: $customerID)
        budgetList(customerID: $customerID, companyID: $companyID) {
          id
          name
          type
          amount
          libelle
        }
      }
    `);
  }

  export function investorProfileStats() {
    return graphql(`
      query InvestorProfileStats($companyID: ID!, $customerID: ID!) {
        investorProfileStats(companyID: $companyID, customerID: $customerID) {
          knowledge
          riskProfile
          nonFinancialSensitivity
        }
        investorEnvironmentalStats(
          companyID: $companyID
          customerID: $customerID
        ) {
          activities
          negativeImpacts
          socialObjectives
        }
        investorProfileForm(companyID: $companyID, customerID: $customerID)
      }
    `);
  }

  export function templateVariables() {
    return graphql(`
      query templateVariables(
        $companyID: ID!
        $customerID: ID!
        $projectID: ID
      ) {
        templateVariables(
          companyID: $companyID
          customerID: $customerID
          projectID: $projectID
        ) {
          key
          value
        }
      }
    `);
  }

  // mutations

  export function createFilesFromTemplate() {
    return graphql(`
      mutation CreateFilesFromTemplate(
        $companyID: ID!
        $customerID: ID!
        $templates: [FileFromTemplateInput!]!
      ) {
        createFilesFromTemplate(
          companyID: $companyID
          customerID: $customerID
          templates: $templates
        ) {
          id
          url
          name
          category
          extension
        }
      }
    `);
  }

  export function createFilesFromGED() {
    return graphql(`
      mutation CreateFilesFromGED(
        $companyID: ID!
        $customerID: ID!
        $gedDocumentsID: [String!]!
      ) {
        createFilesFromGedDocuments(
          companyID: $companyID
          customerID: $customerID
          gedDocumentsID: $gedDocumentsID
        ) {
          url
          name
          category
          extension
        }
      }
    `);
  }

  export function CustomerConformityObjectivesUpdate() {
    return graphql(`
      mutation CustomerConformityObjectivesUpdate(
        $companyID: ID!
        $customerID: ID!
        $input: ConformityObjectives!
      ) {
        conformityObjectivesUpdate(
          companyID: $companyID
          customerID: $customerID
          input: $input
        )
      }
    `);
  }

  export function customerUploadCreation() {
    return graphql(`
      mutation CustomerUploadCreation(
        $companyID: ID!
        $customerID: ID!
        $files: [UploadRequest!]!
      ) {
        customerUpload(
          companyID: $companyID
          customerID: $customerID
          files: $files
        ) {
          files {
            url
            name
          }
          expiration
        }
      }
    `);
  }

  export function envelopeCreation() {
    return graphql(`
      mutation EnvelopeCreation(
        $companyID: ID!
        $customerID: ID!
        $input: EnvelopeCreation!
        $notificationRequests: [NotificationRequest!]
        $addParagraphs: Boolean
      ) {
        envelopeCreation(
          companyID: $companyID
          customerID: $customerID
          input: $input
          notificationRequests: $notificationRequests
          addParagraphs: $addParagraphs
        ) {
          id
          name
        }
      }
    `);
  }

  export function envelopeAffectation() {
    return graphql(`
      mutation EnvelopeAffectation(
        $companyID: ID!
        $customerID: ID!
        $envelopeID: ID!
        $campaignID: ID!
      ) {
        envelopeAffectation(
          companyID: $companyID
          customerID: $customerID
          envelopeID: $envelopeID
          campaignID: $campaignID
        ) {
          id
          name
        }
      }
    `);
  }

  export function NotifyDocumentStatusMutation() {
    return graphql(`
      mutation NotifyDocumentStatus(
        $documentID: ID!
        $requests: [NotificationRequest!]!
      ) {
        notifyDocumentStatus(documentID: $documentID, requests: $requests) {
          id
        }
      }
    `);
  }

  export function investorProfileMutation() {
    return graphql(`
      mutation InvestorProfileUpdate(
        $companyID: ID!
        $customerID: ID!
        $input: InvestorProfile!
      ) {
        investorProfileUpdate(
          companyID: $companyID
          customerID: $customerID
          input: $input
        )
      }
    `);
  }

  export function documentDeletion() {
    return graphql(`
      mutation DocumentDeletion(
        $companyID: ID!
        $customerID: ID!
        $documentID: [ID!]!
      ) {
        documentDeletion(
          companyID: $companyID
          customerID: $customerID
          documentID: $documentID
        )
      }
    `);
  }

  export function documentUpdate() {
    return graphql(`
      mutation DocumentUpdate(
        $id: ID!
        $companyID: ID!
        $update: DocumentUpdate
      ) {
        documentUpdate(id: $id, companyID: $companyID, update: $update) {
          id
        }
      }
    `);
  }

  export function investorProfileFormUpdate() {
    return graphql(`
      mutation InvestorProfileFormUpdate(
        $companyID: ID!
        $customerID: ID!
        $input: InvestorProfileForm!
      ) {
        investorProfileFormUpdate(
          companyID: $companyID
          customerID: $customerID
          input: $input
        )
      }
    `);
  }

  export function requestCustomerToFillInvestorProfileForm() {
    return graphql(`
      mutation RequestFormFilling(
        $companyID: ID!
        $customerID: ID!
        $form: Form!
      ) {
        requestFormFilling(
          companyID: $companyID
          customerID: $customerID
          form: $form
        ) {
          id
        }
      }
    `);
  }

  export function sendToSign() {
    return graphql(`
      mutation SendToSign($companyID: ID!, $customerID: ID!, $form: Form!) {
        sendToSign(
          companyID: $companyID
          customerID: $customerID
          form: $form
        ) {
          id
        }
      }
    `);
  }

  export function documentToPdf() {
    return graphql(`
      mutation ConvertDocumentToPdf(
        $companyID: ID!
        $customerID: ID!
        $fileUrl: String!
      ) {
        convertDocumentToPdf(
          companyID: $companyID
          customerID: $customerID
          fileUrl: $fileUrl
        )
      }
    `);
  }

  export function envelopeURL(
    id: EnvelopeUrlQueryVariables["id"],
    acces: "customer" | "company",
    customerID: Customer["id"]
  ) {
    const operation = graphql(`
      query EnvelopeURL($id: ID!, $companyURL: Boolean!, $customerID: ID!) {
        envelope(id: $id) {
          companyURL @include(if: $companyURL)
          customerURL(customerID: $customerID) @skip(if: $companyURL)
        }
      }
    `);

    return gql.client.request(operation, {
      id: id,
      companyURL: acces === "company",
      customerID: customerID,
    });
  }
}

export type EnvelopeAccessURL = Parameters<
  typeof CustomersConformityLogic.envelopeURL
>[1];
