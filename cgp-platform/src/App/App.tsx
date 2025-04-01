import { FaroErrorBoundary } from "@grafana/faro-react";
import { RouterProvider } from "@tanstack/react-router";
import "primeicons/primeicons.css";
//icons
import "primereact/resources/primereact.min.css";
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useQuery } from "react-query";

import { ToastContext } from "../hooks/useToast";
import "../i18n";
import "../index.css";
import "../monitoring/faro";
import { router } from "../scenes/routing/router";
import { gql } from "../service/client";
import { AppLogic } from "./App.logic";

function App() {
  const authenticatedQuery = useQuery(
    "authenticated",
    () => gql.client.request(AppLogic.authenticatedQuery()),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const toast = useRef<Toast>(null);

  if (authenticatedQuery.isLoading) return <CompanyLayoutLoading />;

  return (
    <FaroErrorBoundary>
      <div className="App">
        <Toast ref={toast} />
        <ToastContext.Provider value={toast}>
          <RouterProvider
            router={router}
            context={{ authenticated: authenticatedQuery.data?.authenticated }}
          />
        </ToastContext.Provider>
      </div>
    </FaroErrorBoundary>
  );
}

export function CompanyLayoutLoading() {
  return (
    <div className="relative h-auto bg-grey-300 p-6 md:p-12">
      <Skeleton
        width="100%"
        height="112px"
        className="absolute left-0 top-0 rounded-b-2xl"
      />
      <Skeleton
        width="262px"
        className="hidden fixed !h-screen left-0 top-0 rounded-b-2xl lg:block"
      />
    </div>
  );
}

export default App;
