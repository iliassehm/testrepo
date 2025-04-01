import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import { Button } from "../../../../../../components";
import { getFormErrorMessage } from "../../../../../../constants";
import { gql } from "../../../../../../service/client";
import { AssetGroup, Scpi } from "../../../../../../types";
import { AssetCreationLogic } from "./AssetCreation.logic";

interface SCPIFormData {
  name: string;
  ownership: string;
  quantity: number | null;
  partValue: number | null;
  currency: "EUR";
  date: Date;
}

export const SCPIForm = ({
  onSubmit,
  referenceInstrument,
}: {
  onSubmit: (data: SCPIFormData) => void;
  type: AssetGroup;
  referenceInstrument: string;
}) => {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<
    Pick<Scpi, "name" | "subscription_price">[]
  >([]);

  const ownershipOptions = [
    {
      name: t(`scenes.wealth.scpi.ownership.fullProperty`),
      value: "fullProperty",
    },
    { name: t(`scenes.wealth.scpi.ownership.property`), value: "property" },
  ];

  const defaultValues: SCPIFormData = {
    name: "",
    ownership: "fullProperty",
    quantity: null,
    partValue: null,
    currency: "EUR",
    date: new Date(),
  };

  const creationForm = useForm({ defaultValues });

  const currencyOptions = [
    { name: "Euro", value: "EUR" },
    { name: "Dollar", value: "USD" },
  ];

  const name = creationForm.getValues("name");
  const namesQuery = useQuery(
    ["scpi_name_completions", name],
    () =>
      gql.client.request(AssetCreationLogic.SCPIList(), {
        name,
      }),
    {
      onSuccess: async (data) => setSuggestions(data.SCPIList),
      enabled: !!name.length,
    }
  );

  return (
    <form
      className="flex flex-col items-center"
      onSubmit={creationForm.handleSubmit(onSubmit)}
    >
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="rounded-xl bg-white">
          <Controller
            name="name"
            control={creationForm.control}
            rules={{ required: t(`scenes.wealth.scpi.name.error`) as string }}
            render={({ field }) => (
              <div className="flex flex-col pt-2">
                <label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`scenes.wealth.scpi.name.label`)}
                </label>
                <AutoComplete
                  field="name"
                  placeholder={
                    t(`scenes.wealth.scpi.name.placeholder`) as string
                  }
                  inputId={field.name}
                  value={field.value}
                  onChange={(e) => {
                    creationForm.setValue(
                      "partValue",
                      Number(e.value.subscription_price)
                    );
                    if (e.value.name) {
                      field.onChange(e.value.name);
                    } else {
                      field.onChange(e);
                    }
                  }}
                  inputRef={field.ref}
                  suggestions={suggestions}
                  completeMethod={() => {
                    namesQuery.refetch();
                  }}
                  inputStyle={{
                    height: 50,
                    width: "100%",
                    border: "none",
                    borderRadius: 12,
                  }}
                />
                {getFormErrorMessage(field.name, creationForm.formState.errors)}
              </div>
            )}
          />
        </div>
        <div className="rounded-xl bg-white">
          <Controller
            name="ownership"
            control={creationForm.control}
            rules={{
              required: t(`scenes.wealth.scpi.ownership.error`) as string,
            }}
            render={({ field }) => (
              <>
                <label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`scenes.wealth.scpi.ownership.label`)}
                </label>
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="name"
                  placeholder={
                    t(`scenes.wealth.scpi.ownership.placeholder`) || ""
                  }
                  options={ownershipOptions}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  className="w-full rounded-xl border-none"
                  style={{ height: 50 }}
                  panelStyle={{ marginTop: 16 }}
                />
                {getFormErrorMessage(field.name, creationForm.formState.errors)}
              </>
            )}
          />
        </div>
        <div className="rounded-xl bg-white">
          <Controller
            name="quantity"
            control={creationForm.control}
            rules={{
              required: t(`scenes.wealth.scpi.quantity.error`) as string,
              validate: (value) =>
                value !== null ||
                (t(`scenes.wealth.scpi.quantity.label`) as string),
            }}
            render={({ field }) => (
              <>
                <label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`scenes.wealth.scpi.quantity.label`)}
                </label>
                <InputNumber
                  id={field.name}
                  inputRef={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onValueChange={(e) => field.onChange(e.target.value)}
                  useGrouping={false}
                  className="w-full rounded-xl border-none"
                  inputStyle={{ height: 50, border: "none", borderRadius: 12 }}
                  placeholder={
                    t(`scenes.wealth.scpi.quantity.placeholder`) || ""
                  }
                />
                {getFormErrorMessage(field.name, creationForm.formState.errors)}
              </>
            )}
          />
        </div>
        <div className="rounded-xl bg-white">
          <Controller
            name="partValue"
            control={creationForm.control}
            rules={{
              required: t(`scenes.wealth.scpi.partValue.error`) as string,
              validate: (value) =>
                value !== null ||
                (t(`scenes.wealth.scpi.partValue.label`) as string),
            }}
            render={({ field }) => (
              <>
                <label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`scenes.wealth.scpi.partValue.label`)}
                </label>
                <InputNumber
                  id={field.name}
                  inputRef={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onValueChange={(e) => field.onChange(e.target.value)}
                  useGrouping={false}
                  className="w-full rounded-xl border-none"
                  inputStyle={{ height: 50, border: "none", borderRadius: 12 }}
                  placeholder={
                    t(`scenes.wealth.scpi.partValue.placeholder`) || ""
                  }
                  mode="currency"
                  currency={referenceInstrument}
                />
                {getFormErrorMessage(field.name, creationForm.formState.errors)}
              </>
            )}
          />
        </div>
        <div className="rounded-xl bg-white">
          <Controller
            name="currency"
            control={creationForm.control}
            rules={{
              required: t(`scenes.wealth.scpi.currency.error`) as string,
            }}
            render={({ field }) => (
              <>
                <label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`scenes.wealth.scpi.currency.label`)}
                </label>
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="name"
                  placeholder={
                    t(`scenes.wealth.scpi.currency.placeholder`) || ""
                  }
                  options={currencyOptions}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  className="w-full rounded-xl border-none"
                  style={{ height: 50 }}
                  panelStyle={{ marginTop: 16 }}
                />
                {getFormErrorMessage(field.name, creationForm.formState.errors)}
              </>
            )}
          />
        </div>
        <div className="rounded-xl bg-white">
          <Controller
            name="date"
            control={creationForm.control}
            rules={{ required: t(`scenes.wealth.scpi.date.error`) as string }}
            render={({ field }) => (
              <>
                <label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`scenes.wealth.scpi.date.label`)}
                </label>
                <Calendar
                  inputId={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  dateFormat="dd/mm/yy"
                  className="w-full rounded-xl border-none"
                  inputStyle={{ height: 50, border: "none", borderRadius: 12 }}
                  placeholder={t(`scenes.wealth.scpi.date.placeholder`) || ""}
                />
                {getFormErrorMessage(field.name, creationForm.formState.errors)}
              </>
            )}
          />
        </div>
      </div>
      <Button
        label={t(`scenes.wealth.add`)}
        type="submit"
        icon="pi pi-plus"
        className="mx-auto mt-5"
      />
    </form>
  );
};
