// useDocumentFlow.ts
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";

import type {
  Company,
  Customer,
  Document,
  DocumentCategoryListOnlyQuery,
} from "../../types";
import { useDocumentCategories } from "./useDocumentCategories";
import { useDocumentInfo } from "./useDocumentInfo";
import { useDocuments } from "./useDocuments";

type DocumentCategory = NonNullable<
  DocumentCategoryListOnlyQuery["documentCategoryList"]
>[number];

interface DocumentFlowParams {
  companyID: Company["id"];
  customerID: Customer["id"];
  defaultCategoryKey?: string;
  defaultDocumentId?: Document["id"];
}
// Main hook that composes all the others
export function useDocumentFlow({
  companyID,
  customerID,
  defaultCategoryKey,
  defaultDocumentId,
}: DocumentFlowParams) {
  const [selectedCategory, setSelectedCategory] =
    useState<DocumentCategory | null>(
      defaultCategoryKey
        ? { key: defaultCategoryKey, name: "", customerVisibility: false }
        : null
    );
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    defaultDocumentId ? ({ id: defaultDocumentId } as Document) : null
  );

  const categoriesResult = useDocumentCategories(
    companyID,
    selectedCategory,
    setSelectedCategory
  );
  const documentsResult = useDocuments(
    companyID,
    customerID,
    selectedCategory,
    selectedDocument,
    setSelectedDocument
  );
  const documentInfoResult = useDocumentInfo(
    companyID,
    customerID,
    selectedDocument
  );

  const params = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  });
  const navigate = useNavigate();

  const handleCategorySelect = (category: DocumentCategory) => {
    const firstDocument = documentsResult.documents?.[0];
    setSelectedCategory(category);
    setSelectedDocument(null); // Reset document selection
    navigate({
      to: "/company/$companyId/customer/$customerId/conformity",
      params: params,
      search: {
        tab: "ged",
        documentId: firstDocument?.id,
        category: category.key,
      },
    });
  };

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
    navigate({
      to: "/company/$companyId/customer/$customerId/conformity",
      params: params,
      search: {
        tab: "ged",
        documentId: document.id,
        category: selectedCategory?.key as string,
      },
    });
  };

  return {
    ...categoriesResult,
    ...documentsResult,
    ...documentInfoResult,
    selectedCategory,
    selectedDocument,
    handleCategorySelect,
    handleDocumentSelect,
    setSelectedCategory,
    setSelectedDocument,
  };
}
