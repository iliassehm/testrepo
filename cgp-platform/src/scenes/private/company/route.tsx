import { createRoute, Outlet, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { CompanyLayout } from "../../../components/layout";
import MaintenanceAlert from "../../../components/MaintenanceAlert/MaintenanceAlert";
import { rangeForPeriod, unPick } from "../../../helpers";
import { GlobalSearchParams, NotificationType, Period } from "../../../types";
import { rootRoute } from "../../routing/mainRoute";
import { Route as companyAccountingRoute } from "./accounting/route";
import { companycampaignsRoute } from "./campaigns/route";
import { Route as companyComplianceRoute } from "./compliance/route";
import {
  Route as companyCustomersRoute,
  customerAddRoute,
  customerEditRoute,
} from "./customers/route";
import { Route as globalWealthRoute } from "./globalWealth/route";
import { CompanyHome } from "./home/home";
import { Notifications } from "./notifications/notifications";
import { Route as companySettingsRoute } from "./settings/route";
import {
  CompanyTaskFilter,
  companyTaskFilterSchema,
  defaultFilters,
  Tasks,
} from "./tasks/tasks";

export function globalSearchParams(
  arg: Record<string, unknown>
): GlobalSearchParams {
  const period = (arg.period as Period) ?? Period.weekly;

  return {
    period,
    range: rangeForPeriod(period),
    invitation: (arg.invitation as string) || "",
  };
}
export const companyRoot = createRoute({
  path: "company/$companyId",
  getParentRoute: () => rootRoute,
  component: () => {
    return (
      <div className="flex flex-col h-screen">
        <CompanyLayout />
        <div className="flex-1 bg-grey-300 p-6 md:p-12">
          <MaintenanceAlert />
          <div className="lg:pl-65 h-full">
            <Outlet />
          </div>
        </div>
      </div>
    );
  },
  validateSearch: (arg) => globalSearchParams(arg),
  beforeLoad: ({ context, params }) => {
    const existingCompany = context.authenticated?.manager?.companyList?.find(
      (company) => company!.id === params.companyId
    );

    if (
      params.companyId === context.authenticated?.manager?.parentCompany?.id
    ) {
      throw redirect({
        to: "/parent-company/$companyId",
        params: {
          companyId: context.authenticated.manager.parentCompany.id,
        },
      });
    }

    if (!existingCompany) {
      throw redirect({
        to: "/",
      });
    }

    if (!context.authenticated?.id) {
      throw redirect({
        to: "/auth/login",
      });
    }
  },
});

export const companyIndexRoute = createRoute({
  path: "/",
  component: CompanyHome,
  getParentRoute: () => companyRoot,
});

export const companyNotificationsRoute = createRoute({
  path: "/notifications",
  component: Notifications,
  getParentRoute: () => companyRoot,
  validateSearch: (arg) =>
    z
      .object({
        type: z.nativeEnum(NotificationType).optional(),
        id: z.string().optional(),
      })
      .parse(arg),
});

export const companyTasksRoute = createRoute({
  path: "/tasks",
  component: Tasks,
  getParentRoute: () => companyRoot,
  validateSearch: (arg) => {
    const parsing = companyTaskFilterSchema
      .extend({
        type: z.string().optional(),
      })
      .transform(
        (data) =>
          unPick({ ...data, category: data.category ?? data.type }, [
            "type",
          ]) as CompanyTaskFilter
      )
      .safeParse(arg);

    if (!parsing.success) {
      return defaultFilters;
    }

    return parsing.data;
  },
});

export const Route = companyRoot.addChildren([
  customerAddRoute,
  customerEditRoute,
  companyIndexRoute,
  globalWealthRoute,
  companySettingsRoute,
  companycampaignsRoute,
  companyComplianceRoute,
  companyCustomersRoute,
  companyNotificationsRoute,
  companyTasksRoute,
  companyAccountingRoute,
]);
