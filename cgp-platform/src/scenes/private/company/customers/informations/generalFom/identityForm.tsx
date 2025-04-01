import { MultiSelect } from "primereact/multiselect";
import { Tooltip } from "primereact/tooltip";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Button, Dialog, Text } from "../../../../../../components";
import { useClaims } from "../../../../../../hooks/useClaims";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { ManagerClaims, ReferenceAccessValue } from "../../../../../../types";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../UIComponents/Label/Label";
import { SelectWithRef } from "../../../../../../UIComponents/Select/Select";
import { CompanyGeneralLogic } from "../../../settings/office/generalOffice/general.logic";
import { CustomersConformityLogic } from "../../conformity/conformity.logic";
import { DocumentGedSelection } from "../../conformity/conformityCreation/UploadStep";
import { useCustomerContext } from "../../customerContext";
import { CompanyCustomersInformationsLogic } from "../informations.logic";

export function IdentityForm() {
  const { t } = useTranslation();
  const { control, setValue, getValues, resetField } = useFormContext();

  const { companyId, customerId } = useCustomerContext();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showDialogDocumentAdd, setShowDialogDocumentAdd] = useState(false);
  const [mainManager, setMainManager] = useState<string>();
  const [selectedManagers, setSelectedManagers] = useState<
    ReferenceAccessValue[]
  >([]);

  const claimsQuery = useClaims({ companyID: companyId });

  const listManagers = useQuery(["company", "managers", companyId], async () =>
    CompanyGeneralLogic.managerListQuery(companyId)
  );

  const idCardDocumentQuery = useQuery(
    "getDocument",
    () =>
      gql.client.request(CustomersConformityLogic.getDocument(), {
        companyID: companyId,
        customerID: customerId,
        id: getValues("idCard") as string,
      }),
    { enabled: Boolean(getValues("idCard")), cacheTime: 0 }
  );

  const { mutate: customerReferencesAccessUpdate } = useMutation(
    (input: ReferenceAccessValue[]) => {
      return gql.client.request(
        CompanyCustomersInformationsLogic.customerReferencesAccessUpdate(),
        {
          companyID: companyId,
          customerID: customerId,
          values: input,
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "companyCustomersInformations",
          customerId,
        ]);
        queryClient.invalidateQueries([
          "layout_customer",
          companyId,
          customerId,
        ]);
        queryClient.invalidateQueries(["lcbForm", companyId, customerId]);
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
      },
    }
  );

  // Query
  const listSelectedManagers = useQuery(
    ["company", "managers", companyId, customerId],
    async () =>
      CompanyGeneralLogic.selectedManagerListQuery(companyId, customerId)
  );

  const idDocument = useMemo(
    () => idCardDocumentQuery?.data?.document,
    [idCardDocumentQuery]
  );

  useEffect(() => {
    const main = listSelectedManagers.data?.customerReferenceAccessList?.find(
      (manager) => manager.primary
    );

    setMainManager(main?.manager.id);

    const managersSelected =
      (listSelectedManagers.data?.customerReferenceAccessList
        ?.filter((manager) => manager.manager.id !== main?.manager.id)
        .map((manager) => ({
          managerID: manager.manager.id,
          primary: manager.primary,
        })) as ReferenceAccessValue[]) ?? [];

    setSelectedManagers(managersSelected);
  }, [listSelectedManagers.data]);

  const managerMap = new Map(
    listManagers.data?.companyManagersStats?.map((manager) => [
      manager.id,
      manager.name,
    ])
  );

  return (
    <>
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="scenes.customers.details.identity"
      />

      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="seniorAdvisor">
            {t("forms.fields.customers.details.seniorAdvisor")}
          </Label>
          <SelectWithRef
            className="rounded-xl"
            formatOptionLabel={({ value, label }) => {
              const manager = listManagers.data?.companyManagersStats?.find(
                (manager) => manager.id === value
              );

              return (
                <div className="flex items-center gap-2">
                  <span>{label}</span>
                  {manager?.providerCode && (
                    <span className="text-sm text-blue-800">
                      {manager.providerCode}
                    </span>
                  )}
                </div>
              );
            }}
            menuPortalTarget={document.body}
            options={listManagers.data?.companyManagersStats
              ?.filter(
                (manager) =>
                  !selectedManagers.some(
                    (selectedManager) =>
                      selectedManager.managerID === manager.id
                  )
              )
              .map((manager) => ({
                label: manager.name || "",
                value: manager.id || "",
              }))}
            isDisabled={
              !claimsQuery.data?.authenticated?.manager?.claims?.includes(
                ManagerClaims.ClientsReads
              )
            }
            value={{
              label:
                listManagers.data?.companyManagersStats?.find(
                  (manager) => manager.id === (mainManager ?? "")
                )?.name ?? "",
              value: mainManager ?? "",
            }}
            onChange={async (e) => {
              let selected = selectedManagers;
              if (!e?.value) {
                selected = selected.filter((manager) => !manager.primary);
              } else {
                const managers = {
                  managerID: e?.value as string,
                  primary: true,
                };
                selected.push(managers);
              }
              setMainManager(e?.value as string);
              customerReferencesAccessUpdate(
                selected as ReferenceAccessValue[]
              );
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="secondaryAdvisor">
            {t("forms.fields.customers.details.secondaryAdvisor")}
          </Label>

          <MultiSelect
            filter
            className="rounded-xl"
            pt={{
              label: {
                className: "!py-1.5",
              },
              root: {
                className: "background-blue-800",
              },
            }}
            optionLabel="name"
            optionValue="value"
            options={listManagers.data?.companyManagersStats
              ?.map((manager) => ({
                name: manager.name || "",
                value: manager.id || "",
              }))
              .filter((manager) => manager.value !== mainManager)}
            value={selectedManagers
              .filter((manager) => manager.managerID !== mainManager)
              .map((selectedManager) => selectedManager.managerID)}
            onChange={(e) => {
              const selected = e.value;

              let managers = listManagers.data?.companyManagersStats
                ?.filter((manager) => selected.includes(manager.id))
                .map((manager) => ({
                  managerID: manager.id || "",
                  primary: false,
                }));

              setSelectedManagers(managers as ReferenceAccessValue[]);

              managers = managers?.map((manager) => ({
                managerID: manager.managerID,
                primary: false,
              }));

              if (mainManager) {
                managers?.push({
                  managerID: mainManager as string,
                  primary: true,
                });
              }

              customerReferencesAccessUpdate(
                managers as ReferenceAccessValue[]
              );
            }}
          />
        </div>
        <Controller
          name="idCard"
          control={control}
          render={() => (
            <div className="flex justify-between w-full">
              <div>
                <Text
                  as="label"
                  className="leading-6 text-blue-1100 font-normal"
                  label="forms.fields.customers.details.idCard"
                />
              </div>

              <div>
                {idCardDocumentQuery.isLoading && (
                  <div className="flex justify-center items-center w-6 h-6text-blue-800">
                    <i className="pi pi-spin pi-spinner text-xs"></i>
                  </div>
                )}
                <a
                  className="leading-6 text-blue-800 font-normal"
                  href={idDocument?.url ?? ""}
                  target="_blank" // Open in a new tab
                  rel="noopener noreferrer" // Security best practice
                >
                  {idDocument?.name}
                </a>
              </div>
              <div className="flex align-center justify-center gap-1">
                <div
                  className="flex justify-center items-center w-6 h-6 rounded-full bg-blue-800 text-white hover:!bg-blue-900 cursor-pointer"
                  id="addDocumentButton"
                  onClick={() => setShowDialogDocumentAdd(true)}
                >
                  <Tooltip target="#addDocumentButton" position="top">
                    {idDocument?.name
                      ? t("forms.fields.actions.update")
                      : t("forms.fields.actions.add")}
                  </Tooltip>
                  <i
                    className={`pi ${idDocument?.name ? "pi-pencil" : "pi-plus"} text-xs`}
                    style={{ color: "white", fontWeight: "900" }}
                    data-pr-position="left"
                    data-pr-at="left-15 center"
                    data-pr-my="right center"
                  ></i>
                </div>
                {idDocument?.name && (
                  <div
                    className="flex justify-center items-center w-6 h-6 rounded-full bg-blue-800 text-white hover:!bg-blue-900 cursor-pointer"
                    id="removeDocumentButton"
                    onClick={() => {
                      idCardDocumentQuery.remove();
                      resetField("idCard");
                      setValue("idCard", undefined);
                    }}
                  >
                    <Tooltip target="#removeDocumentButton" position="top">
                      {t("forms.fields.actions.remove")}
                    </Tooltip>
                    <i
                      className={`pi pi-times text-xs`}
                      style={{ color: "white", fontWeight: "900" }}
                      data-pr-position="left"
                      data-pr-at="left-15 center"
                      data-pr-my="right center"
                    ></i>
                  </div>
                )}
              </div>
            </div>
          )}
        />
        <Controller
          name="idNumber"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="idNumber">
                {t("forms.fields.customers.details.idNumber")}
              </Label>
              <FieldText
                id="idNumber"
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="issueDate"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="issueDate">
                {t("forms.fields.customers.details.issueDate")}
              </Label>
              <FieldDate
                id="issueDate"
                {...field}
                onValueChange={(date) => {
                  field.onChange(date);

                  const newDate = new Date(date);
                  newDate.setFullYear(newDate.getFullYear() + 10);
                  newDate.setDate(newDate.getDate() - 1);

                  setValue("expirationDate", newDate, { shouldValidate: true });
                  setRefreshKey((prev) => prev + 1);
                }}
                value={field.value}
              />
            </div>
          )}
        />
        <Controller
          name="authority"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="authority">
                {t("forms.fields.customers.details.authority")}
              </Label>
              <FieldText
                id="authority"
                {...field}
                value={field.value as string}
              />
            </div>
          )}
        />
        <Controller
          name="expirationDate"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="expirationDate">
                {t("forms.fields.customers.details.expirationDate")}
              </Label>
              <FieldDate
                key={refreshKey}
                id="expirationDate"
                {...field}
                value={field.value}
              />
            </div>
          )}
        />
      </div>

      <Dialog
        open={showDialogDocumentAdd}
        onOpenChange={() => {
          setSelectedDocuments([]);
          setShowDialogDocumentAdd(false);
        }}
        className="flex flex-col gap-4 align-center justify-center"
      >
        <DocumentGedSelection
          selectedGedDocuments={selectedDocuments}
          setSelectedGedDocuments={setSelectedDocuments}
          envelopeFilter={false}
        />
        <Button
          label="actions.save"
          onClick={() => {
            if (selectedDocuments.length > 0) {
              setValue("idCard", selectedDocuments[0]);
            }
            setSelectedDocuments([]);
            setShowDialogDocumentAdd(false);
          }}
          className="w-full"
        />
      </Dialog>
    </>
  );
}
