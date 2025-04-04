import { graphql } from "../../../../types";

export namespace GlobalAddWealthLogic {
  // Query
  export function connectorQuery() {
    return graphql(`
      query Connector($connectorID: ID!) {
        connector(connectorID: $connectorID) {
          name
          logo
          labels
        }
      }
    `);
  }

  export function connectorListQuery() {
    return graphql(`
      query ConnectorList {
        connectorList {
          key
          name
          logo
          provider
        }
      }
    `);
  }
  // Mutation
  export function synchronizePowensConnectorMutation() {
    return graphql(`
      mutation SynchronizePowensConnector($connectorID: ID!, $companyID: ID!) {
        synchronizePowensConnector(
          companyID: $companyID
          connectorID: $connectorID
        )
      }
    `);
  }
  export function synchronizeConnectorMutation() {
    return graphql(`
      mutation SynchronizeConnector(
        $connectorID: ID!
        $companyID: ID!
        $metadata: ConnectionMetadata!
      ) {
        synchronizeConnector(
          connectorID: $connectorID
          companyID: $companyID
          metadata: $metadata
        ) {
          connection {
            id
            state
          }
          synchronization {
            id
          }
        }
      }
    `);
  }

  export function changeConnectionCredentialsMutation() {
    return graphql(`
      mutation ChangeConnectionCredentials(
        $connectionID: ID!
        $credentials: ConnectionMetadata!
      ) {
        changeConnectionCredentials(
          connectionID: $connectionID
          credentials: $credentials
        ) {
          connection {
            id
            state
          }
          synchronization {
            id
          }
        }
      }
    `);
  }

  export function validateConnectionOtpMutation() {
    return graphql(`
      mutation ValidateConnectionOTP($connectionID: ID!, $otp: String!) {
        validateConnectionOTP(connectionID: $connectionID, otp: $otp) {
          id
          state
        }
      }
    `);
  }

  export function globalAddWealthMutation() {
    return graphql(`
      mutation GlobalAddWealth($companyID: ID!) {
        url: synchronizeAssetUnderManagement(companyID: $companyID)
      }
    `);
  }
}
