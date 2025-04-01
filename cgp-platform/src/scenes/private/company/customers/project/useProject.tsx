import { useQuery } from "react-query";

import { gql } from "../../../../../service/client";
import { ProjectLogic } from "./project.logic";

type UseProjectProps = {
  id: string;
};

export function useProject(props: UseProjectProps) {
  return useQuery({
    queryKey: ["project", props.id],
    queryFn: () => {
      return gql.client.request(ProjectLogic.project(), {
        id: props.id,
      });
    },
  });
}
