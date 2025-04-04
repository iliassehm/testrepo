import { useMutation, useQueryClient } from "react-query";

import { LayoutLogic } from "../components/layout/CompanyLayout/layout.logic";
import { tracker } from "../helpers/tracker";
import { gql } from "../service/client";
import { firebaseLogout } from "../service/firebase";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation(
    "logout",
    async () => {
      const res = await gql.client.request(LayoutLogic.logout());
      await firebaseLogout();

      await queryClient.invalidateQueries("authenticated");

      window.location.reload();
      return res;
    },
    {
      onSuccess: () => tracker.log("logout", { operation: "success" }),
      onError: () => tracker.log("logout", { operation: "failure" }),
    }
  );
}
