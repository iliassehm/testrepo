import { gql } from "../../../../../../../service/client";
import {
  Company,
  graphql,
  Manager,
  Team,
  TeamMember,
  TeamValues,
} from "../../../../../../../types";

export namespace TeamLogic {
  export async function list(companyID: Company["id"]) {
    return await gql.client.request(
      graphql(`
        query CompanyTeamList($companyID: ID!) {
          list: teamsList(companyID: $companyID) {
            name
            description
            statistics {
              subordinate
              contracts
            }
          }
        }
      `),
      { companyID: companyID }
    );
  }

  export async function managerListQuery(companyID: Company["id"]) {
    return await gql.client.request(
      graphql(`
        query CompanyManagersList($id: ID!) {
          company(id: $id) {
            list: managerList {
              id
              name
              email
            }
          }
        }
      `),
      { id: companyID }
    );
  }

  export async function details(companyID: Company["id"], name: Team["name"]) {
    return await gql.client.request(
      graphql(`
        query CompanyTeamDetails($companyID: ID!, $name: String!) {
          team(companyID: $companyID, name: $name) {
            name
            created
            description
            statistics {
              customers
              contracts
            }
            leaderList {
              id
              name
              email
            }
            subordinateList {
              id
              name
              email
            }
          }
        }
      `),
      { companyID: companyID, name: name }
    );
  }

  export async function create(companyID: Company["id"], input: TeamValues) {
    return await gql.client.request(
      graphql(`
        mutation TeamCreation($companyID: ID!, $input: TeamValues!) {
          created: teamCreation(companyID: $companyID, input: $input) {
            name
          }
        }
      `),
      { companyID: companyID, input: input }
    );
  }

  export async function update(
    companyID: Company["id"],
    name: Team["name"],
    input: TeamValues
  ) {
    return await gql.client.request(
      graphql(`
        mutation TeamUpdate(
          $companyID: ID!
          $name: String!
          $input: TeamValues!
        ) {
          updated: teamUpdate(
            companyID: $companyID
            name: $name
            input: $input
          ) {
            name
          }
        }
      `),
      { companyID: companyID, name: name, input: input }
    );
  }

  export async function deletion(companyID: Company["id"], name: Team["name"]) {
    return await gql.client.request(
      graphql(`
        mutation TeamDeletion($companyID: ID!, $name: String!) {
          deleted: teamDeletion(companyID: $companyID, name: $name) {
            name
          }
        }
      `),
      { companyID: companyID, name: name }
    );
  }

  export async function addMember(
    companyID: Company["id"],
    teamName: Team["name"],
    values: [TeamMember]
  ) {
    return await gql.client.request(
      graphql(`
        mutation TeamMemberAdd(
          $companyID: ID!
          $teamName: String!
          $values: [TeamMember!]
        ) {
          added: teamMemberAdd(
            companyID: $companyID
            teamName: $teamName
            values: $values
          ) {
            name
          }
        }
      `),
      { companyID: companyID, teamName: teamName, values: values }
    );
  }

  export async function removeMember(
    companyID: Company["id"],
    teamName: Team["name"],
    values: Manager["id"][]
  ) {
    return await gql.client.request(
      graphql(`
        mutation TeamMemberRemove(
          $companyID: ID!
          $teamName: String!
          $values: [ID!]
        ) {
          removed: teamMemberRemove(
            companyID: $companyID
            teamName: $teamName
            values: $values
          ) {
            name
          }
        }
      `),
      { companyID: companyID, teamName: teamName, values: values }
    );
  }
}
