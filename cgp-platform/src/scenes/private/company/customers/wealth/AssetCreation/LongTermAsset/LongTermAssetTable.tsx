import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { LongTermAssetFormData } from ".";
import { Button, Text } from "../../../../../../../components";
import { SupportCreationDialog } from "../../../../../../../components/SupportSelection/SupportCreationDialog";
import SupportSelectionDialog from "../../../../../../../components/SupportSelection/SupportSelectionDialog";
import { numberFormat } from "../../../../../../../helpers";
import { InvestmentValues } from "../../../../../../../types";
import { LongTermAssetType } from "../AssetCreation";
import {
  InvestmentInstrumentTable,
  InvestmentInstrumentTableRow,
} from "./components/data-table";

export interface InvestmentTablePercentOrAmountCalc {
  amount: number;
  percent: number;
}
export interface InvestmentTableCalcState {
  [index: number]: InvestmentTablePercentOrAmountCalc;
}

interface LongTermAssetTableProps {
  form: UseFormReturn<LongTermAssetFormData, unknown, undefined>;
  type: LongTermAssetType;
  totalFees: number;
  investmentList: InvestmentInstrumentTableRow[];
  onSubmit: (values: InvestmentValues[]) => void;
}
export function LongTermAssetTable(props: LongTermAssetTableProps) {
  const { t } = useTranslation();

  const [showDialog, setShowDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const [selectedInstruments, setSelectedInstruments] = useState<
    InvestmentInstrumentTableRow[]
  >(props.investmentList);

  const value = props.form.watch("value");
  const totalFees = props.totalFees;

  const transfersAmount = value - totalFees;

  const totalAmount = selectedInstruments.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  const onDataSubmit = () => {
    const newData = selectedInstruments.map((val) => {
      const { amount, percent, ...rest } = val;
      void percent;
      void amount;
      return {
        ...rest,
        valuation: {
          value: amount,
          instrument: rest.valuation?.instrument ?? "EUR",
        },
      };
    });
    const liquidity = transfersAmount - totalAmount;

    if (liquidity > 0) {
      newData.push({
        code: "XXliquidity",
        label: "Liquidités",
        quantity: 0,
        buyingPrice: 0,
        date: new Date(),
        valuation: {
          value: liquidity,
          instrument: "EUR",
        },
      });
    }

    props.onSubmit(newData);
  };

  return (
    <div className="flex flex-col gap-4">
      <Header onClick={() => setShowDialog(true)} />
      <InvestmentInstrumentTable
        data={selectedInstruments}
        setData={setSelectedInstruments}
        transfersAmount={value - totalFees}
        setTransfersAmount={(val) => props.form.setValue("value", val)}
        addRow={() => (
          <div className="flex justify-center mb-2">
            <button
              type="button"
              className="text-xs opacity-50 py-2"
              onClick={(e) => {
                e.preventDefault();
                setShowCreateDialog(true);
              }}
            >
              + {t("scenes.customers.projects.addSupport")}
            </button>
          </div>
        )}
        footer={() => (
          <div className="flex justify-end">
            <div>
              <div className="flex flex-col p-2 text-right text-blue-800">
                <Text label="scenes.customers.projects.fee" />
                <Text label="scenes.customers.projects.investAmount" />
                <Text label="scenes.customers.projects.remainingLiquidity" />
              </div>
            </div>
            <div>
              <div className="flex flex-col p-2 text-right text-blue-800">
                <Text label={numberFormat(totalFees)} />
                <Text label={numberFormat(value - totalFees)} />
                <Text label={numberFormat(value - totalFees - totalAmount)} />
              </div>
            </div>
          </div>
        )}
      />
      <div className="flex justify-end">
        <Button type="button" label="Valider" onClick={onDataSubmit} />
      </div>
      <SupportSelectionDialog
        hide={() => setShowDialog(false)}
        open={showDialog}
        type={props.type}
        initialData={selectedInstruments}
        onSubmit={(data) =>
          setSelectedInstruments(
            (data as InvestmentInstrumentTableRow[]).map((d) => ({
              ...d,
              percent: d.percent ?? 0,
              quantity: d.quantity ?? 0,
              amount: d.amount ?? 0,
              buyingPrice: d.buyingPrice ?? d.valuation?.value ?? 0,
              valuation: {
                value: d.valuation?.value ?? d.buyingPrice ?? 0,
                instrument: d.valuation?.instrument ?? "EUR",
              },
            }))
          )
        }
      />
      {showCreateDialog && (
        <SupportCreationDialog
          hide={() => setShowCreateDialog(false)}
          onSubmit={(data) =>
            setSelectedInstruments((val) => [
              ...val,
              {
                ...data,
                buyingPrice: data.valuation.value,
                percent: 0,
                quantity: 0,
                amount: 0,
              },
            ])
          }
        />
      )}
    </div>
  );
}

interface HeaderProps {
  onClick: () => void;
}
function Header({ onClick }: HeaderProps) {
  return (
    <div className="flex justify-end">
      <div>
        <Button type="button" label="Choix supports" onClick={onClick} />
      </div>
    </div>
  );
}
