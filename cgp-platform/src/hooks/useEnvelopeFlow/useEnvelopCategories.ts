// useDocumentFlow.ts
import { useMutation, useQuery } from "react-query";

import { GedLogic } from "../../scenes/private/company/customers/conformity/ged/ged.logic";
import { gql } from "../../service/client";
import type {
  Company,
  Customer,
  EnvelopeAccess,
  EnvelopeListOnlyQuery,
} from "../../types";

type EnvelopeCategory = NonNullable<
  EnvelopeListOnlyQuery["envelopeList"]
>[number];

export function useEnvelopeCategories(
  companyID: Company["id"],
  customerID: Customer["id"],
  selectedCategory: EnvelopeCategory | null,
  setSelectedCategory: (category: EnvelopeCategory | null) => void
) {
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = useQuery(
    ["envelopeCategories"],
    () =>
      gql.client.request(GedLogic.envelopeCategoryListOnly(), {
        companyID,
        customerID,
      }),
    {
      onSuccess: (data) => {
        if (data?.envelopeList?.[0] && !selectedCategory) {
          setSelectedCategory(data.envelopeList[0]);
        }
      },
    }
  );

  const categoryCreationMutation = useMutation({
    mutationKey: "gedCategoryCreation",
    mutationFn: (params: { name: string; customerVisibility: boolean }) =>
      gql.client.request(GedLogic.categoryCreation(), {
        companyID,
        name: params.name,
        customerVisibility: params.customerVisibility,
      }),
    onSuccess: () => {
      refetchCategories();
    },
  });

  const categoryUpdateMutation = useMutation({
    mutationKey: "envelopeCategoryUpdate",
    mutationFn: (params: { access: EnvelopeAccess }) =>
      gql.client.request(GedLogic.envelopeUpdate(), {
        companyID,
        customerID,
        input: params.access,
      }),
    onSuccess: () => {
      refetchCategories();
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationKey: "envelopeCategoryDeletion",
    mutationFn: (envelopeID: string) =>
      gql.client.request(GedLogic.envelopeDeletion(), {
        companyID,
        customerID,
        envelopeID,
      }),
    onSuccess: () => {
      refetchCategories();
    },
  });

  return {
    isCategoriesLoading,
    categoryUpdateMutation,
    deleteCategoryMutation,
    categoryCreationMutation,
    categories: categoriesData?.envelopeList,
    refetchCategories,
  };
}
