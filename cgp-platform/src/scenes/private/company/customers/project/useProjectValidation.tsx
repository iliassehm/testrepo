import { useMutation, UseMutationOptions, useQueryClient } from "react-query";

import { gql } from "../../../../../service/client";
import {
  ProjectValidationMutation,
  ProjectValidationMutationVariables,
} from "../../../../../types";
import { ProjectLogic } from "./project.logic";

type UseMutationProps = UseMutationOptions<
  ProjectValidationMutation,
  unknown,
  ProjectValidationMutationVariables
>;

export function useProjectValidation(
  props?: Omit<UseMutationProps, "mutationFn">
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProjectValidationMutationVariables) =>
      gql.client.request(ProjectLogic.projectValidation(), input),
    ...props,
    onSuccess: (...params) => {
      queryClient.invalidateQueries([
        "project",
        params[0].projectValidation?.id,
      ]);
      queryClient.invalidateQueries(["projectList"]);
      props?.onSuccess?.(...params);
    },
  });
}
