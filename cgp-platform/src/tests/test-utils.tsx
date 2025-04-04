import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { render, type RenderOptions } from "@testing-library/react";
import type { Toast } from "primereact/toast";
import { useRef } from "react";
import type { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { ToastContext } from "../hooks/useToast";

const queryClient = new QueryClient();

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const toast = useRef<Toast>(null);
  const rootRoute = createRootRoute({
    component: Outlet,
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => children,
  });

  const routerTree = rootRoute.addChildren([indexRoute]);
  const router = createRouter({ routeTree: routerTree });

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContext.Provider value={toast}>
        <RouterProvider router={router} />
      </ToastContext.Provider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
