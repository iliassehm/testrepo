import { useNavigate, useParams } from "@tanstack/react-router";
import { InputNumber } from "primereact/inputnumber";
import React, { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  QueryObserverRefetchErrorResult,
  QueryObserverSuccessResult,
  useQueryClient,
} from "react-query";
import { z } from "zod";

import { complementaryCIFSchema } from "../../../../../../../shared/schemas/project";
import { Button } from "../../../../../../components";
import { Text } from "../../../../../../components";
import { Label } from "../../../../../../components/Label";
import { SupportCreationDialog } from "../../../../../../components/SupportSelection/SupportCreationDialog";
import SupportSelectionDialog from "../../../../../../components/SupportSelection/SupportSelectionDialog";
import { Widget } from "../../../../../../components/Widget";
import { formatCurrency } from "../../../../../../helpers";
import { numberFormat } from "../../../../../../helpers";
import { calculateFees } from "../../../../../../helpers/calculateFees";
import {
  AssetGroup,
  CustomerInvestment,
  CustomerWalletQuery,
  ProjectType,
} from "../../../../../../types";
import {
  InvestmentInstrumentTable,
  InvestmentInstrumentTableRow,
} from "../../wealth/AssetCreation/LongTermAsset/components/data-table";
import { companyCustomersProjectUpdateRoute } from "../route";
import { useProjectCreation } from "../useProjectCreation";
import { useProjectUpdate } from "../useProjectUpdate";
import { EvolutionFeesWidget } from "../widgets/EvolutionWidget";
import { SimpleCifFeesWidget } from "../widgets/SimpleCifFeesWidget";
import { InvestmentReadTable } from "./InvestmentReadTable";

type ComplementaryCifFormValues = z.infer<typeof complementaryCIFSchema>;
type InvestmentRowWithId = InvestmentInstrumentTableRow & { id: string };
interface ComplementarySubscriptionCIFFormProps {
  contractID: string;
  name?: string;
  initialData?: z.infer<typeof complementaryCIFSchema>;
  instrumentQuery:
    | QueryObserverRefetchErrorResult<CustomerWalletQuery, unknown>
    | QueryObserverSuccessResult<CustomerWalletQuery, unknown>;
  sriTolerate?: number;
}
export const ComplementarySubscriptionCIFForm: React.FC<
  ComplementarySubscriptionCIFFormProps
> = ({ contractID, initialData, name, instrumentQuery, sriTolerate }) => {
  const params = useParams({
    from: companyCustomersProjectUpdateRoute.fullPath,
  });
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate({
    from: "/company/$companyId/customer/$customerId/projects/add",
  });

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const form = useForm<ComplementaryCifFormValues>({
    defaultValues: {
      // ...initialData,
      assetID: initialData?.assetID ?? contractID,
      amount: initialData?.amount ?? 0,
      investments: [],
      sri: initialData?.sri,
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
          gestion: {
            amount: initialData?.fees?.products?.gestion?.amount ?? 0,
            percentage: initialData?.fees?.products?.gestion?.percentage ?? 0,
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

  const transferAmount = form.watch("amount");
  const fees = form.watch("fees");
  const { amount, amountWithoutFees, openFees } = calculateFees(
    transferAmount,
    fees,
    "cif"
  );

  const projectCreationMutation = useProjectCreation("ComplementaryCif", {
    onSuccess: () => {
      queryClient.invalidateQueries(["projectList"]);
      navigate({
        to: "/company/$companyId/customer/$customerId/projects/",
        params: {
          companyId: params.companyId as string,
          customerId: params.customerId as string,
        },
        search: {
          type: ProjectType.ComplementaryCif,
        },
      });
    },
  });

  const projectUpdateMutation = useProjectUpdate("ComplementaryCif", {
    onSuccess: (res) => {
      queryClient.invalidateQueries(["projectList"]);
      queryClient.invalidateQueries(["project", res.projectUpdate?.id]);
      navigate({
        to: "/company/$companyId/customer/$customerId/projects/",
        params: {
          companyId: params.companyId as string,
          customerId: params.customerId as string,
        },
        search: {
          type: ProjectType.ComplementaryCif,
        },
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof complementaryCIFSchema>) => {
    if (initialData && params.projectID) {
      await projectUpdateMutation.mutateAsync({
        id: params.projectID,
        metadata: {
          ...data,
        },
      });
    } else {
      await projectCreationMutation.mutateAsync({
        name: name ?? "",
        companyID: params.companyId ?? "",
        customerID: params.customerId ?? "",
        metadata: {
          ...data,
          assetID: contractID,
        },
      });
    }
  };

  const enterFeesValue = [
    "opening",
    "transfer",
    "closing",
    "advice",
    "brokerage",
    "exchange",
    "enterRight",
  ];

  const variableFeesValue = [
    "arbitration",
    "followingAdvice",
    "custodialRight",
    "accountManagement",
    "inactivity",
    "managementAssignments",
    "gestion",
    "surperformance",
  ];

  function GetFixedFeesWithoutEnterRight() {
    let fixedFees = 0;
    Object.keys(fees.services).forEach((service) => {
      if (service !== "enterRight" && enterFeesValue.includes(service))
        fixedFees +=
          fees.services[service as keyof typeof fees.services]?.amount ?? 0;
    });
    Object.keys(fees.customFees).forEach((index) => {
      const idx = Number(index);
      if (fees.customFees[idx]?.feesType === "enter")
        fixedFees += fees.customFees[idx]?.amount ?? 0;
    });
    Object.keys(fees.products).forEach((product) => {
      if (product !== "enterRight" && enterFeesValue.includes(product))
        fixedFees +=
          fees.products[product as keyof typeof fees.products]?.amount ?? 0;
    });
    return fixedFees;
  }

  function updateTransferAmount(value: number) {
    Object.keys(fees.services).forEach((service) => {
      form.setValue(
        `fees.services.${service as keyof typeof fees.services}.amount`,
        Math.round(
          value *
            ((fees.services[service as keyof typeof fees.services]
              ?.percentage ?? 0) /
              100) *
            100
        ) / 100
      );
    });

    Object.keys(fees.customFees).forEach((index) => {
      const idx = Number(index);
      form.setValue(
        `fees.customFees.${idx}.amount`,
        Math.round(
          value * ((fees.customFees[idx]?.percentage ?? 0) / 100) * 100
        ) / 100
      );
    });
    Object.keys(fees.tiers).forEach((tier) => {
      form.setValue(
        `fees.tiers.${tier as keyof typeof fees.tiers}.amount`,
        Math.round(
          value *
            ((fees.tiers[tier as keyof typeof fees.tiers]?.percentage ?? 0) /
              100) *
            100
        ) / 100
      );
    });
    Object.keys(fees.products).forEach((product) => {
      form.setValue(
        `fees.products.${product as keyof typeof fees.products}.amount`,
        Math.round(
          (product === "enterRight"
            ? value - GetFixedFeesWithoutEnterRight()
            : value) *
            ((fees.products[product as keyof typeof fees.products]
              ?.percentage ?? 0) /
              100) *
            100
        ) / 100
      );
    });

    let totalAmount = 0;
    let enterAmount = 0;
    let variableAmount = 0;

    Object.keys(fees.services).forEach((service) => {
      const serviceKey = service as keyof typeof fees.services;
      totalAmount += fees.services[serviceKey]?.amount ?? 0;
      if (enterFeesValue.includes(service)) {
        enterAmount += fees.services[serviceKey]?.amount ?? 0;
      } else if (variableFeesValue.includes(service)) {
        variableAmount += fees.services[serviceKey]?.amount ?? 0;
      }
    });

    Object.keys(fees.customFees).forEach((key) => {
      const index = Number(key);
      totalAmount += fees.customFees[index]?.amount ?? 0;

      if (fees.customFees[index]?.feesType === "enter") {
        enterAmount += fees.customFees[index]?.amount ?? 0;
      } else {
        variableAmount += fees.customFees[index]?.amount ?? 0;
      }
    });

    Object.keys(fees.products).forEach((product) => {
      const productKey = product as keyof typeof fees.products;
      totalAmount += fees.products[productKey]?.amount ?? 0;
      if (enterFeesValue.includes(product)) {
        enterAmount += fees.products[productKey]?.amount ?? 0;
      } else if (variableFeesValue.includes(product)) {
        variableAmount += fees.products[productKey]?.amount ?? 0;
      }
    });

    form.setValue("fees.enterFeesAmount", Math.round(enterAmount * 100) / 100);
    form.setValue(
      "fees.variableFeesAmount",
      Math.round(variableAmount * 100) / 100
    );
    form.setValue("fees.totalValue", Math.round(totalAmount * 100) / 100);

    const evolutionValues = form.watch("evolution");
    Array.from({ length: 5 }, (_, year) => {
      form.setValue(
        `evolution.${year}.evolutionPercentage`,
        Math.round(
          (fees.variablePercent + fees.enterPercent / (year + 1)) * 100
        ) / 100
      );

      form.setValue(
        `evolution.${year}.evolutionAmount`,
        Math.round(
          value * (evolutionValues[year].evolutionPercentage / 100) * 100
        ) / 100
      );
    });
  }

  const sriBefore = instrumentQuery.data?.customerWallet?.sri;

  // Complementary CIF
  const { control } = form;

  const investments = useController({
    control,
    name: "investments",
  });
  const { field } = useController({
    control,
    name: "amount",
  });

  const [showDialog, setShowDialog] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState<
    InvestmentRowWithId[]
  >(
    Array.from([
      ...((instrumentQuery.data?.customerWallet?.investments?.map((el) => {
        const foundInvestment = initialData?.investments?.find(
          (e) => e.id === el.id
        );

        const percent = foundInvestment?.investmentPercent ?? 0;
        const amount = foundInvestment?.amount ?? 0;
        const quantity = foundInvestment?.quantity ?? 0;
        return {
          ...el,
          valuation: {
            value: el.unitValue ?? 0,
            instrument: el.instrument,
          },
          buyingPrice: el.unitValue ?? 0,
          amount: amount,
          quantity: quantity,
          percent: percent,
        };
      }) as any) ?? []),
      ...(initialData?.investments
        .filter((el) => el.id === "")
        .map((el) => ({
          ...el,
          id: el.id,
          code: el.code ?? "",
          label: el.label ?? "",
          percent: el.investmentPercent ?? 0,
          quantity: el.quantity ?? 0,
          amount: el.amount ?? 0,
          valuation: el.valuation,
          riskIndicator: el.riskIndicator ?? 7,
        })) || []),
    ])
  );

  const investedAmount = selectedInstruments.reduce(
    (acc, cur) => acc + (cur.amount ?? 0),
    0
  );

  function averageSRICalcul() {
    let totalValue = 0;
    selectedInstruments.map((el) => {
      totalValue += el.amount;
    });
    totalValue += amountWithoutFees - investedAmount;

    let totalSRI = 0;
    if (totalValue !== 0) {
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
      totalSRI += ((amountWithoutFees - investedAmount) / totalValue) * 100;
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
    investments.field.onChange(
      selectedInstruments.map((el) => ({
        label: el.label,
        code: el.code,
        id: el.id,
        investmentPercent: el.percent,
        amount: el.amount,
        quantity: el.quantity,
        valuation: el.valuation,
        riskIndicator: el.riskIndicator,
      }))
    );
    averageSRICalcul();
  }, [selectedInstruments]);

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-2"
      >
        <h1 className="font-normal text-2xl mb-2">
          {t("scenes.customers.projects.addProject.projectName")} :{" "}
          <span className="font-bold text-blue-800">{name}</span>
        </h1>

        <Widget className="mt-4 p-2 py-4">
          <>
            <div className="flex items-center mb-6 ">
              <h1 className="text-[#4761C8] font-bold text-xl grow">
                {t("scenes.customers.projects.complementary.currentContract")}
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
            <InvestmentReadTable
              data={
                (instrumentQuery.data?.customerWallet?.investments ??
                  []) as CustomerInvestment[]
              }
              totalValuation={
                instrumentQuery.data?.customerWallet?.investments?.reduce(
                  (acc, el) => acc + el.valuation.value,
                  0
                ) ?? 0
              }
            />
          </>
        </Widget>
        <Widget className="mt-4 p-2 py-4">
          <div className="mb-10">
            <h1 className="text-[#4761C8] font-bold text-xl mb-4">
              {t("scenes.customers.projects.addProject.cif.fees.feesLabel")}
            </h1>
            <div className="flex flex-col gap-6">
              <div className="flex flex-row items-center gap-4">
                <Label
                  label={t(
                    "scenes.customers.projects.addProject.complementary.additionalPayment"
                  )}
                />
                <div className="flex flex-row gap-1 items-center">
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
                      updateTransferAmount(e.value as number);
                    }}
                  />
                  <span className="font-bold text-[#4761C8]">€</span>
                </div>
              </div>
            </div>
            <SimpleCifFeesWidget form={form} arbitrage={false} />
          </div>
        </Widget>

        <Widget className="p-4">
          <EvolutionFeesWidget form={form} />
        </Widget>

        <Widget className="mt-4 p-2 py-4">
          <SupportSelectionDialog
            hide={() => setShowDialog(false)}
            open={showDialog}
            type={AssetGroup.LifeInsuranceCapitalization}
            initialData={selectedInstruments}
            onSubmit={(data) =>
              setSelectedInstruments(
                (data as InvestmentRowWithId[]).map((d) => ({
                  ...d,
                  id: d.id ?? "",
                  percent: d.percent ?? 0,
                  quantity: d.quantity ?? 0,
                  amount: d.amount ?? 0,
                  buyingPrice: d.buyingPrice ?? d.valuation?.value ?? 0,
                }))
              )
            }
          />
          <div className="py-4">
            <div className="w-full flex justify-between mb-4">
              <h1 className="text-[#4761C8] font-bold text-xl mb-4">
                {t("scenes.customers.projects.complementary.title")}
              </h1>
              <Button
                type="button"
                label="scenes.customers.projects.chooseSupports"
                className="text-sm"
                onClick={() => setShowDialog(true)}
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-row justify-center gap-4">
                <div className={"flex flex-row gap-10"}>
                  <div
                    className={"flex flex-row item-center justify-center gap-2"}
                  >
                    <label>
                      {t(
                        "scenes.customers.projects.addProject.complementary.risk.before"
                      )}
                      {" :"}
                    </label>
                    <label className="text-blue-800 font-bold">
                      {sriBefore}
                    </label>
                  </div>

                  <div className={"flex flex-row justify-center gap-2"}>
                    <label>
                      {t(
                        "scenes.customers.projects.addProject.complementary.risk.after"
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
                        "scenes.customers.projects.addProject.complementary.risk.tolerate"
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
                setData={setSelectedInstruments as any}
                withoutBuyPrice
                transfersAmount={amountWithoutFees ?? 0}
                setTransfersAmount={(val) => field.onChange(val)}
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
                  <div className="flex flex-col text-[#4761C8A6] pr-4 pt-4">
                    <div className="flex flex-row align-center  justify-end ">
                      <div className="flex flex-col text-right">
                        <Text
                          label={
                            t(
                              "scenes.customers.projects.complementary.feeCharged"
                            ) + " :"
                          }
                          className="font-bold text-sm"
                        />
                      </div>
                      <div className="flex flex-col text-right pl-4 pr-1">
                        <Text
                          label={numberFormat(openFees ?? 0)}
                          className="font-bold text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-row align-center  justify-end ">
                      <div className="flex flex-col text-right">
                        <Text
                          label={
                            t(
                              "scenes.customers.projects.complementary.remainingInvestment"
                            ) + " :"
                          }
                          className="font-bold text-sm"
                        />
                      </div>
                      <div className="flex flex-col text-right pl-4">
                        <Text
                          label={numberFormat(
                            amountWithoutFees - investedAmount
                          )}
                          className="font-bold text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-row align-center">
                      <div className="flex flex-col text-right">
                        <Text
                          label={
                            t(
                              "scenes.customers.projects.complementary.netInvestment"
                            ) + " :"
                          }
                          className="font-bold text-sm"
                        />
                      </div>
                      <div className="flex flex-col text-right pl-4 pr-1">
                        <Text
                          label={numberFormat(investedAmount ?? 0)}
                          className="font-bold text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </Widget>
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
      </form>

      {showCreateDialog && (
        <SupportCreationDialog
          hide={() => setShowCreateDialog(false)}
          onSubmit={(data) =>
            setSelectedInstruments((val) => [
              ...val,
              {
                ...data,
                id: "",
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
