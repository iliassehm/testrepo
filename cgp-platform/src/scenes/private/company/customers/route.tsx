import { createRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";

import { CustomerLayout } from "../../../../components/layout";
import { paginationLimit, treatementList } from "../../../../constants";
import {
  CustomersInput,
  CustomerSortBy,
  Range,
  SortDirection,
  Treatement,
} from "../../../../types";
import { AddWealth } from "../addWealth/AddWealth";
import { companyRoot } from "../route";
import { companyCustomersBudgetRoute } from "./budget/route";
import { companyCustomersConformityRoute } from "./conformity/route";
import CustomerContextProvider from "./customerContext";
import { CompanyCustomers } from "./customers";
import { companyCustomersFiscalityRoute } from "./fiscality/route";
import { CompanyCustomersHome } from "./home/home";
import { companyCustomersInformationsRoute } from "./informations/route";
import { companyCustomersKycRoute } from "./kyc/route";
import { Route as companyCustomerProjectRoute } from "./project/route";
import {
  companyCustomersSearch,
  companyCustomersSearchResult,
} from "./search/route";
import { Route as companyCustomersWealthRoute } from "./wealth/route";

export function getCustomersSearchParams(arg: Record<string, unknown>) {
  return {
    wealth: (arg.wealth as Range) || {},
    limit: Number(arg.limit) || paginationLimit,
    skip: Number(arg.skip) || 0,
    page: Number(arg.page) || 0,
    sortBy: (arg.sortBy as CustomerSortBy) || "",
    search: (arg.search as string) || "",
    sortDirection: (arg.sortDirection as SortDirection) || "",
    conformity: (arg.conformity as Treatement[]) || treatementList,
  };
}

// Customers
export const companyCustomersRootRoute = createRoute({
  path: "/customers",
  validateSearch: (arg): CustomersInput => getCustomersSearchParams(arg),
  getParentRoute: () => companyRoot,
});
export const companyCustomersIndexRoute = createRoute({
  path: "/",
  component: () => (
    <>
      <CompanyCustomers />
      <Outlet />
    </>
  ),
  getParentRoute: () => companyCustomersRootRoute,
});

// Customer
export const companyCustomerRootRoute = createRoute({
  path: "customer/$customerId",
  component: () => (
    <CustomerContextProvider>
      <div className="flex flex-col gap-y-5 overflow-hidden">
        <CustomerLayout />

        <div className="overflow-auto mt-5">
          <Outlet />
        </div>
      </div>
    </CustomerContextProvider>
  ),
  getParentRoute: () => companyRoot,
});

export const customerAddRoute = createRoute({
  path: "customer/$customerId/add",
  component: AddWealth,
  getParentRoute: () => companyRoot,
  validateSearch: z.object({
    assetType: z.string().optional(),
    isUnderManagement: z.boolean().optional(),
    form: z.unknown().optional(),
  }),
});

export const customerEditRoute = createRoute({
  path: "customer/$customerId/edit/$assetId",
  component: AddWealth,
  getParentRoute: () => companyRoot,
  validateSearch: z.object({
    assetType: z.string().optional(),
    isUnderManagement: z.boolean().optional(),
    form: z.unknown().optional(),
  }),
});

export const customerHomeRoute = createRoute({
  path: "/",
  component: CompanyCustomersHome,
  getParentRoute: () => companyCustomerRootRoute,
});

export const Route = companyCustomersRootRoute.addChildren([
  companyCustomersSearchResult,
  companyCustomersIndexRoute.addChildren([companyCustomersSearch]),
  companyCustomerRootRoute.addChildren([
    customerHomeRoute,
    companyCustomersWealthRoute,
    companyCustomersBudgetRoute,
    companyCustomerProjectRoute,
    companyCustomersFiscalityRoute,
    companyCustomersConformityRoute,
    companyCustomersInformationsRoute,
    companyCustomersKycRoute,
  ]),
]);
