import { createRoute } from "@tanstack/react-router";

import { paginationLimit } from "../../../../constants";
import {
  AssetSortBy,
  SortDirection,
  WealthFilter,
  WealthFilteredSearch,
} from "../../../../types";
import {
  Route as companyGlobalAddWealthRoot,
  UpdateRoute,
} from "../addWealth/route";
import { companyRoot } from "../route";
import { GlobalWealth } from "./globalWealth";
import { AssetTypeWealth } from "./subWealth/assetTypeWealth/assetTypeWealth";
import { SubWealth } from "./subWealth/subWealth";

export const companyGlobalWealthRoute = createRoute({
  path: "global-wealth",
  getParentRoute: () => companyRoot,
  validateSearch: (search: Record<string, unknown>): WealthFilteredSearch => {
    return {
      wealthFilter:
        search.wealthFilter === WealthFilter.UnderManagements
          ? WealthFilter.UnderManagements
          : WealthFilter.Customers,
    };
  },
});

export const companydGlobalWealthIndexRoute = createRoute({
  path: "/",
  component: GlobalWealth,
  getParentRoute: () => companyGlobalWealthRoute,
});

export const companydGlobalWealthSubRootRoute = createRoute({
  path: "sub",
  getParentRoute: () => companyGlobalWealthRoute,
});
export const companyGlobalSubWealthRoute = createRoute({
  path: "/",
  component: SubWealth,
  getParentRoute: () => companydGlobalWealthSubRootRoute,
});

export function getAssetTypeWealthSearchParams(arg: Record<string, unknown>) {
  return {
    file: arg.file || "",
    skip: Number(arg.skip) || 0,
    page: Number(arg.page) || 0,
    search: (arg.search as string) || "",
    sortBy: (arg.sortBy as AssetSortBy) || "",
    sortDirection: (arg.sortDirection as SortDirection) || "",
    assigner: !!arg.assigner,
    limit: Number(arg.limit) || paginationLimit,
  };
}
export const companyAssetTypeWealthRoute = createRoute({
  path: "$type",
  component: AssetTypeWealth,
  validateSearch: getAssetTypeWealthSearchParams,
  getParentRoute: () => companydGlobalWealthSubRootRoute,
});

export const Route = companyGlobalWealthRoute.addChildren([
  companydGlobalWealthIndexRoute,
  companyGlobalAddWealthRoot,
  UpdateRoute,
  companydGlobalWealthSubRootRoute.addChildren([
    companyGlobalSubWealthRoute,
    companyAssetTypeWealthRoute,
  ]),
]);
