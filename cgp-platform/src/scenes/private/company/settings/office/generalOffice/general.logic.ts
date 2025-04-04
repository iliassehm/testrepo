import { z } from "zod";

import { companyGeneralInputSchema } from "../../../../../../../shared/schemas/companySetting";
import { gql } from "../../../../../../service/client";
import {
  Company,
  CompanyGeneralFormQuery,
  Customer,
  graphql,
  Manager,
  ParentCompanyGeneralFormQuery,
} from "../../../../../../types";

export namespace CompanyGeneralLogic {
  export type CompanyGeneralFormInput = z.infer<
    typeof companyGeneralInputSchema
  >;

  export async function managerQuery(
    companyID: Company["id"],
    managerID: Manager["id"],
    isParent: boolean
  ) {
    if (isParent) {
      return await gql.client.request(
        graphql(`
          query ParentCompanyManagerData($companyID: ID!, $managerID: ID!) {
            parentCompanyManagerData(
              companyID: $companyID
              managerID: $managerID
            ) {
              name
              email
              claims
            }
          }
        `),
        { companyID: companyID, managerID: managerID }
      );
    }
    return await gql.client.request(
      graphql(`
        query ManagerData($companyID: ID!, $managerID: ID!) {
          managerData(companyID: $companyID, managerID: $managerID) {
            name
            email
            claims
          }
        }
      `),
      { companyID: companyID, managerID: managerID }
    );
  }

  export function managerEditMutation(isParent: boolean) {
    if (isParent) {
      return graphql(`
        mutation ParentCompanyManagerUpdate(
          $companyID: ID!
          $managerID: ID!
          $input: ManagerDataInput!
          $claims: [ManagerClaims!]
        ) {
          parentCompanyManagerUpdate(
            companyID: $companyID
            managerID: $managerID
            input: $input
            claims: $claims
          ) {
            id
          }
        }
      `);
    }
    return graphql(`
      mutation ManagerUpdate(
        $companyID: ID!
        $managerID: ID!
        $input: ManagerDataInput!
        $claims: [ManagerClaims!]
      ) {
        managerUpdate(
          companyID: $companyID
          managerID: $managerID
          input: $input
          claims: $claims
        ) {
          id
        }
      }
    `);
  }

  export async function formQuery(companyID: Company["id"], isParent: boolean) {
    if (isParent) {
      return await gql.client.request<ParentCompanyGeneralFormQuery>(
        graphql(`
          query ParentCompanyGeneralForm($companyID: ID!) {
            parentCompanyInfos(id: $companyID) {
              general
              logo
            }
          }
        `),
        { companyID: companyID }
      );
    }
    return await gql.client.request<CompanyGeneralFormQuery>(
      graphql(`
        query CompanyGeneralForm($companyID: ID!) {
          company(id: $companyID) {
            general
            logo
          }
        }
      `),
      { companyID: companyID }
    );
  }

  export async function formMutation(
    companyID: Company["id"],
    input: CompanyGeneralFormInput,
    isParent: boolean
  ) {
    if (isParent) {
      return await gql.client.request(
        graphql(`
          mutation ParentCompanyGeneralFormUpdate(
            $companyID: ID!
            $generalInput: CompanyGeneralForm!
          ) {
            updated: parentCompanyUpdate(
              companyID: $companyID
              generalInput: $generalInput
            ) {
              id
              general
            }
          }
        `),
        { companyID: companyID, generalInput: input }
      );
    }

    return await gql.client.request(
      graphql(`
        mutation CompanyGeneralFormUpdate(
          $companyID: ID!
          $generalInput: CompanyGeneralForm!
        ) {
          updated: companyUpdate(
            companyID: $companyID
            generalInput: $generalInput
          ) {
            id
            general
          }
        }
      `),
      { companyID: companyID, generalInput: input }
    );
  }

  export async function managerListQuery(companyID: Company["id"]) {
    return await gql.client.request(
      graphql(`
        query ManagerList($id: ID!) {
          companyManagersStats(companyID: $id) {
            id
            name
            email
            claims
            nbClients
            nbContracts
            lastActive
            providerCode
          }
        }
      `),
      { id: companyID }
    );
  }

  export async function selectedManagerListQuery(
    companyID: Company["id"],
    customerID: Customer["id"]
  ) {
    return await gql.client.request(
      graphql(`
        query customerReferenceAccessList($companyID: ID!, $customerID: ID!) {
          customerReferenceAccessList(
            companyID: $companyID
            customerID: $customerID
          ) {
            manager {
              id
              name
            }
            primary
            customer {
              id
              name
              email
            }
          }
        }
      `),
      { companyID: companyID, customerID: customerID }
    );
  }

  export function companyUpload() {
    return graphql(`
      mutation CompanyUpload($companyID: ID!, $files: [UploadRequest!]!) {
        companyUpload(companyID: $companyID, files: $files) {
          files {
            url
            name
          }
          expiration
        }
      }
    `);
  }

  export function managerCreationMutation() {
    return graphql(`
      mutation ManagerCreation(
        $companyID: ID!
        $input: ManagerCreation!
        $claims: [ManagerClaims!]
      ) {
        managerCreation(companyID: $companyID, input: $input, claims: $claims) {
          id
        }
      }
    `);
  }

  export function managerDeletionMutation() {
    return graphql(`
      mutation ManagerDeletion($companyID: ID!, $managerID: [ID!]!) {
        managerDeletion(companyID: $companyID, managerID: $managerID)
      }
    `);
  }

  export function managerUpdateProviderCodeMutation() {
    return graphql(`
      mutation UpdateManagerProviderCode(
        $companyID: ID!
        $managerID: ID!
        $input: String!
      ) {
        updateManagerProviderCode(
          companyID: $companyID
          managerID: $managerID
          providerCode: $input
        ) {
          providerCode
        }
      }
    `);
  }
}
