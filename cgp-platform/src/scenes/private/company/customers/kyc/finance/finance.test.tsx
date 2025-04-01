import { vi } from "vitest";

import {
  mockRouterSetup,
  resetRouterMocks,
} from "../../../../../../mocks/test/react-query.setup";
import { render, screen, waitFor } from "../../../../../../tests/test-utils";
import { BankingForm } from "./forms/BankingForm";
import { BenefitsForm } from "./forms/BenefitsForm";
import { CrowdfundingForm } from "./forms/CrowdfundingForm";
import { ExoticForm } from "./forms/ExoticForm";
import { LifeInsuranceCapitalizationForm } from "./forms/LifeInsuranceCapitalizationForm";
import { PrivateEquityForm } from "./forms/PrivateEquityForm";
import { RetirementEmployeeForm } from "./forms/RetirementEmployeeForm";
import { RockPaperForm } from "./forms/RockPaperForm";
import { SecuritiesForm } from "./forms/SecuritiesForm";
import { FinanceComponent, kycAssetTypes } from "./index";

describe("KYC - Finance", () => {
  // Mock functions and data
  const mockToggleAssetType = vi.fn();
  const mockToggleInExpanded = vi.fn();
  const mockAssetCreation = vi.fn();
  const mockAssetDelete = vi.fn();
  const mockAssetUpdate = vi.fn();
  const mockGoalsUpdate = vi.fn();

  const defaultProps = {
    assetGroups: [],
    selectedAssetsType: [],
    toggleAssetType: mockToggleAssetType,
    toggleInExpanded: mockToggleInExpanded,
    isExpanded: [],
    assetCreation: mockAssetCreation,
    assetDelete: mockAssetDelete,
    assetUpdate: mockAssetUpdate,
    isFinancesMutationsLoading: false,
    isAssetGroupsQueryLoading: false,
    goalsData: undefined,
    goalsUpdate: mockGoalsUpdate,
    isGoalsMutationsLoading: false,
  };

  beforeEach(() => {
    mockRouterSetup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetRouterMocks();
  });

  it("should render all finance type checkboxes", async () => {
    render(<FinanceComponent {...defaultProps} />);

    // Check if all finance type checkboxes are rendered
    waitFor(() => {
      for (const assetType of kycAssetTypes) {
        const checkbox = screen.getByTestId(
          `finance-checkbox-${assetType.value}`
        );
        expect(checkbox).toBeInTheDocument();
      }
    });
  });

  it("should show section when checkbox is checked", async () => {
    // Create arrays of all asset type values
    const allAssetTypes = kycAssetTypes.map((assetType) => assetType.value);

    // Setup mock asset groups to be rendered
    const mockAssetGroups = allAssetTypes.map((assetType) => ({
      group: assetType,
      assets: [],
      amount: 0,
    }));

    render(
      <FinanceComponent
        {...defaultProps}
        assetGroups={mockAssetGroups}
        selectedAssetsType={allAssetTypes} // Pre-set all asset types as selected
        isExpanded={allAssetTypes.map((type) => type.toString())} // Pre-set all sections as expanded
      />
    );

    await waitFor(() => {
      for (const assetType of kycAssetTypes) {
        // Check if the section for this asset type is rendered
        const section = screen.getByTestId(
          `finance-section-${assetType.value}`
        );
        expect(section).toBeInTheDocument();
      }
    });
  });

  it("should render all inputs in BankingForm", async () => {
    render(
      <BankingForm
        onSubmit={() => console.log("Form submitted")}
        isLoading={false}
      />
    );

    await waitFor(() => {
      // Check for all input fields
      expect(screen.getByTestId("banking-categoryName")).toBeInTheDocument();
      expect(screen.getByTestId("banking-bankName")).toBeInTheDocument();
      expect(screen.getByTestId("banking-amount")).toBeInTheDocument();
      expect(screen.getByTestId("banking-currency")).toBeInTheDocument();
      expect(screen.getByTestId("banking-date")).toBeInTheDocument();

      // Check for submit button
      expect(screen.getByTestId("banking-submit")).toBeInTheDocument();
    });
  });

  it("should render all inputs in SecuritiesForm", async () => {
    render(
      <SecuritiesForm
        onSubmit={() => console.log("Form submitted")}
        isLoading={false}
      />
    );

    await waitFor(() => {
      // Check for all input fields
      expect(screen.getByTestId("securities-categoryName")).toBeInTheDocument();
      expect(screen.getByTestId("securities-name")).toBeInTheDocument();
      expect(
        screen.getByTestId("securities-accountNumber")
      ).toBeInTheDocument();
      expect(screen.getByTestId("securities-openDate")).toBeInTheDocument();
      expect(
        screen.getByTestId("securities-transfersAmount")
      ).toBeInTheDocument();

      // Check for submit button
      expect(screen.getByTestId("securities-submit")).toBeInTheDocument();
    });
  });

  it("should render all inputs in LifeInsuranceCapitalizationForm", async () => {
    render(
      <LifeInsuranceCapitalizationForm
        onSubmit={() => console.log("Form submitted")}
        isLoading={false}
      />
    );

    await waitFor(() => {
      // Check for all input fields
      expect(
        screen.getByTestId("lifeInsuranceCapitalization-contractName")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("lifeInsuranceCapitalization-accountNumber")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("lifeInsuranceCapitalization-insuranceCompany")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("lifeInsuranceCapitalization-date")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("lifeInsuranceCapitalization-beneficiaryClause")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("lifeInsuranceCapitalization-transfersAmount")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("lifeInsuranceCapitalization-scheduledPayment")
      ).toBeInTheDocument();

      // Check for submit button
      expect(
        screen.getByTestId("lifeInsuranceCapitalization-submit")
      ).toBeInTheDocument();
    });
  });

  it("should render all inputs in RetirementEmployeeForm", async () => {
    render(
      <RetirementEmployeeForm
        onSubmit={() => console.log("Form submitted")}
        isLoading={false}
      />
    );

    await waitFor(() => {
      // Check for all input fields
      expect(
        screen.getByTestId("retirementEmployee-contractName")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("retirementEmployee-accountNumber")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("retirementEmployee-insuranceCompany")
      ).toBeInTheDocument();
      expect(screen.getByTestId("retirementEmployee-date")).toBeInTheDocument();
      expect(
        screen.getByTestId("retirementEmployee-beneficiaryClause")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("retirementEmployee-transfersAmount")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("retirementEmployee-scheduledPayment")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("retirementEmployee-accountType")
      ).toBeInTheDocument();

      // Check for submit button
      expect(
        screen.getByTestId("retirementEmployee-submit")
      ).toBeInTheDocument();
    });
  });

  it("should render all inputs in CrowdfundingForm", async () => {
    render(
      <CrowdfundingForm
        onSubmit={() => console.log("Form submitted")}
        isLoading={false}
      />
    );

    await waitFor(() => {
      // Check for all input fields
      expect(screen.getByTestId("crowdfunding-provider")).toBeInTheDocument();
      expect(
        screen.getByTestId("crowdfunding-investDomain")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("crowdfunding-investedCapital")
      ).toBeInTheDocument();
      expect(screen.getByTestId("crowdfunding-yield")).toBeInTheDocument();
      expect(screen.getByTestId("crowdfunding-startDate")).toBeInTheDocument();
      expect(screen.getByTestId("crowdfunding-endDate")).toBeInTheDocument();

      // Check for submit button
      expect(screen.getByTestId("crowdfunding-submit")).toBeInTheDocument();
    });
  });

  it("should render all inputs in PrivateEquityForm", async () => {
    render(
      <PrivateEquityForm
        onSubmit={() => console.log("Form submitted")}
        isLoading={false}
      />
    );

    await waitFor(() => {
      // Check for all input fields
      expect(screen.getByTestId("privateEquity-name")).toBeInTheDocument();
      expect(screen.getByTestId("privateEquity-valuation")).toBeInTheDocument();
      expect(screen.getByTestId("privateEquity-ownership")).toBeInTheDocument();
      expect(
        screen.getByTestId("privateEquity-socialCapital")
      ).toBeInTheDocument();
      expect(screen.getByTestId("privateEquity-unitPrice")).toBeInTheDocument();
      expect(screen.getByTestId("privateEquity-quantity")).toBeInTheDocument();
      expect(screen.getByTestId("privateEquity-value")).toBeInTheDocument();

      // Check for submit button
      expect(screen.getByTestId("privateEquity-submit")).toBeInTheDocument();
    });
  });

  it("should render all inputs in BenefitsForm", async () => {
    render(
      <BenefitsForm
        onSubmit={() => console.log("Form submitted")}
        isLoading={false}
      />
    );

    await waitFor(() => {
      // Check for basic form fields
      expect(screen.getByTestId("benefits-accountNumber")).toBeInTheDocument();
      expect(
        screen.getByTestId("benefits-insuranceCompany")
      ).toBeInTheDocument();
      expect(screen.getByTestId("benefits-name")).toBeInTheDocument();
      expect(screen.getByTestId("benefits-date")).toBeInTheDocument();
      expect(
        screen.getByTestId("benefits-scheduledPayment")
      ).toBeInTheDocument();

      // Check for guarantee checkboxes specific to this form
      expect(
        screen.getByTestId("benefits-maintenanceSalaryIsChecked")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("benefits-maintenanceDisabilityIsChecked")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("benefits-maintenanceDeathIsChecked")
      ).toBeInTheDocument();

      // Check for submit button
      expect(screen.getByTestId("benefits-submit")).toBeInTheDocument();
    });
  });

  it("should render all inputs in RockPaperForm", async () => {
    render(
      <RockPaperForm
        onSubmit={() => console.log("Form submitted")}
        isLoading={false}
      />
    );

    await waitFor(() => {
      // Check for all input fields
      expect(screen.getByTestId("rockPaper-name")).toBeInTheDocument();
      expect(screen.getByTestId("rockPaper-accountNumber")).toBeInTheDocument();
      expect(
        screen.getByTestId("rockPaper-insuranceCompany")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("rockPaper-transfersAmount")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("rockPaper-scheduledPayment")
      ).toBeInTheDocument();

      // Check for submit button
      expect(screen.getByTestId("rockPaper-submit")).toBeInTheDocument();
    });
  });

  it("should render all inputs in ExoticForm", async () => {
    render(
      <ExoticForm
        onSubmit={() => console.log("Form submitted")}
        isLoading={false}
      />
    );

    await waitFor(() => {
      // Check for all input fields
      expect(screen.getByTestId("exotic-name")).toBeInTheDocument();
      expect(screen.getByTestId("exotic-category")).toBeInTheDocument();
      expect(screen.getByTestId("exotic-buyingValue")).toBeInTheDocument();
      expect(screen.getByTestId("exotic-currentValue")).toBeInTheDocument();
      expect(screen.getByTestId("exotic-quantity")).toBeInTheDocument();
      expect(screen.getByTestId("exotic-ownership")).toBeInTheDocument();
      expect(screen.getByTestId("exotic-currency")).toBeInTheDocument();
      expect(screen.getByTestId("exotic-date")).toBeInTheDocument();

      // Check for submit button
      expect(screen.getByTestId("exotic-submit")).toBeInTheDocument();
    });
  });
});
