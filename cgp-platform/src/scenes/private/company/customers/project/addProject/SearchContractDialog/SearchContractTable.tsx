import { StarFilledIcon } from "@radix-ui/react-icons";
import {
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
import { Checkbox } from "primereact/checkbox";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../../../../../../../components";
import { SearchPagination } from "../../../../../../../components/SupportSelection/SearchResultTable";
import { Contract } from "../../../../../../../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../wealth/AssetCreation/LongTermAsset/components/table";

interface SearchContractTableProps {
  data: Contract[];
  isLoading?: boolean;
  pagination?: {
    totalPage: number;
    totalResults: number;
    currentPage: number;
  };
  onSubmit: (contract: Contract) => void;
  setPage?: (page: number) => void;
}

export const SearchContractTable: React.FC<SearchContractTableProps> = ({
  data,
  onSubmit,
  setPage,
  pagination,
}) => {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<Contract>();

  const ContractColumns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => (
          <p className="px-4 rounded-l-lg bg-[#4761C8] text-white">&nbsp;</p>
        ),
        cell: ({ row }) => (
          <Checkbox
            name={row.id}
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.checked)}
            pt={{
              input: {
                className: "!border-black !rounded-lg",
              },
            }}
            aria-label="Select row"
          />
        ),
      }),
      columnHelper.accessor("name", {
        header: () => (
          <p className="min-w-[128px] px-4 bg-[#4761C8] text-white">
            {t("forms.fields.tables.name")}
          </p>
        ),
        cell: ({ getValue, row }) => (
          <p className="min-w-[128px] flex items-center">
            <div className="inline-block w-6">
              {row.original.isSelected && <StarFilledIcon />}
            </div>
            <span>{getValue()}</span>
          </p>
        ),
      }),
      columnHelper.accessor("insuranceCompany", {
        header: () => (
          <p className="min-w-[128px] px-4 bg-[#4761C8] text-white">
            {t("scenes.customers.projects.searchContract.managementCompany")}
          </p>
        ),
        cell: ({ getValue }) => <p className="min-w-[128px]">{getValue()}</p>,
      }),
      columnHelper.accessor("type", {
        header: () => (
          <p className="min-w-[128px] px-4 rounded-r-lg bg-[#4761C8] text-white">
            {t("scenes.customers.projects.searchContract.type")}
          </p>
        ),
        cell: ({ getValue }) => <p className="min-w-[128px]">{getValue()}</p>,
      }),
    ],
    [t, columnHelper, data]
  );

  const table = useReactTable({
    data,
    columns: ContractColumns,
    manualPagination: pagination ? true : false,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    pageCount: pagination?.totalPage,
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
    enableMultiRowSelection: false,
    enableRowSelection: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.id,
  });

  const { pagination: reactPagination } = table.getState();

  useEffect(() => {
    if (setPage) {
      setPage(reactPagination.pageIndex);
    }
  }, [reactPagination.pageIndex]);

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="p-[1px]"
                  >
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
          {table.getRowModel().rows?.length &&
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-[#4761C84D]">
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="py-1" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length > 0 ? (
            <SearchPagination
              setPageIndex={table.setPageIndex}
              nextPage={table.nextPage}
              previousPage={table.previousPage}
              currentPageIndex={table.getState().pagination.pageIndex}
              pageCount={table.getPageCount()}
              totalResults={pagination?.totalResults ?? 0}
            />
          ) : null}
        </div>
        <div className="space-x-2">
          <Button
            label={t("forms.fields.actions.validate")}
            onClick={() => {
              onSubmit(table.getSelectedRowModel().rows[0].original);
            }}
            disabled={!table.getSelectedRowModel().rows.length}
          />
        </div>
      </div>
    </div>
  );
};
