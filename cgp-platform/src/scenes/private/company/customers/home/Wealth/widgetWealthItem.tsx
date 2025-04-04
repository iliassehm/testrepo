import React from "react";

import DoubleLabel from "../../../../../../components/DoubleLabels/DoubleLabels";
import { Text } from "../../../../../../components/Text";
import { clsx } from "../../../../../../helpers";
import { globalAmountFormatting } from "../../../../../../helpers/formatting";
import { WidgetWealthItemProps } from "./wealthTypes";

const WidgetWealthItem: React.FC<WidgetWealthItemProps> = ({
  label,
  value,
  evolution,
  percentage,
  gain,
  onClick,
}) => {
  return (
    <div className="flex gap-2 w-full">
      <div
        className={clsx(
          "flex items-center justify-between border rounded-lg border-stone-100 bg-stone-100 w-full h-14 pl-4",
          onClick && "cursor-pointer"
        )}
        onClick={onClick}
      >
        <Text
          as="label"
          label={label}
          className="text-base text-blue-1100 font-semibold"
        />
        <div className="flex items-center justify-between gap-10">
          <div className="mr-2">
            <Text
              className="text-base text-blue-1100 font-bold"
              label={Intl.NumberFormat(undefined, {
                ...globalAmountFormatting,
                currency: "EUR",
              }).format(Math.abs(value))}
            />
          </div>
        </div>
      </div>

      {percentage ? (
        <div className="flex items-center justify-center border rounded-lg border-stone-100 bg-stone-100 w-1/6">
          <Text
            as="label"
            label={percentage}
            className="text-base font-bold text-blue-800"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center border rounded-lg border-stone-100 bg-stone-100 w-1/6 opacity-0"></div>
      )}
    </div>
  );
};

export default WidgetWealthItem;
