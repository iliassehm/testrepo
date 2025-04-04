import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { DataTable } from "../../../../../../components/DataTable";
import { ActivityByYear } from "../../../../../../types";
import { CrudActions } from "../../conformity/ged/components/gedContent";
import { formatCurrency } from "../../../../../../helpers";

interface ActivitiesTableProps {
  data: ActivityByYear[];
  pagination?: PaginationState;
  setPagination?: (pagination: PaginationState) => void;
  pageCount?: number;
  totalItems?: number;
  isLoading?: boolean;
  onUpdate: (data: ActivityByYear) => void;
}
export const ActivitiesTable = ({
  data,
  pagination,
  setPagination,
  pageCount,
  totalItems,
  isLoading,

  onUpdate,
}: ActivitiesTableProps) => {
  const { t } = useTranslation();
  const ContractPerformanceColomns = useMemo<ColumnDef<ActivityByYear>[]>(
    () => [
      {
        id: "year",
        header: t("scenes.wealth.activities.years"),
        cell: ({ row }) => row.original.year,
      },
      {
        id: "startValue",
        header: t("scenes.wealth.activities.startValue"),
        cell: ({ row }) =>
          row.original.startValue ? formatCurrency({ value: +row.original.startValue }) : "-",
      },
      {
        id: "endValue",
        header: t("scenes.wealth.activities.endValue"),
        cell: ({ row }) =>
          row.original.endValue ? formatCurrency({ value: +row.original.endValue }) : "-",
      },
      {
        id: "performance",
        header: t("scenes.wealth.activities.performance"),
        cell: ({ row }) => {
          if (!row.original.endValue) return "-";

          return (
            <div className="flex flex-col items-end">
              <span>
                {row.original.performance?.gain?.value != undefined && (
                  <>
                    {row.original.performance.gain.value > 0 ? "+" : ""}
                    {row.original.performance.gain.value.toLocaleString(
                      "fr-FR",
                      {
                        style: "currency",
                        currency: "EUR",
                        maximumFractionDigits: 2,
                      }
                    )}
                  </>
                )}
              </span>
              {row.original.performance?.evolution != undefined && (
                <span
                  className={`text-xs ${row.original.performance.evolution > 0 ? "text-green-600" : "text-[#D9342B]"}`}
                >
                  {row.original.performance.evolution > 0 ? "+" : ""}
                  {row.original.performance.evolution.toLocaleString("fr-FR", {
                    style: "percent",
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        maxSize: 20,
        cell: ({ row, table }) => (
          <span className="flex justify-end">
            <CrudActions
              // Uncomment when backend is ready
              // onDelete={() => table.options.meta?.deleteRow?.(row.index)}
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
      columns={ContractPerformanceColomns}
      pagination={pagination}
      setPagination={setPagination}
      pageCount={pageCount}
      rowCount={totalItems}
      isLoading={isLoading}
      className="w-full h-min rounded-lg shadow-lg flex-1"
      meta={{
        updateData: (index) => {
          const element = data[index];
          if (element) onUpdate(element);
        },
      }}
    />
  );
};
