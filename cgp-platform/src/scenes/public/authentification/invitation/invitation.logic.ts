import { createUserWithEmailAndPassword } from "firebase/auth";

import { firebaseAuth } from "../../../../service/firebase";
import { graphql } from "../../../../types";

export namespace invitationLogic {
  export function sendSignUpInvitation() {
    return graphql(`
      mutation SignUpInvite($token: String!, $id: ID!) {
        authenticationFirebase(token: $token) {
          id
          provider
          manager {
            id
            name
            email
          }
        }
        managerInviteAccept(id: $id) {
          id
        }
      }
    `);
  }

  export function subscribeToNewsletter() {
    return graphql(`
      mutation SubscribeToNewsletter($input: ProfileUpdate!) {
        profileUpdate(input: $input) {
          id
        }
      }
    `);
  }

  interface LoginWithCredentialsVariables {
    email: string;
    password: string;
  }
  //   signup user in firebase ang get token
  export async function signUpWithFirebase({
    email,
    password,
  }: LoginWithCredentialsVariables) {
    const { user } = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    return {
      user,
      token: await user.getIdToken(),
    };
  }

  export function logout() {
    return graphql(`
      mutation Logout {
        logoutAuthentication {
          id
        }
      }
    `);
  }
}
