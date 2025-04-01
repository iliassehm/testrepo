import { createRoute } from "@tanstack/react-router";

import {
  CustomerAsset,
  Period,
  Range,
  WealthFilter,
} from "../../../../../types";
import { companyCustomerRootRoute } from "../route";
import { InstrumentDetail } from "./InstrumentDetails/InstrumentDetail";
import { WalletInvestment } from "./WalletTab/walletInvestment";
import { CompanyCustomersWealth } from "./wealth";

export interface CustomerWealthAssetSearch {
  assetID?: CustomerAsset["id"];
  assetOwnershipID?: CustomerAsset["id"];
  wealthFilter?: WealthFilter;
  period?: Period;
  range?: Range;
}

export const CustomersWealthTab = {
  global_wealth: "global_wealth",
  wallet: "wallet",
};

export const companyCustomersWealthRootRoute = createRoute({
  path: "/wealth",
  getParentRoute: () => companyCustomerRootRoute,
  validateSearch: (
    search: Record<string, unknown>
  ): CustomerWealthAssetSearch => ({
    assetID: search["assetID"] ? String(search["assetID"]) : undefined,
    assetOwnershipID: search["assetOwnershipID"]
      ? String(search["assetOwnershipID"])
      : undefined,
    wealthFilter: search["wealthFilter"]
      ? (search["wealthFilter"] as WealthFilter)
      : undefined,
  }),
});

export const companyCustomersWealthIndexRoute = createRoute({
  path: "/",
  component: CompanyCustomersWealth,
  getParentRoute: () => companyCustomersWealthRootRoute,
});

export const companyCustomersWalletInvestmentRoute = createRoute({
  path: "$type/$investmentId",
  component: WalletInvestment,
  getParentRoute: () => companyCustomersWealthRootRoute,
});

export const instrumentDetailRoute = createRoute({
  path: "instrument/$instrumentCode",
  component: InstrumentDetail,
  getParentRoute: () => companyCustomersWealthRootRoute,
});

export const Route = companyCustomersWealthRootRoute.addChildren([
  companyCustomersWealthIndexRoute,
  companyCustomersWalletInvestmentRoute,
  instrumentDetailRoute,
]);
