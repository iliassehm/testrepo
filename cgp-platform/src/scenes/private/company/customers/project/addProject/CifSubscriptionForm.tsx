import { zodResolver } from "@hookform/resolvers/zod";
import { cifSubscription } from "@shared-schemas/project";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { t } from "i18next";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button } from "../../../../../../components";
import { Widget } from "../../../../../../components/Widget";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import { ProjectType } from "../../../../../../types";
import { useProjectCreation } from "../useProjectCreation";
import { useProjectUpdate } from "../useProjectUpdate";
import { EvolutionFeesWidget } from "../widgets/EvolutionWidget";
import { SubscriptionCifFeesWidget } from "../widgets/SubscriptionCifFeesWidget";
import { SupportWidget } from "../widgets/SupportWidget";
import { TextAreaWidget } from "../widgets/TextAreaWidget";
import { ProjectFormFilling } from "./ProjectFormFilling";

export type CifSubscriptionFormValues = z.infer<typeof cifSubscription>;

interface CifSubscriptionFormProps {
  name: string;
  isUpdate?: boolean;
  product?: string;
  initialData?: Partial<CifSubscriptionFormValues>;
  sriTolerate?: number;
}

export const detentionType = [
  {
    label: t(
      "scenes.customers.projects.addProject.cif.detentionType.fullProperty"
    ),
    value: "fullProperty",
  },
  {
    label: t("scenes.customers.projects.addProject.cif.detentionType.property"),
    value: "property",
  },
  {
    label: t("scenes.customers.projects.addProject.cif.detentionType.usufruct"),
    value: "usufruct",
  },
];

export const scheduledPaymentList = [
  { label: t("forms.fields.cycles.yearly"), value: "yearly" },
  { label: t("forms.fields.cycles.monthly"), value: "monthly" },
  { label: t("forms.fields.cycles.quarterly"), value: "quarterly" },
  { label: t("forms.fields.cycles.biannual"), value: "biannual" },
  { label: t("forms.fields.cycles.weekly"), value: "weekly" },
];

export const CifSubscriptionForm: React.FC<CifSubscriptionFormProps> = ({
  name,
  isUpdate = false,
  product,
  initialData,
  sriTolerate,
}) => {
  const currentRoute = useCurrentRoute();
  const form = useForm<CifSubscriptionFormValues>({
    resolver: zodResolver(cifSubscription),
    defaultValues: {
      ...initialData,
      product,
      fees: {
        services: {
          opening: {
            amount: initialData?.fees?.services?.opening?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.services?.opening?.exanteAmount ?? 0,
            percentage: initialData?.fees?.services?.opening?.percentage ?? 0,
          },
          arbitration: {
            amount: initialData?.fees?.services?.arbitration?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.services?.arbitration?.exanteAmount ?? 0,
            percentage:
              initialData?.fees?.services?.arbitration?.percentage ?? 0,
          },
          transfer: {
            amount: initialData?.fees?.services?.transfer?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.services?.transfer?.exanteAmount ?? 0,
            percentage: initialData?.fees?.services?.transfer?.percentage ?? 0,
          },
          closing: {
            amount: initialData?.fees?.services?.closing?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.services?.closing?.exanteAmount ?? 0,
            percentage: initialData?.fees?.services?.closing?.percentage ?? 0,
          },
          advice: {
            amount: initialData?.fees?.services?.advice?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.services?.advice?.exanteAmount ?? 0,
            percentage: initialData?.fees?.services?.advice?.percentage ?? 0,
          },
          followingAdvice: {
            amount: initialData?.fees?.services?.followingAdvice?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.services?.followingAdvice?.exanteAmount ?? 0,
            percentage:
              initialData?.fees?.services?.followingAdvice?.percentage ?? 0,
          },
          brokerage: {
            amount: initialData?.fees?.services?.brokerage?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.services?.brokerage?.exanteAmount ?? 0,
            percentage: initialData?.fees?.services?.brokerage?.percentage ?? 0,
          },
          exchange: {
            amount: initialData?.fees?.services?.exchange?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.services?.exchange?.exanteAmount ?? 0,
            percentage: initialData?.fees?.services?.exchange?.percentage ?? 0,
          },
          custodialRight: {
            amount: initialData?.fees?.services?.custodialRight?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.services?.custodialRight?.exanteAmount ?? 0,
            percentage:
              initialData?.fees?.services?.custodialRight?.percentage ?? 0,
          },
          accountManagement: {
            amount: initialData?.fees?.services?.accountManagement?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.services?.accountManagement?.exanteAmount ?? 0,
            percentage:
              initialData?.fees?.services?.accountManagement?.percentage ?? 0,
          },
          inactivity: {
            amount: initialData?.fees?.services?.inactivity?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.services?.inactivity?.exanteAmount ?? 0,
            percentage:
              initialData?.fees?.services?.inactivity?.percentage ?? 0,
          },
          managementAssignments: {
            amount:
              initialData?.fees?.services?.managementAssignments?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.services?.managementAssignments
                ?.exanteAmount ?? 0,
            percentage:
              initialData?.fees?.services?.managementAssignments?.percentage ??
              0,
          },
        },
        tiers: {
          opening: {
            amount: initialData?.fees?.tiers?.opening?.amount ?? 0,
            exanteAmount: initialData?.fees?.tiers?.opening?.exanteAmount ?? 0,
            percentage: initialData?.fees?.tiers?.opening?.percentage ?? 0,
          },
          arbitration: {
            amount: initialData?.fees?.tiers?.arbitration?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.tiers?.arbitration?.exanteAmount ?? 0,
            percentage: initialData?.fees?.tiers?.arbitration?.percentage ?? 0,
          },
          transfer: {
            amount: initialData?.fees?.tiers?.transfer?.amount ?? 0,
            exanteAmount: initialData?.fees?.tiers?.transfer?.exanteAmount ?? 0,
            percentage: initialData?.fees?.tiers?.transfer?.percentage ?? 0,
          },
          custodialRight: {
            amount: initialData?.fees?.tiers?.custodialRight?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.tiers?.custodialRight?.exanteAmount ?? 0,
            percentage:
              initialData?.fees?.tiers?.custodialRight?.percentage ?? 0,
          },
          accountManagement: {
            amount: initialData?.fees?.tiers?.accountManagement?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.tiers?.accountManagement?.exanteAmount ?? 0,
            percentage:
              initialData?.fees?.tiers?.accountManagement?.percentage ?? 0,
          },
          managementAssignments: {
            amount:
              initialData?.fees?.tiers?.managementAssignments?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.tiers?.managementAssignments?.exanteAmount ??
              0,
            percentage:
              initialData?.fees?.tiers?.managementAssignments?.percentage ?? 0,
          },
        },
        products: {
          enterRight: {
            amount: initialData?.fees?.products?.enterRight?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.products?.enterRight?.exanteAmount ?? 0,
            percentage:
              initialData?.fees?.products?.enterRight?.percentage ?? 0,
          },
          gestion: {
            amount: initialData?.fees?.products?.gestion?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.products?.gestion?.exanteAmount ?? 0,
            percentage: initialData?.fees?.products?.gestion?.percentage ?? 0,
          },
          surperformance: {
            amount: initialData?.fees?.products?.surperformance?.amount ?? 0,
            exanteAmount:
              initialData?.fees?.products?.surperformance?.exanteAmount ?? 0,
            percentage:
              initialData?.fees?.products?.surperformance?.percentage ?? 0,
          },
        },
        customFees: initialData?.fees?.customFees ?? [],

        enterFeesAmount: initialData?.fees?.enterFeesAmount ?? 0,
        variableFeesAmount: initialData?.fees?.variableFeesAmount ?? 0,
        enterPercent: initialData?.fees?.enterPercent ?? 0,
        variablePercent: initialData?.fees?.variablePercent ?? 0,
        totalValue:
          initialData?.fees?.totalValue ??
          (initialData?.fees?.enterFeesAmount ?? 0) +
            (initialData?.fees?.variableFeesAmount ?? 0),
        totalPercentage:
          initialData?.fees?.totalPercentage ??
          Math.round(
            ((initialData?.fees?.enterPercent ?? 0) +
              (initialData?.fees?.variablePercent ?? 0)) *
              100
          ) / 100,
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

      date: initialData?.date ? new Date(initialData.date) : undefined,
      amount: initialData?.amount ?? 0,
      exanteAmount: initialData?.exanteAmount ?? 0,
      scheduledPaymentList:
        initialData?.scheduledPaymentList ?? scheduledPaymentList[0].value,
      scheduledPayment: initialData?.scheduledPayment ?? 0,
      detentionType: initialData?.detentionType ?? detentionType[0].value,
      detention: initialData?.detention ?? 100,
      sri: initialData?.sri,
    },
  });
  const { t } = useTranslation();
  const navigate = useNavigate({
    from: currentRoute.routeId,
  });
  const params = useParams({
    from: currentRoute.routeId,
  }) as { companyId: string; customerId: string; projectID: string };
  const search = useSearch({
    from: currentRoute.routeId,
  }) as { type: string };
  const [remainingAmount, setRemainingAmount] = React.useState(0);

  const projectCreationMutation = useProjectCreation("SubscriptionCif", {
    onSuccess: () => {
      navigate({
        to: "/company/$companyId/customer/$customerId/projects/",
        params: {
          companyId: params.companyId as string,
          customerId: params.customerId as string,
        },
        search: {
          ...search,
          type: ProjectType.SubscriptionCif,
        },
      });
    },
  });

  const projectUpdateMutation = useProjectUpdate("SubscriptionCif", {
    onSuccess: () => {
      navigate({
        to: "/company/$companyId/customer/$customerId/projects/",
        params: {
          companyId: params.companyId as string,
          customerId: params.customerId as string,
        },
        search: {
          ...search,
          type: ProjectType.SubscriptionCif,
        },
      });
    },
  });

  const onSubmit: SubmitHandler<CifSubscriptionFormValues> = (
    data: CifSubscriptionFormValues
  ) => {
    if (isUpdate) {
      projectUpdateMutation.mutate({
        id: params.projectID as string,
        metadata: {
          ...data,
        },
      });
    } else {
      projectCreationMutation.mutate({
        companyID: params.companyId as string,
        customerID: params.customerId as string,
        name,
        metadata: {
          ...data,
          product: product ?? "",
        },
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
        placeholder={t("scenes.customers.projects.benefitsAndRisksPlaceholder")}
        form={form}
        accessor="requirements"
      />

      <Widget className="p-4">
        <ProjectFormFilling form={form} />
      </Widget>

      <Widget className="p-4">
        <SubscriptionCifFeesWidget
          form={form}
          transfersAmount={form.watch("amount")}
        />
      </Widget>

      <Widget className="p-4">
        <div className={"flex flex-row justify-center gap-10"}>
          <div className={"flex flex-row justify-center gap-2"}>
            <label>
              {t("scenes.customers.projects.addProject.cif.risk.current")}
              {" :"}
            </label>
            <label className="text-blue-800 font-bold">
              {currentAverageSRI ?? "-"}
            </label>
          </div>
          <div className={"flex flex-row justify-center gap-2"}>
            <label>
              {t("scenes.customers.projects.addProject.cif.risk.tolerate")}
              {" :"}
            </label>
            <label className="text-blue-800 font-bold">
              {sriTolerate ?? "-"}
            </label>
          </div>
        </div>
        <SupportWidget
          control={form.control}
          transfersAmount={form.watch("amount")}
          fees={form.watch("fees")}
          feesType="cif"
          setTransfersAmount={(val) => form.setValue("amount", val)}
          setRemainingAmount={(val) => setRemainingAmount(val)}
        />
      </Widget>

      <Widget className="p-4">
        <EvolutionFeesWidget form={form} />
      </Widget>

      <TextAreaWidget
        label={t("scenes.customers.projects.benefitsAndRisks")}
        form={form}
        accessor="benefitsAndRisks"
        placeholder="Les avantages de ce contrat sont…"
      />
      <div className="flex w-full justify-end align-end gap-4">
        <TextAreaWidget
          form={form}
          accessor="annotation"
          label={t("scenes.customers.projects.annotation")}
          placeholder="Note..."
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
