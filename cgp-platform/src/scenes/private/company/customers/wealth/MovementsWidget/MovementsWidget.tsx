import type { PaginationState } from "@tanstack/react-table";
import { t } from "i18next";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import { AssetIcon, Button, Dialog, Text } from "../../../../../../components";
import { DateRangeSelector } from "../../../../../../components/DateRangeSelector/DateRangeSelector";
import { pick, unPick } from "../../../../../../helpers";
import { gql } from "../../../../../../service/client";
import type {
  ActivityByYear,
  ActivityYearHistoryCreationInput,
  AssetGroup,
  Company,
  Customer,
  Manager,
  Transaction,
  TransactionCreationInput,
} from "../../../../../../types";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import ActivitiesForm from "../ActivitiesWidget/ActivitesForm";
import { ActivitiesTable } from "../ActivitiesWidget/ActivitiesTable";
import { ActivitiesWidgetLogic } from "../ActivitiesWidget/activitiesWidget.logic";
import { MouvementForm } from "./MovementsForm";
import { TransactionsTable } from "./TransactionsTable";
import { TransactionsWidgetLogic } from "./transactionsWidget.logic";

interface TransactionsWidgetProps {
  assetId: string;
  companyID: Company["id"];
  customerID: Customer["id"];
  managerID?: Manager["id"];
  assetType?: AssetGroup;
  name?: string;
}

export const MovementsWidget = ({
  companyID,
  customerID,
  managerID,
  assetId,
  assetType,
  name,
}: TransactionsWidgetProps) => {
  const { t } = useTranslation();
  const transaction = transactionCrud(companyID, customerID, assetId);
  const activityByYear = activitiesByYearCrud(companyID, customerID, assetId);

  return (
    <div className="relative flex w-full flex-col gap-4 rounded-xl bg-white p-5 shadow-xl">
      <div className="flex items-center gap-2">
        <h1 className="flex items-center gap-2 font-DMSansBold text-l text-blue-1100 md:text-xl">
          {t("scenes.wealth.transactions.title")}
        </h1>
        <button
          type="button"
          onClick={transaction.openCreateDialog}
          className="flex justify-center items-center w-6 h-6 rounded-full bg-blue-800 text-white hover:!bg-blue-900 cursor-pointer"
        >
          <Tooltip target=".pi-plus" />
          <i
            className="pi pi-plus text-xs"
            style={{ color: "white", fontWeight: "900" }}
            data-pr-position="left"
            data-pr-at="left-15 center"
            data-pr-my="right center"
          />
        </button>
      </div>
      <div className="grid gap-4 grid-cols-1 grid-rows-[auto] xl:grid-cols-2 xl:grid-rows-[auto_auto] xl:grid-flow-col">
        <div className="flex flex-row justify-between gap-4 flex-wrap">
          <div className="flex gap-2 mb-2 items-center">
            {assetType && <AssetIcon assetName={assetType} />}
            {name && (
              <div className="flex flex-col items-start justify-center">
                <Text
                  as="span"
                  label={name}
                  className="font-DMSansBold text-lg underline tracking-tight text-blue-1100"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center justify-start w-auto">
            <DateRangeSelector
              dateRange={transaction.dateRange}
              onChange={(dates) => transaction.setDateRange(dates)}
              placeholder={t(
                "scenes.wealth.transactions.dateFilterPlaceholder"
              )}
            />
            <div>
              <FieldText
                name="search"
                value={transaction.search}
                onChange={(e) => transaction.setSearch(e.target.value)}
                placeholder={t("scenes.wealth.transactions.search")}
                className="max-w-[200px] shrink-0"
              />
            </div>
          </div>
        </div>
        <TransactionsTable
          data={
            transaction?.transactionQuery.data?.customerWalletTransactions
              ?.transactions ?? []
          }
          onDelete={transaction.delete}
          onUpdate={transaction.openUpdateDialog}
          pageCount={
            transaction?.transactionQuery.data?.customerWalletTransactions
              ?.totalPages
          }
          pagination={transaction.transactionPagination}
          setPagination={transaction.setTransactionPagination}
          totalItems={
            transaction?.transactionQuery.data?.customerWalletTransactions
              ?.totalCount
          }
          isLoading={transaction?.transactionQuery.isLoading}
        />
        <div className="flex items-center justify-between max-xl:mt-8">
          <h1 className="flex items-center gap-2 font-DMSansBold text-blue-1100 xl:text-white md:text-xl">
            {t("scenes.wealth.activities.history")}
          </h1>
          <Button
            onClick={activityByYear.openCreateDialog}
            size="medium"
            icon="pi pi-plus"
            label="scenes.wealth.activities.create"
          />
        </div>
        <ActivitiesTable
          data={
            activityByYear.query.data?.customerWalletActivitiesByYear?.sort(
              (a, b) => a.year - b.year
            ) ?? []
          }
          isLoading={activityByYear.query.isLoading}
          pagination={activityByYear.pagination}
          onUpdate={activityByYear.openUpdateDialog}
          setPagination={activityByYear.setPagination}
        />
      </div>
      <Dialog
        header={
          activityByYear.open === "create"
            ? t("scenes.wealth.activities.form.title.create")
            : t("scenes.wealth.activities.form.title.update")
        }
        open={["create", "update"].includes(activityByYear.open)}
        onOpenChange={() => activityByYear.setOpen("close")}
        className="pt-6"
      >
        {activityByYear.open === "create" ||
        activityByYear.open === "update" ? (
          <ActivitiesForm
            onSubmit={(data) => activityByYear.submit(data)}
            defaultValues={
              activityByYear.currentActivityYear
                ? pick(activityByYear.currentActivityYear, [
                    "year",
                    "startValue",
                    "endValue",
                  ])
                : undefined
            }
            mode={activityByYear.open}
            abort={() => activityByYear.setOpen("close")}
          />
        ) : null}
      </Dialog>
      <Dialog
        open={["create", "update"].includes(transaction.open)}
        onOpenChange={() => transaction.setOpen("close")}
        className="w-[calc(100vw-2rem)] md:w-1/2 h-full max-h-[90vh]"
      >
        <MouvementForm
          onSubmit={(data) => transaction.submit(data)}
          defaultValues={
            transaction.open === "update" && transaction.currentTransaction
              ? {
                  ...unPick(transaction.currentTransaction, ["id", "metadata"]),
                  fee: transaction.currentTransaction.metadata?.fee ?? 0,
                }
              : {
                  statusValidation: "pending",
                  statusBO: "pending",
                  manager: managerID,
                }
          }
        />
      </Dialog>
      <Toast ref={activityByYear.toast} />
    </div>
  );
};

type DialogMode = "create" | "update" | "delete" | "close";

function activitiesByYearCrud(
  companyID: string,
  customerID: string,
  assetID: string
) {
  const [open, setOpen] = useState<DialogMode>("close");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const query = useQuery(
    ["asset_activities", assetID, pagination],
    () =>
      gql.client.request(ActivitiesWidgetLogic.getActivitiesByYear(), {
        assetId: assetID,
      }),
    {
      keepPreviousData: true,
      enabled: true,
    }
  );

  const [currentActivityYear, setCurrentActivityYear] =
    useState<ActivityByYear | null>(null);

  const toast = useRef<Toast>(null);

  // Mutations

  const create = useMutation(
    (input: ActivityYearHistoryCreationInput) =>
      gql.client.request(ActivitiesWidgetLogic.addActivityYearHistory(), {
        companyID,
        customerID,
        assetID,
        input: {
          year: input.year,
          startValue: input.startValue?.toString(),
          endValue: input.endValue?.toString(),
        },
      }),
    {
      onSuccess: () => {
        query.refetch();
        setOpen("close");
      },
      onError() {
        toast.current?.show({
          severity: "error",
          summary: t("scenes.wealth.activities.toast.create.error"),
          detail: t("scenes.wealth.activities.toast.create.summary"),
        });
      },
    }
  );

  const update = useMutation(
    (input: ActivityYearHistoryCreationInput) =>
      gql.client.request(ActivitiesWidgetLogic.updateActivityYearHistory(), {
        companyID,
        customerID,
        assetID,
        input: {
          year: input.year,
          startValue: input.startValue?.toString(),
          endValue: input.endValue?.toString(),
        },
      }),
    {
      onSuccess: () => {
        query.refetch();
        setOpen("close");
      },
      onError() {
        toast.current?.show({
          severity: "error",
          summary: t("scenes.wealth.activities.toast.update.error"),
        });
      },
    }
  );

  const submit = (data: ActivityYearHistoryCreationInput) => {
    switch (open) {
      case "create":
        create.mutate(data);
        break;
      case "update":
        update.mutate(data);
        break;
      default:
        break;
    }
  };

  const openCreateDialog = () => {
    setCurrentActivityYear(null);
    setOpen("create");
  };

  const openUpdateDialog = (activityByYearToUpdate: ActivityByYear) => {
    setCurrentActivityYear(activityByYearToUpdate);
    setOpen("update");
  };

  return {
    open,
    create,
    update,
    query,
    toast,
    currentActivityYear,
    pagination,
    submit,
    setOpen,
    openCreateDialog,
    openUpdateDialog,
    setPagination,
  };
}
function transactionCrud(
  companyID: string,
  customerID: string,
  assetId: string
) {
  const [open, setOpen] = useState<DialogMode>("close");
  const [transactionPagination, setTransactionPagination] =
    useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [currentTransaction, setCurrentTransaction] =
    useState<Transaction | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const transactionQuery = useQuery(
    ["asset_transactions", assetId, transactionPagination, search, dateRange],
    () =>
      gql.client.request(TransactionsWidgetLogic.queries(), {
        assetId: assetId,
        pagination: {
          page: transactionPagination.pageIndex + 1,
          size: transactionPagination.pageSize,
        },
        dateRange,
        search: search !== "" ? search : undefined,
      }),
    {
      keepPreviousData: true,
      enabled: true,
    }
  );

  // Mutations

  const create = useMutation(
    "create_transaction",
    (data: TransactionCreationInput) =>
      gql.client.request(TransactionsWidgetLogic.transactionCreation(), {
        companyID,
        customerID,
        assetID: assetId,
        input: {
          ...data,
        },
      }),
    {
      onSuccess: () => {
        transactionQuery.refetch();
        setOpen("close");
      },
    }
  );

  const update = useMutation(
    (data: TransactionCreationInput) =>
      gql.client.request(TransactionsWidgetLogic.transactionUpdate(), {
        companyID,
        customerID,
        assetID: assetId,
        transactionID: currentTransaction?.id as string,
        input: {
          ...data,
        },
      }),
    {
      onSuccess: () => {
        transactionQuery.refetch();
        setOpen("close");
      },
    }
  );

  const _delete = useMutation(
    (data: Transaction) =>
      gql.client.request(TransactionsWidgetLogic.transactionDelete(), {
        companyID,
        customerID,
        transactionID: data.id as string,
      }),
    {
      onSuccess: () => {
        transactionQuery.refetch();
        setOpen("close");
      },
    }
  );
  const submit = (data: TransactionCreationInput) => {
    switch (open) {
      case "create":
        create.mutate(data);
        break;
      case "update":
        update.mutate(data);
        break;
      default:
        break;
    }
  };

  const openCreateDialog = () => {
    setCurrentTransaction(null);
    setOpen("create");
  };

  const openUpdateDialog = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setOpen("update");
  };

  const onDelete = (transaction: Transaction) => {
    if (!confirm(t("forms.confirm.delete") as string)) return;

    _delete.mutate(transaction);
  };

  return {
    open,
    create,
    update,
    dateRange,
    search,
    delete: onDelete,
    transactionQuery,
    currentTransaction,
    transactionPagination,
    submit,
    setSearch,
    setOpen,
    openCreateDialog,
    openUpdateDialog,
    setTransactionPagination,
    setDateRange,
  };
}
