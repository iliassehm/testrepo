import type { InvestorProfileFormInputs } from "@shared-schemas/investorProfileFormSchema";
import i18next, { t, type TFunction } from "i18next";
import { Checkbox } from "primereact/checkbox";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useMutation } from "react-query";

import { investorProfileScore } from "../../../../../../shared/utils/calculateInvestorProfile";
import { Button, Select as OldSelect } from "../../../../../components";
import { DonutPie } from "../../../../../components/DonutPie";
import { Text } from "../../../../../components/Text";
import { defaultNS } from "../../../../../constants/i18n";
import { clsx, formatDate } from "../../../../../helpers";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import {
  type Company,
  type Customer,
  Form as SchemaForm,
} from "../../../../../types";
import { Label } from "../../../../../UIComponents/Label/Label";
import Select from "../../../../../UIComponents/Select/Select";
import { CustomersConformityLogic } from "./conformity.logic";
import type { InvestmentFormDataType } from "./InvestorProfile";
import { useTranslatedStaticData } from "./investorProfileForm/contants";
import {
  InvestorProfileForm,
  investorProfileVersionList,
  type InvestorProfilVersion,
} from "./investorProfileForm/investorProfileForm";

interface InvestorProfileViewProps {
  investorProfileForm: InvestorProfileFormInputs;
  isLoading: boolean;
  investorProfile?: Customer["investorProfile"];
  companyId: Company["id"];
  customerId: Customer["id"];
  handleSyncBudget?: () => void;
  mutateInvestorProfileUpdate: (data: InvestmentFormDataType) => void;
  onInvestorProfileFormUpdate: (data: {
    input: InvestorProfileFormInputs;
    hideNotification?: boolean;
    scrollToTop?: boolean;
  }) => void;
}

type Tab = "graph" | "form";

export const InvestorProfileView = ({
  investorProfileForm,
  investorProfile,
  isLoading,
  customerId,
  companyId,
  handleSyncBudget,
  mutateInvestorProfileUpdate,
  onInvestorProfileFormUpdate,
}: InvestorProfileViewProps) => {
  const hasPreviousVersion = investorProfileForm?.q1 !== undefined;
  const hasNewVersion = investorProfileForm?.attitudeTowardsRisk !== undefined;
  const hasOnlyPreviousVersion = hasPreviousVersion && !hasNewVersion;
  const showPreviousVersion =
    investorProfileForm?.version !== "2" &&
    (hasOnlyPreviousVersion || investorProfileForm?.version === "1");
  const defaultVersion = showPreviousVersion
    ? investorProfileVersionList[0]
    : investorProfileVersionList[1];

  // States
  const [tab, setTab] = useState<Tab>("graph");
  const [version, setVersion] = useState<InvestorProfilVersion>(defaultVersion);

  // Effects
  useEffect(() => {
    const newDefaultVersion = showPreviousVersion
      ? investorProfileVersionList[0]
      : investorProfileVersionList[1];

    setVersion(newDefaultVersion);
  }, [showPreviousVersion]);

  // Hooks
  const toast = useToast();
  const { t } = useTranslation(defaultNS, {
    keyPrefix: "scenes.customers.conformity.investorProfile",
  });

  const currentVersion = investorProfileForm?.version;

  const sendInvestorProfileFormToCustomerMutation = useMutation(
    async () => {
      if (currentVersion !== version.value) {
        onInvestorProfileFormUpdate({
          input: {
            ...(investorProfileForm ?? {}),
            version: version.value,
          },
          hideNotification: true,
          scrollToTop: true,
        });
      }

      return gql.client.request(
        CustomersConformityLogic.requestCustomerToFillInvestorProfileForm(),
        {
          companyID: companyId,
          customerID: customerId,
          form: SchemaForm.ProfilInvest,
        }
      );
    },
    {
      onSuccess: () => {
        toast.current?.show({
          severity: "success",
          detail: i18next.t("forms.fields.notifications.success.send"),
        });
      },
    }
  );

  const sendPdfDocuSignMutation = useMutation(async () => {
    return gql.client.request(CustomersConformityLogic.sendToSign(), {
      companyID: companyId,
      customerID: customerId,
      form: SchemaForm.ProfilInvest,
    });
  });

  const isGraphTab = tab === "graph";

  let showSelector = true;
  const hasStartFilling = !!investorProfileForm?.updated;

  if (!hasPreviousVersion) {
    showSelector = false;
  }

  return (
    <div className="flex flex-col px-4">
      <div className="flex justify-between items-center">
        <div>
          {!!investorProfileForm?.updated && (
            <Trans
              i18nKey="forms.lastestUpdate"
              values={{
                date: formatDate(investorProfileForm.updated),
              }}
              components={{
                strong: <span className="text-blue-800 font-semibold" />,
              }}
            />
          )}
        </div>
        <div className="flex mb-3 gap-3 justify-end items-center text-right">
          <Button
            variant="bordered"
            size="small"
            className="py-1 rounded-md"
            label="forms.fields.conformity.investorProfile.sendToCustomer"
            disabled={sendInvestorProfileFormToCustomerMutation.isLoading}
            onClick={() => sendInvestorProfileFormToCustomerMutation.mutate()}
          />
          {hasStartFilling && (
            <Button
              variant="bordered"
              size="small"
              className="py-1 rounded-md"
              label="forms.fields.conformity.investorProfile.sendPdfDocuSign"
              disabled={sendPdfDocuSignMutation.isLoading}
              onClick={() => sendPdfDocuSignMutation.mutate()}
            />
          )}
          <OldSelect
            className="ml-auto w-fit"
            name="tab"
            options={[
              {
                label: "forms.fields.conformity.investorProfile.graphics",
                value: "graph",
              },
              {
                label: "forms.fields.conformity.investorProfile.question",
                value: "form",
              },
            ]}
            defaultValue={tab}
            onChange={(value) => setTab(value as Tab)}
          />
        </div>
      </div>

      <div>
        {isGraphTab ? (
          <GraphqView
            investorProfile={investorProfile}
            investorProfileForm={investorProfileForm}
            t={t}
            mutateInvestorProfileUpdate={mutateInvestorProfileUpdate}
            onInvestorProfileFormUpdate={onInvestorProfileFormUpdate}
          />
        ) : isLoading ? (
          ""
        ) : (
          <div className={!showSelector ? "pt-8 mt-4" : ""}>
            {showSelector && (
              <Select
                value={version}
                onChange={(e) => setVersion(e as InvestorProfilVersion)}
                options={investorProfileVersionList}
                className="w-fit mb-4"
              />
            )}
            <InvestorProfileForm
              version={version}
              defaultValue={investorProfileForm}
              onSubmit={onInvestorProfileFormUpdate}
              handleSyncBudget={handleSyncBudget}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface GraphqViewProps {
  investorProfileForm: InvestorProfileFormInputs;
  investorProfile?: Customer["investorProfile"];
  t: TFunction;
  mutateInvestorProfileUpdate: (data: InvestmentFormDataType) => void;
  onInvestorProfileFormUpdate: (data: {
    input: InvestorProfileFormInputs;
    hideNotification?: boolean;
    scrollToTop?: boolean;
  }) => void;
}

function GraphqView({
  investorProfile,
  investorProfileForm,
  mutateInvestorProfileUpdate,
  onInvestorProfileFormUpdate,
}: GraphqViewProps) {
  const {
    nonFinancialSensitivity,
    riskProfile,
    newRiskProfile,
    knowledgeAndExperience,
  } = useTranslatedStaticData();

  const isFirstVersion = investorProfileForm?.version === "1";
  const hasManualSri = investorProfileForm?.manualSri !== undefined;

  const {
    knowledgeAndExperienceResult,
    riskProfileResult,
    sustainableInvestmentResult,
  } = investorProfileScore(investorProfileForm);

  return (
    <div>
      <div className="mb-5 flex w-full justify-between gap-6">
        <div className="flex w-full flex-col gap-6 md:flex-row">
          <div className="w-1/2">
            <DonutPie
              className="mb-20"
              current={knowledgeAndExperienceResult}
              centeredText="scenes.customers.conformity.investorProfile.knowledge-and-experience"
              data={knowledgeAndExperience}
            />

            <SelectSri
              defaultValues={investorProfileForm}
              onSubmit={onInvestorProfileFormUpdate}
            />
          </div>
          <div className="w-1/2">
            <DonutPie
              className="mb-20"
              centeredText="scenes.customers.conformity.investorProfile.risk-profile"
              current={riskProfileResult}
              data={
                hasManualSri || !isFirstVersion ? newRiskProfile : riskProfile
              }
            />
            <DonutPie
              className="mb-20"
              centeredText="scenes.customers.conformity.investorProfile.non-financial-sensitivity"
              current={sustainableInvestmentResult}
              data={nonFinancialSensitivity}
            />
          </div>
        </div>
      </div>
      <Form
        onSubmit={mutateInvestorProfileUpdate}
        defaultValues={investorProfile}
      />
    </div>
  );
}

interface FormProps {
  onSubmit: (data: InvestmentFormDataType) => void;
  defaultValues?: InvestmentFormDataType;
  investorProfileIsLoading?: boolean;
  sri?: number;
}

function Form({ onSubmit, defaultValues }: FormProps) {
  const { handleSubmit, reset, control } = useForm<InvestmentFormDataType>({
    values: defaultValues,
  });
  const { t } = useTranslation();

  const handleConfirm = (data: InvestmentFormDataType) => {
    if (confirm(t("forms.fields.pleaseConfirm") as string)) onSubmit(data);
    else reset();
  };

  return (
    <form>
      <div className="mb-3 flex flex-col w-full justify-between">
        <div className="mb-4 flex items-center gap-x-3">
          <Controller
            name="contactDontAnswer"
            defaultValue={defaultValues?.contactDontAnswer}
            control={control}
            render={({ field }) => (
              <>
                <Checkbox
                  inputId={field.name}
                  checked={!!field.value}
                  inputRef={field.ref}
                  onChange={(e) => {
                    field.onChange(e.checked);
                    handleSubmit(handleConfirm)();
                  }}
                />
                <Label id={field.name}>
                  {t(
                    "forms.fields.conformity.investorProfile.contactDontAnswer"
                  )}
                </Label>
              </>
            )}
          />
        </div>
      </div>
    </form>
  );
}

interface SelectSriProps {
  onSubmit: (data: {
    input: InvestorProfileFormInputs;
    hideNotification?: boolean;
    scrollToTop?: boolean;
  }) => void;
  defaultValues?: InvestorProfileFormInputs;
}

function SelectSri({ defaultValues, onSubmit }: SelectSriProps) {
  const { handleSubmit, control, reset } = useForm<InvestorProfileFormInputs>({
    values: defaultValues,
  });

  const handleConfirm = (data: InvestorProfileFormInputs) => {
    if (
      confirm(t("forms.fields.conformity.investorProfile.manualSri") as string)
    )
      onSubmit({ input: data });
    else reset();
  };

  const hasSri = defaultValues?.finalSri !== undefined;

  return (
    <form>
      <div className="flex flex-col items-start justify-center mt-4">
        <div className="w-full text-center flex items-center justify-center relative">
          <div className="flex items-center">
            <Text
              className="flex h-full w-full"
              as="h3"
              label="scenes.customers.conformity.investorProfile.sri"
            />
            <i className="pi pi-pencil h-fit w-fit rounded-full p-2 text-blue-700 hover:bg-blue-50" />
          </div>
        </div>

        <div className="m-auto flex grid-cols-12 gap-2 py-2">
          <Controller
            name="manualSri"
            defaultValue={defaultValues?.manualSri}
            control={control}
            render={({ field }) => {
              const value = field.value ?? defaultValues?.finalSri;

              return (
                <>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div
                      key={`sri-${index + 1}`}
                      className={clsx(
                        "text-sm py-0 cursor-pointer rounded-full",
                        value === index + 1
                          ? "bg-blue-800 text-white"
                          : "bg-[#4761C84D]",
                        hasSri ? "px-5" : "px-4"
                      )}
                      onClick={() => {
                        field.onChange(index + 1);
                        handleSubmit(handleConfirm)();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSubmit(handleConfirm)();
                        }
                      }}
                    >
                      {index + 1}
                    </div>
                  ))}
                </>
              );
            }}
          />
        </div>
      </div>
    </form>
  );
}
