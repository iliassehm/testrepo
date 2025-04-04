import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import type {
  instrumentsDataSchema,
  InvestorProfileFormInputs,
  sustainableInvestmentSchema,
} from "../../../../../../../shared/schemas/investorProfileFormSchema";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../../../tests/test-utils";
import { InvestorProfileForm } from "./investorProfileForm";

const defaultCustomer: InvestorProfileFormInputs = {
  updated: new Date().toString(),
  finalSri: 0,
  version: "2",
  personalSituation: {
    civility: null,
    familySituation: null,
    dependentsNb: 0,
    mainZipCode: "",
  },
  professionalSituation: {
    professionalStatus: null,
    currentPastProfession: null,
    agePensionEnvisage: 0,
  },
  financialSituation: {
    annualIncome: {
      employmentIncome: 0,
      investmentIncome: 0,
      companyIncome: 0,
      propertyIncome: 0,
      retirementIncome: 0,
      socialSecurityBenefits: 0,
      otherIncome: 0,
      annualIncome1Total: 0,
    },
    annualCharges: {
      taxeGeneral: 0,
      housingCosts: 0,
      otherExpenses: 0,
      livingExpenses: 0,
      financialExpenses: 0,
      educationChildcare: 0,
      entertainmentAndLeisureExpenses: 0,
      annualChargesTotal: 0,
    },
    annualAssets: {
      savings: 0,
      realEstateAndLand: 0,
      businessAssets: 0,
      otherMovablePropertyAndClaims: 0,
      annualAssetsTotal: 0,
    },
    financialAssetSituationEvolution: {},
  },
  financialKnowledgeAndExperience: {
    instruments: {
      structuredProducts: {
        knowledgeActivityInFinancialProductsInstruments: [],
      },
      ventureCapital: {
        knowledgeActivityInFinancialProductsInstruments: [],
      },
      ucits: {
        knowledgeActivityInFinancialProductsInstruments: [],
      },
      leveragedProducts: {
        knowledgeActivityInFinancialProductsInstruments: [],
      },
      savingsAccounts: {
        knowledgeActivityInFinancialProductsInstruments: [],
      },
      lifeInsurance: {
        knowledgeActivityInFinancialProductsInstruments: [],
      },
      peaSecuritiesAccount: {
        knowledgeActivityInFinancialProductsInstruments: [],
      },
      bonds: {
        knowledgeActivityInFinancialProductsInstruments: [],
      },
      euroFunds: {
        knowledgeActivityInFinancialProductsInstruments: [],
      },
      financialRealEstate: {
        knowledgeActivityInFinancialProductsInstruments: [],
      },
      equities: {
        knowledgeActivityInFinancialProductsInstruments: [],
      },
    },
    knownManagementModes: [],
    choiceManagementModes: [],
    informationSourcesForInvestments: [],
  },
  sustainableInvestment: {
    issuesMinimizeNegativeImpacts: null,
    excludeNegativeActivitiesEnvironmentalSocial: null,
    preferredASGDimension: null,
    taxonomyAlignment: null,
    includeEnvironmentalSocialGovernanceDimension: null,
  },
  attitudeTowardsRisk: {},
  budgetListData: {
    annualIncome: {
      employmentIncome: 2,
      investmentIncome: 12,
      companyIncome: 0,
      propertyIncome: 0,
      retirementIncome: 0,
      socialSecurityBenefits: 0,
      otherIncome: 0,
      annualIncome1Total: 14,
    },
    annualCharges: {
      housingCosts: 36,
      livingExpenses: 4,
      financialExpenses: 44,
      taxeGeneral: 0,
      educationChildcare: 0,
      entertainmentAndLeisureExpenses: 0,
      otherExpenses: 0,
      annualChargesTotal: 84,
    },
  },
  annualAssetsListData: {
    savings: 572259,
    realEstateAndLand: 135001,
    businessAssets: 434833460,
    otherMovablePropertyAndClaims: 15129,
    annualAssetsTotal: 435555849,
  },
};

describe("InvestorProfileForm", () => {
  const mockSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Personal infos", () => {
    it.skip("should render the form with default values", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("personalInfos.name")).toHaveValue("bob");
        expect(screen.getByTestId("personalInfos.firstName")).toHaveValue(
          "john"
        );
      });
    });
  });

  describe.skip("1. Personal Situation", () => {
    it("should calculate the correct score for 'SINGLE' with 0 dependents", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );

      await waitFor(() =>
        expect(
          screen.getByTestId("personalSituation.civility-MR")
        ).toBeInTheDocument()
      );

      // fill the form
      await waitFor(() => {
        fireEvent.click(screen.getByTestId("personalSituation.civility-MR"));
        fireEvent.click(
          screen.getByTestId("personalSituation.familySituation-SINGLE")
        );
        fireEvent.change(screen.getByTestId("personalSituation.dependentsNb"), {
          target: { value: "0" },
        });

        fireEvent.change(screen.getByTestId("personalSituation.mainZipCode"), {
          target: { value: "12345" },
        });
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simulate form submission
      });

      await waitFor(() => {
        // Expect the form to be submitted with the correct updated data
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              personalSituation: expect.objectContaining({
                civility: "MR",
                familySituation: "SINGLE",
                dependentsNb: 0,
                mainZipCode: "12345",
                score: 10, // 3 points for SINGLE + 4 points for 0 dependents
              }),
            }),
          })
        );
      });
    });

    // Test for 'FREE_UNION' with 1 dependent
    it("should calculate the correct score for 'FREE_UNION' with 1 dependent", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );

      await waitFor(() =>
        expect(
          screen.getByTestId("personalSituation.civility-MR")
        ).toBeInTheDocument()
      );

      // Fill the form
      await waitFor(() => {
        fireEvent.click(screen.getByTestId("personalSituation.civility-MR"));
        fireEvent.click(
          screen.getByTestId("personalSituation.familySituation-FREE_UNION")
        );
        fireEvent.change(screen.getByTestId("personalSituation.dependentsNb"), {
          target: { value: "1" },
        });

        fireEvent.change(screen.getByTestId("personalSituation.mainZipCode"), {
          target: { value: "54321" },
        });
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simulate form submission
      });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              personalSituation: expect.objectContaining({
                civility: "MR",
                familySituation: "FREE_UNION",
                dependentsNb: 1,
                mainZipCode: "54321",
                score: 8, // 2 points for FREE_UNION + 3 points for 1 dependent
              } as InvestorProfileFormInputs["personalSituation"]),
            }),
          })
        );
      });
    });

    // Test for 'MARRIED' with 2 dependents
    it("should calculate the correct score for 'MARRIED' with 2 dependents", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );

      await waitFor(() =>
        expect(
          screen.getByTestId("personalSituation.civility-MRS")
        ).toBeInTheDocument()
      );

      // Fill the form
      await waitFor(() => {
        fireEvent.click(screen.getByTestId("personalSituation.civility-MRS"));
        fireEvent.click(
          screen.getByTestId("personalSituation.familySituation-MARRIED")
        );
        fireEvent.change(screen.getByTestId("personalSituation.dependentsNb"), {
          target: { value: "2" },
        });

        fireEvent.change(screen.getByTestId("personalSituation.mainZipCode"), {
          target: { value: "98765" },
        });
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simulate form submission
      });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              personalSituation: expect.objectContaining({
                civility: "MRS",
                familySituation: "MARRIED",
                dependentsNb: 2,
                mainZipCode: "98765",
                score: 6, // 1 point for MARRIED + 2 points for 2 dependents
              } as InvestorProfileFormInputs["personalSituation"]),
            }),
          })
        );
      });
    });

    // Test for 'DIVORCED' with 3 dependents
    it("should calculate the correct score for 'DIVORCED' with 3 dependents", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );

      await waitFor(() =>
        expect(
          screen.getByTestId("personalSituation.civility-MR")
        ).toBeInTheDocument()
      );

      // Fill the form
      await waitFor(() => {
        fireEvent.click(screen.getByTestId("personalSituation.civility-MR"));
        fireEvent.click(
          screen.getByTestId("personalSituation.familySituation-DIVORCED")
        );
        fireEvent.change(screen.getByTestId("personalSituation.dependentsNb"), {
          target: { value: "3" },
        });

        fireEvent.change(screen.getByTestId("personalSituation.mainZipCode"), {
          target: { value: "45678" },
        });
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simulate form submission
      });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              personalSituation: expect.objectContaining({
                civility: "MR",
                familySituation: "DIVORCED",
                dependentsNb: 3,
                mainZipCode: "45678",
                score: 4, // 0 points for DIVORCED + 1 point for 3 dependents
              } as InvestorProfileFormInputs["personalSituation"]),
            }),
          })
        );
      });
    });
  });
  describe.skip("1. InvestorProfileForm - Professional Situation", () => {
    it("should calculate the correct score for 'BUSINESS_EXECUTIVES' with 'YES_CURRENT_PROFESSION' and agePensionEnvisage", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );

      await waitFor(() =>
        expect(
          screen.getByTestId("personalSituation.formationLevel-MASTER")
        ).toBeInTheDocument()
      );

      // Fill the form
      await waitFor(() => {
        fireEvent.click(
          screen.getByTestId("personalSituation.formationLevel-MASTER")
        );
        fireEvent.click(
          screen.getByTestId(
            "professionalSituation.professionalStatus-BUSINESS_EXECUTIVES"
          )
        );
        fireEvent.click(
          screen.getByTestId(
            "professionalSituation.currentPastProfession-YES_CURRENT_PROFESSION"
          )
        );
        fireEvent.change(
          screen.getByTestId("professionalSituation.agePensionEnvisage"),
          {
            target: { value: "65" },
          }
        );
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simulate form submission
      });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              personalSituation: expect.objectContaining({
                formationLevel: "MASTER",
              }),
              professionalSituation: expect.objectContaining({
                professionalStatus: "BUSINESS_EXECUTIVES",
                currentPastProfession: "YES_CURRENT_PROFESSION",
                agePensionEnvisage: 65,
                score: 24,
              } as InvestorProfileFormInputs["professionalSituation"]),
            }),
          })
        );
      });
    });

    // Add more tests for other statuses and combinations
    it("should calculate the correct score for 'ARTISANS' with 'NO' profession and agePensionEnvisage as 45", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );

      await waitFor(() =>
        expect(
          screen.getByTestId("personalSituation.formationLevel-BREVET_CAP_BEP")
        ).toBeInTheDocument()
      );

      await waitFor(() => {
        // Fill the form
        fireEvent.click(
          screen.getByTestId("personalSituation.formationLevel-BREVET_CAP_BEP")
        );
        fireEvent.click(
          screen.getByTestId(
            "professionalSituation.professionalStatus-ARTISANS"
          )
        );
        fireEvent.click(
          screen.getByTestId("professionalSituation.currentPastProfession-NO")
        );
        fireEvent.change(
          screen.getByTestId("professionalSituation.agePensionEnvisage"),
          {
            target: { value: "45" },
          }
        );
        fireEvent.click(screen.getByTestId("forms.fields.actions.save"));
      });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              personalSituation: expect.objectContaining({
                formationLevel: "BREVET_CAP_BEP",
              }),
              professionalSituation: expect.objectContaining({
                professionalStatus: "ARTISANS",
                currentPastProfession: "NO",
                agePensionEnvisage: 45,
                score: 14,
              } as InvestorProfileFormInputs["professionalSituation"]),
            }),
          })
        );
      });
    });
  });

  describe.skip("2. InvestorProfileForm - Financial Situation", () => {
    it("should calculate financial ratios and synchronize budget data when the sync button is clicked", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
          handleSyncBudget={() => {
            const updatedFinancialSituation = {
              ...defaultCustomer.budgetListData,
              annualAssets: {
                ...defaultCustomer.annualAssetsListData,
              },
            };

            mockSubmit({
              input: {
                ...defaultCustomer,
                financialSituation: updatedFinancialSituation, // Intégrer les données dans financialSituation
              } as InvestorProfileFormInputs,
            });
          }}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("financialSituation.annualIncome.employmentIncome")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("financialSituation-syncBudget")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("forms.fields.actions.save")
        ).toBeInTheDocument();
      });
      await waitFor(() => {
        // Remplir le formulaire avec des données financières
        fireEvent.change(
          screen.getByTestId(
            "financialSituation.annualIncome.employmentIncome"
          ),
          {
            target: { value: "50000" },
          }
        );
        fireEvent.change(
          screen.getByTestId(
            "financialSituation.annualIncome.investmentIncome"
          ),
          {
            target: { value: "10000" },
          }
        );
        fireEvent.change(
          screen.getByTestId("financialSituation.annualCharges.housingCosts"),
          {
            target: { value: "20000" },
          }
        );
        fireEvent.change(
          screen.getByTestId("financialSituation.annualCharges.taxeGeneral"),
          {
            target: { value: "5000" },
          }
        );
        fireEvent.change(
          screen.getByTestId("financialSituation.annualAssets.savings"),
          {
            target: { value: "100000" },
          }
        );
        fireEvent.change(
          screen.getByTestId(
            "financialSituation.annualAssets.realEstateAndLand"
          ),
          {
            target: { value: "200000" },
          }
        );
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simuler la soumission du formulaire
      });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              financialSituation: expect.objectContaining({
                annualIncome: expect.objectContaining({
                  employmentIncome: 50000,
                  investmentIncome: 10000,
                  companyIncome: 0,
                  propertyIncome: 0,
                  retirementIncome: 0,
                  socialSecurityBenefits: 0,
                  otherIncome: 0,
                  annualIncome1Total: 60000, // Placeholder pour le calcul total
                }),
                annualCharges: expect.objectContaining({
                  taxeGeneral: 5000,
                  housingCosts: 20000,
                  otherExpenses: 0,
                  livingExpenses: 0,
                  financialExpenses: 0,
                  educationChildcare: 0,
                  entertainmentAndLeisureExpenses: 0,
                  annualChargesTotal: 25000, // Placeholder pour le calcul total
                }),
                annualAssets: expect.objectContaining({
                  savings: 100000,
                  realEstateAndLand: 200000,
                  businessAssets: 0,
                  otherMovablePropertyAndClaims: 0,
                  annualAssetsTotal: 300000, // Placeholder pour le calcul total
                }),
              }),
            }),
          })
        );
      });

      await waitFor(() => {
        fireEvent.click(screen.getByTestId("financialSituation-syncBudget"));
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simuler la soumission du formulaire
      });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              financialSituation: expect.objectContaining({
                annualIncome: expect.objectContaining({
                  employmentIncome: 2,
                  investmentIncome: 12,
                  companyIncome: 0,
                  propertyIncome: 0,
                  retirementIncome: 0,
                  socialSecurityBenefits: 0,
                  otherIncome: 0,
                  annualIncome1Total: 14,
                }),
                annualCharges: expect.objectContaining({
                  housingCosts: 36,
                  livingExpenses: 4,
                  financialExpenses: 44,
                  taxeGeneral: 0,
                  educationChildcare: 0,
                  entertainmentAndLeisureExpenses: 0,
                  otherExpenses: 0,
                  annualChargesTotal: 84,
                }),
                annualAssets: expect.objectContaining({
                  savings: 572259,
                  realEstateAndLand: 135001,
                  businessAssets: 434833460,
                  otherMovablePropertyAndClaims: 15129,
                  annualAssetsTotal: 435555849,
                }),
              }),
            }),
          })
        );
      });
    });
    it("should calculate the correct score for the evolution of financial situation", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );
      await waitFor(() =>
        expect(
          screen.getByTestId(
            "financialSituation.financialAssetSituationEvolution.professionalIncomeComingEvolution-INCREASE_SIGNIFICANTLY"
          )
        ).toBeInTheDocument()
      );
      // Fill the form with financial evolution data
      await waitFor(() => {
        fireEvent.click(
          screen.getByTestId(
            "financialSituation.financialAssetSituationEvolution.professionalIncomeComingEvolution-INCREASE_SIGNIFICANTLY"
          )
        );
        fireEvent.click(
          screen.getByTestId(
            "financialSituation.financialAssetSituationEvolution.heritageComingEvolution-INCREASE_SIGNIFICANTLY"
          )
        );
        fireEvent.click(
          screen.getByTestId(
            "financialSituation.financialAssetSituationEvolution.incomeForUnexpectedExpenses-20%"
          )
        );
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simulate form submission
      });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              financialSituation: expect.objectContaining({
                financialAssetSituationEvolution: expect.objectContaining({
                  professionalIncomeComingEvolution: "INCREASE_SIGNIFICANTLY",
                  heritageComingEvolution: "INCREASE_SIGNIFICANTLY",
                  incomeForUnexpectedExpenses: "20%",
                }),
              }),
            }),
          })
        );
      });
    });
    it("should calculate the correct score for financial ratios with high values", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );
      await waitFor(() =>
        expect(
          screen.getByTestId("financialSituation.annualIncome.employmentIncome")
        ).toBeInTheDocument()
      );

      // Remplir le formulaire avec des données financières
      await waitFor(() => {
        fireEvent.change(
          screen.getByTestId(
            "financialSituation.annualIncome.employmentIncome"
          ),
          {
            target: { value: "500000" },
          }
        );
        fireEvent.change(
          screen.getByTestId(
            "financialSituation.annualIncome.investmentIncome"
          ),
          {
            target: { value: "1000000" },
          }
        );
        fireEvent.change(
          screen.getByTestId("financialSituation.annualCharges.housingCosts"),
          {
            target: { value: "2000000" },
          }
        );
        fireEvent.change(
          screen.getByTestId("financialSituation.annualCharges.taxeGeneral"),
          {
            target: { value: "500000" },
          }
        );
        fireEvent.change(
          screen.getByTestId("financialSituation.annualAssets.savings"),
          {
            target: { value: "1000000" },
          }
        );
        fireEvent.change(
          screen.getByTestId(
            "financialSituation.annualAssets.realEstateAndLand"
          ),
          {
            target: { value: "2000000" },
          }
        );
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simulate form submission
      });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              financialSituation: expect.objectContaining({
                annualIncome: expect.objectContaining({
                  employmentIncome: 500000,
                  investmentIncome: 1000000,
                }),
                annualCharges: expect.objectContaining({
                  housingCosts: 2000000,
                  taxeGeneral: 500000,
                }),
                annualAssets: expect.objectContaining({
                  savings: 1000000,
                  realEstateAndLand: 2000000,
                }),
              }),
            }),
          })
        );
      });
    });
    it("should calculate the correct score for financial evolution with decreased income", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );
      await waitFor(() =>
        expect(
          screen.getByTestId(
            "financialSituation.financialAssetSituationEvolution.professionalIncomeComingEvolution-DECREASE_SLIGHTLY"
          )
        ).toBeInTheDocument()
      );
      // Fill the form with financial evolution data
      await waitFor(() => {
        fireEvent.click(
          screen.getByTestId(
            "financialSituation.financialAssetSituationEvolution.professionalIncomeComingEvolution-DECREASE_SLIGHTLY"
          )
        );
        fireEvent.click(
          screen.getByTestId(
            "financialSituation.financialAssetSituationEvolution.heritageComingEvolution-DECREASE_SLIGHTLY"
          )
        );
        fireEvent.click(
          screen.getByTestId(
            "financialSituation.financialAssetSituationEvolution.incomeForUnexpectedExpenses-5%"
          )
        );
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simulate form submission
      });

      console.log(mockSubmit.mock.calls);
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              financialSituation: expect.objectContaining({
                financialAssetSituationEvolution: expect.objectContaining({
                  professionalIncomeComingEvolution: "DECREASE_SLIGHTLY",
                  heritageComingEvolution: "DECREASE_SLIGHTLY",
                  incomeForUnexpectedExpenses: "5%",
                }),
              }),
            }),
          })
        );
      });
    });
  });

  describe.skip("3. InvestorProfileForm - Financial Knowledge and Experience", () => {
    it("should calculate the correct data for equities with good knowledge and multiple activities", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );

      //   equities.knowledgeActivityInFinancialProductsInstruments.0.KNOWLEDGE
      await waitFor(() =>
        expect(
          screen.getByTestId(
            "equities.knowledgeActivityInFinancialProductsInstruments.0.KNOWLEDGE.none"
          )
        ).toBeInTheDocument()
      );

      // Fill the form for equities
      await waitFor(() => {
        fireEvent.click(
          screen.getByTestId(
            "equities.knowledgeActivityInFinancialProductsInstruments.0.KNOWLEDGE.none"
          )
        );

        fireEvent.click(
          screen.getByTestId(
            "equities.knowledgeActivityInFinancialProductsInstruments.0.RISK_CAPITAL_LOSS"
          )
        );

        fireEvent.click(
          screen.getByTestId(
            "equities.knowledgeActivityInFinancialProductsInstruments.0.HOLDINGS"
          )
        );

        fireEvent.click(
          screen.getByTestId("equities.transactionsNumberLast12Months.0.LESS_3")
        );

        fireEvent.click(
          screen.getByTestId(
            "equities.investmentsAmountMadeLast12Months.0.LESS_1000"
          )
        );
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simulate form submission
      });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              financialKnowledgeAndExperience: expect.objectContaining({
                instruments: expect.objectContaining({
                  equities: expect.objectContaining({
                    knowledge: "none",
                    transactionsNumberLast12Months: "LESS_3",
                    investmentsAmountMadeLast12Months: "LESS_1000",
                  } satisfies z.infer<typeof instrumentsDataSchema>),
                }),
              }),
            }),
          })
        );
      });
    });

    it("should calculate the correct data for bonds with basic knowledge and less than 3 transactions", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );

      await waitFor(() =>
        expect(
          screen.getByTestId(
            "bonds.knowledgeActivityInFinancialProductsInstruments.1.KNOWLEDGE.basic"
          )
        ).toBeInTheDocument()
      );

      // Fill the form for bonds
      await waitFor(() => {
        fireEvent.click(
          screen.getByTestId(
            "bonds.knowledgeActivityInFinancialProductsInstruments.1.KNOWLEDGE.basic"
          )
        );
        fireEvent.click(
          screen.getByTestId(
            "bonds.knowledgeActivityInFinancialProductsInstruments.1.RISK_CAPITAL_LOSS"
          )
        );
        fireEvent.click(
          screen.getByTestId("bonds.transactionsNumberLast12Months.1.LESS_3")
        );
        fireEvent.click(
          screen.getByTestId(
            "bonds.investmentsAmountMadeLast12Months.1.BETWEEN_1000_10000"
          )
        );
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simulate form submission
      });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              financialKnowledgeAndExperience: expect.objectContaining({
                instruments: expect.objectContaining({
                  bonds: expect.objectContaining({
                    knowledge: "basic",
                    transactionsNumberLast12Months: "LESS_3",
                    investmentsAmountMadeLast12Months: "BETWEEN_1000_10000",
                  } satisfies z.infer<typeof instrumentsDataSchema>),
                }),
              }),
            }),
          })
        );
      });
    });
  });
  describe.skip("InvestorProfileForm - Sustainable Investment", () => {
    it("should calculate the correct score for including ESG dimensions and defining sustainability component", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );
      await waitFor(() =>
        expect(
          screen.getByTestId(
            "sustainableInvestment.includeEnvironmentalSocialGovernanceDimension-YES"
          )
        ).toBeInTheDocument()
      );
      // Fill the form with ESG data
      await waitFor(() => {
        fireEvent.click(
          screen.getByTestId(
            "sustainableInvestment.includeEnvironmentalSocialGovernanceDimension-YES"
          )
        );
        fireEvent.click(
          screen.getByTestId(
            "sustainableInvestment.optionsDefineSustainabilityComponent-DEFINE_IT_PRECISELY_ANSWERING_4_QUESTIONS"
          )
        );
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simulate form submission
      });
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              sustainableInvestment: expect.objectContaining({
                includeEnvironmentalSocialGovernanceDimension: "YES",
                optionsDefineSustainabilityComponent:
                  "DEFINE_IT_PRECISELY_ANSWERING_4_QUESTIONS",
                score: 2,
              }),
            }),
          })
        );
      });
    });
    it("should calculate the correct score for preferred ESG dimension and excluding negative activities", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );
      await waitFor(() =>
        expect(
          screen.getByTestId(
            "sustainableInvestment.includeEnvironmentalSocialGovernanceDimension-YES"
          )
        ).toBeInTheDocument()
      );
      // Fill the form with preferred ESG dimension
      await waitFor(() => {
        fireEvent.click(
          screen.getByTestId(
            "sustainableInvestment.includeEnvironmentalSocialGovernanceDimension-YES"
          )
        );

        fireEvent.click(
          screen.getByTestId(
            "sustainableInvestment.preferredASGDimension-ENVIRONMENTAL"
          )
        );
        fireEvent.click(
          screen.getByTestId(
            "sustainableInvestment.excludeNegativeActivitiesEnvironmentalSocial-YES"
          )
        );
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simulate form submission
      });
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              sustainableInvestment: expect.objectContaining({
                preferredASGDimension: "ENVIRONMENTAL",
                excludeNegativeActivitiesEnvironmentalSocial: "YES",
                score: 1.5,
              } as z.infer<typeof sustainableInvestmentSchema>),
            }),
          })
        );
      });
    });
    it("should handle issues to minimize negative impacts and calculate the correct bonus score", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );
      await waitFor(() =>
        expect(
          screen.getByTestId(
            "sustainableInvestment.includeEnvironmentalSocialGovernanceDimension-YES"
          )
        ).toBeInTheDocument()
      );
      // Fill the form with ESG issues to minimize
      await waitFor(() => {
        fireEvent.click(
          screen.getByTestId(
            "sustainableInvestment.includeEnvironmentalSocialGovernanceDimension-YES"
          )
        );
        fireEvent.click(
          screen.getByTestId(
            "sustainableInvestment.excludeNegativeActivitiesEnvironmentalSocial-YES"
          )
        );
        fireEvent.click(
          screen.getByTestId(
            "sustainableInvestment.includeEnvironmentalSocialGovernanceDimension-YES"
          )
        );
        fireEvent.click(
          screen.getByTestId(
            "sustainableInvestment.issuesMinimizeNegativeImpacts._4-3"
          )
        );
        fireEvent.click(
          screen.getByTestId(
            "sustainableInvestment.issuesMinimizeNegativeImpacts._1-0"
          )
        );
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simulate form submission
      });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              sustainableInvestment: expect.objectContaining({
                issuesMinimizeNegativeImpacts: expect.arrayContaining([
                  "GREENHOUSE_GASES",
                  "WATER",
                ]),
                score: 1.2,
              } as z.infer<typeof sustainableInvestmentSchema>),
            }),
          })
        );
      });
    });

    it("should calculate correct score for no ESG inclusion", async () => {
      render(
        <InvestorProfileForm
          defaultValue={defaultCustomer}
          onSubmit={mockSubmit}
          disableAutoSubmit={true}
        />
      );
      await waitFor(() =>
        expect(
          screen.getByTestId(
            "sustainableInvestment.includeEnvironmentalSocialGovernanceDimension-NO"
          )
        ).toBeInTheDocument()
      );
      // Fill the form with no ESG inclusion
      await waitFor(() => {
        fireEvent.click(
          screen.getByTestId(
            "sustainableInvestment.includeEnvironmentalSocialGovernanceDimension-NO"
          )
        );
        fireEvent.click(screen.getByTestId("forms.fields.actions.save")); // Simulate form submission
      });

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenLastCalledWith(
          expect.objectContaining({
            input: expect.objectContaining({
              sustainableInvestment: expect.objectContaining({
                includeEnvironmentalSocialGovernanceDimension: "NO",
                score: 0,
              } as z.infer<typeof sustainableInvestmentSchema>),
            }),
          })
        );
      });
    });
  });
});
