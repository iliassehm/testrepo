import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ColumnFiltersState,
  createColumnHelper,
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
import { MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Text } from "../../../../../components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../../components/dropdown";
import { SearchPagination } from "../../../../../components/SupportSelection/SearchResultTable";
import { formatDate } from "../../../../../helpers";
import {
  AssetGroup,
  ProjectListQuery,
  ProjectType,
} from "../../../../../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../wealth/AssetCreation/LongTermAsset/components/table";
import { AdequacyDialog } from "./AdequacyDialog";

const columnHelper =
  createColumnHelper<NonNullable<ProjectListQuery["projectList"]>[number]>();

type ProjectTableProps = {
  data: NonNullable<ProjectListQuery["projectList"]>;
  onUpdate: (
    projet: NonNullable<ProjectListQuery["projectList"]>[number]
  ) => void;
  onValidate: (
    projet: NonNullable<ProjectListQuery["projectList"]>[number]
  ) => void;
  onDelete: (
    projet: NonNullable<ProjectListQuery["projectList"]>[number]
  ) => void;
};

export function ProjectTable({
  data,
  onUpdate,
  onDelete,
  onValidate,
}: ProjectTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [adequacyDialogVisible, setAdequacyDialogVisible] = useState<
    | {
        projectID: string;
        type: "adequacy" | "report";
      }
    | false
  >(false);
  const navigate = useNavigate();
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/projects/",
  });

  const { t } = useTranslation();

  const ProjectColumns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => (
          <p className="min-w-[128px]">{t("forms.fields.tables.name")}</p>
        ),
        cell: ({ getValue }) => <p className="text-sm ">{getValue() ?? "-"}</p>,
      }),
      columnHelper.accessor("created", {
        header: () => t("forms.fields.tables.requestDate"),
        cell: ({ getValue }) => (
          <p className="text-sm">{formatDate(getValue())}</p>
        ),
      }),
      columnHelper.accessor("validated", {
        id: "state",
        header: () => t("forms.fields.tables.state"),
        cell: ({ getValue }) => {
          const validated = getValue();

          if (validated) {
            return (
              <div className="flex items-center gap-2">
                <i className="pi pi-check text-green-400 text-lg" />
                {t("forms.fields.tables.valid")}
              </div>
            );
          }

          return (
            <div className="flex items-center gap-2">
              <i className="pi pi-stopwatch text-orange-400  text-lg" />
              {t("forms.fields.tables.pending")}
            </div>
          );
        },
      }),
      columnHelper.accessor("validated", {
        header: () => t("forms.fields.tables.validationDate"),
        cell: ({ getValue }) => (
          <p className="text-sm">{getValue() ? formatDate(getValue()) : "-"}</p>
        ),
      }),
      columnHelper.accessor("validated", {
        id: "action",
        header: () => t("forms.fields.tables.action"),
        cell: ({ row, getValue }) => (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center h-6 w-6 p-0">
                <MoreHorizontal className="h-6 w-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              {!row.original.validated && (
                <>
                  {(row.original.type === ProjectType.SubscriptionCif ||
                    row.original.type ===
                      ProjectType.SubscriptionLifeInsurance) && (
                    <DropdownMenuItem
                      onClick={() => {
                        setAdequacyDialogVisible({
                          projectID: row.original.id,
                          type: "adequacy",
                        });
                      }}
                    >
                      <Text
                        label={
                          "scenes.customers.projects.declareAdequacy.generateAdequacy"
                        }
                        as="span"
                      />
                    </DropdownMenuItem>
                  )}

                  {(row.original.type === ProjectType.ArbitrageCif ||
                    row.original.type === ProjectType.ArbitrageLifeInsurance ||
                    row.original.type === ProjectType.ComplementaryCif ||
                    row.original.type ===
                      ProjectType.ComplementaryLifeInsurance ||
                    row.original.type === ProjectType.Redemption) && (
                    <DropdownMenuItem
                      onClick={() => {
                        setAdequacyDialogVisible({
                          projectID: row.original.id,
                          type: "report",
                        });
                      }}
                    >
                      <Text
                        label={
                          "scenes.customers.projects.declareAdequacy.generateReport"
                        }
                        as="span"
                      />
                    </DropdownMenuItem>
                  )}
                </>
              )}

              {row.original.metadata.assetID && (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({
                        to: "/company/$companyId/customer/$customerId/wealth/$type/$investmentId",
                        params: {
                          companyId: params.companyId as string,
                          customerId: params.customerId as string,
                          investmentId: row.original.metadata.assetID,
                          type: AssetGroup.LifeInsuranceCapitalization,
                        },
                      })
                    }
                  >
                    <Text label={"forms.fields.tables.seeContract"} as="span" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              {!getValue() && (
                <>
                  <DropdownMenuItem onClick={() => onValidate(row.original)}>
                    <Text
                      label="forms.fields.tables.validateContract"
                      as="span"
                    />
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => onUpdate(row.original)}>
                    <Text label="forms.fields.tables.edit" as="span" />
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuItem onClick={() => onDelete(row.original)}>
                <Text
                  className="text-red-500"
                  label={
                    getValue()
                      ? "forms.fields.tables.archive"
                      : "forms.fields.tables.delete"
                  }
                  as="span"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns: ProjectColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
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

  return (
    <div>
      <AdequacyDialog
        project={adequacyDialogVisible}
        setVisible={() => {
          setAdequacyDialogVisible(false);
        }}
      />
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
          {table.getRowModel().rows?.length &&
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="py-1" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {table.getFilteredRowModel().rows.length >
        table.getState().pagination.pageSize && (
        <div className="w-full flex justify-between items-start mt-2">
          <SearchPagination
            setPageIndex={table.setPageIndex}
            nextPage={table.nextPage}
            previousPage={table.previousPage}
            currentPageIndex={table.getState().pagination.pageIndex}
            pageCount={table.getPageCount()}
            totalResults={table.getFilteredRowModel().rows.length}
          />
        </div>
      )}
    </div>
  );
}
