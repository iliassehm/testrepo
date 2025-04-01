import { useParams } from "@tanstack/react-router";
import { TFunction } from "i18next";
import { Tooltip } from "primereact/tooltip";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Text } from "../../../../../components";
import { PercentPie } from "../../../../../components";
import { Accordion } from "../../../../../components/Accordion";
import { LargeTitle } from "../../../../../components/LargeTitle";
import { formatCurrency } from "../../../../../helpers";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import {
  Amount,
  Budget,
  BudgetCreationInput,
  PercentPieProps,
} from "../../../../../types";
import { CompanyCustomersFiscalityLogic } from "../fiscality/fiscality.logic";
import {
  AnnualDialog,
  AnnualDialogProps,
  BudgetFormItemList,
} from "./AnnualDialog";
import { AnnualDialogUpdate, UpdateData } from "./AnnualDialogUpdate";
import { BudgetLogic } from "./budget.logic";

export const annualIncomesNames = [
  {
    label: "employmentIncome",
    items: [
      {
        label: "wagesAndSalaries",
        value: "wagesAndSalaries",
      },
      {
        label: "partTimeWorkOrOddJobsIncome",
        value: "partTimeWorkOrOddJobsIncome",
      },
      {
        label: "managementIncome",
        value: "managementIncome",
      },
      {
        label: "nonCommercialProfits",
        value: "nonCommercialProfits",
      },
      {
        label: "commercialAndIndustrialProfits",
        value: "commercialAndIndustrialProfits",
      },
    ],
  },
  {
    label: "investmentIncome",
    items: [
      {
        label: "interestsOnSavingsAndInvestments",
        value: "interestsOnSavingsAndInvestments",
      },
      { label: "dividendsFromShares", value: "dividendsFromShares" },
      {
        label: "capitalGainsOnAssetSales",
        value: "capitalGainsOnAssetSales",
      },
      { label: "fixedIncomeInvestments", value: "fixedIncomeInvestments" },
      {
        label: "revenueFromLicensesPatentsOrCopyrights",
        value: "revenueFromLicensesPatentsOrCopyrights",
      },
      { label: "lifeInsurancePayments", value: "lifeInsurancePayments" },
      {
        label: "gamblingOrLotteryWinnings",
        value: "gamblingOrLotteryWinnings",
      },
    ],
  },
  {
    label: "companyIncome",
    items: [
      {
        label: "companyProfits",
        value: "companyProfits",
      },
    ],
  },
  {
    label: "propertyIncome",
    items: [
      { label: "rentalRealEstateIncome", value: "rentalRealEstateIncome" },
      { label: "personalPropertyRentals", value: "personalPropertyRentals" },
      { label: "salesOfPersonalProperty", value: "salesOfPersonalProperty" },
    ],
  },
  {
    label: "retirementIncome",
    items: [
      {
        label: "retirementIncome",
        value: "retirementIncome",
      },
    ],
  },
  {
    label: "socialSecurityBenefits",
    items: [
      {
        label: "socialBenefits",
        value: "socialBenefits",
      },
    ],
  },
  {
    label: "otherIncome",
    items: [
      {
        label: "scholarshipsOrGrants",
        value: "scholarshipsOrGrants",
      },
      {
        label: "alimonyReceived",
        value: "alimonyReceived",
      },
      {
        label: "monetaryGiftsReceived",
        value: "monetaryGiftsReceived",
      },
      {
        label: "miscellaneousIncome",
        value: "miscellaneousIncome",
      },
    ],
  },
];

export const annualExpensesNames = [
  {
    label: "housingCosts",
    items: [
      {
        label: "rentOrMortgage",
        value: "rentOrMortgage",
      },
      {
        label: "electricityGasAndWaterBills",
        value: "electricityGasAndWaterBills",
      },
      {
        label: "homeMaintenanceExpenses",
        value: "homeMaintenanceExpenses",
      },
    ],
  },
  {
    label: "livingExpenses",
    items: [
      {
        label: "foodAndLivingExpenses",
        value: "foodAndLivingExpenses",
      },
      {
        label: "transportationCosts",
        value: "transportationCosts",
      },
      {
        label: "medicalExpensesNotCoveredByInsurance",
        value: "medicalExpensesNotCoveredByInsurance",
      },
      {
        label: "internetAndTelephonyExpenses",
        value: "internetAndTelephonyExpenses",
      },
    ],
  },
  {
    label: "financialExpenses",
    items: [
      {
        label: "debtOrPersonalLoanRepayments",
        value: "debtOrPersonalLoanRepayments",
      },
      {
        label: "bankServiceCharges",
        value: "bankServiceCharges",
      },
      {
        label: "savingsAndInvestments",
        value: "savingsAndInvestments",
      },
      {
        label: "insurances",
        value: "insurances",
      },
    ],
  },
  {
    label: "taxeGeneral",
    items: [
      {
        label: "incomeTax",
        value: "incomeTax",
      },
      {
        label: "corporateTax",
        value: "corporateTax",
      },
      {
        label: "propertyTax",
        value: "propertyTax",
      },
      {
        label: "localTaxes",
        value: "localTaxes",
      },
      {
        label: "socialCharges",
        value: "socialCharges",
      },
      {
        label: "realEstateWealthTax",
        value: "realEstateWealthTax",
      },
    ],
  },
  {
    label: "educationChildcare",
    items: [
      {
        label: "educationRelatedExpenses",
        value: "educationRelatedExpenses",
      },
      {
        label: "childcareExpenses",
        value: "childcareExpenses",
      },
    ],
  },
  {
    label: "entertainmentAndLeisureExpenses",
    items: [
      {
        label: "entertainmentAndLeisureExpenses",
        value: "entertainmentAndLeisureExpenses",
      },
      {
        label: "membershipDues",
        value: "membershipDues",
      },
      {
        label: "travelAndHolidays",
        value: "travelAndHolidays",
      },
    ],
  },
  {
    label: "otherExpenses",
    items: [
      {
        label: "alimonyPaid",
        value: "alimonyPaid",
      },
      {
        label: "petExpenses",
        value: "petExpenses",
      },
      {
        label: "miscellaneousExpenses",
        value: "miscellaneousExpenses",
      },
    ],
  },
];

type Type = "incomes" | "expenses";

export function BudgetPerson() {
  const [visible, setVisible] = useState<Type | false>(false);
  const [visibleUpdate, setVisibleUpdate] = useState<Type | false>(false);

  const { t } = useTranslation();
  const toast = useToast();
  const annualIncomesRef = useRef<HTMLDivElement>(null);
  const annualExpensesRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/budget",
  });

  // This function check if the given ref belongs to
  // the incomes' table or the expenses' table.
  const findAnnualRef = (type: string) => {
    const foundInIncomesTable = annualIncomesNames.some(
      (chef) => chef.label === type
    );
    const foundInExpensesTable = annualExpensesNames.some(
      (chef) => chef.label === type
    );

    if (foundInIncomesTable) {
      return "incomes";
    }

    if (foundInExpensesTable) {
      return "expenses";
    }
    return null;
  };

  // This queryKey must be the same as the one used withCustomer HOC
  // // to avoid re-fetching twice
  const queryKey = ["budget", companyId, customerId];

  const { data: budgetData } = useQuery(queryKey, () =>
    gql.client.request(BudgetLogic.queries(), {
      companyID: companyId as string,
      customerID: customerId as string,
    })
  );

  const { data: customerFiscalityData } = useQuery(
    ["companyCustomersInformations", companyId, customerId],
    () =>
      gql.client.request(CompanyCustomersFiscalityLogic.queries(), {
        companyID: companyId as string,
        customerID: customerId as string,
        year: new Date().getFullYear(),
      })
  );

  const { mutate: submitForm, isLoading } = useMutation(
    "budget_creation",
    ({ input, budgetID }: { input: BudgetCreationInput; budgetID?: string }) =>
      gql.client.request(BudgetLogic.creation(), {
        customerID: customerId as string,
        companyID: companyId as string,
        input,
        budgetID: budgetID,
      }),
    {
      onSuccess: async (data, variables) => {
        if (data?.created?.name === "realEstateWealthTax") {
          fiscalityUpdateIFI.mutate({
            isSubjectToTax: true,
            amount: variables.input.amount,
          });
        }
        toast?.current?.show({
          severity: "success",
          summary: t(
            `scenes.wealth.${variables?.budgetID ? "update" : "creation"}.success.summary`
          ),
          detail: t(
            `scenes.wealth.${variables?.budgetID ? "update" : "creation"}.success.detail`,
            {
              name:
                data?.created?.libelle ??
                t(`forms.fields.budget.${data?.created?.name}`),
            }
          ),
        });

        const budgetCategory = findAnnualRef(data?.created?.type ?? "");
        if (budgetCategory === "incomes")
          annualIncomesRef?.current?.scrollIntoView({ behavior: "smooth" });
        else if (budgetCategory === "expenses")
          annualExpensesRef?.current?.scrollIntoView({ behavior: "smooth" });

        await queryClient.invalidateQueries(queryKey);
        setVisible(false);
        setVisibleUpdate(false);
      },
      async onError(error, variables) {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t(
            `scenes.budget.${variables?.budgetID ? "update" : "create"}.error.summary`
          ),
          detail: t(
            `scenes.budget.${variables?.budgetID ? "update" : "create"}.error.detail`,
            {
              name: t(`forms.fields.budget.${variables.input.name}`),
            }
          ),
        });
      },
    }
  );

  const { mutate: handleDelete } = useMutation(
    "budget_deletion",
    ({ budgetID }: { budgetID: Budget["id"]; budgetName?: Budget["name"] }) =>
      gql.client.request(BudgetLogic.budgetItemDeletionMutation(), {
        customerID: customerId as string,
        companyID: companyId as string,
        budgetID,
      }),
    {
      onSuccess: async (data, variables) => {
        if (
          variables?.budgetName &&
          variables.budgetName === "realEstateWealthTax"
        ) {
          fiscalityUpdateIFI.mutate({
            isSubjectToTax: false,
            amount: 0,
          });
        }
        toast?.current?.show({
          severity: "success",
          summary: t("forms.fields.notifications.success.delete") as string,
        });

        await queryClient.invalidateQueries(queryKey);
      },
      async onError(error) {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t("forms.fields.notifications.error.delete") as string,
        });
      },
    }
  );

  const fiscalityUpdateIFI = useMutation(
    "fiscality_update",
    ({ isSubjectToTax, amount }: { isSubjectToTax: boolean; amount: number }) =>
      gql.client.request(CompanyCustomersFiscalityLogic.updateFiscality(), {
        customerID: customerId,
        companyID: companyId,
        input: {
          ...customerFiscalityData?.customer?.fiscality, // Add the previous data
          subjectRealEstateWealthTax: isSubjectToTax,
          realEstateWealthPayableTax: amount,
        },
        year: new Date().getFullYear(),
      }),
    {
      onSuccess: () => {
        toast?.current?.show({
          severity: "success",
          summary: "Success",
          detail: t("forms.fields.notifications.success.save"),
        });
        queryClient.invalidateQueries([
          "companyCustomersInformations",
          companyId,
          customerId,
        ]);
      },
    }
  );

  const getFilteredList = useMemo(
    () => (data: BudgetFormItemList[]) => {
      const totalAmount: Amount = {
        value: 0,
        instrument: "EUR",
      };
      const budgetList = budgetData?.budgetList;
      const list = data
        .filter((items) =>
          budgetList?.map((budget) => budget.type)?.includes(items.label)
        )
        ?.map((data) => {
          const total: Amount = { value: 0, instrument: "EUR" };
          let items: Budget[] = [];
          for (const item of data.items) {
            items = [
              ...items,
              ...(budgetList?.filter((b) => b.name === item.value) || []),
            ];
          }
          for (const item of items) {
            total.value += item.amount.value;
          }

          if (total?.value !== undefined && totalAmount?.value) {
            totalAmount.value += total.value;
          }
          return {
            ...data,
            items,
            amount: total,
          };
        });
      return { list, totalAmount };
    },
    [budgetData?.budgetList]
  );

  function calculateTotalAmount(incomes: {
    list: List[];
    totalAmount: Amount;
  }) {
    incomes.totalAmount.value = incomes.list.reduce(
      (total, item) => total + (item.amount.value ?? 0),
      0
    );
    return incomes;
  }

  const filteredAnnualIncomes = getFilteredList(annualIncomesNames);
  const filteredAnnualExpenses = getFilteredList(annualExpensesNames);

  const summaryIncomesAmount = calculateTotalAmount(filteredAnnualIncomes);
  const summaryExpensesAmount = calculateTotalAmount(filteredAnnualExpenses);

  const expensesPie = (filteredAnnualExpenses.list ?? []).map(
    (value: { label: string; amount: Amount }) => ({
      id: value.label,
      label: t(`forms.fields.budget.${value.label}`),
      value: value?.amount?.value ?? 0,
    })
  );

  const incomesPie = (filteredAnnualIncomes.list ?? []).map((value) => ({
    id: value.label,
    label: t(`forms.fields.budget.${value.label}`),
    value: value?.amount?.value ?? 0,
  }));

  return (
    <div className="flex flex-col gap-y-11 max-w-8xl">
      <Section
        scrollRef={annualIncomesRef}
        type="incomes"
        visible={visible}
        visibleUpdate={visibleUpdate}
        pieData={incomesPie}
        isLoading={isLoading}
        items={annualIncomesNames}
        data={summaryIncomesAmount}
        t={t}
        onDelete={handleDelete}
        setVisible={setVisible}
        setVisibleUpdate={setVisibleUpdate}
        submitForm={submitForm}
        title="scenes.budget.annualIncome"
      />
      <Section
        scrollRef={annualExpensesRef}
        type="expenses"
        visible={visible}
        visibleUpdate={visibleUpdate}
        pieData={expensesPie}
        isLoading={isLoading}
        items={annualExpensesNames}
        data={summaryExpensesAmount}
        t={t}
        onDelete={handleDelete}
        setVisible={setVisible}
        setVisibleUpdate={setVisibleUpdate}
        submitForm={submitForm}
        title="scenes.budget.annualExpenses"
      />
    </div>
  );
}

type List = {
  items: (Budget | undefined)[];
  amount: Amount;
  label: string;
};

interface SectionProps {
  visible: Type | false;
  visibleUpdate: Type | false;
  type: "incomes" | "expenses";
  data: {
    list: List[];
    totalAmount: Amount;
  };
  isLoading: boolean;
  items: BudgetFormItemList[];
  pieData: PercentPieProps["data"];
  t: TFunction;
  onDelete: BudgetAccordionProps["onDelete"];
  setVisible: Dispatch<SetStateAction<Type | false>>;
  setVisibleUpdate: Dispatch<SetStateAction<Type | false>>;
  submitForm: AnnualDialogProps["onSubmit"];
  title: string;
  scrollRef: RefObject<HTMLDivElement>;
}

function Section({
  t,
  type,
  data,
  items,
  visible,
  visibleUpdate,
  pieData,
  isLoading,
  onDelete,
  setVisible,
  setVisibleUpdate,
  submitForm,
  title,
  scrollRef,
}: SectionProps) {
  const [updateData, setUpdateData] = useState({
    id: "",
    type: "",
    amount: 0,
    name: "",
  });

  return (
    <div
      className="flex relative flex-col gap-x-10 px-8 py-4 section md:flex-row"
      ref={scrollRef}
    >
      <div
        className="flex absolute top-3 right-3 z-50 justify-center items-center w-10 h-10 bg-blue-800 rounded-full drop-shadow-xl cursor-pointer shrink-0 hover:bg-blue-1000"
        onClick={() => setVisible(type)}
      >
        <Tooltip target=".pi-plus" />
        <i
          className="pi pi-plus"
          style={{ color: "white", fontWeight: "900" }}
          data-pr-tooltip={t("forms.fields.budget.noData") ?? ""}
          data-pr-position="left"
          data-pr-at="left-15 center"
          data-pr-my="right center"
        ></i>
      </div>
      <AnnualDialog
        visible={visible === type}
        onHide={() => setVisible(false)}
        onSubmit={submitForm}
        isLoading={isLoading}
        items={items}
      />
      <AnnualDialogUpdate
        visibleUpdate={visibleUpdate === type}
        onHide={() => setVisibleUpdate(false)}
        onSubmit={submitForm}
        isLoading={isLoading}
        items={items}
        updateData={updateData}
      />
      {data?.list.length === 0 && (
        <div className="flex absolute inset-0 z-30 justify-center items-center w-full h-full">
          <div className="px-3 py-1 rounded-lg shadow-lg w-fit bg-blue-1100">
            <Text
              label={"forms.fields.budget.noData"}
              className="font-medium text-white"
            />
          </div>
        </div>
      )}
      <div className="w-full md:w-2/5">
        <div className="flex justify-between w-full">
          <LargeTitle
            title={`${title}`}
            className="text-xl font-bold text-blue-1100"
          />
          <LargeTitle
            title={formatCurrency(data.totalAmount)}
            className="mr-10 text-xl font-bold text-right text-blue-1100 md:mr-0"
          />
        </div>
        <div className="flex flex-col gap-y-3 mt-6">
          {data?.list.map((income, index) => (
            <BudgetAccordion
              key={`${income.label}-${index}`}
              income={income as BudgetAccordionProps["income"]}
              onUpdate={(updateDataInput: UpdateData) => (
                setUpdateData(updateDataInput), setVisibleUpdate(type)
              )}
              onDelete={onDelete}
              t={t}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-8 w-full md:mt-0 md:w-3/5 md:justify-end">
        <div className="w-9/12">
          <PercentPie data={pieData} legendSide="bottom" />
        </div>
      </div>
    </div>
  );
}

interface BudgetAccordionProps {
  income: {
    items: Budget[];
    amount: Amount;
    label: string;
  };
  t: TFunction;
  onUpdate: (updateDataInput: UpdateData) => void;
  onDelete: ({
    budgetID,
    budgetName,
  }: {
    budgetID: Budget["id"];
    budgetName?: Budget["name"];
  }) => void;
}

function BudgetAccordion({
  income,
  onUpdate,
  onDelete,
  t,
}: BudgetAccordionProps) {
  return (
    <Accordion
      amount={income?.amount?.value ?? 0}
      title={`forms.fields.budget.${income.label}`}
    >
      <table className="min-w-full divide-y divide-gray-900">
        <tbody className="divide-y divide-gray-200">
          {income.items.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex gap-x-10 justify-between items-center p-2 w-full cursor-pointer hover:bg-gray-50"
            >
              <Text
                as="span"
                label={item?.libelle ?? `forms.fields.budget.${item?.name}`}
                className="text-xs text-left text-grey-700"
              />
              <div className="flex gap-x-3 items-center">
                <p className="text-xs font-bold text-right text-grey-800">
                  {Intl.NumberFormat(undefined, {
                    style: "currency",
                    maximumFractionDigits: 0,
                    currency: item.amount.instrument,
                  }).format(item.amount.value)}
                </p>
                <i
                  className="p-2 text-blue-700 rounded-full pi pi-pencil h-fit w-fit hover:bg-blue-50"
                  onClick={() => {
                    onUpdate({
                      id: item.id,
                      type: item.type,
                      amount: item.amount.value,
                      name: item.name,
                    } as UpdateData);
                  }}
                />
                <i
                  className="p-2 text-red-700 rounded-full pi pi-trash h-fit w-fit hover:bg-red-50"
                  onClick={() =>
                    confirm(t("forms.fields.pleaseConfirm") as string) &&
                    onDelete({ budgetID: item.id, budgetName: item.name })
                  }
                />
              </div>
            </div>
          ))}
        </tbody>
      </table>
    </Accordion>
  );
}
