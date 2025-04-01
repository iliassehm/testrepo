import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  mockRouterSetup,
  resetRouterMocks,
} from "../../../../../../mocks/test/react-query.setup";
import { render, screen, waitFor } from "../../../../../../tests/test-utils";
import { AssetGroup } from "../../../../../../types";
import CustomerRealEstateAssetForm from "./forms/CustomerRealEstateAssetForm";

// Mock Google Places Autocomplete
vi.mock("react-google-places-autocomplete", () => ({
  default: ({ selectProps }: any) => (
    <div data-testid="realEstate-source">
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

describe("Wealth - Real Estate Form", () => {
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

  it("Should render all fields", async () => {
    render(
      <CustomerRealEstateAssetForm
        onSubmit={() => console.log("Form submitted")}
        isLoading={false}
        currentGroup={AssetGroup.HeritageRealEstate}
      />
    );

    await waitFor(() => {
      // Name section
      expect(screen.getByTestId("realEstate-name")).toBeInTheDocument();

      // Location section
      expect(screen.getByTestId("realEstate-source")).toBeInTheDocument();

      // Type section
      expect(screen.getByTestId("realEstate-typeId")).toBeInTheDocument();

      // Date section
      expect(screen.getByTestId("realEstate-buyingDate")).toBeInTheDocument();

      // Price section
      expect(screen.getByTestId("realEstate-price")).toBeInTheDocument();

      // Ownership section
      expect(screen.getByTestId("realEstate-ownership")).toBeInTheDocument();

      // Annual Revenues section
      expect(
        screen.getByTestId("realEstate-annualRevenues")
      ).toBeInTheDocument();

      // Valuation section
      expect(screen.getByTestId("realEstate-valuation")).toBeInTheDocument();

      // Submit button
      expect(screen.getByTestId("realEstate-submit")).toBeInTheDocument();
    });
  });
});
