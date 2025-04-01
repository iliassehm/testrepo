import { graphql } from "../../../../../types";

export namespace ContractLogic {
  export function contractList() {
    return graphql(`
      query ContractList(
        $filters: ContractFilters!
        $pagination: Pagination!
        $companyID: ID!
      ) {
        contractListing(
          companyID: $companyID
          filters: $filters
          pagination: $pagination
        ) {
          totalCount
          totalPages
          contracts {
            id
            isSelected(companyID: $companyID)
            name
            type
            insuranceCompany
            intermediary
            performance
            accountUnits
            managed
            metadata(companyID: $companyID)
            managedModes
            fundsOrigin
            minTransferAmount
            maxTransferFees
            arbitrageFees
            yearlyFees
          }
        }
      }
    `);
  }

  export function contractFilters() {
    return graphql(`
      query ContractFilters {
        contractFilters {
          insuranceCompanies
          types
          managedModes
          fundsOrigins
        }
      }
    `);
  }

  export function contractCompare() {
    return graphql(`
      mutation AutomaticContractCompare($input: CompareContract!) {
        automaticContractCompare(input: $input) {
          id
          name
          type
          insuranceCompany
          intermediary
          performance
          accountUnits
          managed
          managedModes
          fundsOrigin
          minTransferAmount
          maxTransferFees
          arbitrageFees
          yearlyFees
        }
      }
    `);
  }

  export function linkContractToCompany() {
    return graphql(`
      mutation linkContractToCompany($contractId: ID!, $companyId: ID!) {
        linkContractToCompany(contractId: $contractId, companyId: $companyId) {
          id
          name
          type
          insuranceCompany
          intermediary
          performance
          accountUnits
          managed
          managedModes
          fundsOrigin
          minTransferAmount
          maxTransferFees
          arbitrageFees
          yearlyFees
        }
      }
    `);
  }

  export function unlinkContractFromCompany() {
    return graphql(`
      mutation unlinkContractFromCompany($contractId: ID!, $companyId: ID!) {
        unlinkContractFromCompany(
          contractId: $contractId
          companyId: $companyId
        ) {
          id
          name
          type
          insuranceCompany
          intermediary
          performance
          accountUnits
          managed
          managedModes
          fundsOrigin
          minTransferAmount
          maxTransferFees
          arbitrageFees
          yearlyFees
        }
      }
    `);
  }

  export function updateContractCompanySettings() {
    return graphql(`
      mutation UpdateFavoriteContractMetadata(
        $contractID: ID!
        $companyID: ID!
        $input: FavoriteContractMetadata!
      ) {
        updateFavoriteContractMetadata(
          companyID: $companyID
          contractID: $contractID
          input: $input
        )
      }
    `);
  }
}
