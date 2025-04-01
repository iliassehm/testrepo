import clsx from "clsx";
import { Text } from "src/components";

export interface GeneralSectionProps {
  showAll: boolean;
  count: number;
  onClick: () => void;
}
export function GeneralSection({
  count,
  showAll,
  onClick,
}: GeneralSectionProps) {
  return (
    <div className="mb-5 space-y-2">
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="notifications.group.general.title"
      />
      <div
        className={clsx(
          "flex justify-between items-center p-1 pl-3 rounded-md cursor-pointer border border-transparent hover:border-gray-200",
          showAll && "bg-white !border-gray-200"
        )}
        onClick={onClick}
      >
        <Text
          as="span"
          className="mr-4 text-sm text-[#9DA1AB]"
          label="notifications.group.general.all"
        />

        <div
          className={clsx(
            "flex justify-center items-center text-xs text-white rounded w-[25px] h-[20px] text-center",
            showAll
              ? "bg-blue-800 border border-blue-800"
              : "bg-[#919cd2] border border-[#919cd2]"
          )}
        >
          {count}
        </div>
      </div>
    </div>
  );
}
