import { useMutation, UseMutationOptions } from "react-query";

import { gql } from "../../../../../service/client";
import {
  AutomaticContractCompareMutation,
  AutomaticContractCompareMutationVariables,
} from "../../../../../types";
import { ContractLogic } from "./contract.logic";

type UseContractCompareProps = UseMutationOptions<
  AutomaticContractCompareMutation,
  unknown,
  AutomaticContractCompareMutationVariables
>;

export const useContractCompare = (
  props?: Omit<UseContractCompareProps, "mutationFn">
) =>
  useMutation({
    mutationKey: ["contractCompare"],
    mutationFn: (input: AutomaticContractCompareMutationVariables) =>
      gql.client.request(ContractLogic.contractCompare(), input),
    ...props,
  });
