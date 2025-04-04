// useDocumentFlow.ts
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";

import type {
  Company,
  Customer,
  Document,
  EnvelopeListOnlyQuery,
} from "../../types";
import { useDocumentInfo } from "../useDocumentFlow/useDocumentInfo";
import { useEnvelopeCategories } from "./useEnvelopCategories";
import { useDocuments } from "./useEnvelops";

export type EnvelopeCategory = NonNullable<
  EnvelopeListOnlyQuery["envelopeList"]
>[number];

interface DocumentFlowParams {
  companyID: Company["id"];
  customerID: Customer["id"];
  defaultCategoryKey?: string;
  defaultDocumentId?: Document["id"];
}
// Main hook that composes all the others
export function useEnvelopeFlow({
  companyID,
  customerID,
  defaultCategoryKey,
  defaultDocumentId,
}: DocumentFlowParams) {
  const [selectedCategory, setSelectedCategory] =
    useState<EnvelopeCategory | null>(
      defaultCategoryKey
        ? ({ id: defaultCategoryKey } as EnvelopeCategory)
        : null
    );
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    defaultDocumentId ? ({ id: defaultDocumentId } as Document) : null
  );

  const categoriesResult = useEnvelopeCategories(
    companyID,
    customerID,
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

  const handleCategorySelect = (category: EnvelopeCategory) => {
    const firstDocument = documentsResult.documents?.[0];
    setSelectedCategory(category);
    setSelectedDocument(null); // Reset document selection
    navigate({
      to: "/company/$companyId/customer/$customerId/conformity",
      params: params,
      search: {
        tab: "ged",
        envelopeId: category.id,
        envelopeDocumentId: firstDocument?.id,
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
        envelopeId: selectedCategory?.id as string,
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
