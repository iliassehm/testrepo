import { vi } from "vitest";

import {
  budgetCreationMock,
  mockRouterSetup,
  resetRouterMocks,
} from "../../../../../../mocks/test/react-query.setup";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../../../tests/test-utils";
import { annualIncomesNames } from "../../budget/budgetPerson";
import IncomeForm from "./IncomeForm";
import { RevenueComponent } from "./index";

describe("KYC - Income", () => {
  // Mock functions and data
  const mockSetShowModal = vi.fn();
  const mockToggleIncome = vi.fn();
  const mockToggleInExpanded = vi.fn();
  const mockBudgetDelete = vi.fn();

  const defaultProps = {
    incomes: [],
    setShowModal: mockSetShowModal,
    showModal: null,
    selectedIncomes: [],
    toggleIncome: mockToggleIncome,
    toggleInExpanded: mockToggleInExpanded,
    isExpanded: [],
    budgetCreation: budgetCreationMock,
    budgetDelete: mockBudgetDelete,
    mutationsLoading: false,
  };

  beforeEach(() => {
    mockRouterSetup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetRouterMocks();
  });

  it("should render all income type checkboxes", async () => {
    render(<RevenueComponent {...defaultProps} />);

    waitFor(() => {
      // Check if all income type checkboxes are rendered
      for (const income of annualIncomesNames) {
        const checkbox = screen.getByTestId(`income-checkbox-${income.label}`);
        expect(checkbox).toBeInTheDocument();
      }
    });
  });

  it("should show section when checkbox is checked", async () => {
    // Create arrays of all income labels
    const allIncomeLabels = annualIncomesNames.map((income) => income.label);

    render(
      <RevenueComponent
        {...defaultProps}
        selectedIncomes={allIncomeLabels} // Pre-set all incomes as selected
        isExpanded={allIncomeLabels} // Pre-set all sections as expanded
      />
    );

    await waitFor(() => {
      for (const income of annualIncomesNames) {
        const section = screen.getByTestId(`income-section-${income.label}`);
        expect(section).toBeInTheDocument();
      }
    });
  });

  it("should display form fields in the section when expanded", async () => {
    render(
      <RevenueComponent
        {...defaultProps}
        selectedIncomes={[annualIncomesNames[0].label]} // Pre-set all incomes as selected
        isExpanded={[annualIncomesNames[0].label]} // Pre-set all sections as expanded
      />
    );

    await waitFor(() => {
      // Check if form fields are present
      expect(
        screen.getByTestId(`${annualIncomesNames[0].label}-name`)
      ).toBeInTheDocument(); // Select field for income category
      expect(
        screen.getByTestId(`${annualIncomesNames[0].label}-amount`)
      ).toBeInTheDocument(); // Input field for amount
      expect(
        screen.getByTestId(`${annualIncomesNames[0].label}-submit`)
      ).toBeInTheDocument(); // Submit button
    });
  });

  it("should submit form with correct values", async () => {
    render(
      <IncomeForm
        defaultValues={{
          amount: 1,
          name: annualIncomesNames[0].items[0].value,
          type: annualIncomesNames[0].label,
          id: "1",
        }}
        incomeType={annualIncomesNames[0].label}
        isLoading={false}
        onSubmit={budgetCreationMock}
      />
    );
    await waitFor(async () => {
      const submitButton = screen.getByTestId(
        `${annualIncomesNames[0].label}-submit`
      );
      expect(submitButton).toBeInTheDocument();
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(budgetCreationMock).toHaveBeenCalledWith({
          input: {
            amount: 1,
            name: annualIncomesNames[0].items[0].value,
            type: annualIncomesNames[0].label,
          },
          budgetID: "1",
        });
      });
    });
  });
});
