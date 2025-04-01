import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import { Button } from "../../../../../../../components";
import { getFormErrorMessage } from "../../../../../../../constants";
import { defaultNS } from "../../../../../../../constants/i18n";
import { useToast } from "../../../../../../../hooks/useToast";
import { gql } from "../../../../../../../service/client";
import {
  AssetGroup,
  Company,
  Customer,
  CustomerAsset,
  CustomerInvestmentCreation,
  Instrument,
} from "../../../../../../../types";
import { InvestmentOverlayLogic } from "./InvestmentOverlay.logic";

export interface InvestmentOverlayProps {
  type: AssetGroup;
  companyID: Company["id"];
  customerID: Customer["id"];
  assetID: CustomerAsset["id"];
  hide: () => void;
}

const defaults: CustomerInvestmentCreation = {
  code: "",
  quantity: 1,
  instrument: "EUR",
  unitPrice: null,
  buyingDate: null,
  unitValue: 0,
};

export function InvestmentOverlay({
  type,
  assetID,
  companyID,
  customerID,
}: InvestmentOverlayProps) {
  // Hooks
  const { t } = useTranslation(defaultNS, {
    keyPrefix: "scenes.customers.details.investment_creation",
  });

  const toast = useToast();
  const queryClient = useQueryClient();
  const creationForm = useForm<CustomerInvestmentCreation>({
    defaultValues: defaults,
  });

  const [nameSearchInput, setNameSearchInput] = useState("");
  const [codeSearchInput, setCodeSearchInput] = useState("");

  // Queries
  const namesQuery = useMutation((query: string) =>
    gql.client.request(InvestmentOverlayLogic.searchInstrument(), {
      name: query,
      group: type,
    })
  );

  const codeQuery = useMutation((query: string) =>
    gql.client.request(InvestmentOverlayLogic.searchInstrument(), {
      name: query,
      group: type,
    })
  );

  // Mutations
  const creationMutation = useMutation(
    "investment_creation",
    (input: CustomerInvestmentCreation) =>
      gql.client.request(InvestmentOverlayLogic.investmentCreation(), {
        assetID,
        companyID,
        customerID,
        input: { ...input, unitValue: input.unitValue ?? input.unitPrice },
      }),
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(["asset_detail", assetID]);
        await queryClient.invalidateQueries([
          "customer_wealth",
          customerID,
          companyID,
        ]);
        await queryClient.invalidateQueries([
          "layout_customer",
          companyID,
          customerID,
        ]);
        creationForm.reset();
        toast?.current?.show({
          severity: "success",
          summary: t("success.summary") as string,
          detail: t("success.detail", {
            name: data?.customerInvestmentCreation?.name,
          }),
        });
      },
      onError: (error, variables) => {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t("failure.summary") as string,
          detail: t("failure.detail", {
            name: variables.name,
          }),
        });
      },
    }
  );

  const onInstrumentSelection = (instrument: Instrument) => {
    creationForm.setValue("name", instrument.name);
    creationForm.setValue("code", instrument.code);
    setCodeSearchInput(instrument.code);
    setNameSearchInput(instrument.name);
    creationForm.setValue("unitValue", instrument.price.value);
    creationForm.setValue("instrument", instrument.price.instrument);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={creationForm.handleSubmit((data) =>
          creationMutation.mutate(data)
        )}
        className="flex flex-col items-center"
      >
        <Controller
          name="code"
          control={creationForm.control}
          rules={{ required: t("stocks.code.required") as string }}
          render={({ field, fieldState }) => (
            <>
              <label
                htmlFor={field.name}
                className={classNames({
                  "p-error": creationForm.formState.errors.name,
                })}
              ></label>
              <span className="p-float-label">
                <AutoComplete
                  placeholder={
                    t(
                      type === AssetGroup.Crypto
                        ? "crypto.code.placeholder"
                        : "stocks.code.placeholder"
                    ) as string
                  }
                  field="code"
                  inputId={field.name}
                  value={codeSearchInput}
                  onChange={(e) => setCodeSearchInput(e.value)}
                  itemTemplate={(item) => (
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <p className="text-sm"> {item.name}</p>
                        <p className="text-xs font-light text-gray-500">
                          {item.code}
                        </p>
                      </div>
                    </div>
                  )}
                  onSelect={(event) => {
                    const value = event.value as Instrument;

                    field.onChange(value.code);
                    onInstrumentSelection(value);
                  }}
                  inputRef={field.ref}
                  suggestions={codeQuery.data?.searchInstrument || []}
                  completeMethod={(e) => {
                    codeQuery.mutate(e.query);
                  }}
                  showEmptyMessage
                  forceSelection
                  className={classNames({ "p-invalid": fieldState.error })}
                />
                <label htmlFor={field.name}>
                  {t(
                    type === AssetGroup.Crypto
                      ? "crypto.code.label"
                      : "stocks.code.label"
                  )}
                </label>
              </span>
              {getFormErrorMessage(field.name, creationForm.formState.errors)}
            </>
          )}
        />

        <Controller
          name="name"
          control={creationForm.control}
          rules={{ required: t("stocks.name.required") as string }}
          render={({ field, fieldState }) => (
            <>
              <label
                htmlFor={field.name}
                className={classNames({
                  "p-error": creationForm.formState.errors.name,
                })}
              ></label>
              <span className="p-float-label">
                <AutoComplete
                  field="name"
                  placeholder={
                    t(
                      type === AssetGroup.Crypto
                        ? "crypto.name.placeholder"
                        : "stocks.name.placeholder"
                    ) as string
                  }
                  inputId={field.name}
                  value={nameSearchInput}
                  onSelect={(event) => {
                    const value = event.value as Instrument;

                    field.onChange(value.name);

                    onInstrumentSelection(value);
                  }}
                  onChange={(e) => setNameSearchInput(e.value)}
                  itemTemplate={(item) => (
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <p className="text-sm"> {item.name}</p>
                        <p className="text-xs font-light text-gray-500">
                          {item.code}
                        </p>
                      </div>
                    </div>
                  )}
                  inputRef={field.ref}
                  suggestions={namesQuery.data?.searchInstrument || []}
                  completeMethod={(e) => {
                    namesQuery.mutate(e.query);
                  }}
                  showEmptyMessage
                  forceSelection
                  className={classNames({ "p-invalid": fieldState.error })}
                />
                <label htmlFor={field.name}>
                  {t(
                    type === AssetGroup.Crypto
                      ? "crypto.name.label"
                      : "stocks.name.label"
                  )}
                </label>
              </span>
              {getFormErrorMessage(field.name, creationForm.formState.errors)}
            </>
          )}
        />

        <Controller
          name="quantity"
          control={creationForm.control}
          rules={{ required: t("quantity.required") as string }}
          render={({ field, fieldState }) => (
            <>
              <label
                htmlFor={field.name}
                className={classNames({
                  "p-error": creationForm.formState.errors.name,
                })}
              ></label>
              <span className="p-float-label">
                <InputNumber
                  placeholder={t("quantity.placeholder") as string}
                  id={field.name}
                  inputRef={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onValueChange={(e) => field.onChange(e)}
                  useGrouping={true}
                  minFractionDigits={0}
                  maxFractionDigits={2}
                  inputClassName={classNames({ "p-invalid": fieldState.error })}
                />

                <label htmlFor={field.name}>{t("quantity.label")}</label>
              </span>
              {getFormErrorMessage(field.name, creationForm.formState.errors)}
            </>
          )}
        />

        <Controller
          name="unitPrice"
          control={creationForm.control}
          rules={{ required: t("unitPrice.required") as string }}
          render={({ field, fieldState }) => (
            <>
              <label
                htmlFor={field.name}
                className={classNames({
                  "p-error": creationForm.formState.errors.name,
                })}
              ></label>
              <span className="p-float-label">
                <InputNumber
                  placeholder={t("unitPrice.placeholder") as string}
                  id={field.name}
                  inputRef={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onValueChange={(e) => field.onChange(e.value)}
                  useGrouping={true}
                  minFractionDigits={0}
                  maxFractionDigits={2}
                  inputClassName={classNames({ "p-invalid": fieldState.error })}
                />
                <label htmlFor={field.name}>{t("unitPrice.label")}</label>
              </span>
              {getFormErrorMessage(field.name, creationForm.formState.errors)}
            </>
          )}
        />
        <Controller
          name="instrument"
          control={creationForm.control}
          rules={{ required: t("instrument.required") as string }}
          render={({ field, fieldState }) => (
            <>
              <label
                htmlFor={field.name}
                className={classNames({
                  "p-error": creationForm.formState.errors.name,
                })}
              ></label>
              <span className="p-float-label">
                <AutoComplete
                  placeholder={t("instrument.placeholder") as string}
                  inputId={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  inputRef={field.ref}
                  suggestions={["EUR", "USD", "JPY", "AUD"]}
                  className={classNames({ "p-invalid": fieldState.error })}
                />
                <label htmlFor={field.name}>{t("instrument.label")}</label>
              </span>
              {getFormErrorMessage(field.name, creationForm.formState.errors)}
            </>
          )}
        />
        <Controller
          name="buyingDate"
          control={creationForm.control}
          rules={{ required: t("buyingDate.required") as string }}
          render={({ field, fieldState }) => (
            <>
              <label
                htmlFor={field.name}
                className={classNames({
                  "p-error": creationForm.formState.errors.name,
                })}
              ></label>
              <span className="p-float-label">
                <Calendar
                  inputId={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("buyingDate.placeholder") as string}
                  className={classNames({ "p-invalid": fieldState.error })}
                />

                <label htmlFor={field.name}>{t("buyingDate.label")}</label>
              </span>
              {getFormErrorMessage(field.name, creationForm.formState.errors)}
            </>
          )}
        />
        <Button
          label={t("action_create") as string}
          size="small"
          loading={creationMutation.isLoading}
          type="submit"
          className="px-4"
        />
      </form>
    </div>
  );
}
