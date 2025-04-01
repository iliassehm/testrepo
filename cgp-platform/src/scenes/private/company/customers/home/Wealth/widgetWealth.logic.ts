import { graphql } from "../../../../../../types";

export namespace WidgetWealthLogic {
  export function queries() {
    return graphql(`
      query CustomerWidgetWealth(
        $id: ID!
        $companyID: ID!
        $financialIgnoredGroup: [AssetGroup!]
        $passiveIgnoredGroup: [AssetGroup!]
        $nonFinancialIgnoredGroup: [AssetGroup!]
        $othersIgnoredGroup: [AssetGroup!]
        $totalIgnoredGroup: [AssetGroup!]
        $start: DateTime
        $end: DateTime
      ) {
        customer(id: $id, companyID: $companyID) {
          totalWealth: wealth(
            companyID: $companyID
            ignoring: $totalIgnoredGroup
          )

          financialWealth: wealth(
            companyID: $companyID
            ignoring: $financialIgnoredGroup
          )
          financialPerformance: performance(
            ignoring: $financialIgnoredGroup
            companyID: $companyID
            start: $start
            end: $end
          ) {
            gain
            evolution
          }

          nonFinancialWealth: wealth(
            companyID: $companyID
            ignoring: $nonFinancialIgnoredGroup
          )
          nonFinancialPerformance: performance(
            ignoring: $nonFinancialIgnoredGroup
            companyID: $companyID
            start: $start
            end: $end
          ) {
            gain
            evolution
          }

          othersWealth: wealth(
            companyID: $companyID
            ignoring: $othersIgnoredGroup
          )

          passiveWealth: wealth(
            companyID: $companyID
            ignoring: $passiveIgnoredGroup
          )

          underManagement: wealth(
            companyID: $companyID
            computing: under_managements
          )
          underManagementPerformance: performance(
            companyID: $companyID
            start: $start
            end: $end
            computing: under_managements
          ) {
            gain
            evolution
          }
        }
      }
    `);
  }
}
