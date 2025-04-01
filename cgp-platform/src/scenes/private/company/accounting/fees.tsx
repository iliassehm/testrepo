import { zodResolver } from "@hookform/resolvers/zod";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button, Select } from "../../../../components";
import Table from "../../../../components/Table";
import { DataType } from "../../../../components/Table/tableTypes";
import { numberFormat, percentFormatter } from "../../../../helpers";

const feesDataTypes: Record<string, DataType> = {
  feesType: { type: "string", sortable: true, field: "feesType" },
  client: { type: "string", sortable: true, field: "client" },
  recurrence: { type: "string", sortable: true, field: "recurrence" },
  amount: { type: "amount", sortable: true, field: "amount" },
  percent: { type: "percent", sortable: true, field: "percent" },
};

const validationSchema = z.object({
  feesType: z
    .string({ required_error: "Champ requis. Type d'honoraire invalide." })
    .nonempty("Champ requis. Sélectionnez un type d'honoraire."),
  client: z
    .string({ required_error: "Champ requis. Client invalide." })
    .nonempty("Champ requis. Sélectionnez un client."),
  recurrence: z
    .string({ required_error: "Champ requis. Récurrence invalide." })
    .nonempty("Champ requis. Sélectionnez une récurrence."),
  amount: z
    .number({ required_error: "Champ requis. Montant invalide." })
    .min(0.01, "Champ requis. Montant supérieur à 0."),
  percent: z
    .number({ required_error: "Champ requis. Pourcentage invalide." })
    .min(0.01, "Champ requis. Pourcentage supérieur à 0."),
});

type FeesFormValues = z.infer<typeof validationSchema>;

export const FeesSection = () => {
  const { t } = useTranslation();
  const fakeData:
    | {
        feesType: string;
        amount: number;
        percent: number;
        client: string;
        recurrence: string;
      }[]
    | (() => {
        feesType: string;
        amount: number;
        percent: number;
        client: string;
        recurrence: string;
      }[]) = [];

  const [feesData, setFeesData] = useState<FeesFormValues[]>(fakeData);
  const { handleSubmit, control, reset, formState } = useForm<FeesFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      feesType: "",
      client: "",
      recurrence: "",
      amount: 0,
      percent: 0,
    },
  });

  const onSubmit = (data: FeesFormValues) => {
    setFeesData((prevData) => [...prevData, data]);
    reset();
  };

  interface ClientOption {
    label: string;
    value: string;
  }

  const clients: ClientOption[] = [];

  const recurrenceOptions = [
    {
      label: t("scenes.customers.accounting.recurrence.monthly"),
      value: "monthly",
    },
    {
      label: t("scenes.customers.accounting.recurrence.yearly"),
      value: "yearly",
    },
    {
      label: t("scenes.customers.accounting.recurrence.oneShot"),
      value: "once",
    },
  ];

  const feesTypeOptions = [
    {
      label: t("scenes.customers.accounting.fees.percentageManagement"),
      value: "percentageManagement",
    },
    { label: t("scenes.customers.accounting.fees.hourly"), value: "hourly" },
    { label: t("scenes.customers.accounting.fees.success"), value: "success" },
    {
      label: t("scenes.customers.accounting.fees.byMission"),
      value: "byMission",
    },
    {
      label: t("scenes.customers.accounting.fees.subscription"),
      value: "subscription",
    },
    { label: t("scenes.customers.accounting.fees.flatFee"), value: "flatFee" },
    {
      label: t("scenes.customers.accounting.fees.consultation"),
      value: "consultation",
    },
    {
      label: t("scenes.customers.accounting.fees.brokerage"),
      value: "brokerage",
    },
  ];

  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-investorProfileForm-curve6">
      <h2 className="text-sm font-semibold p-2 w-full bg-investorProfileForm-curve6 text-white">
        {t("scenes.customers.accounting.fees.title")}
      </h2>
      <div className="flex gap-4 bg-gray-100">
        {/* Fees Form */}
        <div className="w-1/4 space-y-4 bg-white p-4 rounded shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="feesType"
              control={control}
              render={({ field }) => (
                <>
                  <Dropdown
                    {...field}
                    options={feesTypeOptions}
                    placeholder={t("scenes.customers.accounting.form.feesType")}
                    className="w-full h-9 items-center"
                  />
                  {formState.errors.feesType && (
                    <p className="text-red-500 text-xs -mt-2">
                      {formState.errors.feesType.message}
                    </p>
                  )}
                </>
              )}
            />
            <Controller
              name="client"
              control={control}
              render={({ field }) => (
                <>
                  <Dropdown
                    {...field}
                    value={field.value}
                    options={clients}
                    placeholder={t("scenes.customers.accounting.form.client")}
                    filter
                    className="w-full h-9 items-center"
                  />
                  {formState.errors.client && (
                    <p className="text-red-500 text-xs -mt-2!important">
                      {formState.errors.client.message}
                    </p>
                  )}
                </>
              )}
            />
            <Controller
              name="recurrence"
              control={control}
              render={({ field }) => (
                <>
                  <Dropdown
                    {...field}
                    options={recurrenceOptions}
                    placeholder={t(
                      "scenes.customers.accounting.form.recurrence"
                    )}
                    className="w-full h-9 items-center"
                  />
                  {formState.errors.recurrence && (
                    <p className="text-red-500 text-xs">
                      {formState.errors.recurrence.message}
                    </p>
                  )}
                </>
              )}
            />
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <>
                  <InputNumber
                    {...field}
                    placeholder={t("scenes.customers.accounting.form.amount")}
                    className="w-full h-9"
                    value={field.value || 0}
                    onChange={(e) => field.onChange(e.value)}
                  />
                  {formState.errors.amount && (
                    <p className="text-red-500 text-xs -mt-2">
                      {formState.errors.amount.message}
                    </p>
                  )}
                </>
              )}
            />
            <Controller
              name="percent"
              control={control}
              render={({ field }) => (
                <>
                  <InputNumber
                    {...field}
                    placeholder={t(
                      "scenes.customers.accounting.form.percentPrefix"
                    )}
                    suffix="%"
                    className="w-full h-9"
                    value={field.value || 0}
                    onChange={(e) => field.onChange(e.value)}
                  />
                  {formState.errors.percent && (
                    <p className="text-red-500 text-xs -mt-2">
                      {formState.errors.percent.message}
                    </p>
                  )}
                </>
              )}
            />
            <Button
              type="submit"
              label={t("forms.fields.actions.add")}
              className="w-full"
            />
          </form>
        </div>

        {/* Fees Table */}
        <div className="w-3/4 overflow-y-auto">
          <Table data={feesData} dataType={feesDataTypes} className="bg-white">
            <Table.Head translationPrefix="forms.fields.tables" />
            <Table.Body>
              {({ data }: { data: FeesFormValues[] }) => (
                <>
                  {data.map((item, index) => (
                    <Table.Row key={index}>
                      <Table.Cell value={t(`${item.feesType}`)} />
                      <Table.Cell value={item.client} />
                      <Table.Cell value={t(`${item.recurrence}`)} />
                      <Table.Cell
                        value={numberFormat(item.amount)}
                        type="amount"
                      />
                      <Table.Cell
                        value={percentFormatter.format(item.percent)}
                        type="percent"
                      />
                    </Table.Row>
                  ))}
                </>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};
