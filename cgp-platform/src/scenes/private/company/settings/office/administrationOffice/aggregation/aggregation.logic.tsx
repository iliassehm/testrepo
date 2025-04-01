/* eslint-disable @typescript-eslint/no-namespace */
import { HttpResponse, graphql as mswGraphl } from "msw";
import { TypedDocumentNode } from "msw/lib/core/graphql";

import {
  connectorListMock,
  managerListMock,
} from "../../../../../../../mocks/handlers/mock";
import {
  ConnectionsHasInvalidCredsQuery,
  ConnectionState,
  Exact,
  GetAggregationListQuery,
  graphql,
  ParentConnectionsHasInvalidCredsQuery,
  Scalars,
} from "../../../../../../../types";

export namespace CompanyAggregationLogic {
  export function getAggregationList() {
    return graphql(`
      query GetAggregationList($companyID: ID!) {
        connectionList(companyID: $companyID) {
          id
          state
          updated
          identifier
          manager {
            id
            name
          }
          connector {
            key
            name
            logo
            provider
          }
        }
      }
    `);
  }

  export function getAggregationListMock() {
    return mswGraphl.query<GetAggregationListQuery>(
      "GetAggregationList",
      () => {
        return HttpResponse.json({
          data: {
            connectionList: [
              {
                id: "1",
                state: ConnectionState.Active,
                connector: connectorListMock()[0],
                updated: new Date(),
                identifier: "123",
                manager: managerListMock()[0],
              },
              {
                id: "2",
                state: ConnectionState.RequireOtp,
                connector: connectorListMock()[1],
                updated: new Date(),
                identifier: "456",
                manager: managerListMock()[1],
              },
              {
                id: "3",
                state: ConnectionState.Pending,
                connector: connectorListMock()[2],
                updated: new Date(),
                identifier: "789",
                manager: managerListMock()[2],
              },
            ],
          },
        });
      }
    );
  }

  export function connectionsHasInvalidCreds(
    isParent: boolean
  ): typeof isParent extends true
    ? TypedDocumentNode<
        ParentConnectionsHasInvalidCredsQuery,
        Exact<{ companyID: Scalars["ID"] }>
      >
    : TypedDocumentNode<
        ConnectionsHasInvalidCredsQuery,
        Exact<{ companyID: Scalars["ID"] }>
      > {
    if (isParent) {
      return graphql(`
        query ParentConnectionsHasInvalidCreds($companyID: ID!) {
          parentCompanyConnectionsHasInvalidCreds(companyID: $companyID)
        }
      `);
    }
    return graphql(`
      query ConnectionsHasInvalidCreds($companyID: ID!) {
        connectionsHasInvalidCreds(companyID: $companyID)
      }
    `);
  }

  export function deleteConnectionMutation() {
    return graphql(`
      mutation DeleteConnection($connectionID: ID!) {
        deleteConnection(connectionID: $connectionID)
      }
    `);
  }

  export const handlers = [getAggregationListMock()];
}
