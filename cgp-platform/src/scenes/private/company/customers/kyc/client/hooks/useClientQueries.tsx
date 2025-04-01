import { useState } from "react";
import { useQuery } from "react-query";

import { CustomerRelationForm } from "../../../../../../../../shared/schemas/relation";
import { gql } from "../../../../../../../service/client";
import { Customer } from "../../../../../../../types";
import { CompanyCustomersInformationsLogic } from "../../../informations/informations.logic";
import { AssetDetailLogic } from "../../../wealth/AssetDetail/assetDetail.logic";

export function useClientQueries(companyId: string, customerId: string) {
  // State
  const [spouse, setSpouse] = useState<CustomerRelationForm | null>(null);

  // Queries
  const {
    data: customerInfoData,
    isLoading: isCustomerInfoQueryLoading,
    refetch: refetchCustomerInfoData,
  } = useQuery(["companyCustomersInformationsGeneral", customerId], () =>
    gql.client.request(CompanyCustomersInformationsLogic.queries(), {
      companyID: companyId,
      customerID: customerId,
    })
  );

  const {
    data: relationData,
    isLoading: isRelationQueryLoading,
    refetch: refetchRelationData,
    isError: isRelationQueryError,
  } = useQuery(["relation", companyId, customerId], () =>
    gql.client
      .request(CompanyCustomersInformationsLogic.relationQuery(), {
        companyID: companyId as string,
        customerID: customerId as string,
      })
      .then((data) => {
        if (data.customerRelation) {
          const spouseOfRelation = data.customerRelation.list.find(
            (r) => r.denomination === "spouseOf"
          );

          if (spouseOfRelation) setSpouse(spouseOfRelation);
          else setSpouse(null);
        }
        return data.customerRelation;
      })
  );

  const { data: usersInCustomerReferenceData } = useQuery(
    ["users_in_customer_reference", companyId, customerId],
    () =>
      gql.client.request<{ users: Customer[] }>(
        AssetDetailLogic.getUsersInCustomerReference(),
        {
          companyId: companyId,
          customerId: customerId,
        }
      )
  );

  return {
    customerInfoData,
    isCustomerInfoQueryLoading,
    relationData,
    isRelationQueryLoading,
    refetchRelationData,
    spouse,
    setSpouse,
    refetchCustomerInfoData,
    isRelationQueryError,
    linkedRelationsData: usersInCustomerReferenceData,
  };
}
