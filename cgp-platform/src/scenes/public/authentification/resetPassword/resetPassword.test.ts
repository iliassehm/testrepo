import { expect, describe, it, vi, afterAll } from "vitest"

import { AuthentificationLogic } from "../authentification.logic";

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn().mockReturnThis(),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(true),
}));

describe("ResetPasswordPage", () => {
  afterAll(() => {
    vi.resetAllMocks()
  });

  it("should reset password", async () => {
    const email = "test@test.test";

    await expect(
      AuthentificationLogic.resetPassword(email)
    ).resolves.toBeUndefined();
  });
});
