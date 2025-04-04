import { beforeAll, describe, expect, it } from "vitest";

import { gql } from "../../../../service/client";
import { CustomersQuery } from "../../../../types";
import { CompanyCustomersLogic } from "./customers.logic";

describe("Customers", () => {
  let customersQuery: CustomersQuery;
  const limit = 6;
  const input = {
    limit: 6,
  };

  beforeAll(async () => {
    customersQuery = await gql.client.request(CompanyCustomersLogic.queries(), {
      companyID: "1",
      input,
    });
  });

  it("it should match customersQuery keys", () => {
    expect(Object.keys(customersQuery).sort()).toEqual(["company"].sort());
  });

  it("should return a company customers", async () => {
    expect(customersQuery.company?.customerList.edges.length).toEqual(limit);
  });
});
