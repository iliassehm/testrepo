// useDocumentFlow.ts
import { useMutation, useQuery } from "react-query";

import { GedLogic } from "../../scenes/private/company/customers/conformity/ged/ged.logic";
import { gql } from "../../service/client";
import type {
  Company,
  Customer,
  Document,
  DocumentAdd,
  DocumentCategoryListOnlyQuery,
} from "../../types";

type DocumentCategory = NonNullable<
  DocumentCategoryListOnlyQuery["documentCategoryList"]
>[number];

export function useDocuments(
  companyID: Company["id"],
  customerID: Customer["id"],
  selectedCategory: DocumentCategory | null,
  selectedDocument: Document | null,
  setSelectedDocument: (document: Document | null) => void
) {
  const {
    data: documentsData,
    isLoading: isDocumentsLoading,
    refetch: refetchDocuments,
  } = useQuery(
    ["documentCategory", selectedCategory],
    () =>
      gql.client.request(GedLogic.categoryDocumentsListQuery(), {
        companyID,
        customerID,
        categoryKey: selectedCategory?.key as string,
      }),
    {
      enabled: !!selectedCategory,
      onSuccess: (data) => {
        if (data?.documentCategory?.documents?.[0] && !selectedDocument) {
          setSelectedDocument(
            data.documentCategory?.documents?.[0] as Document
          );
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
    documents: documentsData?.documentCategory?.documents,
    isDocumentsLoading,
    refetchDocuments,
    documentAddMutation,
  };
}
