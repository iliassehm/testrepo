import { useNavigate, useParams } from "@tanstack/react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { formatCurrency, formatDate } from "../../../../../helpers";
import {
  Amount,
  DiscriminatedResult,
  SearchCustomersResultQuery,
} from "../../../../../types";

type Result = NonNullable<
  SearchCustomersResultQuery["getSearchResult"]
>["result"];

type CustomersSearchTableProps = {
  data: DiscriminatedResult<Result[number], "Customer">[];
};

export const CustomersSearchTable: FC<CustomersSearchTableProps> = ({
  data,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams({
    from: "/company/$companyId/customers/search",
  });

  const columnHelper =
    createColumnHelper<DiscriminatedResult<Result[number], "Customer">>();

  const CustomerSearchColumn = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => (
          <p className="min-w-[128px] text-left p-6">
            {t("scenes.customersSearch.results.table.name")}
          </p>
        ),
        cell: ({ getValue }) => <p>{getValue()}</p>,
      }),
      columnHelper.accessor("informations", {
        id: "birthDate",
        header: () => (
          <p className="min-w-[128px] text-left p-6">
            {t("scenes.customersSearch.results.table.birthDate")}
          </p>
        ),
        cell: ({ getValue }) => {
          const birthDate = getValue()?.general.birthDate;
          return <p>{birthDate ? formatDate(new Date(birthDate)) : "-"}</p>;
        },
      }),
      columnHelper.accessor("underManagementWealth", {
        header: () => (
          <p className="min-w-[128px] text-right p-6">
            {t("scenes.customersSearch.results.table.underManagementWealth")}
          </p>
        ),
        cell: ({ getValue }) => (
          <p className="font-medium text-right">
            {formatCurrency(getValue() as Amount)}
          </p>
        ),
      }),
      columnHelper.accessor("wealth", {
        header: () => (
          <p className="min-w-[128px] text-right p-6">
            {t("scenes.customersSearch.results.table.wealth")}
          </p>
        ),
        cell: ({ getValue }) => (
          <p className="font-medium text-right">
            {formatCurrency(getValue() as Amount)}
          </p>
        ),
      }),
      columnHelper.accessor("informations", {
        id: "address",
        header: () => (
          <p className="min-w-[128px] text-left p-6">
            {t("scenes.customersSearch.results.table.address")}
          </p>
        ),
        cell: ({ getValue }) => <p>{getValue()?.details.street ?? "-"}</p>,
      }),
    ],
    [t, columnHelper, data]
  );

  const table = useReactTable({
    data,
    columns: CustomerSearchColumn,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <table className="w-full">
      <thead className="bg-[#F6F4F3] text-[#161B33] font-bold border-b">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <tr
              className="hover:bg-black/5 cursor-pointer transition-all"
              key={row.id}
              onClick={() =>
                navigate({
                  to: "/company/$companyId/customer/$customerId",
                  params: {
                    companyId: params.companyId,
                    customerId: row.id,
                  },
                })
              }
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="p-5 border-b border-black/10 text-[#495057]"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="text-center p-8 w-full">
              {t("scenes.customersSearch.results.table.noData")}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
