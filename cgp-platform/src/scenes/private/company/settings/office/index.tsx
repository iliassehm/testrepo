import { useNavigate, useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "react-query";

import { CompanyAdministrationOffice } from "../../../../../components/Settings/office/administrationOffice";
import { CompanyGeneralOffice } from "../../../../../components/Settings/office/generalOffice";
import { CompanyIntermediationOffice } from "../../../../../components/Settings/office/intermediationOffice";
import { CompanyLegalOffice } from "../../../../../components/Settings/office/legalOffice";
import { WorkforceTab } from "../../../../../components/Settings/office/workforce/WorkforceTab";
import { Tab, Tabs } from "../../../../../components/Tabs";
import { useCurrentRoute } from "../../../../../hooks/useCurrentRoute";
import { gql } from "../../../../../service/client";
import { CompanyAggregationLogic } from "./administrationOffice/aggregation/aggregation.logic";

export type CompanySettingsFormProps = {
  data: Record<string, string>;
  onSubmit: (data: Record<string, string>) => void;
};
export function CompanySettingsTabs({ isParent }: { isParent: boolean }) {
  const route = useCurrentRoute();
  const queryClient = useQueryClient();
  const currentRouteId = route.routeId;
  const { companyId } = useParams({
    from: currentRouteId as never,
  });
  const navigate = useNavigate({
    from: currentRouteId,
  });
  const search =
    (route.search as {
      companySettingsTab?: string;
      companySettingsAdministrationTab?: string;
    }) ?? {};

  // Callback
  const onChange = (tab: Tab["id"]) => {
    navigate({
      to: currentRouteId,
      search: {
        companySettingsTab: tab,
      },
    });

    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === "company" && query.queryKey[1] === companyId,
    });
  };

  const query = useQuery({
    queryKey: ["connectionsHasInvalidCreds", companyId],
    queryFn: () =>
      gql.client.request(
        CompanyAggregationLogic.connectionsHasInvalidCreds(isParent),
        {
          companyID: companyId,
        }
      ),
  });

  const tabs = [
    {
      id: "general",
      label: "scenes.company.settings.tabs.general",
      component: <CompanyGeneralOffice isParent={isParent} />,
    },
    {
      id: "legal",
      label: "scenes.company.settings.tabs.legal",
      component: <CompanyLegalOffice isParent={isParent} />,
    },
    {
      id: "intermediation",
      label: "scenes.company.settings.tabs.intermediation",
      component: <CompanyIntermediationOffice isParent={isParent} />,
    },
    {
      id: "administration",
      label: "scenes.company.settings.tabs.administration",
      component: (
        <CompanyAdministrationOffice
          warning={query.data?.connectionsHasInvalidCreds ? true : false}
          defaultTab={search.companySettingsAdministrationTab}
        />
      ),
      warning: query.data?.connectionsHasInvalidCreds ? true : false,
    },
  ];

  if (currentRouteId === "/company/$companyId/settings/") {
    tabs.push({
      id: "teams",
      label: "scenes.company.settings.tabs.workforce",
      component: <WorkforceTab isParent={isParent} />,
    });
  }

  return (
    <div>
      <div className="relative flex w-full bg-white rounded-[10px] shadow">
        <Tabs
          panelClassname="px-6 mt-10"
          containerClassname="w-full"
          tabs={tabs}
          defaultTab={search.companySettingsTab ?? "general"}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
