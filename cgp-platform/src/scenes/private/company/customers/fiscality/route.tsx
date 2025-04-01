import { createRoute } from "@tanstack/react-router";

import { companyCustomerRootRoute } from "../route";
import { CompanyCustomersFiscality } from "./fiscality";

export const companyCustomersFiscalityRoute = createRoute({
  path: "/fiscality",
  component: CompanyCustomersFiscality,
  getParentRoute: () => companyCustomerRootRoute,
});
