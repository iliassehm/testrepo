import { RowData } from "@tanstack/react-table";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";

import { InvestmentInstrumentTableRow } from ".";
import { formatCurrency } from "../../../../../../../../../helpers";
import { Amount, ManagerStats } from "../../../../../../../../../types";
import { DataTableColumnHeader } from "./data-table-column-header";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    deleteRow?: (rowIndex: number) => void;
    updateData?: (rowIndex: number, value: Partial<TData>) => void;
    deleteManager?: (id: ManagerStats["id"][]) => void;
    onClick?: (rowIndex: number) => void;
    transfersAmount?: number;
  }
}

export const investmentInstrumentColumns = ({
  withoutBuyPrice = false,
  canDelete = true,
  validateTransfersAmount,
}: {
  withoutBuyPrice: boolean;
  canDelete: boolean;
  validateTransfersAmount: (
    index: number,
    newValue: Partial<InvestmentInstrumentTableRow>,
    transfersAmount: number,
    currentData: any
  ) => number;
}): ColumnDef<InvestmentInstrumentTableRow>[] => [
  {
    id: "delete",
    size: 3,
    maxSize: 3,
    cell: ({ row, table }) => {
      if (!canDelete) return null;

      return (
        <button
          className="border-2 border-[#4761C8] rounded-full p-1 flex items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            table.options.meta?.deleteRow?.(row.index);
          }}
        >
          <i
            className="pi pi-times text-[#4761C8]"
            style={{
              fontSize: "0.5rem",
            }}
          />
        </button>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "riskIndicator",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("forms.fields.tables.risk")}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("riskIndicator")
          ? row.getValue("riskIndicator")
          : row.getValue("code") === "XXliquidity"
            ? 1
            : 7}
      </div>
    ),
  },
  {
    accessorKey: "buyingDate",
    header: ({ column }) =>
      !withoutBuyPrice ? (
        <DataTableColumnHeader
          column={column}
          title={t("forms.fields.tables.buyingDate")}
        />
      ) : null,
    cell: ({ row, table }) =>
      !withoutBuyPrice ? (
        <div className="w-[80px]">
          <Calendar
            dateFormat="dd/mm/yy"
            className="w-full text-xs"
            inputClassName="p-1 w-full text-xs"
            onChange={(e) => {
              table.options.meta?.updateData?.(row.index, {
                buyingDate: new Date(e.value as string),
              });
            }}
            value={row.getValue("buyingDate") ?? new Date()}
          />
        </div>
      ) : null,
  },
  {
    accessorKey: "buyingPrice",
    header: !withoutBuyPrice
      ? ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("forms.fields.tables.buyingPrice")}
            className="justify-end"
          />
        )
      : undefined,
    cell: !withoutBuyPrice
      ? (args) => {
          const { amount, quantity, percent } = getComputedValues(args);

          const onChange = (value: number) => {
            const updatedValues = {
              quantity,
              percent,
              amount,
              buyingPrice: value,
            };
            args.table.options.meta?.updateData?.(
              args.row.index,
              updatedValues
            );
          };

          return (
            <div className="w-[120px] ml-auto">
              <InputNumber
                value={args.getValue() as number}
                onChange={(e) => onChange(e.value as number)}
                className="w-full"
                inputClassName="p-1 text-right text-xs"
                mode="currency"
                currency="EUR"
                locale="fr-FR"
                maxFractionDigits={2}
              />
            </div>
          );
        }
      : undefined,
  },
  {
    id: "cours",
    accessorKey: "valuation",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("forms.fields.tables.unitValue")}
        className="justify-end"
      />
    ),
    cell: ({ row, getValue }) => {
      const valuation = getValue() as Amount;

      return (
        <div className="w-[80px] pt-2 text-right ml-auto">
          {formatCurrency(valuation)}
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
      const { valuation, transfersAmount, buyingPrice } =
        getComputedValues(args);

      const onChange = (value: number) => {
        const newQuantity = value;
        const amount =
          valuation?.value && valuation.value > 0
            ? newQuantity * valuation.value
            : buyingPrice && buyingPrice > 0
              ? newQuantity * buyingPrice
              : 0;
        const updatedValues = {
          quantity: value,
          percent: transfersAmount ? (amount * 100) / transfersAmount : 0,
          amount: amount,
          buyingPrice,
        };

        const computedTransfersAmount = validateTransfersAmount(
          args.row.index,
          updatedValues,
          transfersAmount,
          args.table.options.data
        );
        updatedValues.percent = computedTransfersAmount
          ? (amount * 100) / computedTransfersAmount
          : 0;
        args.table.options.meta?.updateData?.(args.row.index, updatedValues);
      };

      const value = args.getValue() as number;

      return (
        <div className="text-right">
          <InputNumber
            value={value}
            onChange={(e) => onChange(Number(e.value))}
            maxFractionDigits={2}
            inputClassName="p-1 text-right text-xs"
            locale="fr-FR"
            className="p-1 w-20 text-right text-xs"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("forms.fields.tables.amount")}
        className="justify-end"
      />
    ),
    cell: (args) => {
      const { valuation, transfersAmount, buyingPrice } =
        getComputedValues(args);

      const onChange = (value: number) => {
        const newAmount = value;
        const updatedValues = {
          quantity:
            newAmount /
            (valuation?.value && valuation.value > 0
              ? valuation?.value
              : buyingPrice && buyingPrice > 0
                ? buyingPrice
                : 1),
          percent:
            transfersAmount > 0 ? (newAmount * 100) / transfersAmount : 0,
          amount: newAmount,
          buyingPrice,
        };
        const computedTransfersAmount = validateTransfersAmount(
          args.row.index,
          updatedValues,
          transfersAmount,
          args.table.options.data
        );
        updatedValues.percent =
          computedTransfersAmount > 0
            ? (newAmount * 100) / computedTransfersAmount
            : 0;
        args.table.options.meta?.updateData?.(args.row.index, updatedValues);
      };

      const value = args.getValue() as number;

      return (
        <div className="w-[120px] text-right ml-auto">
          <InputNumber
            value={value}
            onChange={(e) => onChange(e.value as number)}
            className="w-full"
            inputClassName="p-1 text-right text-xs"
            mode="currency"
            currency="EUR"
            locale="fr-FR"
            maxFractionDigits={2}
          />
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
      const { valuation, transfersAmount, buyingPrice } =
        getComputedValues(args);

      const onChange = (value: number) => {
        let newPercent = value;
        if (newPercent > 100) newPercent = 100;
        const newAmount = (newPercent * transfersAmount) / 100;
        const newQuantity =
          newAmount /
          (valuation?.value && valuation?.value > 0
            ? valuation?.value
            : buyingPrice && buyingPrice > 0
              ? buyingPrice
              : 1);
        const updatedValues = {
          quantity: newQuantity,
          percent: newPercent,
          amount: newAmount,
          buyingPrice,
        };
        args.table.options.meta?.updateData?.(args.row.index, updatedValues);
      };

      const value = args.getValue() as number;

      return (
        <div className="text-right">
          <InputNumber
            value={value}
            type="percent"
            onChange={(e) => onChange(Number(e.value))}
            inputClassName="p-1 text-right text-xs"
            className="w-20"
            maxFractionDigits={2}
            max={100}
            locale="fr-FR"
          />
        </div>
      );
    },
  },
];

function getComputedValues(
  args: CellContext<InvestmentInstrumentTableRow, unknown>
) {
  const quantity: number = args.row.getValue("quantity");
  const percent: number = args.row.getValue("percent");
  const amount: number = args.row.getValue("amount");
  const buyingPrice: number = args.row.getValue("buyingPrice");

  const transfersAmount = args.table.options.meta?.transfersAmount || 1;

  const valuation: Amount = args.row.original.valuation ?? {
    value: args.row.getValue("buyingPrice") ?? 0,
    instrument: "EUR",
  };

  const computedAmount = amount ? Number(amount) : 0;
  const computedPercent = percent ? Number(percent) : 0;
  const computedQuantity = quantity ? Number(quantity) : 0;
  const computedValuation = valuation?.value ? valuation.value : 0;
  const computedBuyingPrice = buyingPrice ? Number(buyingPrice) : 0;

  return {
    quantity,
    percent,
    amount,
    buyingPrice,
    transfersAmount,
    valuation,
    computedPercent,
    computedQuantity,
    computedAmount,
    computedBuyingPrice,
    computedValuation,
  };
}
