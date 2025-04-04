import { faker } from "@faker-js/faker/locale/af_ZA";
import { graphql, HttpResponse } from "msw";

import {
  AssetDetailQuery,
  AssetFilters,
  AssetGroup,
  AssetTypeWealthQuery,
  AuthenticatedQuery,
  BudgetQuery,
  CampaignsDocumentListQuery,
  CampaignsQuery,
  CompanyComplianceQuery,
  CompanyQuery,
  ConformityDocumentQuery,
  ConnectorListQuery,
  ConnectorQuery,
  CustomerConformityObjectivesQuery,
  CustomerConformityQuery,
  CustomerFiscalityQuery,
  CustomerInformationsQuery,
  CustomerRelationQuery,
  CustomerSearchQuery,
  CustomersInput,
  CustomersQuery,
  CustomerWalletQuery,
  CustomerWealthQuery,
  DocumentCustomerListQuery,
  DocumentTemplateListQuery,
  EnvelopDocumentTemplateListQuery,
  EnvelopeListQuery,
  GedDocumentCategoryListQuery,
  GetPubliFormFillingQuery,
  GetUsersInCustomerReferenceQuery,
  GlobalWealthQuery,
  HoldingQueriesQuery,
  HomeQuery,
  InstrumentFiltersQuery,
  InstrumentListingQuery,
  InvestorProfileQuery,
  InvestorProfileStatsQuery,
  LayoutCustomerQuery,
  LayoutQuery,
  LayoutSubWealthQuery,
  ManagerClaims,
  ManagerInvitePendingListQuery,
  MigratorListQuery,
  MigratorQuery,
  ScpiListQuery,
  SearchCampaignQuery,
  SearchInstrumentQuery,
  SubWealthQuery,
  UnderManagementAssetGroupsQuery,
  WealthUnderManagmentQuery,
} from "./../../types";
import {
  ConnectionState,
  CustomerLcbQuery,
  CustomerPlan,
  WealthAndPerformanceQuery,
} from "./../../types/entities/generated/graphql";
import {
  assetTypeListMock,
  authentificatedManagerMock,
  budgetListMock,
  campagnListMock,
  companyAssetTypeWealthMock,
  companyDocumentListMock,
  companyListMock,
  complianceMock,
  connectorListMock,
  customerConformityEnvelopListsMock,
  customerDetailsMock,
  customerListMock,
  customerMock,
  customerRelationMock,
  customerWalletListMock,
  documentCategoryListMock,
  documentTemplateListMock,
  holdingMock,
  investorProfileFormMock,
  managerInvitationListMock,
  migratorListMock,
} from "./mock";

// Home
export function homeMockQuery() {
  return graphql.query<HomeQuery>("Home", ({ variables }) => {
    const {
      input: { skip = 0, limit = 6 },
    } = variables;

    const filteredCustomerList = customerListMock().map((e) => ({
      node: { ...e, underManagement: 0 },
      cursor: e.id,
    }));

    return HttpResponse.json({
      data: {
        listCompanyTask: {
          lateCount: 0,
          edges: [],
        },
        projectCompanyList: [],
        company: {
          ...companyListMock()[0],
          customerList: {
            totalCount: filteredCustomerList.length,
            edges: filteredCustomerList.splice(skip, limit),
          },
        },
        customersCompliance: complianceMock(),
        mostOccuringAssetType: {
          group: AssetGroup.LifeInsuranceCapitalization,
          count: 3,
        },
        liquidity: {
          value: 100,
          instrument: "EUR",
        },
      },
    });
  });
}

// customer Fiscality
export function customerFiscalityMockQuery() {
  return graphql.query<CustomerFiscalityQuery>("CustomerFiscality", () => {
    const customer = customerMock();

    return HttpResponse.json({
      data: {
        customer,
      },
    });
  });
}

// customer Informations
export function customerInformationsMockQuery() {
  return graphql.query<CustomerInformationsQuery>(
    "CustomerInformations",
    () => {
      const customer = customerMock();

      return HttpResponse.json({
        data: {
          customer,
        },
      });
    }
  );
}

// GetUsersInCustomerReference
export function getUsersInCustomerReferenceMockQuery() {
  return graphql.query<GetUsersInCustomerReferenceQuery>(
    "GetUsersInCustomerReference",
    () => {
      const customer = customerMock();

      return HttpResponse.json({
        data: {
          users: [customer],
        },
      });
    }
  );
}

// customer ConformityObjectives
export function customerConformityObjectivesMockQuery() {
  return graphql.query<CustomerConformityObjectivesQuery>(
    "CustomerConformityObjectives",
    () => {
      const customer = customerMock();

      return HttpResponse.json({
        data: {
          customer: {
            ...customer,
            conformityObjectives: {
              retirementPreparation: 1,
              fiscalityOptimization: 2,
              savingsPrecaution: 3,
              monthlySavings: 33,
              precautionarySavingsAmount: 34,
            },
          },
        },
      });
    }
  );
}

// Customers
export function customersMockQuery() {
  return graphql.query<CustomersQuery>("Customers", ({ variables }) => {
    const input: CustomersInput = variables.input || {};

    const customerList = customerListMock();

    const limit = input.limit || customerList.length;

    return HttpResponse.json({
      data: {
        company: {
          ...companyListMock()[0],
          customerList: {
            totalCount: customerList.length,
            edges: customerList.splice(0, limit).map((e) => ({
              node: e,
            })),
          },
        },
      },
    });
  });
}

// DocumentCustomerList
export function documentCustomerListMockQuery() {
  return graphql.query<DocumentCustomerListQuery>(
    "DocumentCustomerList",
    ({ variables }) => {
      const { input } = variables;

      const filteredCustomerDocumentList = companyDocumentListMock()
        // name
        .filter(
          (e) =>
            !e.customer.name ||
            e.customer.name.toLowerCase().includes(input.name.toLowerCase())
        )
        .map((e) => ({
          node: e,
          cursor: e.id,
        }));

      return HttpResponse.json({
        data: {
          documentCustomerList: {
            category: { key: "arbitrary", name: "ARBITRARY" },
            totalCount: filteredCustomerDocumentList.length,
            edges: filteredCustomerDocumentList.splice(input.skip, input.limit),
          },
        },
      });
    }
  );
}

// Campaigns
export function campaignsMockQuery() {
  return graphql.query<CampaignsQuery>("Campaigns", () => {
    return HttpResponse.json({
      data: {
        campaignList: campagnListMock(),
      },
    });
  });
}

// Campaigns Search
export function searchCampaignsMockQuery() {
  return graphql.query<SearchCampaignQuery>("SearchCampaign", () => {
    return HttpResponse.json({
      data: {
        searchCampaign: campagnListMock(),
      },
    });
  });
}

// Document template
export function documentTemplateListMockQuery() {
  return graphql.query<DocumentTemplateListQuery>(
    "DocumentTemplateList",
    () => {
      const documentTemplateList = documentTemplateListMock();

      return HttpResponse.json({
        data: {
          documentTemplateList,
          favorites: documentTemplateList.filter((_, index) => index % 2 === 0),
        },
      });
    }
  );
}

// Document template
export function envelopDocumentTemplateListMockQuery() {
  return graphql.query<EnvelopDocumentTemplateListQuery>(
    "EnvelopDocumentTemplateList",
    () => {
      const documentTemplateList = documentTemplateListMock();

      return HttpResponse.json({
        data: {
          documentTemplateList,
        },
      });
    }
  );
}

// Campaigns Document List
export function campaignsDocumentListMockQuery() {
  return graphql.query<CampaignsDocumentListQuery>(
    "CampaignsDocumentList",
    () => {
      return HttpResponse.json({
        data: {
          documentList: companyDocumentListMock().slice(0, 3),
        },
      });
    }
  );
}

// Layout
export function layoutMockQuery() {
  return graphql.query<LayoutQuery>("Layout", () => {
    return HttpResponse.json({
      data: {
        authenticated: {
          manager: {
            claims: Object.values(ManagerClaims),
          },
        },
        categories: [
          { key: "arbitrary", name: "ARBITRARY", customerVisibility: true },
          { key: "official", name: "OFFICIAL", customerVisibility: true },
          { key: "legal", name: "LEGAL", customerVisibility: true },
          { key: "other", name: "Other", customerVisibility: true },
        ],
      },
    });
  });
}
// WealthAndPerformance
export function wealthAndPerformanceMockQuery() {
  return graphql.query<WealthAndPerformanceQuery>(
    "WealthAndPerformance",
    ({ variables }) => {
      const { companyID } = variables;
      const company = companyListMock().find(
        (company) => company.id === companyID
      );

      return HttpResponse.json({
        data: {
          company,
        },
      });
    }
  );
}
// Layout / Customer
export function layoutCustomerMockQuery() {
  return graphql.query<LayoutCustomerQuery>(
    "LayoutCustomer",
    ({ variables }) => {
      const { customerID } = variables;

      const { start, end } = variables;
      const value = !start || !end ? 374 : 100;

      return HttpResponse.json({
        data: {
          authenticated: {
            manager: {
              claims: [
                ManagerClaims.Billing,
                ManagerClaims.ManagerInvite,
                ManagerClaims.ManagersRead,
              ],
            },
          },
          customer: {
            name: "John Doe",
            id: "1",
            ...customerListMock().find(
              (customer) => customer.id === customerID
            ),
            valuation: { value: 24500.85, instrument: "EUR" },
            plan: faker.helpers.arrayElement(Object.values(CustomerPlan)),
          },
        },
      });
    }
  );
}

// Documents
export function documentsMockQuery() {
  return graphql.query<CompanyComplianceQuery>("CompanyCompliance", () => {
    return HttpResponse.json({
      data: {
        customersCompliance: complianceMock(),
        globalCompliance: {
          unvalid: 0.3,
          valid: 0.2,
          waiting: 0.5,
        },
      },
    });
  });
}

// Customers conformity
export function customersConformityMockQuery() {
  return graphql.query<CustomerConformityQuery>("CustomerConformity", () => {
    return HttpResponse.json({
      data: {
        legalList: companyDocumentListMock().filter(
          (document) => document.category.key === "legal"
        ),
        officialList: companyDocumentListMock().filter(
          (document) => document.category.key === "official"
        ),
        envelopeList: customerConformityEnvelopListsMock(),
      },
    });
  });
}

export function authentificationMockQuery() {
  return graphql.query<AuthenticatedQuery>("Authenticated", () => {
    return HttpResponse.json({
      data: {
        authenticated: {
          id: "1",
          manager: authentificatedManagerMock(),
        },
      },
    });
  });
}

export function customerWealthMockQuery() {
  return graphql.query<CustomerWealthQuery>("CustomerWealth", () => {
    return HttpResponse.json({
      data: {
        financialWealth: [
          {
            name: AssetGroup.Banking,
            amount: {
              value: 260123.26,
              instrument: "EUR",
            },
            data: [
              {
                id: "asset_one",
                name: "Mon super compte Revolut",
                group: AssetGroup.Banking,

                valuation: 260123.26,
                isManual: true,
                underManagement: false,
              },
              {
                id: "asset_one",
                name: "Un nom super long pour un compte bancaire super long pour un compte bancaire",
                group: AssetGroup.Banking,

                valuation: 4999112.26,
                isManual: true,
                underManagement: false,
              },
              {
                id: "asset_one",
                name: "Boursorama",
                group: AssetGroup.Crowdfunding,
                valuation: 260123.26,
                isManual: true,
                underManagement: true,
              },
            ],
          },
          {
            name: AssetGroup.Crypto,
            amount: {
              value: 260123.26,
              instrument: "EUR",
            },
            data: [
              {
                id: "asset_one",
                name: "Bitcoin (BTC)",
                group: AssetGroup.Crypto,
                valuation: 260123.26,
                isManual: true,
                underManagement: false,
              },
              {
                id: "asset_one",
                name: "Ethereum (ETC)",
                group: AssetGroup.Crypto,
                valuation: 4999112.26,
                isManual: true,
                underManagement: true,
              },
            ],
          },
          {
            name: AssetGroup.Securities,
            amount: {
              value: 260123.26,
              instrument: "EUR",
            },
            data: [
              {
                id: "asset_one",
                name: "GOOGL. ",
                group: AssetGroup.Securities,
                valuation: 260123.26,
                isManual: true,
                underManagement: false,
              },
              {
                id: "asset_one",
                name: "AAPL",
                group: AssetGroup.Securities,
                valuation: 4999112.26,
                isManual: true,
                underManagement: true,
              },
            ],
          },
        ],
        nonfinancialWealth: [
          {
            name: AssetGroup.Exotic,
            amount: {
              value: 260123.26,
              instrument: "EUR",
            },
            data: [
              {
                id: "asset_one",
                name: "Immobilier physique et papier",
                group: AssetGroup.HeritageRealEstate,
                valuation: 154000.3,
                isManual: true,
                underManagement: false,
              },
              {
                id: "asset_two",
                name: "Matières premières (Or, pétrole)",
                group: AssetGroup.Exotic,
                valuation: 34000.25,
                isManual: true,
                underManagement: true,
              },
              {
                id: "asset_three",
                name: "Fonds négociés en bourse (FNB) ",
                group: AssetGroup.Exotic,
                valuation: 580000.41,
                isManual: true,
                underManagement: false,
              },
            ],
          },
          {
            name: AssetGroup.HeritageRealEstate,
            amount: {
              value: 260123.26,
              instrument: "EUR",
            },
            data: [
              {
                id: "asset_one",
                name: "Immeubles de rapport",
                group: AssetGroup.HeritageRealEstate,
                valuation: 154000.3,
                isManual: true,
                underManagement: true,
              },
              {
                id: "asset_two",
                name: "Propriétés résidentielles telles que des maisons et des appartements",
                group: AssetGroup.HeritageRealEstate,
                valuation: 34000.25,
                isManual: true,
                underManagement: false,
              },
              {
                id: "asset_three",
                name: "Terrains commerciaux ou résidentiels",
                group: AssetGroup.HeritageRealEstate,
                valuation: 580000.41,
                isManual: true,
                underManagement: true,
              },
            ],
          },
          {
            name: AssetGroup.RockPaper,
            amount: {
              value: 260123.26,
              instrument: "EUR",
            },
            data: [
              {
                id: "asset_one",
                name: "Immeubles de bureaux",
                group: AssetGroup.HeritageRealEstate,
                valuation: 154000.3,
                isManual: true,
                underManagement: true,
              },
              {
                id: "asset_two",
                name: "Locaux commerciaux",
                group: AssetGroup.HeritageRealEstate,
                valuation: 34000.25,
                isManual: true,
                underManagement: true,
              },
              {
                id: "asset_three",
                name: "Hôtels",
                group: AssetGroup.HeritageRealEstate,
                valuation: 580000.41,
                isManual: true,
                underManagement: false,
              },
              {
                id: "asset_one",
                name: "Établissements de santé (cliniques, maisons de retraite, etc.)",
                group: AssetGroup.HeritageRealEstate,
                valuation: 154000.3,
                isManual: true,
                underManagement: false,
              },
              {
                id: "asset_two",
                name: "Entrepôts et centres logistiques",
                group: AssetGroup.HeritageRealEstate,
                valuation: 34000.25,
                isManual: true,
                underManagement: true,
              },
            ],
          },
        ],
        passiveWealth: [
          {
            name: AssetGroup.HomeLoan,
            amount: {
              value: 34000.25,
            },
            data: [
              {
                id: "1",
                name: "Emprunt Immobilier",
                group: AssetGroup.HeritageRealEstate,
                valuation: 3000,
                isManual: true,
                underManagement: false,
              },
              {
                id: "2",
                name: "Emprunt Auto",
                group: AssetGroup.HomeLoan,
                valuation: 3000,
                isManual: true,
                underManagement: false,
              },
              {
                id: "3",
                name: "Crédit Conso",
                group: AssetGroup.HomeLoan,
                valuation: 150_000,
                isManual: true,
                underManagement: true,
              },
            ],
          },
          {
            name: AssetGroup.Crypto,
            amount: {
              value: 0,
              instrument: "EUR",
            },
            data: [
              {
                id: "asset_one",
                name: "Crypto",
                group: AssetGroup.Crypto,
                valuation: 100,
                isManual: true,
                underManagement: false,
              },
            ],
          },
          {
            name: AssetGroup.Securities,
            amount: {
              value: 1300,
              instrument: "EUR",
            },
            data: [
              {
                id: "asset_one",
                name: "Boursorama",
                group: AssetGroup.Banking,
                valuation: 300,
                isManual: true,
                underManagement: true,
              },
              {
                id: "asset_two",
                name: "Kraken",
                group: AssetGroup.Securities,
                valuation: 1000,
                isManual: true,
                underManagement: true,
              },
            ],
          },
        ],
        repartition: [
          {
            name: AssetGroup.Crypto,
            amount: {
              value: 3_000,
              instrument: "EUR",
            },
          },
          {
            name: AssetGroup.Securities,
            amount: {
              value: 10_000,
              instrument: "EUR",
            },
          },
          {
            name: AssetGroup.Banking,
            amount: {
              value: 150_000,
              instrument: "EUR",
            },
          },
        ],
      },
    });
  });
}

// Company connectionList
export function companyMockQuery() {
  return graphql.query<CompanyQuery>("Company", () => {
    return HttpResponse.json({
      data: {
        connectionList: [
          {
            state: ConnectionState.Active,
          },
        ],
      },
    });
  });
}

// UnderManagementAssetGroups
export function underManagementAssetGroupsMockQuery() {
  return graphql.query<UnderManagementAssetGroupsQuery>(
    "UnderManagementAssetGroups",
    () => {
      return HttpResponse.json({
        data: {
          customerWealth: [
            {
              group: AssetGroup.LifeInsuranceCapitalization,
              valuation: {
                value: 870000,
                instrument: "EUR",
              },
              assets: [
                {
                  id: "asset_one",
                  name: "Abeille Capitalisation Plurielle",
                  group: AssetGroup.LifeInsuranceCapitalization,
                  activity: null,
                  accountNumber: null,
                  openDate: "2025-01-16T11:23:27.676Z",
                  categoryName: null,
                  transfersAmount: {
                    value: 1000000,
                    instrument: "EUR",
                  },
                  withdrawalAmount: {
                    value: 0,
                    instrument: "EUR",
                  },
                  metadata: {
                    efficiency: 0,
                    transfersAmount: 1000000,
                    insuranceCompany: "Abeille Assurances",
                    withdrawalAmount: 0,
                  },
                  sri: 4,
                  valuation: 870000,
                },
              ],
            },
          ],
        },
      });
    }
  );
}

export function globalWealthQueryMock() {
  return graphql.query<GlobalWealthQuery>("GlobalWealth", () => {
    return HttpResponse.json({
      data: {
        companyWealth: [
          {
            name: AssetGroup.Banking,
            amount: {
              value: 1_000,
              instrument: "EUR",
            },
            performance: {
              gain: {
                value: 300,
                instrument: "EUR",
              },
              evolution: 0.3,
            },
          },
          {
            name: AssetGroup.Banking,
            amount: {
              value: 1_00000,
              instrument: "EUR",
            },
            performance: {
              gain: {
                value: 300,
                instrument: "EUR",
              },
              evolution: 0.3,
            },
          },
          {
            name: AssetGroup.Exotic,
            amount: {
              value: 1_000,
              instrument: "EUR",
            },
            performance: {
              gain: {
                value: 300,
                instrument: "EUR",
              },
              evolution: 0.3,
            },
          },
          {
            name: AssetGroup.HeritageRealEstate,
            amount: {
              value: 1_0000,
              instrument: "EUR",
            },
            performance: {
              gain: {
                value: 300,
                instrument: "EUR",
              },
              evolution: 0.3,
            },
          },
          {
            name: AssetGroup.RetirementEmployee,
            amount: {
              value: 1_000,
              instrument: "EUR",
            },
            performance: {
              gain: {
                value: 300,
                instrument: "EUR",
              },
              evolution: 0.3,
            },
          },
          {
            name: AssetGroup.Crypto,
            amount: {
              value: 1_000,
              instrument: "EUR",
            },
            performance: {
              gain: {
                value: 300,
                instrument: "EUR",
              },
              evolution: 0.3,
            },
          },
          {
            name: AssetGroup.Securities,
            amount: {
              value: 1_000,
              instrument: "EUR",
            },
            performance: {
              gain: {
                value: 300,
                instrument: "EUR",
              },
              evolution: 0.3,
            },
          },
        ],
        assets: [
          {
            id: "qwert-3786872",
            name: "Nom du compte",
            group: AssetGroup.HeritageRealEstate,
            amount: {
              value: 3847973,
              instrument: "EUR",
            },
            isManual: true,
            performance: {
              gain: {
                value: 28791.23,
                instrument: "EUR",
              },
              evolution: 0.3,
            },
          },
          {
            id: "qwert-3786871",
            name: "Nom du compte2",
            group: AssetGroup.Securities,
            amount: {
              value: 5783,
              instrument: "EUR",
            },
            isManual: true,
            performance: {
              gain: {
                value: 294.23,
                instrument: "EUR",
              },
              evolution: 0.12,
            },
          },
          {
            id: "qwert-3786873",
            name: "Nom du compte2",
            group: AssetGroup.Crowdfunding,
            amount: {
              value: 48747,
              instrument: "EUR",
            },
            performance: {
              gain: {
                value: 94.23,
                instrument: "EUR",
              },
              evolution: 0.65,
            },
            isManual: true,
          },
          {
            id: "qwert-3786877",
            name: "Nom du compte5",
            group: AssetGroup.Crypto,
            amount: {
              value: 73,
              instrument: "EUR",
            },
            isManual: true,
            performance: {
              gain: {
                value: 4.23,
                instrument: "EUR",
              },
              evolution: 0.04,
            },
          },
        ],
        mostOccuring: { group: AssetGroup.Banking, count: 3 },
        liquidity: {
          value: 100,
          instrument: "EUR",
        },
        company: {
          wealth: {
            value: 231,
            instrument: "EUR",
          },
        },
        details: {
          managedWealth: {
            value: 100,
            instrument: "EUR",
          },
        },
      },
    });
  });
}

export function subWealthQueryMock() {
  return graphql.query<SubWealthQuery>("SubWealth", () => {
    return HttpResponse.json({
      data: {
        assetsTypes: assetTypeListMock(),
      },
    });
  });
}
export function wealthUnderManagmentQueryMock() {
  return graphql.query<WealthUnderManagmentQuery>(
    "WealthUnderManagment",
    () => {
      return HttpResponse.json({
        data: {
          assetsTypes: assetTypeListMock(),
        },
      });
    }
  );
}
export function layoutSubWealthQueryMock() {
  return graphql.query<LayoutSubWealthQuery>("LayoutSubWealth", () => {
    return HttpResponse.json({
      data: {
        customersAssetsTypes: assetTypeListMock(),
        underManagementsAssetsTypes: assetTypeListMock(),
      },
    });
  });
}

export function assetTypeWealthQueryMock() {
  return graphql.query<AssetTypeWealthQuery>(
    "assetTypeWealth",
    ({ variables }) => {
      const assets = companyAssetTypeWealthMock();
      const assigner = !!(variables.filters as AssetFilters)?.assigner;
      const edges = assets.edges;

      if (assigner) {
        assets.edges = edges.filter((edge) => !edge.node.customer);
      }

      if (variables.type === AssetGroup.Crypto) {
        assets.edges = edges.slice(0, 3);
      }

      return HttpResponse.json({
        data: {
          company: {
            id: "124a17d4-83a8-4b3a-b4af-e2fd563eba46",
            assets,
          },
        },
      });
    }
  );
}

export function assetDetailQueryMock() {
  return graphql.query<AssetDetailQuery>("AssetDetail", () => {
    return HttpResponse.json({
      data: {
        asset: {
          id: "revolut",
          name: "Revolut",
          group: AssetGroup.Securities,
          underManagement: false,
          activity: {
            value: 260123.26,
            instrument: "EUR",
          },
          performance: {
            gain: {
              value: 300,
              instrument: "EUR",
            },
            evolution: 0.3,
          },
          investmentList: [
            {
              logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png",
              name: "Bitcoin",
              code: "BTC",
              valuation: {
                value: 246787.42,
                instrument: "EUR",
              },
              quantity: 10,
              unitValue: 278.74,
              performance: {
                gain: {
                  value: 300,
                  instrument: "EUR",
                },
                evolution: 0.3,
              },
            },
            {
              logo: "https://c8.alamy.com/compfr/2f4ej6a/logo-blanc-ethereum-isole-sur-fond-blanc-modele-pour-bannieres-d-actualites-et-autres-medias-illustration-vectorielle-2f4ej6a.jpg",
              name: "Ethereum",
              code: "ETH",
              valuation: {
                value: 6667.92,
                instrument: "EUR",
              },
              quantity: 4,
              unitValue: 1666.98,
              performance: {
                gain: {
                  value: 45,
                  instrument: "EUR",
                },
                evolution: 0.17,
              },
            },
            {
              name: "Ethereum",
              code: "ETH",
              valuation: {
                value: 6667.92,
                instrument: "EUR",
              },
              quantity: 4,
              unitValue: 1666.98,
              performance: {
                gain: {
                  value: 45,
                  instrument: "EUR",
                },
                evolution: 0.17,
              },
            },
          ],
          isManual: true,
        },
      },
    });
  });
}

export function conformityDocumentMockQuery() {
  return graphql.query<ConformityDocumentQuery>("ConformityDocument", () => {
    // const url =
    //   "https://cgp-documents-preproduction.s3.fr-par.scw.cloud/companies/b9831f87-0f19-499e-9754-b5de7858b8da/customers/5236f04b-e31b-4471-a359-ed4e344e7d3d/envelopes/2e9de134-67e9-44c3-a719-d2b4e60f0ab7/d4d4f10b-4972-4673-8292-5bab36b96bb0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=SCW84J28C2HN4D7FV0AG%2F20230921%2Ffr-par%2Fs3%2Faws4_request&X-Amz-Date=20230921T081539Z&X-Amz-Expires=86400&X-Amz-Signature=7f41133693aeb7885edfbdac420ffeb85886c10f7aac6227ee276a9af94b8808&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%2287000800768472.pdf%22&x-id=GetObject";
    const url =
      "https://cgp-documents-preproduction.s3.fr-par.scw.cloud/companies/b9831f87-0f19-499e-9754-b5de7858b8da/customers/5236f04b-e31b-4471-a359-ed4e344e7d3d/envelopes/50169ead-1b43-439a-b57e-02db9bbfa7a6/f09db187-d7fb-4c4b-83fe-7a3a9115a111?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=SCW84J28C2HN4D7FV0AG%2F20230921%2Ffr-par%2Fs3%2Faws4_request&X-Amz-Date=20230921T095207Z&X-Amz-Expires=86400&X-Amz-Signature=42576cefc5e5b8a1448d1868e9eb8a01cca1c6e5a7e7c2e379e7308e126eb693&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3D%22dummy.pdf%22&x-id=GetObject";

    const name = "dummy.pdf";

    return HttpResponse.json({
      data: {
        document: {
          url,
          name,
        },
      },
    });
  });
}

export function investorProfileMockQuery() {
  return graphql.query<InvestorProfileQuery>("InvestorProfile", () => {
    return HttpResponse.json({
      data: {
        customer: {
          investorProfile: {
            contactDontAnswer: true,
            maxInvest: 100000,
            minInvest: 5000,
            lossesAbility: "moderate",
          },
        },
        investorProfileForm: investorProfileFormMock(),
      },
    });
  });
}

export function investorProfileStatsMockQuery() {
  return graphql.query<InvestorProfileStatsQuery>(
    "InvestorProfileStats",
    () => {
      return HttpResponse.json({
        data: {
          investorEnvironmentalStats: {
            activities: 0.6,
            socialObjectives: 0.4,
            negativeImpacts: 0.2,
          },
          investorProfileStats: {
            knowledge: 0.1,
            nonFinancialSensitivity: 0.3,
            riskProfile: 0.6,
          },
        },
      });
    }
  );
}

export function budgetMockQuery() {
  return graphql.query<BudgetQuery>("Budget", () => {
    return HttpResponse.json({
      data: {
        budgetList: budgetListMock(),
        customer: {
          availableLiquidity: {
            value: 260123.26,
            instrument: "EUR",
          },
        },
      },
    });
  });
}

export function managerInvitationListMockQuery() {
  return graphql.query<ManagerInvitePendingListQuery>(
    "ManagerInvitePendingList",
    () => {
      return HttpResponse.json({
        data: {
          managerInvitePendingList: managerInvitationListMock(),
        },
      });
    }
  );
}

export function SCPIListMockQuery() {
  return graphql.query<ScpiListQuery>("SCPIList", () => {
    return HttpResponse.json({
      data: {
        SCPIList: [
          {
            name: "ACCES-VALEUR-PIERRE Bnp-paribas-reim",
            subscription_price: "100",
          },
          {
            name: "ACTIPIERRE-1 Aew-ciloger",
            subscription_price: "250",
          },
          {
            name: "ACTIPIERRE-2 Aew-ciloger",
            subscription_price: "432",
          },
        ],
      },
    });
  });
}

export function CustomerSearchMockQuery() {
  return graphql.query<CustomerSearchQuery>("CustomerSearch", () => {
    return HttpResponse.json({
      data: {
        searchCustomer: [
          {
            id: "1",
            name: "Hervé Falco",
            email: "falcoherve@test.fr",
          },
          {
            id: "2",
            name: "Eric FOIN",
            email: "eric.foin@wealthcome.fr",
          },
          {
            id: "3",
            name: "Patrick Prevost",
            email: "pprevost@gmail.fr",
          },
          {
            id: "4",
            name: "Gerard Bouchard",
            email: "bgerard@test.fr",
          },
        ],
      },
    });
  });
}

export function searchInstrumentMockQuery() {
  return graphql.query<SearchInstrumentQuery>("SearchInstrument", () => {
    return HttpResponse.json({
      data: {
        searchInstrument: [
          {
            name: "Apple",
            code: "APPL",
            price: {
              value: 100,
              instrument: "EUR",
            },
          },
          {
            name: "Goole",
            code: "GOOL",
            price: {
              value: 100,
              instrument: "EUR",
            },
          },
          {
            name: "Amazone",
            code: "AMAZ",
            price: {
              value: 100,
              instrument: "EUR",
            },
          },
        ],
      },
    });
  });
}

// # Connectors

export function connectorMockQuery() {
  return graphql.query<ConnectorQuery>("Connector", ({ variables }) => {
    const { connectorID } = variables;

    const foundedConnector = connectorListMock().find(
      (connector) => connector.key === connectorID
    );

    if (!foundedConnector) {
      return HttpResponse.json({
        errors: [
          {
            message: "Connector not found",
          },
        ],
      });
    }

    return HttpResponse.json({
      data: {
        connector: foundedConnector,
      },
    });
  });
}

export function migratorMockQuery() {
  return graphql.query<MigratorQuery>("Migrator", () => {
    return HttpResponse.json({
      data: {
        migrator: migratorListMock()[0],
      },
    });
  });
}

export function migratorListMockQuery() {
  return graphql.query<MigratorListQuery>("MigratorList", () => {
    return HttpResponse.json({
      data: {
        migratorList: migratorListMock(),
      },
    });
  });
}

export function connectorListMockQuery() {
  return graphql.query<ConnectorListQuery>("ConnectorList", () => {
    return HttpResponse.json({
      data: {
        connectorList: connectorListMock(),
      },
    });
  });
}

export function customerWalletMockQuery() {
  return graphql.query<CustomerWalletQuery>(
    "CustomerWallet",
    ({ variables }) => {
      const { id = 1 } = variables;

      return HttpResponse.json({
        data: {
          customerWallet: customerWalletListMock()[id - 1],
        },
      });
    }
  );
}

export function documentCategoryListQuery() {
  return graphql.query<GedDocumentCategoryListQuery>(
    "DocumentCategoryList",
    () => {
      return HttpResponse.json({
        data: {
          documentCategoryList: documentCategoryListMock(),
        },
      });
    }
  );
}

export function envelopeListQuery() {
  return graphql.query<EnvelopeListQuery>("EnvelopeList", () => {
    return HttpResponse.json({
      data: {
        envelopeList: customerConformityEnvelopListsMock().map((envelope) => ({
          ...envelope,
          documents: envelope.documentList.map((document) => ({
            ...document,
            category: {
              key: "official",
              name: "OFFICIAL",
              customerVisibility: true,
            },
          })),
        })),
      },
    });
  });
}

// support
export function instrumentListingQuery() {
  return graphql.query<InstrumentListingQuery>("InstrumentListing", () => {
    return HttpResponse.json({
      data: {
        instrumentListing: {
          totalCount: 10,
          totalPages: 2,
          instruments: [
            {
              code: "FR0000295230",
              category: "OPCVM",
              label: "Apple surper surper long label ",
              riskIndicator: 1,
              valuation: {
                value: 100,
                instrument: "EUR",
              },
            },
            {
              code: "FR0001234567",
              category: "OPCVM",
              label: "Google surper surper long label ",
              riskIndicator: 4,
              valuation: {
                value: 10000,
                instrument: "EUR",
              },
            },
            {
              code: "FR0009876543",
              category: "OPCVM",
              label: "Amazon surper surper long label ",
              riskIndicator: 2,
              valuation: {
                value: 100000,
                instrument: "EUR",
              },
            },
            {
              code: "FR0009876543",
              category: "OPCVM",
              label: "Amazon surper surper long label ",
              riskIndicator: 2,
              valuation: {
                value: 100000,
                instrument: "EUR",
              },
            },
            {
              code: "FR0009876543",
              category: "OPCVM",
              label: "Amazon surper surper long label ",
              riskIndicator: 2,
              valuation: {
                value: 100000,
                instrument: "EUR",
              },
            },
            {
              code: "FR0009876543",
              category: "OPCVM",
              label: "Amazon",
              riskIndicator: 2,
              valuation: {
                value: 100000,
                instrument: "EUR",
              },
            },
            {
              code: "FR0009876543",
              category: "OPCVM",
              label: "Amazon",
              riskIndicator: 2,
              valuation: {
                value: 100000,
                instrument: "EUR",
              },
            },
            {
              code: "FR0009876543",
              category: "OPCVM",
              label: "Amazon",
              riskIndicator: 2,
              valuation: {
                value: 100000,
                instrument: "EUR",
              },
            },
            {
              code: "FR0009876543",
              category: "OPCVM",
              label: "Amazon",
              riskIndicator: 2,
              valuation: {
                value: 100000,
                instrument: "EUR",
              },
            },
            {
              code: "FR0009876543",
              category: "OPCVM",
              label: "Amazon",
              riskIndicator: 2,
              valuation: {
                value: 100000,
                instrument: "EUR",
              },
            },
          ],
        },
      },
    });
  });
}

export function instrumentFiltersQuery() {
  return graphql.query<InstrumentFiltersQuery>("InstrumentFilters", () => {
    return HttpResponse.json({
      data: {
        instrumentFilters: {
          categories: ["OPCVM", "ETF", "Stocks", "Crypto"],
          riskIndicators: [1, 2, 3, 4, 5],
          managementCompanies: ["Amundi", "BNP Paribas", "Lyxor", "Vanguard"],
          subcategories: [
            "Actions",
            "Obligations",
            "Monétaire",
            "Diversifiés",
            "Immobilier",
            "Matieres premières",
            "Dérivés",
          ],
        },
      },
    });
  });
}

export function getPubliFormFillingQuery() {
  return graphql.query<GetPubliFormFillingQuery>("GetPubliFormFilling", () => {
    return HttpResponse.json({
      data: {
        existingFormData: investorProfileFormMock(),
      },
    });
  });
}

export function lcbQuery() {
  return graphql.query<CustomerLcbQuery>("CustomerLcb", () => {
    return HttpResponse.json({
      data: {
        customer: customerListMock()[0],
      },
    });
  });
}

export function holdingQueriesQuery() {
  return graphql.query<HoldingQueriesQuery>("HoldingQueries", () => {
    return HttpResponse.json({
      data: {
        holdingList: holdingMock(),
      },
    });
  });
}

export function customerRelationQuery() {
  return graphql.query<CustomerRelationQuery>("CustomerRelation", () => {
    return HttpResponse.json({
      data: {
        customerRelation: { list: customerRelationMock() },
      },
    });
  });
}
