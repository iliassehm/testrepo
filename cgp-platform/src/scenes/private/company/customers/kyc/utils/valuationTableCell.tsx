import { globalAmountFormatting } from "../../../../../../helpers";

export default function valuationTableCell(value: number) {
  return (
    <div className="my-1 flex flex-col items-end justify-end">
      <span className="flex items-center rounded-l-xl pr-3 text-left text-xs text-[#04182B]">
        {Intl.NumberFormat(undefined, {
          ...globalAmountFormatting,
          currency: "EUR",
        }).format(value)}
      </span>
    </div>
  );
}
