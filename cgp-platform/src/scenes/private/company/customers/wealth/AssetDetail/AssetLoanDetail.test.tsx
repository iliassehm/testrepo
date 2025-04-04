import { render, screen } from "@testing-library/react";

import { AssetGroup, CustomerAsset, Treatement } from "../../../../../../types";
import { AssetLoanDetail } from "./AssetLoanDetail";

describe("AssetLoanDetail", () => {
  const customerID = "123";

  const asset: CustomerAsset = {
    group: AssetGroup.Banking,
    id: "28d85ceb-4a5a-43e1-91d3-949aaff1ba36",
    isManual: true,
    name: "assetName",
    underManagement: true,
    metadata: {
      interests: 3.5,
      start: new Date(),
      applicationFee: 100,
      type: "amortissable",
      monthlyPayment: 20,
      assuranceFee: 30,
      duration: 30,
      amountLocked: 60,
      loanedAmount: 10000,
      loanOwnership: 1,
    },
    owners: [
      {
        entity: {
          id: "123",
          conformity: Treatement.Waiting,
          created: new Date(),
          updated: new Date(),
          name: "Name",
          wealth: "100000",
        },
        ownership: 1,
      },
    ],
  };

  it("renders loan type correctly", async () => {
    render(<AssetLoanDetail asset={asset} customerID={customerID} />);

    expect(screen.getByText("Prêt amortissable")).toBeInTheDocument();
  });

  it("renders loan start date correctly", () => {
    render(<AssetLoanDetail asset={asset} customerID={customerID} />);

    const startDate = new Date(asset.metadata.start).toLocaleDateString();
    expect(screen.getByText(startDate)).toBeInTheDocument();
  });

  it("renders interest rate correctly", () => {
    render(<AssetLoanDetail asset={asset} customerID={customerID} />);

    expect(screen.getByText("3,50 %")).toBeInTheDocument();
  });

  it("renders insurance fee correctly", () => {
    render(<AssetLoanDetail asset={asset} customerID={customerID} />);

    expect(screen.getByText("30,00 €")).toBeInTheDocument();
  });

  it("renders monthly payment correctly", () => {
    render(<AssetLoanDetail asset={asset} customerID={customerID} />);

    expect(screen.getByText("20,00 €")).toBeInTheDocument();
  });

  it("renders application fee correctly", () => {
    render(<AssetLoanDetail asset={asset} customerID={customerID} />);

    expect(screen.getByText("100,00 €")).toBeInTheDocument();
  });

  it("renders loan ownership correctly", () => {
    render(<AssetLoanDetail asset={asset} customerID={customerID} />);

    expect(screen.getByText("100 %")).toBeInTheDocument();
  });
});
