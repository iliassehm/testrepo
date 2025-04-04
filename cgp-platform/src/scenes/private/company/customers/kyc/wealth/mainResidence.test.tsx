import { beforeEach, describe, expect, it, vi } from "vitest";

import { mainResidenceMock } from "../../../../../../mocks/handlers/mock";
import {
  mockRouterSetup,
  resetRouterMocks,
} from "../../../../../../mocks/test/react-query.setup";
import { render, screen, waitFor } from "../../../../../../tests/test-utils";
import MainResidenceForm from "./forms/MainResidenceForm";

// Mock Google Places Autocomplete
vi.mock("react-google-places-autocomplete", () => ({
  default: ({ selectProps }: any) => (
    <div data-testid="mainResidence-source">
      <input
        type="text"
        onChange={(e) =>
          selectProps.onChange({
            value: { description: e.target.value },
            label: e.target.value,
          })
        }
        value={selectProps.value?.label || ""}
      />
    </div>
  ),
}));

describe("KYC - Client", () => {
  const mainResidence = mainResidenceMock();

  beforeEach(() => {
    mockRouterSetup();
    vi.clearAllMocks();

    // Mock the Google Maps script
    const mockScript = document.createElement("script");
    mockScript.setAttribute("src", `https://maps.googleapis.com/maps/api/js`);
    document.head.appendChild(mockScript);
  });

  afterEach(() => {
    resetRouterMocks();
    // Clean up the mock script
    document.head.querySelector('script[src*="maps.googleapis.com"]')?.remove();
  });

  it("Should renders fields", async () => {
    render(
      <MainResidenceForm
        mainResidence={mainResidence}
        onSubmit={() => console.log("Form submitted")}
        isLoading={false}
      />
    );
    await waitFor(() => {
      // Name section
      expect(screen.getByTestId("mainResidence-name")).toBeInTheDocument();
      // Location section
      expect(screen.getByTestId("mainResidence-source")).toBeInTheDocument();

      // Type section
      expect(screen.getByTestId("mainResidence-typeId")).toBeInTheDocument();

      expect(
        screen.getByTestId("mainResidence-buyingDate")
      ).toBeInTheDocument();

      expect(screen.getByTestId("mainResidence-price")).toBeInTheDocument();

      expect(screen.getByTestId("mainResidence-ownership")).toBeInTheDocument();

      expect(
        screen.getByTestId("mainResidence-annualRevenues")
      ).toBeInTheDocument();

      expect(screen.getByTestId("mainResidence-valuation")).toBeInTheDocument();
    });
  });
});
