import { createRoute, Outlet } from "@tanstack/react-router";

import { companyCustomerRootRoute } from "../route";
import Charges from "./charges";
import Client from "./client";
import Finance from "./finance";
import Income from "./income/index";
import Navbar from "./Navbar";
import Wealth from "./wealth";

const kycRootRoute = createRoute({
  path: "/kyc",
  component: () => (
    <div className="flex flex-col gap-y-5 overflow-hidden">
      <Navbar />
      <div className="overflow-auto">
        <Outlet />
      </div>
    </div>
  ),
  getParentRoute: () => companyCustomerRootRoute,
});

const kycClientRoute = createRoute({
  path: "/",
  component: () => <Client />,
  getParentRoute: () => kycRootRoute,
});

const kycIncomeRoute = createRoute({
  path: "/income",
  component: () => <Income />,
  getParentRoute: () => kycRootRoute,
});

const kycExpenseRoute = createRoute({
  path: "/expense",
  component: () => <Charges />,
  getParentRoute: () => kycRootRoute,
});

const kycWealthRoute = createRoute({
  path: "/wealth",
  component: () => <Wealth />,
  getParentRoute: () => kycRootRoute,
});

const kycFinanceRoute = createRoute({
  path: "/finance",
  component: () => <Finance />,
  getParentRoute: () => kycRootRoute,
});

export const companyCustomersKycRoute = kycRootRoute.addChildren([
  kycClientRoute,
  kycIncomeRoute,
  kycExpenseRoute,
  kycWealthRoute,
  kycFinanceRoute,
]);
