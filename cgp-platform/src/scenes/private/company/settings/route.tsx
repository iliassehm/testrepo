import { createRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";

import { DocumentTemplates } from "../../../../components/Settings/documentTemplates/documentTemplate";
import Integrations from "../../../../components/Settings/integrations/integrations";
import { CompanyMigration } from "../../../../components/Settings/migrations/migration";
import { CompanyMigrator } from "../../../../components/Settings/migrations/migration.$migrator";
import { CompanySettingsTabs } from "../../../../components/Settings/office";
import { SettingsLayout } from "../../../../components/Settings/settings.layout";
import { companyRoot } from "../route";

export const companySetttingsRoot = createRoute({
  path: "settings",
  getParentRoute: () => companyRoot,
  component: () => (
    <div className="flex max-w-8xl flex-col gap-y-5 overflow-hidden h-full">
      <SettingsLayout isParent={false} />

      <div className="overflow-auto h-full">
        <Outlet />
      </div>
    </div>
  ),
});

export const companyOfficeRoute = createRoute({
  path: "/",
  component: () => {
    return <CompanySettingsTabs isParent={false} />;
  },
  getParentRoute: () => companySetttingsRoot,
  validateSearch: (arg) =>
    z
      .object({
        companySettingsTab: z
          .enum([
            "general",
            "legal",
            "intermediation",
            "administration",
            "teams",
          ])
          .optional(),
        companySettingsAdministrationTab: z
          .enum(["product", "aggregation"])
          .optional(),
        team: z.string().optional(),
      })
      .parse(arg),
});

// Document Templates
export const DocumentTemplateRoute = createRoute({
  path: "/documentModels",
  component: () => {
    return <DocumentTemplates isParent={false} />;
  },
  getParentRoute: () => companySetttingsRoot,
});

// Migrations
export const companyMigrationRoot = createRoute({
  path: "/migration",
  getParentRoute: () => companySetttingsRoot,
});

export const companyMigrationRoute = createRoute({
  path: "/",
  component: () => {
    return <CompanyMigration isParent={false} />;
  },
  getParentRoute: () => companyMigrationRoot,
});

export const companyMigrationIdRoute = createRoute({
  path: "/$migrator",
  component: () => {
    return <CompanyMigrator isParent={false} />;
  },
  getParentRoute: () => companyMigrationRoot,
});

// Integration
export const companyIntegrationRoot = createRoute({
  path: "/integration",
  getParentRoute: () => companySetttingsRoot,
});

export const companyIntegrationsListRoute = createRoute({
  path: "/",
  component: () => {
    return <Integrations isParent={false} />;
  },
  getParentRoute: () => companyIntegrationRoot,
});

export const companyIntegrationDetailsRoute = createRoute({
  path: "/$integrationId",
  component: () => {
    return <Integrations isParent={false} />;
  },
  getParentRoute: () => companyIntegrationRoot,
});

export const Route = companySetttingsRoot.addChildren([
  companyOfficeRoute,
  companyMigrationRoot.addChildren([
    companyMigrationRoute,
    companyMigrationIdRoute,
  ]),
  DocumentTemplateRoute,
  companyIntegrationRoot.addChildren([
    companyIntegrationsListRoute,
    companyIntegrationDetailsRoute,
  ]),
]);
