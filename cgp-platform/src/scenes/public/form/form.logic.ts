import { graphql } from "../../../types";

export namespace PublicForm {
  export function getPubliFormFilling() {
    return graphql(`
      query GetPubliFormFilling($token: String!) {
        existingFormData(token: $token)
      }
    `);
  }

  export function getExternalInvestorProfileForm() {
    return graphql(`
      query GetExternalInvestorProfileForm($customerID: ID!) {
        externalInvestorProfileForm(customerID: $customerID)
      }
    `);
  }

  export function submitExternalInvestorProfileForm() {
    return graphql(`
      mutation SubmitExternalInvestorProfileForm(
        $input: PublicFormSubmit!
        $customerID: ID!
      ) {
        externalInvestorProfileForm(input: $input, customerID: $customerID)
      }
    `);
  }

  export function submitPubliFormFilling() {
    return graphql(`
      mutation SubmitPubliFormFilling(
        $input: PublicFormSubmit!
        $token: String!
        $isSyncing: Boolean
      ) {
        formFilling(input: $input, token: $token, isSyncing: $isSyncing)
      }
    `);
  }

  export function publicCustomerWidgetWealth() {
    return graphql(`
      query PublicCustomerWealth(
        $token: String!
        $financialTypes: [AssetGroup!]
        $passiveTypes: [AssetGroup!]
        $nonFinancialTypes: [AssetGroup!]
        $benefitsTypes: [AssetGroup!]
        $repartitionTypes: [AssetGroup!]
        $othersTypes: [AssetGroup!]
        $computing: WealthFilter
      ) {
        financialWealth: publicCustomerWealth(
          token: $token
          groups: $financialTypes
          computing: $computing
        ) {
          name: group
          amount: valuation
          data: assets(computing: $computing) {
            id
            name
            group
            categoryName
            valuation
            underManagement
            isManual
            sri
            metadata
            valuation
            owners {
              entity {
                id
              }
              ownership
            }
          }
        }
        nonfinancialWealth: publicCustomerWealth(
          token: $token
          groups: $nonFinancialTypes
          computing: $computing
        ) {
          name: group
          amount: valuation
          data: assets(computing: $computing) {
            id
            name
            group
            categoryName
            valuation
            underManagement
            isManual
            sri
            valuation
            metadata
            owners {
              entity {
                id
              }
              ownership
            }
          }
        }
        othersWealth: publicCustomerWealth(
          token: $token
          groups: $othersTypes
          computing: $computing
        ) {
          name: group
          amount: valuation
          data: assets(computing: $computing) {
            id
            name
            group
            categoryName
            valuation
            underManagement
            isManual
            sri
            valuation
            metadata
            owners {
              entity {
                id
              }
              ownership
            }
          }
        }
        passiveWealth: publicCustomerWealth(
          token: $token
          groups: $passiveTypes
          computing: $computing
        ) {
          name: group
          amount: valuation
          data: assets(computing: $computing) {
            id
            name
            group
            categoryName
            underManagement
            isManual
            valuation
            metadata
            owners {
              entity {
                id
              }
              ownership
            }
          }
        }
        benefitsWealth: publicCustomerWealth(
          token: $token
          groups: $benefitsTypes
          computing: $computing
        ) {
          name: group
          amount: valuation
          data: assets(computing: $computing) {
            id
            name
            group
            categoryName
            underManagement
            isManual
            valuation
            metadata
            owners {
              entity {
                id
              }
              ownership
            }
          }
        }
        repartition: publicCustomerWealth(
          token: $token
          groups: $repartitionTypes
          computing: $computing
        ) {
          name: group
          amount: valuation
        }
      }
    `);
  }
}
