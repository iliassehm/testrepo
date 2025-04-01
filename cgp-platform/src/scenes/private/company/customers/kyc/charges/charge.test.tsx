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
import { annualExpensesNames } from "../../budget/budgetPerson";
import ChargeForm from "./ChargeForm";
import { ChargeComponent } from "./index";

describe("KYC - Charges", () => {
  // Mock functions and data
  const mockSetShowModal = vi.fn();
  const mockToggleCharge = vi.fn();
  const mockToggleInExpanded = vi.fn();
  const mockBudgetDelete = vi.fn();

  const defaultProps = {
    charges: [],
    setShowModal: mockSetShowModal,
    showModal: null,
    selectedCharges: [],
    toggleCharge: mockToggleCharge,
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

  it("should render all charges type checkboxes", async () => {
    render(<ChargeComponent {...defaultProps} />);

    // Check if all charges type checkboxes are rendered
    waitFor(() => {
      for (const charge of annualExpensesNames) {
        const checkbox = screen.getByTestId(`charge-checkbox-${charge.label}`);
        expect(checkbox).toBeInTheDocument();
      }
    });
  });

  it("should show section when checkbox is checked", async () => {
    // Create arrays of all charge labels
    const allChargeLabels = annualExpensesNames.map((charge) => charge.label);

    render(
      <ChargeComponent
        {...defaultProps}
        selectedCharges={allChargeLabels} // Pre-set all charges as selected
        isExpanded={allChargeLabels} // Pre-set all sections as expanded
      />
    );

    await waitFor(() => {
      for (const charge of annualExpensesNames) {
        const section = screen.getByTestId(`charge-section-${charge.label}`);
        expect(section).toBeInTheDocument();
      }
    });
  });

  it("should display form fields in the section when expanded", async () => {
    render(
      <ChargeComponent
        {...defaultProps}
        selectedCharges={[annualExpensesNames[0].label]} // Pre-set all charges as selected
        isExpanded={[annualExpensesNames[0].label]} // Pre-set all sections as expanded
      />
    );

    await waitFor(() => {
      // Check if form fields are present
      expect(
        screen.getByTestId(`${annualExpensesNames[0].label}-name`)
      ).toBeInTheDocument(); // Select field for charge category
      expect(
        screen.getByTestId(`${annualExpensesNames[0].label}-amount`)
      ).toBeInTheDocument(); // Input field for amount
      expect(
        screen.getByTestId(`${annualExpensesNames[0].label}-submit`)
      ).toBeInTheDocument(); // Submit button
    });
  });

  it("should submit form with correct values", async () => {
    render(
      <ChargeForm
        defaultValues={{
          amount: 1,
          name: annualExpensesNames[0].items[0].value,
          type: annualExpensesNames[0].label,
          id: "1",
        }}
        chargeType={annualExpensesNames[0].label}
        isLoading={false}
        onSubmit={budgetCreationMock}
      />
    );
    await waitFor(async () => {
      const submitButton = screen.getByTestId(
        `${annualExpensesNames[0].label}-submit`
      );
      expect(submitButton).toBeInTheDocument();
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(budgetCreationMock).toHaveBeenCalledWith({
          input: {
            amount: 1,
            name: annualExpensesNames[0].items[0].value,
            type: annualExpensesNames[0].label,
          },
          budgetID: "1",
        });
      });
    });
  });
});
