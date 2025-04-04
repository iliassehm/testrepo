import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { BudgetCreationInput } from "../../../../../../types";
import { BudgetLogic } from "../../budget/budget.logic";
import { Income } from "./types";

export function useIncomeMutations(
  companyId: string,
  customerId: string,
  setShowModal: (income: Income | null) => void
) {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  const budgetCreation = useMutation(
    "budget_creation",
    ({ input, budgetID }: { input: BudgetCreationInput; budgetID?: string }) =>
      gql.client.request(BudgetLogic.creation(), {
        customerID: customerId,
        companyID: companyId,
        input,
        budgetID: budgetID ? budgetID : undefined,
      }),
    {
      onSuccess: async (data, variables) => {
        await queryClient.invalidateQueries(["budget", companyId, customerId]);
        toast?.current?.show({
          severity: "success",
          summary: t(
            `scenes.wealth.${variables?.budgetID ? "update" : "creation"}.success.summary`
          ),
          detail: t(
            `scenes.wealth.${variables?.budgetID ? "update" : "creation"}.success.detail`,
            {
              name:
                data?.created?.libelle ??
                t(`forms.fields.budget.${data?.created?.name}`),
            }
          ),
        });
        setShowModal(null);
      },
      onError(error, variables) {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t(
            `scenes.budget.${variables?.budgetID ? "update" : "create"}.error.summary`
          ),
          detail: t(
            `scenes.budget.${variables?.budgetID ? "update" : "create"}.error.detail`,
            {
              name: t(`forms.fields.budget.${variables.input.name}`),
            }
          ),
        });
      },
    }
  );

  const budgetDelete = useMutation(
    (budgetID: Income["id"]) =>
      gql.client.request(BudgetLogic.budgetItemDeletionMutation(), {
        customerID: customerId,
        companyID: companyId,
        budgetID,
      }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["budget", companyId, customerId]);
      },
      async onError(error) {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t("forms.fields.notifications.error.delete") as string,
        });
      },
    }
  );

  return {
    budgetCreation,
    budgetDelete,
    mutationsLoading: budgetDelete.isLoading || budgetCreation.isLoading,
  };
}
