import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import { Button, Dialog } from "../../../../../../components";
import { getFormErrorMessage } from "../../../../../../constants";
import { useClaims } from "../../../../../../hooks/useClaims";
import { gql } from "../../../../../../service/client";
import { ManagerClaims } from "../../../../../../types";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { FieldTextarea } from "../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../UIComponents/Label/Label";
import Select from "../../../../../../UIComponents/Select/Select";
import { SelectWithRef } from "../../../../../../UIComponents/Select/Select";
import { CompanyGeneralLogic } from "../../../settings/office/generalOffice/general.logic";
import type { TaskState } from "./task";
import { TaskLogic } from "./task.logic";

export type AddDialogProps = {
  visible: boolean;
  onHide: () => void;
  onSubmit: (newTask: TaskState) => void;
  isLoading: boolean;
  taskState: TaskState;
};

export const AddDialog = ({
  visible,
  onHide,
  isLoading,
  onSubmit,
  taskState,
}: AddDialogProps) => {
  const { t, i18n } = useTranslation();
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/",
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    values: taskState,
    resetOptions: {
      keepDirty: false,
      keepDirtyValues: false,
      keepValues: false,
      keepIsSubmitted: false,
    },
  });

  const claimsQuery = useClaims({ companyID: params.companyId });

  const listTaskCategories = useQuery(
    ["company", "taskcategories", params.companyId],
    () =>
      gql.client.request(TaskLogic.taskCategoryList(), {
        companyID: params.companyId,
      }),
    {
      enabled: visible,
    }
  );

  const listManagers = useQuery(
    ["company", "managers", params.companyId],
    async () => CompanyGeneralLogic.managerListQuery(params.companyId),
    {
      enabled: visible,
    }
  );

  const customerForm = watch("customer");

  const accountNumbersQuery = useQuery(
    ["accountNumbers", params.companyId, params.customerId, customerForm],
    () =>
      gql.client.request(TaskLogic.assetsAccountNumbers(), {
        companyID: params.companyId,
        customerID: params.customerId ?? customerForm ?? "",
      }),
    {
      enabled: visible,
    }
  );

  const customersListQuery = useQuery(
    ["customersTaskList", params.companyId],
    () =>
      gql.client.request(TaskLogic.CustomersList(), {
        companyID: params.companyId,
        input: {
          search: null,
        },
      }),
    {
      enabled: !params.customerId,
    }
  );

  const noOptionsMessage = useMemo(() => t("forms.taskForm.no_contract"), [t]);

  return (
    <>
      <Dialog
        header={
          taskState.edit ? t(`forms.taskForm.edit`) : t(`forms.taskForm.add`)
        }
        open={visible}
        className="w-[600px] max-w-[95vw]"
        onOpenChange={onHide}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-6">
            <div className="w-full">
              <Controller
                name="title"
                control={control}
                rules={{
                  required: t(`forms.taskForm.title.error`) as string,
                }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label
                      htmlFor={field.name}
                      className="text-sm font-semibold text-gray-700"
                    >
                      {t(`forms.taskForm.title.label`)}
                    </Label>
                    <FieldText
                      id={field.name}
                      {...field}
                      className="w-full bg-slate-50 h-10 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder={t(`forms.taskForm.title.placeholder`) || ""}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex-1">
                <Controller
                  name="manager"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label
                        htmlFor="manager"
                        className="text-sm font-semibold text-gray-700"
                      >
                        {t("forms.taskForm.manager.label")}
                      </Label>
                      <SelectWithRef
                        className="rounded-lg"
                        formatOptionLabel={({ value, label }) => {
                          const manager =
                            listManagers.data?.companyManagersStats?.find(
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
                        options={
                          listManagers.data?.companyManagersStats?.map(
                            (manager) => ({
                              label: manager.name || "",
                              value: manager.id || "",
                            })
                          ) ?? []
                        }
                        isDisabled={
                          !claimsQuery.data?.authenticated?.manager?.claims?.includes(
                            ManagerClaims.ClientsInvite
                          )
                        }
                        {...field}
                        value={{
                          label:
                            listManagers.data?.companyManagersStats?.find(
                              (manager) => manager.id === field.value
                            )?.name ?? "",
                          value: field.value ?? "",
                        }}
                        onChange={(e) => field.onChange(e?.value)}
                      />
                    </div>
                  )}
                />
              </div>
              <div className="flex-1">
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label
                        htmlFor={field.name}
                        className="text-sm font-semibold text-gray-700"
                      >
                        {t(`forms.taskForm.category.label`)}
                      </Label>
                      <Select
                        id={field.name}
                        value={{
                          value: field.value as string,
                          label: field.value
                            ? i18n.exists(
                                "forms.taskForm.categories." + field.value
                              )
                              ? (t(
                                  "forms.taskForm.categories." + field.value
                                ) as string)
                              : field.value
                            : "",
                        }}
                        onChange={(option) => field.onChange(option?.value)}
                        options={
                          listTaskCategories.data?.taskCategoryList
                            ?.map((category) => ({
                              label: i18n.exists(
                                "forms.taskForm.categories." + category.key
                              )
                                ? (t(
                                    "forms.taskForm.categories." + category.key
                                  ) as string)
                                : category.name,
                              value: category.key ?? "",
                            }))
                            .sort((a, b) => a.label.localeCompare(b.label)) ??
                          []
                        }
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "var(--bg-slate-50)",
                            borderColor: "var(--input-border-color)",
                            borderRadius: "0.5rem",
                          }),
                        }}
                      />
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!params.customerId && (
                <div className="flex-1">
                  <Controller
                    name="customer"
                    control={control}
                    rules={{
                      required: t(`forms.taskForm.customer.error`) as string,
                    }}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label
                          htmlFor={field.name}
                          className="text-sm font-semibold text-gray-700"
                        >
                          {t(`forms.taskForm.customer.label`)}
                        </Label>
                        <Select
                          id={field.name}
                          value={{
                            label:
                              customersListQuery.data?.company?.customerList?.edges?.find(
                                (customer) => customer.node.id === field.value
                              )?.node.name ?? "",
                            value: field.value ?? "",
                          }}
                          onChange={(option) => {
                            field.onChange(option?.value);
                            setValue("contractNumber", "");
                          }}
                          options={
                            customersListQuery.data?.company?.customerList?.edges
                              ?.map((customer) => ({
                                label: customer.node.name,
                                value: customer.node.id ?? "",
                              }))
                              .sort((a, b) => a.label.localeCompare(b.label)) ??
                            []
                          }
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              backgroundColor: "var(--bg-slate-50)",
                              borderColor: "var(--input-border-color)",
                              borderRadius: "0.5rem",
                            }),
                          }}
                        />
                        {getFormErrorMessage(field.name, errors)}
                      </div>
                    )}
                  />
                </div>
              )}
              <div className="flex-1">
                <Controller
                  name="contractNumber"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label
                        htmlFor={field.name}
                        className="text-sm font-semibold text-gray-700"
                      >
                        {t(`forms.taskForm.contractNumber.label`)}
                      </Label>
                      <Select
                        id={field.name}
                        value={{
                          value: field.value as string,
                          label:
                            accountNumbersQuery.data?.accountNumbers?.find(
                              (acc) => acc.label === field.value
                            )?.label ?? "",
                        }}
                        onChange={(option) => field.onChange(option?.value)}
                        options={
                          accountNumbersQuery.data?.accountNumbers?.sort(
                            (a, b) => a.label.localeCompare(b.label)
                          ) ?? []
                        }
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "var(--bg-slate-50)",
                            borderColor: "var(--input-border-color)",
                            borderRadius: "0.5rem",
                          }),
                        }}
                        isDisabled={!customerForm}
                        noOptionsMessage={() => t(`forms.taskForm.no_contract`)}
                      />
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="flex-1">
              <Controller
                name="schedule"
                control={control}
                rules={{
                  required: t(`forms.taskForm.schedule.error`) as string,
                }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label
                      htmlFor={field.name}
                      className="text-sm font-semibold text-gray-700"
                    >
                      {t(`forms.taskForm.schedule.label`)}
                    </Label>
                    <div className="w-48">
                      <FieldDate
                        id={field.name}
                        {...field}
                        onValueChange={field.onChange}
                        className="w-full bg-slate-50 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder={
                          t(`forms.taskForm.schedule.placeholder`) || ""
                        }
                      />
                    </div>
                    {getFormErrorMessage(field.name, errors)}
                  </div>
                )}
              />
            </div>

            <div className="flex-1">
              <Controller
                name="text"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label
                      htmlFor={field.name}
                      className="text-sm font-semibold text-gray-700"
                    >
                      {t(`forms.taskForm.text.label`)}
                    </Label>
                    <FieldTextarea
                      id={field.name}
                      {...field}
                      className="w-full bg-slate-50 h-32 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder={t(`forms.taskForm.text.placeholder`) || ""}
                      style={{ resize: "none" }}
                    />
                  </div>
                )}
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button
                label={t(`forms.fields.actions.save`)}
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                loading={isLoading}
              />
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};
