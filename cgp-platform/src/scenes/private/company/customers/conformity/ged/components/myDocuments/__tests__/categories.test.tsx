import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  categoryCreationMock,
  mockRouterSetup,
  resetRouterMocks,
} from "../../../../../../../../../mocks/test/react-query.setup";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../../../../../../tests/test-utils";
import { GedDocuments } from "../index";

describe("GedDocuments - Categories", () => {
  beforeEach(() => {
    mockRouterSetup();
    categoryCreationMock.mockResolvedValue({
      data: {
        documentCategoryCreation: {
          name: "category-4",
        },
      },
    });
  });

  afterEach(() => {
    resetRouterMocks();
  });

  it("renders categories", async () => {
    render(<GedDocuments companyId="1" customerId="1" />);

    await waitFor(() => {
      expect(screen.getByTestId("categories-title")).toBeInTheDocument();
      expect(screen.getByTestId("list-item-category-1")).toBeInTheDocument();
      expect(screen.getByTestId("list-item-category-2")).toBeInTheDocument();
      expect(screen.getByTestId("list-item-category-3")).toBeInTheDocument();
    });
  });

  it("adds a new category", async () => {
    render(<GedDocuments companyId="1" customerId="1" />);

    await waitFor(() => {
      const addCategoryButton = screen.getByTestId(
        "categories-title-add-button"
      );
      fireEvent.click(addCategoryButton);

      const nameInput = screen.getByTestId("add-category-name-input");
      const checkbox = screen.getByTestId(
        "add-category-customerVisibility-checkbox"
      );
      const submitButton = screen.getByTestId("add-category-save-button");

      fireEvent.change(nameInput, { target: { value: "category-4" } });
      fireEvent.click(checkbox);
      fireEvent.click(submitButton);
    });

    expect(categoryCreationMock).toHaveBeenCalledWith({
      name: "category-4",
      customerVisibility: false,
    });
    expect(categoryCreationMock).toHaveBeenCalledTimes(1);
  });
});
