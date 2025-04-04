import { TFunction } from "i18next";

import { MidPie } from "../../../../../components/MidPie";
import { percentFormatter } from "../../../../../helpers";

interface StatsProps {
  conformityPercentage: number;
  t: TFunction;
}

export function ConformityStats({ t, conformityPercentage = 0 }: StatsProps) {
  return (
    <MidPie
      legendSide="bottom"
      centeredText={
        t("scenes.customers.conformity.conformity.percent_conformity", {
          percent: percentFormatter.format(conformityPercentage),
        }) as string
      }
      colors={["#319641", "#889631", "#967931", "#DDC12E", "#4761C8"]}
      data={[
        {
          id: "conform",
          label: "conform",
          value: conformityPercentage * 100,
        },
      ]}
    />
  );
}
