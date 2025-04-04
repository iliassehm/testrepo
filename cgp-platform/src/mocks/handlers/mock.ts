import { faker } from "@faker-js/faker";

import { HoldingCompanyFormDataType } from "../../../shared/schemas/companyHolding";
import { CustomerRelationForm } from "../../../shared/schemas/relation";
import {
  AssetGroupList,
  campaignContractStatusList,
  defaultCategories,
  envelopeAccessList,
  treatementList,
} from "../../constants";
import {
  AssetConnection,
  AssetGroup,
  Campaign,
  CampaignContract,
  Company,
  Connection,
  ConnectionState,
  Connector,
  ConnectorProvider,
  Customer,
  CustomerAsset,
  CustomerDetails,
  CustomerInvestment,
  CustomerPlan,
  CustomerType,
  CustomerWallet,
  Document,
  DocumentCategory,
  DocumentCategoryV2,
  DocumentTemplate,
  DocumentTemplateCreator,
  DocumentTemplateStatus,
  Envelope,
  Holding,
  InstrumentPaginated,
  IntegrationState,
  Manager,
  ManagerInvite,
  Migrator,
  Treatement,
} from "./../../types";
import {
  mockRandomAmount,
  mockRandomDateBeforeToday,
  mockRandomPhoneNumber,
} from "./utils";

const date = new Date("2023-05-08").toISOString();

export function companyListMock(): Company[] {
  return Array.from({ length: 20 }, (_, i) => {
    const id = (i + 1).toString();

    return {
      id,
      name: `Company ${id}`,
      siret: "123456789",
      phone: mockRandomPhoneNumber(),
      address: `${id} rue de la paix`,
      cifNumber: "123",
      oriasNumber: "IAS",
      carteTNumber: "456",
      socialCapital: "1000",
      professionalChamber: "Chambre des notaires",
      created: date,
      updated: date,
      wealth: mockRandomAmount(),
      underManagement: mockRandomAmount(),
      isParentCompany: false,
      customerList: {
        totalCount: 10,
        edges: [],
      },
      assetsUnderManagement: {
        edges: [],
        totalPages: 1,
        totalCount: 0,
      },
      managerList: [],
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/2/23/Gaz_de_France.svg/1920px-Gaz_de_France.svg.png",
    };
  });
}

function documentMock({
  id,
  name,
  customer,
  category,
  treatement,
}: {
  id: string;
  name: string;
  customer: Customer;
  treatement: Treatement;
  conformity: number;
  category?: DocumentCategory;
  expiration?: Date;
}): Document {
  const date = mockRandomDateBeforeToday();

  return {
    customer,
    id,
    name,
    extension: "pdf",
    updated: date,
    created: date,
    expiration: date,
    category: category ?? defaultCategories[2],
    url: "https://www.google.com",
    treatement,
  };
}
export function companyDocumentListMock(): Document[] {
  return customerListMock().map((customer, index) => {
    const document = documentMock({
      id: index + "",
      customer,
      expiration: new Date(Date.now() - 86_400_000),
      conformity: (index % 2) * 0.5,
      treatement: treatementList[index % treatementList.length],
      name: "Document " + index,
      category: defaultCategories[index % defaultCategories.length],
    });

    return document;
  });
}

export function authentificatedManagerMock(): Manager {
  return {
    id: "1",
    name: "test",
    email: "test@test.test",
    phone: mockRandomPhoneNumber(),
    advisorRole: "advisor",
    newsletterSubscriber: true,
    created: date,
    updated: date,
    companyList: companyListMock(),
  };
}

export function customerListMock(): Customer[] {
  const wealths = [2015250, 1525620, 2015250, 1525620, 2015250, 1525620];
  const fakeNameList = ["Pierre Jean", "Alice Dupont"];
  const customerTypeList = Object.values(CustomerType);

  // return 20 customers
  return Array.from({ length: 20 }, (_, i) => {
    const date = mockRandomDateBeforeToday();

    return {
      id: i.toString(),
      name: fakeNameList[i] || `Customer ${i + 1}`,
      firstName: fakeNameList[i] || `Customer ${i + 1}`,
      lastName: fakeNameList[i] || `Customer ${i + 1}`,
      type: customerTypeList[i % customerTypeList.length],
      email: `customer${i + 1}@gmail.com`,
      phoneNumber: mockRandomPhoneNumber(),
      company: companyListMock()[i % companyListMock().length],
      conformity: treatementList[i % treatementList.length],
      wealth: { value: wealths[i % wealths.length], instrument: "EUR" },
      created: date,
      updated: date,
      fiscality: customerFiscalityInformationsMock(),
      informations: {
        details: customerDetailsInformationsMock(),
        general: customerGeneralInformationsMock(),
        company: companyFormMock(),
        relations: { list: customerRelationMock() },
      },
      plan: faker.helpers.arrayElement(Object.values(CustomerPlan)),
      performance: {
        evolution: 0.5,
        gain: { value: 13, instrument: "EUR" },
      },
      valuation: { value: 24500.85, instrument: "EUR" },
    };
  });
}

export function customerMock() {
  return customerListMock()[0];
}

export function campaignContractList(): CampaignContract[] {
  // random Status from CampaignContractStatus
  return customerListMock()
    .slice(0, 5)
    .map((customer, index) => ({
      status: campaignContractStatusList[index],
      customer,
      id: index.toString(),
      name: `Campaign Contract ${index + 1}`,
      investment: { value: Math.random() * 1000000, instrument: "EUR" },
    }));
}

export function campagnListMock(): Campaign[] {
  const contractList = campaignContractList();
  return Object.keys(AssetGroup).map((type, i) => ({
    id: i.toString(),
    name: `Campaign ${i + 1}`,
    assetGroup: AssetGroupList[i],
    provider: `Provider ${i + 1}`,
    totalInvestment: {
      value: contractList.reduce(
        (acc, contract) => acc + contract.investment.value,
        0
      ),
      instrument: "EUR",
    },
    contractList: contractList,
    customersCount: contractList.length,
    created: date,
    updated: date,
  }));
}

export function documentTemplateListMock(): DocumentTemplate[] {
  return [
    {
      id: "1",
      name: "Document Template 1",
      category: "legal",
      description: "Description 1",
      creator: DocumentTemplateCreator.ChamberFirst,
      status: DocumentTemplateStatus.Pending,
      url: "",
      properties: {
        insertAfterPage: 1,
        type: "specific",
      },
      extension: "pdf",
    },
    {
      id: "2",
      name: "Document Template 2",
      category: "legal",
      description: "Description 2",
      creator: DocumentTemplateCreator.Wealthcome,
      status: DocumentTemplateStatus.Ready,
      url: "",
      extension: "pdf",
    },
    {
      id: "3",
      name: "Document Template 3",
      category: "legal",
      description: "Description 3",
      creator: DocumentTemplateCreator.ChamberFirst,
      status: DocumentTemplateStatus.Deprecated,
      url: "",
      extension: "pdf",
    },
    {
      id: "4",
      name: "Document Template 4",
      category: "official",
      description: "Description 4",
      creator: DocumentTemplateCreator.ChamberSecond,
      status: DocumentTemplateStatus.Ready,
      url: "",
      extension: "pdf",
    },
    {
      id: "5",
      name: "Document Template 5",
      category: "official",
      description: "Description 5",
      creator: DocumentTemplateCreator.Wealthcome,
      status: DocumentTemplateStatus.Ready,
      url: "",
      extension: "pdf",
    },
    {
      id: "6",
      name: "Document Template 6",
      category: "arbitrary",
      description: "Description 6",
      creator: DocumentTemplateCreator.ChamberSecond,
      status: DocumentTemplateStatus.Ready,
      url: "",
      extension: "pdf",
    },
    {
      id: "7",
      name: "Document Template 7",
      category: "legal",
      description: "Description 7",
      creator: DocumentTemplateCreator.Wealthcome,
      status: DocumentTemplateStatus.Ready,
      url: "",
      extension: "pdf",
    },
    {
      id: "8",
      name: "Document Template 8",
      category: "official",
      description: "Description 8",
      creator: DocumentTemplateCreator.Company,
      status: DocumentTemplateStatus.Ready,
      url: "",
      extension: "pdf",
    },
    {
      id: "9",
      name: "Document Template 9",
      category: "official",
      description: "Description 9",
      creator: DocumentTemplateCreator.ChamberSecond,
      status: DocumentTemplateStatus.Ready,
      url: "",
      extension: "pdf",
    },
    {
      id: "10",
      name: "Document Template 10",
      category: "arbitrary",
      description: "Description 10",
      creator: DocumentTemplateCreator.Wealthcome,
      status: DocumentTemplateStatus.Ready,
      url: "",
      extension: "pdf",
    },
    {
      id: "11",
      name: "Document Template 11",
      category: "arbitrary",
      description: "Description 11",
      creator: DocumentTemplateCreator.ChamberThird,
      status: DocumentTemplateStatus.Ready,
      url: "",
      extension: "pdf",
    },
  ];
}

export function managerListMock(): Manager[] {
  return customerListMock().map((customer, index) => ({
    id: index + "",
    name: customer.name,
    email: customer.email ?? "test@test.test",
    phone: mockRandomPhoneNumber(),
    newsletterSubscriber: true,
    created: date,
    updated: date,
  }));
}

export function customerConformityEnvelopListsMock(limit = 3): Envelope[] {
  const conformityList = [...Array(limit).keys()].map((index): Envelope => {
    const date = mockRandomDateBeforeToday();

    return {
      id: index.toString(),
      name: `Envelope ${index + 1}`,
      created: new Date(Date.now() - 86_400_000),
      conformity: treatementList[index % treatementList.length],
      expiration: date,
      access: envelopeAccessList[index % envelopeAccessList.length],
      documentList: [...Array(4).keys()].map((index) => {
        const document = documentMock({
          id: index + "",
          name: "Document " + index,
          conformity: (index % 2) * 0.5,
          treatement: treatementList[index % treatementList.length],
          customer: customerListMock()[index],
          category: defaultCategories[index % defaultCategories.length],
        });
        return document;
      }),
    };
  });

  return conformityList;
}
export function customerDetailsMock(): CustomerDetails {
  return {
    count: 10,
    averageWealth: {
      instrument: "EUR",
      value: 115500,
    },
    managedWealth: {
      instrument: "EUR",
      value: 6500000,
    },
  };
}

export function connectorListMock(): Connector[] {
  return [
    {
      key: "1",
      name: "La Banque Postale",
      provider: ConnectorProvider.Powens,
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Logo_2019_de_La_Banque_Postale.png",
      labels: {},
    },
    {
      key: "2",
      name: "Credit Agricole",
      provider: ConnectorProvider.Wealthcome,
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZmkQLIR8VFbd1bTXDPozHZvCENH0quDF99w&usqp=CAU",
      labels: { username: "id", secret: "code" },
    },
    {
      key: "3",
      name: "Boursorama",
      provider: ConnectorProvider.Powens,
      logo: "https://entreprises.selectra.info/sites/entreprises.selectra.info/files/images/boursorama_banque_carre.png",
      labels: {},
    },
    {
      key: "4",
      name: "Powens",
      provider: ConnectorProvider.Wealthcome,
      logo: "https://www.powens.com/wp-content/uploads/2022/10/Temporary_powens_logo_Gradient.svg",
      labels: { username: "email", secret: "password" },
    },
  ];
}

export function migratorListMock(): Migrator[] {
  return [
    {
      key: "1",
      name: "Harverst",
      logo: "https://www.harvest.fr/wp-content/themes/harvestfr/assets/img/logo_harvest.svg",
    },
    {
      key: "2",
      name: "Manymore",
      logo: "https://www.manymore.fr/_assets/img/mm_plp_logo.svg",
    },
  ];
}

export function connectionListMock(): Connection[] {
  return [
    {
      id: "1",
      state: ConnectionState.Active,
      connector: connectorListMock()[0],
      updated: date,
      manager: managerListMock()[0],
    },
    {
      id: "2",
      state: ConnectionState.RequireOtp,
      connector: connectorListMock()[1],
      updated: date,
      manager: managerListMock()[1],
    },
    {
      id: "3",
      state: ConnectionState.Pending,
      connector: connectorListMock()[2],
      updated: date,
      manager: managerListMock()[2],
    },
  ];
}

export function customerGeneralInformationsMock() {
  return {
    birthName: "text",
    firstName: "text",
    lastName: "text",
    birthDate: date,
    birthCity: "text",
    birthCountry: "text",
    familySituation: "text",
    nationality: "text",
    studiesLevel: "text",
    occupation: "text",
    occupationWording: "text",
    retirementAge: 1,
    annualIncome: 1,
    globalHeritage: 1,
    heritageOrigin: "text",
    managers: [
      {
        managerID: "someId",
        primary: true,
      },
    ],
    seniorAdvisor: "text",
    dateEntryRelationship: date,
    idCard: "file",
    idNumber: "text",
    issueDate: date,
    authority: "text",
    expirationDate: date,
    idNIF: "text",
    idMIF: "text",
    taxResidence: "text",
    customerClassificationMIF: "text",
    classificationDate: date,
    pep: "text",
    usPerson: "text",
    legalCapacity: 1,
  };
}

export function customerDetailsInformationsMock() {
  return {
    street: "text",
    zipCode: 2,
    city: "text",
    addressSupplement: "text",
    country: "text",
    workStreet: "text",
    workZipCode: 2,
    workCity: "string",
    workCountry: "string",
    otherStreet: "string",
    otherZipCode: 2,
    otherCity: "string",
    otherCountry: "string",
    fiscalAddress: "string",
    firstPhoneNumber: "555555",
    secondPhoneNumber: "555555",
    personalEmail: "personalEmail@gmail.com",
    otherEmail: "otherEmail@gmail.com",
  };
}
export function customerFiscalityInformationsMock() {
  return {
    wages: 2,
    pension: 2,
    bic: 2,
    bnc: 2,
    ba: 2,
    furnitureIncome: 2,
    propertyIncome: 2,
    totalReportedIncome: 2,
    totalGrossIncome: 2,
    deductibleExpenses: 2,
    taxableIncome: 2,
    partsNumber: 2,
    marginalTaxRate: 2,
    taxReductionsCredits: 2,
    builtBuildings: 2,
    unbuiltBuildings: 2,
    realEstateRights: 2,
    deductibleLiabilities: 2,
    taxBase: 2,
    realEstateWealthTax: 2,
    realEstateWealthTaxReduction: 2,
    subjectToIncomeTax: false,
    socialContributions: 2,
    payableTax: 2,
    subjectRealEstateWealthTax: false,
    realEstateWealthPayableTax: 2,
  };
}

export function complianceMock() {
  return [
    {
      category: {
        key: "official",
        name: "OFFICIAL",
        customerVisibility: true,
      },
      levels: {
        valid: 0,
        unvalid: 0.5714285714285714,
        waiting: 0.42857142857142855,
      },
    },
    {
      category: {
        key: "legal",
        name: "LEGAL",
        customerVisibility: true,
      },
      levels: {
        valid: 0.2857142857142857,
        unvalid: 0.42857142857142855,
        waiting: 0.2857142857142857,
      },
    },
    {
      category: {
        key: "arbitrary",
        name: "ARBITRARY",
        customerVisibility: true,
      },
      levels: {
        valid: 0,
        unvalid: 0.9285714285714286,
        waiting: 0.07142857142857142,
      },
    },
  ];
}

export function customerWealthMock() {
  return {};
}

export function customerConformityObjectivesMock() {
  return {
    retirementPreparation: 123,
    fiscalityOptimization: 787,
  };
}

export function investorProfileMock() {
  return {
    contactDontAnswer: true,
  };
}

export function compnayWealthMock() {
  return [
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
      name: AssetGroup.Crypto,
      amount: {
        value: 10_000,
        instrument: "EUR",
      },
      performance: {
        gain: {
          value: 3000,
          instrument: "EUR",
        },
        evolution: 0.3,
      },
    },
    {
      name: AssetGroup.LifeInsuranceCapitalization,
      amount: {
        value: 500,
        instrument: "EUR",
      },
      performance: {
        gain: {
          value: 10,
          instrument: "EUR",
        },
        evolution: 178.3,
      },
    },
  ];
}

export function budgetListMock() {
  return [
    {
      id: "1",
      name: "wagesAndSalaries",
      type: "employmentIncome",
      libelle: "Revenu test",
      amount: {
        value: 1000,
        instrument: "EUR",
      },
    },
    {
      id: "2",
      name: "partTimeWorkOrOddJobsIncome",
      type: "employmentIncome",
      amount: {
        value: 900,
        instrument: "EUR",
      },
    },
    {
      id: "3",
      name: "dividendsFromShares",
      type: "investmentIncome",
      amount: {
        value: 900,
        instrument: "EUR",
      },
    },
    {
      id: "4",
      name: "revenueFromLicensesPatentsOrCopyrights",
      type: "investmentIncome",
      amount: {
        value: 2400,
        instrument: "EUR",
      },
    },
    {
      id: "5",
      name: "gamblingOrLotteryWinnings",
      type: "investmentIncome",
      amount: {
        value: 100,
        instrument: "EUR",
      },
    },
    {
      id: "6",
      name: "rentOrMortgage",
      type: "housingCosts",
      amount: {
        value: 2400,
        instrument: "EUR",
      },
    },
    {
      id: "7",
      name: "internetAndTelephonyExpenses",
      type: "livingExpenses",
      amount: {
        value: 100,
        instrument: "EUR",
      },
    },
  ];
}

export function managerInvitationListMock(limit = 6): ManagerInvite[] {
  return companyListMock()
    .slice(0, limit)
    .map((company, index) => ({
      id: `${company.id}-${index}`,
      created: date,
      updated: date,
      company: {
        ...company,
      },
    }));
}

export function investorProfileFormMock() {
  return {
    q0: {
      _0: 5,
      _1: false,
      _2: 1,
      _3: false,
      _4: 4,
      _5: 2,
      _6: 0,
    },
    q1: {
      _0: 3,
      _1: 2,
      _2: 1,
      _3: false,
    },
    q2a: {
      0: 1,
      1: 1,
      2: 0,
      3: 0,
      4: 1,
      5: -1,
      6: -1,
      7: 1,
      8: 0,
      9: 1,
      10: -1,
    },
    q2b: {
      b1: 1,
      b2: 1,
      b3: 0,
      b4: 0,
      b5: 3,
      b6: 1,
      b7: 2,
      b8: 1,
      b9: 2,
      b10: 1,
      b11: 3,
    },
    q3: 2,
    q4: 2,
    q5: 5,
    q6: 3,
    q7: 5,
    q8: 4,
    q9a: 2,
    q9b: 1,
    q10: 2,
    q11: 4,
    q12: 3,
    q13: {
      1: 3,
      2: null,
      3: 1,
      4: null,
      5: 4,
      6: null,
    },
    q14: 2,
    q15: 3,
    q16: {
      1: 3,
      2: 1,
      3: 1,
      4: 3,
    },
    q17: {
      1: 2,
      2: 3,
      3: 1,
    },
    q18: 2,
    personalInfos: {},
    personalSituation: {
      civility: null,
      familySituation: null,
      dependentsNb: 0,
      mainZipCode: "",
      score: 0,
    },
    updated: new Date().toString(),
    finalSri: 0,
    professionalSituation: {
      formationLevel: null,
      professionalStatus: null,
      currentPastProfession: null,
      agePensionEnvisage: 0,
      score: 0,
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
      financialAssetSituationEvolution: {
        professionalIncomeComingEvolution: null,
        heritageComingEvolution: null,
        incomeForUnexpectedExpenses: null,
      },
      score: 0,
    },
    financialKnowledgeAndExperience: {
      instruments: {
        equities: {
          knowledgeActivityInFinancialProductsInstruments: [],
          transactionsNumberLast12Months: null,
          investmentsAmountMadeLast12Months: null,
        },
        bonds: {
          knowledgeActivityInFinancialProductsInstruments: [],
          transactionsNumberLast12Months: null,
          investmentsAmountMadeLast12Months: null,
        },
        euroFunds: {
          knowledgeActivityInFinancialProductsInstruments: [],
          transactionsNumberLast12Months: null,
          investmentsAmountMadeLast12Months: null,
        },
        financialRealEstate: {
          knowledgeActivityInFinancialProductsInstruments: [],
          transactionsNumberLast12Months: null,
          investmentsAmountMadeLast12Months: null,
        },
        structuredProducts: {
          knowledgeActivityInFinancialProductsInstruments: [],
          transactionsNumberLast12Months: null,
          investmentsAmountMadeLast12Months: null,
        },
        ventureCapital: {
          knowledgeActivityInFinancialProductsInstruments: [],
          transactionsNumberLast12Months: null,
          investmentsAmountMadeLast12Months: null,
        },
        ucits: {
          knowledgeActivityInFinancialProductsInstruments: [],
          transactionsNumberLast12Months: null,
          investmentsAmountMadeLast12Months: null,
        },
        leveragedProducts: {
          knowledgeActivityInFinancialProductsInstruments: [],
          transactionsNumberLast12Months: null,
          investmentsAmountMadeLast12Months: null,
        },
        savingsAccounts: {
          knowledgeActivityInFinancialProductsInstruments: [],
          transactionsNumberLast12Months: null,
          investmentsAmountMadeLast12Months: null,
        },
        lifeInsurance: {
          knowledgeActivityInFinancialProductsInstruments: [],
          transactionsNumberLast12Months: null,
          investmentsAmountMadeLast12Months: null,
        },
        peaSecuritiesAccount: {
          knowledgeActivityInFinancialProductsInstruments: [],
          transactionsNumberLast12Months: null,
          investmentsAmountMadeLast12Months: null,
        },
      },
      investissorRate: null,
      financialInvestmentsTime: null,
      bestDescribes: null,
      observedDecreaseValue: null,
      knownManagementModes: [],
      choiceManagementModes: [],
      informationSourcesForInvestments: [],
      score: 0,
    },
    sustainableInvestment: {
      includeEnvironmentalSocialGovernanceDimension: null,
      optionsDefineSustainabilityComponent: null,
      preferredASGDimension: null,
      excludeNegativeActivitiesEnvironmentalSocial: null,
      issuesMinimizeNegativeImpacts: [],
      score: 0,
    },
    attitudeTowardsRisk: {
      franceEconomisClimateOpinionNext3Years: null,
      closestAttitudes: null,
      reactionToDecreaseInvestmentValue: null,
      preferredReturn: null,
      investment15000Over10Years1: null,
      investment15000Over10Years2: null,
      investment15000Over10Years3: null,
      investment15000Over10Years4: null,
      investment15000Over10Years5: null,
      investment15000Over10Years6: null,
      score: 0,
    },
  };
}

export function companyAssetTypeWealthMock(): AssetConnection {
  return {
    totalCount: 6,
    totalPages: 1,
    edges: [
      {
        node: {
          id: "2ad2abba-2ad1-4617-9006-bb0f21bda34f",
          name: "Comptes titres",
          underManagement: true,
          activity: null,
          isManual: true,
          performance: {
            gain: {
              value: null,
            },
            evolution: 0,
          },
          customer: null,
          group: AssetGroup.Banking,
          categoryName: undefined,
        },
      },
      {
        node: {
          id: "2ad2abba-2ad1-4617-9006-bb0f21bda343456",
          name: "Comptes titres 2",
          underManagement: false,
          activity: null,
          performance: {
            gain: {
              value: null,
            },
            evolution: 0,
          },
          isManual: true,
          customer: null,
          group: AssetGroup.Banking,
        },
      },
      {
        node: {
          id: "3d53950d-c727-4ada-aa49-ff76c35bd657",
          name: "btc",
          underManagement: false,
          group: AssetGroup.Crypto,
          isManual: true,
          activity: {
            id: "2ec24ee9-774b-4a86-8f9f-9c3de5b5652f",
            value: 331781.5023852,
            instrument: "EUR",
            start: "2023-07-11T10:01:13.230Z",
            asset: "3d53950d-c727-4ada-aa49-ff76c35bd657",
          },
          performance: {
            gain: {
              value: -1224.2352876000223,
              instrument: "EUR",
            },
            evolution: -0.003703549761132784,
          },
          customer: {
            id: "3a4847b3-3bc6-4150-8384-8072f6b85099",
            name: "FOIN WEALTHCOME",
            email: "eric@gmail.com",
            created: date,
            updated: date,
            conformity: Treatement.Valid,
            wealth: {},
            plan: faker.helpers.arrayElement(Object.values(CustomerPlan)),
          },
        },
      },
      {
        node: {
          id: "01cba678-ea16-436d-ac66-e706e8350bb4",
          name: "revolut",
          underManagement: true,
          group: AssetGroup.Crypto,
          activity: {
            id: "d22d4cbe-a7f8-4c6f-a264-dc64d0dda566",
            value: 27648.4585321,
            instrument: "EUR",
            start: "2023-07-11T10:01:11.635Z",
            asset: "01cba678-ea16-436d-ac66-e706e8350bb4",
          },
          isManual: true,
          performance: {
            gain: {
              value: -42.72269029999734,
              instrument: "EUR",
            },
            evolution: -0.0015428265756116618,
          },
          customer: {
            id: "e8e34165-2179-4202-970a-39c827f69469",
            name: "blue33115",
            email: "blue33115@gmail.com",
            created: date,
            updated: date,
            conformity: Treatement.Valid,
            wealth: {},
            plan: faker.helpers.arrayElement(Object.values(CustomerPlan)),
          },
        },
      },
      {
        node: {
          id: "7e13fb14-01f9-4e99-af50-327748e7148d",
          name: "Comptes titres",
          underManagement: false,
          group: AssetGroup.Banking,
          activity: {
            id: "85b22083-3a93-4aa9-87d4-d5eaa8ab4739",
            value: 0,
            instrument: "EUR",
            start: "2023-07-11T10:01:04.640Z",
            asset: "7e13fb14-01f9-4e99-af50-327748e7148d",
          },
          isManual: true,
          performance: {
            gain: {
              value: 0,
              instrument: "EUR",
            },
            evolution: 0,
          },
          customer: {
            id: "8f099627-04fa-4767-b03f-fbc562b80b62",
            name: "solaldunckel",
            email: "solaldunckel@gmail.com",
            created: date,
            updated: date,
            conformity: Treatement.Valid,
            wealth: {},

            plan: faker.helpers.arrayElement(Object.values(CustomerPlan)),
          },
        },
      },
      {
        node: {
          id: "464bb39a-3826-411e-9200-b6cdc4557982",
          name: "Comptes titres",
          underManagement: false,
          group: AssetGroup.Banking,
          activity: {
            id: "afc19934-882c-4a28-8377-a72aca601135",
            value: 0,
            instrument: "EUR",
            start: "2023-07-11T10:01:10.797Z",
            asset: "464bb39a-3826-411e-9200-b6cdc4557982",
          },
          performance: {
            gain: {
              value: 0,
              instrument: "EUR",
            },
            evolution: 0,
          },
          isManual: true,
          customer: {
            id: "e8e34165-2179-4202-970a-39c827f69469",
            name: "blue33115",
            email: "blue33115@gmail.com",
            created: date,
            updated: date,
            conformity: Treatement.Valid,
            wealth: {},
            plan: faker.helpers.arrayElement(Object.values(CustomerPlan)),
          },
        },
      },
      {
        node: {
          id: "7198699e-ba40-4edf-a570-b5492784eef6",
          name: "ORD (TR) FOIN",
          underManagement: true,
          group: AssetGroup.Crypto,
          isManual: true,
          activity: {
            id: "eec457cb-f12e-43e2-ab5f-bc60ff12804c",
            value: 0,
            instrument: "EUR",
            start: "2023-07-11T10:01:10.684Z",
            asset: "7198699e-ba40-4edf-a570-b5492784eef6",
          },
          performance: {
            gain: {
              value: 0,
              instrument: "EUR",
            },
            evolution: 0,
          },
          customer: {
            id: "e8e34165-2179-4202-970a-39c827f69469",
            name: "blue33115",
            email: "blue33115@gmail.com",
            created: date,
            updated: date,
            conformity: Treatement.Valid,
            wealth: {},
            plan: faker.helpers.arrayElement(Object.values(CustomerPlan)),
          },
        },
      },
    ],
  };
}

export function installedListMock() {
  return [
    {
      key: "docusign",
      added: "2025-02-04T09:39:55.185Z",
      state: IntegrationState.Unconfigured,
      manager: {
        id: "1",
        name: "Manager 1",
        email: "manager@gmail.com",
      },
      access: [],
      configuration: {
        url: "https://www.docusign.com",
      },
    },
    {
      key: "google-calendar",
      added: "2025-02-04T09:39:55.185Z",
      state: IntegrationState.Unconfigured,
      manager: {
        id: "2",
        name: "Manager 2",
        email: "manager2@gmail.com",
      },
      access: [],
      configuration: {
        url: "https://www.google.com/calendar",
      },
    },
    {
      key: "e-dixit",
      added: "2025-02-04T09:39:55.185Z",
      state: IntegrationState.Unconfigured,
      manager: {
        id: "3",
        name: "Manager 3",
        email: "manager3@gmail.com",
      },
      access: [],
      configuration: {
        url: "https://www.e-dixit.com",
      },
    },
  ];
}

export function assetTypeListMock() {
  return [
    {
      name: AssetGroup.Banking,
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
      assetsUnderManagement: [
        {
          id: "asset-1",
          name: "Villa Arcachon",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: null,
        },
        {
          id: "asset-2",
          name: "Villa Saint Barth",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "Client-2",
            name: "Client-2",
          },
        },
      ],
    },
    {
      name: AssetGroup.Crypto,
      amount: {
        value: 3_0000,
        instrument: "EUR",
      },
      performance: {
        gain: {
          value: 300,
          instrument: "EUR",
        },
        evolution: 0.3,
      },
      assetsUnderManagement: [
        {
          id: "asset-1",
          name: "Villa Arcachon",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "client-1",
            name: "Client-1",
          },
        },
        {
          id: "asset-2",
          name: "Villa Saint Barth",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "Client-2",
            name: "Client-2",
          },
        },
      ],
    },
    {
      name: AssetGroup.Securities,
      amount: {
        value: 3_0000,
        instrument: "EUR",
      },
      performance: {
        gain: {
          value: 300,
          instrument: "EUR",
        },
        evolution: 0.3,
      },
      assetsUnderManagement: [
        {
          id: "asset-1",
          name: "Villa Arcachon",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "client-1",
            name: "Client-1",
          },
        },
        {
          id: "asset-2",
          name: "Villa Saint Barth",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "Client-2",
            name: "Client-2",
          },
        },
      ],
    },
    {
      name: AssetGroup.LifeInsuranceCapitalization,
      amount: {
        value: 3_0000,
        instrument: "EUR",
      },
      performance: {
        gain: {
          value: 300,
          instrument: "EUR",
        },
        evolution: 0.3,
      },
      assetsUnderManagement: [
        {
          id: "asset-1",
          name: "Villa Arcachon",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "client-1",
            name: "Client-1",
          },
        },
        {
          id: "asset-2",
          name: "Villa Saint Barth",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "Client-2",
            name: "Client-2",
          },
        },
      ],
    },
    {
      name: AssetGroup.Banking,
      amount: {
        value: 3_0000,
        instrument: "EUR",
      },
      performance: {
        gain: {
          value: 300,
          instrument: "EUR",
        },
        evolution: 0.3,
      },
      assetsUnderManagement: [
        {
          id: "asset-1",
          name: "Villa Arcachon",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "client-1",
            name: "Client-1",
          },
        },
        {
          id: "asset-2",
          name: "Villa Saint Barth",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "Client-2",
            name: "Client-2",
          },
        },
      ],
    },
    {
      name: AssetGroup.Exotic,
      amount: {
        value: 3_0000,
        instrument: "EUR",
      },
      performance: {
        gain: {
          value: 300,
          instrument: "EUR",
        },
        evolution: 0.3,
      },
      assetsUnderManagement: [
        {
          id: "asset-1",
          name: "Villa Arcachon",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "client-1",
            name: "Client-1",
          },
        },
        {
          id: "asset-2",
          name: "Villa Saint Barth",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "Client-2",
            name: "Client-2",
          },
        },
      ],
    },
    {
      name: AssetGroup.HeritageRealEstate,
      amount: {
        value: 100_0000,
        instrument: "EUR",
      },
      performance: {
        gain: {
          value: 300,
          instrument: "EUR",
        },
        evolution: 0.3,
      },
      assetsUnderManagement: [
        {
          id: "asset-1",
          name: "Villa Arcachon",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "client-1",
            name: "Client-1",
          },
        },
        {
          id: "asset-2",
          name: "Villa Saint Barth",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "Client-2",
            name: "Client-2",
          },
        },
      ],
    },
    {
      name: AssetGroup.RetirementEmployee,
      amount: {
        value: 3_0000,
        instrument: "EUR",
      },
      performance: {
        gain: {
          value: 300,
          instrument: "EUR",
        },
        evolution: 0.3,
      },
      assetsUnderManagement: [
        {
          id: "asset-1",
          name: "Villa Arcachon",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "client-1",
            name: "Client-1",
          },
        },
        {
          id: "asset-2",
          name: "Villa Saint Barth",
          valuation: {
            value: 1_000,
            instrument: "EUR",
          },
          customer: {
            id: "Client-2",
            name: "Client-2",
          },
        },
      ],
    },
  ];
}

function customerWalletInvestmentListMock(): CustomerInvestment[] {
  const categories = ["SCPI", "Allocation Flexible", "Autres"];

  return Array.from({ length: 13 }, (_, i) => {
    const id = (i + 1).toString();

    return {
      id,
      label: `Investment ${id}`,
      buyingDate: mockRandomDateBeforeToday(),
      category: categories[i % categories.length],
      code: `code ${id}`,
      dateValuation: mockRandomDateBeforeToday(),
      dateValue: mockRandomDateBeforeToday(),
      instrument: "EUR",
      quantity: mockRandomAmount(10000).value,
      unitPrice: 0.68,
      unitValue: mockRandomAmount(10000).value,
      valuation: mockRandomAmount(10000),
    };
  });
}

export function customerWalletListMock(): CustomerWallet[] {
  const investments = customerWalletInvestmentListMock();
  const datas = [
    { transfersAmount: 45034, valuation: 37965.18 },
    { transfersAmount: 44290, valuation: 42939 },
    { transfersAmount: 18000, valuation: 6690 },
    { transfersAmount: 2998.8, valuation: 2671.8 },
    { transfersAmount: 26996.74, valuation: 20471.99 },
  ];

  return datas.map((data, i) => {
    const id = (i + 1).toString();

    return {
      id,
      accountNumber: `FR${id}`,
      group: AssetGroup.LifeInsuranceCapitalization,
      insuranceCompany: `Insurance Company ${id}`,
      name: `Wallet ${id}`,
      openDate: date,
      transfersAmount: { value: data.transfersAmount, instrument: "EUR" },
      withdrawalAmount: { value: 0, instrument: "EUR" },
      valuation: { value: data.valuation, instrument: "EUR" },
      risk: 0.5,
      investments,
    };
  });
}

export function documentCategoryListMock(): DocumentCategoryV2[] {
  const categories = [
    { key: "arbitrary", name: "ARBITRARY", customerVisibility: true },
    { key: "official", name: "OFFICIAL", customerVisibility: true },
    { key: "legal", name: "LEGAL", customerVisibility: true },
    { key: "other", name: "Other", customerVisibility: true },
  ];

  return categories.map((category, index) => ({
    name: category.name,
    key: category.key,
    customerVisibility: category.customerVisibility,
    documents: Array.from({ length: 3 }, (_, i) =>
      documentMock({
        id: i + "",
        name: `document ${category.name} ${i}`,
        conformity: (index % 2) * 0.5,
        treatement: treatementList[index % treatementList.length],
        customer: customerListMock()[index],
        category: defaultCategories[index % defaultCategories.length],
      })
    ),
  }));
}

export function instrumentPaginatedMock(): InstrumentPaginated {
  const total = 2;

  return {
    totalCount: total,
    totalPages: 7,
    instruments: Array.from({ length: total }, (_, i) => ({
      code: `code ${i}`,
      label: `A super super super super super super super super long label ${i}`,
      valuation: {
        value: 1000,
        instrument: "EUR",
      },
      category: `category ${i}`,

      managementCompany: `managementCompany ${i}`,
      subcategory: `subcategory ${i}`,
      riskIndicator: i % 5,
    })),
  };
}
function companyFormMock(index = 0): HoldingCompanyFormDataType {
  return {
    socialReason: `Company ${index}`,
    siren: "123456789",
    siret: "123456789",
    ape: "123456789",
    creationDate: new Date(date),
    legalForm: "123456789",
    socialCapital: 123456789,
    headOfficeAddress: "123456789",
    phone: "123456789",
    email: "123456789",
    lastNameFirstName: "123456789",
    function: "123456789",
    birthDate: new Date(date),
    nationality: "French",
    managers: [
      {
        managerID: "someId",
        primary: true,
      },
    ],
    personalAddress: "1 rue de la paix",
    personalPhoneNumber: "123456789",
    personalEmailAddress: "personal@mail.com",
    shareholderInformation: "123456789",
    holdingId: "123456789",
    mainActivities: "work",
    secondaryActivities: "work",
    clients: "123",
    suppliers: "123",
    competitors: "123",
    banks: "123",
    iban: "123456789",
    bankAccountNumbers: "123456789",
    bic: "123456789",
  };
}

export function holdingMock(): Holding[] {
  const total = 2;
  const companyList = customerListMock();

  return Array.from({ length: total }, (_, i) => ({
    id: i.toString(),
    name: `Holding ${i}`,
    form: {},
    companies: companyList.slice(i * 2, i * 2 + 2).map((company) => ({
      id: company.id,
      name: company.name,
      ownerName: "Jean Dupont",
      created: date,
      form: company.informations?.general,
    })),
  }));
}

export function customerRelationMock(): CustomerRelationForm[] {
  const customers = [
    {
      id: "1",
      name: faker.person.firstName(),
      email: faker.internet.email(),
    },
    {
      id: "2",
      name: faker.person.firstName(),
      email: faker.internet.email(),
    },
    {
      id: "3",
      name: faker.person.firstName(),
      email: faker.internet.email(),
    },
  ];
  const denominationList = ["hasPaternalGrandparents", "liveInPartnerOf"];
  const fistName = ["Jean", "Paul"];
  const lastName = ["Dupont", "Durand"];

  return customers.map((customer, index) => ({
    id: customer.id,
    birthDate: new Date(`199${index + 1}-05-08`),
    denomination: denominationList[index % denominationList.length],
    firstName: fistName[index % fistName.length],
    lastName: lastName[index % lastName.length],
    birthPlace: "Paris",
    nationality: "French",
    countryOfBirth: "France",
    maritalStatus: "Single",
    phone: "123456789",
    email: customer.email ?? "",
  }));
}

export const mainResidenceMock = (): CustomerAsset => {
  return {
    id: "55385525-07a1-4c4e-a4c1-9359b50046af",
    name: "Name",
    group: AssetGroup.HeritageRealEstate,
    activity: {
      instrument: "EUR",
      value: 250000,
    },
    underManagement: true,
    categoryName: "primary",
    accountNumber: null,
    isManual: true,
    metadata: {
      lat: 0,
      lon: 0,
      area: null,
      pool: "NONE",
      floor: null,
      price: 0,
      rooms: null,
      vista: "OPEN_VIEW",
      floors: null,
      garden: "LANDSCAPE",
      source: "",
      typeId: "SIMPLEX",
      comment: "",
      areaLand: null,
      bedrooms: null,
      bathrooms: null,
      condition: "STANDARD",
      ownership: 1,
      buyingDate: "2023-12-22T00:00:00.000Z",
      areaBalcony: null,
      orientation: null,
      otherOwners: "",
      parkingPlots: null,
      annualRevenues: 0,
      buildingFloors: null,
      amenityProximity: "STANDARD",
      buildingStanding: "NORMAL",
      condominiumCondition: "STANDARD",
    },
    openDate: null,
    performance: null,
    investmentList: null,
  };
};
