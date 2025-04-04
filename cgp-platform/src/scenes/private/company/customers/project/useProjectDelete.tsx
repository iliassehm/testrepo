import { useMutation, UseMutationOptions, useQueryClient } from "react-query";

import { gql } from "../../../../../service/client";
import {
  ProjectDeletionMutation,
  ProjectDeletionMutationVariables,
} from "../../../../../types";
import { ProjectLogic } from "./project.logic";

type UseMutationProps = UseMutationOptions<
  ProjectDeletionMutation,
  unknown,
  ProjectDeletionMutationVariables
>;

export function useProjectDelete(props?: Omit<UseMutationProps, "mutationFn">) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProjectDeletionMutationVariables) =>
      gql.client.request(ProjectLogic.projectDeletion(), input),

    ...props,
    onSuccess: (...params) => {
      queryClient.invalidateQueries(["projectList"]);
      props?.onSuccess?.(...params);
    },
  });
}
