import { beforeAll, describe, expect, it } from "vitest";

import { gql } from "../../../../service/client";
import { HomeQuery } from "../../../../types";
import { CompanyHomeLogic } from "./home.logic";

describe("Customers", () => {
  let homeQuery: HomeQuery;
  const limit = 2;

  beforeAll(async () => {
    homeQuery = await gql.client.request(CompanyHomeLogic.queries(), {
      companyID: "0",
      input: {
        limit,
      },
      projectRange: { from: null, to: null },
    });
  });

  it("it should match homeQuery keys", () => {
    expect(Object.keys(homeQuery).sort()).toEqual(
      [
        "company",
        "customersCompliance",
        "liquidity",
        "listCompanyTask",
        "mostOccuringAssetType",
        "projectCompanyList",
      ].sort()
    );
  });

  it("should return a company customers", async () => {
    expect(homeQuery.company?.customerList.edges.length).toEqual(limit);
  });
});
