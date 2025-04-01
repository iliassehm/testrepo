import { useParams } from "@tanstack/react-router";
import { useQuery } from "react-query";

import { gql } from "../../../../../service/client";
import { ProjectLogic } from "./project.logic";

export function useProjectProductTypes() {
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/projects/",
  });
  return useQuery({
    queryKey: ["projectProductTypes", params.companyId, params.customerId],
    queryFn: () => {
      return gql.client.request(ProjectLogic.projectProductTypes(), {
        companyID: params.companyId as string,
        customerID: params.customerId as string,
      });
    },
  });
}
