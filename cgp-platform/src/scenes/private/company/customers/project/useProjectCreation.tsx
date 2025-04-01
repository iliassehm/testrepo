import { useMutation, UseMutationOptions } from "react-query";
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
  ProjectCreationMutation,
  ProjectCreationMutationVariables,
  ProjectType,
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

type ProjectCreationMetadata = {
  [key in ProjectTypeKeys]: z.infer<(typeof ProjectCreation)[key]>;
};

type ProjectCreationInput<T> = Omit<
  ProjectCreationMutationVariables,
  "type" | "metadata"
> & {
  metadata: T;
};

type UseMutationProps = UseMutationOptions<
  ProjectCreationMutation,
  unknown,
  ProjectCreationInput<unknown>
>;

export function useProjectCreation<T extends ProjectTypeKeys>(
  type: T,
  props?: Omit<UseMutationProps, "mutationFn">
) {
  return useMutation({
    mutationFn: (input: ProjectCreationInput<ProjectCreationMetadata[T]>) =>
      gql.client.request(ProjectLogic.projectCreation(), {
        type: ProjectType[type],
        ...input,
      }),
    ...props,
  });
}
