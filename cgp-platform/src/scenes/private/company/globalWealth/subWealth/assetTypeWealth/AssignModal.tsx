import { useParams } from "@tanstack/react-router";
import { TFunction } from "i18next";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTableFilterMeta,
  DataTableValueArray,
} from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Button, Dialog } from "../../../../../../components";
import { Text } from "../../../../../../components";
import { numberFormat } from "../../../../../../helpers";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import {
  Amount,
  AssetAffectationMutationVariables,
} from "../../../../../../types";
import { AssignModalLogic } from "./AssignModal.logic";

export interface Client {
  id: string;
  name: string;
  mail: string;
}

export interface Account {
  id: string;
  name: string;
  amount?: number;
}

const customers: Client[] = [];

const ChipToAssign = ({
  chip,
  onDelete,
}: {
  chip: Account;
  onDelete: (chip: Account) => void;
}) => {
  return (
    <div className="mb-2 mr-2 inline-flex w-fit items-center rounded-lg bg-grey-400 px-3 py-1 text-sm font-medium text-gray-700">
      <div className="flex flex-col font-medium">
        <span className="mr-2">{chip.name}</span>
        <span className="mr-2 text-gray-500">
          {chip.amount ? numberFormat(chip.amount) : "N/A"}
        </span>
      </div>

      <button
        className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
        aria-label="Remove"
        onClick={() => onDelete(chip)}
      >
        <i className="pi pi-times" style={{ fontSize: "0.5rem" }}></i>
      </button>
    </div>
  );
};

function AccountsList({
  accounts,
  onDelete,
}: {
  accounts: Account[];
  onDelete: (chip: Account) => void;
}) {
  return (
    <div className="chip-list">
      {accounts.map((account) => (
        <ChipToAssign key={account.id} chip={account} onDelete={onDelete} />
      ))}
    </div>
  );
}

export const AssignModal = ({
  open,
  setOpen,
  t,
  accounts,
  onSuccess,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  t: TFunction;
  accounts: Account[];
  onSuccess: () => void;
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<Client | null>(null);
  const [filter, setFilter] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [displayable, setDisplayable] = useState<Account[]>([]);
  const accountNames = customers.map((account) => account.name);
  const { companyId } = useParams({
    from: "/company/$companyId/global-wealth/sub/",
  });
  const text = globalFilterValue.length === 0 ? null : globalFilterValue;
  const toast = useToast();
  const queryClient = useQueryClient();

  // Query
  const query = useQuery(
    ["customerSearch", companyId, text, ...accountNames],
    () =>
      gql.client.request(AssignModalLogic.queries(), {
        companyID: companyId ?? "",
        text: text,
        suggestionsTokens: accountNames,
      })
  );

  // Mutation
  const { mutate: assetAffectation, isLoading } = useMutation(
    "assetAffectation",
    (input: Omit<AssetAffectationMutationVariables, "companyID">) =>
      gql.client.request(AssignModalLogic.assetAffectation(), {
        companyID: companyId as string,
        ...input,
      }),
    {
      onSuccess: async () => {
        toast?.current?.show({
          severity: "success",
          summary: t("forms.fields.notifications.success.save"),
          detail: t("forms.fields.assetAffectation.assignedAccountsToClient", {
            count: displayable.length,
            name: selectedCustomer?.name,
          }),
          life: 3000,
        });
        queryClient.invalidateQueries([
          "companyAssetUnderManagement",
          companyId,
        ]);
        onSuccess();
      },
      onError: () => {
        toast?.current?.show({
          severity: "error",
          summary: "Error",
          detail: t("forms.fields.notifications.error.send"),
        });
      },
    }
  );

  function handleSubmit(event: { preventDefault: () => void }) {
    if (!selectedCustomer) return;

    event.preventDefault();
    assetAffectation({
      assets: displayable.map((asset) => asset.id),
      selectedCustomerID: selectedCustomer.id,
    });
  }

  function handleChipDelete(accountToDelete: Account) {
    const updatedChips = displayable.filter(
      (account) => account.id !== accountToDelete.id
    );
    setDisplayable(updatedChips);
    if (updatedChips.length === 0 || accounts.length === 0) {
      setOpen(false);
    }
  }

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filter };

    // TODO: Check with Kacoulib
    // _filters["global"].value = value;

    setFilter(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex w-full items-center justify-between">
        <Text label={t("forms.fields.assetAffectation.selectClient")} />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={t("scenes.company.customers.search") as string}
          />
        </span>
      </div>
    );
  };

  useEffect(() => {
    setDisplayable(accounts);
  }, [accounts]);

  const header = renderHeader();

  const customersList = query.data?.searchCustomer;

  const DialogHeader = () => {
    let heading = "";
    if (displayable.length > 0 && displayable.length == 1) {
      heading =
        t("forms.fields.assetAffectation.attach") + " " + displayable[0].name;
    } else if (displayable.length > 1) {
      heading = t("forms.fields.assetAffectation.attachAccounts", {
        count: displayable.length,
      });
    }

    return (
      <div>
        <Text label={heading} as="h1" className="font-bold" />
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => setOpen(false)}
      header={<DialogHeader />}
      className="min-w-[1200px]"
    >
      <AccountsList accounts={displayable} onDelete={handleChipDelete} />
      <DataTable
        value={customersList as DataTableValueArray | undefined}
        rows={10}
        dataKey="id"
        filters={filter}
        globalFilterFields={["name", "email"]}
        header={header}
        emptyMessage={t("forms.fields.assetAffectation.noResult")}
        selectionMode="single"
        selection={selectedCustomer ?? undefined}
        onSelectionChange={(e) => {
          const value = e.value as unknown as Client;
          setSelectedCustomer(value);
        }}
        metaKeySelection={false}
        className="font-bold"
      >
        <Column
          field="name"
          header={t("forms.fields.assetAffectation.name")}
          style={{ minWidth: "12rem" }}
        />
        <Column
          header={t("forms.fields.assetAffectation.mail")}
          field="email"
          style={{ minWidth: "12rem" }}
        />
      </DataTable>
      <div className="mt-8 flex w-full flex-row-reverse">
        {displayable.length > 0 && selectedCustomer && (
          <Button
            label={
              displayable.length > 1
                ? t("forms.fields.assetAffectation.multipleAssign")
                : t("forms.fields.assetAffectation.assign")
            }
            loading={isLoading}
            onClick={handleSubmit}
          />
        )}
      </div>
    </Dialog>
  );
};
