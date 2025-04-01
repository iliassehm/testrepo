import { graphql } from "../../../../../../types";

export namespace CompanyAssetTypeWealthLogic {
  export function queries() {
    return graphql(`
      query assetTypeWealth(
        $id: ID!
        $filters: AssetFilters
        $group: AssetGroup!
        $computing: WealthFilter
      ) {
        company(id: $id) {
          id
          assets: assetsUnderManagement(
            group: $group
            filters: $filters
            computing: $computing
          ) {
            totalCount
            edges {
              node {
                id
                name
                valuation
                accountNumber
                customer {
                  id
                  name
                }
                sri
              }
            }
          }
        }
      }
    `);
  }

  export function exportAssets() {
    return graphql(`
      mutation exportAssets(
        $companyID: ID!
        $group: AssetGroup!
        $filters: AssetFilters
        $computing: WealthFilter
      ) {
        url: exportAssets(
          companyID: $companyID
          group: $group
          filters: $filters
          computing: $computing
        )
      }
    `);
  }
}
