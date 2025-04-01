import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { insuranceSubscription } from "../../../../../../../shared/schemas/project";
import { Button } from "../../../../../../components";
import { Widget } from "../../../../../../components/Widget";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import { ProjectType } from "../../../../../../types";
import { useProjectCreation } from "../useProjectCreation";
import { useProjectUpdate } from "../useProjectUpdate";
import { CustomFeesWidget } from "../widgets/CustomFeesWidget";
import { SupportWidget } from "../widgets/SupportWidget";
import { TextAreaWidget } from "../widgets/TextAreaWidget";
import {
  ProjectsChoiceFormFilling,
  scheduledPaymentList,
} from "./ProjectsChoiceFormFilling";

export type InsuranceSubscriptionFormValues = z.infer<
  typeof insuranceSubscription
>;

interface InsuranceSubscriptionFormProps {
  name: string;
  isUpdate?: boolean;
  product?: string;
  initialData?: Partial<InsuranceSubscriptionFormValues>;
  sriTolerate?: number;
}
export const InsuranceSubscriptionForm: React.FC<
  InsuranceSubscriptionFormProps
> = ({ initialData, name, isUpdate = false, product, sriTolerate }) => {
  const { t } = useTranslation();
  const currentRoute = useCurrentRoute();

  const navigate = useNavigate({
    from: currentRoute.routeId,
  });

  // const search = useSearch({
  //   from: currentRoute.routeId,
  // });
  const form = useForm<InsuranceSubscriptionFormValues>({
    resolver: zodResolver(insuranceSubscription),
    defaultValues: {
      product,
      alternatives: initialData?.alternatives ?? [],
      fees: initialData?.fees ?? {
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
          totalPercentage:
            initialData?.fees?.managementUC?.totalPercentage ?? 0,
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
          contractPercentage:
            initialData?.fees?.opening?.contractPercentage ?? 0,
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
          contractPercentage:
            initialData?.fees?.advice?.contractPercentage ?? 0,
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
          contractAmount:
            initialData?.fees?.surperformance?.contractAmount ?? 0,
          companyPercentage:
            initialData?.fees?.surperformance?.companyPercentage ?? 0,
          companyAmount: initialData?.fees?.surperformance?.companyAmount ?? 0,
        },
      },
      customFees: initialData?.customFees ?? [],
      primaryContract: initialData?.primaryContract ?? {
        name: "",
        type: product,
        insuranceCompany: "",
        accessCondition: false,
        managedOptions: [],
        fundsOrigin: "",
        annuityType: "",
        prevoyanceGuarantee: "",
        mortalityTable: "",
        amount: 0,
        scheduledPaymentList:
          initialData?.primaryContract?.scheduledPaymentList ??
          scheduledPaymentList[0],
        scheduledPayment: initialData?.primaryContract?.scheduledPayment ?? 0,
      },
      sri: initialData?.sri,
      ...initialData,
    },
  });

  const params = useParams({
    from: currentRoute.routeId,
  }) as { companyId: string; customerId: string; projectID: string };

  const search = useSearch({
    from: currentRoute.routeId,
  }) as { type: string };

  const [remainingAmount, setRemainingAmount] = React.useState(0);

  const projectCreationMutation = useProjectCreation(
    "SubscriptionLifeInsurance",
    {
      onSuccess: () => {
        navigate({
          to: "/company/$companyId/customer/$customerId/projects/",
          params: {
            companyId: params.companyId as string,
            customerId: params.customerId as string,
          },
          search: {
            ...search,
            type: ProjectType.SubscriptionLifeInsurance,
          },
        });
      },
    }
  );

  const projectUpdateMutation = useProjectUpdate("SubscriptionLifeInsurance", {
    onSuccess: () => {
      navigate({
        to: "/company/$companyId/customer/$customerId/projects/",
        params: {
          companyId: params.companyId as string,
          customerId: params.customerId as string,
        },
        search: {
          ...search,
          type: ProjectType.SubscriptionLifeInsurance,
        },
      });
    },
  });

  const onSubmit = (data: InsuranceSubscriptionFormValues) => {
    if (isUpdate) {
      projectUpdateMutation.mutate({
        id: params.projectID as string,
        metadata: data,
      });
    } else {
      projectCreationMutation.mutate({
        customerID: params.customerId as string,
        companyID: params.companyId as string,
        name,
        metadata: data,
      });
    }
  };

  const currentAverageSRI = form.watch("sri");
  const selectedInstruments = form.watch("investments");

  function averageSRICalcul() {
    let totalValue = 0;
    selectedInstruments.map((el) => {
      totalValue += el?.amount;
    });
    totalValue += remainingAmount;

    let totalSRI = 0;
    if (totalValue !== 0) {
      selectedInstruments.map((el) => {
        const perc = (el?.amount / totalValue) * 100;
        totalSRI +=
          perc *
          (el.riskIndicator
            ? el.riskIndicator
            : el.code === "XXliquidity"
              ? 1
              : 7);
      });
      totalSRI += 100 * (remainingAmount / totalValue);
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
    if (selectedInstruments) averageSRICalcul();
  }, [selectedInstruments, remainingAmount]);

  return (
    <form
      className="flex flex-col gap-4 p-2"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <h1 className="font-normal text-2xl mb-2">
        {t("scenes.customers.projects.addProject.projectName")} :{" "}
        <span className="font-bold text-blue-800">{name}</span>
      </h1>

      <TextAreaWidget
        label={t("scenes.customers.projects.reminder")}
        placeholder="Les besoins et exigences que vous nous avez remonté sont…"
        form={form}
        accessor="requirements"
      />
      <Widget className="p-4">
        <ProjectsChoiceFormFilling form={form} product={product} />
      </Widget>

      <Widget className="p-4">
        <CustomFeesWidget
          form={form}
          textAccessor="insurance"
          feesType="insurance"
          transfersAmount={form.watch("primaryContract.amount")}
        />
      </Widget>

      <Widget className="p-4 mb-4">
        <div className={"flex flex-row justify-center gap-10"}>
          <div className={"flex flex-row justify-center gap-2"}>
            <label>
              {t("scenes.customers.projects.addProject.insurance.risk.current")}
              {" :"}
            </label>
            <label className="text-blue-800 font-bold">
              {currentAverageSRI ?? "-"}
            </label>
          </div>
          <div className={"flex flex-row justify-center gap-2"}>
            <label>
              {t(
                "scenes.customers.projects.addProject.insurance.risk.tolerate"
              )}
              {" :"}
            </label>
            <label className="text-blue-800 font-bold">
              {sriTolerate ?? "-"}
            </label>
          </div>
        </div>
        <SupportWidget
          control={form.control}
          fees={form.watch("fees")}
          customFees={form.watch("customFees")}
          feesType="insurance"
          transfersAmount={form.watch("primaryContract.amount")}
          setTransfersAmount={(val) =>
            form.setValue("primaryContract.amount", val)
          }
          setRemainingAmount={(val) => setRemainingAmount(val)}
        />
      </Widget>
      <TextAreaWidget
        label={t("scenes.customers.projects.benefitsAndRisks")}
        form={form}
        placeholder="Les avantages de ce contrat sont..."
        accessor="benefitsAndRisks"
      />

      <div className="flex w-full justify-end align-end gap-4">
        <TextAreaWidget
          label={t("scenes.customers.projects.annotation")}
          form={form}
          accessor="annotation"
          placeholder="Notes..."
        />
        <Button
          label="scenes.customers.projects.submit"
          type="submit"
          className="self-end"
          isLoading={
            projectCreationMutation.isLoading || projectUpdateMutation.isLoading
          }
        />
      </div>
    </form>
  );
};
