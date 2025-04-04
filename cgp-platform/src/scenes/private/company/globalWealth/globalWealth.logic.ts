import { gql } from "../../../../service/client";
import {
  AssetManagementSwitchMutationVariables,
  graphql,
} from "../../../../types";

export namespace GlobalWealthLogic {
  export function queries() {
    return graphql(`
      query GlobalWealth(
        $company: ID!
        $start: DateTime
        $end: DateTime
        $options: AssetPerformanceOrder!
        $computing: WealthFilter
        $ignoring: [AssetGroup!]
        $campaignLimit: Int
      ) {
        companyWealth(id: $company, computing: $computing) {
          name: group
          amount: valuation
          performance(start: $start, end: $end, computing: $computing) {
            gain
            evolution
          }
        }
        assets: companiesManagedAsset(
          companyID: $company
          start: $start
          end: $end
          options: $options
          ignoring: $ignoring
        ) {
          id
          name
          group
          amount: activity
          isManual
          # performance(start: $start, end: $end) {
          performance {
            gain
            evolution
          }
        }
        liquidity: globalLiquidity(companyID: $company, computing: $computing)
        mostOccuring: mostOccuringAssetType(companyID: $company) {
          group
          count
        }
        company(id: $company) {
          wealth
          metadata
        }
        details: customerDetails(companyID: $company) {
          managedWealth
        }

        campaigns: campaignList(companyID: $company, limit: $campaignLimit) {
          name
        }
      }
    `);
  }

  export async function managementSwitch(
    data: AssetManagementSwitchMutationVariables
  ) {
    return await gql.client.request(
      graphql(`
        mutation AssetManagementSwitch(
          $id: ID!
          $companyID: ID!
          $customerID: ID!
          $domain: WealthFilter!
        ) {
          asset: switchAssetManagement(
            id: $id
            companyID: $companyID
            customerID: $customerID
            management: $domain
          ) {
            id
            name
            underManagement
            isManual
          }
        }
      `),
      data
    );
  }
}
