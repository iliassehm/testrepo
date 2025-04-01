import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import {
  ColumnFiltersState,
  createColumnHelper,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Checkbox } from "primereact/checkbox";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { set } from "zod";

import { Button, Icon, Text } from "../../../../../../components";
import { Card } from "../../../../../../components/Card";
import { DataTable } from "../../../../../../components/DataTable";
import { clsx, formatCurrency } from "../../../../../../helpers";
import { downloadFile } from "../../../../../../helpers/downloadFile";
import { gql } from "../../../../../../service/client";
import {
  AssetGroup,
  AssetSortBy,
  AssetTypeWealthQuery,
  CustomerAsset,
  SortDirection,
  WealthFilter,
} from "../../../../../../types";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { companyAssetTypeWealthRoute } from "../../route";
import { CompanyAssetTypeWealthLogic } from "./assetTypeWealth.logic";
import { AssignModal } from "./AssignModal";
import { CategoryModal } from "./CategoryModal";

export type AssetWithCustomer = Pick<
  CustomerAsset,
  "id" | "name" | "sri" | "valuation"
> & {
  customer?: {
    id: string;
    name: string;
  };
};

const columnHelper =
  createColumnHelper<
    NonNullable<
      AssetTypeWealthQuery["company"]
    >["assets"]["edges"][number]["node"]
  >();

export function AssetTypeWealth() {
  const [open, setOpen] = useState<boolean>(false);
  const [openCategory, setOpenCategory] = useState<boolean>(false);
  const _search = useSearch({ from: companyAssetTypeWealthRoute.id });

  const params = useParams({ from: companyAssetTypeWealthRoute.id });
  const navigate = useNavigate({ from: companyAssetTypeWealthRoute.id });
  const { t } = useTranslation();
  const { companyId } = params;
  const type = params.type as AssetGroup;

  const assets = assetsCrud(companyId, type, _search.wealthFilter);

  const { mutate: exportAssets, isLoading: isExportingAssets } = useMutation(
    "exportAssets",
    () =>
      gql.client.request(CompanyAssetTypeWealthLogic.exportAssets(), {
        companyID: companyId as string,
        group: type as AssetGroup,
        computing: _search.wealthFilter as WealthFilter,
      }),
    {
      onSuccess: (response) => {
        if (response?.url) {
          downloadFile(response.url, `assets`);
        }
      },
    }
  );

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const canAssign = _search.wealthFilter === WealthFilter.UnderManagements;

  const nbCustomer = assets.assetsQuery.data?.company?.assets.totalCount ?? 0;

  const AssetTypeWealthTable = useMemo(() => {
    const columns = [
      columnHelper.accessor("id", {
        id: "checkbox",
        size: 10,
        maxSize: 10,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onChange={() => {
              table.toggleAllRowsSelected();
            }}
            pt={{
              input: {
                className: "!border-black !rounded-lg",
              },
            }}
            aria-label="Select row"
          />
        ),
        cell: ({ row }) => (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              row.toggleSelected();
            }}
          >
            <Checkbox
              checked={row.getIsSelected()}
              pt={{
                input: {
                  className: "!border-black !rounded-lg",
                },
              }}
              aria-label="Select row"
            />
          </div>
        ),
      }),

      columnHelper.accessor("name", {
        id: "accountName",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="items-center flex w-full"
          >
            {t("forms.fields.tables.accountName")}
            {column.getIsSorted() && (
              <i
                className={clsx(
                  "pi ml-1",
                  column.getIsSorted() === "asc"
                    ? "pi-angle-up"
                    : "pi-angle-down"
                )}
              />
            )}
          </button>
        ),
        cell: ({ getValue, row }) => (
          <span className={`wealth-tooltip-${row.id} w-full flex`}>
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("accountNumber", {
        id: "accountNumber",
        header: () => (
          <div className="items-center justify-center flex w-full">
            {t("forms.fields.tables.accountNumber")}
          </div>
        ),
        cell: ({ getValue, row }) => (
          <span className={`wealth-tooltip-${row.id} w-full flex`}>
            {getValue() ?? "-"}
          </span>
        ),
      }),
      columnHelper.accessor((row) => row.customer?.name ?? "", {
        id: "first_name_or_lastName",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="items-center flex w-full"
          >
            {t("forms.fields.tables.first_name_or_lastName")}
            {column.getIsSorted() && (
              <i
                className={clsx(
                  "pi ml-1",
                  column.getIsSorted() === "asc"
                    ? "pi-angle-up"
                    : "pi-angle-down"
                )}
              />
            )}
          </button>
        ),
        cell: ({ getValue, row }) => {
          const customerName = getValue();

          if (customerName) {
            return <Text label={customerName} />;
          }

          return (
            <button
              className="flex cursor-pointer gap-x-2"
              onClick={() => row.toggleSelected(true)}
            >
              <img src="/svg/flag.svg" />
              <Text label="forms.fields.assetAffectation.assignFlagLabel" />
            </button>
          );
        },
      }),
      {
        accessorKey: "sri",
        id: "sri",
        header: () => (
          <div className="items-center justify-center flex w-full">
            {t("forms.fields.tables.risk")}
          </div>
        ),
        cell: ({ getValue, row }: { getValue: () => any; row: any }) => (
          <span
            className={`wealth-tooltip-${row.id} w-full flex justify-center`}
          >
            {(getValue() as any) ?? "-"}
          </span>
        ),
      },
      columnHelper.accessor("valuation", {
        id: "valuation",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="items-center flex w-full justify-end"
          >
            {t("forms.fields.tables.investments.valuation")}
            {column.getIsSorted() && (
              <i
                className={clsx(
                  "pi ml-1",
                  column.getIsSorted() === "asc"
                    ? "pi-angle-up"
                    : "pi-angle-down"
                )}
              />
            )}
          </button>
        ),
        sortingFn: (a, b) => {
          const aValue = a.original.valuation || 0;
          const bValue = b.original.valuation || 0;
          return aValue - bValue;
        },
        cell: ({ getValue }) => {
          return (
            <span className="w-full flex align-items justify-end">
              {formatCurrency({ value: getValue(), instrument: "EUR" } as any)}
            </span>
          );
        },
      }),
    ];

    return columns;
  }, []);

  const assetsData = useMemo(
    () =>
      assets.assetsQuery.data?.company?.assets?.edges?.map(
        (edge) => edge.node
      ) ?? [],
    [assets.assetsQuery.data]
  );

  const selectedRowsLength = useMemo(
    () => Object.keys(rowSelection).length,
    [rowSelection]
  );

  return (
    <div className="flex flex-col-reverse gap-7 md:flex-row">
      <div className="section flex-1 p-4">
        <div className="flex gap-4 items-center justify-end w-full mb-4">
          <Button
            isLoading={isExportingAssets}
            label=""
            variant="bordered"
            className="flex items-center justify-center px-3 rounded-md"
            onClick={() => exportAssets()}
          >
            <Icon type="download" className="w-5 h-5" />
          </Button>
          {canAssign && (
            <Button
              label={
                selectedRowsLength > 1
                  ? t("forms.fields.assetAffectation.multipleAssign")
                  : t("forms.fields.assetAffectation.assign")
              }
              disabled={selectedRowsLength === 0}
              onClick={() => setOpen(true)}
            />
          )}
          <Button
            label={t("forms.fields.assetCategorization.categorize")}
            disabled={selectedRowsLength === 0}
            onClick={() => setOpenCategory(true)}
          />
          <FieldText
            placeholder={t("forms.fields.assetAffectation.search_placeholder")}
            value={assets.search}
            onChange={(e) => assets.setSearch(e.target.value)}
            className="w-[256px] bg-[#F8F9FB]"
          />
        </div>
        <DataTable
          data={assetsData}
          isLoading={assets.assetsQuery.isLoading}
          columns={AssetTypeWealthTable}
          pagination={assets.pagination}
          setPagination={assets.setPagination}
          rowCount={assets.assetsQuery.data?.company?.assets?.totalCount ?? 0}
          pageCount={
            Math.ceil(
              (assets.assetsQuery.data?.company?.assets?.totalCount ?? 0) /
                _search.limit
            ) || 0
          }
          tableClassName="border-spacing-y-2 border-separate rounded-full"
          headerClassName="bg-transparent text-left text-blue-800"
          rowClassName="text-left"
          cellClassName="text-left"
          rowId={(row) => row.id}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          globalFilter={assets.search}
          setGlobalFilter={assets.setSearch}
          columnFilters={assets.columnFilters}
          setColumnFilters={assets.setColumnFilters}
          sorting={assets.sorting}
          setSorting={assets.setSorting}
          onRowClick={(row) => {
            if (row.customer) {
              navigate({
                to: "/company/$companyId/customer/$customerId/wealth/$type/$investmentId",
                params: {
                  companyId,
                  customerId: row.customer.id,
                  investmentId: row.id,
                  type,
                },
              });
            }
          }}
        />
      </div>
      <Stats type={type} nbCustomer={nbCustomer} />
      <AssignModal
        open={selectedRowsLength > 0 && open}
        setOpen={() => setOpen(!open)}
        t={t}
        accounts={assetsData
          .filter((asset) => !!rowSelection[asset.id])
          .map((asset) => ({
            id: asset.id,
            name: asset.name,
            amount: asset.valuation,
          }))}
        onSuccess={() => {
          setOpen(false);
          setRowSelection({});
        }}
      />
      <CategoryModal
        open={openCategory}
        setOpen={() => setOpenCategory(!openCategory)}
        accounts={assetsData
          .filter((asset) => !!rowSelection[asset.id])
          .map((asset) => ({
            id: asset.id,
            name: asset.name,
          }))}
        onSuccess={() => {
          setOpenCategory(false);
          // setRowSelection({});
        }}
      />
    </div>
  );
}

function Stats({ nbCustomer, type }: { nbCustomer: number; type: AssetGroup }) {
  return (
    <Card className="flex h-32 w-60 flex-col items-center justify-center">
      <Text
        as="h3"
        label={`scenes.company.assetTypeWealth.stats.nb_${type}`}
        className="mt-2 text-center font-bold text-blue-1100"
      />
      <Text label={`asset_group.${type}`} className="text-white" />
      <p className="font-bold text-4xl text-blue-800">{nbCustomer}</p>
    </Card>
  );
}

function assetsCrud(
  companyID: string,
  type: AssetGroup,
  computing?: WealthFilter
) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const assetsQuery = useQuery(
    [
      "companyAssetUnderManagement",
      companyID,
      {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        search: search,
        sortBy: sorting[0]?.id as AssetSortBy,
        sortDirection: sorting[0]?.desc
          ? SortDirection.Desc
          : SortDirection.Asc,
      },
      type,
      computing,
    ],
    () =>
      gql.client.request(CompanyAssetTypeWealthLogic.queries(), {
        id: companyID,
        filters: {
          page: pagination.pageIndex,
          limit: pagination.pageSize,
          search: search,
          sortBy: sorting[0]?.id as AssetSortBy,
          sortDirection: sorting[0]?.desc
            ? SortDirection.Desc
            : SortDirection.Asc,
        },
        group: type,
        computing: computing,
      }),
    {
      keepPreviousData: true,
      enabled: true,
    }
  );

  return {
    open,
    search,
    columnFilters,
    sorting,
    assetsQuery,
    pagination,
    setSearch,
    setColumnFilters,
    setSorting,
    setPagination,
  };
}
