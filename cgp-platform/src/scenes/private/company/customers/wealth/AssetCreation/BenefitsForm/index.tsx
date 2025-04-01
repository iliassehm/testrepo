import { t } from "i18next";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "../../../../../../../components";
import { Widget } from "../../../../../../../components/Widget";
import { getFormErrorMessage } from "../../../../../../../constants";
import {
  Customer,
  CustomerAsset,
  InvestmentValues,
} from "../../../../../../../types";
import FieldAmount from "../../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import FieldPercentage from "../../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { FieldTextarea } from "../../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import Select from "../../../../../../../UIComponents/Select/Select";
import { RealEstateFormType } from "../RealEstateForm";

export interface BenefitsFormData {
  categoryName: string;
  name: string;
  date: Date;
  accountNumber: string;

  metadata: {
    insuranceCompany: string;
    scheduledPaymentList: string;
    scheduledPayment: number;
    ownership: number;
    accountType: string;
    otherOwners: string;
    comment: string;
    guarantees: {
      maintenance_salary?: {
        isChecked?: boolean;
        label?: string;
      };
      maintenance_disability?: {
        isChecked?: boolean;
        label?: string;
      };
      maintenance_death?: {
        isChecked?: boolean;
        label?: string;
      };
    };
  };
  activity: {
    value: number;
    instrument: string;
  };
}

export const categoryNames = [
  {
    label: t("asset_categories.loan_insurance"),
    value: "loan_insurance",
  },
  {
    label: t("asset_categories.benefits"),
    value: "benefits",
  },
  {
    label: t("asset_categories.death_benefits"),
    value: "death_benefits",
  },
  {
    label: t("asset_categories.individual_complementary_health"),
    value: "individual_complementary_health",
  },
  {
    label: t("asset_categories.health"),
    value: "health",
  },
];

export const accountType = [
  {
    label: t("forms.fields.wealth.scpi.accountType.fullProperty"),
    value: "fullProperty",
  },
  {
    label: t("forms.fields.wealth.scpi.accountType.property"),
    value: "property",
  },
  {
    label: t("forms.fields.wealth.scpi.accountType.usufruct"),
    value: "usufruct",
  },
];

export const scheduledPaymentList = [
  { label: t("forms.fields.cycles.yearly"), value: "yearly" },
  { label: t("forms.fields.cycles.monthly"), value: "monthly" },
  { label: t("forms.fields.cycles.quarterly"), value: "quarterly" },
  { label: t("forms.fields.cycles.biannual"), value: "biannual" },
  { label: t("forms.fields.cycles.weekly"), value: "weekly" },
];

export const BenefitsForm = ({
  asset,
  onSubmit,
  isLoading,
  otherOwners,
  otherOwner,
  customerId,
}: {
  asset?: CustomerAsset;
  onSubmit: (data: BenefitsFormData, investments?: InvestmentValues[]) => void;
  isLoading?: boolean;
  formType?: RealEstateFormType;
  otherOwners: { value: string; label: string }[];
  otherOwner?: Customer;
  customerId: string;
}) => {
  const defaultValues: BenefitsFormData = {
    categoryName: asset?.categoryName ?? categoryNames[0].value,
    name: asset?.name ?? "",
    date: new Date(asset?.openDate) ?? new Date(),
    accountNumber: asset?.accountNumber ?? "",
    metadata: {
      insuranceCompany: asset?.metadata?.bank ?? "",
      scheduledPaymentList:
        asset?.metadata?.scheduledPaymentList ?? scheduledPaymentList[0].value,
      scheduledPayment: asset?.metadata?.scheduledPayment ?? 0,
      ownership: asset?.owners?.find((owner) => owner.entity?.id === customerId)
        ?.ownership
        ? (asset.owners.find((owner) => owner.entity?.id === customerId)
            ?.ownership ?? 0) * 100
        : 100,
      accountType: asset?.metadata?.accountType ?? accountType[0].value,
      otherOwners: otherOwner?.id ?? "",
      comment: asset?.metadata?.comment ?? "",
      guarantees: {
        maintenance_salary: {
          isChecked:
            asset?.metadata?.guarantees?.maintenance_salary?.isChecked ?? false,
          label: asset?.metadata?.guarantees?.maintenance_salary?.label ?? "",
        },
        maintenance_disability: {
          isChecked:
            asset?.metadata?.guarantees?.maintenance_disability?.isChecked ??
            false,
          label:
            asset?.metadata?.guarantees?.maintenance_disability?.label ?? "",
        },
        maintenance_death: {
          isChecked:
            asset?.metadata?.guarantees?.maintenance_death?.isChecked ?? false,
          label: asset?.metadata?.guarantees?.maintenance_death?.label ?? "",
        },
      },
    },
    activity: {
      value: asset?.activity?.value ?? null,
      instrument: asset?.activity?.instrument ?? "EUR",
    },
  };

  const form = useForm({
    defaultValues,
  });
  const { control, formState, handleSubmit, watch } = form;
  const { errors } = formState;

  const maintenanceSalaryChecked = useWatch({
    control,
    name: "metadata.guarantees.maintenance_salary.isChecked",
  });
  const maintenanceDisabilityChecked = useWatch({
    control,
    name: "metadata.guarantees.maintenance_disability.isChecked",
  });
  const maintenanceDeathChecked = useWatch({
    control,
    name: "metadata.guarantees.maintenance_death.isChecked",
  });
  return (
    <form
      className="flex flex-col items-center"
      onSubmit={handleSubmit((information) => {
        onSubmit({
          ...information,
          metadata: {
            ...information.metadata,
            ownership: information.metadata.ownership / 100,
          },
          activity: {
            ...information.activity,
            value: 0,
          },
        });
      })}
    >
      <Widget className="pt-4">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5 mb-6">
          <div>
            <Controller
              name="categoryName"
              control={control}
              rules={{
                required: t(`forms.fields.wealth.currency.error`) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.category`)}
                  </Label>
                  <Select
                    id={field.name}
                    value={{
                      value: field.value,
                      label: t("asset_categories." + field.value) as string,
                    }}
                    onChange={(option) => field.onChange(option?.value)}
                    options={categoryNames}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "var(--bg-slate-50)",
                        borderColor: "var(--input-border-color)",
                        zIndex: 9999,
                      }),
                    }}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div>
            <Controller
              name="accountNumber"
              control={control}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.benefits.accountNumber`)}
                  </Label>
                  <FieldText
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    //   onChange={(e) => setName(e.target.value)}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.benefits.accountNumber`) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div>
            <Controller
              name="metadata.insuranceCompany"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.benefits.insuranceCompany.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.benefits.insuranceCompany.label`)}
                  </Label>
                  <FieldText
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    //   onChange={(e) => setName(e.target.value)}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(
                        `forms.fields.wealth.benefits.insuranceCompany.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div>
            <Controller
              name="name"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.benefits.contractName.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.benefits.contractName.label`)}
                  </Label>
                  <FieldText
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    //   onChange={(e) => setName(e.target.value)}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(
                        `forms.fields.wealth.benefits.contractName.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div>
            <Controller
              name="date"
              control={control}
              rules={{
                required: t(`forms.fields.wealth.benefits.date`) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.benefits.date`)}
                  </Label>
                  <FieldDate
                    id={field.name}
                    {...field}
                    onValueChange={field.onChange}
                    className="bg-slate-50"
                    placeholder={t(`forms.fields.wealth.benefits.date`) || ""}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div className="">
            <Controller
              name="metadata.scheduledPayment"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.benefits.scheduledPayment.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.benefits.scheduledPayment.error`
                  ) as string),
              }}
              render={({ field }) => (
                <div className="">
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.benefits.scheduledPayment.label`)}
                  </Label>
                  <InputNumber
                    id={field.name}
                    value={field.value as number}
                    onChange={(e) => field.onChange(e.value as number)}
                    className="w-full border bg-slate-50"
                    inputClassName="flex h-10 w-full bg-slate-50 rounded-md border border-input px-3 py-2 text-sm 
                    ring-offset-background placeholder:text-muted-foreground text-right"
                    mode="currency"
                    currency="EUR"
                    locale="fr-FR"
                    maxFractionDigits={2}
                    placeholder={
                      t(
                        `forms.fields.wealth.benefits.scheduledPayment.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
          <div>
            <Controller
              name="metadata.scheduledPaymentList"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.benefits.scheduledPayment.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(
                      `forms.fields.wealth.benefits.scheduledPayment.preLabel`
                    )}
                  </Label>
                  <Select
                    id={field.name}
                    value={{
                      value: field.value,
                      label: t("forms.fields.cycles." + field.value) as string,
                    }}
                    onChange={(option) => field.onChange(option?.value)}
                    options={scheduledPaymentList}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "var(--bg-slate-50)",
                        borderColor: "var(--input-border-color)",
                        zIndex: 9999,
                      }),
                    }}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div></div>
          <div></div>

          <Controller
            name="metadata.ownership"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.realEstate.detention.error`
              ) as string,
              validate: (value) =>
                value !== null ||
                (t(`forms.fields.wealth.ownership.label`) as string),
            }}
            render={({ field }) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.ownership.label`)}
                </Label>
                <FieldPercentage
                  id={field.name}
                  {...field}
                  className="border bg-slate-50"
                  placeholder={
                    t(`forms.fields.wealth.ownership.placeholder`) || ""
                  }
                  maxVal={100}
                />
              </div>
            )}
          />

          <Controller
            name="metadata.accountType"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.scpi.accountType.error`
              ) as string,
            }}
            render={({ field }) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.scpi.accountType.label`)}
                </Label>
                <Select
                  id={field.name}
                  value={{
                    value: field.value,
                    label: t(
                      "forms.fields.wealth.scpi.accountType." + field.value
                    ) as string,
                  }}
                  onChange={(option) => field.onChange(option?.value)}
                  options={accountType}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "var(--bg-slate-50)",
                      borderColor: "var(--input-border-color)",
                      zIndex: 9999,
                    }),
                  }}
                />
                {getFormErrorMessage(field.name, errors)}
              </div>
            )}
          />

          {watch("metadata.ownership") < 100 && (
            <Controller
              name="metadata.otherOwners"
              control={control}
              rules={{
                required: t(`forms.fields.wealth.otherOwners.error`) as string,
              }}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.otherOwners.label`)}
                  </Label>
                  <Select
                    id={field.name}
                    value={otherOwners.find((o) => o.value === field.value)}
                    onChange={(option) => field.onChange(option?.value)}
                    options={otherOwners}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "var(--bg-slate-50)",
                        borderColor: "var(--input-border-color)",
                        zIndex: 9999,
                      }),
                    }}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          )}
        </div>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <div className="mb-2">
              <Controller
                name="metadata.guarantees.maintenance_salary.isChecked"
                control={control}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 mr-4 font-medium text-xs text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.benefits.guarantees.maintenance_salary`
                      )}
                    </Label>
                    <Checkbox
                      id="maintenance_disability"
                      name="guarantees-maintenance_disability"
                      checked={field.value ?? false}
                      onChange={() => {
                        field.onChange(!field.value);
                      }}
                    />
                  </>
                )}
              />
            </div>
            <div className="bg-slate-50">
              <Controller
                name="metadata.guarantees.maintenance_salary.label"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldTextarea
                      className="pl-2 pr-2"
                      disabledValue={!maintenanceSalaryChecked}
                      id={field.name}
                      {...field}
                      value={field.value as string}
                    />
                  </>
                )}
              />
            </div>
          </div>
          <div>
            <div className="mb-2">
              <Controller
                name="metadata.guarantees.maintenance_disability.isChecked"
                control={control}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 mr-4 font-medium text-xs text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.benefits.guarantees.maintenance_disability`
                      )}
                    </Label>
                    <Checkbox
                      id="maintenance_disability"
                      name="guarantees-maintenance_disability"
                      checked={field.value ?? false}
                      onChange={() => {
                        field.onChange(!field.value);
                      }}
                    />
                  </>
                )}
              />
            </div>
            <div className="bg-slate-50">
              <Controller
                name="metadata.guarantees.maintenance_disability.label"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldTextarea
                      className="pl-2 pr-2"
                      disabledValue={!maintenanceDisabilityChecked}
                      id={field.name}
                      {...field}
                      value={field.value as string}
                    />
                  </>
                )}
              />
            </div>
          </div>
          <div>
            <div className="mb-2">
              <Controller
                name="metadata.guarantees.maintenance_death.isChecked"
                control={control}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 mr-4 font-medium text-xs text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.benefits.guarantees.maintenance_death`
                      )}
                    </Label>
                    <Checkbox
                      id="maintenance_death"
                      name="guarantees-maintenance_death"
                      checked={field.value ?? false}
                      onChange={() => {
                        field.onChange(!field.value);
                      }}
                    />
                  </>
                )}
              />
            </div>
            <div className="bg-slate-50">
              <Controller
                name="metadata.guarantees.maintenance_death.label"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldTextarea
                      className="pl-2 pr-2"
                      disabledValue={!maintenanceDeathChecked}
                      id={field.name}
                      {...field}
                      value={field.value as string}
                    />
                  </>
                )}
              />
            </div>
          </div>
        </div>
        <div className="grid mt-6 w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
          <div className="col-span-2 md:col-span-3 md:col-start-2">
            <Controller
              name="metadata.comment"
              control={control}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.comment`)}
                  </Label>
                  <FieldTextarea
                    className="pl-2 pr-2"
                    id={field.name}
                    {...field}
                    value={field.value as string}
                  />
                </>
              )}
            />
          </div>
        </div>
        <div className="flex">
          <Button
            label={
              asset?.id
                ? t(`forms.fields.actions.update`)
                : t(`forms.fields.actions.add`)
            }
            type="submit"
            icon="pi pi-plus"
            className="mx-auto mt-10"
            loading={isLoading}
          />
        </div>
      </Widget>
    </form>
  );
};
