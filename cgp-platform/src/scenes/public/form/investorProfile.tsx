import { useEffect, useMemo, } from "react";
import i18next, { t } from "i18next";
import { Toast } from "primereact/toast";
import {  useSearch } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import { PublicForm } from "./form.logic";
import { gql } from "../../../service/client";
import { useToast } from "../../../hooks/useToast";
import { Loading, Text } from "../../../components";
import { config } from "../../../config/configuration";
import { publicCustomerInvestorProfileFormScene } from "./route";
import {
  InvestorProfileForm,
} from "../../private/company/customers/conformity/investorProfileForm/investorProfileForm";
import type { InvestorProfileFormInputs } from "../../../../shared/schemas/investorProfileFormSchema";
import {  Budget, Period, PublicCustomerWealthQuery } from "../../../types";
import { selectInvestorProfileData } from "../../private/company/customers/conformity/InvestorProfile";
import { AggregationEntitiesForms } from "../../../../shared/schemas/customerInfo";
import { usePublicCustomerWealth } from "../../../hooks/useCustomerWealth";

type ExistingFormData = {
  investorProfileForm: InvestorProfileFormInputs;
  budgetList: Budget[];
  customer: {
    id: string;
    informations: {general?: AggregationEntitiesForms["generalForm"],
    details?: AggregationEntitiesForms["detailsForm"]};
  };
  company: {
    id: string;
  };
};

export const PublicInvestorProfile = () => {
  // Hooks
  const toast = useToast();
  const queryClient = useQueryClient();

  const { token } = useSearch({
    from: publicCustomerInvestorProfileFormScene.id,
  });

  // Query
  const range = useMemo(
    () => ({
      min: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      max: new Date(),
    }),
    []
  );

  // Queries
  const wealthQuery = usePublicCustomerWealth({
    token,
    search: {
      period: Period.weekly,
      range: {
        min: range.min.getTime(),
        max: range.max.getTime(),
      },
    },
  });

  const queryKey = ["publicInvestorProfile", token];
  const { data, isLoading } = useQuery(queryKey, () =>
    gql.client.request(PublicForm.getPubliFormFilling(), {
      token,
    }),
    {
      select: (data) => {
        const existingFormData = (data?.existingFormData ?? {}) as ExistingFormData;

        const investorProfileForm = (existingFormData.investorProfileForm ??
          {}) as InvestorProfileFormInputs;
        const informations = (existingFormData.customer ?? {}) as {
          general?: AggregationEntitiesForms["generalForm"];
          details?: AggregationEntitiesForms["detailsForm"];
        };
        const budgetListData = (existingFormData.budgetList ?? []) as Budget[];

        const selectedData = selectInvestorProfileData({
          investorProfileForm,
          informations,
          budgetListData,
          wealthData: wealthQuery.data as PublicCustomerWealthQuery
        });

        return {
          ...selectedData,
          company: existingFormData.company,
          customer: existingFormData.customer,
        };
      },
    }
  );

  // Mutation

  const { mutate: onInvestorProfileFormSubmit, ...mutationRest } = useMutation(
    (data: {
      input: InvestorProfileFormInputs;
      isSyncingBudget?: boolean;
    }) =>
      gql.client.request(PublicForm.submitPubliFormFilling(), {
        token: token as string,
        input: data.input,
        isSyncing: data.isSyncingBudget,
      }),
    {
      onSuccess: (_, params) => {
        // Show toast
        toast.current?.show({
          severity: "success",
          detail: i18next.t("forms.fields.notifications.success.send"),
        });
        
        if (params.isSyncingBudget) {
          queryClient.invalidateQueries(queryKey);
          return; 
        }
        // Redirect to B2C
        const timeout = setTimeout(() => {
          confirmDialog({
            message: t("scenes.public.form.investorProfile.confirm.text"),
            acceptLabel: t("forms.confirm.ok") as string,
            rejectClassName: "hidden",
            icon: "pi pi-send",
            className: "max-w-[500px]",
            accept: () => {
              window.close();
            },
          });

          clearTimeout(timeout);
        }, 1000);
      },
    }
  );

  const investorProfileForm = data?.investorProfileForm;

  const handleSyncBudget = () => {
    onInvestorProfileFormSubmit({
      input: {
        ...investorProfileForm,
        financialSituation: { ...investorProfileForm?.budgetListData },
      } as InvestorProfileFormInputs,
      isSyncingBudget: true,
    });
  };

  const isSameToken = investorProfileForm?.token === token;

  useEffect(() => {
    if (isSameToken) {
      // redirect to B2C
      window.location.href = config.b2cAppUrl;

    }
  }, [isSameToken]);

  if (isLoading || isSameToken) {
    return <Loading />
  }

  return (
    <div className="flex flex-col gap-8 p-2 md:px-[10%]">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="flex flex-col gap-2">
        <Text
          as="h1"
          label="scenes.public.form.investorProfile.title"
          className="underline text-blue-800"
        />
        <Text
          as="h2"
          label="scenes.public.form.investorProfile.informations"
          className="underline"
        />
        <div className="mt-2">
          <Text
            as="h3"
            label="scenes.public.form.investorProfile.yourAdvisor"
            className="font-bold"
          />
          <Text
            label="scenes.public.form.investorProfile.yourAdvisorText"
            className="whitespace-pre-line"
          />
        </div>
        <div className="mt-2">
          <Text
            as="h3"
            label="scenes.public.form.investorProfile.rgpd"
            className="font-bold"
          />
          <Text
            label="scenes.public.form.investorProfile.rgpdText"
            className="whitespace-pre-line"
          />
        </div>
      </div>
      {!isLoading && (
        <InvestorProfileForm
          isLoading={mutationRest.isLoading}
          defaultValue={(investorProfileForm ?? {}) as InvestorProfileFormInputs}
          handleSyncBudget={handleSyncBudget}
          onSubmit={onInvestorProfileFormSubmit}
          disableAutoSubmit={true}
        />
      )}
    </div>
  );
};
