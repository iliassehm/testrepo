import { createRoute } from "@tanstack/react-router";

import { companyRoot } from "../route";
import { Companycampaign } from "./campaigns";

interface CampaignParams {
  open?: boolean;
}

export const companycampaignsScene = createRoute({
  path: "/campaigns",
  component: Companycampaign,
  getParentRoute: () => companyRoot,
  validateSearch: (search: Record<string, unknown>): CampaignParams => {
    return {
      open: !!search.open,
    };
  },
});
