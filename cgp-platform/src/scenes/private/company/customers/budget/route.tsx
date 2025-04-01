import { createRoute } from "@tanstack/react-router";

import { companyCustomerRootRoute } from "../route";
import { CompanyCustomersBudget } from "./budget";

export const companyCustomersBudgetRoute = createRoute({
  path: "/budget",
  component: CompanyCustomersBudget,
  getParentRoute: () => companyCustomerRootRoute,
});
