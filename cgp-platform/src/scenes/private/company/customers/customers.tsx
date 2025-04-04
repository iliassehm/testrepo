import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Button } from "../../../../components";
import { downloadFile } from "../../../../helpers/downloadFile";
import { useToast } from "../../../../hooks/useToast";
import { gql } from "../../../../service/client";
import {
  Customer,
  CustomerDetails,
  CustomerDetailsUpdateInput,
  CustomerSortBy,
  SortDirection,
} from "../../../../types";
import { CompanyCustomersLogic } from "./customers.logic";
import { CustomersStats } from "./customersStats";
import { CustomerFilters, CustomersTable } from "./customersTable";

export function CompanyCustomers() {
  // Hooks
  const { t } = useTranslation();
  const params = useParams({
    from: "/company/$companyId/customers",
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const [filters, setFilters] = useState<CustomerFilters>({
    page: 0,
    limit: 25,
    sortBy: CustomerSortBy.Wealth,
    sortDirection: SortDirection.Desc,
  });

  const handleFiltersChange = (addingfilters: Partial<CustomerFilters>) => {
    const newFilters = { ...filters, ...addingfilters };
    setFilters(newFilters);
  };

  const { companyId } = params;

  // Queries
  const customersQueryKey = ["companyCustomers", companyId, filters];
  const { data, isLoading } = useQuery(customersQueryKey, () =>
    gql.client.request(CompanyCustomersLogic.queries(), {
      companyID: companyId as string,
      input: filters,
    })
  );

  const { data: dataCustomerDetails } = useQuery(
    ["customerDetails", params.companyId],
    () =>
      gql.client.request(CompanyCustomersLogic.customerDetails(), {
        companyID: params.companyId as string,
      })
  );

  // Mutations
  const onSuccess = () => queryClient.invalidateQueries(customersQueryKey);

  const { mutate: exportCustomers, isLoading: isExportingCustomers } =
    useMutation(
      "exportCustomers",
      () =>
        gql.client.request(CompanyCustomersLogic.exportCustomers(), {
          companyID: companyId as string,
          input: filters,
        }),
      {
        onSuccess: (response) => {
          if (response?.url) {
            downloadFile(response.url, `customers`);
          }
          queryClient.invalidateQueries(customersQueryKey);
        },
      }
    );

  const { mutate: customerDetailsUpdate } = useMutation(
    "customerDetailsUpdate",
    (input: CustomerDetailsUpdateInput) =>
      gql.client.request(CompanyCustomersLogic.customerDetailsUpdate(), {
        companyID: companyId as string,
        input,
      }),
    {
      onSuccess,
    }
  );

  const { mutate: handleCustomerDeletion, isLoading: customerDeletionLoading } =
    useMutation(
      "customerDeletion",
      (customerID: string) =>
        gql.client.request(CompanyCustomersLogic.customerDeletion(), {
          companyID: companyId,
          customerID,
        }),
      {
        onSuccess: () => {
          onSuccess();
          toast.current?.show({
            severity: "success",
            summary: t("scenes.customers.delete.success"),
            detail: t("scenes.customers.delete.successDetail"),
          });
        },
        onError: (e) => {
          console.error("Error deleting customer", e);
          toast.current?.show({
            severity: "error",
            summary: t("scenes.customers.delete.error"),
            detail: t("scenes.customers.delete.errorDetail"),
          });
        },
      }
    );

  if (!companyId) throw new Error("No company ID provided");

  return (
    <div className="flex flex-col w-full gap-7">
      <div className="w-full flex flex-col lg:flex-row lg:justify-between items-center gap-2 lg:gap-0">
        <CustomersStats
          data={dataCustomerDetails?.customerDetails as CustomerDetails}
          customerDetailsUpdate={customerDetailsUpdate}
        />
        <Button
          label={t("scenes.customersSearch.startRequest")}
          className="ml-4 text-xl self-center lg:self-start flex justify-self-end"
          onClick={() =>
            navigate({
              to: "/company/$companyId/customers/search",
              from: "/company/$companyId/customers",
              search: {
                tab: "wealth",
              },
            })
          }
        />
      </div>
      <div className="w-full flex-1">
        <CustomersTable
          data={
            (data?.company?.customerList.edges.map((edge) => edge.node) ||
              []) as Customer[]
          }
          totalRecords={data?.company?.customerList.totalCount}
          onCustomerDeletion={handleCustomerDeletion}
          customerDeletionLoading={customerDeletionLoading}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          companyId={companyId}
          onSearch={(filters) => {
            handleFiltersChange(filters);
          }}
          isLoading={isLoading}
          exportCustomers={exportCustomers}
          isExportingCustomers={isExportingCustomers}
        />
      </div>
    </div>
  );
}
