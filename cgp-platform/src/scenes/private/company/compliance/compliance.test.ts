import { expect, describe, beforeAll, it } from "vitest"

import { gql } from "../../../../service/client";
import { CompanyComplianceQuery } from "../../../../types";
import { CompanyComplianceLogic } from "./compliance.logic";

describe("Customers", () => {
  let customersQuery: CompanyComplianceQuery;

  beforeAll(async () => {
    customersQuery = await gql.client.request(
      CompanyComplianceLogic.queries(),
      {
        company: "1",
      }
    );
  });

  it("it should match customersQuery keys", () => {
    expect(Object.keys(customersQuery).sort()).toEqual(
      ["customersCompliance", "globalCompliance"].sort()
    );
  });
});
