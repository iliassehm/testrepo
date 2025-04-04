import { redemptionSchema } from "@shared-schemas/project";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { type FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { z } from "zod";

import { Button, Text } from "../../../../../../components";
import { Widget } from "../../../../../../components/Widget";
import { numberFormat } from "../../../../../../helpers";
import { calculateFees } from "../../../../../../helpers/calculateFees";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import { gql } from "../../../../../../service/client";
import { AssetGroup, ProjectType } from "../../../../../../types";
import { WealthLogic } from "../../wealth/wealth.logic";
import { useProjectCreation } from "../useProjectCreation";
import { useProjectUpdate } from "../useProjectUpdate";
import { CustomFeesWidget } from "../widgets/CustomFeesWidget";
import {
  DeinvestmentInstrumentTable,
  DeinvestmentInstrumentTableRow,
} from "./DeinvestmentTable";

type RedemptionFormValues = z.infer<typeof redemptionSchema>;

type RedemptionFormProps = {
  contractID: string;
  name?: string;
  initialData?: z.infer<typeof redemptionSchema>;
  sriTolerate?: number;
};

export const RedemptionForm: FC<RedemptionFormProps> = ({
  contractID,
  name,
  initialData,
  sriTolerate,
}) => {
  const [currentAverageSRI, setCurrentAverageSRI] = useState<number | null>(
    null
  );
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const currentRoute = useCurrentRoute();

  const navigate = useNavigate({
    from: currentRoute.routeId,
  });
  const params = useParams({
    from: currentRoute.routeId,
  }) as {
    companyId: string;
    customerId: string;
    projectID?: string;
  };
  const search = useSearch({
    from: currentRoute.routeId,
  }) as {
    type: ProjectType;
  };

  const form = useForm<RedemptionFormValues>({
    defaultValues: {
      fees: {
        advice: {
          totalPercentage: initialData?.fees?.advice?.totalPercentage ?? 0,
          totalAmount: initialData?.fees?.advice?.totalAmount ?? 0,
          contractPercentage:
            initialData?.fees?.advice?.contractPercentage ?? 0,
          contractAmount: initialData?.fees?.advice?.contractAmount ?? 0,
          companyPercentage: initialData?.fees?.advice?.companyPercentage ?? 0,
          companyAmount: initialData?.fees?.advice?.companyAmount ?? 0,
        },
        redemption: {
          totalPercentage: initialData?.fees?.redemption?.totalPercentage ?? 0,
          totalAmount: initialData?.fees?.redemption?.totalAmount ?? 0,
          contractPercentage:
            initialData?.fees?.redemption?.contractPercentage ?? 0,
          contractAmount: initialData?.fees?.redemption?.contractAmount ?? 0,
          companyPercentage:
            initialData?.fees?.redemption?.companyPercentage ?? 0,
          companyAmount: initialData?.fees?.redemption?.companyAmount ?? 0,
        },
      },
      customFees: initialData?.customFees ?? [],
      divestments: initialData?.divestments ?? [],
      annotation: initialData?.annotation ?? "",
      assetID: initialData?.assetID ?? "",
      sri: initialData?.sri,
    },
  });

  const projectCreationMutation = useProjectCreation("Redemption", {
    onSuccess: () => {
      queryClient.invalidateQueries(["projectList"]);
      navigate({
        to: "/company/$companyId/customer/$customerId/projects/",
        params: {
          companyId: params.companyId as string,
          customerId: params.customerId as string,
        },
        search: {
          ...search,
          type: ProjectType.Redemption,
        },
      });
    },
  });

  const projectUpdateMutation = useProjectUpdate("Redemption", {
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
          type: ProjectType.Redemption,
        },
      });
    },
  });

  const instrumentQuery = useQuery(
    ["customerWalletInstrument", params.companyId, contractID],
    () =>
      gql.client.request(WealthLogic.customerWalletQueries(), {
        companyID: params.companyId ?? "",
        id: contractID ?? "",
        group: AssetGroup.LifeInsuranceCapitalization,
      })
  );

  const [selectedInstruments, setSelectedInstruments] = useState<
    DeinvestmentInstrumentTableRow[]
  >([]);

  const onSubmit = (data: RedemptionFormValues) => {
    if (initialData && params.projectID) {
      projectUpdateMutation.mutate({
        id: params.projectID,
        metadata: {
          ...data,
          sri: currentAverageSRI,
          assetID: contractID,
          originalInvestments:
            instrumentQuery.data?.customerWallet?.investments?.map((el) => ({
              ...el,
              label: el.label ?? "",
              quantity: el.quantity ?? 0,
            })) ?? [],
          divestments: selectedInstruments.map((el) => ({
            id: el.id ?? "",
            label: el.label ?? "",
            code: el.code ?? "",
            divestmentPercent: el.divestmentPercent ?? 0,
          })),
        },
      });
    } else {
      projectCreationMutation.mutate({
        name: name ?? "",
        companyID: params.companyId as string,
        customerID: params.customerId as string,
        metadata: {
          ...data,
          sri: currentAverageSRI,
          assetID: contractID,
          originalInvestments:
            instrumentQuery.data?.customerWallet?.investments?.map((el) => ({
              ...el,
              label: el.label ?? "",
              quantity: el.quantity ?? 0,
            })) ?? [],
          divestments: selectedInstruments.map((el) => ({
            id: el.id ?? "",
            label: el.label ?? "",
            code: el.code ?? "",
            divestmentPercent: el.divestmentPercent ?? 0,
          })),
        },
      });
    }
  };

  useEffect(() => {
    if (instrumentQuery.data?.customerWallet?.investments) {
      setSelectedInstruments(
        (instrumentQuery.data.customerWallet.investments.map((el) => {
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

  const deinvestedAmount = selectedInstruments.reduce(
    (acc, cur) => acc + (cur.divestmentAmount ?? 0),
    0
  );

  const transferAmount = deinvestedAmount;
  const fees = form.watch("fees");

  const { amountWithoutFees, openFees } = calculateFees(
    transferAmount,
    fees,
    "redemption"
  );

  const sriBefore = instrumentQuery.data?.customerWallet?.sri ?? "-";

  function averageSRICalcul() {
    let totalValue = 0;
    instrumentQuery.data?.customerWallet?.investments?.map((el, index) => {
      totalValue +=
        el.valuation.value *
        (1 -
          (selectedInstruments[index]?.divestmentPercent
            ? selectedInstruments[index].divestmentPercent
            : 0) /
            100);
    });
    let totalSRI = 0;

    if (totalValue !== 0) {
      instrumentQuery.data?.customerWallet?.investments?.map((el, index) => {
        const perc = (el.valuation.value / totalValue) * 100;
        if (selectedInstruments)
          totalSRI +=
            perc *
            (el.riskIndicator
              ? el.riskIndicator
              : el.code === "XXliquidity"
                ? 1
                : 7) *
            (selectedInstruments[index]
              ? 1 -
                (selectedInstruments[index]?.divestmentPercent
                  ? selectedInstruments[index].divestmentPercent
                  : 0) /
                  100
              : 1);
      });
    }
    if (totalSRI !== 0) {
      totalSRI = Math.round(totalSRI * 100) / 100;
      totalSRI /= 100;
      const totalSRIRounded = Math.round(totalSRI);
      if (totalSRIRounded < totalSRI) return totalSRIRounded + 1;
      return totalSRIRounded;
    }
    return null;
  }

  useEffect(() => {
    if (selectedInstruments) setCurrentAverageSRI(averageSRICalcul());
  }, [selectedInstruments]);

  const formFeesValues = form.watch("fees");
  const formCustomFeesValues = form.watch("customFees");
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

      const totalAmount = ((deinvestedAmount ?? 0) * totalPercentage) / 100;
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
    if (formCustomFeesValues) {
      formCustomFeesValues.forEach((customFee, index) => {
        const totalPercentage = customFee?.totalPercentage ?? 0;
        const contractPercentage = customFee?.contractPercentage ?? 0;
        const companyPercentage = customFee?.companyPercentage ?? 0;

        const totalAmount = ((deinvestedAmount ?? 0) * totalPercentage) / 100;
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
  }, [amountWithoutFees]);

  return (
    <>
      <form
        className="flex flex-col gap-4 p-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4 p-2">
          <h1 className="font-normal text-2xl mb-2">
            {t("scenes.customers.projects.addProject.projectName")} :{" "}
            <span className="font-bold text-blue-800">{name}</span>
          </h1>

          <Widget className="mt-4 p-2 py-4">
            <>
              <CustomFeesWidget
                form={form}
                textAccessor={"redemption"}
                feesType="redemption"
                transfersAmount={deinvestedAmount}
              />
            </>
          </Widget>

          <Widget className="mt-4 p-2 py-4">
            <>
              <h1 className="text-[#4761C8] font-bold text-xl mb-6">
                {t("scenes.customers.projects.redemption")}
              </h1>

              <div className={"flex flex-row justify-center gap-10"}>
                <div
                  className={"flex flex-row item-center justify-center gap-2"}
                >
                  <label>
                    {t(
                      "scenes.customers.projects.addProject.redemption.risk.before"
                    )}
                    {" :"}
                  </label>
                  <label className="text-blue-800 font-bold">{sriBefore}</label>
                </div>
                <div className={"flex flex-row justify-center gap-2"}>
                  <label>
                    {t(
                      "scenes.customers.projects.addProject.redemption.risk.after"
                    )}
                    {" :"}
                  </label>
                  <label className="text-blue-800 font-bold">
                    {currentAverageSRI ?? "-"}
                  </label>
                </div>
                <div className={"flex flex-row justify-center gap-2"}>
                  <label>
                    {t(
                      "scenes.customers.projects.addProject.redemption.risk.tolerate"
                    )}
                    {" :"}
                  </label>
                  <label className="text-blue-800 font-bold">
                    {sriTolerate ?? "-"}
                  </label>
                </div>
              </div>
              <DeinvestmentInstrumentTable
                data={selectedInstruments}
                setData={setSelectedInstruments}
                transfersAmount={1000}
                onSubmit={() => null}
                footer={() => (
                  <div className="flex justify-end">
                    <div>
                      <div className="flex flex-col p-2 text-right text-blue-800">
                        <Text label="scenes.customers.projects.deinvestment" />
                        <Text label="scenes.customers.projects.fee" />
                        <Text label="scenes.customers.projects.remainingDeinvestment" />
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col p-2 text-right text-blue-800">
                        <Text label={numberFormat(deinvestedAmount)} />
                        <Text label={numberFormat(openFees)} />
                        <Text label={numberFormat(amountWithoutFees)} />
                      </div>
                    </div>
                  </div>
                )}
              />
            </>
          </Widget>
          <div className="flex justify-end mt-4">
            <Button
              label="scenes.customers.projects.submit"
              type="submit"
              isLoading={
                projectCreationMutation.isLoading ||
                projectUpdateMutation.isLoading
              }
            />
          </div>
        </div>
      </form>
    </>
  );
};
