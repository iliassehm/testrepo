import { expect, describe, beforeAll, it } from "vitest"

import { customerFiscalityInformationsMock } from "../../../../../mocks/handlers/mock";
import { gql } from "../../../../../service/client";
import { CustomerFiscalityQuery } from "../../../../../types";
import { CompanyCustomersFiscalityLogic } from "./fiscality.logic";

describe("Layout", () => {
  describe("Query", () => {
    let fiscalityQuery: CustomerFiscalityQuery;
    beforeAll(async () => {
      fiscalityQuery = await gql.client.request(
        CompanyCustomersFiscalityLogic.queries(),
        {
          companyID: "1",
          customerID: "1",
          year: 2024,
        }
      );
    });

    it("it should match layoutQuery keys", () => {
      expect(Object.keys(fiscalityQuery).sort()).toEqual(["customer"].sort());
    });
  });

  describe("Mutation", () => {
    it("should updateFiscality", async () => {
      const updateFiscality = await gql.client.request(
        CompanyCustomersFiscalityLogic.updateFiscality(),
        {
          year: 2023,
          companyID: "1",
          customerID: "1",
          input: JSON.stringify(customerFiscalityInformationsMock()),
        }
      );
      expect(updateFiscality).toEqual({
        customerFiscality: customerFiscalityInformationsMock(),
      });
    });
  });
});
