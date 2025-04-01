import { graphql } from "../../../../../types";

export namespace InstrumentsLogic {
  export function instrumentsList() {
    return graphql(`
      query InstrumentsList(
        $filters: FavoriteInstrumentsFilters!
        $pagination: Pagination!
      ) {
        instrumentListingWithFavorites(
          filters: $filters
          pagination: $pagination
        ) {
          totalCount
          totalPages
          instruments {
            code
            category
            label
            managementCompany
            isFavorite
            valuation
          }
        }
      }
    `);
  }

  export function favoriteInstrumentsList() {
    return graphql(`
      query FavoriteInstrumentsList(
        $filters: FavoriteInstrumentsFilters!
        $pagination: Pagination!
      ) {
        instrumentFavorites(filters: $filters, pagination: $pagination) {
          totalCount
          totalPages
          instruments {
            code
            category
            label
            managementCompany
            isFavorite
            valuation
          }
        }
      }
    `);
  }
  export function instrumentFiltersQuery() {
    return graphql(`
      query InstrumentFiltersQuery {
        instrumentFavoriteFilters {
          categories
          managementCompanies
        }
      }
    `);
  }

  export function setInstrumentFavorite() {
    return graphql(`
      mutation setInstrumentFavorite(
        $code: ID!
        $isFavorite: Boolean!
        $companyID: ID!
      ) {
        setInstrumentFavorite(
          code: $code
          isFavorite: $isFavorite
          companyID: $companyID
        ) {
          code
        }
      }
    `);
  }
}
