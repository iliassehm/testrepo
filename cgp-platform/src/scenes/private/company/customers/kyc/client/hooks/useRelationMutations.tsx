import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import {
  CustomerRelationForm,
  CustomerRelationFormDataType,
} from "../../../../../../../../shared/schemas/relation";
import { useToast } from "../../../../../../../hooks/useToast";
import { gql } from "../../../../../../../service/client";
import { CompanyCustomersInformationsLogic } from "../../../informations/informations.logic";

export function useRelationMutations(
  companyId: string,
  customerId: string,
  refetchRelationData?: () => void,
  showEditModal?: CustomerRelationForm | null,
  onSuccess?: () => void,
  spouse?: CustomerRelationForm | null
) {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleSuccess = (displayToast: boolean) => {
    onSuccess?.();
    queryClient.invalidateQueries(["relation", companyId, customerId]);
    queryClient.invalidateQueries([
      "users_in_customer_reference",
      companyId,
      customerId,
    ]);
    if (!displayToast) return;
    toast?.current?.show({
      severity: "success",
      summary: "Success",
      detail: t("forms.fields.notifications.success.save"),
    });
  };

  const relationCreation = useMutation(
    (input: CustomerRelationFormDataType) =>
      gql.client.request(
        CompanyCustomersInformationsLogic.customerRelations(),
        {
          companyID: companyId,
          id: customerId,
          input: input as unknown as CustomerRelationForm,
        }
      ),
    {
      onSuccess: () => {
        handleSuccess(true);
        refetchRelationData?.();
      },
    }
  );

  const relationDelete = useMutation(
    (id: string) =>
      gql.client.request(CompanyCustomersInformationsLogic.relationDelete(), {
        companyID: companyId,
        customerID: customerId,
        id,
      }),
    {
      onSuccess: () => {
        handleSuccess(true);
      },
    }
  );

  const relationUpdate = useMutation(
    (input: CustomerRelationFormDataType) =>
      gql.client.request(CompanyCustomersInformationsLogic.relationUpdate(), {
        companyID: companyId,
        customerID: customerId,
        id: showEditModal
          ? (showEditModal?.id as string)
          : (spouse?.id as string),
        input: input as unknown as CustomerRelationForm,
      }),
    {
      onSuccess: () => {
        handleSuccess(true);
      },
    }
  );

  const unlinkFromCustomerReference = useMutation(
    (input: { id: string }) =>
      gql.client.request(
        CompanyCustomersInformationsLogic.unlinkFromCustomerReference(),
        {
          id: input.id,
          companyID: companyId as string,
        }
      ),
    {
      onSuccess: () => {
        handleSuccess(true);
      },
    }
  );

  const createUserFromRelation = useMutation(
    (input: { id: string; addToCustomerReference: boolean }) =>
      gql.client.request(
        CompanyCustomersInformationsLogic.createUserFromRelation(),
        {
          companyID: companyId as string,
          customerID: customerId as string,
          id: input.id,
          addToCustomerReference: input.addToCustomerReference,
        }
      ),
    {
      onSuccess: () => {
        handleSuccess(false);
      },
    }
  );

  return {
    relationCreation,
    relationDelete,
    relationUpdate,
    unlinkFromCustomerReference,
    createUserFromRelation,
  };
}
