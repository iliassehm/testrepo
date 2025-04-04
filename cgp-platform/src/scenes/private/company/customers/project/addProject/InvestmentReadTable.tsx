import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { SearchPagination } from "../../../../../../components/SupportSelection/SearchResultTable";
import {
  formatCurrency,
  numberFormat,
  percentFormatter,
  quantityFormatter,
} from "../../../../../../helpers";
import { Amount, CustomerInvestment } from "../../../../../../types";
import { DataTableColumnHeader } from "../../wealth/AssetCreation/LongTermAsset/components/data-table/data-table-column-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../wealth/AssetCreation/LongTermAsset/components/table";

type InvestmentReadTableProps = {
  data: CustomerInvestment[];
  totalValuation: number;
};

export function InvestmentReadTable({
  data,
  totalValuation,
}: InvestmentReadTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<CustomerInvestment>[]>(
    () => [
      {
        accessorKey: "code",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("forms.fields.tables.isin")}
          />
        ),
        cell: ({ row }) => (
          <div className="min-w-[100px]">{row.getValue("code")}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "label",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("forms.fields.tables.investments.label")}
          />
        ),
        cell: ({ row }) => (
          <div className="min-w-[180px] truncate">{row.getValue("label")}</div>
        ),
      },
      {
        accessorKey: "buyingDate",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("forms.fields.tables.buyingDate")}
          />
        ),
        cell: ({ row }) => (
          <div className="w-[80px]">{row.getValue("buyingDate") ?? "N/A"}</div>
        ),
      },
      {
        accessorKey: "riskIndicator",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("forms.fields.tables.risk")}
            className="justify-end"
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="w-[120px] ml-auto text-right">
              {row.getValue("riskIndicator")
                ? row.getValue("riskIndicator")
                : row.getValue("code") === "XXliquidity"
                  ? 1
                  : 7}
            </div>
          );
        },
      },
      {
        accessorKey: "unitPrice",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("forms.fields.tables.buyingPrice")}
            className="justify-end"
          />
        ),
        cell: ({ getValue }) => {
          const buyingPrice = getValue() as number;
          return (
            <div className="w-[120px] ml-auto text-right">
              {numberFormat(buyingPrice)}
            </div>
          );
        },
      },
      {
        id: "unitValue",
        accessorKey: "unitValue",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("forms.fields.tables.unitValue")}
            className="justify-end"
          />
        ),
        cell: ({ getValue }) => {
          const valuation = getValue() as number;

          return (
            <div className="w-[80px] text-right ml-auto">
              {numberFormat(valuation)}
            </div>
          );
        },
      },
      {
        id: "quantity",
        accessorKey: "quantity",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("forms.fields.tables.qte")}
            className="justify-end"
          />
        ),
        cell: (args) => {
          const value = args.getValue() as number;

          return (
            <div className="text-right">{quantityFormatter.format(value)}</div>
          );
        },
      },
      {
        accessorKey: "valuation",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("forms.fields.tables.amount")}
            className="justify-end"
          />
        ),
        cell: (args) => {
          const valuation = args.getValue() as Amount;

          return (
            <div className="w-[120px] text-right ml-auto">
              {formatCurrency(valuation)}
            </div>
          );
        },
      },
      {
        accessorKey: "percent",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="%"
            className="justify-end"
          />
        ),
        cell: (args) => {
          const valuation = args.row.getValue("valuation") as Amount;

          // get the percent of the current investment
          const percent = (valuation.value ?? 0) / totalValuation;

          return (
            <div className="text-right">{percentFormatter.format(percent)}</div>
          );
        },
      },
    ],
    [totalValuation]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              InvestmentInstrumentTableRow-state={
                row.getIsSelected() && "selected"
              }
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="w-full flex justify-between items-start mt-2">
        <SearchPagination
          setPageIndex={table.setPageIndex}
          nextPage={table.nextPage}
          previousPage={table.previousPage}
          currentPageIndex={table.getState().pagination.pageIndex}
          pageCount={table.getPageCount()}
          totalResults={table.getFilteredRowModel().rows.length}
        />
      </div>
    </div>
  );
}
