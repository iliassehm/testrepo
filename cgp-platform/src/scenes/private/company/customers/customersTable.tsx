import { useNavigate } from "@tanstack/react-router";
import { Paginator } from "primereact/paginator";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Icon } from "../../../../components";
import { iconPathForPlan } from "../../../../components/Options/PlanOption";
import Table from "../../../../components/Table";
import { DataType } from "../../../../components/Table/tableTypes";
import { Widget } from "../../../../components/Widget";
import {
  DeleteConfirmationDialog,
  formatCurrency,
  numberWithSpaces,
} from "../../../../helpers";
import {
  Customer,
  CustomerSortBy,
  Range,
  SortDirection,
} from "../../../../types";

const dataType: Record<string, DataType> = {
  lastName: {
    type: "string",
    sortable: true,
    field: "lastName",
    filterType: "string",
    sortBy: "lastName",
  },
  firstName: {
    type: "string",
    sortable: true,
    field: "firstName",
    filterType: "string",
    sortBy: "firstName",
  },
  email: {
    type: "string",
    sortable: true,
    filterType: "string",
  },
  phoneNumber: {
    type: "string",
    sortable: true,
    filterType: "string",
  },
  wealth: {
    type: "amount",
    sortable: true,
    field: "wealth.value",
  },
  advisor: {
    type: "string",
    sortable: true,
    filterType: "string",
  },
  delete: { type: "action" },
};

export type CustomerFilters = {
  search?: string;
  wealth?: Range;
  sortBy?: CustomerSortBy;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
};

interface Props {
  data: Customer[];
  companyId: string;
  totalRecords?: number;
  isLoading?: boolean;
  onFiltersChange?: (filters: Partial<CustomerFilters>) => void;
  filters?: CustomerFilters;
  customerDeletionLoading?: boolean;
  onSearch?: (filters: Partial<CustomerFilters>) => void;
  onCustomerDeletion: (customerID: string) => void;
  exportCustomers: () => void;
  isExportingCustomers?: boolean;
}

export const GetFirstNameCustomerWithIcon = ({
  customer,
}: {
  customer: Pick<Customer, "firstName" | "type" | "plan" | "hasB2CAccount">;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between w-full">
      <div className="truncate">
        {customer.firstName
          ?.trim()
          .split(" ")
          .map((word) => word.trim())
          .filter((word) => word.length > 0)
          .map((word) => {
            return word[0].toUpperCase() + word.substring(1);
          })
          .join(" ")}
      </div>
      <div className="flex">
        {customer.hasB2CAccount && customer.plan && (
          <img
            src={customer.plan ? iconPathForPlan(customer.plan) : ""}
            alt={t(`customer.plan.${customer.plan}`)}
          />
        )}
        <img
          src={`/icons/${customer.type}.svg`}
          alt={t(`forms.${customer.type}`)}
        />
      </div>
    </div>
  );
};

export function CustomersTable({
  data,
  companyId,
  totalRecords: totalRecordsProps,
  onFiltersChange,
  filters,
  isLoading,
  onCustomerDeletion,
  customerDeletionLoading,
  exportCustomers,
  isExportingCustomers,
}: Props) {
  const [customerDeletion, setCustomerDeletion] = useState<string>();
  const navigate = useNavigate({ from: "/company/$companyId/customers" }); //

  const handleSearch = (addingFilters: Partial<CustomerFilters>) => {
    onFiltersChange?.({
      ...filters,
      ...addingFilters,
    });
  };

  // Events
  const onRowClick = (data: Customer) =>
    navigate({
      to: "/company/$companyId/customer/$customerId/",
      params: {
        companyId,
        customerId: data.id,
      },
    });

  const validateNumberInput = useCallback((value: string) => {
    const number = parseInt(value, 10);
    return !isNaN(number) && number >= 0 ? number : undefined;
  }, []);

  const amountFilter = useMemo(
    () => (
      <div className="flex justify-between lg:justify-start lg:flex-row gap-2">
        <input
          type="number"
          placeholder="min"
          defaultValue={filters?.wealth?.min || undefined}
          className="border border-gray-300 rounded-md px-3 py-1 pl-6 w-40"
          onChange={(e) => {
            handleSearch({
              wealth: {
                ...filters?.wealth,
                min: validateNumberInput(e.target.value),
              },
            });
          }}
        />
        <input
          type="number"
          placeholder="max"
          defaultValue={filters?.wealth?.max || undefined}
          className="border border-gray-300 rounded-md px-3 py-1 pl-6 w-40"
          onChange={(e) => {
            handleSearch({
              wealth: {
                ...filters?.wealth,
                max: validateNumberInput(e.target.value),
              },
            });
          }}
        />
      </div>
    ),
    [filters?.wealth]
  );

  const page = filters?.page ?? 0;
  const limit = filters?.limit ?? 0;
  const skip = page * limit;
  const totalRecords = totalRecordsProps ?? 0;

  const widthTbody = document
    .getElementById("tableBody-customers")
    ?.getBoundingClientRect().width;
  const cellWidthsPercentage = [20, 20, 15, 15, 15, 12, 3];
  let cellWidths = [300, 300, 225, 225, 225, 200, 40];
  if (widthTbody) {
    cellWidths = cellWidthsPercentage.map(
      (percentage) => (percentage * widthTbody) / 100
    );
  }

  console.debug("data", data);

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between bg-blue-1000 py-2 px-4 mb-7 rounded-xl">
        <div className="flex items-center relative w-full lg:w-fit mb-2 lg:mb-0">
          <i className="pi pi-search absolute left-1 top-1/2 -translate-y-1/2 text-base text-gray-300" />
          <input
            className="border border-gray-300 rounded-md px-3 py-1 pl-6 w-full lg:w-fit"
            defaultValue={filters?.search}
            autoFocus
            onChange={(e) =>
              handleSearch({
                search: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <Button
            loading={isExportingCustomers}
            label=""
            variant="bordered"
            className="flex items-center justify-center px-3 rounded-md"
            onClick={() => exportCustomers()}
          >
            <Icon type="download" className="w-4 h-4" />
          </Button>
          {amountFilter}
        </div>
      </div>
      <Widget>
        <>
          <Table
            data={data}
            dataType={dataType}
            className="shadow-none mt-4 w-full"
            defaultSort="wealth"
            onSort={(sortBy, sortDirection) =>
              handleSearch({ sortBy: sortBy as CustomerSortBy, sortDirection })
            }
            defaultSortDirection={filters?.sortDirection || SortDirection.Asc}
          >
            <Table.Head translationPrefix="forms.fields.tables" />
            <Table.Body className="w-full" id="tableBody-customers">
              {({ data }: { data: Customer[] }) => {
                if (isLoading) {
                  return (
                    <Table.Row>
                      <Table.Cell colSpan={7} className="text-center">
                        <div className="animate-pulse flex space-x-4">
                          <div className="flex-1 space-y-4 py-1">
                            {[...Array(filters?.limit || 10)].map(
                              (_, index) => (
                                <div
                                  key={index}
                                  className="h-6 bg-gray-300 rounded"
                                  style={{
                                    width:
                                      Math.floor(
                                        Math.random() * (100 - 40 + 1) + 40
                                      ) + "%",
                                  }}
                                ></div>
                              )
                            )}
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                }
                return data?.map((element, index) => (
                  <Table.Row
                    key={index}
                    onClick={() => onRowClick(element as Customer)}
                    className="w-full"
                  >
                    <Table.Cell
                      value={
                        element.lastName
                          ? element.lastName.toUpperCase()
                          : element.name?.toUpperCase()
                      }
                      className="truncate"
                      style={{
                        width: cellWidths[0] + "px",
                        maxWidth: cellWidths[0] + "px",
                      }}
                    />
                    <Table.Cell
                      className="truncate"
                      style={{
                        width: cellWidths[1] + "px",
                        maxWidth: cellWidths[1] + "px",
                      }}
                    >
                      <GetFirstNameCustomerWithIcon customer={element} />
                    </Table.Cell>
                    <Table.Cell
                      value={
                        <a
                          href={"mailto:" + (element.email ?? "")}
                          target="_blank"
                          className="text-blue-800 font-light truncate w-full"
                        >
                          {element.email}
                        </a>
                      }
                      className="truncate"
                      style={{
                        width: cellWidths[2] + "px",
                        maxWidth: cellWidths[2] + "px",
                      }}
                    />
                    <Table.Cell
                      value={numberWithSpaces(
                        element.informations?.details?.firstPhoneNumber ??
                          element.phoneNumber ??
                          element.informations?.general?.information?.phone ??
                          ""
                      )}
                      className="truncate"
                      style={{
                        width: cellWidths[3] + "px",
                        maxWidth: cellWidths[3] + "px",
                      }}
                    />
                    <Table.Cell
                      type="amount"
                      value={formatCurrency(element.wealth)}
                      style={{
                        width: cellWidths[4] + "px",
                        maxWidth: cellWidths[4] + "px",
                      }}
                    />
                    <Table.Cell
                      value={element.manager?.name}
                      className="truncate"
                      style={{
                        width: cellWidths[5] + "px",
                        maxWidth: cellWidths[5] + "px",
                      }}
                    />
                    <Table.Cell
                      style={{
                        width: cellWidths[6] + "px",
                        maxWidth: cellWidths[6] + "px",
                      }}
                    >
                      <button
                        className="w-full flex justify-center"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCustomerDeletion(element.id);
                        }}
                      >
                        <i className="notification-target-icon pi pi-trash text-red-500 h-4 w-4 cursor-pointer" />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ));
              }}
            </Table.Body>
          </Table>
          <Paginator
            first={skip}
            totalRecords={totalRecords}
            rowsPerPageOptions={[10, 25, 50]}
            rows={limit}
            onPageChange={(e) => handleSearch({ page: e.page, limit: e.rows })}
          />
          <DeleteConfirmationDialog
            visible={!!customerDeletion}
            loading={customerDeletionLoading}
            onDeleteConfirmation={() => {
              !!customerDeletion && onCustomerDeletion(customerDeletion);
              setCustomerDeletion(undefined);
            }}
            onClose={() => setCustomerDeletion(undefined)}
          />
        </>
      </Widget>
    </>
  );
}
