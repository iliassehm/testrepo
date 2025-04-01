import { createRoute } from "@tanstack/react-router";

import { companyRoot } from "../route";
import { CompanyCategoryCompliance } from "./categoryCompliance/categoryCompliance";
import { CompanyCompliance } from "./compliance";

export const companyComplianceRoot = createRoute({
  getParentRoute: () => companyRoot,
  path: "/company-compliance",
});

export const companyComplianceRoute = createRoute({
  getParentRoute: () => companyComplianceRoot,
  path: "/",
  component: CompanyCompliance,
});

export const categoryComplianceRoute = createRoute({
  path: "/$category",
  component: CompanyCategoryCompliance,
  getParentRoute: () => companyComplianceRoot,
});

export const Route = companyComplianceRoot.addChildren([
  companyComplianceRoute,
  categoryComplianceRoute,
]);
