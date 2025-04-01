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

import { complementaryInsuranceSchema } from "../../../../../../../shared/schemas/project";
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
import { CustomFeesWidget } from "../widgets/CustomFeesWidget";
import { InvestmentReadTable } from "./InvestmentReadTable";

type InvestmentRowWithId = InvestmentInstrumentTableRow & { id: string };
interface ComplementarySubscriptionInsuranceFormProps {
  contractID: string;
  name?: string;
  initialData?: z.infer<typeof complementaryInsuranceSchema>;
  instrumentQuery:
    | QueryObserverRefetchErrorResult<CustomerWalletQuery, unknown>
    | QueryObserverSuccessResult<CustomerWalletQuery, unknown>;
  sriTolerate?: number;
}
export const ComplementarySubscriptionInsuranceForm: React.FC<
  ComplementarySubscriptionInsuranceFormProps
> = ({ contractID, initialData, name, instrumentQuery, sriTolerate }) => {
  const params = useParams({
    from: companyCustomersProjectUpdateRoute.fullPath,
  });
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate({
    from: "/company/$companyId/customer/$customerId/projects/add",
  });
  const defaultValues = {
    //...initialData,
    assetID: initialData?.assetID ?? contractID,
    amount: initialData?.amount ?? 0,
    investments: [],
    sri: initialData?.sri,
    fees: {
      managementEuroFunds: {
        totalPercentage:
          initialData?.fees?.managementEuroFunds?.totalPercentage ?? 0,
        totalAmount: initialData?.fees?.managementEuroFunds?.totalAmount ?? 0,
        contractPercentage:
          initialData?.fees?.managementEuroFunds?.contractPercentage ?? 0,
        contractAmount:
          initialData?.fees?.managementEuroFunds?.contractAmount ?? 0,
        companyPercentage:
          initialData?.fees?.managementEuroFunds?.companyPercentage ?? 0,
        companyAmount:
          initialData?.fees?.managementEuroFunds?.companyAmount ?? 0,
      },
      managementUC: {
        totalPercentage: initialData?.fees?.managementUC?.totalPercentage ?? 0,
        totalAmount: initialData?.fees?.managementUC?.totalAmount ?? 0,
        contractPercentage:
          initialData?.fees?.managementUC?.contractPercentage ?? 0,
        contractAmount: initialData?.fees?.managementUC?.contractAmount ?? 0,
        companyPercentage:
          initialData?.fees?.managementUC?.companyPercentage ?? 0,
        companyAmount: initialData?.fees?.managementUC?.companyAmount ?? 0,
      },
      opening: {
        totalPercentage: initialData?.fees?.opening?.totalPercentage ?? 0,
        totalAmount: initialData?.fees?.opening?.totalAmount ?? 0,
        contractPercentage: initialData?.fees?.opening?.contractPercentage ?? 0,
        contractAmount: initialData?.fees?.opening?.contractAmount ?? 0,
        companyPercentage: initialData?.fees?.opening?.companyPercentage ?? 0,
        companyAmount: initialData?.fees?.opening?.companyAmount ?? 0,
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
      exit: {
        totalPercentage: initialData?.fees?.exit?.totalPercentage ?? 0,
        totalAmount: initialData?.fees?.exit?.totalAmount ?? 0,
        contractPercentage: initialData?.fees?.exit?.contractPercentage ?? 0,
        contractAmount: initialData?.fees?.exit?.contractAmount ?? 0,
        companyPercentage: initialData?.fees?.exit?.companyPercentage ?? 0,
        companyAmount: initialData?.fees?.exit?.companyAmount ?? 0,
      },
      advice: {
        totalPercentage: initialData?.fees?.advice?.totalPercentage ?? 0,
        totalAmount: initialData?.fees?.advice?.totalAmount ?? 0,
        contractPercentage: initialData?.fees?.advice?.contractPercentage ?? 0,
        contractAmount: initialData?.fees?.advice?.contractAmount ?? 0,
        companyPercentage: initialData?.fees?.advice?.companyPercentage ?? 0,
        companyAmount: initialData?.fees?.advice?.companyAmount ?? 0,
      },
      surperformance: {
        totalPercentage:
          initialData?.fees?.surperformance?.totalPercentage ?? 0,
        totalAmount: initialData?.fees?.surperformance?.totalAmount ?? 0,
        contractPercentage:
          initialData?.fees?.surperformance?.contractPercentage ?? 0,
        contractAmount: initialData?.fees?.surperformance?.contractAmount ?? 0,
        companyPercentage:
          initialData?.fees?.surperformance?.companyPercentage ?? 0,
        companyAmount: initialData?.fees?.surperformance?.companyAmount ?? 0,
      },
    },
    customFees: initialData?.customFees ?? [],
  };

  const form = useForm<z.infer<typeof complementaryInsuranceSchema>>({
    defaultValues,
  });
  const { field } = useController({
    control: form.control,
    name: "amount",
  });

  const transferAmount = form.watch("amount");
  const fees = form.watch("fees");
  const customFees = form.watch("customFees");
  const { amount, amountWithoutFees, openFees, totalFees } = calculateFees(
    transferAmount,
    fees,
    "complementaryInsurance",
    customFees as any
  );

  const projectCreationMutation = useProjectCreation(
    "ComplementaryLifeInsurance",
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["projectList"]);
        navigate({
          to: "/company/$companyId/customer/$customerId/projects/",
          params: {
            companyId: params.companyId as string,
            customerId: params.customerId as string,
          },
          search: {
            type: ProjectType.ComplementaryLifeInsurance,
          },
        });
      },
    }
  );

  const projectUpdateMutation = useProjectUpdate("ComplementaryLifeInsurance", {
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
          type: ProjectType.ComplementaryLifeInsurance,
        },
      });
    },
  });

  const onSubmit = async (
    data: z.infer<typeof complementaryInsuranceSchema>
  ) => {
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

  const [showCreateDialog, setShowCreateDialog] = useState(false);
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

  const formCustomFeesValues = form.getValues("customFees");
  function updateTransferAmount(value: number) {
    Object.keys(fees).forEach((feeKey) => {
      const totalPercentage =
        form.getValues(`fees.${feeKey as keyof typeof fees}.totalPercentage`) ??
        0;
      const contractPercentage =
        form.getValues(
          `fees.${feeKey as keyof typeof fees}.contractPercentage`
        ) ?? 0;
      const companyPercentage =
        form.getValues(
          `fees.${feeKey as keyof typeof fees}.companyPercentage`
        ) ?? 0;

      const totalAmount = ((value ?? 0) * totalPercentage) / 100;
      const roundedTotalAmount = Math.round(totalAmount * 100) / 100;
      form.setValue(
        `fees.${feeKey as keyof typeof fees}.totalAmount`,
        roundedTotalAmount
      );

      const contractAmount = (roundedTotalAmount * contractPercentage) / 100;
      const roundedContractAmount = Math.round(contractAmount * 100) / 100;
      form.setValue(
        `fees.${feeKey as keyof typeof fees}.contractAmount`,
        roundedContractAmount
      );

      const companyAmount = (roundedTotalAmount * companyPercentage) / 100;
      const roundedCompanyAmount = Math.round(companyAmount * 100) / 100;
      form.setValue(
        `fees.${feeKey as keyof typeof fees}.companyAmount`,
        roundedCompanyAmount
      );
    });

    if (formCustomFeesValues) {
      formCustomFeesValues.forEach((customFee, index) => {
        const totalPercentage = customFee?.totalPercentage ?? 0;
        const contractPercentage = customFee?.contractPercentage ?? 0;
        const companyPercentage = customFee?.companyPercentage ?? 0;

        const totalAmount = ((value ?? 0) * totalPercentage) / 100;
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
  }

  const investments = useController({
    control: form.control,
    name: "investments",
  });

  useEffect(() => {
    investments.field.onChange(
      selectedInstruments.map((el) => ({
        label: el.label,
        code: el.code,
        id: el.id ?? "",
        investmentPercent: el.percent,
        amount: el.amount,
        quantity: el.quantity,
        valuation: el.valuation,
        riskIndicator: el.riskIndicator,
      }))
    );
  }, [selectedInstruments]);

  const sriBefore = instrumentQuery.data?.customerWallet?.sri;

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
          <h1 className="text-[#4761C8] font-bold text-xl mb-4">
            {t("scenes.customers.projects.feesForm.title")}
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
          <CustomFeesWidget
            form={form}
            textAccessor={"complementary"}
            feesType="complementary"
            transfersAmount={amount}
            useTitle={false}
          />
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
                  <label className="text-blue-800 font-bold">{sriBefore}</label>
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
                        label={numberFormat(amountWithoutFees - investedAmount)}
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
