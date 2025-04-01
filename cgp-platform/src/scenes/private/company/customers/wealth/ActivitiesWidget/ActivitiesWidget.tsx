import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AssetIcon, Text } from "../../../../../../components";
import { Info } from "../../../../../../components/info";
import {
  AssetGroup,
  CustomerWallet,
  Performance,
} from "../../../../../../types";
import { Label } from "../../../../../../UIComponents/Label/Label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../../UIComponents/RadioGroup/RadioGroup";
import { ActivitiesGraph } from "./ActivitiesGraph";
import { PerformanceGraph } from "./PerformanceGraph";

interface ActivitiesWidgetProps {
  wallet: CustomerWallet;
  assetId: string;
  assetType?: AssetGroup;
  name?: string;
}

enum ActivityGraphType {
  EVOLUTION = "EVOLUTION",
  PERFORMANCE = "PERFORMANCE",
}

export const ActivitiesWidget = ({
  wallet,
  assetId,
  assetType,
  name,
}: ActivitiesWidgetProps) => {
  const { t } = useTranslation();
  const [activityGraphType, setActivityGraphType] = useState<ActivityGraphType>(
    ActivityGraphType.EVOLUTION
  );
  const [performance, setPerformance] = useState<Performance>({
    gain: 0,
    evolution: 0,
  });

  const onPerformanceChange = (performance: Performance) => {
    setPerformance(performance);
  };

  const displayPerformanceRadio = (infoCalPerf: string) => {
    if (infoCalPerf === "Cal performance impossible") {
      return null;
    }

    return (
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          id="activityGraphType-performance"
          value={ActivityGraphType.PERFORMANCE}
          className="bg-white"
        />
        <Label
          htmlFor="activityGraphType-performance"
          className="cursor-pointer"
        >
          {t(`scenes.wealth.activities.performance`)}
        </Label>
        {infoCalPerf !== "valide" && <Info text="info.performance" />}
      </div>
    );
  };
  return (
    <div className="relative flex w-full flex-col gap-4 overflow-hidden rounded-xl bg-white p-5 drop-shadow-xl">
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-DMSansBold text-l text-blue-1100 md:text-xl">
          {t("scenes.wealth.activities.title")}
        </h1>
        {wallet.mixedData?.irrCalculations?.globalRealizedGain != null && (
          <div className="ml-auto">
            <RadioGroup
              onValueChange={(value) =>
                setActivityGraphType(value as ActivityGraphType)
              }
              value={activityGraphType}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id="activityGraphType-evolution"
                  value={ActivityGraphType.EVOLUTION}
                  className="bg-white"
                />
                <Label
                  htmlFor="activityGraphType-evolution"
                  className="cursor-pointer"
                >
                  {t(`scenes.wealth.activities.evolution`)}
                </Label>
              </div>
              {wallet.mixedData?.irrCalculations?.infoCalPerf &&
                displayPerformanceRadio(
                  wallet.mixedData?.irrCalculations?.infoCalPerf
                )}
            </RadioGroup>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex gap-2 items-center h-9">
          {assetType && <AssetIcon assetName={assetType} />}
          {name && (
            <div className="flex flex-col items-start justify-center">
              <Text
                as="span"
                label={name}
                className="font-DMSansBold text-lg underline tracking-tight text-blue-1100 "
              />
            </div>
          )}
        </div>
        {activityGraphType === ActivityGraphType.EVOLUTION ? (
          <div className="flex flex-col items-end justify-center">
            <span className="font-DMSansBold text-lg text-blue-1100">
              {performance.gain >= 0 ? "+" : ""}
              {performance.gain.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            {performance.evolution !== undefined && (
              <span
                className={
                  performance.evolution! > 0 ? "text-green-500" : "text-red-500"
                }
              >
                {performance.evolution! >= 0 ? "+" : ""}
                {performance.evolution!.toLocaleString("fr-FR", {
                  style: "percent",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-end justify-center">
            <span className="font-DMSansBold text-lg text-blue-1100">
              {wallet.mixedData?.irrCalculations?.globalRealizedGain &&
              wallet.mixedData.irrCalculations.globalRealizedGain >= 0
                ? "+"
                : ""}
              {wallet.mixedData?.irrCalculations?.globalRealizedGain?.toLocaleString(
                "fr-FR",
                {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              ) ?? "N/A"}
            </span>
            {wallet.mixedData?.irrCalculations?.globalIrr != null && (
              <span
                className={
                  wallet.mixedData.irrCalculations.globalIrr! > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {wallet.mixedData.irrCalculations.globalIrr! >= 0 ? "+" : ""}
                {wallet.mixedData.irrCalculations.globalIrr!.toLocaleString(
                  "fr-FR",
                  {
                    style: "percent",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 md:flex-row w-full justify-start">
        {activityGraphType === ActivityGraphType.EVOLUTION ? (
          <ActivitiesGraph
            assetId={assetId}
            assetName={name}
            onPerformanceChange={onPerformanceChange}
          />
        ) : (
          <PerformanceGraph assetId={wallet.id} assetName={name} />
        )}
      </div>
    </div>
  );
};
