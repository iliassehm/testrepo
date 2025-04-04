import { expect, describe, beforeAll, it } from "vitest"

import { customerMock } from "../../../../../mocks/handlers/mock";
import { gql } from "../../../../../service/client";
import { CustomerFiscalityQuery } from "../../../../../types";
import { CompanyCustomersInformationsLogic } from "./informations.logic";

describe("Layout", () => {
  const customer = customerMock();

  describe("Query", () => {
    let informationQuery: CustomerFiscalityQuery;

    beforeAll(async () => {
      informationQuery = await gql.client.request(
        CompanyCustomersInformationsLogic.queries(),
        {
          companyID: "1",
          customerID: customer.id,
        }
      );
    });

    it("it should match layoutQuery keys", () => {
      expect(Object.keys(informationQuery).sort()).toEqual(["customer"].sort());
    });
  });

  describe("Mutation", () => {
    it("should update customer general informations", async () => {
      const updateFiscality = await gql.client.request(
        CompanyCustomersInformationsLogic.updateCustomerInformationsGeneral(),
        {
          companyID: "1",
          customerID: customer.id,
          input: customer.informations?.general,
        }
      );
      expect(updateFiscality.customerInformationsGeneral).toEqual(
        customer.informations?.general
      );
    });

    it("should update customer details informations", async () => {
      const updateFiscality = await gql.client.request(
        CompanyCustomersInformationsLogic.updateCustomerInformationsDetail(),
        {
          companyID: "1",
          customerID: customer.id,
          input: customer.informations?.details,
        }
      );
      expect(updateFiscality.customerInformationsDetail).toEqual(
        customer.informations?.details
      );
    });
  });
});
