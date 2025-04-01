import { useParams } from "@tanstack/react-router";
import { useQuery } from "react-query";

import { gql } from "../../../../../service/client";
import { ProjectType, TimeRange } from "../../../../../types";
import { ProjectLogic } from "./project.logic";

type UseProjectListProps = {
  range: TimeRange;
  type?: ProjectType;
  productType?: string;
};

export function useProjectList(props?: UseProjectListProps) {
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/projects/",
  });
  return useQuery({
    queryKey: ["projectList", props?.range, props?.productType],
    queryFn: () => {
      return gql.client.request(ProjectLogic.projectList(), {
        companyID: params.companyId as string,
        customerID: params.customerId as string,
        type: props?.type ?? null,
        range: props?.range ?? {
          from: null,
          to: null,
        },
        productType: props?.productType,
      });
    },
  });
}
