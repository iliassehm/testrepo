import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import { isNotEmpty } from "../../../../../../helpers";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { Form as SchemaForm } from "../../../../../../types";
import { CustomersConformityLogic } from "../conformity.logic";
import { GoalsForm, ObjectivesFormDataType } from "./form";

export const Objectives = () => {
  // Hooks
  const { t } = useTranslation();
  const toast = useToast();
  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  });

  // Queries
  const { data, isLoading } = useQuery(
    ["customerConformityObjectives", companyId, customerId],
    () =>
      gql.client.request(
        CustomersConformityLogic.customerConformityObjectives(),
        {
          companyID: companyId as string,
          customerID: customerId as string,
        }
      )
  );

  // Mutations
  const {
    mutate: updateConformityObjectives,
    isLoading: isUpdateConformityLoading,
  } = useMutation(
    (data: ObjectivesFormDataType) => {
      const input = Object.keys(data)
        .filter((key) => isNotEmpty(data[key]))
        .reduce(
          (obj, key) => ({
            ...obj,
            [key]: data[key],
          }),
          {}
        );

      return gql.client.request(
        CustomersConformityLogic.CustomerConformityObjectivesUpdate(),
        {
          companyID: companyId as string,
          customerID: customerId as string,
          input,
        }
      );
    },
    {
      onSuccess: () => {
        toast?.current?.show({
          severity: "success",
          summary: "Success",
          detail: t("forms.fields.notifications.success.save"),
        });
      },
    }
  );

  const {
    mutate: sendGoalsFormToCustomer,
    isLoading: isSendGoalsFormToCustomerLoading,
  } = useMutation(
    () =>
      gql.client.request(
        CustomersConformityLogic.requestCustomerToFillInvestorProfileForm(),
        {
          companyID: companyId,
          customerID: customerId,
          form: SchemaForm.Goals,
        }
      ),
    {
      onSuccess: () => {
        toast.current?.show({
          severity: "success",
          detail: t("forms.fields.notifications.success.send"),
        });
      },
    }
  );

  return (
    <GoalsForm
      defaultValues={data?.customer?.conformityObjectives}
      isLoading={isLoading}
      isUpdateConformityLoading={isUpdateConformityLoading}
      isSendGoalsFormToCustomerLoading={isSendGoalsFormToCustomerLoading}
      onSubmit={updateConformityObjectives}
      sendGoalsFormToCustomer={sendGoalsFormToCustomer}
    />
  );
};
