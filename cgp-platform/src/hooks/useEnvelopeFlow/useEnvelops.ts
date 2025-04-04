// useDocumentFlow.ts
import { useMutation, useQuery } from "react-query";

import type { EnvelopeCategory } from ".";
import { GedLogic } from "../../scenes/private/company/customers/conformity/ged/ged.logic";
import { gql } from "../../service/client";
import type { Company, Customer, Document, DocumentAdd } from "../../types";

export function useDocuments(
  companyID: Company["id"],
  customerID: Customer["id"],
  selectedCategory: EnvelopeCategory | null,
  selectedDocument: Document | null,
  setSelectedDocument: (document: Document | null) => void
) {
  const {
    data: documentsData,
    isLoading: isDocumentsLoading,
    refetch: refetchDocuments,
  } = useQuery(
    ["evelopDocumentCategory", selectedCategory],
    () =>
      gql.client.request(GedLogic.envelopeCategoryDocumentsList(), {
        id: selectedCategory?.id as string,
      }),
    {
      enabled: !!selectedCategory,
      onSuccess: (data) => {
        if (data?.envelope?.documentList?.[0] && !selectedDocument) {
          setSelectedDocument(data.envelope?.documentList?.[0] as Document);
        }
      },
    }
  );

  const documentAddMutation = useMutation({
    mutationKey: "gedDocumentAdd",
    mutationFn: (params: { input: DocumentAdd }) =>
      gql.client.request(GedLogic.documentAdd(), {
        companyID,
        customerID,
        input: params.input,
      }),
    onSuccess: () => {
      refetchDocuments();
    },
  });

  return {
    documents: documentsData?.envelope?.documentList,
    isDocumentsLoading,
    refetchDocuments,
    documentAddMutation,
  };
}
