import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import React from "react";

import { clsx } from "../../../../../../../helpers";
import { DataTableColumnHeaderProps } from "../../../../customers/wealth/AssetCreation/LongTermAsset/components/data-table/data-table-column-header";

export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-[5px] border border-zinc-400">
    <table
      ref={ref}
      className={clsx("w-full table-auto text-sm", className)}
      {...props}
    />
  </div>
));

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div
        className={clsx(
          "flex items-center h-8 text-[#04182B] text-xs font-bold",
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
        className="flex items-center h-8 text-[#04182B] text-xs font-bold data-[state=open]:bg-accent"
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

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={clsx("border border-zinc-400", className)}
    {...props}
  />
));
TableRow.displayName = "TableRow";
