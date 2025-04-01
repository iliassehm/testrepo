import i18next from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";

import DoubleLabel from "../../../../../../components/DoubleLabels/DoubleLabels";
import { NumericInput } from "../../../../../../components/editable-cell/numeric-input";
import type {
  DataTypeValue,
  TableProps,
} from "../../../../../../components/Table/tableTypes";
import {
  clsx,
  formatCurrency,
  formatDate,
  getNestedValue,
  numberFormat,
} from "../../../../../../helpers";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import {
  type CustomerInvestment,
  SortDirection,
} from "../../../../../../types";
import { WealthLogic } from "../wealth.logic";
import { alignTable, type TotalRow } from "./investmentTable";

interface FormatField {
  field: string;
  type: DataTypeValue;
  row: CustomerInvestment;
  totalRow: TotalRow;
}

export function formatField({ type, row, field, totalRow }: FormatField) {
  const value = getNestedValue(row, field) as any;
  if (field === "total") return totalTemplate(row);
  if (field === "percent")
    return percentageTemplate(row.valuation.value, totalRow.valuation);
  if (field === "sri") return <SriTemplate investment={row} value={value} />;
  if (value === undefined) return "-";

  switch (type) {
    case "amount":
      return formatCurrency(value, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    case "date":
      return formatDate(value as Date);
    case "number":
      return numberFormat(value, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    case "pdf":
      if (!value) return "-";
      return (
        value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center p-1"
          >
            <img src="/svg/pdf-upload.svg" alt={value} className="w-5" />
          </a>
        )
      );
    default:
      return typeof value === "number" ? value.toFixed(2) : (value as string);
  }
}

// Table utils
export interface DataType {
  type: DataTypeValue;
  sortable?: boolean;
  sortOrder?: SortDirection;
  field?: string;
  className?: string;
}
interface TableHeadProps<T> {
  dataType: TableProps<T>["dataType"];
  translationPrefix: string;
  handleSort: (key: keyof T) => void;
  sortKey?: keyof T;
}
export function TableHead<T>({
  dataType,
  sortKey,
  translationPrefix,
  handleSort,
}: TableHeadProps<T>) {
  const { t } = useTranslation();

  return (
    <tr>
      {Object.keys(dataType).map((field) => {
        const data = dataType[field];
        let sortIcon = "";
        if (data.sortable && sortKey === field) {
          sortIcon = data.sortOrder === SortDirection.Asc ? "↑" : "↓";
        }

        return (
          <th
            key={field}
            className={clsx(
              "cursor-pointer bg-stone-100 p-2 text-left text-sm text-slate-600",
              alignTable(data.type as DataTypeValue, field)
            )}
            onClick={() => data.sortable && handleSort(field as keyof T)}
          >
            {t(`${translationPrefix}.${field}`)} {sortIcon}
          </th>
        );
      })}
    </tr>
  );
}
export const useSortableData = <T,>({
  initialData = [],
  shouldGroupByCategory = false,
}: {
  initialData: T[];
  shouldGroupByCategory?: boolean;
}) => {
  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    sortOrder: SortDirection;
  } | null>(null);

  function sort(data: T[]) {
    if (sortConfig !== null) {
      data.sort((a, b) => {
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.sortOrder === SortDirection.Asc ? 1 : -1;
        }
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.sortOrder === SortDirection.Asc ? -1 : 1;
        }
        return 0;
      });
    }

    return data;
  }

  useEffect(() => {
    let sortedData: T[] = [];
    if (shouldGroupByCategory) {
      const groupedData = groupByCategory(initialData);
      for (const category of Object.keys(groupedData)) {
        groupedData[category] = sort(groupedData[category]);
      }
      sortedData = Object.values(groupedData).flat();
    } else {
      sortedData = sort(data);
    }

    setData(sortedData);
  }, [sortConfig, initialData, shouldGroupByCategory]);

  return { data, sortConfig, setSortConfig };
};

function groupByCategory<T>(data: T[]) {
  return data.reduce((acc: Record<string, T[]>, row) => {
    const category = (row["category" as keyof T] || "other") as string;
    acc[category] = acc[category] ? [...acc[category], row] : [row];
    return acc;
  }, {});
}

// Calculations

export function percentageCalculation(
  valuation: number,
  totalValuation: number
) {
  let value = 0;

  if (valuation && totalValuation) {
    value = (valuation * 100) / totalValuation / 100;
  }

  return value;
}

export function totalCalculation(investment: CustomerInvestment) {
  if (
    !investment ||
    !investment.quantity ||
    !investment.unitPrice ||
    !investment.unitValue
  )
    return {
      evolution: 0,
      gain: 0,
    };

  const currentPrice = investment.quantity * investment.unitValue;
  const buyPrice = investment.quantity * investment.unitPrice;
  const gain = currentPrice - buyPrice;

  const evolution = currentPrice / buyPrice - 1;

  return {
    evolution,
    gain,
  };
}

// Templates

export function percentageTemplate(valuation: number, totalValuation: number) {
  const value = percentageCalculation(valuation, totalValuation);

  return percentageDisplay(value);
}
export function totalTemplate(investment: CustomerInvestment) {
  const { evolution, gain } = totalCalculation(investment);

  if (!evolution && !gain) return "-";

  return totalDisplay(gain, evolution);
}

export function SriTemplate({
  investment,
  value,
}: {
  investment: CustomerInvestment;
  value: number;
}) {
  return (
    <div>
      <SriInputTemplate investmentId={investment.id} sri={value} />
    </div>
  );
}

// Display
export function percentageDisplay(value: number) {
  return Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function totalDisplay(gain: number, evolution: number) {
  return (
    <div className="flex flex-col items-end justify-center gap-1">
      <DoubleLabel
        data={{
          gain: {
            value: gain,
            instrument: "EUR",
          },
        }}
        className="text-md"
        displayValue="gain"
      />
      <DoubleLabel
        data={{
          gain: {
            value: gain,
            instrument: "EUR",
          },
          evolution,
        }}
        className="text-md"
        displayValue="evolution"
      />
    </div>
  );
}

export function SriInputTemplate({
  investmentId,
  sri,
}: {
  investmentId: string;
  sri: number;
}) {
  const toast = useToast();

  const sriUpdate = useMutation(
    async (input: { id: string; riskIndicator: number }) => {
      return gql.client.request(
        WealthLogic.customerWalletInvestmentSriUpdate(),
        {
          id: input.id,
          riskIndicator: Number(input.riskIndicator),
        }
      );
    },
    {
      onSuccess: () => {
        toast.current?.show({
          severity: "success",
          detail: i18next.t("forms.fields.notifications.success.save"),
        });
      },
      onError: () => {
        toast.current?.show({
          severity: "error",
          detail: i18next.t("forms.fields.notifications.error.save"),
        });
      },
    }
  );

  return (
    <NumericInput
      value={sri}
      onChange={(value) =>
        sriUpdate.mutate({ id: investmentId, riskIndicator: value })
      }
    />
  );
}
