import { graphql } from "../../../../../types";

export namespace ProjectLogic {
  // queries

  export function project() {
    return graphql(`
      query Project($id: ID!) {
        project(id: $id) {
          id
          created
          validated
          archived
          name
          type
          metadata
        }
      }
    `);
  }

  export function projectList() {
    return graphql(`
      query ProjectList(
        $customerID: ID!
        $companyID: ID!
        $range: TimeRange!
        $type: ProjectType
        $productType: String
      ) {
        projectList(
          customerID: $customerID
          companyID: $companyID
          range: $range
          type: $type
          productType: $productType
        ) {
          id
          created
          validated
          archived
          name
          type
          metadata
        }
      }
    `);
  }

  export function projectDeletion() {
    return graphql(`
      mutation ProjectDeletion($id: ID!) {
        projectDeletion(id: $id) {
          id
        }
      }
    `);
  }

  export function projectValidation() {
    return graphql(`
      mutation ProjectValidation($id: ID!, $customerID: ID!, $companyID: ID!) {
        projectValidation(
          id: $id
          customerID: $customerID
          companyID: $companyID
        ) {
          id
        }
      }
    `);
  }

  export function projectCreation() {
    return graphql(`
      mutation ProjectCreation(
        $customerID: ID!
        $companyID: ID!
        $type: ProjectType!
        $name: String!
        $metadata: ProjectMetadata!
      ) {
        projectCreation(
          customerID: $customerID
          companyID: $companyID
          type: $type
          name: $name
          metadata: $metadata
        ) {
          id
        }
      }
    `);
  }

  export function projectUpdate() {
    return graphql(`
      mutation ProjectUpdate($id: ID!, $metadata: ProjectMetadata!) {
        projectUpdate(id: $id, metadata: $metadata) {
          id
        }
      }
    `);
  }

  export function projectProductTypes() {
    return graphql(`
      query ProjectProductTypes($companyID: ID!, $customerID: ID!) {
        projectProductTypes(companyID: $companyID, customerID: $customerID)
      }
    `);
  }

  export function generateAdequacy() {
    return graphql(`
      mutation GenerateAdequacy($projectID: ID!, $customerID: ID!) {
        generateAdequacy(projectID: $projectID, customerID: $customerID) {
          name
          url
          extension
        }
      }
    `);
  }
}
