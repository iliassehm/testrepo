import { graphql } from "../../../../../../types";

export namespace LCBLogic {
  export function updateLCB() {
    return graphql(`
      mutation UpdateLCB($companyID: ID!, $customerId: ID!, $input: LCBForm!) {
        updateLCB(companyID: $companyID, customerId: $customerId, input: $input)
      }
    `);
  }

  export function queries() {
    return graphql(`
      query CustomerLcb($companyID: ID!, $customerID: ID!) {
        customer(id: $customerID, companyID: $companyID) {
          informations {
            lcbLab
          }
        }
      }
    `);
  }
}
