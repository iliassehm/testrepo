import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { SearchPagination } from "../../../../../../../../../components/SupportSelection/SearchResultTable";
import { InvestmentValues } from "../../../../../../../../../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { investmentInstrumentColumns } from "./columns";

function useSkipper() {
  const shouldSkipRef = useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

export interface InvestmentInstrumentTableRow
  extends Omit<InvestmentValues, "quantity"> {
  amount: number;
  percent: number;
  quantity: number;
  buyingDate?: Date;
  buyingPrice: number;
  riskIndicator?: number | null;
}

interface InvestmentInstrumentTableRowTableProps {
  data: InvestmentInstrumentTableRow[];
  setData: Dispatch<SetStateAction<InvestmentInstrumentTableRow[]>>;
  transfersAmount: number;
  setTransfersAmount?: (transfersAmount: number) => void;
  withoutBuyPrice?: boolean;
  canDelete?: boolean;
  footer?: () => JSX.Element;
  addRow?: () => JSX.Element;
}

export function InvestmentInstrumentTable({
  data,
  setData,
  addRow,
  footer,
  withoutBuyPrice = false,
  canDelete = true,
  transfersAmount,
  setTransfersAmount,
}: InvestmentInstrumentTableRowTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const validateTransfersAmount = (
    index: number,
    newValue: Partial<InvestmentInstrumentTableRow>,
    currentTransfersAmount: number,
    currentData: any
  ) => {
    const newData = [...currentData];
    newData[index] = {
      ...newData[index],
      ...newValue,
    };
    let computedTransfersAmount = currentTransfersAmount;
    const totalBuyingPrice = newData.reduce((acc, curr) => {
      if (
        curr.buyingPrice &&
        curr.buyingPrice > 0 &&
        curr.quantity &&
        curr.quantity > 0
      ) {
        return acc + curr.buyingPrice * curr.quantity;
      }
      return acc;
    }, 0);
    if (totalBuyingPrice > currentTransfersAmount) {
      computedTransfersAmount = totalBuyingPrice;
      newData.forEach((val) => {
        if (!val.amount || !val.quantity) {
          return;
        }
        const percent = (val.amount * val.quantity * 100) / totalBuyingPrice;
        val.percent = percent ?? 0;
      });
      setTransfersAmount?.(totalBuyingPrice);
      skipAutoResetPageIndex();
      setData(newData);
    }
    return computedTransfersAmount;
  };

  const columns = useMemo(
    () =>
      investmentInstrumentColumns({
        withoutBuyPrice,
        canDelete,
        validateTransfersAmount,
      }),
    [withoutBuyPrice]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    meta: {
      transfersAmount,
      deleteRow: (rowIndex) => {
        const newData = [...data];
        newData.splice(rowIndex, 1);
        setData(newData);
      },
      updateData: (rowIndex, value) => {
        skipAutoResetPageIndex();
        const newData = [...data];
        newData[rowIndex] = {
          ...newData[rowIndex],
          ...value,
        };
        setData(newData);
      },
    },
    autoResetPageIndex,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    const newData = data.map((val) => {
      if (!val.amount || !val.quantity || transfersAmount === 0) {
        return val;
      }
      const percent = (val.amount * 100) / transfersAmount;

      return {
        ...val,
        percent: percent ?? 0,
      };
    });

    skipAutoResetPageIndex();
    setData(newData);
  }, [transfersAmount]);

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            <>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  InvestmentInstrumentTableRow-state={
                    row.getIsSelected() && "selected"
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {addRow && (
                <TableRow>
                  <TableCell colSpan={columns.length}>{addRow()}</TableCell>
                </TableRow>
              )}
            </>
          ) : (
            <>
              {addRow && (
                <TableRow>
                  <TableCell colSpan={columns.length}>{addRow()}</TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>

      <div className="w-full flex justify-between items-start mt-2">
        <SearchPagination
          setPageIndex={table.setPageIndex}
          nextPage={table.nextPage}
          previousPage={table.previousPage}
          currentPageIndex={table.getState().pagination.pageIndex}
          pageCount={table.getPageCount()}
          totalResults={table.getFilteredRowModel().rows.length}
        />
        {footer?.()}
      </div>
    </div>
  );
}
