import { CompanyLegalForm } from "@shared-schemas/companySetting";

import { gql } from "../../../../../../service/client";
import { Company, graphql } from "../../../../../../types";

export namespace CompanyLegalLogic {
  export async function formQuery(companyID: Company["id"], isParent: boolean) {
    if (isParent) {
      return await gql.client.request(
        graphql(`
          query ParentCompanyLegalForm($companyID: ID!) {
            parentCompanyInfos(id: $companyID) {
              legal
            }
          }
        `),
        { companyID: companyID }
      );
    }
    return await gql.client.request(
      graphql(`
        query CompanyLegalForm($companyID: ID!) {
          company(id: $companyID) {
            legal
          }
        }
      `),
      { companyID: companyID }
    );
  }

  export async function formMutation(
    companyID: Company["id"],
    input: CompanyLegalForm,
    isParent: boolean
  ) {
    if (isParent) {
      return await gql.client.request(
        graphql(`
          mutation ParentCompanyLegalFormUpdate(
            $companyID: ID!
            $legalInput: CompanyLegalForm!
          ) {
            updated: parentCompanyUpdate(
              companyID: $companyID
              legalInput: $legalInput
            ) {
              id
              legal
            }
          }
        `),
        { companyID: companyID, legalInput: input }
      );
    }

    return await gql.client.request(
      graphql(`
        mutation CompanyLegalFormUpdate(
          $companyID: ID!
          $legalInput: CompanyLegalForm!
        ) {
          updated: companyUpdate(
            companyID: $companyID
            legalInput: $legalInput
          ) {
            id
            legal
          }
        }
      `),
      { companyID: companyID, legalInput: input }
    );
  }
}
