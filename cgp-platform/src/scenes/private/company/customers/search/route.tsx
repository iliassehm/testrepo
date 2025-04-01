import { createRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";

import {
  companyCustomersIndexRoute,
  companyCustomersRootRoute,
} from "../route";
import { CustomersSearchResult } from "./result.$id";
import { CustomerSearch } from "./search";

const companyCustomersSearchSchema = z.object({
  tab: z
    .union([z.literal("wealth"), z.literal("budget")])
    .default("wealth")
    .catch("wealth"),
  schema: z.any().optional(),
});

export const companyCustomersSearch = createRoute({
  path: "/search",
  component: () => (
    <>
      <CustomerSearch />
      <Outlet />
    </>
  ),
  validateSearch: (search) => companyCustomersSearchSchema.parse(search),
  getParentRoute: () => companyCustomersIndexRoute,
});

export const companyCustomersSearchResult = createRoute({
  path: "/search/result/$id",
  component: () => <CustomersSearchResult />,
  getParentRoute: () => companyCustomersRootRoute,
});
