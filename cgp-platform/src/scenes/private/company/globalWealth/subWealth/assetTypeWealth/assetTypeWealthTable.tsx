import { useSearch } from "@tanstack/react-router";
import _ from "lodash";
import { Paginator } from "primereact/paginator";
import { useCallback, useEffect, useState } from "react";

import Table from "../../../../../../components/Table";
import { DataType } from "../../../../../../components/Table/tableTypes";
import { Widget } from "../../../../../../components/Widget";
import { formatCurrency, pick } from "../../../../../../helpers";
import {
  AssetGroup,
  AssetSortBy,
  CustomerAsset,
  SortDirection,
} from "../../../../../../types";
import {
  companyAssetTypeWealthRoute,
  getAssetTypeWealthSearchParams,
} from "../../route";
import { AssetWithCustomer } from "./assetTypeWealth";

interface Props {
  data: CustomerAsset[];
  type: AssetGroup;
  showPerformance?: boolean;

  onRowClick: (data: AssetWithCustomer) => void;
  customerNameTemplate: (data: AssetWithCustomer) => JSX.Element;
}

export function AssetTypeWealthTable({
  data,
  type,
  showPerformance = false,

  onRowClick,
  customerNameTemplate,
}: Props) {
  const { filters, state, onSearch } = useFilters(data);

  const dataType: Record<string, DataType> = {
    accountName: { type: "string", sortable: true, field: "name" },
    first_name_or_lastName: {
      type: "string",
      sortable: true,
      field: "customer.name",
    },
    valuation: {
      type: "amount",
      sortable: true,
      field: "activity.value",
      header: "forms.fields.tables.investments.valuation",
    },
  };

  if (showPerformance) {
    dataType.gain = {
      type: "amount",
      sortable: true,
      field: "performance.gain.value",
    };
  }

  const sortDirection =
    (filters.sortDirection as SortDirection) || SortDirection.Asc;
  const page = filters.page ?? 0;
  const limit = filters.limit ?? 0;
  const skip = page * limit;
  const totalRecords = state.length;

  return (
    <Widget title={`asset_group.${type}`} largeTitle>
      <>
        <Table
          data={state.slice(skip, skip + limit)}
          dataType={dataType}
          className="shadow-none"
          onSort={(sortBy, sortDirection) =>
            onSearch({
              sortBy: sortBy as AssetSortBy,
              sortDirection: sortDirection,
            })
          }
          onSearch={(e) => onSearch({ search: e.target.value })}
          defaultSortDirection={sortDirection}
        >
          <Table.Head translationPrefix="forms.fields.tables" />
          <Table.Body>
            {({ data }: { data: CustomerAsset[] }) =>
              data?.map((element, index) => (
                <Table.Row
                  key={index}
                  onClick={() => onRowClick(element as AssetWithCustomer)}
                >
                  <Table.Cell
                    value={element.name + " - " + element.accountNumber}
                  />
                  <Table.Cell
                    value={customerNameTemplate(element as AssetWithCustomer)}
                  />
                  <Table.Cell
                    type="amount"
                    value={
                      element.activity
                        ? formatCurrency(
                            type === AssetGroup.HomeLoan
                              ? {
                                  ...element.activity,
                                  value: Math.abs(element.activity.value ?? 0),
                                }
                              : element.activity
                          )
                        : "-"
                    }
                  />
                  {showPerformance && (
                    <Table.Cell
                      type="amount"
                      value={formatCurrency(
                        element.performance?.gain ?? undefined
                      )}
                    />
                  )}
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
        <Paginator
          first={skip}
          rows={limit}
          totalRecords={totalRecords}
          onPageChange={(e) => onSearch({ page: e.page })}
        />
      </>
    </Widget>
  );
}

function useFilters(data: CustomerAsset[]) {
  const [state, setState] = useState(data);
  const _search = useSearch({ from: companyAssetTypeWealthRoute.id });

  const [filters, setFilters] = useState({
    ...getAssetTypeWealthSearchParams(
      pick(_search, [
        "file",
        "assigner",
        "limit",
        "skip",
        "page",
        "period",
        "wealthFilter",
      ])
    ),
  });

  const debouncedApplyFilters = useCallback(
    _.debounce(() => {
      let filteredData = [...data];

      // Applying search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();

        filteredData = filteredData.filter(
          (asset) =>
            asset.name?.toLowerCase().includes(searchLower) ||
            asset.customer?.name?.toLowerCase().includes(searchLower)
        );
      }

      // Applying sorting logic if needed
      if (filters.sortBy !== undefined) {
        filteredData = filteredData.sort((a, b) => {
          switch (filters.sortBy) {
            case AssetSortBy.AccountName:
              return filters.sortDirection === SortDirection.Asc
                ? (a.name || "").localeCompare(b.name || "")
                : (b.name || "").localeCompare(a.name || "");
            case AssetSortBy.FirstNameOrLastName:
              return filters.sortDirection === SortDirection.Asc
                ? (a.customer?.name || "").localeCompare(b.customer?.name || "")
                : (b.customer?.name || "").localeCompare(
                    a.customer?.name || ""
                  );
            case AssetSortBy.Valuation:
              return filters.sortDirection === SortDirection.Asc
                ? (a.activity?.value || "").localeCompare(
                    b.activity?.value ?? ""
                  )
                : (b.activity?.value ?? "").localeCompare(
                    a.activity?.value ?? ""
                  );
          }

          return 0;
        });
      }

      setState(filteredData);
    }),
    [data, filters]
  );

  const onSearch = (input: Partial<typeof filters>) =>
    setFilters((state) => ({ ...state, ...input }));

  useEffect(() => {
    setState(data);
  }, [data]);

  useEffect(() => {
    debouncedApplyFilters();
  }, [debouncedApplyFilters]);

  return { filters, state, onSearch };
}
