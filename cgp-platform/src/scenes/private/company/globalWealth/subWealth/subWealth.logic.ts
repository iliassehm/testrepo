import { graphql } from "../../../../../types";

export namespace SubWealthLogic {
  export function queries() {
    return graphql(`
      query SubWealth(
        $company: ID!
        $start: DateTime
        $end: DateTime
        $limit: Int!
        $computing: WealthFilter
      ) {
        assetsTypes: companyWealth(id: $company, computing: $computing) {
          name: group
          amount: valuation
          performance(start: $start, end: $end, computing: $computing) {
            gain
            evolution
          }
          assetsUnderManagement(limit: $limit, computing: $computing) {
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
}
