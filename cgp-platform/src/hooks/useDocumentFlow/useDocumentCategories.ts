// useDocumentFlow.ts
import { useMutation, useQuery } from "react-query";

import { GedLogic } from "../../scenes/private/company/customers/conformity/ged/ged.logic";
import { gql } from "../../service/client";
import type {
  Company,
  Customer,
  DocumentCategoryListOnlyQuery,
} from "../../types";

type DocumentCategory = NonNullable<
  DocumentCategoryListOnlyQuery["documentCategoryList"]
>[number];

export function useDocumentCategories(
  companyID: Company["id"],
  selectedCategory: DocumentCategory | null,
  setSelectedCategory: (category: DocumentCategory | null) => void
) {
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = useQuery(
    ["documentCategories"],
    () =>
      gql.client.request(GedLogic.documentCategoryListQuery(), { companyID }),
    {
      onSuccess: (data) => {
        if (data?.documentCategoryList?.[0] && !selectedCategory) {
          setSelectedCategory(data.documentCategoryList[0]);
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
    mutationKey: "gedCategoryUpdate",
    mutationFn: (params: {
      key: string;
      updatedName: string;
      customerVisibility: boolean;
    }) =>
      gql.client.request(GedLogic.documentCategoryUpdate(), {
        companyID,
        key: params.key,
        updatedName: params.updatedName,
        customerVisibility: params.customerVisibility,
      }),
    onSuccess: () => {
      refetchCategories();
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationKey: "categoryDeletion",
    mutationFn: (key: string) =>
      gql.client.request(GedLogic.documentCategoryDeletion(), {
        companyID,
        key,
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
    categories: categoriesData?.documentCategoryList,
    refetchCategories,
  };
}
