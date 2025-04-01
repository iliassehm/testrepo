import {
  CellContext,
  ColumnFiltersState,
  createColumnHelper,
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
import { t } from "i18next";
import { InputNumber } from "primereact/inputnumber";
import { Dispatch, SetStateAction, useState } from "react";

import { SearchPagination } from "../../../../../../components/SupportSelection/SearchResultTable";
import { formatCurrency } from "../../../../../../helpers";
import {
  Amount,
  CustomerInvestment,
  InvestmentValues,
} from "../../../../../../types";
import { DataTableColumnHeader } from "../../wealth/AssetCreation/LongTermAsset/components/data-table/data-table-column-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../wealth/AssetCreation/LongTermAsset/components/table";

interface InvestmentInstrumentTableRowTableProps {
  data: DeinvestmentInstrumentTableRow[];
  setData: Dispatch<SetStateAction<DeinvestmentInstrumentTableRow[]>>;
  transfersAmount: number;
  footer?: () => JSX.Element;
  onSubmit: (values: InvestmentValues[]) => void;
}

export type DeinvestmentInstrumentTableRow = CustomerInvestment & {
  divestmentQuantity: number;
  divestmentAmount: number;
  divestmentPercent: number;
};

const columnHelper = createColumnHelper<DeinvestmentInstrumentTableRow>();

export const DeinvestmentColumns = [
  columnHelper.accessor("code", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("forms.fields.tables.isin")}
      />
    ),
    cell: ({ getValue }) => <div>{getValue()}</div>,
  }),
  columnHelper.accessor("label", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("forms.fields.tables.investments.label")}
      />
    ),
    cell: ({ getValue }) => <div className="truncate">{getValue()}</div>,
  }),
  columnHelper.accessor("riskIndicator", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("forms.fields.tables.investments.sri")}
      />
    ),
    cell: ({ row }) => (
      <div className="truncate">
        {row.getValue("riskIndicator")
          ? row.getValue("riskIndicator")
          : row.getValue("code") === "XXliquidity"
            ? 1
            : 7}
      </div>
    ),
  }),
  columnHelper.accessor("unitValue", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("forms.fields.tables.unitValue")}
        className="justify-end"
      />
    ),
    cell: ({ getValue }) => {
      return <div className="text-right ml-auto">{getValue()?.toFixed(2)}</div>;
    },
  }),
  columnHelper.accessor("quantity", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("forms.fields.tables.qte")}
        className="justify-end"
      />
    ),
    cell: (args) => {
      return (
        <div className="text-right ml-auto">{args.getValue()?.toFixed(2)}</div>
      );
    },
  }),
  columnHelper.accessor("valuation", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Evaluation"}
        className="justify-end"
      />
    ),
    cell: ({ getValue }) => {
      return (
        <div className="text-right ml-auto">{formatCurrency(getValue())}</div>
      );
    },
  }),
  columnHelper.accessor("divestmentAmount", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("forms.fields.tables.amount")}
        className="justify-end"
      />
    ),
    cell: ({ getValue }) => {
      return (
        <div className="text-right ml-auto text-blue-800 font-medium">
          {formatCurrency({ value: getValue(), instrument: "EUR" })}
        </div>
      );
    },
  }),
  columnHelper.accessor("divestmentQuantity", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("forms.fields.tables.qte")}
        className="justify-end"
      />
    ),
    cell: ({ getValue }) => {
      return (
        <div className="text-right ml-auto text-blue-800 font-medium">
          {getValue().toFixed(2)}
        </div>
      );
    },
  }),
  columnHelper.accessor("divestmentPercent", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="%"
        className="justify-end"
      />
    ),
    cell: (args) => {
      const { valuation, quantity } = getComputedValues(args);

      const onChange = (value: number) => {
        if (value > 100) {
          value = 100;
        }
        const newPercent = value;
        const newAmount = (newPercent * (valuation.value ?? 0)) / 100;

        args.table.options.meta?.updateData?.(args.row.index, {
          divestmentPercent: newPercent,
          divestmentAmount: newAmount,
          divestmentQuantity: quantity * (newPercent / 100),
        });
      };

      const value = args.getValue() as number;

      return (
        <div className="text-right">
          <InputNumber
            value={value}
            type="percent"
            locale="fr-FR"
            onChange={(e) => onChange(Number(e.value))}
            inputClassName="p-1 text-right text-xs"
            min={0}
            max={100}
            className="w-20"
            maxFractionDigits={2}
          />
        </div>
      );
    },
  }),
];

export function DeinvestmentInstrumentTable({
  data,
  setData,
  footer,
  transfersAmount,
}: InvestmentInstrumentTableRowTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: DeinvestmentColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    meta: {
      transfersAmount,
      deleteRow: () => null,
      updateData: (rowIndex, value) => {
        const newData = [...data];
        newData[rowIndex] = {
          ...newData[rowIndex],
          ...value,
        };
        setData(newData);
      },
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
          {table.getRowModel().rows?.length
            ? table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>

      <div className="w-full flex justify-between items-start mt-2">
        {table.getFilteredRowModel().rows.length >
        table.getState().pagination.pageSize ? (
          <SearchPagination
            setPageIndex={table.setPageIndex}
            nextPage={table.nextPage}
            previousPage={table.previousPage}
            currentPageIndex={table.getState().pagination.pageIndex}
            pageCount={table.getPageCount()}
            totalResults={table.getFilteredRowModel().rows.length}
          />
        ) : (
          <div />
        )}
        {footer?.()}
      </div>
    </div>
  );
}

function getComputedValues(
  args: CellContext<DeinvestmentInstrumentTableRow, unknown>
) {
  const quantity: number = args.row.getValue("quantity");

  const transfersAmount = args.table.options.meta?.transfersAmount || 1;
  const valuation: Amount = args.row.original.valuation ?? {
    value: args.row.getValue("buyingPrice") ?? 0,
    instrument: "EUR",
  };

  return {
    quantity,
    transfersAmount,
    valuation,
  };
}
