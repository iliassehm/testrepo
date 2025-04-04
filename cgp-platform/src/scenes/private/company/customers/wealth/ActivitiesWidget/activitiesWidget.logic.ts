import { HttpResponse, graphql as mswGraphl } from "msw";

import { graphql } from "../../../../../../types";

export namespace ActivitiesWidgetLogic {
  export function getGraphData() {
    return graphql(`
      query CustomerWalletActivitiesGraph($assetId: ID!, $from: DateTime) {
        customerWalletActivitiesGraph(assetId: $assetId, from: $from) {
          id
          value
          start
        }
      }
    `);
  }

  export function getActivitiesByYear() {
    return graphql(`
      query CustomerWalletActivitiesByYear($assetId: ID!) {
        customerWalletActivitiesByYear(assetId: $assetId) {
          year
          startValue
          endValue
          performance {
            gain
            evolution
          }
        }
      }
    `);
  }

  export function addActivityYearHistory() {
    return graphql(`
      mutation CustomerWalletAddActivityYearHistory(
        $companyID: ID!
        $customerID: ID!
        $assetID: ID!
        $input: ActivityYearHistoryCreationInput!
      ) {
        customerWalletAddActivityYearHistory(
          companyID: $companyID
          customerID: $customerID
          assetID: $assetID
          input: $input
        ) {
          year
        }
      }
    `);
  }
  export function updateActivityYearHistory() {
    return graphql(`
      mutation CustomerWalletUpdateActivityYearHistory(
        $companyID: ID!
        $customerID: ID!
        $assetID: ID!
        $input: ActivityYearHistoryCreationInput!
      ) {
        customerWalletUpdateActivityYearHistory(
          companyID: $companyID
          customerID: $customerID
          assetID: $assetID
          input: $input
        ) {
          year
        }
      }
    `);
  }

  export function getActivitiesByYearMock() {
    return mswGraphl.query("CustomerWalletActivitiesByYear", () => {
      return HttpResponse.json({
        data: {
          customerWalletActivitiesByYear: [
            {
              year: 2020,
              startValue: 10000,
              endValue: 12000,
              performance: {
                gain: 2000,
                evolution: 20,
              },
            },
            {
              year: 2021,
              startValue: 12000,
              endValue: 15000,
              performance: {
                gain: 3000,
                evolution: 25,
              },
            },
          ],
        },
      });
    });
  }

  export const handlers = [getActivitiesByYearMock()];
}
