import { zodResolver } from "@hookform/resolvers/zod";
import { t, use } from "i18next";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import React, { type FC, useEffect, useState } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { contractCompanySchema } from "../../../../../../../shared/schemas/contractCompany";
import { insuranceFormSchema } from "../../../../../../../shared/schemas/project";
import { Button, Select } from "../../../../../../components";
import { Contract } from "../../../../../../types";
import {
  fundsOrigins,
  ProductCategory,
  projectProducts,
} from "../projectConstants";
import { useContractCompare } from "../useContractCompare";
import { useContractFilters } from "../useContractFilters";
import { InsuranceSubscriptionFormValues } from "./InsuranceSubscriptionForm";
import {
  SearchContractDialog,
  typeValuesToContract,
} from "./SearchContractDialog/SearchContractDialog";

export const scheduledPaymentList = [
  "yearly",
  "monthly",
  "quarterly",
  "biannual",
  "weekly",
];

export function getContractMetadata(contract: Contract) {
  const metadata = contract.metadata as z.infer<typeof contractCompanySchema>;

  return {
    id: Number.parseInt(contract.id),
    name: contract.name,
    type: contract.type,
    insuranceCompany: contract.insuranceCompany ?? "",
    accountUnits: metadata?.accountUnits ?? contract.accountUnits ?? 0,
    insurerSolvencyRatio: metadata?.insurerSolvencyRatio ?? 0,
    managedOptions: metadata?.managedOptions ?? contract.managedModes ?? [],
    performance: metadata?.performance ?? contract.performance ?? 0,
    fundsOrigin: metadata?.fundsOrigin ?? contract.fundsOrigin ?? "",
    annuityType: metadata?.annuityType ?? "",
    minTransferAmount:
      metadata?.minTransferAmount ?? contract.minTransferAmount ?? 0,
    minFreeTransferAmount: metadata?.minFreeTransferAmount ?? 0,
    minScheduledTransfersAmount: metadata?.minScheduledTransfersAmount ?? 0,
    minPartialRedemption: metadata?.minPartialRedemption ?? 0,
    transferFees: metadata?.transferFees ?? 0,
    prevoyanceGuarantee: metadata?.prevoyanceGuarantee ?? "",
    mortalityTable: metadata?.mortalityTable ?? "",
    anuityExitFees: metadata?.anuityExitFees ?? 0,

    fees: {
      managementEuroFunds: {
        totalPercentage:
          metadata?.fees?.managementEuroFunds?.totalPercentage ?? 0,
        contractPercentage:
          metadata?.fees?.managementEuroFunds?.contractPercentage ?? 0,
        companyPercentage:
          metadata?.fees?.managementEuroFunds?.companyPercentage ?? 0,
      },
      managementUC: {
        totalPercentage: metadata?.fees?.managementUC?.totalPercentage ?? 0,
        contractPercentage:
          metadata?.fees?.managementUC?.contractPercentage ?? 0,
        companyPercentage: metadata?.fees?.managementUC?.companyPercentage ?? 0,
      },
      opening: {
        totalPercentage: metadata?.fees?.opening?.totalPercentage ?? 0,
        contractPercentage: metadata?.fees?.opening?.contractPercentage ?? 0,
        companyPercentage: metadata?.fees?.opening?.companyPercentage ?? 0,
      },
      arbitration: {
        totalPercentage: metadata?.fees?.arbitration?.totalPercentage ?? 0,
        contractPercentage:
          metadata?.fees?.arbitration?.contractPercentage ?? 0,
        companyPercentage: metadata?.fees?.arbitration?.companyPercentage ?? 0,
      },
      exit: {
        totalPercentage: metadata?.fees?.exit?.totalPercentage ?? 0,
        contractPercentage: metadata?.fees?.exit?.contractPercentage ?? 0,
        companyPercentage: metadata?.fees?.exit?.companyPercentage ?? 0,
      },
      advice: {
        totalPercentage: metadata?.fees?.advice?.totalPercentage ?? 0,
        contractPercentage: metadata?.fees?.advice?.contractPercentage ?? 0,
        companyPercentage: metadata?.fees?.advice?.companyPercentage ?? 0,
      },
      surperformance: {
        totalPercentage: metadata?.fees?.surperformance?.totalPercentage ?? 0,
        contractPercentage:
          metadata?.fees?.surperformance?.contractPercentage ?? 0,
        companyPercentage:
          metadata?.fees?.surperformance?.companyPercentage ?? 0,
      },
    },
  };
}

type ProjectFormFillingProps = {
  form: UseFormReturn<InsuranceSubscriptionFormValues>;
  product?: string;
};

export const ProjectsChoiceFormFilling: FC<ProjectFormFillingProps> = ({
  form,
  product,
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"automatic" | "manual">("manual");

  const { data: contractFilters } = useContractFilters();

  useEffect(() => {
    if (mode === "automatic") {
      form.setValue("alternatives", []);
    }
  }, [mode]);

  const primaryContractInitialData = form.watch("primaryContract");
  const alternativesInitialData = form.watch("alternatives");
  const formFeesValues = form.watch("fees");

  const amount = form.watch("primaryContract.amount");

  function calculateFees(values: ProjectFormValues) {
    Object.keys(formFeesValues).forEach((feeKey) => {
      form.setValue(
        `fees.${feeKey as keyof typeof formFeesValues}.totalPercentage`,
        values?.fees?.[feeKey as keyof typeof formFeesValues]
          ?.totalPercentage ?? 0
      );
      form.setValue(
        `fees.${feeKey as keyof typeof formFeesValues}.contractPercentage`,
        values?.fees?.[feeKey as keyof typeof formFeesValues]
          ?.contractPercentage ?? 0
      );
      form.setValue(
        `fees.${feeKey as keyof typeof formFeesValues}.companyPercentage`,
        values?.fees?.[feeKey as keyof typeof formFeesValues]
          ?.companyPercentage ?? 0
      );

      form.setValue(
        `fees.${feeKey as keyof typeof formFeesValues}.totalAmount`,
        Math.round(
          (primaryContractInitialData.amount ?? 0) *
            (values?.fees?.[feeKey as keyof typeof formFeesValues]
              ?.totalPercentage ?? 0)
        ) / 100
      );
      form.setValue(
        `fees.${feeKey as keyof typeof formFeesValues}.contractAmount`,
        Math.round(
          (formFeesValues?.[feeKey as keyof typeof formFeesValues]
            ?.totalAmount ?? 1) *
            (values?.fees?.[feeKey as keyof typeof formFeesValues]
              ?.contractPercentage ?? 0)
        ) / 100
      );
      form.setValue(
        `fees.${feeKey as keyof typeof formFeesValues}.companyAmount`,
        Math.round(
          (formFeesValues?.[feeKey as keyof typeof formFeesValues]
            ?.totalAmount ?? 1) *
            (values?.fees?.[feeKey as keyof typeof formFeesValues]
              ?.companyPercentage ?? 0)
        ) / 100
      );
    });
  }

  const customFees = form.watch("customFees");
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

      const totalAmount =
        ((primaryContractInitialData.amount ?? 0) * totalPercentage) / 100;
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
          ((primaryContractInitialData.amount ?? 0) * totalPercentage) / 100;
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
  }, [amount]);

  const alternatives = form.getValues("alternatives");

  useEffect(() => {
    const amount = form.getValues("primaryContract.amount");
    if (form.getValues("alternatives").length >= 1) {
      form.setValue("alternatives.0.amount", amount ?? 0);
    }
  }, [alternatives[0]]);

  useEffect(() => {
    const amount = form.getValues("primaryContract.amount");
    if (form.getValues("alternatives").length >= 2) {
      form.setValue("alternatives.1.amount", amount ?? 0);
    }
  }, [alternatives[1]]);

  return (
    <div className="mb-4">
      <h1 className="text-[#4761C8] font-bold text-xl mb-4">
        {t("scenes.customers.projects.subscriptionTitle")}
      </h1>
      <div className="flex flex-row gap-2 absolute right-5 top-5">
        <Button
          label="Manuel"
          variant={mode === "manual" ? "basic" : "bordered"}
          onClick={(e) => {
            e.preventDefault();
            setMode("manual");
          }}
        />
        <Button
          label="Automatiquement"
          variant={mode === "automatic" ? "basic" : "bordered"}
          onClick={(e) => {
            e.preventDefault();
            setMode("automatic");
          }}
        />
      </div>
      <div className="flex flex-row flex-wrap md:divide-x-2 border-b w-full pb-4">
        <div className="flex flex-col md:pr-4 gap-y-4 pt-14">
          <div className="flex text-sm text-blue-1000 min-w-[144px] mb-6">
            {t("scenes.customers.projects.subscription.name")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px]">
            {t("scenes.customers.projects.subscription.type")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.insuranceCompany")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.accessCondition")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.performance")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.accountUnits")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.insurerSolvencyRatio")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.managedOptions")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.fundsOrigin")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.annuityType")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.minTransferAmount")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.minFreeTransferAmount")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t(
              "scenes.customers.projects.subscription.minScheduledTransfersAmount"
            )}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.minPartialRedemption")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.transferFees")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.prevoyanceGuarantee")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.mortalityTable")}
          </div>
          <div className="flex text-sm text-blue-1000 min-w-[144px] ">
            {t("scenes.customers.projects.subscription.anuityExitFees")}
          </div>
        </div>
        <div className="flex-1 md:pl-4">
          <ProjectChoice
            number={1}
            managedModes={
              (contractFilters?.contractFilters.managedModes as string[]) || []
            }
            initialData={primaryContractInitialData ?? []}
            contractsData={[
              primaryContractInitialData ?? [],
              alternativesInitialData?.[0] ?? [],
              alternativesInitialData?.[1] ?? [],
            ]}
            product={product}
            onChange={(values) => {
              form.setValue("primaryContract", {
                ...values,
                amount: form.watch("primaryContract.amount"),
              });

              calculateFees(values);
            }}
          />
        </div>
        <div className="flex-1 md:pl-4">
          <ProjectChoice
            number={2}
            managedModes={
              (contractFilters?.contractFilters.managedModes as string[]) || []
            }
            automatic={mode === "automatic"}
            initialData={alternativesInitialData?.[0] ?? []}
            contractsData={[
              primaryContractInitialData ?? [],
              alternativesInitialData?.[0] ?? [],
              alternativesInitialData?.[1] ?? [],
            ]}
            product={product}
            onChange={(values) => {
              form.setValue(`alternatives.0`, {
                ...values,
                amount: form.watch("alternatives.0.amount"),
              });
            }}
          />
        </div>
        <div className="flex-1 md:pl-4">
          <ProjectChoice
            number={3}
            managedModes={
              (contractFilters?.contractFilters.managedModes as string[]) || []
            }
            automatic={mode === "automatic"}
            initialData={alternativesInitialData?.[1] ?? []}
            contractsData={[
              primaryContractInitialData ?? [],
              alternativesInitialData?.[0] ?? [],
              alternativesInitialData?.[1] ?? [],
            ]}
            product={product}
            onChange={(values) => {
              form.setValue(`alternatives.1`, {
                ...values,
                amount: form.watch("alternatives.1.amount"),
              });
            }}
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center w-full">
        <Controller
          name="primaryContract.amount"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center mt-4">
              <label
                htmlFor={field.name}
                className="font-bold text-m text-blue-1000 min-w-[144px] w-1/2"
              >
                {t("scenes.customers.projects.subscription.amount")}
              </label>
              <InputNumber
                id={"primaryContract.amount"}
                value={field.value}
                type="currency"
                currency={"EUR"}
                locale="fr-FR"
                minFractionDigits={2}
                onChange={(e) => {
                  field.onChange(e.value);
                  if (form.getValues("alternatives").length >= 1) {
                    form.setValue("alternatives.0.amount", e.value ?? 0);
                  }
                  if (form.getValues("alternatives").length >= 2) {
                    form.setValue("alternatives.1.amount", e.value ?? 0);
                  }
                }}
                className="border bg-slate-50 h-7 text-sm bg-gray-100/50 w-full"
                inputClassName="text-right"
                placeholder="0,00"
              />
              <a className="text-xs text-[#4761C8] ml-4">€</a>
            </div>
          )}
        />
      </div>

      <div className="flex flex-row flex-wrap justify-center w-full mt-8">
        <Controller
          name="primaryContract.scheduledPaymentList"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center mr-4">
              <label className="font-bold text-m text-blue-1000 min-w-[192px] w-1/4">
                {t(
                  "scenes.customers.projects.subscription.scheduledPayment.label"
                )}
              </label>
              <Select
                name={"primaryContract.scheduledPaymentList"}
                register={form.register}
                defaultValue={field.value ?? scheduledPaymentList[0]}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50 py-0"
                options={scheduledPaymentList.map((val) => ({
                  label: t(`forms.fields.cycles.${val}`),
                  value: val,
                }))}
              />
            </div>
          )}
        />
        <Controller
          name="primaryContract.scheduledPayment"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <label className="font-bold text-m text-blue-1000 min-w-[16px] w-1/4">
                {t(
                  "scenes.customers.projects.subscription.scheduledPayment.preLabel"
                )}
              </label>
              <InputNumber
                id={"primaryContract.scheduledPayment"}
                value={field.value}
                type="currency"
                currency={"EUR"}
                locale="fr-FR"
                minFractionDigits={2}
                onChange={(e) => {
                  field.onChange(e.value);
                  if (form.getValues("alternatives").length >= 1) {
                    form.setValue(
                      "alternatives.0.scheduledPayment",
                      e.value ?? 0
                    );
                  }
                }}
                className="border bg-slate-50 h-7 text-sm bg-gray-100/50 w-full"
                inputClassName="text-right"
                placeholder="0,00"
              />
              <a className="text-xs text-[#4761C8] ml-4">€</a>
            </div>
          )}
        />
      </div>
    </div>
  );
};

type ProjectFormValues = z.infer<typeof insuranceFormSchema>;

const typeValues: { [key: string]: string } = {
  PERCO: "perco",
  PEP: "pepLifeInsurance",
  Madelin: "madelinContract",
  Capitalisation: "capitalizationContract",
  "Assurance Vie": "lifeInsuranceContract",
  // PERP:
  // "Plan Epargne Retraite":
  // "PEA-PME":
  // PEA:
  // "Compte-Titre":

  // : "article83Contract"
  // : "per"
  // : "pee"
};

interface ProjectChoiceProps {
  number: number;
  managedModes: string[];
  // form: UseFormReturn<InsuranceSubscriptionFormValues>;
  initialData?: Omit<ProjectFormValues, "amount">;
  contractsData: ProjectFormValues[];
  onChange?: (values: ProjectFormValues) => void;
  automatic?: boolean;
  product?: string;
}
const ProjectChoice: React.FC<ProjectChoiceProps> = ({
  number,
  managedModes,
  // form,
  initialData,
  contractsData,
  onChange,
  automatic = false,
  product,
}) => {
  const { t } = useTranslation();
  const form = useForm<ProjectFormValues>({
    defaultValues: {
      name: "",
      type: product,
      insuranceCompany: "",
      accessCondition: (initialData?.performance ?? 0) > 0,
      managedOptions: [],
      fundsOrigin: "",
      insurerSolvencyRatio: 0,
      annuityType: "",
      prevoyanceGuarantee: "",
      mortalityTable: "",
      minPartialRedemption: 0,
      ...initialData,
    },
    resolver: zodResolver(insuranceFormSchema),
    // mode: "onChange",
  });
  const [searchContractDialogVisible, setSearchContractDialogVisible] =
    useState(false);
  const [autoVisible, setAutoVisible] = useState(false);
  const [contractAutoFilled, setContractAutoFilled] = useState(false);

  const compareContractMutation = useContractCompare({
    onSuccess: (data) => {
      if (data?.automaticContractCompare?.name)
        form.setValue("name", data.automaticContractCompare.name);
      if (data?.automaticContractCompare?.type) {
        const type = typeValues[data.automaticContractCompare.type];
        form.setValue("type", type ?? "otherLifeInsurance");
      }
      if (data?.automaticContractCompare?.insuranceCompany)
        form.setValue(
          "insuranceCompany",
          data.automaticContractCompare.insuranceCompany
        );
      if (data?.automaticContractCompare?.accountUnits)
        form.setValue(
          "accountUnits",
          data.automaticContractCompare.accountUnits
        );
      if (data?.automaticContractCompare?.managedModes)
        form.setValue(
          "managedOptions",
          data.automaticContractCompare.managedModes
        );
      if (data?.automaticContractCompare?.performance) {
        form.setValue("performance", data.automaticContractCompare.performance);
        form.setValue(
          "accessCondition",
          data.automaticContractCompare.performance > 0
        );
      }
      if (data?.automaticContractCompare?.fundsOrigin) {
        form.setValue("fundsOrigin", data.automaticContractCompare.fundsOrigin);
      }
      if (data?.automaticContractCompare?.minTransferAmount)
        form.setValue(
          "minTransferAmount",
          data.automaticContractCompare.minTransferAmount
        );
      if (data?.automaticContractCompare?.id) {
        form.setValue(
          "id",
          (contractsData[number - 1].id = Number.parseInt(
            data?.automaticContractCompare?.id
          ))
        );
      }
      setAutoVisible(true);
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => onChange?.(value as any));
    return () => subscription.unsubscribe();
  }, [form.watch, onChange]);

  useEffect(() => {
    if (autoVisible && !automatic) {
      setAutoVisible(false);
      form.setValue("name", "");
      form.setValue("type", "");
      form.setValue("insuranceCompany", "");
      form.setValue("accountUnits", 0);
      form.setValue("managedOptions", []);
      form.setValue("performance", 0);
      form.setValue("fundsOrigin", "");
      form.setValue("minTransferAmount", 0);
      form.setValue("accessCondition", false);
    }
  }, [autoVisible, automatic]);

  const { data: contractFilters } = useContractFilters();

  if (automatic && !autoVisible) {
    return (
      <div className="flex flex-col">
        <span className="text-[#4761C8] font-bold mb-4">Choix {number}</span>
        <Button
          label={t("scenes.customers.projects.addProject.autoCompare")}
          className=""
          onClick={(e) => {
            e.preventDefault();
            compareContractMutation.mutate({
              input: {
                type: typeValuesToContract[contractsData[0].type] ?? "other",
                mainContractID: contractsData[0].id,
                secondaryContractID:
                  number === 2 ? contractsData[2].id : contractsData[1].id,
              },
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-[#4761C8] font-bold mb-3">Choix {number}</span>
      <div className="flex flex-col gap-2">
        <SearchContractDialog
          visible={searchContractDialogVisible}
          setVisible={setSearchContractDialogVisible}
          type={product}
          onSelectContract={(contract) => {
            setContractAutoFilled(true);

            const metadata = getContractMetadata(contract);

            form.reset({
              accessCondition: metadata?.performance
                ? metadata.performance > 0
                : false,
              amount: 0,
              ...metadata,
              type: typeValues[contract.type] ?? "otherLifeInsurance",
            });
          }}
        />
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => (
            <div className="flex flex-col mb-6">
              {!automatic && (
                <button
                  className="text-xs text-[#4761C8] ml-3 cursor-pointer mr-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchContractDialogVisible(true);
                  }}
                >
                  {t("scenes.customers.projects.searchContract.title")}
                </button>
              )}
              <InputText
                id={"name"}
                ref={field.ref}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.currentTarget.value)}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50"
                placeholder={contractAutoFilled ? "N/A" : "eg. PERP"}
              />
            </div>
          )}
        />

        <Controller
          name="type"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <Select
                name={"type"}
                register={form.register}
                defaultValue={field.value}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50 py-0"
                placeholder={contractAutoFilled ? "N/C" : undefined}
                options={
                  projectProducts
                    .filter((v) => v.category === ProductCategory.LifeInsurance)
                    .map((val) => ({
                      label: t("scenes.customers.projects.products." + val.id),
                      value: val.id,
                    })) ?? []
                }
              />
            </div>
          )}
        />

        <Controller
          name="insuranceCompany"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <Select
                name={"insuranceCompany"}
                register={form.register}
                defaultValue={undefined}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50 py-0"
                placeholder={contractAutoFilled ? "N/C" : undefined}
                options={
                  contractFilters?.contractFilters.insuranceCompanies?.map(
                    (val) => ({
                      label: val as string,
                      value: val as string,
                    })
                  ) ?? []
                }
              />
            </div>
          )}
        />

        <Controller
          name="accessCondition"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              {/* <InputNumber
                id={"accessCondition"}
                value={field.value}
                type="percent"
                locale="fr-FR"
                minFractionDigits={2}
                onChange={(e) => field.onChange(e.value)}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50"
                inputClassName="text-right"
                placeholder="0,00"
              /> */}
              <span className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50 flex items-center justify-end p-inputtext">
                {field.value ? t("forms.fields.yes") : t("forms.fields.no")}
              </span>
            </div>
          )}
        />

        <Controller
          name="performance"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <InputNumber
                id={"performance"}
                value={field.value}
                type="percent"
                locale="fr-FR"
                minFractionDigits={2}
                onChange={(e) => {
                  field.onChange(e.value);
                  if (e.value === null) {
                    form.setValue("accessCondition", false);
                    return;
                  }
                  form.setValue("accessCondition", e.value > 0);
                }}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50"
                inputClassName="text-right"
                placeholder={contractAutoFilled ? "N/C" : undefined}
              />
              <a className="text-xs text-[#4761C8] ml-4">%</a>
            </div>
          )}
        />

        <Controller
          name="accountUnits"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <InputNumber
                id={"accountUnits"}
                value={field.value}
                minFractionDigits={0}
                onChange={(e) => field.onChange(e.value)}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50"
                inputClassName="text-right"
                placeholder={contractAutoFilled ? "N/C" : undefined}
                locale="fr-FR"
              />
            </div>
          )}
        />

        <Controller
          name="insurerSolvencyRatio"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <InputNumber
                id={"insurerSolvencyRatio"}
                value={field.value}
                type="percent"
                locale="fr-FR"
                minFractionDigits={2}
                onChange={(e) => {
                  field.onChange(e.value);
                  if (e.value === null) {
                    form.setValue("accessCondition", false);
                    return;
                  }
                  form.setValue("accessCondition", e.value > 0);
                }}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50"
                inputClassName="text-right"
                placeholder={contractAutoFilled ? "N/C" : undefined}
              />
              <a className="text-xs text-[#4761C8] ml-4">%</a>
            </div>
          )}
        />

        <Controller
          name="managedOptions"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <MultiSelect
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50 py-0 flex justify-center [&_.p-multiselect-label-container]:flex [&_.p-multiselect-label-container]:items-center [&_.p-multiselect-label]:!py-0"
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                placeholder={contractAutoFilled ? "N/C" : undefined}
                optionLabel="name"
                optionValue="value"
                options={managedModes.map((mode) => ({
                  name: t(`scenes.customers.projects.managedOptions.${mode}`),
                  value: mode,
                }))}
              />
            </div>
          )}
        />

        <Controller
          name="fundsOrigin"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <Select
                name={"fundsOrigin"}
                onChange={(e) => field.onChange(e)}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50 py-0"
                placeholder={t(
                  "scenes.customers.projects.subscription.fundsOrigin"
                )}
                defaultValue=""
                options={
                  // contractFilters?.contractFilters.fundsOrigins?.map((val) => ({
                  //   label: val as string,
                  //   value: val as string,
                  // })) ?? []
                  fundsOrigins.map((val) => ({
                    label: t(`scenes.customers.projects.fundsOrigins.${val}`),
                    value: val,
                  }))
                }
              />
            </div>
          )}
        />

        <Controller
          name="annuityType"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <InputText
                id={"annuityType"}
                value={field.value}
                placeholder={contractAutoFilled ? "N/C" : undefined}
                onChange={(e) => field.onChange(e.currentTarget.value)}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50"
              />
            </div>
          )}
        />

        <Controller
          name="minTransferAmount"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <InputNumber
                id={"minTransferAmount"}
                value={field.value}
                minFractionDigits={2}
                onChange={(e) => field.onChange(e.value)}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50"
                inputClassName="text-right"
                placeholder={contractAutoFilled ? "N/C" : undefined}
                type="currency"
                currency={"EUR"}
                locale="fr-FR"
              />
              <a className="text-xs text-[#4761C8] ml-4">€</a>
            </div>
          )}
        />

        <Controller
          name="minFreeTransferAmount"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <InputNumber
                id={"minFreeTransferAmount"}
                value={field.value}
                minFractionDigits={2}
                onChange={(e) => field.onChange(e.value)}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50"
                inputClassName="text-right"
                placeholder={contractAutoFilled ? "N/C" : undefined}
                currency={"EUR"}
                locale="fr-FR"
              />
              <a className="text-xs text-[#4761C8] ml-4">€</a>
            </div>
          )}
        />

        <Controller
          name="minScheduledTransfersAmount"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <InputNumber
                id={"minScheduledTransfersAmount"}
                value={field.value}
                minFractionDigits={2}
                onChange={(e) => field.onChange(e.value)}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50"
                inputClassName="text-right"
                placeholder={contractAutoFilled ? "N/C" : undefined}
                currency={"EUR"}
                locale="fr-FR"
              />
              <a className="text-xs text-[#4761C8] ml-4">€</a>
            </div>
          )}
        />

        <Controller
          name="minPartialRedemption"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <InputNumber
                id={"minPartialRedemption"}
                value={field.value}
                type="percent"
                locale="fr-FR"
                minFractionDigits={2}
                onChange={(e) => {
                  field.onChange(e.value);
                  if (e.value === null) {
                    form.setValue("accessCondition", false);
                    return;
                  }
                  form.setValue("accessCondition", e.value > 0);
                }}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50"
                inputClassName="text-right"
                placeholder={contractAutoFilled ? "N/C" : undefined}
              />
              <a className="text-xs text-[#4761C8] ml-4">%</a>
            </div>
          )}
        />

        <Controller
          name="transferFees"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <InputNumber
                id={"transferFees"}
                value={field.value}
                minFractionDigits={2}
                onChange={(e) => field.onChange(e.value)}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50"
                inputClassName="text-right"
                type="percent"
                placeholder={contractAutoFilled ? "N/C" : undefined}
                locale="fr-FR"
              />
              <a className="text-xs text-[#4761C8] ml-4">%</a>
            </div>
          )}
        />

        <Controller
          name="prevoyanceGuarantee"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <InputText
                id={"prevoyanceGuarantee"}
                value={field.value}
                placeholder={contractAutoFilled ? "N/C" : undefined}
                onChange={(e) => field.onChange(e.currentTarget.value)}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50"
              />
            </div>
          )}
        />

        <Controller
          name="mortalityTable"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <InputText
                id={"mortalityTable"}
                value={field.value}
                placeholder={contractAutoFilled ? "N/C" : undefined}
                onChange={(e) => field.onChange(e.currentTarget.value)}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50"
              />
            </div>
          )}
        />

        <Controller
          name="anuityExitFees"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center">
              <InputNumber
                id={"anuityExitFees"}
                value={field.value}
                minFractionDigits={2}
                onChange={(e) => field.onChange(e.value)}
                className="border bg-slate-50 h-7 w-48 text-sm bg-gray-100/50"
                inputClassName="text-right"
                type="percent"
                placeholder={contractAutoFilled ? "N/C" : undefined}
                locale="fr-FR"
              />
              <a className="text-xs text-[#4761C8] ml-4">%</a>
            </div>
          )}
        />
      </div>
    </div>
  );
};
