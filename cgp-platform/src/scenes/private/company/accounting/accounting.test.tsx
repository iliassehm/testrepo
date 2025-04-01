import { ne } from "@faker-js/faker";
import { assert } from "vitest";

import { gql } from "../../../../service/client";
import { AssetGroup, WealthFilter } from "../../../../types";
import { Accounting } from "./accounting";
import { AccountingLogic } from "./Accounting.logic";

describe("Accounting Queries", () => {
  it("should return a customers list", async () => {
    const customerList = await gql.client.request(
      AccountingLogic.newCustomersQueries(),
      {
        companyID: "1",
        input: {
          dateRange: {
            from: new Date(),
            to: new Date(),
          },
        },
      }
    );

    expect(customerList).toHaveProperty("company");
    expect(customerList.company).toHaveProperty("id");
    expect(customerList.company).toHaveProperty("customerList");
    expect(customerList.company?.customerList).toHaveProperty("totalCount");
    expect(customerList.company?.customerList).toHaveProperty("edges");
  });

  it("should return the number of new contracts", async () => {
    const contractNumbers = await AccountingLogic.newContractsNumberQuery(
      "1",
      WealthFilter.UnderManagements,
      AssetGroup.Banking,
      {
        dateRange: {
          from: new Date(),
          to: new Date(),
        },
      }
    );

    expect(contractNumbers).toHaveProperty("company");
    expect(contractNumbers.company).toHaveProperty("list");
    expect(contractNumbers.company?.list).toHaveProperty("totalCount");
  });

  it("should return the total client count", async () => {
    const clientCount = await gql.client.request(
      AccountingLogic.newCustomersCountQueries(),
      {
        companyID: "1",
        input: {
          limit: 0,
          dateRange: {
            from: new Date(),
            to: new Date(),
          },
        },
      }
    );

    expect(clientCount).toHaveProperty("company");
    expect(clientCount.company).toHaveProperty("id");
    expect(clientCount.company).toHaveProperty("customerList");
    expect(clientCount.company?.customerList).toHaveProperty("totalCount");
  });

  it("should return a list of asset", async () => {
    const assetList = await AccountingLogic.assetList("1", {
      date: {
        from: new Date(),
        to: new Date(),
      },
      computing: WealthFilter.UnderManagements,
    });

    expect(assetList).toHaveProperty("accountingAssets");
    expect(Array.isArray(assetList.accountingAssets)).toBe(true);
  });
});
