import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "primereact/checkbox";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/Table";
import { formatDate } from "../../../../../helpers";
import { ProjectListQuery } from "../../../../../types";

type AdequacyProjectTableProps = {
  data: NonNullable<ProjectListQuery["projectList"]>;
  onSelectProject: (
    projet: NonNullable<ProjectListQuery["projectList"]>[number] | null
  ) => void;
};

export function AdequacyProjectTable({
  data,
  onSelectProject,
}: AdequacyProjectTableProps) {
  const { t } = useTranslation();
  const projectTypes = useMemo(
    () =>
      t("scenes.customers.projects.categories", {
        returnObjects: true,
      }) as Record<string, string>,
    [t]
  );

  // todo: add pagination

  const columns = useMemo<
    ColumnDef<NonNullable<ProjectListQuery["projectList"]>[number]>[]
  >(
    () => [
      {
        id: "select",
        size: 1,
        maxSize: 1,
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.checked)}
            pt={{
              input: {
                className: "!border-black !rounded-lg",
              },
            }}
            aria-label="Select row"
          />
        ),
      },
      {
        accessorKey: "name",
        maxSize: 35,
        header: () => (
          <p className="min-w-[128px]">
            {t("scenes.customers.projects.declareAdequacy.projectTable.name")}
          </p>
        ),
        cell: ({ getValue }) => (
          <p className="min-w-[128px]">{getValue() as string}</p>
        ),
      },
      {
        id: "createdDate",
        accessorKey: "created",
        header: () => t("forms.fields.tables.createdDate"),
        cell: ({ getValue }) => (
          <p className="text-sm">{formatDate(getValue() as Date)}</p>
        ),
      },
      {
        id: "state",
        header: () => t("forms.fields.tables.state"),
        cell: ({ row }) => {
          const validated = row.original.validated;

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
      },
      {
        id: "type",
        accessorKey: "type",
        header: () =>
          t("scenes.customers.projects.declareAdequacy.projectTable.type"),
        cell: ({ row, getValue }) => (
          <p className="text-sm">{projectTypes[getValue() as any]}</p>
        ),
      },
    ],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableMultiRowSelection: false,
    enableRowSelection: true,
  });

  const selectedRows = table.getSelectedRowModel().rows;

  useEffect(() => {
    if (selectedRows[0]?.original) {
      onSelectProject(selectedRows[0].original);
    } else {
      onSelectProject(null);
    }
  }, [selectedRows]);

  return (
    <Table className="w-full overflow-auto border-separate border-spacing-y-2">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                className="font-bold text-sm text-left"
                key={header.id}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {!!table.getRowModel().rows?.length &&
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="border-0 py-0">
              {row.getVisibleCells().map((cell, i, cells) => (
                <TableCell
                  className="py-0 px-4"
                  key={cell.id}
                  style={{
                    borderTopLeftRadius: i === 1 ? "7px" : undefined,
                    borderBottomLeftRadius: i === 1 ? "7px" : undefined,
                    borderTopRightRadius:
                      i === cells.length - 1 ? "7px" : undefined,
                    borderBottomRightRadius:
                      i === cells.length - 1 ? "7px" : undefined,
                    backgroundColor:
                      i > 0 && i < cells.length ? "#4761C84D" : undefined,
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
