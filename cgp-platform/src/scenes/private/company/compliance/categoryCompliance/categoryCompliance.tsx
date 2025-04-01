import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import {
  Column,
  ColumnFilterApplyTemplateOptions,
  ColumnFilterClearTemplateOptions,
  ColumnFilterElementTemplateOptions,
} from "primereact/column";
import {
  DataTable,
  DataTableFilterMeta,
  DataTableRowClickEvent,
} from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import { CardWithTitle } from "../../../../../components/Card";
import {
  complianceCategoryName,
  getTreatement,
  paginationLimit,
} from "../../../../../constants";
import { dateBodyTemplate } from "../../../../../helpers";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import {
  Document,
  NotificationRequest,
  NotificationTransport,
  Treatement,
} from "../../../../../types";
import { StateTag } from "../../customers/conformity/ged/components/GedDocumentView";
import { companyCustomersConformityRoute } from "../../customers/conformity/route";
import { DocumentCategoryLogic } from "./categoryCompliance.logic";

export function getDocumentCategorySearchParams(arg: Record<string, unknown>) {
  return {
    page: Number(arg.page) ?? 0,
    limit: arg.limit ? Number(arg.limit) : paginationLimit,
    name: (arg.name as string) ?? "",
    validityDate: (arg.validityDate as Date) ?? "",
  };
}

type DocumentWhithTreatement = Document & { treatement: Treatement };

type TreatementOption = {
  value: Treatement;
  label: string;
};
const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  treatement: { value: null, matchMode: FilterMatchMode.IN },
};

export function CompanyCategoryCompliance() {
  // Hooks
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const _search = useSearch({
    from: "/company/$companyId/company-compliance/$category",
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const navigate = useNavigate({
    from: "/company/$companyId/company-compliance/$category",
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const params = useParams({
    from: "/company/$companyId/company-compliance/$category",
  });

  const { t } = useTranslation();

  const category = params.category;

  const [selected, setSelected] = useState<DocumentWhithTreatement[]>([]);
  const [treatments] = useState<TreatementOption[]>([
    {
      value: Treatement.Waiting,
      label: t("scenes.customers.conformity.conformity.todo"),
    },
    {
      value: Treatement.Unvalid,
      label: t("scenes.customers.conformity.conformity.progress"),
    },
    {
      value: Treatement.Valid,
      label: t("scenes.customers.conformity.conformity.done"),
    },
  ]);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [search, setSearch] = useState({
    ...getDocumentCategorySearchParams(_search as Record<string, unknown>), // TODO: Remove
  });

  const toast = useToast();

  const { companyId } = params;

  if (!companyId) throw new Error("Missing companyId");

  const skip = search.page * search.limit;

  const { data, refetch } = useQuery(
    ["companyCustomers", companyId, category, search],
    () =>
      gql.client.request(DocumentCategoryLogic.documentQuery(), {
        company: companyId as string,
        documentCategory: category === "GLOBAL" ? null : category,
        input: { ...search, skip },
      })
  );

  // const { documentUpdate } = useDocumentActions({
  //   document: showDialog,
  //   t,
  //   refetch: refetch ?? (() => null),
  //   setShowDialog,
  // });

  const { mutate: handleNotification } = useMutation({
    mutationKey: "documentNotification",
    mutationFn: (params: {
      documents: Document[];
      requests: [NotificationRequest];
    }) =>
      Promise.all(
        params.documents.map((document) =>
          gql.client.request(
            DocumentCategoryLogic.documentNotificationMutation(),
            {
              documentID: document.id,
              requests: params.requests,
            }
          )
        )
      ),
    onSuccess: () => {
      toast?.current?.show({
        severity: "success",
        summary: t("forms.fields.notifications.success.success"),
        detail: t("forms.fields.notifications.success.send"),
      });
    },
    onError: () => {
      toast?.current?.show({
        severity: "error",
        summary: "Error",
        detail: t("forms.fields.notifications.error.send"),
      });
    },
  });

  // Events
  const onSearch = (input: Partial<typeof search>) => {
    const newSearch = { ...search, ...input };
    setSearch(newSearch);
    navigate({
      from: "/company/$companyId/company-compliance/$category",
      to: "/company/$companyId/company-compliance/$category",
      params: {
        companyId,
      },
      search: newSearch,
    } as unknown as never);
  };
  const onPageChange = (e: PaginatorPageChangeEvent) => {
    onSearch({ page: e.page });
    setSelected([]);
  };
  const handleRowClick = ({ data }: DataTableRowClickEvent) => {
    navigate({
      to: companyCustomersConformityRoute.fullPath,
      params: {
        companyId: companyId as string,
        customerId: data.customer?.id as string,
      },
      search: {
        tab: "ged",
        documentId: data.id,
      },
    } as unknown as never);
  };

  // // Templates
  const Actions = ({
    documents,
    // setShowDialog,
  }: {
    documents: Document[];
    from?: "header";
    refetch?: () => void;
  }) => {
    // const onViewClick = useCallback(
    //   async (e: React.MouseEvent) => {
    //     e?.stopPropagation();
    //     if (!documentId) return;

    //     setShowDialog((prev: any) => ({
    //       type: "read",
    //       ...prev,
    //       payload: {
    //         document: data,
    //       },
    //     }));
    //   },
    //   [document, setShowDialog]
    // );
    const { t } = useTranslation();

    return (
      <div className="flex justify-end gap-4">
        <Tooltip target=".notification-target-icon" position="top" />
        {/* <div>
          <i
            className="notification-target-icon pi pi-search h-4 w-4 cursor-pointer"
            data-pr-tooltip={t("forms.fields.tables.view") as string}
            onClick={onViewClick}
          />
        </div> */}
        <a
          onClick={() => {
            handleNotification({
              documents: documents,
              requests: [{ transport: NotificationTransport.Push }],
            });
          }}
        >
          <i
            className="notification-target-icon pi pi-bell h-4 w-4 cursor-pointer"
            data-pr-tooltip={
              t("forms.fields.tables.sendByPushNotification") as string
            }
          />
        </a>
        <a
          onClick={() => {
            handleNotification({
              documents: documents,
              requests: [{ transport: NotificationTransport.Mail }],
            });
          }}
        >
          <i
            className="notification-target-icon pi pi-envelope h-4 w-4 cursor-pointer"
            data-pr-tooltip={t("forms.fields.tables.sendByEmail") as string}
          />
        </a>
      </div>
    );
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
    }));
    setGlobalFilterValue(e.target.value);
  };

  const GlobalFilter = () => {
    return (
      <div className="flex items-center gap-4">
        {!!selected.length && (
          <div className="flex items-center gap-2">
            {t("forms.fields.tables.selected", {
              count: selected.length,
            })}
            <Actions documents={selected} />
          </div>
        )}
        <div className="justify-content-between align-items-center flex flex-wrap gap-2">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder={t("forms.fields.tables.search") as string}
              className="h-8"
            />
          </span>
        </div>
      </div>
    );
  };

  const label = decodeURI(complianceCategoryName(category));

  const treatementFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <MultiSelect
        value={options.value}
        options={treatments}
        itemTemplate={treatementItemTemplate}
        onChange={(e: MultiSelectChangeEvent) => {
          return options.filterCallback(e.value);
        }}
        optionValue="value"
        optionLabel="label"
        placeholder={t("forms.fields.tables.all")}
        className="p-column-filter"
      />
    );
  };

  const treatementItemTemplate = (option: TreatementOption) => {
    return <StateTag state={option.value as Treatement} />;
  };

  const filterClearTemplate = (options: ColumnFilterClearTemplateOptions) => {
    return (
      <Button
        label={t("forms.fields.tables.clear")}
        size="small"
        onClick={options.filterClearCallback}
        severity="secondary"
        outlined
      />
    );
  };

  const filterApplyTemplate = (options: ColumnFilterApplyTemplateOptions) => {
    return (
      <Button
        label={t("forms.fields.tables.apply")}
        size="small"
        onClick={options.filterApplyCallback}
        severity="success"
      />
    );
  };

  return (
    <div className="max-w-8xl">
      <CardWithTitle
        title={complianceCategoryName(
          data?.documentCustomerList?.category?.name ?? ""
        )}
        right={GlobalFilter()}
      >
        <DataTable
          rows={search.limit}
          onRowClick={handleRowClick}
          value={
            data?.documentCustomerList?.edges.map((edge) => ({
              ...edge.node,
              treatement: getTreatement(edge.node as Document),
            })) ?? []
          }
          globalFilterFields={["customer.name", "name"]}
          filters={filters}
          selection={selected}
          onSelectionChange={(e) =>
            setSelected(e.value as DocumentWhithTreatement[])
          }
          selectionMode="checkbox"
          rowClassName={() => "cursor-pointer"}
          emptyMessage={t(`emptyMessage.noClient`)}
          dataKey="id"
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column
            field="customer.name"
            sortable
            header={t("forms.fields.tables.clients")}
            className="text-sm text-grey-700"
          />
          <Column
            field="expiration"
            sortable
            header={t("forms.fields.tables.validityDate")}
            body={dateBodyTemplate}
            className="text-sm text-grey-700"
          />
          <Column
            field="name"
            sortable
            header={t("forms.fields.document")}
            className="text-sm text-grey-700"
          />
          <Column
            field="treatement"
            sortable
            header={t("forms.fields.tables.status")}
            body={(data: Record<string, any>) => {
              return <StateTag state={getTreatement(data as Document)} />;
            }}
            className="flex items-center justify-center"
            filter
            showFilterMatchModes={false}
            filterField="treatement"
            filterMenuStyle={{ width: "15rem" }}
            filterElement={treatementFilterTemplate}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
          />
          {/* <Column
            body={(data) => <Actions data={data} refetch={refetch} />}
            exportable={false}
            style={{ minWidth: "12rem" }}
          /> */}
        </DataTable>
        <Paginator
          first={skip}
          rows={search.limit}
          totalRecords={data?.documentCustomerList?.totalCount || 0}
          onPageChange={onPageChange}
        />
      </CardWithTitle>
      {/* <ConformityModal
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        handleDocumentUpdate={documentUpdate.mutate}
        documentIsUpdating={documentUpdate.isLoading}
        t={t}
      /> */}
    </div>
  );
}
