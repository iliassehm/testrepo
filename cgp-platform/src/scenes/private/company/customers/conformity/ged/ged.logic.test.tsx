import { describe, expect, it, vi } from "vitest";

import { gql } from "../../../../../../service/client";
import type {
  CategoryDocumentsListQuery,
  DocumentCategoryListOnlyQuery,
  DocumentInfoQuery,
  DocumentUrlQuery,
} from "../../../../../../types";
import { GedLogic } from "./ged.logic";

// Mock useDocumentActions hook
vi.mock("../../DocumentActions", () => ({
  useDocumentActions: () => ({
    documentUpdate: {
      mutate: vi.fn(),
      isLoading: false,
    },
    documentNotification: {
      mutate: vi.fn(),
      isLoading: false,
    },
  }),
}));

describe("GED Document Management", () => {
  const companyID = "0";
  const customerID = "1";
  const categoryKey = "test-category";
  const documentId = "test-doc-1";

  describe("Document Categories", () => {
    let categoryQuery: DocumentCategoryListOnlyQuery;

    beforeAll(async () => {
      categoryQuery = await gql.client.request(
        GedLogic.documentCategoryListQuery(),
        { companyID }
      );
    });

    it("should return document categories list", () => {
      expect(categoryQuery.documentCategoryList).toBeDefined();
      expect(Array.isArray(categoryQuery.documentCategoryList)).toBe(true);
    });

    it("categories should have required properties", () => {
      const category = categoryQuery.documentCategoryList?.[0];
      expect(category).toHaveProperty("key");
      expect(category).toHaveProperty("name");
      expect(category).toHaveProperty("customerVisibility");
    });
  });

  describe("Category Documents", () => {
    let documentsQuery: CategoryDocumentsListQuery;

    beforeAll(async () => {
      documentsQuery = await gql.client.request(
        GedLogic.categoryDocumentsListQuery(),
        {
          companyID,
          customerID,
          categoryKey,
        }
      );
    });

    it("should return documents for category", () => {
      expect(documentsQuery.documentCategory).toBeDefined();
      expect(Array.isArray(documentsQuery.documentCategory?.documents)).toBe(
        true
      );
    });

    it("documents should have required properties", () => {
      const document = documentsQuery.documentCategory?.documents?.[0];
      expect(document).toHaveProperty("id");
      expect(document).toHaveProperty("name");
      expect(document).toHaveProperty("created");
      expect(document).toHaveProperty("treatement");
    });
  });

  describe("Document Info", () => {
    let documentInfoQuery: DocumentInfoQuery;
    let documentUrlQuery: DocumentUrlQuery;

    beforeAll(async () => {
      documentInfoQuery = await gql.client.request(
        GedLogic.documentInfoQuery(),
        {
          companyID,
          customerID,
          id: documentId,
        }
      );

      documentUrlQuery = await gql.client.request(GedLogic.documentUrlQuery(), {
        companyID,
        customerID,
        id: documentId,
      });
    });

    it("should return document information", () => {
      expect(documentInfoQuery.document).toBeDefined();
      const doc = documentInfoQuery.document;
      expect(doc).toHaveProperty("id");
      expect(doc).toHaveProperty("name");
      expect(doc).toHaveProperty("notes");
      expect(doc).toHaveProperty("category");
    });

    it("should return document URL", () => {
      expect(documentUrlQuery.document).toBeDefined();
      expect(documentUrlQuery.document).toHaveProperty("url");
      expect(typeof documentUrlQuery.document?.url).toBe("string");
    });
  });
});
