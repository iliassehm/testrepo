import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { firebaseAuth } from "../../../service/firebase";
import { graphql } from "../../../types";

export namespace AuthentificationLogic {
  // API

  export function authWithToken() {
    return graphql(`
      mutation Login($token: String!) {
        authenticationFirebase(token: $token) {
          id
          manager {
            id
            name
            companyList {
              id
              name
            }
            parentCompany {
              id
            }
          }
        }
      }
    `);
  }

  export function inviteManager() {
    return graphql(`
      mutation InviteManager(
        $input: ManagerCreation!
        $company: CompanyCreation!
      ) {
        inviteManager(input: $input, company: $company) {
          id
        }
      }
    `);
  }

  export function upload() {
    return "";
  }

  // FIREBASE

  interface LoginWithCredentialsVariables {
    email: string;
    password: string;
  }
  // Google Auth
  export async function authWithCredentials({
    email,
    password,
  }: LoginWithCredentialsVariables) {
    const { user } = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    return {
      user,
      token: await user.getIdToken(),
    };
  }

  export async function resetPassword(email: string) {
    await sendPasswordResetEmail(firebaseAuth, email);
  }
}
