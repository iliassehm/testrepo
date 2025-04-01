import { graphql } from "../../../../../types";

export namespace CompanyCustomersInformationsLogic {
  export function queries() {
    return graphql(`
      query CustomerInformations($customerID: ID!, $companyID: ID!) {
        customer(id: $customerID, companyID: $companyID) {
          name
          email
          phoneNumber
          plan
          type
          tag
          informations {
            details
            general
          }
          hasB2CAccount
          pendingInvitations {
            id
            code
            created
            email
          }
        }
      }
    `);
  }

  export function fullFields() {
    return graphql(`
      query CustomerInformationsFullFields($customerID: ID!, $companyID: ID!) {
        customer(id: $customerID, companyID: $companyID) {
          name
          firstName
          lastName
          email
          phoneNumber
          plan
          type
          tag
          investorProfile
          informations {
            details
            general
            lcbLab
          }
          hasB2CAccount
          pendingInvitations {
            id
            code
            created
            email
          }
        }
        investorProfileForm(companyID: $companyID, customerID: $customerID)
      }
    `);
  }

  export function holdingQueries() {
    return graphql(`
      query HoldingQueries($companyID: ID!, $customerId: ID!) {
        holdingList(companyID: $companyID, customerId: $customerId) {
          id
          name
          form
          companies {
            id
            name
            # form
            ownerName
            created
          }
        }
        businessList(companyID: $companyID, customerId: $customerId) {
          id
          name
          informations {
            general
          }
        }
      }
    `);
  }

  export function holdingListQuery() {
    return graphql(`
      query HoldingList($companyID: ID!, $customerId: ID!) {
        holdingList(companyID: $companyID, customerId: $customerId) {
          id
          name
          form
          companies {
            id
            name
            # form
            ownerName
            created
          }
        }
      }
    `);
  }

  export function businessListQuery() {
    return graphql(`
      query BusinessList($companyID: ID!, $customerId: ID!) {
        businessList(companyID: $companyID, customerId: $customerId) {
          id
          name
          informations {
            general
          }
        }
      }
    `);
  }

  export function updateCustomerInformationsGeneral() {
    return graphql(`
      mutation UpdateCustomerInformationsGeneral(
        $companyID: ID!
        $customerID: ID!
        $input: GeneralInformations!
      ) {
        customerInformationsGeneral(
          companyID: $companyID
          id: $customerID
          input: $input
        )
      }
    `);
  }

  export function customerReferencesAccessUpdate() {
    return graphql(`
      mutation customerReferencesAccessUpdate(
        $companyID: ID!
        $customerID: ID!
        $values: [ReferenceAccessValue!]!
      ) {
        customerReferencesAccessUpdate(
          companyID: $companyID
          customerID: $customerID
          values: $values
        ) {
          manager {
            id
            name
          }
          primary
          customer {
            id
            name
            email
          }
        }
      }
    `);
  }

  export function updateCustomerInformationsDetail() {
    return graphql(`
      mutation UpdateCustomerInformationsDetail(
        $companyID: ID!
        $customerID: ID!
        $input: DetailsInformations!
      ) {
        customerInformationsDetail(
          companyID: $companyID
          id: $customerID
          input: $input
        )
      }
    `);
  }

  export function holdingCreation() {
    return graphql(`
      mutation HoldingCreation(
        $companyID: ID!
        $customerId: ID!
        $name: String!
        $input: HoldingForm!
      ) {
        holdingCreation(
          companyID: $companyID
          customerId: $customerId
          name: $name
          input: $input
        ) {
          id
        }
      }
    `);
  }

  export function holdingUpdate() {
    return graphql(`
      mutation HoldingUpdate(
        $companyID: ID!
        $id: ID!
        $name: String!
        $input: HoldingForm!
      ) {
        holdingUpdate(
          companyID: $companyID
          id: $id
          name: $name
          input: $input
        ) {
          id
        }
      }
    `);
  }

  export function holdingDeletion() {
    return graphql(`
      mutation HoldingDeletion($companyID: ID!, $IDs: [ID!]!) {
        holdingDeletion(companyID: $companyID, IDs: $IDs) {
          name
        }
      }
    `);
  }

  export function assignHoldingsToBusiness() {
    return graphql(`
      mutation AssignHoldingsToBusiness(
        $companyID: ID!
        $businessID: ID!
        $customerId: ID!
        $holdingIds: [ID!]!
      ) {
        assignHoldingsToBusiness(
          companyID: $companyID
          businessID: $businessID
          customerId: $customerId
          holdingIds: $holdingIds
        ) {
          id
          name
        }
      }
    `);
  }
  // Holding company
  export function businessCreate() {
    return graphql(`
      mutation BusinessCreate(
        $companyID: ID!
        $customerId: ID!
        $input: HoldingCompanyInfo!
      ) {
        businessCreate(
          companyID: $companyID
          customerId: $customerId
          input: $input
        ) {
          id
        }
      }
    `);
  }

  export function businessUpdate() {
    return graphql(`
      mutation BusinessUpdate(
        $companyID: ID!
        $id: ID!
        $information: HoldingCompanyInfo
        $managers: HoldingManagerSchema
        $nbManagers: NbHoldingManagerSchema
        $bankAccounts: CompanyFinancialSchema
        $activities: CompanyActivitiesSchema
        $tag: String
      ) {
        businessUpdate(
          companyID: $companyID
          id: $id
          information: $information
          managers: $managers
          nbManagers: $nbManagers
          bankAccounts: $bankAccounts
          activities: $activities
          tag: $tag
        ) {
          id
        }
      }
    `);
  }

  export function businessDeletion() {
    return graphql(`
      mutation BusinessDeletion($companyID: ID!, $IDs: [ID!]!) {
        businessDeletion(companyID: $companyID, IDs: $IDs) {
          id
        }
      }
    `);
  }

  export function createCustomerFromBusiness() {
    return graphql(`
      mutation createCustomerFromBusiness(
        $companyID: ID!
        $customerID: ID!
        $businessID: ID!
        $addToCustomerReference: Boolean
      ) {
        createCustomerFromBusiness(
          companyID: $companyID
          customerID: $customerID
          businessID: $businessID
          addToCustomerReference: $addToCustomerReference
        )
      }
    `);
  }

  // Relation
  export function relationQuery() {
    return graphql(`
      query CustomerRelation($companyID: ID!, $customerID: ID!) {
        customerRelation(companyID: $companyID, customerID: $customerID) {
          list
        }
      }
    `);
  }

  export function relationCreate() {
    return graphql(`
      mutation CustomerRelationCreate(
        $companyID: ID!
        $customerID: ID!
        $input: CustomerRelationForm!
      ) {
        customerRelationCreate(
          companyID: $companyID
          customerID: $customerID
          input: $input
        )
      }
    `);
  }

  export function relationUpdate() {
    return graphql(`
      mutation CustomerRelationUpdate(
        $id: ID!
        $companyID: ID!
        $customerID: ID!
        $input: CustomerRelationForm!
      ) {
        customerRelationUpdate(
          id: $id
          companyID: $companyID
          customerID: $customerID
          input: $input
        )
      }
    `);
  }

  export function createUserFromRelation() {
    return graphql(`
      mutation CreateUserFromRelation(
        $id: ID!
        $companyID: ID!
        $customerID: ID!
        $addToCustomerReference: Boolean!
      ) {
        createUserFromRelation(
          id: $id
          companyID: $companyID
          customerID: $customerID
          addToCustomerReference: $addToCustomerReference
        )
      }
    `);
  }

  export function createRelationFromExistingCustomer() {
    return graphql(`
      mutation CreateRelationFromExistingCustomer(
        $companyID: ID!
        $customerID: ID!
        $existingCustomerID: ID!
      ) {
        createRelationFromExistingCustomer(
          companyID: $companyID
          customerID: $customerID
          existingCustomerID: $existingCustomerID
        ) {
          id
          firstName
          lastName
          email
          informations {
            details
            general
          }
        }
      }
    `);
  }

  export function unlinkFromCustomerReference() {
    return graphql(`
      mutation UnlinkFromCustomerReference($id: ID!, $companyID: ID!) {
        unlinkFromCustomerReference(id: $id, companyID: $companyID)
      }
    `);
  }

  export function relationDelete() {
    return graphql(`
      mutation CustomerRelationDelete(
        $companyID: ID!
        $id: ID!
        $customerID: ID!
      ) {
        customerRelationDelete(
          companyID: $companyID
          id: $id
          customerID: $customerID
        )
      }
    `);
  }

  export function customerRelations() {
    return graphql(`
      mutation CustomerRelations(
        $companyID: ID!
        $id: ID!
        $input: CustomerRelationForm!
      ) {
        customerRelations(companyID: $companyID, id: $id, input: $input)
      }
    `);
  }

  export function customerManagerUpdate() {
    return graphql(`
      mutation CustomerManagerUpdate(
        $customerID: ID!
        $companyID: ID!
        $providerCode: String
        $managerID: ID
      ) {
        updateCustomerManager(
          customerID: $customerID
          companyID: $companyID
          providerCode: $providerCode
          managerID: $managerID
        ) {
          id
        }
      }
    `);
  }
}
