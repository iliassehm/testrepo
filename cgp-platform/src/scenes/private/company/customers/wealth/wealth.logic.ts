import { graphql } from "../../../../../types";

export namespace WealthLogic {
  export function queries() {
    return graphql(`
      query CustomerWealth(
        $id: ID!
        $company: ID!
        $financialTypes: [AssetGroup!]
        $passiveTypes: [AssetGroup!]
        $nonFinancialTypes: [AssetGroup!]
        $benefitsTypes: [AssetGroup!]
        $repartitionTypes: [AssetGroup!]
        $othersTypes: [AssetGroup!]
        $computing: WealthFilter
      ) {
        financialWealth: customerWealth(
          id: $id
          companyID: $company
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
        nonfinancialWealth: customerWealth(
          id: $id
          companyID: $company
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
        othersWealth: customerWealth(
          id: $id
          companyID: $company
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
        passiveWealth: customerWealth(
          id: $id
          companyID: $company
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
        benefitsWealth: customerWealth(
          id: $id
          companyID: $company
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
        repartition: customerWealth(
          id: $id
          companyID: $company
          groups: $repartitionTypes
          computing: $computing
        ) {
          name: group
          amount: valuation
        }
      }
    `);
  }

  export function wealthUnderManagmentQueries() {
    return graphql(`
      query WealthUnderManagment($company: ID!, $computing: WealthFilter) {
        assetsTypes: companyWealth(id: $company, computing: $computing) {
          name: group
          amount: valuation
          assetsUnderManagement(computing: $computing) {
            id
            name
            valuation
            customer {
              id
              name
            }
          }
        }
      }
    `);
  }
  export function customerWalletQueries() {
    return graphql(`
      query CustomerWallet($companyID: ID!, $id: ID!) {
        customerWallet(companyID: $companyID, id: $id) {
          id
          accountNumber
          group
          insuranceCompany
          name
          openDate
          transfersAmount
          withdrawalAmount
          valuation
          risk
          metadata
          mixedData
          sri
          irr
          initialValuation
          investments {
            id
            code
            label
            quantity
            unitPrice
            unitValue
            dateValue
            valuation
            dateValuation
            instrument
            riskIndicator
            category: subcategory
            buyingDate
            investmentInstrument {
              dic
              prospectus
              metadata
            }
          }
        }
      }
    `);
  }

  export function underManagementAssetGroupsQueries() {
    return graphql(`
      query UnderManagementAssetGroups(
        $customerID: ID!
        $companyID: ID!
        $groups: [AssetGroup!]
        $computing: WealthFilter
      ) {
        customerWealth(
          id: $customerID
          companyID: $companyID
          groups: $groups
          computing: $computing
        ) {
          group
          valuation
          assets(computing: $computing) {
            id
            name
            group
            activity
            accountNumber
            openDate
            categoryName
            transfersAmount
            withdrawalAmount
            metadata
            sri
            valuation
            owners {
              entity {
                id
              }
              ownership
              mode
            }
          }
        }
      }
    `);
  }

  export function customerAssets() {
    return graphql(`
      query CustomerAssets($id: ID!, $companyID: ID!, $groups: [AssetGroup!]) {
        customerAssets(id: $id, companyID: $companyID, groups: $groups) {
          id
          name
          group
        }
      }
    `);
  }

  export function customerWalletInvestmentSriUpdate() {
    return graphql(`
      mutation CustomerWalletInvestmentSriUpdate(
        $id: ID!
        $riskIndicator: Int!
      ) {
        customerWalletInvestmentSriUpdate(
          id: $id
          riskIndicator: $riskIndicator
        ) {
          id
        }
      }
    `);
  }
}
