import { useMutation } from "react-query";
import { gql } from "../../../../../service/client";
import { ContractLogic } from "./contract.logic";

type UseUnlinkContractFromCompany = {
  contractId: string;
  companyId: string;
};


export const useUnlinkContractFromCompany = () => {
  const { mutateAsync, isLoading, error } = useMutation({
    mutationKey: ['unlinkContractFromCompany'],
    mutationFn: ({ contractId, companyId }: UseUnlinkContractFromCompany) =>
      gql.client.request(ContractLogic.unlinkContractFromCompany(), {
        contractId,
        companyId,
      }),
  });

  return { mutateAsync, isLoading, error };
};
