import { beforeAll, describe, expect, it } from "vitest";

import { budgetListMock } from "../../../../../mocks/handlers/mock";
import { gql } from "../../../../../service/client";
import { BudgetQuery } from "../../../../../types";
import { BudgetLogic } from "./budget.logic";

describe("Layout", () => {
  describe("Query", () => {
    let budgetQuery: BudgetQuery;

    beforeAll(async () => {
      budgetQuery = await gql.client.request(BudgetLogic.queries(), {
        companyID: "1",
        customerID: "1",
      });
    });

    it("it should match budgetQuery keys", () => {
      expect(Object.keys(budgetQuery).sort()).toStrictEqual(
        ["budgetList", "customer"].sort()
      );
    });
  });

  describe("Mutation", () => {
    it("should create a budget", async () => {
      const budget = budgetListMock()[0];
      const budgetCreation = await gql.client.request(BudgetLogic.creation(), {
        companyID: "1",
        customerID: "1",
        input: {
          type: budget.type,
          amount: budget.amount.value,
          name: budget.name,
        },
      });
      expect(budgetCreation).toEqual({
        created: { name: budget.name, type: budget.type, libelle: null },
      });
    });

    it("should delete a budget", async () => {
      const company = await gql.client.request(
        BudgetLogic.budgetItemDeletionMutation(),
        {
          companyID: "1",
          customerID: "1",
          budgetID: "1",
        }
      );

      expect(company).toEqual({
        budgetItemDeletion: true,
      });
    });
  });
});
