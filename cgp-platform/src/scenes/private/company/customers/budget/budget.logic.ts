import { graphql } from "../../../../../types";

export namespace BudgetLogic {
  export function queries() {
    return graphql(`
      query Budget($customerID: ID!, $companyID: ID!) {
        budgetList(customerID: $customerID, companyID: $companyID) {
          id
          name
          type
          amount
          libelle
        }
        customer(id: $customerID, companyID: $companyID) {
          availableLiquidity(companyID: $companyID)
        }
      }
    `);
  }

  export function creation() {
    return graphql(`
      mutation BudgetCreation(
        $customerID: ID!
        $companyID: ID!
        $input: BudgetCreationInput!
        $budgetID: ID
      ) {
        created: budgetCreation(
          customerID: $customerID
          companyID: $companyID
          input: $input
          budgetID: $budgetID
        ) {
          libelle
          name
          type
        }
      }
    `);
  }

  export function budgetItemDeletionMutation() {
    return graphql(`
      mutation BudgetItemDeletion(
        $companyID: ID!
        $customerID: ID!
        $budgetID: ID!
      ) {
        budgetItemDeletion(
          customerID: $customerID
          companyID: $companyID
          budgetID: $budgetID
        )
      }
    `);
  }
}
