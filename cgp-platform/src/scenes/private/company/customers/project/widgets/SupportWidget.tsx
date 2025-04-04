import { use } from "i18next";
import { useEffect, useMemo, useState } from "react";
import { Control, useController, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  arbitrationFeesSchemaCIF,
  complementaryFeesSchemaCIF,
  feesSchema,
  feesSchemaArbitrage,
  feesSchemaInsurance,
  feesSchemaRedemption,
  feesSchemaSubscriptionCIF,
  investmentSchema,
} from "../../../../../../../shared/schemas/project";
import { Button, Text } from "../../../../../../components";
import { SupportCreationDialog } from "../../../../../../components/SupportSelection/SupportCreationDialog";
import SupportSelectionDialog from "../../../../../../components/SupportSelection/SupportSelectionDialog";
import { numberFormat } from "../../../../../../helpers";
import { calculateFees } from "../../../../../../helpers/calculateFees";
import { AssetGroup, InvestmentInstrument } from "../../../../../../types";
import {
  InvestmentInstrumentTable,
  InvestmentInstrumentTableRow,
} from "../../wealth/AssetCreation/LongTermAsset/components/data-table";

type InvestmentFormValues = z.infer<typeof investmentSchema>;
type FeesSchemaType = z.infer<typeof feesSchema>;
type FeesSchemaAbitrageCIFType = z.infer<typeof arbitrationFeesSchemaCIF>;
type FeesSchemaComplementaryCIFType = z.infer<
  typeof complementaryFeesSchemaCIF
>;
type FeesSchemaInsuranceType = z.infer<typeof feesSchemaInsurance>;
type FeesSchemaArbitrageType = z.infer<typeof feesSchemaArbitrage>;
type FeesSchemaSubscriptionCIFType = z.infer<typeof feesSchemaSubscriptionCIF>;
type FeesSchemaRedemptionType = z.infer<typeof feesSchemaRedemption>;

// UseFormReturn<z.infer<typeof insuranceSubscription>>;
interface SupportWidgetProps<
  T extends { investments: InvestmentFormValues[] },
> {
  control: Control<T>;
  transfersAmount: number;
  setTransfersAmount: (val: number) => void;
  setRemainingAmount: (val: number) => void;
  fees:
    | FeesSchemaType
    | FeesSchemaAbitrageCIFType
    | FeesSchemaComplementaryCIFType
    | FeesSchemaInsuranceType
    | FeesSchemaArbitrageType
    | FeesSchemaSubscriptionCIFType
    | FeesSchemaRedemptionType;
  feesType:
    | "cif"
    | "complementaryInsurance"
    | "complementaryCif"
    | "insurance"
    | "arbitrage"
    | "arbitrageCif"
    | "redemption"
    | "default";
  customFees?: any[];
}
export function SupportWidget<
  T extends { investments: InvestmentFormValues[] },
>({
  control,
  transfersAmount,
  setTransfersAmount,
  setRemainingAmount,
  fees,
  feesType,
  customFees,
}: SupportWidgetProps<T>) {
  const [showDialog, setShowDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { t } = useTranslation();
  const { field } = useController({
    name: "investments" as any,
    control,
  });

  const { openFees } = calculateFees(
    transfersAmount,
    fees,
    feesType,
    customFees
  );

  const investments = useMemo(() => {
    return field.value as InvestmentFormValues[];
  }, [field.value]);
  const investedAmount =
    investments?.reduce((acc, cur) => acc + (cur.amount ?? 0), 0) ?? 0;

  setRemainingAmount(transfersAmount - openFees - investedAmount);
  return (
    <>
      <SupportSelectionDialog
        hide={() => setShowDialog(false)}
        open={showDialog}
        type={AssetGroup.LifeInsuranceCapitalization} // change type?
        initialData={investments as InvestmentInstrument[]}
        onSubmit={(data) =>
          field.onChange(
            (data as InvestmentInstrumentTableRow[]).map((d) => ({
              ...d,
              percent: d.percent ?? 0,
              quantity: d.quantity ?? 0,
              amount: d.amount ?? 0,
              buyingPrice: d.buyingPrice ?? d.valuation?.value ?? 0,
            }))
          )
        }
      />
      <div className="w-full flex justify-between mb-4">
        <h1 className="text-[#4761C8] font-bold text-xl ">
          {t("scenes.customers.projects.chooseSupports")}
        </h1>
        <Button
          type="button"
          label="scenes.customers.projects.chooseSupports"
          className="text-sm"
          onClick={() => setShowDialog(true)}
        />
      </div>
      <InvestmentInstrumentTable
        data={field.value ?? []}
        setData={field.onChange}
        transfersAmount={transfersAmount - openFees}
        setTransfersAmount={setTransfersAmount}
        withoutBuyPrice
        addRow={() => (
          <div className="flex justify-center mb-2">
            <button
              type="button"
              className="text-xs opacity-50 py-2"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowCreateDialog(true);
              }}
            >
              {t("scenes.customers.projects.addSupport")}
            </button>
          </div>
        )}
        footer={() => (
          <div className="flex justify-end">
            <div>
              <div className="flex flex-col p-2 text-right text-blue-800">
                <Text label="scenes.customers.projects.transfer" />
                <Text label="scenes.customers.projects.fee" />
                <Text label="scenes.customers.projects.remainingAmount" />
                <Text label="scenes.customers.projects.netInvestment" />
              </div>
            </div>
            <div>
              <div className="flex flex-col p-2 text-right text-blue-800">
                <Text label={numberFormat(transfersAmount)} />
                <Text label={numberFormat(openFees)} />

                <Text
                  label={numberFormat(
                    transfersAmount - openFees - investedAmount
                  )}
                />
                <Text label={numberFormat(investedAmount)} />
              </div>
            </div>
          </div>
        )}
      />
      {showCreateDialog && (
        <SupportCreationDialog
          visible={showCreateDialog}
          hide={() => setShowCreateDialog(false)}
          onSubmit={(data) =>
            field.onChange([
              ...(field.value ?? []),
              {
                ...data,
                percent: 0,
                quantity: 0,
                amount: 0,
                buyingPrice: 0,
              },
            ])
          }
        />
      )}
    </>
  );
}
