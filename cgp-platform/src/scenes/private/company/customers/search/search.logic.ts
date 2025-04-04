import { graphql } from "../../../../../types";

export namespace CompanyCustomersSearchLogic {
  export function customersSearch() {
    return graphql(`
      query SearchCustomers($companyID: ID!, $schema: CustomerSearchSchema!) {
        searchCustomers(companyID: $companyID, schema: $schema) {
          id
        }
      }
    `);
  }

  export function customersSearchFilters() {
    return graphql(`
      query CustomersSearchFilters($companyID: ID!, $underManagement: Boolean) {
        customersSearchFilters(
          companyID: $companyID
          underManagement: $underManagement
        ) {
          insuranceCompany
          category
          group

          investmentType
          investmentManagementCompany
          tags
        }
      }
    `);
  }

  export function customersSearchResult() {
    return graphql(`
      query SearchCustomersResult($companyID: ID!, $id: ID!) {
        getSearchResult(companyID: $companyID, id: $id) {
          id
          result {
            ... on CustomerAsset {
              __typename
              id
              customer {
                id
                name
              }
              performance {
                gain
                evolution
              }

              mixedData
              accountNumber
              openDate
              group
              name
              valuation

              investmentCode
              investmentLabel
              investmentValuation
              investmentPerformance
            }

            ... on Customer {
              __typename
              id
              name
              underManagementWealth: wealth(
                companyID: $companyID
                computing: under_managements
              )
              wealth(companyID: $companyID)
              informations {
                details
                general
              }
            }
          }
          schema
        }
      }
    `);
  }

  export function exportSearchResult() {
    return graphql(`
      mutation exportSearchResult(
        $companyID: ID!
        $id: ID!
        $hasInvestQuery: Boolean
      ) {
        url: exportSearchResult(
          companyID: $companyID
          id: $id
          hasInvestQuery: $hasInvestQuery
        )
      }
    `);
  }

  export function getFavoriteSearches() {
    return graphql(`
      query GetFavoriteSearches {
        favoriteSearchQueries {
          id
          schema
        }
      }
    `);
  }

  export function saveFavoriteSearch() {
    return graphql(`
      mutation SaveFavoriteSearch($schema: CustomerSearchSchema!) {
        saveFavoriteSearchQuery(schema: $schema) {
          id
        }
      }
    `);
  }

  export function deleteFavoriteSearch() {
    return graphql(`
      mutation DeleteFavoriteSearch($id: ID!) {
        deleteFavoriteSearchQuery(id: $id) {
          id
        }
      }
    `);
  }
}
