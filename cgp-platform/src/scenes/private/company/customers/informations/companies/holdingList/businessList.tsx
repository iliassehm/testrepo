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
import { t } from "i18next";
import { useState } from "react";

import {
  DeleteWithConfirmationDialog,
  formatDate,
} from "../../../../../../../helpers";
import { BusinessStats } from "../../../../../../../types";
import {
  DataTableColumnHeader,
  Table,
  TableRow,
} from "../../../../settings/office/legalOffice/esthetic/tableEsthetic";
import { investmentInstrumentColumns } from "../../../wealth/AssetCreation/LongTermAsset/components/data-table/columns";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "../../../wealth/AssetCreation/LongTermAsset/components/table";

const collaboratorsTable: ColumnDef<BusinessStats>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t(`forms.fields.name`)} />
    ),
    cell: ({ row }) => (
      <div className="text-xs text-blue-800 font-bold">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("forms.fields.tables.manager")}
      />
    ),
    cell: ({ row }) => (
      <div className="truncate text-xs text-gray-500">
        {row.getValue("ownerName")}
      </div>
    ),
  },

  {
    accessorKey: "created",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("forms.fields.tables.creationDate")}
      />
    ),
    cell: ({ row }) => (
      <div className="text-xs text-gray-500">
        {formatDate(row.getValue("created"))}
      </div>
    ),
  },

  {
    accessorKey: "form.mainActivities",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("forms.fields.tables.mainActivity")}
      />
    ),
    cell: ({ row }) => (
      <div className="truncate text-xs text-gray-500">
        {"N/A"}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("forms.fields.tables.actions")}
        className="justify-end"
      />
    ),
    cell: ({ row, table }) => (
      <div className="flex justify-end items-center gap-x-2">
        <DeleteWithConfirmationDialog
          buttonClassName="p-0 !w-fit"
          onClick={() => table.options.meta?.deleteRow?.(row.index)}
        />
      </div>
    ),
  },
];

interface BusinessListProps {
  data: BusinessStats[];
  deleteCompany: (id: string[]) => void;
}
export function BusinessList({ data = [], deleteCompany }: BusinessListProps) {
  // States
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Table
  const table = useReactTable({
    data,
    columns: collaboratorsTable,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    meta: {
      deleteRow: (index) => deleteCompany([data[index].id]),
      onClick: console.log,
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
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
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={investmentInstrumentColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
