import { useNavigate, useParams } from "@tanstack/react-router";
import { InputNumber } from "primereact/inputnumber";
import { type FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  QueryObserverRefetchErrorResult,
  QueryObserverSuccessResult,
  useQuery,
  useQueryClient,
} from "react-query";
import { z } from "zod";

import { arbitrageInsuranceSchema } from "../../../../../../../shared/schemas/project";
import { Button, Text } from "../../../../../../components";
import { Label } from "../../../../../../components/Label";
import { SupportCreationDialog } from "../../../../../../components/SupportSelection/SupportCreationDialog";
import SupportSelectionDialog from "../../../../../../components/SupportSelection/SupportSelectionDialog";
import { Widget } from "../../../../../../components/Widget";
import { formatCurrency, numberFormat } from "../../../../../../helpers";
import { calculateFees } from "../../../../../../helpers/calculateFees";
import { gql } from "../../../../../../service/client";
import {
  AssetGroup,
  CustomerWalletQuery,
  ProjectType,
} from "../../../../../../types";
import {
  InvestmentInstrumentTable,
  InvestmentInstrumentTableRow,
} from "../../wealth/AssetCreation/LongTermAsset/components/data-table";
import { WealthLogic } from "../../wealth/wealth.logic";
import { companyCustomersProjectRoute } from "../route";
import { useProjectCreation } from "../useProjectCreation";
import { useProjectUpdate } from "../useProjectUpdate";
import { CustomFeesWidget } from "../widgets/CustomFeesWidget";
import {
  DeinvestmentInstrumentTable,
  DeinvestmentInstrumentTableRow,
} from "./DeinvestmentTable";

type ArbitrageFormValues = z.infer<typeof arbitrageInsuranceSchema>;

type ArbitrageFormProps = {
  contractID: string;
  name?: string;
  initialData?: ArbitrageFormValues;
  instrumentQuery:
    | QueryObserverRefetchErrorResult<CustomerWalletQuery, unknown>
    | QueryObserverSuccessResult<CustomerWalletQuery, unknown>;
  sriTolerate?: number;
};

export const ArbitrageInsuranceForm: FC<ArbitrageFormProps> = ({
  contractID,
  name,
  initialData,
  instrumentQuery,
  sriTolerate,
}) => {
  const { t } = useTranslation();
  const form = useForm<ArbitrageFormValues>({
    defaultValues: {
      amount: initialData?.amount ?? 0,
      fees: {
        fixedExpenses: {
          totalPercentage:
            initialData?.fees?.fixedExpenses?.totalPercentage ?? 0,
          totalAmount: initialData?.fees?.fixedExpenses?.totalAmount ?? 0,
          contractPercentage:
            initialData?.fees?.fixedExpenses?.contractPercentage ?? 0,
          contractAmount: initialData?.fees?.fixedExpenses?.contractAmount ?? 0,
          companyPercentage:
            initialData?.fees?.fixedExpenses?.companyPercentage ?? 0,
          companyAmount: initialData?.fees?.fixedExpenses?.companyAmount ?? 0,
        },
        variableExpenses: {
          totalPercentage:
            initialData?.fees?.variableExpenses?.totalPercentage ?? 0,
          totalAmount: initialData?.fees?.variableExpenses?.totalAmount ?? 0,
          contractPercentage:
            initialData?.fees?.variableExpenses?.contractPercentage ?? 0,
          contractAmount:
            initialData?.fees?.variableExpenses?.contractAmount ?? 0,
          companyPercentage:
            initialData?.fees?.variableExpenses?.companyPercentage ?? 0,
          companyAmount:
            initialData?.fees?.variableExpenses?.companyAmount ?? 0,
        },
        advice: {
          totalPercentage: initialData?.fees?.advice?.totalPercentage ?? 0,
          totalAmount: initialData?.fees?.advice?.totalAmount ?? 0,
          contractPercentage:
            initialData?.fees?.advice?.contractPercentage ?? 0,
          contractAmount: initialData?.fees?.advice?.contractAmount ?? 0,
          companyPercentage: initialData?.fees?.advice?.companyPercentage ?? 0,
          companyAmount: initialData?.fees?.advice?.companyAmount ?? 0,
        },
        arbitration: {
          totalPercentage: initialData?.fees?.arbitration?.totalPercentage ?? 0,
          totalAmount: initialData?.fees?.arbitration?.totalAmount ?? 0,
          contractPercentage:
            initialData?.fees?.arbitration?.contractPercentage ?? 0,
          contractAmount: initialData?.fees?.arbitration?.contractAmount ?? 0,
          companyPercentage:
            initialData?.fees?.arbitration?.companyPercentage ?? 0,
          companyAmount: initialData?.fees?.arbitration?.companyAmount ?? 0,
        },
      },
      customFees: initialData?.customFees ?? [],
      investments: initialData?.investments ?? [],
      divestments: initialData?.divestments ?? [],
      annotation: initialData?.annotation ?? "",
      assetID: initialData?.assetID ?? "",
      sri: initialData?.sri,
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
  const customFees = form.watch("customFees");

  const { amount, totalFees } = calculateFees(
    transferAmount,
    fees,
    "arbitrage",
    customFees as any
  );

  const projectCreationMutation = useProjectCreation("ArbitrageLifeInsurance", {
    onSuccess: () => {
      queryClient.invalidateQueries(["projectList"]);
      navigate({
        to: "/company/$companyId/customer/$customerId/projects",
        params: {
          companyId: params.companyId as string,
          customerId: params.customerId as string,
        },
        search: {
          type: ProjectType.ArbitrageLifeInsurance,
        },
      } as any);
    },
  });

  const projectUpdateMutation = useProjectUpdate("ArbitrageLifeInsurance", {
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
          type: ProjectType.ArbitrageLifeInsurance,
        },
      } as any);
    },
  });

  const onSubmit = (data: ArbitrageFormValues) => {
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
      totalFees;

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
          totalFees) /
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

  const formFeesValues = form.watch("fees");
  useEffect(() => {
    Object.keys(formFeesValues).forEach((feeKey) => {
      const totalPercentage =
        form.getValues(
          `fees.${feeKey as keyof typeof formFeesValues}.totalPercentage`
        ) ?? 0;
      const contractPercentage =
        form.getValues(
          `fees.${feeKey as keyof typeof formFeesValues}.contractPercentage`
        ) ?? 0;
      const companyPercentage =
        form.getValues(
          `fees.${feeKey as keyof typeof formFeesValues}.companyPercentage`
        ) ?? 0;

      const totalAmount = ((amount ?? 0) * totalPercentage) / 100;
      const roundedTotalAmount = Math.round(totalAmount * 100) / 100;
      form.setValue(
        `fees.${feeKey as keyof typeof formFeesValues}.totalAmount`,
        roundedTotalAmount
      );

      const contractAmount = (roundedTotalAmount * contractPercentage) / 100;
      const roundedContractAmount = Math.round(contractAmount * 100) / 100;
      form.setValue(
        `fees.${feeKey as keyof typeof formFeesValues}.contractAmount`,
        roundedContractAmount
      );

      const companyAmount = (roundedTotalAmount * companyPercentage) / 100;
      const roundedCompanyAmount = Math.round(companyAmount * 100) / 100;
      form.setValue(
        `fees.${feeKey as keyof typeof formFeesValues}.companyAmount`,
        roundedCompanyAmount
      );
    });
    if (customFees) {
      customFees.forEach((customFee, index) => {
        const totalPercentage = customFee?.totalPercentage ?? 0;
        const contractPercentage = customFee?.contractPercentage ?? 0;
        const companyPercentage = customFee?.companyPercentage ?? 0;

        const totalAmount =
          customFee?.arbitrationValueType === "complementary"
            ? ((transferAmountWithoutLiquidity ?? 0) * totalPercentage) / 100
            : customFee?.arbitrationValueType === "desinvest"
              ? ((deinvestedAmount ?? 0) * totalPercentage) / 100
              : ((transferAmount ?? 0) * totalPercentage) / 100;
        const roundedTotalAmount = Math.round(totalAmount * 100) / 100;
        form.setValue(`customFees.${index}.totalAmount`, roundedTotalAmount);

        const contractAmount = (roundedTotalAmount * contractPercentage) / 100;
        const roundedContractAmount = Math.round(contractAmount * 100) / 100;
        form.setValue(
          `customFees.${index}.contractAmount`,
          roundedContractAmount
        );

        const companyAmount = (roundedTotalAmount * companyPercentage) / 100;
        const roundedCompanyAmount = Math.round(companyAmount * 100) / 100;
        form.setValue(
          `customFees.${index}.companyAmount`,
          roundedCompanyAmount
        );
      });
    }
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
              <Button
                type="button"
                label="scenes.customers.projects.chooseSupports"
                className="text-sm"
                onClick={() => setShowDialog(true)}
              />
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
                        onValueChange={(e) => {
                          field.onChange(e.value);
                        }}
                      />
                    )}
                  />
                  <span className="font-bold text-[#4761C8]">€</span>
                </div>
              </div>

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

            <CustomFeesWidget
              form={form}
              textAccessor={"arbitrage"}
              feesType="arbitrage"
              transfersAmount={amount}
              transferAmountWithoutLiquidity={transferAmountWithoutLiquidity}
              deinvestedAmount={deinvestedAmount}
            />

            <InvestmentInstrumentTable
              data={selectedInstruments}
              setData={setSelectedInstruments}
              withoutBuyPrice
              transfersAmount={
                deinvestedAmount + transferAmountWithoutLiquidity - totalFees
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
                      <Text label={numberFormat(totalFees)} />
                      <Text
                        label={numberFormat(
                          deinvestedAmount +
                            transferAmountWithoutLiquidity -
                            investedAmount -
                            totalFees
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
