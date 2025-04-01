import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Panel, PanelProps } from "primereact/panel";
import { type FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button, Text } from "../../../../../../components";
import { OptionSelect } from "../../../../../../components/OptionSelect";
import { complianceCategoryName } from "../../../../../../constants";
import { formatDate } from "../../../../../../helpers";
import { NotificationTransport } from "../../../../../../types";
import { FieldNumber } from "../../../../../../UIComponents/FieldNumber/FieldNumber";
import { Label } from "../../../../../../UIComponents/Label/Label";
import { ConformityForm, ConformityStepper } from "./confirmityCreationV2";

export enum FrequencyPeriod {
  thirty = 30,
  ninety = 90,
  sixMonths = 180,
  yearly = 365,
}
type ConformityCreationRecapProps = {
  goBack: () => void;
  form: UseFormReturn<ConformityForm>;
  isLoading?: boolean;
  onSubmit: (data: ConformityForm) => void;
};

export const ConformityCreationRecap: FC<ConformityCreationRecapProps> = ({
  form,
  goBack,
  isLoading,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const remdinerPeriodicityOptions = [
    {
      label: t(
        "scenes.customers.conformity.conformity.reminder.periodicity.days"
      ),
      value: 1,
    },
    {
      label: t(
        "scenes.customers.conformity.conformity.reminder.periodicity.weeks"
      ),
      value: 7,
    },
    {
      label: t(
        "scenes.customers.conformity.conformity.reminder.periodicity.months"
      ),
      value: 30,
    },
    {
      label: t(
        "scenes.customers.conformity.conformity.reminder.periodicity.years"
      ),
      value: 365,
    },
  ];

  const values = form.watch();

  // Template
  const signatureTemplate = ({
    signers,
  }: ConformityStepper["step4"]["outputFiles"][0]) => {
    const dataList = signers || [];

    return (
      <div className="flex flex-wrap gap-2">
        {dataList.map((data, index) => (
          <Chip key={`${data.name}-${index}`} label={data.name} />
        ))}
      </div>
    );
  };

  const panelTemplate: PanelProps["headerTemplate"] = (options) => {
    const className = `${options.className} justify-content-start bg-white`;
    const titleClassName = `ml-2 text-[#4761C8] flex justify-center items-center gap-1`;

    return (
      <div className={className}>
        <div className={titleClassName}>
          <Text label={t("forms.fields.steps.envelop")} className="font-bold" />
          {" : "}
          <div className="capitalize text-black">{values.envelope.name}</div>
        </div>
        <div className={titleClassName}>
          <Text
            label={t("forms.fields.tables.validityDate")}
            className="font-bold "
          />
          {" : "}
          <span className="text-black">
            {values.envelope.expiration &&
              formatDate(values.envelope.expiration)}
          </span>
        </div>
      </div>
    );
  };

  const hasSignators =
    values.files.find((file) => (file.signers?.length ?? 0) > 0) != undefined;

  let reminderSection: JSX.Element | null = null;
  if (values.reminder != undefined && hasSignators)
    reminderSection = (
      <div className="flex flex-col items-center gap-4">
        <div className="w-full justify-between flex flex-row items-center">
          <Label htmlFor="reminder.times" className="font-medium mr-2">
            {t("scenes.customers.conformity.conformity.reminder.times")}
          </Label>
          <FieldNumber
            id="reminder.times"
            value={values.reminder?.times ?? 1}
            className="w-1/2"
            min={1}
            onChange={(value) => form.setValue("reminder.times", value)}
          />
        </div>
        <div className="w-full justify-between flex flex-row items-center">
          <Label htmlFor="reminder.interval" className="mr-2">
            {t("scenes.customers.conformity.conformity.reminder.interval")}
          </Label>
          <FieldNumber
            id="reminder.interval"
            value={values.reminder?.interval ?? 1}
            className="w-1/2"
            min={1}
            onChange={(value) => form.setValue("reminder.interval", value)}
          />
          <Dropdown
            id={"periodicity"}
            value={values.reminder.periodicity}
            onChange={(option) =>
              form.setValue("reminder.periodicity", option.value)
            }
            options={remdinerPeriodicityOptions}
            optionLabel="label"
            className="ml-4 h-10 bg-slate-50"
          />
        </div>
      </div>
    );
  let signatorySection: JSX.Element | null = null;
  if (hasSignators)
    signatorySection = (
      <>
        <div
          className="w-full flex flex-row items-center justify-between"
          hidden={true}
        >
          <Label htmlFor="reminder.label" className="font-medium mr-2">
            {t("scenes.customers.conformity.conformity.reminder.label")}
          </Label>
          <Checkbox
            inputId="reminder.label"
            checked={values.reminder != undefined}
            onChange={(event) =>
              form.setValue(
                "reminder",
                event?.checked
                  ? { times: 1, interval: 1, periodicity: 1 }
                  : undefined
              )
            }
          />
        </div>
        {reminderSection}
      </>
    );
  let repeatEverySection: JSX.Element | null = null;
  if (values.showRepeatEvery) {
    repeatEverySection = (
      <div className="w-full flex flex-col items-center px-10 gap-4 max-w-6xl">
        <OptionSelect
          options={[
            {
              label: "reporting.repeatEveryOptions.thirty",
              value: FrequencyPeriod.thirty,
            },
            {
              label: "reporting.repeatEveryOptions.ninety",
              value: FrequencyPeriod.ninety,
            },
            {
              label: "reporting.repeatEveryOptions.sixMonths",
              value: FrequencyPeriod.sixMonths,
            },
            {
              label: "reporting.repeatEveryOptions.yearly",
              value: FrequencyPeriod.yearly,
            },
          ]}
          onChange={(value) => form.setValue("repeatEvery", value)}
          value={values.repeatEvery}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 justify-center w-full h-full">
      <Panel headerTemplate={panelTemplate}>
        <DataTable
          value={values.files}
          tableStyle={{ minWidth: "50rem" }}
          emptyMessage={t(`emptyMessage.noDocument`)}
        >
          <Column
            key={"name"}
            field="name"
            header={t("forms.fields.file") as string}
          />
          <Column
            key={"category"}
            field="category"
            header={t("forms.fields.category") as string}
            body={(data) => (
              <span>{complianceCategoryName(data.category)}</span>
            )}
          />
          <Column
            key={"signators"}
            header={t("forms.fields.signators")}
            body={signatureTemplate}
          />
        </DataTable>
      </Panel>
      <form className="mt-4 flex flex-row gap-4 justify-between items-start">
        <div>
          <Text
            label="scenes.customers.conformity.conformity.optionnalSending"
            as="p"
            className="font-medium text-lg mb-4 text-[#4761C8]"
          />
          <div className="mt-2 flex flex-col gap-y-3">
            <div className="flex gap-x-4">
              <div className="w-48">
                <Label htmlFor="pushNotification" className="font-medium">
                  {t("scenes.customers.conformity.conformity.pushNotification")}
                </Label>
              </div>
              <Checkbox
                inputId="pushNotification"
                name={NotificationTransport.Push}
                checked={values.transports.has(NotificationTransport.Push)}
                onChange={(event) => {
                  const updated = new Set(values.transports);
                  if (event.checked) updated.add(NotificationTransport.Push);
                  else updated.delete(NotificationTransport.Push);
                  form.setValue("transports", updated);
                }}
              />
            </div>
            <div className="flex gap-x-4">
              <div className="w-48">
                <Label htmlFor="mailNotification" className="font-medium">
                  {t("scenes.customers.conformity.conformity.mailNotification")}
                </Label>
              </div>
              <Checkbox
                inputId="mailNotification"
                name={NotificationTransport.Mail}
                checked={values.transports.has(NotificationTransport.Mail)}
                onChange={(event) => {
                  const updated = new Set(values.transports);
                  if (event.checked) updated.add(NotificationTransport.Mail);
                  else updated.delete(NotificationTransport.Mail);
                  form.setValue("transports", updated);
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-row items-center gap-4">
            <Label htmlFor="delayUntil" className="font-medium mr-2">
              {t("scenes.customers.conformity.conformity.delayedSending")}
            </Label>
            <Calendar
              id="delayUntil"
              name="delayUntil"
              value={values.envelope.delayUntil}
              onChange={(event) =>
                form.setValue("envelope.delayUntil", event.value as Date)
              }
              inputClassName="bg-[#F8F9FB] rounded-xl"
              dateFormat="dd/mm/yy"
              placeholder="jj/mm/aaaa hh:mm"
              showTime
              hourFormat="24"
            />
          </div>
          {signatorySection}
          <div>
            <div
              className="w-full flex flex-row items-center justify-between"
              hidden={true}
            >
              <Label htmlFor="repeatEvery" className="font-medium mr-2">
                {t("scenes.customers.conformity.conformity.repeatEvery")}
              </Label>
              <Checkbox
                inputId="repeatEvery"
                checked={!!values.showRepeatEvery}
                onChange={(event) =>
                  form.setValue("showRepeatEvery", !!event?.checked)
                }
              />
            </div>
            {repeatEverySection}
          </div>
        </div>
      </form>

      <div className="flex flex-row justify-center">
        <Button
          label="forms.fields.actions.previous"
          type="button"
          className="mr-4"
          onClick={goBack}
        />
        <Button
          label="forms.fields.actions.next"
          type="submit"
          className="mr-4"
          isLoading={isLoading}
          onClick={form.handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};
