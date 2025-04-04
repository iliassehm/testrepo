import { expect, describe, beforeAll, it } from "vitest"

import { gql } from "../service/client";
import { AuthenticatedQuery } from "../types";
import { AppLogic } from "./App.logic";

describe("AppLogic", () => {
  describe("authenticatedQuery", () => {
    let authenticatedQuery: AuthenticatedQuery;

    beforeAll(async () => {
      authenticatedQuery = await gql.client.request(
        AppLogic.authenticatedQuery()
      );
    });

    it("should match query keys", async () => {
      expect(Object.keys(authenticatedQuery).sort()).toEqual(
        ["authenticated"].sort()
      );
    });

    it("should return a authenticated user", async () => {
      expect(authenticatedQuery.authenticated).toBeTruthy();

      expect(authenticatedQuery.authenticated?.id).toBeDefined();
    });

    it("should return a authenticated manager with a companyList", async () => {
      expect(
        authenticatedQuery.authenticated?.manager?.companyList
      ).toBeDefined();

      expect(
        authenticatedQuery.authenticated?.manager?.companyList?.length
      ).toBeGreaterThanOrEqual(1);
    });
  });
});
