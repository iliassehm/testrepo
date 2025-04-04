import { expect, describe, beforeAll, it } from "vitest"

import { gql } from "../../../../service/client";
import { CampaignsQuery } from "../../../../types";
import { CampaignLogic } from "./campaigns.logic";

describe("Campaigns", () => {
  let campaignsQuery: CampaignsQuery;

  beforeAll(async () => {
    campaignsQuery = await gql.client.request(CampaignLogic.queries(), {
      companyID: "1",
    });
  });

  it("it should match campaignsQuery keys", () => {
    expect(Object.keys(campaignsQuery).sort()).toEqual(["campaignList"].sort());
  });

  it("should return a list of company campaigns", async () => {
    expect(campaignsQuery.campaignList?.length).toBeGreaterThan(0);
  });
});
