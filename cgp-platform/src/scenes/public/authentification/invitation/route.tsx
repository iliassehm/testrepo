import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Invitation } from "./invitation";
import { authRoute } from "../route";

export const getCustomersSearchParams = z.object({
  email: z.string().default(""),
  owner: z.boolean().default(false),
  sign_up: z.boolean().default(false),
  company_name: z.string().default(""),
});

export const invitationRoute = createRoute({
    path: "/invitation/$companyId/$invitationId",
    component: Invitation,
    validateSearch: getCustomersSearchParams.parse,
    getParentRoute: () => authRoute,
  });
