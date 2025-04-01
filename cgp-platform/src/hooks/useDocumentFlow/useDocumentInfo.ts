// useDocumentFlow.ts
import { useQuery } from "react-query";

import { GedLogic } from "../../scenes/private/company/customers/conformity/ged/ged.logic";
import { gql } from "../../service/client";
import type { Company, Customer, Document } from "../../types";

export function useDocumentInfo(
  companyID: Company["id"],
  customerID: Customer["id"],
  selectedDocument: Document | null
) {
  const {
    data: documentInfoData,
    isLoading: isDocumentInfoLoading,
    refetch: refetchDocumentInfo,
  } = useQuery(
    ["documentInfo", selectedDocument],
    () =>
      gql.client.request(GedLogic.documentInfoQuery(), {
        companyID,
        customerID,
        id: selectedDocument?.id as string,
      }),
    { enabled: !!selectedDocument }
  );

  const { data: urlData, isLoading: isUrlLoading } = useQuery(
    ["documentUrl", selectedDocument],
    () =>
      gql.client.request(GedLogic.documentUrlQuery(), {
        companyID,
        customerID,
        id: selectedDocument?.id as string,
      }),
    { enabled: !!selectedDocument }
  );

  return {
    documentInfo: documentInfoData?.document,
    documentUrl: urlData?.document?.url,
    isDocumentInfoLoading,
    isUrlLoading,
    refetchDocumentInfo,
  };
}
