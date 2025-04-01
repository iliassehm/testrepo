import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { companyCustomerRootRoute } from "../route";
import { CompanyCustomersInformations } from "./informations";

type Source = "customer_creation";

const schema = z.object({
  tab: z.string().optional().default("general"),
  source: z.literal<Source>("customer_creation").optional(),
});
export const companyCustomersInformationsRoute = createRoute({
  path: "/informations",
  component: CompanyCustomersInformations,
  getParentRoute: () => companyCustomerRootRoute,
  validateSearch: (search) => schema.parse(search),
});
