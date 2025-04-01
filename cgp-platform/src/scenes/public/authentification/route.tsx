import { createRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { resetPasswordScene } from "./resetPassword";
import { LoginPage } from "./login/Login";
import { RegisterPage } from "./register/Register";
import { RegisterConfirmation } from "./registerConfirmation/registerConfirmation";
import { invitationRoute } from "./invitation/route";
import { rootRoute } from "../../routing/mainRoute";

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  beforeLoad: ({ context }) => {
    const authenticated = context.authenticated?.manager;

    // if not authenticated, redirect to login
    if (authenticated) {
      throw redirect({
        to: "/",
      });
    }
  }
});

export const registerRoute = createRoute({
  path: "/register",
  component: RegisterPage,
  getParentRoute: () => authRoute,
});

export const registerConfirmationScene = createRoute({
  path: "/register-confirmation",
  component: RegisterConfirmation,
  getParentRoute: () => authRoute,
});

const productSearchSchema = z.object({
  callbackUrl: z.string().catch("").optional(),
});
export const loginScene = createRoute({
  path: "/login",
  component: LoginPage,
  validateSearch: (search) => productSearchSchema.parse(search),
  getParentRoute: () => authRoute,
});

export const Route = authRoute.addChildren([
    loginScene,
    invitationRoute,
    resetPasswordScene,
    registerRoute,
    registerConfirmationScene,
  ])