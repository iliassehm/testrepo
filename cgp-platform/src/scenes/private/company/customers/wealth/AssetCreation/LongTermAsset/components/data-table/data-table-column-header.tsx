import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";

import { clsx } from "../../../../../../../../../helpers";

export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div
        className={clsx(
          "flex items-center h-8 text-[#BFBFBF] text-xs font-bold",
          className
        )}
      >
        {title}
      </div>
    );
  }

  return (
    <div className={clsx("flex items-center space-x-2", className)}>
      <button
        className="flex items-center h-8 text-[#BFBFBF] text-xs font-bold data-[state=open]:bg-accent"
        onClick={(e) => {
          e.preventDefault();
          if (column.getIsSorted() === "desc") {
            column.toggleSorting(false);
          } else {
            column.toggleSorting(true);
          }
        }}
      >
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          <ArrowDownIcon className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUpIcon className="ml-2 h-4 w-4" />
        ) : (
          <CaretSortIcon className="ml-2 h-4 w-4" />
        )}
      </button>
    </div>
  );
}
