import { useMutation, UseMutationOptions, useQueryClient } from "react-query";
import { z } from "zod";

import {
  arbitrageCifSchema,
  arbitrageInsuranceSchema,
  cifSubscription,
  complementaryCIFSchema,
  complementaryInsuranceSchema,
  insuranceSubscription,
  redemptionSchema,
} from "../../../../../../shared/schemas/project";
import { gql } from "../../../../../service/client";
import {
  ProjectType,
  ProjectUpdateMutation,
  ProjectUpdateMutationVariables,
} from "../../../../../types";
import { ProjectLogic } from "./project.logic";

type ProjectTypeKeys = keyof typeof ProjectType;

export const ProjectCreation = {
  ArbitrageCif: arbitrageCifSchema,
  ArbitrageLifeInsurance: arbitrageInsuranceSchema,
  SubscriptionCif: cifSubscription,
  SubscriptionLifeInsurance: insuranceSubscription,
  Redemption: redemptionSchema,
  ComplementaryCif: complementaryCIFSchema,
  ComplementaryLifeInsurance: complementaryInsuranceSchema,
} satisfies {
  [key in ProjectTypeKeys]: z.Schema;
};

type ProjectUpdateMetadata = {
  [key in ProjectTypeKeys]: z.infer<(typeof ProjectCreation)[key]>;
};

type ProjectUpdateInput<T> = Omit<
  ProjectUpdateMutationVariables,
  "type" | "metadata"
> & {
  metadata: T;
};

type UseMutationProps = UseMutationOptions<
  ProjectUpdateMutation,
  unknown,
  ProjectUpdateInput<unknown>
>;

export function useProjectUpdate<T extends ProjectTypeKeys>(
  type: T,
  props?: Omit<UseMutationProps, "mutationFn">
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProjectUpdateInput<ProjectUpdateMetadata[T]>) =>
      gql.client.request(ProjectLogic.projectUpdate(), input),
    ...props,
    onSuccess: (...params) => {
      queryClient.invalidateQueries(["project", params[0].projectUpdate?.id]);
      queryClient.invalidateQueries(["projectList"]);
      props?.onSuccess?.(...params);
    },
  });
}
