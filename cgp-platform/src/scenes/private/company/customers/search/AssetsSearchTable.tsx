import { useNavigate, useParams } from "@tanstack/react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { type FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { AssetIcon } from "../../../../../components";
import { Info } from "../../../../../components/info";
import { SearchPagination } from "../../../../../components/SupportSelection/SearchResultTable";
import { clsx, formatCurrency, formatDate } from "../../../../../helpers";
import { SearchCustomersResultQuery } from "../../../../../types";
import { totalDisplay } from "../wealth/WalletTab/investmentTableUtils";

type Result = NonNullable<
  SearchCustomersResultQuery["getSearchResult"]
>["result"];

export type DiscriminatedResult<Typename extends Result[number]["__typename"]> =
  Extract<Result[number], { __typename: Typename }>;

type AssetsSearchTableProps = {
  data: DiscriminatedResult<"CustomerAsset">[];
  isLoading?: boolean;
};

export const AssetsSearchTable: FC<AssetsSearchTableProps> = ({
  data,
  isLoading,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams({
    from: "/company/$companyId/customers/search",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const columnHelper =
    createColumnHelper<DiscriminatedResult<"CustomerAsset">>();

  const CustomerSearchColumn = useMemo(
    () => [
      columnHelper.accessor("customer.name", {
        header: () => (
          <p className="min-w-[128px] text-left p-5">
            {t("scenes.customersSearch.results.table.name")}
          </p>
        ),
        cell: ({ getValue }) => <p>{getValue()}</p>,
      }),
      columnHelper.accessor("group", {
        id: "group",
        header: () => (
          <p className="min-w-[128px] text-left p-5">
            {t("scenes.customersSearch.results.table.assetType")}
          </p>
        ),
        cell: ({ getValue }) => {
          const group = getValue();
          return (
            <div className="flex items-center gap-2">
              <AssetIcon assetName={group} size="sm" />
              <p>{t(`asset_group.${group}`)}</p>
            </div>
          );
        },
      }),
      columnHelper.accessor("name", {
        header: () => (
          <p className="min-w-[128px] text-left p-5">
            {t("scenes.customersSearch.results.table.assetName")}
          </p>
        ),
        cell: ({ getValue }) => <p className="font-medium">{getValue()}</p>,
      }),
      columnHelper.accessor("accountNumber", {
        id: "address",
        header: () => (
          <p className="min-w-[128px] text-left p-5">
            {t("scenes.customersSearch.results.table.accountNumber")}
          </p>
        ),
        cell: ({ getValue }) => <p>{getValue() ?? "-"}</p>,
      }),
      columnHelper.accessor("openDate", {
        id: "dateOpen",
        header: () => (
          <p className="min-w-[128px] text-left p-5">
            {t("scenes.customersSearch.results.table.openDate")}
          </p>
        ),
        cell: ({ getValue }) => (
          <p>{getValue() ? formatDate(getValue()) : "-"}</p>
        ),
      }),
      columnHelper.accessor("valuation", {
        header: () => (
          <p className="min-w-[128px] text-right p-5">
            {t("scenes.customersSearch.results.table.amount")}
          </p>
        ),
        cell: ({ getValue }) => (
          <p className="font-medium text-right">
            {formatCurrency({ value: getValue(), instrument: "EUR" })}
          </p>
        ),
      }),
      columnHelper.accessor("mixedData", {
        header: () => (
          <p className="min-w-[128px] text-right p-5">
            {t("scenes.customersSearch.results.table.performance")}
          </p>
        ),
        cell: ({ getValue }) => {
          const mixedData = getValue();
          const perf = {
            infoCalPerf: mixedData?.irrCalculations?.infoCalPerf,
            gain: Number(mixedData?.irrCalculations?.globalRealizedGain),
            evolution: Number(
              mixedData?.irrCalculations?.globalPerformancePercentage
            ),
          };
          return (
            <div className={'flex justify-end items-center gap-4'}>
              <p className="font-medium text-right">
                {[
                  "valide",
                  "Estime via transfertAmount",
                  "Estime via transaction",
                ].includes(perf.infoCalPerf)
                  ? totalDisplay(perf.gain, perf.evolution)
                  : "N/A"}
              </p>
              {perf?.infoCalPerf && perf?.infoCalPerf !== 'valide' ? <Info text="info.performance" /> : ''}
            </div>
          );
        },
      }),
    ],
    [t, columnHelper, data]
  );

  const table = useReactTable({
    data,
    columns: CustomerSearchColumn,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    getRowId: (row) => row.id,
  });

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <table className="w-full">
        <thead className="bg-[#F6F4F3] text-[#161B33] font-bold border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={header.column.getToggleSortingHandler()}
                    className={clsx(
                      "",
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    )}
                  >
                    <div className="flex items-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {{
                        asc: "↑",
                        desc: "↓",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length && !isLoading ? (
            table.getRowModel().rows.map((row) => (
              <tr
                className="hover:bg-black/5 cursor-pointer transition-all text-sm"
                key={row.id}
                onClick={() =>
                  navigate({
                    to: "/company/$companyId/customer/$customerId/wealth/$type/$investmentId",
                    params: {
                      companyId: params.companyId,
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      customerId: row.original.customer!.id,
                      type: row.original.group,
                      investmentId: row.original.id,
                    },
                  })
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-5 h-[72px] border-b border-black/10 text-[#495057]"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-8 w-full">
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  t("scenes.customersSearch.results.table.noData")
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredRowModel().rows.length > 0 ? (
          <SearchPagination
            setPageIndex={table.setPageIndex}
            nextPage={table.nextPage}
            previousPage={table.previousPage}
            currentPageIndex={table.getState().pagination.pageIndex}
            pageCount={table.getPageCount()}
            totalResults={table.getFilteredRowModel().rows.length}
          />
        ) : null}
      </div>
    </div>
  );
};
