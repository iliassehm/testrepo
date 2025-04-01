import { Link, useParams } from "@tanstack/react-router";
import { t } from "i18next";
import React from "react";

import {
  DataType,
  DataTypeValue,
} from "../../../../../../components/Table/tableTypes";
import { clsx, formatCurrency } from "../../../../../../helpers";
import {
  AssetGroup,
  CustomerInvestment,
  Performance,
  SortDirection,
} from "../../../../../../types";
import {
  formatField,
  percentageCalculation,
  percentageDisplay,
  TableHead,
  totalCalculation,
  totalDisplay,
  useSortableData,
} from "./investmentTableUtils";

interface Props {
  data: CustomerInvestment[];
  group: AssetGroup;
}

export type TotalRow = {
  valuation: number;
  total: {
    evolution: number;
    gain: number;
  };
  percent: number;
};

export function alignTable(type: DataTypeValue, field?: string) {
  if (field === "quantity") return "text-right";
  switch (type) {
    case "amount":
    case "number":
    case "percent":
    case "date":
      return "text-right";
    case "pdf":
      return "text-center";
    default:
      return "text-left";
  }
}

export function InvestmentTable({ data, group }: Props) {
  const {
    data: sortedData,
    sortConfig,
    setSortConfig,
  } = useSortableData({ initialData: data, shouldGroupByCategory: true });

  const dataType: Record<string, DataType> = {
    code: { type: "string", sortable: true },
    label: { type: "string", sortable: true },
    sri: { type: "string", sortable: true },
    quantity: { type: "string", sortable: true },
    unitValue: {
      type: "number",
      sortable: true,
      ...(group === AssetGroup.RockPaper
        ? { field: "investmentInstrument.metadata.partRetrait" }
        : {}),
    },
    unitPrice: { type: "number", sortable: true },
    dateValue: { type: "date", sortable: true },
    valuation: { type: "amount", sortable: true },
    percent: { type: "percent", sortable: true },
    dateValuation: { type: "date", sortable: true },
    total: { type: "amount", sortable: true },
    dic: { type: "pdf", field: "investmentInstrument.dic" },
    prospectus: { type: "pdf", field: "investmentInstrument.prospectus" },
  };

  const handleSort = (key: keyof CustomerInvestment) => {
    for (const k of Object.keys(dataType)) {
      if (k !== key) {
        dataType[k].sortOrder = undefined;
      }
    }

    const currentSortOrder =
      dataType[key as string].sortOrder || SortDirection.Asc;
    const nextSortOrder: SortDirection =
      currentSortOrder === SortDirection.Asc
        ? SortDirection.Desc
        : SortDirection.Asc;
    dataType[key as string].sortOrder = nextSortOrder;

    setSortConfig({ key, sortOrder: nextSortOrder });
  };

  const totalValuation = data.reduce(
    (acc, curr) => acc + curr.valuation.value,
    0
  );

  for (const row of sortedData) {
    row.sri = row.riskIndicator?.toString() || "";
  }

  return (
    <table className="w-full overflow-hidden rounded-lg shadow-lg">
      <thead>
        <TableHead
          translationPrefix="forms.fields.tables.investments"
          dataType={dataType}
          handleSort={handleSort}
          sortKey={sortConfig?.key}
        />
      </thead>
      <tbody>
        <TableBody data={sortedData} dataType={dataType} />
      </tbody>

      <tfoot className="h-16 border-t bg-blue-300/5">
        <CustomRow
          title={"Total des titres"}
          valuation={totalValuation}
          percent={1}
        />
      </tfoot>
    </table>
  );
}

interface TableBodyProps {
  data: CustomerInvestment[];
  dataType: Record<string, DataType>;
}

function TableBody({ data, dataType }: TableBodyProps) {
  const groupedData = data.reduce(
    (acc: Record<string, CustomerInvestment[]>, row) => {
      const category = row.category || "forms.fields.tables.uncategorized";
      acc[category] = acc[category] ? [...acc[category], row] : [row];
      return acc;
    },
    {}
  );

  const totalValuation = Object.keys(groupedData).reduce(
    (acc, curr) =>
      acc +
      groupedData[curr].reduce((acc, curr) => acc + curr.valuation.value, 0),
    0
  );

  const params = useParams({
    from: "/company/$companyId/customer/$customerId/wealth",
  });

  return (
    <>
      {Object.keys(groupedData).map((category) => {
        const group = groupedData[category];
        const groupValuation = group.reduce(
          (acc, curr) => acc + curr.valuation.value,
          0
        );
        const groupPerecnt = percentageCalculation(
          groupValuation,
          totalValuation
        );

        return (
          <React.Fragment key={`category-${category}`}>
            {groupedData[category].map((row) => (
              <tr key={`${category}-${row.id}`} className="border-t">
                {Object.keys(dataType).map((field) => {
                  const data = dataType[field];

                  const value = formatField({
                    field: data.field || field,
                    type: data.type,
                    totalRow: {
                      valuation: totalValuation,
                      total: totalCalculation(row),
                      percent: groupPerecnt,
                    },
                    row,
                  });
                  return (
                    <td
                      key={field}
                      className={clsx(
                        "h-14 border-b border-r border-slate-100 p-2 text-left text-xs text-grey-700",
                        alignTable(data.type, field)
                      )}
                    >
                      {typeof value === "string" && value.startsWith("XX") ? (
                        "-"
                      ) : field === "code" ? (
                        <Link
                          to="/company/$companyId/customer/$customerId/wealth/instrument/$instrumentCode"
                          params={{
                            companyId: params.companyId,
                            customerId: params.customerId as string,
                            instrumentCode: value,
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          {value}
                        </Link>
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <CustomRow
              className="bg-blue-300/5"
              title={category}
              valuation={groupValuation}
              percent={groupPerecnt}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}

interface CustomRowProps {
  title: string;
  valuation: number;
  percent: number;
  className?: string;
  performance?: Performance;
}

function CustomRow({
  title,
  valuation,
  percent,
  performance,
  className,
}: CustomRowProps) {
  const showPerformance = performance && performance.gain !== 0;

  return (
    <tr
      className={clsx(
        "text-xs",
        showPerformance ? "font-bold" : "font-bold",
        className
      )}
    >
      <td colSpan={1} />
      <td className="p-2">{t(title)}</td>
      <td colSpan={5} />
      <td className="p-2 text-right">
        {formatCurrency(
          { value: valuation },
          {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }
        )}
      </td>
      <td className="p-2 text-right">{percentageDisplay(percent)}</td>
      <td colSpan={performance ? 1 : 2} />
      {performance && (
        <td className="p-2 text-right">
          {totalDisplay(performance.gain, performance.evolution || 0)}
        </td>
      )}
    </tr>
  );
}
