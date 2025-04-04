import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  mockRouterSetup,
  resetRouterMocks,
} from "../../../../../../../../../mocks/test/react-query.setup";
import {
  render,
  screen,
  waitFor,
} from "../../../../../../../../../tests/test-utils";
import { GedDocuments } from "../index";

describe("GedDocuments - Rendering", () => {
  beforeEach(() => {
    mockRouterSetup();
  });

  afterEach(() => {
    resetRouterMocks();
  });
  it("renders loading state when categories are loading", async () => {
    render(<GedDocuments companyId="1" customerId="1" />);

    await waitFor(() => {
      // Categories title
      expect(screen.getByTestId("categories-title")).toBeInTheDocument();

      // Categories list
      expect(screen.getByTestId("list-item-category-1")).toBeInTheDocument();
      expect(screen.getByTestId("list-item-category-2")).toBeInTheDocument();
      expect(screen.getByTestId("list-item-category-3")).toBeInTheDocument();

      // Documents list
      expect(screen.getByTestId("list-item-document-1")).toBeInTheDocument();
      expect(screen.getByTestId("list-item-document-2")).toBeInTheDocument();
      expect(screen.getByTestId("list-item-document-3")).toBeInTheDocument();

      // Documents view
      expect(screen.getByTestId("document-view")).toBeInTheDocument();
      expect(screen.getByTestId("document-view-actions")).toBeInTheDocument();
      expect(screen.getByTestId("document-view-header")).toBeInTheDocument();
      expect(screen.getByTestId("document-view-name")).toBeInTheDocument();
      expect(screen.getByTestId("document-view-category")).toBeInTheDocument();
      expect(
        screen.getByTestId("document-view-imported-date")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("document-view-expiration-date")
      ).toBeInTheDocument();
      //   TODO: if document signature is signed
      //   expect(
      //     screen.getByTestId("document-view-signed-date")
      //   ).toBeInTheDocument();

      //   TODO: if document signature is validated
      //   expect(
      //     screen.getByTestId("document-view-validated-date")
      //   ).toBeInTheDocument();
      expect(screen.getByTestId("document-view-state")).toBeInTheDocument();
      expect(
        screen.getByTestId("document-view-envelope-name")
      ).toBeInTheDocument();
      expect(screen.getByTestId("document-view-envelope")).toBeInTheDocument();
      expect(
        screen.getByTestId("document-view-signature-type")
      ).toBeInTheDocument();
      expect(screen.getByTestId("document-view-signature")).toBeInTheDocument();
      expect(
        screen.getByTestId("document-view-notes-title")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("document-view-notes-input")
      ).toBeInTheDocument();
    });
  });
});
