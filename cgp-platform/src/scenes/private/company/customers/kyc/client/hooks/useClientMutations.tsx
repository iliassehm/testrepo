import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import { useToast } from "../../../../../../../hooks/useToast";
import { gql } from "../../../../../../../service/client";
import { CompanyCustomersInformationsLogic } from "../../../informations/informations.logic";
import { PersonalInfoFormData } from "../types";

export function useClientMutations(
  companyId: string,
  customerId: string,
  refetchCustomerInfoData?: () => void
) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  const updateGeneralInformations = useMutation(
    (data: PersonalInfoFormData) => {
      return gql.client.request(
        CompanyCustomersInformationsLogic.updateCustomerInformationsGeneral(),
        {
          companyID: companyId,
          customerID: customerId,
          input: data,
        }
      );
    },
    {
      onSuccess: (_, data) => {
        queryClient.invalidateQueries([
          "companyCustomersInformations",
          customerId,
        ]);
        queryClient.invalidateQueries([
          "layout_customer",
          companyId,
          customerId,
        ]);
        queryClient.invalidateQueries(["lcbForm", companyId, customerId]);

        if (
          data.street ||
          data.firstPhoneNumber ||
          data.personalEmail ||
          data.country ||
          data.city ||
          data.zipCode ||
          data.fiscalAddress
        ) {
          updateDetailsInformations.mutate({
            street: data.street,
            firstPhoneNumber: data.firstPhoneNumber,
            personalEmail: data.personalEmail,
            country: data.country,
            city: data.city,
            zipCode: data.zipCode,
            fiscalAddress: data.fiscalAddress,
          });
        } else {
          refetchCustomerInfoData?.();
          toast?.current?.show({
            severity: "success",
            summary: "Success",
            detail: t("forms.fields.notifications.success.save"),
          });
        }
      },
      onError: (e) => {
        if (e instanceof Error) {
          let message = "";

          if (e.message.includes("EMAIL_ALREADY_EXISTS"))
            message = "forms.fields.notifications.error.EMAIL_ALREADY_EXISTS";
          else if (e.message.includes("CANT_UPDATE_EMAIL"))
            message = "forms.fields.notifications.error.CANT_UPDATE_EMAIL";
          else message = "forms.fields.notifications.error.success";

          toast?.current?.show({
            severity: "error",
            summary: "Error",
            detail: t(message),
          });
        }
      },
    }
  );

  const updateDetailsInformations = useMutation(
    (data: PersonalInfoFormData) =>
      gql.client.request(
        CompanyCustomersInformationsLogic.updateCustomerInformationsDetail(),
        {
          companyID: companyId,
          customerID: customerId,
          input: data,
        }
      ),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries([
          "companyCustomersInformations",
          customerId,
        ]);
        queryClient.invalidateQueries([
          "layout_customer",
          companyId,
          customerId,
        ]);

        toast?.current?.show({
          severity: "success",
          summary: "Success",
          detail: t("forms.fields.notifications.success.save"),
        });
        refetchCustomerInfoData?.();
      },
      onError: (e) => {
        if (e instanceof Error) {
          let message = "";

          if (e.message.includes("EMAIL_ALREADY_EXISTS"))
            message = "forms.fields.notifications.error.EMAIL_ALREADY_EXISTS";
          else if (e.message.includes("CANT_UPDATE_EMAIL"))
            message = "forms.fields.notifications.error.CANT_UPDATE_EMAIL";
          else message = "forms.fields.notifications.error.success";

          toast?.current?.show({
            severity: "error",
            summary: "Error",
            detail: t(message),
          });
        }
      },
    }
  );

  return {
    updateGeneralInformations,
    updateDetailsInformations,
    personalInfoMutationsLoading:
      updateDetailsInformations.isLoading ||
      updateGeneralInformations.isLoading,
  };
}
