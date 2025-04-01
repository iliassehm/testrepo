import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { companyCustomerRootRoute } from "../route";
import { CompanyCustomersConformity } from "./conformity";

// Add search with zod
const validateSearch = z.object({
  tab: z.string().optional().default("ged"),
  documentId: z.string().optional(),
  category: z.string().optional(),
  envelopeId: z.string().optional(),
  envelopeDocumentId: z.string().optional(),
});

export const companyCustomersConformityRoute = createRoute({
  path: "/conformity",
  component: CompanyCustomersConformity,
  getParentRoute: () => companyCustomerRootRoute,
  validateSearch: validateSearch,
});
