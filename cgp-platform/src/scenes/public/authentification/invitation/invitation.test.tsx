import { expect, describe, beforeAll, it } from "vitest"

import { gql } from "../../../../service/client";
import { SignUpInviteMutation } from "../../../../types";
import { invitationLogic } from "./invitation.logic";

describe("invitationLogic", () => {
  let signUpInviteMutation: SignUpInviteMutation;

  beforeAll(async () => {
    signUpInviteMutation = await gql.client.request(
      invitationLogic.sendSignUpInvitation(),
      {
        id: "1",
        token: "token",
      }
    );
  });

  it("it should match signUpInviteMutation keys", () => {
    expect(Object.keys(signUpInviteMutation).sort()).toEqual(
      ["authenticationFirebase", "managerInviteAccept"].sort()
    );
  });

  it("it should match signUpInviteMutation.authenticationFirebase keys", () => {
    expect(
      Object.keys(signUpInviteMutation.authenticationFirebase || {}).sort()
    ).toEqual(["id", "provider", "manager"].sort());
  });
});
