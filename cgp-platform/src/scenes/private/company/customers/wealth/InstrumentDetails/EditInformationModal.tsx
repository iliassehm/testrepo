import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { Label } from "../../../../../../UIComponents/Label/Label";
import Select from "../../../../../../UIComponents/Select/Select";
import { EditInformationData, FundInformation } from "./InstrumentDetail";
import { InstrumentDetailLogic } from "./InstrumentDetail.logic";

interface EditInformationModalProps {
  companyID: string;
  code: string;
  isOpen: boolean;
  onClose: () => void;
  information: FundInformation;
}

export const EditInformationModal: React.FC<EditInformationModalProps> = ({
  companyID,
  code,
  isOpen,
  onClose,
  information,
}) => {
  const { t } = useTranslation();

  const currencyOptions = [
    { label: "Euro", value: "EUR" },
    { label: "Dollar", value: "USD" },
  ];

  const instrumentCategory = [
    {
      label: t("investmentTypes.opcvm"),
      value: "opcvm",
    },
    {
      label: t("investmentTypes.obligations"),
      value: "obligations",
    },
    {
      label: t("investmentTypes.stock"),
      value: "stock",
    },
    {
      label: t("investmentTypes.etf"),
      value: "etf",
    },
    {
      label: t("investmentTypes.fip"),
      value: "fip",
    },
    {
      label: t("investmentTypes.fcpi"),
      value: "fcpi",
    },
    {
      label: t("investmentTypes.scpi"),
      value: "scpi",
    },
    {
      label: t("investmentTypes.fcpr"),
      value: "fcpr",
    },
    {
      label: t("investmentTypes.fcpe"),
      value: "fcpe",
    },
    {
      label: t("investmentTypes.support_in_euro"),
      value: "supportInEuro",
    },
    {
      label: t("investmentTypes.product_structure"),
      value: "productStructure",
    },
    {
      label: t("investmentTypes.fund"),
      value: "fund",
    },
  ];

  const defaultValues: EditInformationData = {
    code: information.code,
    name: information.label ?? "",
    managementCompany: information.managementCompany ?? "",
    currency: information.currency ?? "",
    category: information.category ?? "opcvm",
    subcategory: information.subcategory ?? "",
    location: information.location ?? "",
    riskIndicator: information.riskIndicator ?? 7,
    sfdr: information.sfdr ?? 0,
  };

  const queryClient = useQueryClient();
  const toast = useToast();
  const form = useForm({
    defaultValues,
  });

  // Mutations
  const updateMutation = useMutation(
    "investment_creation",
    (input: EditInformationData) =>
      gql.client.request(InstrumentDetailLogic.instrumentUpdate(), {
        companyID,
        code,
        input,
      }),
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(["instrumentDetailsQuery", code]);
        onClose();
        toast?.current?.show({
          severity: "success",
          summary: t(
            "forms.fields.instrumentDetails.edit.toast.success.summary"
          ) as string,
          detail: t(
            "forms.fields.instrumentDetails.edit.toast.success.detail",
            {
              name: data?.instrumentUpdate?.code,
            }
          ),
        });
      },
      onError: (error, variables) => {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t(
            "forms.fields.instrumentDetails.edit.toast.failure.summary"
          ) as string,
          detail: t(
            "forms.fields.instrumentDetails.edit.toast.failure.detail",
            {
              name: variables.name,
            }
          ),
        });
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form.getValues());
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-[600px] max-h-[85vh] overflow-y-auto animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold">
              {t(`forms.fields.instrumentDetails.edit.label`)}
            </Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="name"
                  disabled
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <Label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t(`forms.fields.instrumentDetails.edit.name`)}
                      </Label>
                      <input
                        type="text"
                        id="name"
                        {...field}
                        onChange={field.onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="managementCompany"
                  disabled
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <Label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t(
                          `forms.fields.instrumentDetails.edit.managementCompany`
                        )}
                      </Label>
                      <input
                        type="text"
                        id="managementCompany"
                        {...field}
                        onChange={field.onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="currency"
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <Label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t(`forms.fields.instrumentDetails.edit.currency`)}
                      </Label>
                      <Select
                        id={field.name}
                        isDisabled
                        value={
                          currencyOptions.find(
                            (option) => option.value === field.value
                          ) || null
                        }
                        onChange={(option) => field.onChange(option?.value)}
                        options={currencyOptions}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "var(--bg-slate-50)",
                            borderColor: "var(--input-border-color)",
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="category"
                  control={form.control}
                  rules={{
                    required: t(
                      `forms.fields.wealth.scpi.accountType.error`
                    ) as string,
                  }}
                  render={({ field }) => (
                    <>
                      <Label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t(`forms.fields.instrumentDetails.edit.type`)}
                      </Label>
                      <Select
                        id={field.name}
                        isDisabled
                        value={
                          instrumentCategory.find(
                            (option) => option.value === field.value
                          ) || null
                        }
                        onChange={(option) => field.onChange(option?.value)}
                        options={instrumentCategory}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "var(--bg-slate-50)",
                            borderColor: "var(--input-border-color)",
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="subcategory"
                  disabled
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <Label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t(`forms.fields.instrumentDetails.edit.subcategory`)}
                      </Label>
                      <input
                        type="text"
                        id="subcategory"
                        {...field}
                        onChange={field.onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="location"
                  disabled
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <Label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t(`forms.fields.instrumentDetails.edit.location`)}
                      </Label>
                      <input
                        type="text"
                        id="location"
                        {...field}
                        onChange={field.onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="riskIndicator"
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <Label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t(`forms.fields.instrumentDetails.edit.riskIndicator`)}
                      </Label>
                      <input
                        type="number"
                        id="riskIndicator"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="sfdr"
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <Label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t(`forms.fields.instrumentDetails.edit.sfdr`)}
                      </Label>
                      <input
                        type="number"
                        id="sfdr"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t(`forms.fields.actions.back`)}
              </button>
              <button
                type="submit"
                className="inline-block w-fit cursor-pointer rounded-[10px]  text-base px-4 py-2 border-0 bg-blue-800 text-white hover:!bg-blue-900" //px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {t(`forms.fields.tables.edit`)}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
