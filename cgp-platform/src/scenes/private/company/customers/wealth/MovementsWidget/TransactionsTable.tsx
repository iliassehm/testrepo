import { ColumnDef, PaginationState } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { DataTable } from "../../../../../../components/DataTable";
import { Transaction } from "../../../../../../types";
import { CrudActions } from "../../conformity/ged/components/gedContent";

interface TransactionsTableProps {
  data: Transaction[];
  pagination?: PaginationState;
  setPagination?: (pagination: PaginationState) => void;
  onDelete: (id: Transaction) => void;
  onUpdate: (data: Transaction) => void;
  pageCount?: number;
  totalItems?: number;
  isLoading?: boolean;
}
export const TransactionsTable = ({
  data,
  pagination,
  pageCount,
  totalItems,
  isLoading,
  onDelete,
  onUpdate,
  setPagination,
}: TransactionsTableProps) => {
  const { t } = useTranslation();
  const MovementColomns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        id: "date",
        header: () => (
          <div className="text-left">
            {t("scenes.wealth.transactions.date")}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-left">
            {new Date(row.original.date).toLocaleDateString()}
          </div>
        ),
      },
      {
        id: "typeOperation",
        header: () => (
          <div className="text-left">
            {t("scenes.wealth.transactions.typeOperation")}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-left overflow-ellipsis ">
            {row.original.typeOperation}
          </div>
        ),
      },
      {
        id: "value",
        header: () => (
          <span className="w-30">{t("scenes.wealth.transactions.amount")}</span>
        ),
        cell: ({ row }) => (
          <span className="w-30">
            {row.original.value?.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </span>
        ),
      },
      {
        id: "actions",
        maxSize: 20,
        cell: ({ row, table }) => (
          <span className="flex justify-end">
            <CrudActions
              onDelete={() => table.options.meta?.deleteRow?.(row.index)}
              onEdit={() =>
                table.options.meta?.updateData?.(row.index, row.original)
              }
            />
          </span>
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      data={data}
      meta={{
        deleteRow: (index) => {
          const element = data[index];
          if (!element) return;

          onDelete(element);
        },
        updateData: (index) => {
          const element = data[index];
          if (!element) return;

          onUpdate(element);
        },
      }}
      columns={MovementColomns}
      pagination={pagination}
      setPagination={setPagination}
      pageCount={pageCount}
      rowCount={totalItems}
      isLoading={isLoading}
      className="w-full h-min rounded-lg shadow-lg [&>*:first-child]:flex-1"
    />
  );
};
