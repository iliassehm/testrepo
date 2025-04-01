import { useNavigate, useParams } from "@tanstack/react-router";
import { InputNumber } from "primereact/inputnumber";
import { type FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  QueryObserverRefetchErrorResult,
  QueryObserverSuccessResult,
  useQueryClient,
} from "react-query";
import { z } from "zod";

import { arbitrageCifSchema } from "../../../../../../../shared/schemas/project";
import { Button, Text } from "../../../../../../components";
import { Label } from "../../../../../../components/Label";
import { SupportCreationDialog } from "../../../../../../components/SupportSelection/SupportCreationDialog";
import SupportSelectionDialog from "../../../../../../components/SupportSelection/SupportSelectionDialog";
import { Widget } from "../../../../../../components/Widget";
import { formatCurrency, numberFormat } from "../../../../../../helpers";
import { calculateFees } from "../../../../../../helpers/calculateFees";
import {
  AssetGroup,
  CustomerWalletQuery,
  ProjectType,
} from "../../../../../../types";
import {
  InvestmentInstrumentTable,
  InvestmentInstrumentTableRow,
} from "../../wealth/AssetCreation/LongTermAsset/components/data-table";
import { companyCustomersProjectRoute } from "../route";
import { useProjectCreation } from "../useProjectCreation";
import { useProjectUpdate } from "../useProjectUpdate";
import { EvolutionFeesWidget } from "../widgets/EvolutionWidget";
import { SimpleCifFeesWidget } from "../widgets/SimpleCifFeesWidget";
import {
  DeinvestmentInstrumentTable,
  DeinvestmentInstrumentTableRow,
} from "./DeinvestmentTable";

type ArbitrageCifFormValues = z.infer<typeof arbitrageCifSchema>;

type ArbitrageFormProps = {
  contractID: string;
  name?: string;
  initialData?: ArbitrageCifFormValues;
  instrumentQuery:
    | QueryObserverRefetchErrorResult<CustomerWalletQuery, unknown>
    | QueryObserverSuccessResult<CustomerWalletQuery, unknown>;
  sriTolerate?: number;
};

export const ArbitrageCifForm: FC<ArbitrageFormProps> = ({
  contractID,
  name,
  initialData,
  instrumentQuery,
  sriTolerate,
}) => {
  const { t } = useTranslation();
  const form = useForm<ArbitrageCifFormValues>({
    defaultValues: {
      amount: initialData?.amount ?? 0,
      fees: {
        services: {
          opening: {
            amount: initialData?.fees?.services?.opening?.amount ?? 0,
            percentage: initialData?.fees?.services?.opening?.percentage ?? 0,
          },
          arbitration: {
            amount: initialData?.fees?.services?.arbitration?.amount ?? 0,
            percentage:
              initialData?.fees?.services?.arbitration?.percentage ?? 0,
          },
          transfer: {
            amount: initialData?.fees?.services?.transfer?.amount ?? 0,
            percentage: initialData?.fees?.services?.transfer?.percentage ?? 0,
          },
          closing: {
            amount: initialData?.fees?.services?.closing?.amount ?? 0,
            percentage: initialData?.fees?.services?.closing?.percentage ?? 0,
          },
          advice: {
            amount: initialData?.fees?.services?.advice?.amount ?? 0,
            percentage: initialData?.fees?.services?.advice?.percentage ?? 0,
          },
          followingAdvice: {
            amount: initialData?.fees?.services?.followingAdvice?.amount ?? 0,
            percentage:
              initialData?.fees?.services?.followingAdvice?.percentage ?? 0,
          },
          brokerage: {
            amount: initialData?.fees?.services?.brokerage?.amount ?? 0,
            percentage: initialData?.fees?.services?.brokerage?.percentage ?? 0,
          },
          exchange: {
            amount: initialData?.fees?.services?.exchange?.amount ?? 0,
            percentage: initialData?.fees?.services?.exchange?.percentage ?? 0,
          },
          custodialRight: {
            amount: initialData?.fees?.services?.custodialRight?.amount ?? 0,
            percentage:
              initialData?.fees?.services?.custodialRight?.percentage ?? 0,
          },
          accountManagement: {
            amount: initialData?.fees?.services?.accountManagement?.amount ?? 0,
            percentage:
              initialData?.fees?.services?.accountManagement?.percentage ?? 0,
          },
          inactivity: {
            amount: initialData?.fees?.services?.inactivity?.amount ?? 0,
            percentage:
              initialData?.fees?.services?.inactivity?.percentage ?? 0,
          },
          managementAssignments: {
            amount:
              initialData?.fees?.services?.managementAssignments?.amount ?? 0,
            percentage:
              initialData?.fees?.services?.managementAssignments?.percentage ??
              0,
          },
        },
        tiers: {
          opening: {
            amount: initialData?.fees?.tiers?.opening?.amount ?? 0,
            percentage: initialData?.fees?.tiers?.opening?.percentage ?? 0,
          },
          arbitration: {
            amount: initialData?.fees?.tiers?.arbitration?.amount ?? 0,
            percentage: initialData?.fees?.tiers?.arbitration?.percentage ?? 0,
          },
          transfer: {
            amount: initialData?.fees?.tiers?.transfer?.amount ?? 0,
            percentage: initialData?.fees?.tiers?.transfer?.percentage ?? 0,
          },
          custodialRight: {
            amount: initialData?.fees?.tiers?.custodialRight?.amount ?? 0,
            percentage:
              initialData?.fees?.tiers?.custodialRight?.percentage ?? 0,
          },
          accountManagement: {
            amount: initialData?.fees?.tiers?.accountManagement?.amount ?? 0,
            percentage:
              initialData?.fees?.tiers?.accountManagement?.percentage ?? 0,
          },
          managementAssignments: {
            amount:
              initialData?.fees?.tiers?.managementAssignments?.amount ?? 0,
            percentage:
              initialData?.fees?.tiers?.managementAssignments?.percentage ?? 0,
          },
        },
        products: {
          enterRight: {
            amount: initialData?.fees?.products?.enterRight?.amount ?? 0,
            percentage:
              initialData?.fees?.products?.enterRight?.percentage ?? 0,
          },
          surperformance: {
            amount: initialData?.fees?.products?.surperformance?.amount ?? 0,
            percentage:
              initialData?.fees?.products?.surperformance?.percentage ?? 0,
          },
        },
        customFees: initialData?.fees?.customFees ?? [],

        enterFeesAmount: initialData?.fees?.enterFeesAmount ?? 0,
        variableFeesAmount: initialData?.fees?.variableFeesAmount ?? 0,
        enterPercent: initialData?.fees?.enterPercent ?? 0,
        variablePercent: initialData?.fees?.variablePercent ?? 0,

        totalValue: initialData?.fees?.totalValue ?? 0,
        totalPercentage: initialData?.fees?.totalPercentage ?? 0,
      },
      investments: initialData?.investments ?? [],
      divestments: initialData?.divestments ?? [],
      annotation: initialData?.annotation ?? "",
      assetID: initialData?.assetID ?? "",
      sri: initialData?.sri,
      evolution: [
        {
          evolutionAmount: initialData?.evolution?.[0]?.evolutionAmount ?? 0,
          evolutionPercentage:
            initialData?.evolution?.[0]?.evolutionPercentage ?? 0,
        },
        {
          evolutionAmount: initialData?.evolution?.[1]?.evolutionAmount ?? 0,
          evolutionPercentage:
            initialData?.evolution?.[1]?.evolutionPercentage ?? 0,
        },
        {
          evolutionAmount: initialData?.evolution?.[2]?.evolutionAmount ?? 0,
          evolutionPercentage:
            initialData?.evolution?.[2]?.evolutionPercentage ?? 0,
        },
        {
          evolutionAmount: initialData?.evolution?.[3]?.evolutionAmount ?? 0,
          evolutionPercentage:
            initialData?.evolution?.[3]?.evolutionPercentage ?? 0,
        },
        {
          evolutionAmount: initialData?.evolution?.[4]?.evolutionAmount ?? 0,
          evolutionPercentage:
            initialData?.evolution?.[4]?.evolutionPercentage ?? 0,
        },
      ],
    },
  });

  const [showDialog, setShowDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const queryClient = useQueryClient();
  const params = useParams({
    from: companyCustomersProjectRoute.fullPath,
  }) as Record<string, string>;

  const navigate = useNavigate();

  const [deinvestmentRows, setDeinvestmentRows] = useState<
    DeinvestmentInstrumentTableRow[]
  >([]);

  const [selectedInstruments, setSelectedInstruments] = useState<
    InvestmentInstrumentTableRow[]
  >(
    Array.from(
      new Map(
        [
          ...(instrumentQuery?.data?.customerWallet?.investments
            ? (instrumentQuery?.data?.customerWallet?.investments ?? []).map(
                (el) => ({
                  code: el.code ?? "",
                  label: el.label ?? "",
                  percent: 0,
                  valuation: {
                    value: el.unitValue,
                    instrument: el.valuation.instrument,
                  },
                  quantity: 0,
                  amount: 0,
                  buyingPrice: el.valuation?.value,
                  riskIndicator: el.riskIndicator ?? 7,
                })
              )
            : []),
          ...(initialData?.investments.map((el) => ({
            ...el,
            code: el.code ?? "",
            label: el.label ?? "",
            percent: el.percent ?? 0,
            quantity: el.quantity ?? 0,
            amount: el.amount ?? 0,
            buyingPrice: el.valuation?.value ?? 0,
            riskIndicator: el.riskIndicator ?? 7,
            valuation: {
              value: el.valuation?.value ?? 0,
              instrument: el.valuation?.instrument,
            },
          })) || []),
        ].map((item) => [item.code, item])
      ).values()
    )
  );

  const investedAmount = selectedInstruments.reduce(
    (acc, cur) => acc + (cur.amount ?? 0),
    0
  );

  const deinvestedAmount = deinvestmentRows.reduce(
    (acc, cur) => acc + (cur.divestmentAmount ?? 0),
    0
  );

  const transferAmount = form.watch("amount") + deinvestedAmount;
  const transferAmountWithoutLiquidity = form.watch("amount");
  const fees = form.watch("fees");

  const { amount, openFees } = calculateFees(
    transferAmount,
    fees,
    "arbitrageCif"
  );

  const projectCreationMutation = useProjectCreation("ArbitrageCif", {
    onSuccess: () => {
      queryClient.invalidateQueries(["projectList"]);
      navigate({
        to: "/company/$companyId/customer/$customerId/projects",
        params: {
          companyId: params.companyId as string,
          customerId: params.customerId as string,
        },
        search: {
          type: ProjectType.ArbitrageCif,
        },
      } as any);
    },
  });

  const projectUpdateMutation = useProjectUpdate("ArbitrageCif", {
    onSuccess: (res) => {
      queryClient.invalidateQueries(["projectList"]);
      queryClient.invalidateQueries(["project", res.projectUpdate?.id]);
      navigate({
        to: "/company/$companyId/customer/$customerId/projects",
        params: {
          companyId: params.companyId as string,
          customerId: params.customerId as string,
        },
        search: {
          type: ProjectType.ArbitrageCif,
        },
      } as any);
    },
  });

  const onSubmit = (data: ArbitrageCifFormValues) => {
    if (initialData && params.projectID) {
      projectUpdateMutation.mutate({
        id: params.projectID,
        metadata: {
          ...data,
          amount: data.amount ?? 0,
          assetID: contractID,
          originalInvestments:
            instrumentQuery.data?.customerWallet?.investments?.map((el) => ({
              ...el,
              label: el.label ?? "",
              quantity: el.quantity ?? 0,
            })) ?? [],
          divestments: deinvestmentRows.map((el) => ({
            id: el.id ?? "",
            label: el.label ?? "",
            code: el.code ?? "",
            divestmentPercent: el.divestmentPercent ?? 0,
          })),
          investments: selectedInstruments,
        },
      });
    } else {
      projectCreationMutation.mutate({
        name: name ?? "", // TODO: FIX
        companyID: params.companyId as string,
        customerID: params.customerId as string,
        metadata: {
          ...data,
          amount: data.amount ?? 0,
          assetID: contractID,
          originalInvestments:
            instrumentQuery.data?.customerWallet?.investments?.map((el) => ({
              ...el,
              label: el.label ?? "",
              quantity: el.quantity ?? 0,
            })) ?? [],
          divestments: deinvestmentRows.map((el) => ({
            id: el.id ?? "",
            label: el.label ?? "",
            code: el.code ?? "",
            divestmentPercent: el.divestmentPercent ?? 0,
          })),
          investments: selectedInstruments,
        },
      });
    }
  };

  const sriBefore = instrumentQuery.data?.customerWallet?.sri;

  function averageSRICalcul() {
    let totalValue = 0;
    instrumentQuery.data?.customerWallet?.investments?.map((el, index) => {
      totalValue +=
        el.valuation.value *
        (1 -
          (deinvestmentRows[index]?.divestmentPercent
            ? deinvestmentRows[index].divestmentPercent
            : 0) /
            100);
    });
    selectedInstruments.map((el) => {
      totalValue += el.amount;
    });
    totalValue +=
      deinvestedAmount +
      transferAmountWithoutLiquidity -
      investedAmount -
      openFees;

    let totalSRI = 0;

    if (totalValue !== 0) {
      instrumentQuery.data?.customerWallet?.investments?.map((el, index) => {
        const perc =
          ((el.valuation.value *
            (deinvestmentRows[index]
              ? 1 -
                (deinvestmentRows[index]?.divestmentPercent
                  ? deinvestmentRows[index].divestmentPercent
                  : 0) /
                  100
              : 1)) /
            totalValue) *
          100;
        if (deinvestmentRows)
          totalSRI +=
            perc *
            (el.riskIndicator
              ? el.riskIndicator
              : el.code === "XXliquidity"
                ? 1
                : 7);
      });
      selectedInstruments.map((el) => {
        const perc = (el.amount / totalValue) * 100;
        totalSRI +=
          perc *
          (el.riskIndicator
            ? el.riskIndicator
            : el.code === "XXliquidity"
              ? 1
              : 7);
      });

      totalSRI +=
        ((deinvestedAmount +
          transferAmountWithoutLiquidity -
          investedAmount -
          openFees) /
          totalValue) *
        100;
    }
    if (totalSRI !== 0) {
      totalSRI = Math.round(totalSRI * 100) / 100;
      totalSRI /= 100;
      const totalSRIRounded = Math.round(totalSRI);
      if (totalSRIRounded < totalSRI)
        return form.setValue("sri", totalSRIRounded + 1);
      return form.setValue("sri", totalSRIRounded);
    }
    return form.setValue("sri", null);
  }

  useEffect(() => {
    if (instrumentQuery.data?.customerWallet) {
      setDeinvestmentRows(
        (instrumentQuery.data.customerWallet.investments?.map((el) => {
          const existing =
            initialData?.divestments?.find((e) => e.id === el.id) ||
            initialData?.divestments?.find((e) => e.code === el.code);
          const percent = existing?.divestmentPercent ?? 0;

          return {
            ...el,
            divestmentQuantity: (el.quantity ?? 0) * (percent / 100),
            divestmentAmount: el.valuation.value * (percent / 100),
            divestmentPercent: percent,
          };
        }) as DeinvestmentInstrumentTableRow[]) ?? []
      );
    }
  }, [instrumentQuery.data?.customerWallet]);

  useEffect(() => {
    averageSRICalcul();
  }, [deinvestmentRows, selectedInstruments]);

  const formValues = form.watch();

  const evolutionValues = form.watch("evolution");
  function UpdateEvolutionValues() {
    Array.from({ length: 5 }, (_, year) => {
      form.setValue(
        `evolution.${year}.evolutionPercentage`,
        Math.round(
          (formValues.fees.variablePercent +
            formValues.fees.enterPercent / (year + 1)) *
            100
        ) / 100
      );

      form.setValue(
        `evolution.${year}.evolutionAmount`,
        Math.round(
          transferAmount *
            (evolutionValues[year].evolutionPercentage / 100) *
            100
        ) / 100
      );
    });
  }
  const enterFeesValue = [
    "opening",
    "arbitration",
    "transfer",
    "closing",
    "advice",
    "brokerage",
    "exchange",
    "enterRight",
  ];

  const variableFeesValue = [
    "following_advice",
    "custodial_right",
    "account_management",
    "inactivity",
    "management_assignments",
    "surperformance",
  ];

  const arbitrationFeesDependsOnDesinvest = ["arbitration"];
  const arbitrationFeesDependsOnTransfersAmountWithoutDesinvest = [
    "opening",
    "brokerage",
  ];

  function GetFixedFeesWithoutEnterRight() {
    let fixedFees = 0;
    Object.keys(formValues.fees.services).forEach((service) => {
      if (service !== "enterRight" && enterFeesValue.includes(service))
        fixedFees +=
          formValues.fees.services[
            service as keyof typeof formValues.fees.services
          ]?.amount ?? 0;
    });
    Object.keys(formValues.fees.customFees).forEach((index) => {
      const idx = Number(index);
      if (formValues.fees.customFees[idx]?.feesType === "enter")
        fixedFees += formValues.fees.customFees[idx]?.amount ?? 0;
    });
    Object.keys(formValues.fees.products).forEach((product) => {
      if (product !== "enterRight" && enterFeesValue.includes(product))
        fixedFees +=
          formValues.fees.products[
            product as keyof typeof formValues.fees.products
          ]?.amount ?? 0;
    });
    return fixedFees;
  }

  function UpdateValues() {
    Object.keys(formValues.fees.services).forEach((service) => {
      form.setValue(
        `fees.services.${service as keyof typeof formValues.fees.services}.amount`,
        Math.round(
          (arbitrationFeesDependsOnDesinvest.includes(service)
            ? deinvestedAmount
            : arbitrationFeesDependsOnTransfersAmountWithoutDesinvest.includes(
                  service
                )
              ? transferAmountWithoutLiquidity
              : transferAmount) *
            ((formValues.fees.services[
              service as keyof typeof formValues.fees.services
            ]?.percentage ?? 0) /
              100) *
            100
        ) / 100
      );
    });

    Object.keys(formValues.fees.customFees).forEach((index) => {
      const idx = Number(index);
      form.setValue(
        `fees.customFees.${idx}.amount`,
        Math.round(
          (formValues.fees.customFees[idx]?.arbitrationValueType === "desinvest"
            ? deinvestedAmount
            : formValues.fees.customFees[idx]?.arbitrationValueType === "both"
              ? transferAmount
              : transferAmountWithoutLiquidity) *
            ((formValues.fees.customFees[idx]?.percentage ?? 0) / 100) *
            100
        ) / 100
      );
    });

    Object.keys(formValues.fees.tiers).forEach((tier) => {
      form.setValue(
        `fees.tiers.${tier as keyof typeof formValues.fees.tiers}.amount`,
        Math.round(
          (arbitrationFeesDependsOnDesinvest.includes(tier)
            ? deinvestedAmount
            : arbitrationFeesDependsOnTransfersAmountWithoutDesinvest.includes(
                  tier
                )
              ? transferAmountWithoutLiquidity
              : transferAmount) *
            ((formValues.fees.tiers[tier as keyof typeof formValues.fees.tiers]
              ?.percentage ?? 0) /
              100) *
            100
        ) / 100
      );
    });
    Object.keys(formValues.fees.products).forEach((product) => {
      form.setValue(
        `fees.products.${product as keyof typeof formValues.fees.products}.amount`,
        Math.round(
          (product === "enterRight"
            ? (transferAmount ?? formValues.amount) -
              GetFixedFeesWithoutEnterRight()
            : arbitrationFeesDependsOnDesinvest.includes(product)
              ? deinvestedAmount
              : arbitrationFeesDependsOnTransfersAmountWithoutDesinvest.includes(
                    product
                  )
                ? transferAmountWithoutLiquidity
                : transferAmount) *
            ((formValues.fees.products[
              product as keyof typeof formValues.fees.products
            ]?.percentage ?? 0) /
              100) *
            100
        ) / 100
      );
    });
  }

  function UpdateTotalValues() {
    let enterAmount = 0;
    let variableAmount = 0;

    let enterPercent = 0;
    let variablePercent = 0;

    let percent = 0;
    let amount = 0;

    Object.keys(formValues.fees.services).forEach((service) => {
      percent +=
        formValues.fees.services[
          service as keyof typeof formValues.fees.services
        ]?.percentage ?? 0;
      amount +=
        formValues.fees.services[
          service as keyof typeof formValues.fees.services
        ]?.amount ?? 0;

      if (enterFeesValue.includes(service)) {
        enterAmount +=
          formValues.fees.services[
            service as keyof typeof formValues.fees.services
          ]?.amount ?? 0;
        enterPercent +=
          formValues.fees.services[
            service as keyof typeof formValues.fees.services
          ]?.percentage ?? 0;
      }

      if (variableFeesValue.includes(service)) {
        variableAmount +=
          formValues.fees.services[
            service as keyof typeof formValues.fees.services
          ]?.amount ?? 0;
        variablePercent +=
          formValues.fees.services[
            service as keyof typeof formValues.fees.services
          ]?.percentage ?? 0;
      }
    });

    Object.keys(formValues.fees.customFees).forEach((key) => {
      const index = Number(key);
      percent += formValues.fees.customFees[index]?.percentage ?? 0;
      amount += formValues.fees.customFees[index]?.amount ?? 0;

      if (formValues.fees.customFees[index]?.feesType === "enter") {
        enterAmount += formValues.fees.customFees[index]?.amount ?? 0;
        enterPercent += formValues.fees.customFees[index]?.percentage ?? 0;
      } else {
        variableAmount += formValues.fees.customFees[index]?.amount ?? 0;
        variablePercent += formValues.fees.customFees[index]?.percentage ?? 0;
      }
    });

    Object.keys(formValues.fees.products).forEach((product) => {
      percent +=
        formValues.fees.products[
          product as keyof typeof formValues.fees.products
        ]?.percentage ?? 0;
      amount +=
        formValues.fees.products[
          product as keyof typeof formValues.fees.products
        ]?.amount ?? 0;

      if (enterFeesValue.includes(product)) {
        enterAmount +=
          formValues.fees.products[
            product as keyof typeof formValues.fees.products
          ]?.amount ?? 0;
        enterPercent +=
          formValues.fees.products[
            product as keyof typeof formValues.fees.products
          ]?.percentage ?? 0;
      }

      if (variableFeesValue.includes(product)) {
        variableAmount +=
          formValues.fees.products[
            product as keyof typeof formValues.fees.products
          ]?.amount ?? 0;
        variablePercent +=
          formValues.fees.products[
            product as keyof typeof formValues.fees.products
          ]?.percentage ?? 0;
      }
    });

    enterAmount = Math.round(enterAmount * 100) / 100;
    variableAmount = Math.round(variableAmount * 100) / 100;
    form.setValue("fees.enterFeesAmount", enterAmount);
    form.setValue("fees.variableFeesAmount", variableAmount);

    enterPercent = Math.round((enterAmount / transferAmount) * 10000) / 100;
    variablePercent =
      Math.round((variableAmount / transferAmount) * 10000) / 100;
    form.setValue("fees.enterPercent", enterPercent);
    form.setValue("fees.variablePercent", variablePercent);

    percent = Math.round((enterPercent + variablePercent) * 100) / 100;
    amount = Math.round(amount * 100) / 100;
    form.setValue("fees.totalValue", amount);
    form.setValue("fees.totalPercentage", percent);
  }

  useEffect(() => {
    UpdateValues();
    UpdateTotalValues();
    UpdateEvolutionValues();
  }, [transferAmountWithoutLiquidity, deinvestedAmount]);

  return (
    <>
      <form
        className="flex flex-col gap-4 p-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="font-normal text-2xl mb-2">
          {t("scenes.customers.projects.addProject.projectName")} :{" "}
          <span className="font-bold text-blue-800">{name}</span>
        </h1>

        <Widget className="mt-4 p-2 py-4">
          <>
            <div className="w-full flex justify-between mb-6">
              <h1 className="text-[#4761C8] font-bold text-xl ">
                {t("scenes.customers.projects.deinvestment")}
              </h1>
              <div className="flex gap-8">
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {t("scenes.customers.projects.contractNumber")}
                    {" :"}
                  </p>
                  <p className="text-blue-800 font-bold">
                    {instrumentQuery.data?.customerWallet?.accountNumber ??
                      "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {t("scenes.customers.projects.amount")} :
                  </p>
                  <p className="text-blue-800 font-bold">
                    {formatCurrency(
                      instrumentQuery.data?.customerWallet?.valuation
                    )}
                  </p>
                </div>
              </div>
            </div>

            <DeinvestmentInstrumentTable
              data={deinvestmentRows}
              setData={setDeinvestmentRows}
              transfersAmount={1000}
              onSubmit={() => null}
              footer={() => (
                <div className="flex justify-end">
                  <div>
                    <div className="flex flex-col p-2 text-right text-blue-800">
                      <Text label="scenes.customers.projects.deinvestment" />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col p-2 text-right text-blue-800">
                      <Text label={numberFormat(deinvestedAmount)} />
                    </div>
                  </div>
                </div>
              )}
            />
          </>
        </Widget>

        <Widget className="mt-4 p-2 py-4">
          <>
            <SupportSelectionDialog
              hide={() => setShowDialog(false)}
              open={showDialog}
              type={AssetGroup.LifeInsuranceCapitalization}
              initialData={selectedInstruments}
              onSubmit={(data) =>
                setSelectedInstruments(
                  (data as InvestmentInstrumentTableRow[]).map((d) => ({
                    ...d,
                    percent: d.percent ?? 0,
                    quantity: d.quantity ?? 0,
                    amount: d.amount ?? 0,
                    buyingPrice: d.buyingPrice ?? d.valuation?.value ?? 0,
                  }))
                )
              }
            />

            <div className="w-full flex justify-between mb-4">
              <h1 className="text-[#4761C8] font-bold text-xl ">
                {t("scenes.customers.projects.reinvestment")}
              </h1>
            </div>
            <div className="flex flex-row gap-10">
              <div className="flex flex-row items-center gap-4 mb-6">
                <Label
                  label={t(
                    "scenes.customers.projects.addProject.complementary.additionalPayment"
                  )}
                />
                <div className="flex flex-row gap-1 items-center">
                  <Controller
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <InputNumber
                        className="border bg-slate-50 h-7 w-48"
                        inputClassName="text-right bg-gray-100/50  text-sm"
                        type="currency"
                        currency={"EUR"}
                        locale="fr-FR"
                        placeholder="0,00"
                        inputMode="decimal"
                        inputRef={field.ref}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.value);
                        }}
                      />
                    )}
                  />
                  <span className="font-bold text-[#4761C8]">€</span>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h1 className="text-[#4761C8] font-bold text-xl mb-4">
                {t("scenes.customers.projects.addProject.cif.fees.feesLabel")}
              </h1>
              <SimpleCifFeesWidget
                form={form}
                transfersAmount={transferAmount}
                desinvestAmount={deinvestedAmount}
                transfersAmountWithoutDesinvest={transferAmountWithoutLiquidity}
                arbitrage={true}
              />
            </div>

            <EvolutionFeesWidget form={form} />

            <div className="w-full flex justify-end mb-4 mt-6">
              <Button
                type="button"
                label="scenes.customers.projects.chooseSupports"
                className="text-sm"
                onClick={() => setShowDialog(true)}
              />
            </div>
            <div className="flex flex-row justify-center gap-10 mb-4">
              <div className={"flex flex-row justify-center gap-10"}>
                <div
                  className={"flex flex-row item-center justify-center gap-2"}
                >
                  <label>
                    {t(
                      "scenes.customers.projects.addProject.arbitrage.risk.before"
                    )}
                    {" :"}
                  </label>
                  <label className="text-blue-800 font-bold">
                    {sriBefore ?? "-"}
                  </label>
                </div>

                <div className={"flex flex-row justify-center gap-2"}>
                  <label>
                    {t(
                      "scenes.customers.projects.addProject.arbitrage.risk.after"
                    )}
                    {" :"}
                  </label>
                  <label className="text-blue-800 font-bold">
                    {form.getValues().sri ?? "-"}
                  </label>
                </div>
                <div className={"flex flex-row justify-center gap-2"}>
                  <label>
                    {t(
                      "scenes.customers.projects.addProject.arbitrage.risk.tolerate"
                    )}
                    {" :"}
                  </label>
                  <label className="text-blue-800 font-bold">
                    {sriTolerate}
                  </label>
                </div>
              </div>
            </div>

            <InvestmentInstrumentTable
              data={selectedInstruments}
              setData={setSelectedInstruments}
              withoutBuyPrice
              transfersAmount={
                deinvestedAmount + transferAmountWithoutLiquidity - openFees
              }
              setTransfersAmount={(value) => form.setValue("amount", value)}
              addRow={() => (
                <div className="flex justify-center mb-2">
                  <button
                    type="button"
                    className="text-xs opacity-50 py-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCreateDialog(true);
                    }}
                  >
                    {t("scenes.customers.projects.addSupport")}
                  </button>
                </div>
              )}
              footer={() => (
                <div className="flex justify-end">
                  <div>
                    <div className="flex flex-col p-2 text-right text-blue-800">
                      <Text label="scenes.customers.projects.transfer" />
                      <Text label="scenes.customers.projects.fee" />
                      <Text label="scenes.customers.projects.remainingAmount" />
                      <Text label="scenes.customers.projects.netInvestment" />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col p-2 text-right text-blue-800">
                      <Text label={numberFormat(amount)} />
                      <Text label={numberFormat(openFees)} />
                      <Text
                        label={numberFormat(
                          deinvestedAmount +
                            transferAmountWithoutLiquidity -
                            investedAmount -
                            openFees
                        )}
                      />
                      <Text label={numberFormat(investedAmount)} />
                    </div>
                  </div>
                </div>
              )}
            />

            <div className="flex justify-end mt-2">
              <Button
                label="scenes.customers.projects.submit"
                type="submit"
                isLoading={
                  projectCreationMutation.isLoading ||
                  projectUpdateMutation.isLoading
                }
              />
            </div>
          </>
        </Widget>
      </form>

      {showCreateDialog && (
        <SupportCreationDialog
          hide={() => setShowCreateDialog(false)}
          onSubmit={(data) =>
            setSelectedInstruments((val) => [
              ...val,
              {
                ...data,
                percent: 0,
                quantity: 0,
                amount: 0,
                buyingPrice: 0,
                riskIndicator: data.riskIndicator ?? 7,
              },
            ])
          }
        />
      )}
    </>
  );
};
