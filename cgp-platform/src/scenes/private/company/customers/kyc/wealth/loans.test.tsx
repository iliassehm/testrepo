import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  mockRouterSetup,
  resetRouterMocks,
} from "../../../../../../mocks/test/react-query.setup";
import { render, screen, waitFor } from "../../../../../../tests/test-utils";
import { AssetGroup } from "../../../../../../types";
import LoanForm from "./forms/LoanForm";

describe("Wealth - Loan Form", () => {
  beforeEach(() => {
    mockRouterSetup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetRouterMocks();
  });

  it("Should render all fields", async () => {
    render(
      <LoanForm
        onSubmit={() => console.log("Form submitted")}
        isLoading={false}
        customerHeritageRealEstateAssets={[]}
      />
    );

    await waitFor(() => {
      // Loan Type section
      expect(screen.getByTestId("loan-loanType")).toBeInTheDocument();

      // Date section
      expect(screen.getByTestId("loan-date")).toBeInTheDocument();

      // Loan Amount section
      expect(screen.getByTestId("loan-loanAmount")).toBeInTheDocument();

      // Loan Period section
      expect(screen.getByTestId("loan-loanPeriod")).toBeInTheDocument();

      // Interest Rate section
      expect(screen.getByTestId("loan-interestRate")).toBeInTheDocument();

      // Insurance Amount section
      expect(screen.getByTestId("loan-insuranceAmount")).toBeInTheDocument();

      // Monthly Amount section
      expect(screen.getByTestId("loan-monthlyAmount")).toBeInTheDocument();

      // Currency section
      expect(screen.getByTestId("loan-currency")).toBeInTheDocument();

      // Loan Ownership section
      expect(screen.getByTestId("loan-loanOwnership")).toBeInTheDocument();

      // Application Fees section
      expect(screen.getByTestId("loan-applicationFees")).toBeInTheDocument();

      // Submit button
      expect(screen.getByTestId("loan-submit")).toBeInTheDocument();
    });
  });
});
