import { useNavigate, useParams } from "@tanstack/react-router";
import { t } from "i18next";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";

import { ConnectorList } from "../../../../../components/ConnectorList";
import { Widget } from "../../../../../components/Widget";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import {
  ConnectorProvider,
  SynchronizePowensConnectorMutationVariables,
} from "../../../../../types";
import { GlobalAddWealthLogic } from "../AddWealth.logic";
import { companyAutomaticCredentialsRoute } from "../route";

export function AutomaticAdd() {
  // States
  const [searchText, setSearchText] = useState("");

  // Hooks
  const toast = useToast();
  const params = useParams({
    from: "/company/$companyId/global-wealth/add-under-management/automatic-wealth",
  });
  const navigate = useNavigate();
  const connectorListQuery = useQuery(
    "connectorList",
    () => gql.client.request(GlobalAddWealthLogic.connectorListQuery()),
    {
      select: (data) => {
        data.connectorList?.sort((a, b) => a.name.localeCompare(b.name));
        return data;
      },
    }
  );

  const synchronizePowensConnectorMutation = useMutation(
    "synchronizePowensConnectorMutation",
    (params: SynchronizePowensConnectorMutationVariables) =>
      gql.client.request(
        GlobalAddWealthLogic.synchronizePowensConnectorMutation(),
        params
      ),
    {
      onSuccess: (data) => {
        window.location.href = data.synchronizePowensConnector;
      },
      onError: () => {
        toast?.current?.show({
          severity: "error",
          summary: "Error",
          detail: t("forms.fields.notifications.error.send"),
        });
      },
    }
  );

  if (connectorListQuery.isLoading) return <Loading />;

  return (
    <Widget
      title="scenes.wealthConnection.add.chooseBank"
      rightElement={
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Rechercher un partenaire"
          />
        </span>
      }
      className="max-w-4xl mx-auto"
    >
      <ConnectorList
        list={connectorListQuery.data?.connectorList || []}
        searchText={searchText}
        onClick={(connector) => {
          if (connector.provider === ConnectorProvider.Powens)
            synchronizePowensConnectorMutation.mutate({
              companyID: params.companyId as string,
              connectorID: connector.key,
            });
          else
            navigate({
              to: companyAutomaticCredentialsRoute.fullPath,
              params: { ...params, bank: connector.key },
            });
        }}
      />
    </Widget>
  );
}

function Loading() {
  return (
    <div>
      <div className="w-full h-screen">
        <Skeleton height="20%" className="mb-2 rounded-3xl"></Skeleton>
      </div>
    </div>
  );
}
