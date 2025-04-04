import { RequestDocument } from "graphql-request";

import { graphql } from "../../../../../../types";

export namespace InstrumentDetailLogic {
  export function instrumentDetailsQuery() {
    return graphql(`
      query InstrumentDetail($id: ID!) {
        instrumentDetails(id: $id) {
          code
          label
          category
          managementCompany
          subcategory
          riskIndicator
          dic
          prospectus
          location
          closePrice
          closePriceDate
          currency
          sfdr
          pea
          peaPme
          esg
          indiceReference
          minimumInvestissement
          frequenceValorisation
          nombreParts
          fraisPriips
          fraisCourants
          fraisGestion
          fraisSouscription
          fraisRachat

          perfCalendaire {
            year
            value
          }
        }
      }
    `);
  }

  export function searchInvestmentsByInstrumentCodeInAssets() {
    return graphql(`
      query searchInvestmentsByInstrumentCodeInAssets(
        $companyID: ID!
        $code: ID!
        $page: Int
        $limit: Int
      ) {
        searchInvestmentsByInstrumentCodeInAssets(
          companyID: $companyID
          code: $code
          page: $page
          limit: $limit
        ) {
          totalCount
          edges {
            assetId
            assetName
            assetGroup
            customerId
            customerName
            amount
            detentions
            performance {
              amount
              percentage
            }
          }
        }
      }
    `);
  }

  export function getInstrumentIsFavorite() {
    return graphql(`
      query instrumentIsFavorite($companyID: ID!, $code: ID!) {
        instrumentIsFavorite(companyID: $companyID, code: $code)
      }
    `);
  }

  export function instrumentUpdate() {
    return graphql(`
      mutation InstrumentUpdate(
        $companyID: ID!
        $code: ID!
        $input: InstrumentsDataInput!
      ) {
        instrumentUpdate(companyID: $companyID, code: $code, input: $input) {
          code
        }
      }
    `);
  }
}
