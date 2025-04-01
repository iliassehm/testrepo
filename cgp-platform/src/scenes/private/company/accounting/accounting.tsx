import { useNavigate, useParams } from "@tanstack/react-router";
import { CheckCircle, Clock3, X, XCircle } from "lucide-react";
import { assert } from "node:console";
import { Paginator } from "primereact/paginator";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import { Select, Text } from "../../../../components";
import { Card } from "../../../../components/Card";
import Table from "../../../../components/Table";
import type { DataType } from "../../../../components/Table/tableTypes";
import { Tabs } from "../../../../components/Tabs";
import {
  clsx,
  formatCurrency,
  formatDate,
  numberFormat,
  numberWithSpaces,
} from "../../../../helpers";
import { gql } from "../../../../service/client";
import { type Amount, AssetGroup, WealthFilter } from "../../../../types";
import { FieldDate } from "../../../../UIComponents/FieldDate/FieldDate";
import { orderedTypes } from "../customers/wealth/AssetCreation";
import { AccountingLogic } from "./Accounting.logic";
import { CommisionIssues } from "./commissionIssues";
import { companyAccountingRoute } from "./route";
import { OneShotSales, PeriodSales, RecurrentSales } from "./sales";

type DateRange = { from: Date; to: Date };

enum ManagementTooltipState {
  SUCCESS = "success",
  WARNING = "warning",
  DANGER = "danger",
}

const dataType: Record<string, DataType> = {
  name: {
    type: "string",
    sortable: true,
    field: "name",
    filterType: "string",
    sortBy: "name",
  },
  email: { type: "string", sortable: true, filterType: "string" },
  phoneNumber: { type: "string", sortable: true, filterType: "string" },
  investment: { type: "amount", sortable: true, field: "investment.value" },
};
// const managementTabs = [
//   {
//     id: "periodSales",
//     label: "scenes.customers.accounting.periodSales",
//     component: <Timeline month={parseISO("2024-11-01")} content={[]} />,
//   },
//   {
//     id: "recurrentSales",
//     label: "scenes.customers.accounting.recurrentSales",
//     component: <Timeline month={parseISO("2024-11-01")} content={[]} />,
//   },
//   {
//     id: "oneShotSales",
//     label: "scenes.customers.accounting.oneShotSales",
//     component: <Timeline month={parseISO("2024-11-01")} content={[]} />,
//   },
//   {
//     id: "commissionError",
//     label: "scenes.customers.accounting.commissionError",
//     component: <Timeline month={parseISO("2024-11-01")} content={[]} />,
//   },
// ];

function StatsCard({
  label,
  value,
  withCurrency = false,
  className,
  view = "column",
  select,
  selectOptions,
  logo,
  setGroup,
}: {
  label: string;
  value?: Amount | number;
  withCurrency?: boolean;
  className?: string;
  view?: "column" | "row";
  select?: boolean;
  selectOptions?: { label: string; value: string; amount: Amount | number }[];
  logo?: string;
  setGroup?: Dispatch<SetStateAction<AssetGroup>> | undefined;
}) {
  const [selectedOption, setSelectedOption] = useState(
    selectOptions && selectOptions[0] && selectOptions[0].value !== null
      ? selectOptions[0].value
      : undefined
  );

  const selectedOptionAmount = selectOptions?.find(
    (option) => option.value === selectedOption
  )?.amount;

  function formatAmount(amount: Amount | number) {
    const typedAmount = typeof amount === "number" ? amount : amount.value;
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(typedAmount ?? 0);
  }

  const amount =
    withCurrency && select && selectedOptionAmount !== undefined
      ? `${formatAmount(selectedOptionAmount)} €`
      : value && withCurrency
        ? `${formatAmount(value)} €`
        : value;

  return (
    <Card
      className={clsx(
        "flex flex-col items-center w-full bg-white p-4 h-fit gap-4",
        view === "row" ? "flex-row" : "flex-col",
        className
      )}
    >
      <div
        className={clsx(
          view === "row" ? "w-1/2" : logo ? "w-1/3!important" : "w-full"
        )}
      >
        <Text
          as="h3"
          label={label}
          className="text-center font-bold text-blue-1100"
        />
        {select && selectOptions && (
          <Select
            options={selectOptions}
            defaultValue={selectedOption}
            className="w-full"
            name={""}
            onChange={(value) => {
              setGroup?.(value as AssetGroup);
            }}
          />
        )}
      </div>
      {logo ? <img src={logo} alt="logo" className="w-1/4 shrink" /> : null}
      <div
        className={clsx(
          "my-6 flex justify-center",
          view === "row" && logo
            ? "w-1/3"
            : view === "row" && !logo
              ? "w-1/2"
              : "w-full"
        )}
      >
        {typeof amount === "string" || typeof amount === "number" ? (
          <p
            className={clsx(
              "font-bold text-center text-2xl text-blue-800 whitespace-nowrap",
              logo && "text-xl"
            )}
          >
            {amount}
          </p>
        ) : null}
      </div>
    </Card>
  );
}

function AnalyticsNewClients(props: { range: DateRange; group: AssetGroup }) {
  const [filters, setFilters] = useState({ page: 0, limit: 10 });

  const params = useParams({
    from: "/company/$companyId/customer/$customerId",
  });

  const navigate = useNavigate({ from: companyAccountingRoute.id });

  const request = useQuery(
    ["newCustomersQueries", filters.page, "range", props.range],
    () =>
      gql.client.request(AccountingLogic.newCustomersQueries(), {
        companyID: params.companyId as unknown as string,
        input: {
          page: filters.page,
          limit: filters.limit,
          dateRange: props.range,
        },
      })
  );

  const widthTbody = document
    .getElementById("tableBody-customers")
    ?.getBoundingClientRect().width;
  const cellWidthsPercentage = [20, 20, 15, 15, 15, 12, 3];
  let cellWidths = [300, 300, 225, 225, 225, 200, 40];
  if (widthTbody) {
    cellWidths = cellWidthsPercentage.map(
      (percentage) => (percentage * widthTbody) / 100
    );
  }

  const customerList = request.data?.company?.customerList;

  const list =
    customerList?.edges.map((edge) => ({
      ...edge.node,
      investment: edge.node.underManagement,
    })) ?? [];

  const page = filters.page ?? 0;
  const limit = filters.limit ?? 0;
  const skip = page * limit;
  const totalRecords = customerList?.totalCount ?? 0;

  return (
    <>
      <Table
        data={list}
        dataType={dataType}
        className="shadow-none mt-4 w-full"
        defaultSort="name"
      >
        <Table.Head translationPrefix="forms.fields.tables" />
        <Table.Body className="w-full" id="tableBody-customers">
          {({ data }: { data: typeof list }) => {
            if (request.isLoading) {
              return (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center">
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-4 py-1">
                        <div
                          className="h-6 bg-gray-300 rounded"
                          style={{
                            width: `${Math.floor(Math.random() * (100 - 40 + 1) + 40)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            }
            return data?.map((element, index) => (
              <Table.Row
                key={element.id}
                className="w-full"
                onClick={() => {
                  navigate({
                    to: "/company/$companyId/customer/$customerId",
                    params: {
                      companyId: params.companyId,
                      customerId: element.id,
                    },
                  });
                }}
              >
                <Table.Cell
                  value={element.name}
                  className="truncate"
                  style={{
                    width: `${cellWidths[1]}px`,
                    maxWidth: `${cellWidths[1]}px`,
                  }}
                />
                <Table.Cell
                  value={
                    <a
                      href={`mailto:${element.email}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-800 font-light truncate w-full"
                    >
                      {element.email}
                    </a>
                  }
                  className="truncate"
                  style={{
                    width: `${cellWidths[2]}px`,
                    maxWidth: `${cellWidths[2]}px`,
                  }}
                />
                <Table.Cell
                  value={numberWithSpaces(
                    element.informations?.details?.firstPhoneNumber ??
                      element.phoneNumber ??
                      element.informations?.general?.information?.phone ??
                      ""
                  )}
                  className="truncate"
                  style={{
                    width: `${cellWidths[3]}px`,
                    maxWidth: `${cellWidths[3]}px`,
                  }}
                />
                <Table.Cell
                  type="amount"
                  value={formatCurrency(element.investment)}
                  style={{
                    width: `${cellWidths[4]}px`,
                    maxWidth: `${cellWidths[4]}px`,
                  }}
                />
              </Table.Row>
            ));
          }}
        </Table.Body>
      </Table>
      <Paginator
        first={skip}
        rows={limit}
        totalRecords={totalRecords}
        onPageChange={(e) => setFilters({ ...filters, page: e.page })}
      />
    </>
  );
}

const newContractsDataType: Record<string, DataType> = {
  name: {
    type: "string",
    sortable: true,
    field: "name",
    filterType: "string",
    sortBy: "customer.name",
  },
  assetType: {
    type: "string",
    sortable: true,
    filterType: "string",
    field: "categoryName",
  },
  assetName: {
    type: "string",
    sortable: true,
    filterType: "string",
    field: "name",
  },
  number: { type: "string", sortable: true, filterType: "string" },
  openDate: { type: "date", sortable: true, filterType: "date" },
  amount: { type: "amount", sortable: true },
};

function AnalyticsNewContracts(props: { range: DateRange; group: AssetGroup }) {
  const [filters, setFilters] = useState({ page: 0, limit: 10 });

  const { t } = useTranslation();
  const params = useParams({ from: "/company/$companyId/company-accounting" });

  const request = useQuery(
    ["newContractsQueries", filters.page, props.group, props.range],
    () =>
      gql.client.request(AccountingLogic.newContractsQueries(), {
        company: params.companyId as unknown as string,
        group: props.group,
        computing: WealthFilter.UnderManagements,
        filters: { dateRange: props.range },
        // filters: {
        // page: filters.page,
        // limit: filters.limit,
        // dateRange: props.range,
        // },
      })
  );

  const widthTbody = document
    .getElementById("tableBody-customers")
    ?.getBoundingClientRect().width;
  const cellWidthsPercentage = [20, 20, 15, 15, 15, 12, 3];
  let cellWidths = [300, 300, 225, 225, 225, 200, 40];
  if (widthTbody) {
    cellWidths = cellWidthsPercentage.map(
      (percentage) => (percentage * widthTbody) / 100
    );
  }

  const list =
    request.data?.company?.list.edges?.map((edge) => edge.node) ?? [];

  const page = filters.page ?? 0;
  const limit = filters.limit ?? 0;
  const skip = page * limit;
  const totalRecords = request.data?.company?.list.totalCount ?? 0;

  return (
    <>
      <Table
        data={list?.slice(skip, skip + limit)}
        dataType={newContractsDataType}
        className="shadow-none mt-4 w-full"
        defaultSort="name"
      >
        <Table.Head translationPrefix="forms.fields.tables" />
        <Table.Body className="w-full" id="tableBody-customers">
          {({ data }: { data: typeof list }) => {
            if (request.isLoading) {
              return (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center">
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-4 py-1">
                        <div
                          className="h-6 bg-gray-300 rounded"
                          style={{
                            width: `${Math.floor(Math.random() * (100 - 40 + 1) + 40)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            }
            return data?.map((element, index) => (
              <Table.Row key={element.id} className="w-full">
                <Table.Cell
                  value={element?.customer?.name}
                  className="truncate"
                  style={{
                    width: `${cellWidths[1]}px`,
                    maxWidth: `${cellWidths[1]}px`,
                  }}
                />
                <Table.Cell
                  value={t(`asset_group.${element.group}`)}
                  className="truncate"
                />
                <Table.Cell
                  value={element.name}
                  className="truncate"
                  style={{
                    width: `${cellWidths[4]}px`,
                    maxWidth: `${cellWidths[4]}px`,
                  }}
                />
                <Table.Cell
                  value={element.accountNumber}
                  className="truncate"
                />
                <Table.Cell
                  value={formatDate(element.openDate)}
                  className="truncate"
                />
                <Table.Cell
                  type="amount"
                  value={formatCurrency(element.valuation)}
                  className="truncate"
                />
              </Table.Row>
            ));
          }}
        </Table.Body>
      </Table>
      <Paginator
        first={skip}
        rows={limit}
        totalRecords={totalRecords}
        onPageChange={(e) => setFilters({ ...filters, page: e.page })}
      />
    </>
  );
}

const newTransactionDataType: Record<string, DataType> = {
  entityName: {
    type: "string",
    sortable: false,
    field: "entityName",
    filterType: "string",
    sortBy: "entityName",
  },
  assetName: {
    type: "string",
    sortable: false,
    filterType: "string",
    field: "assetName",
  },
  date: { type: "date", sortable: false, filterType: "date" },
  name: { type: "string", sortable: false, filterType: "string" },
  amount: { type: "amount", sortable: false },
};

function AnalyticsLastMovements(props: {
  range: DateRange;
  group: AssetGroup;
}) {
  const [pagination, setPaginations] = useState({ page: 0, size: 10 });

  const { t } = useTranslation();
  const params = useParams({ from: "/company/$companyId/company-accounting" });

  const request = useQuery(
    [
      "accounting",
      "new_transactions",
      props.group,
      props.range,
      pagination.page,
    ],
    () =>
      AccountingLogic.newTransactions(
        params.companyId as unknown as string,
        { date: props.range, groupe: props.group },
        pagination
      )
  );

  const widthTbody = document
    .getElementById("tableBody-customers")
    ?.getBoundingClientRect().width;
  const cellWidthsPercentage = [20, 20, 15, 15, 15, 12, 3];
  let cellWidths = [300, 300, 225, 225, 225, 200, 40];
  if (widthTbody) {
    cellWidths = cellWidthsPercentage.map(
      (percentage) => (percentage * widthTbody) / 100
    );
  }

  const list =
    request.data?.list != undefined
      ? request.data?.list.edges.map((edge) => edge.node)
      : [];

  const page = pagination.page ?? 0;
  const limit = pagination.size ?? 0;
  const skip = page * limit;
  const totalRecords = request.data?.list?.totalCount ?? 0;

  return (
    <>
      <Table
        data={list?.slice(skip, skip + limit)}
        dataType={newTransactionDataType}
        className="shadow-none mt-4 w-full"
        defaultSort="name"
      >
        <Table.Head translationPrefix="forms.fields.tables" />
        <Table.Body className="w-full" id="tableBody-customers">
          {({ data }: { data: typeof list }) => {
            if (request.isLoading) {
              return (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center">
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-4 py-1">
                        <div
                          className="h-6 bg-gray-300 rounded"
                          style={{
                            width: `${Math.floor(Math.random() * (100 - 40 + 1) + 40)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            }
            return data?.map((element, index) => (
              <Table.Row key={element.id} className="w-full">
                <Table.Cell
                  value={element?.entityName}
                  className="truncate"
                  style={{
                    width: `${cellWidths[1]}px`,
                    maxWidth: `${cellWidths[1]}px`,
                  }}
                />
                <Table.Cell value={element.assetName} className="truncate" />
                <Table.Cell
                  value={formatDate(element.date)}
                  className="truncate"
                />
                <Table.Cell
                  value={element.name}
                  className="truncate"
                  style={{
                    width: `${cellWidths[4]}px`,
                    maxWidth: `${cellWidths[4]}px`,
                  }}
                />
                <Table.Cell
                  type="amount"
                  value={formatCurrency({
                    value: element.amount,
                    instrument: "EUR",
                  })}
                  className="truncate"
                />
              </Table.Row>
            ));
          }}
        </Table.Body>
      </Table>
      <Paginator
        first={skip}
        rows={limit}
        totalRecords={totalRecords}
        onPageChange={(e) => setPaginations({ ...pagination, page: e.page })}
      />
    </>
  );
}

function Analytics(props: { range: DateRange }) {
  const { t } = useTranslation();
  const assetsList = useQuery(["assetsList", props.range], () =>
    AccountingLogic.assetList(params.companyId as unknown as string, {
      date: props.range,
      computing: WealthFilter.UnderManagements,
    })
  );

  let groups:
    | { label: string; value: string; amount: Amount | number }[]
    | undefined = [];
  if (assetsList.data?.accountingAssets?.length) {
    groups = assetsList.data.accountingAssets
      .filter((group) => group !== null)
      .map((group) => ({
        label: t(`asset_group.${group}`),
        value: group as string,
        amount: 0,
      }));
  }

  const [group, setGroup] = useState<AssetGroup>(
    groups.length ? (groups[0].value as AssetGroup) : ("" as AssetGroup)
  );

  const params = useParams({
    from: "/company/$companyId/customer/$customerId",
  });

  const cientCountQuery = useQuery(
    ["accounting", "client_count", "range", props.range],
    () =>
      gql.client.request(AccountingLogic.newCustomersCountQueries(), {
        companyID: params.companyId as unknown as string,
        input: { limit: 0, dateRange: props.range },
      })
  );

  const providerStatsQuery = useQuery(
    ["accounting", "provider_stats", group, props.range],
    () =>
      AccountingLogic.providerStatistics(
        params.companyId as unknown as string,
        { date: props.range, groupe: group }
      )
  );

  const newContractsNumber = useQuery(
    ["newContractsQueries", group, props.range],
    () =>
      AccountingLogic.newContractsNumberQuery(
        params.companyId as unknown as string,
        WealthFilter.UnderManagements,
        group,
        { dateRange: props.range }
      )
  );

  const analyticsTabs = [
    {
      id: "newClients",
      label: "scenes.customers.accounting.newClients",
      component: <AnalyticsNewClients range={props.range} group={group} />,
    },
    {
      id: "newContracts",
      label: "scenes.customers.accounting.newContracts",
      component: <AnalyticsNewContracts range={props.range} group={group} />,
    },
    {
      id: "lastMovements",
      label: "scenes.customers.accounting.lastMovements",
      component: <AnalyticsLastMovements range={props.range} group={group} />,
    },
  ];

  let clientCountStats: JSX.Element | null = null;
  if (
    cientCountQuery.isLoading === false &&
    cientCountQuery.status === "success" &&
    cientCountQuery.data.company?.customerList.totalCount != null
  )
    clientCountStats = (
      <StatsCard
        label={t("scenes.customers.accounting.newClients")}
        value={cientCountQuery.data.company.customerList.totalCount}
        setGroup={undefined}
      />
    );

  let providerStatsElement: JSX.Element | null = null;
  if (
    providerStatsQuery.isLoading === false &&
    providerStatsQuery.status === "success"
  )
    providerStatsElement = (
      <div className="flex flex-col gap-y-3 overflow-y-auto h-1/3 rounded-xl drop-shadow-lg">
        {(providerStatsQuery.data.list ?? []).map((provider: any) => (
          <StatsCard
            key={provider.key}
            label={provider.name}
            value={provider.total}
            withCurrency
            view="row"
            logo={provider.logo}
          />
        ))}
      </div>
    );

  return (
    <div className="flex gap-6 flex-col md:flex-row">
      <div className="flex flex-col w-full md:w-3/5 bg-white rounded-xl shadow-lg p-3 gap-y-3 overflow-x-scroll h-full">
        <h1 className="text-base font-sans font-bold text-investorProfileForm-curve6">
          {t("scenes.customers.accounting.periodReport")}
        </h1>
        <Tabs tabs={analyticsTabs} defaultTab={analyticsTabs[0].id} />
      </div>
      <div className="flex flex-col w-full md:w-2/5 gap-y-3 h-auto">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
          {clientCountStats}
          <StatsCard
            label="scenes.customers.accounting.newContracts"
            value={newContractsNumber.data?.company?.list.totalCount}
          />
        </div>
        <StatsCard
          label="scenes.customers.accounting.lastMovements"
          value={0}
          withCurrency
          view="row"
          select
          selectOptions={groups}
          setGroup={setGroup}
        />
        {providerStatsElement}
      </div>
    </div>
  );
}

function ManagementTooltipTable(props: {
  table: { name: string; value: number; state: ManagementTooltipState }[];
}) {
  return (
    <div className="flex flex-col gap-y-1">
      {props.table.map((row) => (
        <div
          className="flex w-full justify-between items-center gap-2"
          key={row.name}
        >
          <Text label={row.name} className="text-blue-1100 text-xs w-1/2" />
          <div className="flex w-1/2 justify-end gap-x-3">
            <Text
              label={numberFormat(row.value)}
              className="text-blue-1100 text-xs w-2/3"
            />
            {row.state === ManagementTooltipState.SUCCESS && (
              <CheckCircle className="text-green-500 w-3 h-3" />
            )}
            {row.state === ManagementTooltipState.WARNING && (
              <Clock3 className="text-yellow-500 w-3 h-3" />
            )}
            {row.state === ManagementTooltipState.DANGER && (
              <XCircle className="text-red-500 w-3 h-3" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Management(props: { range: DateRange }) {
  const fakeContent = [];

  const managementTabs = [
    {
      id: "periodSales",
      label: "scenes.customers.accounting.periodSales",
      component: <PeriodSales range={props.range} />,
    },
    {
      id: "recurrentSales",
      label: "scenes.customers.accounting.recurrentSales",
      component: <RecurrentSales range={props.range} />,
    },
    {
      id: "oneShotSales",
      label: "scenes.customers.accounting.oneShotSales",
      component: <OneShotSales range={props.range} />,
    },
    // {
    //   id: "commissionError",
    //   label: "scenes.customers.accounting.commissionError",
    //   component: <CommisionIssues range={props.range} />,
    // },
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="px-10 max-w-full">
        {/* <Timeline
          range={{
            from: props.range.from,
            to: props.range.to,
          }}
          content={fakeContent}
          tooltipRenderer={(data: any[]) => (
            <ManagementTooltipTable table={data} />
          )}
        /> */}
      </div>
      <div className="flex flex-col w-full bg-white rounded-xl shadow-lg p-5 gap-y-3 overflow-x-scroll h-full">
        <Tabs tabs={managementTabs} defaultTab={managementTabs[0].id} />
      </div>
    </div>
  );
}

export function Accounting() {
  // Default range now - 1 month to now()
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());

  const range = { from: startDate, to: endDate };

  const tabs = [
    {
      id: "analytics",
      label: "scenes.customers.accounting.analytics",
      component: <Analytics range={range} />,
    },
    {
      id: "management",
      label: "scenes.customers.accounting.management",
      component: <Management range={range} />,
    },
  ];

  return (
    <div className="flex flex-col">
      <Tabs
        tabs={tabs}
        defaultTab={tabs[0].id}
        size="large"
        rightComponent={
          <div className="w-full flex gap-x-3 px-3">
            <div className="flex gap-2 items-center">
              <Text
                label="scenes.customers.accounting.startDate"
                className="text-blue-1000 text-sm font-bold"
              />
              <FieldDate
                name="startDate"
                value={startDate}
                onValueChange={setStartDate}
              />
            </div>
            <div className="flex gap-2 items-center">
              <Text
                label="scenes.customers.accounting.endDate"
                className="text-blue-1000 text-sm font-bold"
              />
              <FieldDate
                name="endDate"
                value={endDate}
                onValueChange={setEndDate}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}
