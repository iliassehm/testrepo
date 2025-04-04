import { createRoute } from "@tanstack/react-router";

import { companyRoot } from "../route";
import { Accounting } from "./accounting";

export const companyAccountingRoot = createRoute({
  getParentRoute: () => companyRoot,
  path: "/company-accounting",
});

export const companyAccountingRoute = createRoute({
  getParentRoute: () => companyAccountingRoot,
  path: "/",
  component: Accounting,
});

export const Route = companyAccountingRoot.addChildren([
  companyAccountingRoute,
]);
