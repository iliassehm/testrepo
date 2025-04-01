import { t } from "i18next";
import { InputNumber } from "primereact/inputnumber";
import { Controller, useForm } from "react-hook-form";

import { Button } from "../../../../../../../components";
import { Widget } from "../../../../../../../components/Widget";
import { getFormErrorMessage } from "../../../../../../../constants";
import { useCurrentRoute } from "../../../../../../../hooks/useCurrentRoute";
import {
  CustomerAsset,
  GlobalSearchParams,
  InvestmentValues,
  WealthCreationParams,
} from "../../../../../../../types";
import FieldAmount from "../../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import FieldPercentage from "../../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { FieldTextarea } from "../../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import Select from "../../../../../../../UIComponents/Select/Select";
import { InvestmentInstrumentTableRow } from "../LongTermAsset/components/data-table";
import { RealEstateFormType } from "../RealEstateForm";
import { SecuritiesTable } from "./SecuritiesTable";

export interface SecuritiesFormData {
  categoryName: string;
  name: string;
  openDate: Date;
  accountNumber: string;
  metadata: {
    transfersAmount: number;
    comment: string;
    fees: {
      services: {
        opening: {
          amount: number;
          percentage: number;
        };
        arbitration: {
          amount: number;
          percentage: number;
        };
        transfer: {
          amount: number;
          percentage: number;
        };
        closing: {
          amount: number;
          percentage: number;
        };
        advice: {
          amount: number;
          percentage: number;
        };
        following_advice: {
          amount: number;
          percentage: number;
        };
        brokerage: {
          amount: number;
          percentage: number;
        };
        exchange: {
          amount: number;
          percentage: number;
        };
        custodial_right: {
          amount: number;
          percentage: number;
        };
        account_management: {
          amount: number;
          percentage: number;
        };
        inactivity: {
          amount: number;
          percentage: number;
        };
        management_assignments: {
          amount: number;
          percentage: number;
        };
      };
      tiers: {
        opening: {
          amount: number;
          percentage: number;
        };
        arbitration: {
          amount: number;
          percentage: number;
        };
        transfer: {
          amount: number;
          percentage: number;
        };
        custodial_right: {
          amount: number;
          percentage: number;
        };
        account_management: {
          amount: number;
          percentage: number;
        };
        management_assignments: {
          amount: number;
          percentage: number;
        };
      };
      products: {
        enter_right: {
          amount: number;
          percentage: number;
        };
        gestion: {
          amount: number;
          percentage: number;
        };
        surperformance: {
          amount: number;
          percentage: number;
        };
      };
      enterFeesAmount: number;
      variableFeesAmount: number;
      enterPercent: number;
      variablePercent: number;

      totalValue: number;
      totalPercentage: number;
    };
  };
  activity: {
    value: number;
    instrument: string;
  };
}

export const categoryNames = [
  {
    label: t("asset_categories.compte_titres_ordinaire"),
    value: "compte_titres_ordinaire",
  },
  { label: t("asset_categories.compte_especes"), value: "compte_especes" },
  { label: t("asset_categories.pea"), value: "pea" },
  { label: t("asset_categories.pea_pme"), value: "pea_pme" },
  {
    label: t("asset_categories.girardin_industriel"),
    value: "girardin_industriel",
  },
  { label: t("asset_categories.part_sofica"), value: "part_sofica" },
  { label: t("asset_categories.part_fcpi"), value: "part_fcpi" },
  { label: t("asset_categories.part_fip"), value: "part_fip" },
  { label: t("asset_categories.part_fcpr"), value: "part_fcpr" },
  { label: t("asset_categories.part_holding_ifi"), value: "part_holding_ifi" },
  { label: t("asset_categories.others"), value: "others" },
  { label: t("asset_categories.fip_corse"), value: "fip_corse" },
];

export const SecuritiesForm = ({
  asset,
  onSubmit,
  isLoading,
  formType,
}: {
  asset?: CustomerAsset;
  onSubmit: (
    data: SecuritiesFormData,
    investments?: InvestmentValues[]
  ) => void;
  isLoading?: boolean;
  formType?: RealEstateFormType;
}) => {
  const currentRoute = useCurrentRoute();
  const search = currentRoute.search as GlobalSearchParams &
    WealthCreationParams;

  let defaultValues: SecuritiesFormData = {
    categoryName: asset?.categoryName ?? categoryNames[0].value,
    name: asset?.name ?? "",
    accountNumber: asset?.accountNumber ?? "",
    openDate: new Date(asset?.openDate) ?? new Date(),
    metadata: {
      transfersAmount: asset?.metadata?.transfersAmount ?? 0,
      comment: asset?.metadata?.comment ?? "",
      fees: {
        services: {
          opening: {
            amount: asset?.metadata?.fees?.services?.opening?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.services?.opening?.percentage ?? 0,
          },
          arbitration: {
            amount: asset?.metadata?.fees?.services?.arbitration?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.services?.arbitration?.percentage ?? 0,
          },
          transfer: {
            amount: asset?.metadata?.fees?.services?.transfer?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.services?.transfer?.percentage ?? 0,
          },
          closing: {
            amount: asset?.metadata?.fees?.services?.closing?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.services?.closing?.percentage ?? 0,
          },
          advice: {
            amount: asset?.metadata?.fees?.services?.advice?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.services?.advice?.percentage ?? 0,
          },
          following_advice: {
            amount:
              asset?.metadata?.fees?.services?.following_advice?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.services?.following_advice?.percentage ??
              0,
          },
          brokerage: {
            amount: asset?.metadata?.fees?.services?.brokerage?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.services?.brokerage?.percentage ?? 0,
          },
          exchange: {
            amount: asset?.metadata?.fees?.services?.exchange?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.services?.exchange?.percentage ?? 0,
          },
          custodial_right: {
            amount:
              asset?.metadata?.fees?.services?.custodial_right?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.services?.custodial_right?.percentage ?? 0,
          },
          account_management: {
            amount:
              asset?.metadata?.fees?.services?.account_management?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.services?.account_management?.percentage ??
              0,
          },
          inactivity: {
            amount: asset?.metadata?.fees?.services?.inactivity?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.services?.inactivity?.percentage ?? 0,
          },
          management_assignments: {
            amount:
              asset?.metadata?.fees?.services?.management_assignments?.amount ??
              0,
            percentage:
              asset?.metadata?.fees?.services?.management_assignments
                ?.percentage ?? 0,
          },
        },
        tiers: {
          opening: {
            amount: asset?.metadata?.fees?.tiers?.opening?.amount ?? 0,
            percentage: asset?.metadata?.fees?.tiers?.opening?.percentage ?? 0,
          },
          arbitration: {
            amount: asset?.metadata?.fees?.tiers?.arbitration?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.tiers?.arbitration?.percentage ?? 0,
          },
          transfer: {
            amount: asset?.metadata?.fees?.tiers?.transfer?.amount ?? 0,
            percentage: asset?.metadata?.fees?.tiers?.transfer?.percentage ?? 0,
          },
          custodial_right: {
            amount: asset?.metadata?.fees?.tiers?.custodial_right?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.tiers?.custodial_right?.percentage ?? 0,
          },
          account_management: {
            amount:
              asset?.metadata?.fees?.tiers?.account_management?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.tiers?.account_management?.percentage ?? 0,
          },
          management_assignments: {
            amount:
              asset?.metadata?.fees?.tiers?.management_assignments?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.tiers?.management_assignments
                ?.percentage ?? 0,
          },
        },
        products: {
          enter_right: {
            amount: asset?.metadata?.fees?.products?.enter_right?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.products?.enter_right?.percentage ?? 0,
          },
          gestion: {
            amount: asset?.metadata?.fees?.products?.gestion?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.products?.gestion?.percentage ?? 0,
          },
          surperformance: {
            amount:
              asset?.metadata?.fees?.products?.surperformance?.amount ?? 0,
            percentage:
              asset?.metadata?.fees?.products?.surperformance?.percentage ?? 0,
          },
        },
        enterFeesAmount: asset?.metadata?.fees?.enterFeesAmount ?? 0,
        variableFeesAmount: asset?.metadata?.fees?.variableFeesAmount ?? 0,
        enterPercent: asset?.metadata?.fees?.enterPercent ?? 0,
        variablePercent: asset?.metadata?.fees?.variablePercent ?? 0,

        totalValue:
          asset?.metadata?.fees?.totalValue ??
          (asset?.metadata?.fees?.enterFeesAmount ?? 0) +
            (asset?.metadata?.fees?.variableFeesAmount ?? 0),
        totalPercentage:
          asset?.metadata?.fees?.totalPercentage ??
          (asset?.metadata?.fees?.enterPercent ?? 0) +
            (asset?.metadata?.fees?.variablePercent ?? 0),
      },
    },
    activity: {
      value: asset?.activity?.value ?? null,
      instrument: asset?.activity?.instrument ?? "EUR",
    },
  };

  if (search.form) defaultValues = { ...(search.form as SecuritiesFormData) };

  const enterFeesValue = [
    "opening",
    "transfer",
    "closing",
    "advice",
    "brokerage",
    "exchange",
    "enter_right",
  ];

  const variableFeesValue = [
    "arbitration",
    "following_advice",
    "custodial_right",
    "account_management",
    "inactivity",
    "management_assignments",
    "gestion",
    "surperformance",
  ];

  const form = useForm({
    defaultValues,
  });
  const {
    control,
    formState,
    handleSubmit,
    watch,
    trigger,
    getValues,
    setValue,
  } = form;
  const { errors } = formState;

  const investmentList: InvestmentInstrumentTableRow[] =
    asset?.investmentList
      ?.filter((investment) => investment.code !== "XXliquidity")
      .map((investment) => ({
        amount: investment.valuation.value,
        category: investment.category,
        code: investment.code as string,
        managementCompany: investment.managementCompany,
        label: investment.name,
        percent: 0,
        riskIndicator: investment.riskIndicator,
        quantity: investment.quantity ?? 0,
        valuation: {
          value: investment.unitValue,
          instrument: investment.valuation.instrument,
        },
        // buyingDate: investment.created,
        buyingPrice: investment.unitPrice ?? 0,
      })) || [];

  const formValues = watch();
  const totalFees =
    formValues.metadata.fees.enterFeesAmount +
    formValues.metadata.fees.variableFeesAmount;

  function updateAmount(value: number) {
    Object.keys(formValues.metadata.fees.services).forEach((service) => {
      const serviceKey =
        service as keyof typeof formValues.metadata.fees.services;
      form.setValue(
        `metadata.fees.services.${serviceKey}.amount`,
        Math.round(
          value *
            ((formValues.metadata.fees.services[serviceKey]?.percentage ?? 0) /
              100) *
            100
        ) / 100
      );
    });
    Object.keys(formValues.metadata.fees.tiers).forEach((tier) => {
      const tierKey = tier as keyof typeof formValues.metadata.fees.tiers;
      form.setValue(
        `metadata.fees.tiers.${tierKey}.amount`,
        Math.round(
          value *
            ((formValues.metadata.fees.tiers[tierKey]?.percentage ?? 0) / 100) *
            100
        ) / 100
      );
    });
    Object.keys(formValues.metadata.fees.products).forEach((product) => {
      const productKey =
        product as keyof typeof formValues.metadata.fees.products;
      form.setValue(
        `metadata.fees.products.${productKey}.amount`,
        Math.round(
          value *
            ((formValues.metadata.fees.products[productKey]?.percentage ?? 0) /
              100) *
            100
        ) / 100
      );
    });

    let totalAmount = 0;
    let enterAmount = 0;
    let variableAmount = 0;

    Object.keys(formValues.metadata.fees.services).forEach((service) => {
      const serviceKey =
        service as keyof typeof formValues.metadata.fees.services;
      totalAmount += formValues.metadata.fees.services[serviceKey]?.amount ?? 0;
      if (enterFeesValue.includes(service)) {
        enterAmount +=
          formValues.metadata.fees.services[serviceKey]?.amount ?? 0;
      } else if (variableFeesValue.includes(service)) {
        variableAmount +=
          formValues.metadata.fees.services[serviceKey]?.amount ?? 0;
      }
    });

    Object.keys(formValues.metadata.fees.products).forEach((product) => {
      const productKey =
        product as keyof typeof formValues.metadata.fees.products;
      totalAmount += formValues.metadata.fees.products[productKey]?.amount ?? 0;
      if (enterFeesValue.includes(product)) {
        enterAmount +=
          formValues.metadata.fees.products[productKey]?.amount ?? 0;
      } else if (variableFeesValue.includes(product)) {
        variableAmount +=
          formValues.metadata.fees.products[productKey]?.amount ?? 0;
      }
    });

    form.setValue(
      "metadata.fees.enterFeesAmount",
      Math.round(enterAmount * 100) / 100
    );
    form.setValue(
      "metadata.fees.variableFeesAmount",
      Math.round(variableAmount * 100) / 100
    );
    form.setValue(
      "metadata.fees.totalValue",
      Math.round(totalAmount * 100) / 100
    );
  }

  function updateValues() {
    let totalAmount = 0;
    let enterAmount = 0;
    let variableAmount = 0;

    Object.keys(formValues.metadata.fees.services).forEach((service) => {
      const serviceKey =
        service as keyof typeof formValues.metadata.fees.services;
      totalAmount += formValues.metadata.fees.services[serviceKey]?.amount ?? 0;
      if (enterFeesValue.includes(service)) {
        enterAmount +=
          formValues.metadata.fees.services[serviceKey]?.amount ?? 0;
      } else if (variableFeesValue.includes(service)) {
        variableAmount +=
          formValues.metadata.fees.services[serviceKey]?.amount ?? 0;
      }
    });

    Object.keys(formValues.metadata.fees.products).forEach((product) => {
      const productKey =
        product as keyof typeof formValues.metadata.fees.products;
      totalAmount += formValues.metadata.fees.products[productKey]?.amount ?? 0;
      if (enterFeesValue.includes(product)) {
        enterAmount +=
          formValues.metadata.fees.products[productKey]?.amount ?? 0;
      } else if (variableFeesValue.includes(product)) {
        variableAmount +=
          formValues.metadata.fees.products[productKey]?.amount ?? 0;
      }
    });

    form.setValue(
      "metadata.fees.enterFeesAmount",
      Math.round(enterAmount * 100) / 100
    );
    form.setValue(
      "metadata.fees.variableFeesAmount",
      Math.round(variableAmount * 100) / 100
    );
    form.setValue(
      "metadata.fees.totalValue",
      Math.round(totalAmount * 100) / 100
    );
  }

  function updatePercentages() {
    let totalPercent = 0;
    let enterPercent = 0;
    let variablePercent = 0;

    Object.keys(formValues.metadata.fees.services).forEach((service) => {
      const serviceKey =
        service as keyof typeof formValues.metadata.fees.services;
      totalPercent +=
        formValues.metadata.fees.services[serviceKey]?.percentage ?? 0;
      if (enterFeesValue.includes(service)) {
        enterPercent +=
          formValues.metadata.fees.services[serviceKey]?.percentage ?? 0;
      } else if (variableFeesValue.includes(service)) {
        variablePercent +=
          formValues.metadata.fees.services[serviceKey]?.percentage ?? 0;
      }
    });

    Object.keys(formValues.metadata.fees.products).forEach((product) => {
      const productKey =
        product as keyof typeof formValues.metadata.fees.products;
      totalPercent +=
        formValues.metadata.fees.products[productKey]?.percentage ?? 0;
      if (enterFeesValue.includes(product)) {
        enterPercent +=
          formValues.metadata.fees.products[productKey]?.percentage ?? 0;
      } else if (variableFeesValue.includes(product)) {
        variablePercent +=
          formValues.metadata.fees.products[productKey]?.percentage ?? 0;
      }
    });

    form.setValue(
      "metadata.fees.enterPercent",
      Math.round(enterPercent * 100) / 100
    );
    form.setValue(
      "metadata.fees.variablePercent",
      Math.round(variablePercent * 100) / 100
    );
    form.setValue(
      "metadata.fees.totalPercentage",
      Math.round(totalPercent * 100) / 100
    );
  }

  if (formType === RealEstateFormType.SIMPLIFIED) {
    return (
      <form
        className="flex flex-col items-center"
        onSubmit={handleSubmit((information) =>
          onSubmit({
            ...information,
            activity: {
              ...information.activity,
              value: information.metadata.transfersAmount,
            },
          })
        )}
      >
        <Widget className="pt-4">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
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
                name="name"
                control={control}
                rules={{
                  required: t(`forms.fields.wealth.walletName.error`) as string,
                }}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.walletName.label`)}
                    </Label>
                    <FieldText
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      //   onChange={(e) => setName(e.target.value)}
                      className="w-full border bg-slate-50"
                      placeholder={
                        t(`forms.fields.wealth.walletName.placeholder`) || ""
                      }
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
                rules={{
                  required: t(
                    `forms.fields.wealth.securities.accountNumber`
                  ) as string,
                }}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.securities.accountNumber`)}
                    </Label>
                    <FieldText
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      //   onChange={(e) => setName(e.target.value)}
                      className="w-full border bg-slate-50"
                      placeholder={
                        t(`forms.fields.wealth.securities.accountNumber`) || ""
                      }
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>
            <div>
              <Controller
                name="openDate"
                control={control}
                rules={{
                  required: t(`forms.fields.wealth.securities.date`) as string,
                }}
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.securities.date`)}
                    </Label>
                    <FieldDate
                      id={field.name}
                      {...field}
                      onValueChange={field.onChange}
                      className="bg-slate-50"
                      placeholder={
                        t(`forms.fields.wealth.securities.date`) || ""
                      }
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                )}
              />
            </div>
            <div className="">
              <Controller
                name="metadata.transfersAmount"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.longTermAsset.transfersAmount.error`
                  ) as string,
                  validate: (value) =>
                    value !== null ||
                    (t(
                      `forms.fields.wealth.longTermAsset.transfersAmount.error`
                    ) as string),
                }}
                render={({ field }) => (
                  <div className="w-60">
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.longTermAsset.transfersAmount.label`
                      )}
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
                          `forms.fields.wealth.longTermAsset.transfersAmount.placeholder`
                        ) || ""
                      }
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </div>
                )}
              />
            </div>
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
  }
  return (
    <div className="flex flex-col gap-4 items-center">
      <Widget className="pt-4">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
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
              name="name"
              control={control}
              rules={{
                required: t(`forms.fields.wealth.walletName.error`) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.walletName.label`)}
                  </Label>
                  <FieldText
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    //   onChange={(e) => setName(e.target.value)}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.walletName.placeholder`) || ""
                    }
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
              rules={{
                required: t(
                  `forms.fields.wealth.securities.accountNumber`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.securities.accountNumber`)}
                  </Label>
                  <FieldText
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    //   onChange={(e) => setName(e.target.value)}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(`forms.fields.wealth.securities.accountNumber`) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div>
            <Controller
              name="openDate"
              control={control}
              rules={{
                required: t(`forms.fields.wealth.securities.date`) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.securities.date`)}
                  </Label>
                  <FieldDate
                    id={field.name}
                    {...field}
                    onValueChange={field.onChange}
                    className="bg-slate-50"
                    placeholder={t(`forms.fields.wealth.securities.date`) || ""}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </>
              )}
            />
          </div>
          <div className="">
            <Controller
              name="metadata.transfersAmount"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.longTermAsset.transfersAmount.error`
                ) as string,
                validate: (value) =>
                  value !== null ||
                  (t(
                    `forms.fields.wealth.longTermAsset.transfersAmount.error`
                  ) as string),
              }}
              render={({ field }) => (
                <div className="w-60">
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(
                      `forms.fields.wealth.longTermAsset.transfersAmount.label`
                    )}
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
                        `forms.fields.wealth.longTermAsset.transfersAmount.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          </div>
        </div>
        <div className="pt-6 grid gap-8 grid-cols-2">
          <div className="flex flex-col">
            <div className="grid gap-4 grid-cols-3 bg-blue-800 text-white py-2 px-4 mt-2 rounded-xl">
              <div className="flex ml-10 items-center">
                {t(
                  `scenes.customers.projects.addProject.cif.fees.servicesFeesLabel`
                )}
              </div>
              <div className="flex justify-center items-center">
                {t(
                  `scenes.customers.projects.addProject.cif.fees.absoluteValue`
                )}
              </div>
              <div className="flex justify-center items-center">
                {t(`scenes.customers.projects.addProject.cif.fees.percentage`)}
              </div>
            </div>
            <div className="">
              {Object.keys(formValues.metadata.fees.services).map(
                (service, index) => (
                  <div className="grid gap-4 grid-cols-3 pl-2 pt-2" key={index}>
                    <div className="flex items-center">
                      <div className="ml-12 text-xs">
                        {t(
                          `scenes.customers.projects.addProject.cif.fees.${service}`
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <Controller
                        name={`metadata.fees.services.${service as keyof typeof formValues.metadata.fees.services}.amount`}
                        control={form.control}
                        render={({ field }) => (
                          <div className="w-32">
                            <FieldAmount
                              id={field.name}
                              {...field}
                              value={field.value as number}
                              className="w-full bg-slate-50 h-10"
                              placeholder={"€"}
                              onChange={(value) => {
                                field.onChange(value);
                                // percent service
                                form.setValue(
                                  `metadata.fees.services.${service as keyof typeof formValues.metadata.fees.services}.percentage`,
                                  Math.round(
                                    (formValues.metadata.fees.services[
                                      service as keyof typeof formValues.metadata.fees.services
                                    ].amount /
                                      formValues.metadata.transfersAmount) *
                                      100 *
                                      100
                                  ) / 100
                                );
                                updateValues();
                                updatePercentages();
                              }}
                            />
                          </div>
                        )}
                      />
                    </div>
                    <div className="flex justify-center items-center">
                      <Controller
                        name={`metadata.fees.services.${service as keyof typeof formValues.metadata.fees.services}.percentage`}
                        control={form.control}
                        render={({ field }) => (
                          <div className="w-32">
                            <FieldPercentage
                              id={field.name}
                              {...field}
                              value={field.value ?? undefined}
                              className="w-full bg-slate-50 h-10"
                              onChange={(value) => {
                                field.onChange(value);

                                // montant frais service
                                form.setValue(
                                  `metadata.fees.services.${service as keyof typeof formValues.metadata.fees.services}.amount`,
                                  Math.round(
                                    formValues.metadata.transfersAmount *
                                      (formValues.metadata.fees.services[
                                        service as keyof typeof formValues.metadata.fees.services
                                      ].percentage /
                                        100) *
                                      100
                                  ) / 100
                                );
                                updateValues();
                                updatePercentages();
                              }}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="grid gap-4 grid-cols-3 bg-blue-800 text-white py-2 px-4 mt-2 rounded-xl">
              <div className="flex ml-10 items-center">
                {t(
                  `scenes.customers.projects.addProject.cif.fees.tiersFeesLabel`
                )}
              </div>
              <div className="flex justify-center items-center">
                {t(
                  `scenes.customers.projects.addProject.cif.fees.absoluteValue`
                )}
              </div>
              <div className="flex justify-center items-center">
                {t(`scenes.customers.projects.addProject.cif.fees.percentage`)}
              </div>
            </div>
            <div>
              {Object.keys(formValues.metadata.fees.tiers).map(
                (tier, index) => (
                  <div className="grid gap-4 grid-cols-3 pl-2 pt-2" key={index}>
                    <div className="flex items-center">
                      <div className="ml-12 text-xs">
                        {t(
                          `scenes.customers.projects.addProject.cif.fees.${tier}`
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <Controller
                        name={`metadata.fees.tiers.${tier as keyof typeof formValues.metadata.fees.tiers}.amount`}
                        control={form.control}
                        render={({ field }) => (
                          <div className="w-32">
                            <FieldAmount
                              id={field.name}
                              {...field}
                              value={field.value as number}
                              className="w-full bg-slate-50 h-10"
                              placeholder={"€"}
                              onChange={(value) => {
                                field.onChange(value);

                                // percent frais tiers
                                form.setValue(
                                  `metadata.fees.tiers.${tier as keyof typeof formValues.metadata.fees.tiers}.percentage`,
                                  Math.round(
                                    (formValues.metadata.fees.tiers[
                                      tier as keyof typeof formValues.metadata.fees.tiers
                                    ].amount /
                                      formValues.metadata.transfersAmount) *
                                      10000
                                  ) / 100
                                );
                                updateValues();
                                updatePercentages();
                              }}
                            />
                          </div>
                        )}
                      />
                    </div>
                    <div className="flex justify-center items-center">
                      <Controller
                        name={`metadata.fees.tiers.${tier as keyof typeof formValues.metadata.fees.tiers}.percentage`}
                        control={form.control}
                        render={({ field }) => (
                          <div className="w-32">
                            <FieldPercentage
                              id={field.name}
                              {...field}
                              value={field.value ?? undefined}
                              className="w-full bg-slate-50 h-10"
                              onChange={(value) => {
                                field.onChange(value);

                                // montant frais tiers
                                form.setValue(
                                  `metadata.fees.tiers.${tier as keyof typeof formValues.metadata.fees.tiers}.amount`,
                                  Math.round(
                                    formValues.metadata.transfersAmount *
                                      (formValues.metadata.fees.tiers[
                                        tier as keyof typeof formValues.metadata.fees.tiers
                                      ]?.percentage /
                                        100) *
                                      100
                                  ) / 100
                                );
                                updateValues();
                                updatePercentages();
                              }}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="grid gap-4 grid-cols-3 bg-blue-800 text-white py-2 px-4 mt-2 rounded-xl">
              <div className="flex ml-10 items-center">
                {t(
                  `scenes.customers.projects.addProject.cif.fees.productsFeesLabel`
                )}
              </div>
              <div className="flex justify-center items-center">
                {t(
                  `scenes.customers.projects.addProject.cif.fees.absoluteValue`
                )}
              </div>
              <div className="flex justify-center items-center">
                {t(`scenes.customers.projects.addProject.cif.fees.percentage`)}
              </div>
            </div>
            <div>
              {Object.keys(formValues.metadata.fees.products).map(
                (product, index) => (
                  <div className="grid gap-4 grid-cols-3 pl-2 pt-2" key={index}>
                    <div className="flex items-center">
                      <div className="ml-12 text-xs">
                        {t(
                          `scenes.customers.projects.addProject.cif.fees.${product}`
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <Controller
                        name={`metadata.fees.products.${product as keyof typeof formValues.metadata.fees.products}.amount`}
                        control={form.control}
                        render={({ field }) => (
                          <div className="w-32">
                            <FieldAmount
                              id={field.name}
                              {...field}
                              value={field.value as number}
                              className="w-full bg-slate-50 h-10"
                              placeholder={"€"}
                              onChange={(value) => {
                                field.onChange(value);

                                // percent product
                                form.setValue(
                                  `metadata.fees.products.${product as keyof typeof formValues.metadata.fees.products}.percentage`,
                                  Math.round(
                                    (formValues.metadata.fees.products[
                                      product as keyof typeof formValues.metadata.fees.products
                                    ]?.amount /
                                      formValues.metadata.transfersAmount) *
                                      10000
                                  ) / 100
                                );
                                updateValues();
                                updatePercentages();
                              }}
                            />
                          </div>
                        )}
                      />
                    </div>
                    <div className="flex justify-center items-center">
                      <Controller
                        name={`metadata.fees.products.${product as keyof typeof formValues.metadata.fees.products}.percentage`}
                        control={form.control}
                        render={({ field }) => (
                          <div className="w-32">
                            <FieldPercentage
                              id={field.name}
                              {...field}
                              value={field.value ?? undefined}
                              className="w-full bg-slate-50 h-10"
                              onChange={(value) => {
                                field.onChange(value);

                                // montant frais service
                                form.setValue(
                                  `metadata.fees.products.${product as keyof typeof formValues.metadata.fees.products}.amount`,
                                  Math.round(
                                    formValues.metadata.transfersAmount *
                                      (formValues.metadata.fees.products[
                                        product as keyof typeof formValues.metadata.fees.products
                                      ].percentage /
                                        100) *
                                      100
                                  ) / 100
                                );
                                updateValues();
                                updatePercentages();
                              }}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="grid gap-4 grid-cols-3 bg-blue-800 text-white py-2 px-4 mt-2 rounded-xl">
              <div className="flex ml-10 items-center">
                {t(
                  `scenes.customers.projects.addProject.cif.fees.totalFeesLabel`
                )}
              </div>
              <div className="flex justify-center items-center">
                {t(
                  `scenes.customers.projects.addProject.cif.fees.absoluteValue`
                )}
              </div>
              <div className="flex justify-center items-center">
                {t(`scenes.customers.projects.addProject.cif.fees.percentage`)}
              </div>
            </div>
            <div>
              <div className="grid gap-4 grid-cols-3 bg-blue-600 bg-opacity-20 pl-2 mt-2 rounded-xl">
                <div className="flex items-center">
                  <div className="ml-12 text-xs">
                    {t(
                      `scenes.customers.projects.addProject.cif.fees.fixedFees`
                    )}
                  </div>
                </div>
                <div className="flex justify-center items-center pr-4">
                  <div className="w-32 text-right px-1 py-2 text-sm">
                    {formValues.metadata.fees.enterFeesAmount} €
                  </div>
                </div>
                <div className="flex justify-center items-center pr-4">
                  <div className="w-32 text-right px-1 py-2 text-sm">
                    {formValues.metadata.fees.enterPercent} %
                  </div>
                </div>
              </div>
              <div className="grid gap-4 grid-cols-3 bg-blue-600 bg-opacity-20 pl-2 mt-2 rounded-xl">
                <div className="flex items-center">
                  <div className="ml-12 text-xs">
                    {t(
                      `scenes.customers.projects.addProject.cif.fees.variableFees`
                    )}
                  </div>
                </div>
                <div className="flex justify-center items-center pr-4">
                  <div className="w-32 text-right px-1 py-2 text-sm">
                    {formValues.metadata.fees.variableFeesAmount} €
                  </div>
                </div>
                <div className="flex justify-center items-center pr-4">
                  <div className="w-32 text-right px-1 py-2 text-sm">
                    {formValues.metadata.fees.variablePercent} %
                  </div>
                </div>
              </div>
              <div className="grid gap-4 grid-cols-3 bg-blue-600 bg-opacity-20 pl-2 mt-2 rounded-xl">
                <div className="flex items-center">
                  <div className="ml-12 text-xs">
                    {t(
                      `scenes.customers.projects.addProject.cif.fees.totalFeesLabel`
                    )}
                  </div>
                </div>
                <div className="flex justify-center items-center pr-4">
                  <div className="w-32 text-right px-1 py-2 text-sm">
                    {formValues.metadata.fees.totalValue} €
                  </div>
                </div>
                <div className="flex justify-center items-center pr-4">
                  <div className="w-32 text-right px-1 py-2 text-sm">
                    {formValues.metadata.fees.totalPercentage} %
                  </div>
                </div>
              </div>
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
      </Widget>

      <Widget className="pt-4">
        <SecuritiesTable
          form={form}
          totalFees={totalFees}
          investmentList={investmentList}
          onSubmit={async (data) => {
            const information = getValues();
            const isFormValid = await trigger();
            if (isFormValid) {
              onSubmit(
                {
                  ...information,
                  activity: {
                    ...information.activity,
                    value: information.metadata.transfersAmount - totalFees,
                  },
                },
                data
              );
            }
          }}
        />
      </Widget>
    </div>
  );
};
