import { CompanyIntermediationForm } from "@shared-schemas/companySetting";

import { gql } from "../../../../../../service/client";
import { Company, graphql } from "../../../../../../types";

export namespace CompanyIntermediationLogic {
  export async function formQuery(companyID: Company["id"], isParent: boolean) {
    if (isParent) {
      return await gql.client.request(
        graphql(`
          query ParentCompanyIntermediationForm($companyID: ID!) {
            parentCompanyInfos(id: $companyID) {
              intermediation
            }
          }
        `),
        { companyID: companyID }
      );
    }
    return await gql.client.request(
      graphql(`
        query CompanyIntermediationForm($companyID: ID!) {
          company(id: $companyID) {
            intermediation
          }
        }
      `),
      { companyID: companyID }
    );
  }

  export async function formMutation(
    companyID: Company["id"],
    input: CompanyIntermediationForm,
    isParent: boolean
  ) {
    if (isParent) {
      return await gql.client.request(
        graphql(`
          mutation ParentCompanyIntermediationFormUpdate(
            $companyID: ID!
            $intermediationInput: CompanyIntermediationForm!
          ) {
            updated: parentCompanyUpdate(
              companyID: $companyID
              intermediationInput: $intermediationInput
            ) {
              id
              intermediation
            }
          }
        `),
        { companyID: companyID, intermediationInput: input }
      );
    }

    return await gql.client.request(
      graphql(`
        mutation CompanyIntermediationFormUpdate(
          $companyID: ID!
          $intermediationInput: CompanyIntermediationForm!
        ) {
          updated: companyUpdate(
            companyID: $companyID
            intermediationInput: $intermediationInput
          ) {
            id
            intermediation
          }
        }
      `),
      { companyID: companyID, intermediationInput: input }
    );
  }
}
