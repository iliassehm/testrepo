import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import { isNotEmpty } from "../../../../../../../helpers";
import { useToast } from "../../../../../../../hooks/useToast";
import { gql } from "../../../../../../../service/client";
import { CustomersConformityLogic } from "../../../conformity/conformity.logic";
import { ObjectivesFormDataType } from "../../../conformity/goals/form";

export function useGoalsMutations(companyId: string, customerId: string) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const goalsUpdate = useMutation(
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
        queryClient.invalidateQueries([
          "customerConformityObjectives",
          companyId,
          customerId,
        ]);
      },
    }
  );

  return {
    goalsUpdate,
    isGoalsMutationsLoading: goalsUpdate.isLoading,
  };
}
