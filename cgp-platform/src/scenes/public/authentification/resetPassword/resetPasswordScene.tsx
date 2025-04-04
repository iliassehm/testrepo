import { createRoute } from "@tanstack/react-router";

import { ResetPassword } from "./resetPassword";
import { authRoute } from "../route";

export const resetPasswordRoute = createRoute({
  path: "/reset-password",
  component: ResetPassword,
  getParentRoute: () => authRoute,
});
