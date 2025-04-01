import {
  createRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { z } from "zod";

import { ConnectionState } from "../../../../types";
import { companyGlobalWealthRoute } from "../globalWealth/route";
import { AddWealth } from "./AddWealth";
import { AutomaticConfirmation } from "./automaticConfirmation";
import { AutomaticVerification } from "./automaticVerification";
import { AutomaticAdd } from "./automaticWealth";
import { CredentialsComponent } from "./automaticCredentials/AutomaticCredentials";

export const companyGlobalUpdateRootRoute = createRoute({
  path: "update",
  getParentRoute: () => companyGlobalWealthRoute,
});

export const companyAutomaticCredentialsUpdateRoute = createRoute({
  path: "$bank/$connectionId/$identifier",
  component: () => {
    const params = companyAutomaticCredentialsUpdateRoute.useParams();

    const navigate = useNavigate({
      from: "/",
    });

    return (
      <CredentialsComponent
        companyId={params.companyId}
        connectorId={params.bank}
        mode="update"
        connectionId={params.connectionId}
        identifier={params.identifier}
        onSuccess={(data) => {
          if (
            data.changeConnectionCredentials?.connection.state ===
            ConnectionState.RequireOtp
          ) {
            navigate({
              to: "/company/$companyId/global-wealth/add-under-management/$bank/automatic-verification",
              params,
              search: {
                connectionID: data.changeConnectionCredentials.connection.id,
                synchronizationID:
                  data.changeConnectionCredentials.synchronization.id,
              },
            });
            return;
          }

          navigate({
            to: "/company/$companyId/global-wealth/add-under-management/confirmation",
            params,
          });
        }}
      />
    );
  },
  getParentRoute: () => companyGlobalUpdateRootRoute,
});

export const UpdateRoute = companyGlobalUpdateRootRoute.addChildren([
  companyAutomaticCredentialsUpdateRoute,
]);

export const companyGlobalAddWealthRootRoute = createRoute({
  path: "add-under-management",
  getParentRoute: () => companyGlobalWealthRoute,
});

export const companyGlobalAddWealthRoute = createRoute({
  path: "/",
  component: AddWealth,
  getParentRoute: () => companyGlobalAddWealthRootRoute,
});

export const companyGlobalAddAutomaticRoute = createRoute({
  path: "automatic-wealth",
  component: AutomaticAdd,
  getParentRoute: () => companyGlobalAddWealthRootRoute,
});

export const companyAutomaticCredentialsRoute = createRoute({
  path: "$bank",
  component: () => {
    const params = useParams({
      from: "/company/$companyId/global-wealth/add-under-management/$bank",
    });

    const navigate = useNavigate({
      from: "/company/$companyId/global-wealth/add-under-management/$bank",
    });

    return (
      <CredentialsComponent
        companyId={params.companyId}
        connectorId={params.bank}
        mode="add"
        onSuccess={(data) => {
          if (
            data.synchronizeConnector?.connection.state ===
            ConnectionState.RequireOtp
          ) {
            navigate({
              to: "/company/$companyId/global-wealth/add-under-management/$bank/automatic-verification",
              params,
              search: {
                connectionID: data.synchronizeConnector.connection.id,
                synchronizationID: data.synchronizeConnector.synchronization.id,
              },
            });
            return;
          }

          navigate({
            to: "/company/$companyId/global-wealth/add-under-management/confirmation",
            params,
          });
        }}
      />
    );
  },
  getParentRoute: () => companyGlobalAddWealthRootRoute,
});

export const companyAutomaticVerificationRoute = createRoute({
  path: "$bank/automatic-verification",
  component: () => {
    const params = companyAutomaticVerificationRoute.useParams();

    const search = companyAutomaticVerificationRoute.useSearch();

    const navigate = useNavigate({
      from: "/company/$companyId/global-wealth/add-under-management/$bank/automatic-verification",
    });

    return (
      <AutomaticVerification
        connectionId={search.connectionID}
        synchronizationId={search.synchronizationID}
        connectorId={params.bank}
        onSuccess={() =>
          navigate({
            to: "/company/$companyId/global-wealth/add-under-management/confirmation",
          })
        }
      />
    );
  },
  getParentRoute: () => companyGlobalAddWealthRootRoute,
  validateSearch: (search) => {
    return z
      .object({
        connectionID: z.string(),
        synchronizationID: z.string(),
      })
      .parse(search);
  },
});

export const companyAutomaticConfirmationRoute = createRoute({
  path: "confirmation",
  component: AutomaticConfirmation,
  getParentRoute: () => companyGlobalAddWealthRootRoute,
});

export const Route = companyGlobalAddWealthRootRoute.addChildren([
  companyAutomaticCredentialsUpdateRoute,
  companyGlobalAddWealthRoute,
  companyGlobalAddAutomaticRoute,
  companyAutomaticCredentialsRoute,
  companyAutomaticVerificationRoute,
  companyAutomaticConfirmationRoute,
]);
