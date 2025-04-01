import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { BudgetCreationInput } from "../../../../../../types";
import { BudgetLogic } from "../../budget/budget.logic";
import { CompanyCustomersFiscalityLogic } from "../../fiscality/fiscality.logic";
import { Charge } from "./types";

export function useChargeMutations(
  companyId: string,
  customerId: string,
  setShowModal?: (charge: Charge | null) => void
) {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  const budgetCreation = useMutation(
    "budget_creation",
    ({
      input,
      budgetID,
    }: {
      input: BudgetCreationInput;
      budgetID?: string;
      updateFiscality?: boolean;
    }) =>
      gql.client.request(BudgetLogic.creation(), {
        customerID: customerId,
        companyID: companyId,
        input,
        budgetID: budgetID ? budgetID : undefined,
      }),
    {
      onSuccess: async (data, variables) => {
        if (
          data?.created?.name === "realEstateWealthTax" &&
          variables?.updateFiscality !== false
        ) {
          fiscalityUpdateIFI.mutate({
            isSubjectToTax: true,
            amount: variables.input.amount,
          });
        }
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
        setShowModal?.(null);
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
    ({ budgetID }: { budgetID: Charge["id"]; budgetName?: Charge["name"] }) =>
      gql.client.request(BudgetLogic.budgetItemDeletionMutation(), {
        customerID: customerId,
        companyID: companyId,
        budgetID,
      }),
    {
      onSuccess: async (data, variables) => {
        if (
          variables?.budgetName &&
          variables.budgetName === "realEstateWealthTax"
        ) {
          fiscalityUpdateIFI.mutate({
            isSubjectToTax: false,
            amount: 0,
          });
        }
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

  const { data: customerFiscalityData } = useQuery(
    ["companyCustomersInformations", companyId, customerId],
    () =>
      gql.client.request(CompanyCustomersFiscalityLogic.queries(), {
        companyID: companyId as string,
        customerID: customerId as string,
        year: new Date().getFullYear(),
      })
  );

  const fiscalityUpdateIFI = useMutation(
    "fiscality_update",
    ({ isSubjectToTax, amount }: { isSubjectToTax: boolean; amount: number }) =>
      gql.client.request(CompanyCustomersFiscalityLogic.updateFiscality(), {
        customerID: customerId,
        companyID: companyId,
        input: {
          ...customerFiscalityData?.customer?.fiscality, // Add the previous data
          subjectRealEstateWealthTax: isSubjectToTax,
          realEstateWealthPayableTax: amount,
        },
        year: new Date().getFullYear(),
      }),
    {
      onSuccess: () => {
        toast?.current?.show({
          severity: "success",
          summary: "Success",
          detail: t("forms.fields.notifications.success.save"),
        });
        queryClient.invalidateQueries([
          "companyCustomersInformations",
          companyId,
          customerId,
        ]);
      },
    }
  );

  return {
    budgetCreation,
    budgetDelete,
    mutationsLoading: budgetDelete.isLoading || budgetCreation.isLoading,
  };
}
