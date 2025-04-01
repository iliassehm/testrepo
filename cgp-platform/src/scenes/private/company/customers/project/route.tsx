import { createRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";

import { Button } from "../../../../../components";
import { ProjectType } from "../../../../../types";
import { companyCustomerRootRoute } from "../route";
import { CompanyCustomersProjectAdd } from "./addProject/addProject";
import { CompanyCustomersProject } from "./project";
import { CompanyCustomersProjectUpdate } from "./updateProject/updateProject";

const projectUpdateSchema = z.object({
  contractID: z.string().optional(),
  type: z.nativeEnum(ProjectType),
});

const projectAddSearchSchema = z
  .object({
    name: z.string().min(1),
    type: z.union([
      z.literal(ProjectType.SubscriptionCif),
      z.literal(ProjectType.SubscriptionLifeInsurance),
    ]),
    // assetType: z.nativeEnum(AssetType),
    product: z.string(),
    objectives: z.string(),
    horizon: z.number(),
  })
  .or(
    z.object({
      name: z.string().min(1),
      type: z.union([
        z.literal(ProjectType.ArbitrageCif),
        z.literal(ProjectType.ArbitrageLifeInsurance),
        z.literal(ProjectType.Redemption),
        z.literal(ProjectType.ComplementaryCif),
        z.literal(ProjectType.ComplementaryLifeInsurance),
      ]),
      // assetType: z.nativeEnum(AssetType),
      contractID: z.string().optional(),
    })
  );

export enum AdditionnalProjectType {
  Subscription = "subscription",
  Arbitrage = "arbitrage",
  Complementary = "complementary",
}
const projectSearch = z.object({
  type: z
    .union([z.nativeEnum(ProjectType), z.nativeEnum(AdditionnalProjectType)])
    // .nativeEnum(
    //   ProjectType as typeof ProjectType & { Subscription: "subscription" }
    // )
    .optional(),
  name: z.string().optional(),
  product: z.string().optional(), // TODO: replace with real id
});

export const companyCustomersProjectRootRoute = createRoute({
  path: "projects",
  getParentRoute: () => companyCustomerRootRoute,
});

export const companyCustomersProjectRoute = createRoute({
  path: "/",
  component: CompanyCustomersProject,
  validateSearch: (search) => projectSearch.parse(search),
  getParentRoute: () => companyCustomersProjectRootRoute,
});

export const companyCustomersProjectAddRoute = createRoute({
  path: "add",
  component: () => {
    const router = useRouter();

    return (
      <>
        <div className="flex justify-end px-2">
          <Button
            size="small"
            icon="pi pi-chevron-left"
            label="forms.fields.actions.back"
            onClick={() => router.history.back()}
          />
        </div>
        <CompanyCustomersProjectAdd />
      </>
    );
  },
  getParentRoute: () => companyCustomersProjectRootRoute,
  validateSearch: (search) => projectAddSearchSchema.parse(search),
});

export const companyCustomersProjectUpdateRoute = createRoute({
  path: "/$projectID/update",
  component: () => {
    const router = useRouter();

    return (
      <>
        <div className="flex justify-end px-2">
          <Button
            size="small"
            icon="pi pi-chevron-left"
            label="forms.fields.actions.back"
            onClick={() => router.history.back()}
          />
        </div>
        <CompanyCustomersProjectUpdate />
      </>
    );
  },
  getParentRoute: () => companyCustomersProjectRootRoute,
  validateSearch: (search) => projectUpdateSchema.parse(search),
});

export const Route = companyCustomersProjectRootRoute.addChildren([
  companyCustomersProjectRoute,
  companyCustomersProjectAddRoute,
  companyCustomersProjectUpdateRoute,
]);
