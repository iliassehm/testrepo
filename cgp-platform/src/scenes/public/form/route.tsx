import { createRoute } from "@tanstack/react-router";

import { PublicInvestorProfile } from "./investorProfile";
import { rootRoute } from "../../routing/mainRoute";
import { PublicGoalsForm } from "./goals";
import { ExternalInvestorProfileForm } from "./ExternalInvestorProfileForm";

const formRootRoute = createRoute({
  path: "/forms",
  getParentRoute: () => rootRoute,
});

export const publicCustomerInvestorProfileFormScene = createRoute({
  path: "/profile-invest/$managementId",
  component: PublicInvestorProfile,
  getParentRoute: () => formRootRoute,
  validateSearch: (search: Record<string, unknown>): { token: string } => ({
    token: search.token as string,
  }),
});

export const publicCustomerExternalInvestorProfileFormFormScene = createRoute({
  path: "/external-profile-invest/$customerId",
  component: ExternalInvestorProfileForm,
  getParentRoute: () => formRootRoute,
});

export const publicGoalsFormScene = createRoute({
  path: "/goals/$managementId",
  component: PublicGoalsForm,
  getParentRoute: () => formRootRoute,
  validateSearch: (search: Record<string, unknown>): { token: string } => ({
    token: search.token as string,
  }),
});



export const Route =  formRootRoute.addChildren(
  [publicCustomerInvestorProfileFormScene, publicCustomerExternalInvestorProfileFormFormScene, publicGoalsFormScene]
)