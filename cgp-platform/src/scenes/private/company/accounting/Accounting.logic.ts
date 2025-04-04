import { gql } from "../../../../service/client";
import {
  AssetGroup,
  type Company,
  graphql,
  Pagination,
  WealthFilter,
} from "../../../../types";
import { DateRange } from "../../../../types/entities";

export namespace AccountingLogic {
  // Query
  export function newCustomersQueries() {
    return graphql(`
      query NewCustomers($companyID: ID!, $input: CustomersInput) {
        company(id: $companyID) {
          id
          customerList(input: $input) {
            totalCount
            edges {
              node {
                id
                name
                email
                phoneNumber
                informations {
                  details
                  general
                }
                underManagement: wealth(
                  companyID: $companyID
                  computing: under_managements
                )
              }
            }
          }
        }
      }
    `);
  }

  export function newCustomersCountQueries() {
    return graphql(`
      query NewCustomersCount($companyID: ID!, $input: CustomersInput) {
        company(id: $companyID) {
          id
          customerList(input: $input) {
            totalCount
          }
        }
      }
    `);
  }

  export function newContractsQueries() {
    return graphql(`
      query Assets(
        $company: ID!
        $filters: AssetFilters
        $computing: WealthFilter
        $group: AssetGroup
      ) {
        company(id: $company) {
          list: assetsUnderManagement(
            group: $group
            filters: $filters
            computing: $computing
          ) {
            totalCount
            edges {
              node {
                id
                name
                group
                categoryName
                valuation
                accountNumber
                openDate
                metadata
                customer {
                  name
                }
              }
            }
          }
        }
      }
    `);
  }

  export async function newContractsNumberQuery(
    company: Company["id"],
    computing: WealthFilter,
    group: AssetGroup,
    filters: { dateRange: DateRange }
  ) {
    const query = graphql(`
      query AssetsNumber(
        $company: ID!
        $computing: WealthFilter
        $group: AssetGroup
        $filters: AssetFilters
      ) {
        company(id: $company) {
          list: assetsUnderManagement(
            group: $group
            computing: $computing
            filters: $filters
          ) {
            totalCount
          }
        }
      }
    `);

    return await gql.client.request(query, {
      company,
      computing,
      group,
      filters,
    });
  }

  export async function newTransactions(
    companyID: Company["id"],
    filters: { date: DateRange; groupe: AssetGroup },
    pagination: Pagination
  ) {
    const operation = graphql(`
      query NewTransactions(
        $companyID: ID!
        $filters: AccountingAnalyticsFilters!
        $pagination: Pagination!
      ) {
        list: accountingTransactionList(
          companyID: $companyID
          filters: $filters
          pagination: $pagination
        ) {
          totalCount
          edges {
            node {
              id
              date
              amount
              name
              entityName
              assetName
            }
          }
        }
      }
    `);

    return await gql.client.request(operation, {
      companyID,
      filters: {
        date: filters.date,
        group: filters.groupe,
        computing: WealthFilter.UnderManagements,
      },
      pagination: pagination,
    });
  }

  export async function providerStatistics(
    companyID: Company["id"],
    filters: { date: DateRange; groupe: AssetGroup }
  ) {
    const operation = graphql(`
      query ProviderStatistics(
        $companyID: ID!
        $filters: AccountingAnalyticsFilters!
      ) {
        list: accountingProviderStatistics(
          companyID: $companyID
          filters: $filters
        ) {
          name
          key
          logo
          total
        }
      }
    `);

    return await gql.client.request(operation, {
      companyID,
      filters: {
        date: filters.date,
        group: filters.groupe,
        computing: WealthFilter.UnderManagements,
      },
    });
  }

  export async function managerList(companyID: Company["id"]) {
    return await gql.client.request(
      graphql(`
        query AccountingManagersList($id: ID!) {
          company(id: $id) {
            list: managerList {
              id
              name
            }
          }
        }
      `),
      { id: companyID }
    );
  }

  export async function assetList(
    companyID: string,
    filters: { date: DateRange; computing: WealthFilter }
  ) {
    const query = graphql(`
      query AssetList($companyID: ID!, $filters: AccountingAnalyticsFilters!) {
        accountingAssets(companyID: $companyID, filters: $filters)
      }
    `);

    return await gql.client.request(query, {
      companyID: companyID,
      filters: filters,
    });
  }
}
