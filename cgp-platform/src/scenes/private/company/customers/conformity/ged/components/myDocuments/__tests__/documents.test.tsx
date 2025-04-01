import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  deleteDocumentMock,
  documentNotificationMock,
  documentUpdateMock,
} from "../../../../../../../../../mocks/test/react-query.setup";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../../../../../../tests/test-utils";
import { GedDocuments } from "../index";

describe("GedDocuments - Documents", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    documentUpdateMock.mockResolvedValue({
      data: {
        documentUpdate: {
          id: "document-1",
          notes: "Updated notes",
        },
      },
    });

    deleteDocumentMock.mockResolvedValue({
      data: {
        documentDelete: {
          id: "document-1",
        },
      },
    });
  });

  it("handles document notes update", async () => {
    render(<GedDocuments companyId="1" customerId="1" />);

    await waitFor(() => {
      const notesInput = screen.getByTestId("document-view-notes-input");
      const submitButton = screen.getByTestId("document-view-submit");

      fireEvent.change(notesInput, { target: { value: "New note" } });
      fireEvent.click(submitButton);

      expect(documentUpdateMock).toHaveBeenCalledWith({
        id: "1",
        update: {
          notes: "New note",
        },
      });
    });
  });

  it("handles document signature states correctly", async () => {
    render(<GedDocuments companyId="1" customerId="1" />);

    await waitFor(() => {
      expect(
        screen.getByTestId("document-view-pdf-signed")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("document-view-signature-type")
      ).toHaveTextContent("signature");
    });
  });
});
