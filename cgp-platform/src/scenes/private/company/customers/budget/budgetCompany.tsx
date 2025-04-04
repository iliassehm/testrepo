import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Button, Text } from "../../../../../components";
import { LargeTitle } from "../../../../../components/LargeTitle";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import { Amount, Budget, BudgetCreationInput } from "../../../../../types";
import FieldAmount from "../../../../../UIComponents/FieldAmount/FieldAmount";
import { Label } from "../../../../../UIComponents/Label/Label";
import labelStories from "../../../../../UIComponents/Label/label.stories";
import { BudgetFormItemList } from "./AnnualDialog";
import { BudgetLogic } from "./budget.logic";

export const annualIncomesNames = [
  {
    label: "operatingProducts",
    items: [
      {
        label: "salesOfGoods",
        value: "salesOfGoods",
      },
      {
        label: "provisionOfServices",
        value: "provisionOfServices",
      },
      {
        label: "operatingSubsidies",
        value: "operatingSubsidies",
      },
      {
        label: "rentalIncome",
        value: "rentalIncome",
      },
      {
        label: "fixedProduction",
        value: "fixedProduction",
      },
      {
        label: "stockChanges",
        value: "stockChanges",
      },
      {
        label: "productsOfSupportingActivities",
        value: "productsOfSupportingActivities",
      },
      {
        label: "rentalsAndLicenses",
        value: "rentalsAndLicenses",
      },
      {
        label: "publicityRevenues",
        value: "publicityRevenues",
      },
      {
        label: "receivedCommissions",
        value: "receivedCommissions",
      },
      {
        label: "other",
        value: "other",
      },
    ],
  },
  {
    label: "financialProducts",
    items: [
      {
        label: "interestReceived",
        value: "interestReceived",
      },
      {
        label: "exchangeGains",
        value: "exchangeGains",
      },
      {
        label: "receivedDividends",
        value: "receivedDividends",
      },
      {
        label: "investmentProducts",
        value: "investmentProducts",
      },
      {
        label: "obtainedExpectations",
        value: "obtainedExpectations",
      },
      {
        label: "sharesOfParticipationIncome",
        value: "sharesOfParticipationIncome",
      },
      {
        label: "profitFromSalesOfSecurities",
        value: "profitFromSalesOfSecurities",
      },
      {
        label: "loanAndAdvanceProducts",
        value: "loanAndAdvanceProducts",
      },
      {
        label: "obligationsProducts",
        value: "obligationsProducts",
      },
      {
        label: "interestFromCurrentAccounts",
        value: "interestFromCurrentAccounts",
      },
      {
        label: "other",
        value: "other",
      },
    ],
  },
  {
    label: "specialProducts",
    items: [
      {
        label: "gainsOnAssetSales",
        value: "gainsOnAssetSales",
      },
      {
        label: "balanceAdjustmentSubsidies",
        value: "balanceAdjustmentSubsidies",
      },
      {
        label: "provisionsReductions",
        value: "provisionsReductions",
      },
      {
        label: "productsFromPriorExercises",
        value: "productsFromPriorExercises",
      },
      {
        label: "insuranceIndemnities",
        value: "insuranceIndemnities",
      },
      {
        label: "otherSpecialProducts",
        value: "otherSpecialProducts",
      },
      {
        label: "debtWriteOffs",
        value: "debtWriteOffs",
      },
      {
        label: "revaluationProducts",
        value: "revaluationProducts",
      },
      {
        label: "liquidationProducts",
        value: "liquidationProducts",
      },
      {
        label: "gainsOnWriteDowns",
        value: "gainsOnWriteDowns",
      },
      {
        label: "other",
        value: "other",
      },
    ],
  },
];

export const annualExpensesNames = [
  {
    label: "operationCharges",
    items: [
      {
        label: "rawMaterialPurchases",
        value: "rawMaterialPurchases",
      },
      {
        label: "externalServices",
        value: "externalServices",
      },
      {
        label: "taxesAndTaxes",
        value: "taxesAndTaxes",
      },
      {
        label: "salariesAndSocialCosts",
        value: "salariesAndSocialCosts",
      },
      {
        label: "maintenanceAndRepairs",
        value: "maintenanceAndRepairs",
      },
      {
        label: "transportAndMovements",
        value: "transportAndMovements",
      },
      {
        label: "administrativeSupplies",
        value: "administrativeSupplies",
      },
      {
        label: "insurancesServices",
        value: "insurancesServices",
      },
      {
        label: "rentAndRentCosts",
        value: "rentAndRentCosts",
      },
      {
        label: "advertisingAndMarketing",
        value: "advertisingAndMarketing",
      },
      {
        label: "other",
        value: "other",
      },
    ],
  },
  {
    label: "financialCharges",
    items: [
      {
        label: "interestOnLoans",
        value: "interestOnLoans",
      },
      {
        label: "exchangeLosses",
        value: "exchangeLosses",
      },
      {
        label: "bankInterests",
        value: "bankInterests",
      },
      {
        label: "financialAmortization",
        value: "financialAmortization",
      },
      {
        label: "bankFees",
        value: "bankFees",
      },
      {
        label: "commissionsAndFinancialFees",
        value: "commissionsAndFinancialFees",
      },
      {
        label: "discountedExpectations",
        value: "discountedExpectations",
      },
      {
        label: "lossOnSalesOfSecurities",
        value: "lossOnSalesOfSecurities",
      },
      {
        label: "interestOnOverdrafts",
        value: "interestOnOverdrafts",
      },
      {
        label: "financialManagementFees",
        value: "financialManagementFees",
      },
      {
        label: "other",
        value: "other",
      },
    ],
  },
  {
    label: "specialCharges",
    items: [
      {
        label: "penalties",
        value: "penalties",
      },
      {
        label: "finesAndPenalties",
        value: "finesAndPenalties",
      },
      {
        label: "specialDepreciations",
        value: "specialDepreciations",
      },
      {
        label: "donationsAndLiabilities",
        value: "donationsAndLiabilities",
      },
      {
        label: "chargesFromPreviousExercises",
        value: "chargesFromPreviousExercises",
      },
      {
        label: "restructuringExpenses",
        value: "restructuringExpenses",
      },
      {
        label: "exceptionalLossesOnLiabilities",
        value: "exceptionalLossesOnLiabilities",
      },
      {
        label: "unexpectedExpenses",
        value: "unexpectedExpenses",
      },
      {
        label: "lossOnAssetSale",
        value: "lossOnAssetSale",
      },
      {
        label: "abandonmentOfLiabilities",
        value: "abandonmentOfLiabilities",
      },
      {
        label: "other",
        value: "other",
      },
    ],
  },
];

export type List = {
  items: (Budget | undefined)[];
  amount: Amount;
  label: string;
};

export function BudgetCompany() {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/budget",
  });
  const [subTotalIncomes, setSubTotalIncomes] = useState<number[]>([]); // État pour les sous-totaux
  const [subTotalExpenses, setSubTotalExpenses] = useState<number[]>([]); // État pour les sous-totaux

  // This queryKey must be the same as the one used withCustomer HOC
  // // to avoid re-fetching twice
  const queryKey = ["budget", companyId, customerId];

  const { data: budgetData } = useQuery(queryKey, () =>
    gql.client.request(BudgetLogic.queries(), {
      companyID: companyId as string,
      customerID: customerId as string,
    })
  );

  const storedValues = budgetData?.budgetList?.reduce(
    (acc: { [key: string]: { [key: string]: number } }, item) => {
      // Vérifie si le type existe déjà dans l'accumulateur
      if (!acc[item.type]) {
        acc[item.type] = {}; // Initialise un nouvel objet si le type n'existe pas encore
      }

      // Ajoute ou met à jour la clé de nom avec sa valeur correspondante
      acc[item.type][item.name] = item.amount.value;

      return acc; // Retourne l'accumulateur mis à jour
    },
    {} as { [key: string]: { [key: string]: number } }
  );

  const annualIncomesDefaultValues = annualIncomesNames.reduce(
    (acc, current) => {
      // Créer un objet avec toutes les valeurs d'items à 0
      const itemsWithDefaultValues = current.items.reduce((innerAcc, item) => {
        return {
          ...innerAcc,
          [item.label]: 0,
        };
      }, {});

      // Ajouter la valeur 'type' pour la catégorie courante
      return {
        ...acc,
        [current.label]: {
          ...itemsWithDefaultValues,
        },
      };
    },
    {}
  );

  const annualExpensesNamesDefaultValues = annualExpensesNames.reduce(
    (acc, current) => {
      // Créer un objet avec toutes les valeurs d'items à 0
      const itemsWithDefaultValues = current.items.reduce((innerAcc, item) => {
        return {
          ...innerAcc,
          [item.label]: 0,
        };
      }, {});

      // Ajouter la valeur 'type' pour la catégorie courante
      return {
        ...acc,
        [current.label]: {
          ...itemsWithDefaultValues,
        },
      };
    },
    {}
  );
  interface BudgetValues {
    [key: string]: {
      [key: string]: number;
    };
  }

  const { control, getValues, setValue } = useForm<BudgetValues>({
    values: {
      ...annualIncomesDefaultValues,
      ...annualExpensesNamesDefaultValues,
      // Fusion conditionnelle avec `storedValues` en vérifiant qu'il n'est pas `undefined`
      ...Object.keys(storedValues || {}).reduce(
        (acc: BudgetValues, type) => {
          acc[type] = {
            ...acc[type], // Conserve les valeurs par défaut existantes
            ...storedValues?.[type], // Fusionne avec les valeurs de `storedValues` si elles existent
          };
          return acc;
        },
        { ...annualIncomesDefaultValues, ...annualExpensesNamesDefaultValues }
      ),
    },
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: false,
    },
  });

  const { mutate: submitForm, isLoading } = useMutation(
    "budget_creation",
    (input: BudgetCreationInput) => {
      return gql.client.request(BudgetLogic.creation(), {
        customerID: customerId as string,
        companyID: companyId as string,
        input,
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(queryKey);
      },
      async onError(error, variables) {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t("scenes.wealth.creation.error.summary") as string,
          detail: t("scenes.wealth.creation.error.detail", {
            name: variables.name,
          }),
        });
      },
    }
  );

  // const getFilteredList = useMemo(
  //   () => (data: BudgetFormItemList[]) => {
  //     const totalAmount: Amount = {
  //       value: 0,
  //       instrument: "EUR",
  //     };
  //     const budgetList = budgetData?.budgetList;
  //     const list = data
  //       .filter((items) =>
  //         budgetList?.map((budget) => budget.type)?.includes(items.label)
  //       )
  //       ?.map((data) => {
  //         const total: Amount = { value: 0, instrument: "EUR" };
  //         const items = data.items
  //           .filter((item) => {
  //             const found = budgetList?.find((b) => b.name === item.value);
  //             if (found) {
  //               total.value += found.amount.value;
  //             }
  //             return found;
  //           })
  //           .map((item) => {
  //             const found = budgetList?.find((b) => b.name === item.value);

  //             return found;
  //           });
  //         if (total?.value !== undefined && totalAmount?.value) {
  //           totalAmount.value += total.value;
  //         }
  //         return {
  //           ...data,
  //           items,
  //           amount: total,
  //         };
  //       });
  //     return { list, totalAmount };
  //   },
  //   [budgetData?.budgetList]
  // );

  // function calculateTotalAmount(incomes: {
  //   list: List[];
  //   totalAmount: Amount;
  // }) {
  //   incomes.totalAmount.value = incomes.list.reduce(
  //     (total, item) => total + (item.amount.value ?? 0),
  //     0
  //   );
  //   return incomes;
  // }

  function subTotal(
    incomes: BudgetFormItemList[],
    values: Record<string, Record<string, number>>
  ) {
    const res: number[] = [];

    incomes.map((category, index) => {
      res[index] = 0;
      category.items.map((item) => {
        const amount = values[category.label][item.label];
        res[index] += amount;
      });
    });
    return res;
  }

  function getTotal(incomes: BudgetFormItemList[]) {
    const values = getValues();
    let total = 0;

    incomes.map((category) => {
      category.items.map((item) => {
        const amount = values[category.label][item.label];
        total += amount;
      });
    });
    return total;
  }

  function handleFormSubmit() {
    try {
      const values = getValues();

      Object.keys(values).forEach((type) => {
        const names = values[type];

        Object.keys(names).forEach((name) => {
          const amount = names[name];
          submitForm({
            type: type,
            name: name,
            amount: amount,
          });
        });
      });
      toast?.current?.show({
        severity: "success",
        summary: t("scenes.wealth.update.success.summary") as string,
      });
    } catch (error) {
      console.error(error);
      toast?.current?.show({
        severity: "error",
        summary: t("scenes.wealth.update.error.summary") as string,
      });
    }
  }

  // const filteredAnnualIncomes = getFilteredList(annualIncomesNames);
  // const filteredAnnualExpenses = getFilteredList(annualExpensesNames);

  // const summaryIncomesAmount = calculateTotalAmount(filteredAnnualIncomes);
  // const summaryExpensesAmount = calculateTotalAmount(filteredAnnualExpenses);

  return (
    <div className="flex max-w-8xl flex-col gap-y-11">
      <div className="section relative flex flex-col gap-x-10 px-8 py-4 pb-12 md:flex-row">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit();
          }}
          className="flex flex-col w-full items-center border rounded-lg border-stone-100 shadow"
        >
          <div className="flex flex-row w-full border-b bg-stone-100 rounded-t-lg p-3">
            <div className="flex w-1/2">
              <LargeTitle
                title="scenes.budget.annualExpenses"
                className="font-bold text-xl text-blue-800"
              />
            </div>
            <div className="flex w-1/2">
              <LargeTitle
                title="scenes.budget.annualIncome"
                className="font-bold text-xl text-blue-800"
              />
            </div>
          </div>
          <div className="flex flex-row w-full px-3 pt-5">
            <div className="flex flex-col w-1/2 pr-10">
              {annualExpensesNames.map((category, index) => (
                <React.Fragment key={index}>
                  <Text
                    as="h3"
                    label={"forms.fields.budget." + category.label}
                    className={`text-lg font-bold text-blue-800 mb-2 ${
                      index !== 0 ? "mt-10" : ""
                    }`}
                  />
                  {category.items.map((item) => (
                    <Controller
                      key={item.label}
                      name={`${category.label}.${item.label}` as never}
                      control={control}
                      render={({ field }) => (
                        <div className="pb-4">
                          <Label htmlFor={field.name}>
                            {t("forms.fields.budget." + item.label)}
                          </Label>
                          <FieldAmount
                            id={field.name}
                            {...field}
                            defaultValue={
                              getValues()[category.label]?.[item.label] ?? 0
                            }
                            onChange={(e) => {
                              // field.onChange(
                              setValue(`${category.label}.${item.label}`, e);
                              setSubTotalExpenses(
                                subTotal(annualExpensesNames, getValues())
                              );
                              // );
                            }}
                            className="w-1/2"
                          />
                        </div>
                      )}
                    />
                  ))}
                  <div>
                    <Text
                      as="p"
                      label={"forms.fields.budget.subTotal"}
                      className={"font-bold text-blue-800"}
                    />
                    <FieldAmount
                      value={
                        subTotalExpenses[index] ??
                        subTotal(annualExpensesNames, getValues())[index]
                      }
                      className="w-1/2"
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="flex flex-col w-1/2 pr-10">
              {annualIncomesNames.map((category, index) => (
                <React.Fragment key={index}>
                  <Text
                    as="h3"
                    label={"forms.fields.budget." + category.label}
                    className={`text-lg font-bold text-blue-800 mb-2 ${
                      index !== 0 ? "mt-10" : ""
                    }`}
                  />
                  {category.items.map((item) => (
                    <Controller
                      key={item.label}
                      name={`${category.label}.${item.label}` as never}
                      control={control}
                      render={({ field }) => (
                        <div className="pb-4">
                          <Label htmlFor={field.name}>
                            {t("forms.fields.budget." + item.label)}
                          </Label>
                          <FieldAmount
                            id={field.name}
                            {...field}
                            defaultValue={
                              getValues()[category.label]?.[item.label] ?? 0
                            }
                            onChange={(e) => {
                              setValue(`${category.label}.${item.label}`, e);
                              setSubTotalIncomes(
                                subTotal(annualIncomesNames, getValues())
                              );
                            }}
                            className="w-1/2"
                          />
                        </div>
                      )}
                    />
                  ))}
                  <div>
                    <Text
                      as="p"
                      label={"forms.fields.budget.subTotal"}
                      className={"font-bold text-blue-800"}
                    />
                    <FieldAmount
                      value={
                        subTotalIncomes[index] ??
                        subTotal(annualIncomesNames, getValues())[index]
                      }
                      className="w-1/2"
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="flex flex-row w-full px-3 pt-2 pb-8">
            <div className="flex flex-col w-1/2 pr-10 mb-5 mt-10">
              <Text
                as="h3"
                label={"forms.fields.budget.totalExpenses"}
                className={"text-lg font-bold text-blue-800"}
              />
              <FieldAmount
                id="totalExpenses"
                value={getTotal(annualExpensesNames)}
                className="w-1/2"
              />
            </div>
            <div className="flex flex-col w-1/2 pr-10 mb-5 mt-10">
              <Text
                as="h3"
                label={"forms.fields.budget.totalIncome"}
                className={"text-lg font-bold text-blue-800"}
              />
              <FieldAmount
                id="totalIncome"
                value={getTotal(annualIncomesNames)}
                className="w-1/2"
              />
            </div>
          </div>

          <Button
            label={t(`forms.fields.actions.update`)}
            type="submit"
            icon="pi pi-plus"
            className="mx-auto mt-10"
            loading={isLoading}
          />
        </form>
      </div>
    </div>
  );
}
