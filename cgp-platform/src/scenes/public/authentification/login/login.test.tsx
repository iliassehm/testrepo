import { expect, describe, it, vi, afterAll } from "vitest"

import { gql } from "../../../../service/client";
import { AuthentificationLogic } from "../authentification.logic";

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn().mockReturnThis(),
}));

describe("LoginPage", () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  describe("authenticationFirebase", () => {
    it("should return a valid authentication token", async () => {
      const { authenticationFirebase } = await gql.client.request(
        AuthentificationLogic.authWithToken(),
        {
          token: "test",
        }
      );

      expect(authenticationFirebase?.id).toBeDefined();
      expect(typeof authenticationFirebase?.id).toBe("string");
    });

    it("should return a valid user object", async () => {
      const { authenticationFirebase } = await gql.client.request(
        AuthentificationLogic.authWithToken(),
        {
          token: "test",
        }
      );

      expect(authenticationFirebase?.manager).toBeDefined();
      expect(typeof authenticationFirebase?.manager?.id).toBe("string");
      expect(typeof authenticationFirebase?.manager?.name).toBe("string");
      expect(Array.isArray(authenticationFirebase?.manager?.companyList)).toBe(
        true
      );
    });

    it("should return a valid AuthenticationResult object", async () => {
      const { authenticationFirebase } = await gql.client.request(
        AuthentificationLogic.authWithToken(),
        {
          token: "test",
        }
      );

      const authenticationResult = {
        token: authenticationFirebase?.id,
        user: {
          id: authenticationFirebase?.manager?.id,
          name: authenticationFirebase?.manager?.name,
          companyList: authenticationFirebase?.manager?.companyList?.map(
            (company) => ({
              id: company?.id,
              name: company?.name,
            })
          ),
        },
      };

      expect(authenticationResult).toEqual({
        token: expect.any(String),
        user: {
          id: expect.any(String),
          name: expect.any(String),
          companyList: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
            }),
          ]),
        },
      });
    });
  });
});
