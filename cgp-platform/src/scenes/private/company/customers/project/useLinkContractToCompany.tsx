import { useMutation } from "react-query";
import { gql } from "../../../../../service/client";
import { ContractLogic } from "./contract.logic";

type UseLinkContractToCompanyProps = {
  contractId: string;
  companyId: string;
};


export const useLinkContractToCompany = () => {
  const { mutateAsync, isLoading, error } = useMutation({
    mutationKey: ['linkContractToCompany'],
    mutationFn: ({ contractId, companyId }: UseLinkContractToCompanyProps) =>
      gql.client.request(ContractLogic.linkContractToCompany(), {
        contractId,
        companyId,
      }),
  });

  return { mutateAsync, isLoading, error };
};
