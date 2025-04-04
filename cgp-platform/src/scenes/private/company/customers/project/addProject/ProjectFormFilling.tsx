import { type FC } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FieldAmount from "../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import FieldPercentage from "../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../UIComponents/Label/Label";
import Select from "../../../../../../UIComponents/Select/Select";
import {
  CifSubscriptionFormValues,
  detentionType,
  scheduledPaymentList,
} from "./CifSubscriptionForm";

type ProjectFormFillingProps = {
  form: UseFormReturn<CifSubscriptionFormValues>;
  additional?: boolean;
  withName?: boolean;
};

export const ProjectFormFilling: FC<ProjectFormFillingProps> = ({
  form,
  withName = true,
}) => {
  const { t } = useTranslation();

  const formValues = form.watch();

  const evolutionValues = form.watch("evolution");
  function updateEvolutionValues(value: number) {
    Array.from({ length: 5 }, (_, year) => {
      form.setValue(
        `evolution.${year}.evolutionPercentage`,
        Math.round(
          (formValues.fees.variablePercent +
            formValues.fees.enterPercent / (year + 1)) *
            100
        ) / 100
      );
      form.setValue(
        `evolution.${year}.evolutionAmount`,
        Math.round(
          value * (evolutionValues[year].evolutionPercentage / 100) * 100
        ) / 100
      );
    });
  }

  const enterFeesValue = [
    "opening",
    "transfer",
    "closing",
    "advice",
    "brokerage",
    "exchange",
    "enterRight",
  ];

  const variableFeesValue = [
    "arbitration",
    "followingAdvice",
    "custodialRight",
    "accountManagement",
    "inactivity",
    "managementAssignments",
    "gestion",
    "surperformance",
  ];

  function GetFixedFeesWithoutEnterRight() {
    let fixedFees = 0;
    Object.keys(formValues.fees.services).forEach((service) => {
      if (service !== "enterRight" && enterFeesValue.includes(service))
        fixedFees +=
          formValues.fees.services[
            service as keyof typeof formValues.fees.services
          ]?.amount ?? 0;
    });
    Object.keys(formValues.fees.products).forEach((product) => {
      if (product !== "enterRight" && enterFeesValue.includes(product))
        fixedFees +=
          formValues.fees.products[
            product as keyof typeof formValues.fees.products
          ]?.amount ?? 0;
    });
    return fixedFees;
  }

  function updateAmount(value: number) {
    Object.keys(formValues.fees.services).forEach((service) => {
      const serviceKey = service as keyof typeof formValues.fees.services;
      form.setValue(
        `fees.services.${serviceKey}.amount`,
        Math.round(
          value *
            ((formValues.fees.services[serviceKey]?.percentage ?? 0) / 100) *
            100
        ) / 100
      );
    });
    Object.keys(formValues.fees.customFees).forEach((index) => {
      const idx = Number(index);
      form.setValue(
        `fees.customFees.${idx}.amount`,
        Math.round(
          value *
            ((formValues.fees.customFees[idx]?.percentage ?? 0) / 100) *
            100
        ) / 100
      );
    });
    Object.keys(formValues.fees.tiers).forEach((tier) => {
      const tierKey = tier as keyof typeof formValues.fees.tiers;
      form.setValue(
        `fees.tiers.${tierKey}.amount`,
        Math.round(
          value *
            ((formValues.fees.tiers[tierKey]?.percentage ?? 0) / 100) *
            100
        ) / 100
      );
    });
    Object.keys(formValues.fees.products).forEach((product) => {
      const productKey = product as keyof typeof formValues.fees.products;
      form.setValue(
        `fees.products.${productKey}.amount`,
        Math.round(
          (productKey === "enterRight"
            ? value - GetFixedFeesWithoutEnterRight()
            : value) *
            ((formValues.fees.products[productKey]?.percentage ?? 0) / 100) *
            100
        ) / 100
      );
    });

    let totalAmount = 0;
    let enterAmount = 0;
    let variableAmount = 0;

    Object.keys(formValues.fees.services).forEach((service) => {
      const serviceKey = service as keyof typeof formValues.fees.services;
      totalAmount += formValues.fees.services[serviceKey]?.amount ?? 0;
      if (enterFeesValue.includes(service)) {
        enterAmount += formValues.fees.services[serviceKey]?.amount ?? 0;
      } else if (variableFeesValue.includes(service)) {
        variableAmount += formValues.fees.services[serviceKey]?.amount ?? 0;
      }
    });

    Object.keys(formValues.fees.customFees).forEach((index) => {
      const idx = Number(index);
      totalAmount += formValues.fees.customFees[idx]?.amount ?? 0;
      if (formValues.fees.customFees[idx]?.feesType === "enter")
        enterAmount += formValues.fees.customFees[idx]?.amount ?? 0;
      else variableAmount += formValues.fees.customFees[idx]?.amount ?? 0;
    });

    Object.keys(formValues.fees.products).forEach((product) => {
      const productKey = product as keyof typeof formValues.fees.products;
      totalAmount += formValues.fees.products[productKey]?.amount ?? 0;
      if (enterFeesValue.includes(product)) {
        enterAmount += formValues.fees.products[productKey]?.amount ?? 0;
      } else if (variableFeesValue.includes(product)) {
        variableAmount += formValues.fees.products[productKey]?.amount ?? 0;
      }
    });

    form.setValue("fees.enterFeesAmount", Math.round(enterAmount * 100) / 100);
    form.setValue(
      "fees.variableFeesAmount",
      Math.round(variableAmount * 100) / 100
    );
    form.setValue("fees.totalValue", Math.round(totalAmount * 100) / 100);

    updateEvolutionValues(value);
  }

  return (
    <div className="mb-4">
      <h1 className="text-[#4761C8] font-bold text-xl mb-4">
        {t("scenes.customers.projects.subscriptionTitle")}
      </h1>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {withName && (
          <div>
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`scenes.customers.projects.addProject.cif.accountName`)}
                  </Label>
                  <FieldText
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full border bg-slate-50"
                    placeholder={
                      t(
                        `scenes.customers.projects.addProject.cif.accountName`
                      ) || ""
                    }
                  />
                </>
              )}
            />
          </div>
        )}
        <div>
          <Controller
            name="insuranceCompany"
            control={form.control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`scenes.customers.projects.addProject.cif.establishment`)}
                </Label>
                <FieldText
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(
                      `scenes.customers.projects.addProject.cif.establishment`
                    ) || ""
                  }
                />
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="date"
            control={form.control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`scenes.customers.projects.addProject.cif.openingDate`)}
                </Label>
                <FieldDate
                  id={field.name}
                  {...field}
                  onValueChange={field.onChange}
                  className="bg-slate-50"
                  placeholder={
                    t(`scenes.customers.projects.addProject.cif.openingDate`) ||
                    ""
                  }
                />
              </>
            )}
          />
        </div>
        <div className="md:col-start-1">
          <Controller
            name="amount"
            control={form.control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`scenes.customers.projects.transfer`)}
                </Label>
                <FieldAmount
                  id={field.name}
                  {...field}
                  value={field.value as number}
                  className="w-full border bg-slate-50"
                  placeholder={t(`scenes.customers.projects.transfer`) || ""}
                  onChange={(value) => {
                    field.onChange(value);
                    updateAmount(value);
                  }}
                />
              </>
            )}
          />
        </div>
        <div>
          <Controller
            name="scheduledPaymentList"
            control={form.control}
            rules={{
              required: t(
                `scenes.customers.projects.addProject.cif.scheduledPayment.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(
                    `scenes.customers.projects.addProject.cif.scheduledPayment.label`
                  )}
                </Label>
                <Select
                  id={field.name}
                  value={{
                    value: field.value ?? "",
                    label: field.value
                      ? (t("forms.fields.cycles." + field.value) as string)
                      : "",
                  }}
                  onChange={(option) => field.onChange(option?.value)}
                  options={scheduledPaymentList}
                  menuPortalTarget={document.body}
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
            name="scheduledPayment"
            control={form.control}
            rules={{
              required: t(
                `scenes.customers.projects.addProject.cif.scheduledPayment.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(
                    `scenes.customers.projects.addProject.cif.scheduledPayment.preLabel`
                  )}
                </Label>
                <FieldAmount
                  id={field.name}
                  {...field}
                  value={field.value as number}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(
                      `scenes.customers.projects.addProject.cif.scheduledPayment.placeholder`
                    ) || ""
                  }
                />
              </>
            )}
          />
        </div>

        <div className="md:col-start-1">
          <Controller
            name="detentionType"
            control={form.control}
            rules={{
              required: t(
                `scenes.customers.projects.addProject.cif.detentionType.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(
                    `scenes.customers.projects.addProject.cif.detentionType.label`
                  )}
                </Label>
                <Select
                  id={field.name}
                  value={{
                    value: field.value ?? "",
                    label: field.value
                      ? (t(
                          "scenes.customers.projects.addProject.cif.detentionType." +
                            field.value
                        ) as string)
                      : "",
                  }}
                  onChange={(option) => field.onChange(option?.value)}
                  options={detentionType}
                  menuPortalTarget={document.body}
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
            name="detention"
            control={form.control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`scenes.customers.projects.subscription.detention`)}
                </Label>
                <FieldPercentage
                  id={field.name}
                  {...field}
                  value={field.value as number}
                  className="w-full border bg-slate-50"
                  placeholder={
                    t(`scenes.customers.projects.subscription.detention`) || ""
                  }
                />
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};
