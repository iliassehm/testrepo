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
import { Dispatch, SetStateAction, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Button, Dialog } from "../../../../../../components";
import { Text } from "../../../../../../components";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { Customer } from "../../../../../../types";
import { AssignModalLogic } from "../../../globalWealth/subWealth/assetTypeWealth/AssignModal.logic";
import { AssetDetailLogic } from "../../wealth/AssetDetail/assetDetail.logic";
import { CompanyCustomersInformationsLogic } from "../informations.logic";

export interface Client {
  id: string;
  name: string;
  mail: string;
}

export const ExistingCustomerModal = ({
  open,
  setOpen,
  t,
  onSuccessfulSubmit,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  t: TFunction;
  onSuccessfulSubmit?: (customer: Customer | null) => void;
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<Client | null>(null);
  const [filter, setFilter] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/informations",
  });
  const text = globalFilterValue.length === 0 ? null : globalFilterValue;
  const toast = useToast();
  const queryClient = useQueryClient();

  // Query
  const query = useQuery(["customerSearch", companyId, text], () =>
    gql.client.request(AssignModalLogic.queries(), {
      companyID: companyId ?? "",
      text: text,
      suggestionsTokens: [],
    })
  );

  const { data: usersInCustomerReferenceData } = useQuery(
    ["users_in_customer_reference", companyId, customerId],
    () =>
      gql.client.request<{ users: Customer[] }>(
        AssetDetailLogic.getUsersInCustomerReference(),
        {
          companyId: companyId,
          customerId: customerId,
        }
      )
  );

  // Mutation
  const { mutate: createRelationFromExistingCustomer, isLoading } = useMutation(
    "createRelationFromExistingCustomer",
    (existingCustomerId: string) =>
      gql.client.request(
        CompanyCustomersInformationsLogic.createRelationFromExistingCustomer(),
        {
          companyID: companyId as string,
          customerID: customerId as string,
          existingCustomerID: existingCustomerId,
        }
      ),
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries(["relation", companyId, customerId]);
        queryClient.invalidateQueries([
          "users_in_customer_reference",
          companyId,
          customerId,
        ]);

        toast?.current?.show({
          severity: "success",
          summary: "Success",
          detail: t("forms.fields.notifications.success.save"),
        });
        setOpen(false);
        const customer = data?.createRelationFromExistingCustomer
          ? ({
              ...data.createRelationFromExistingCustomer,
            } as Customer)
          : null;
        onSuccessfulSubmit?.(customer);
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

    createRelationFromExistingCustomer(selectedCustomer.id);
  }

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filter };
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

  const header = renderHeader();

  const customersList = query.data?.searchCustomer?.filter(
    (customer) =>
      !usersInCustomerReferenceData?.users?.some(
        (user) => user.id === customer.id
      )
  );

  return (
    <Dialog
      open={open}
      onOpenChange={() => setOpen(false)}
      header={
        <div>
          <Text
            label={t("scenes.customers.details.companies.linkExistingCustomer")}
            as="h1"
            className="font-bold"
          />
        </div>
      }
      className="min-w-[1200px]"
    >
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
        {selectedCustomer && (
          <Button
            label={t("forms.fields.actions.link")}
            loading={isLoading}
            onClick={handleSubmit}
          />
        )}
      </div>
    </Dialog>
  );
};
