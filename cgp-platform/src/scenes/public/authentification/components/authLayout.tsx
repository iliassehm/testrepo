import { Link } from "@tanstack/react-router";

import { LinkPropsWithLabel, Text } from "../../../../components";
import { ChangeLanguage } from "../../../../components/ChangeLanguage";
import { loginScene, registerRoute } from "../route";

type RedirectTo = "register" | "login";

interface AuthLayoutProps {
  title?: string;
  redirectTo?: RedirectTo;
  children: React.ReactNode;
}

export function AuthLayout({ title, redirectTo, children }: AuthLayoutProps) {
  // Keep this definition in the component to avoid circular dependencies
  const redirectToMap: Record<
    RedirectTo,
    Pick<LinkPropsWithLabel, "to" | "label">
  > = {
    register: {
      label: "scenes.authentification.orRegister",
      to: registerRoute.id,
    },
    login: {
      label: "scenes.authentification.orLogin",
      to: loginScene.id,
    },
  };

  return (
    <div className="flex h-screen items-center justify-center bg-grey-300">
      <div className="fixed right-1 top-1 shadow-md">
        <ChangeLanguage />
      </div>
      <div className="fixed left-0 top-0 hidden h-full items-center justify-center bg-blue-1000 lg:flex lg:w-1/2">
        <img src="/svg/logo_dark.svg" alt="Welcome to Wealthcome" />
      </div>
      <div className="ml-auto flex w-full flex-col items-center justify-center gap-y-8 py-4 lg:w-1/2">
        <div>
          <Link to={loginScene.id}>
            <img
              className="mx-auto w-[200px]"
              src="/svg/logo_light.svg"
              alt="wealthcome"
            />
          </Link>
          {title && (
            <Text
              as="h2"
              label={title}
              className="mt-6 text-center font-bold text-3xl text-blue-800"
            />
          )}
          {/* User should not be able to register. Hide register button on login page */}
          {redirectTo && redirectTo === "login" && (
            <Text
              {...redirectToMap[redirectTo]}
              className="mt-9 inline-block rounded-[5px] bg-zinc-300 px-9 py-1 text-center text-[10px] text-slate-900 text-opacity-70 hover:bg-zinc-200 hover:no-underline"
            />
          )}
        </div>
        <div className="w-2/3 max-w-md  rounded-xl bg-white p-8 shadow">
          {children}
        </div>
      </div>
    </div>
  );
}
