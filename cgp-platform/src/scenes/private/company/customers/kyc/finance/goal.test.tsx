import { useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../../../tests/test-utils";
import {
  objectivesFormData,
  ObjectivesFormDataType,
} from "../../conformity/goals/form";
import Goals from "./sections/Goals";

vi.mock("react-hook-form", () => ({
  useForm: vi.fn(),
  Controller: ({ render }: any) => render({ field: {} }),
}));

describe("Goals Component", () => {
  const mockGoalsUpdate = vi.fn();

  // Mock array of goal items where each object contains key-specific properties
  const defaultValues = {
    buildHeritage: "t",
    longTermCapital: "r",
    savingsPrecaution: "e",
    helpChildrenAmount: 0,
    buildHeritageAmount: 3,
    helpChildrenCheckbox: false,
    buildHeritageCheckbox: 1,
    fiscalityOptimization: "z",
    longTermCapitalAmount: 5,
    retirementPreparation: "a",
    longTermCapitalCheckbox: 1,
    savingsPrecautionAmount: 2,
    companyTransmissionAmount: 0,
    getAdditionalIncomeAmount: 0,
    realEstateFinancingAmount: 0,
    reduceRealEstateTaxAmount: 0,
    relativesProtectionAmount: 0,
    savingsPrecautionCheckbox: 1,
    heritageTransmissionAmount: 0,
    luxembourgInvestmentAmount: 0,
    companyTransmissionCheckbox: false,
    fiscalityOptimizationAmount: 4,
    getAdditionalIncomeCheckbox: false,
    realEstateFinancingCheckbox: false,
    reduceRealEstateTaxCheckbox: false,
    relativesProtectionCheckbox: false,
    retirementPreparationAmount: 1,
    heritageTransmissionCheckbox: false,
    luxembourgInvestmentCheckbox: false,
    fiscalityOptimizationCheckbox: 1,
    lifeIncidentsProtectionAmount: 0,
    retirementPreparationCheckbox: 1,
    lifeIncidentsProtectionCheckbox: false,
    survivingSpouseProtectionAmount: 0,
    convertToLifetimeAndCapitalAmount: 0,
    survivingSpouseProtectionCheckbox: false,
    anticipateGeographicMobilityAmount: 0,
    convertToLifetimeAndCapitalCheckbox: false,
    returnInvestmentsOptimizationAmount: 0,
    anticipateGeographicMobilityCheckbox: false,
    returnInvestmentsOptimizationCheckbox: false,
    managementDelegationToProfessionnalAmount: 0,
    managementDelegationToProfessionnalCheckbox: false,
  } as unknown as ObjectivesFormDataType;

  beforeEach(() => {
    vi.clearAllMocks();
    (useForm as any).mockReturnValue({
      handleSubmit: (fn: any) => (e: any) => {
        e.preventDefault();
        return fn(defaultValues);
      },
      control: {},
      formState: { errors: {} },
      getValues: () => defaultValues,
    });
  });

  it("should render all goal checkboxes", () => {
    render(
      <Goals
        defaultValues={{}}
        isLoading={false}
        goalsUpdate={mockGoalsUpdate}
      />
    );
    waitFor(() => {
      Object.keys(objectivesFormData).forEach((key) =>
        expect(screen.getByTestId(key)).toBeInTheDocument()
      );
    });
  });

  it("should call goalsUpdate with correct data on form submission", async () => {
    render(
      <Goals
        defaultValues={defaultValues}
        isLoading={false}
        goalsUpdate={mockGoalsUpdate}
      />
    );
    await waitFor(() => {
      fireEvent.click(screen.getByTestId("goals-submit"));

      expect(mockGoalsUpdate).toHaveBeenCalledWith({ ...defaultValues });
    });
  });
});
