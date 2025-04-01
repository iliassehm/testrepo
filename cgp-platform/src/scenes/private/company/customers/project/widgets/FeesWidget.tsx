import { InputNumber } from "primereact/inputnumber";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Label } from "../../../../../../components/Label";

interface FeesWidgetProps {
  form: ReturnType<typeof useForm<any>>;
  feesAccessor: string;
}
export const FeesWidget: React.FC<FeesWidgetProps> = ({
  form,
  feesAccessor,
}) => {
  const { t } = useTranslation();
  const openFees = form.watch(feesAccessor + ".openFees.amount");
  const openFeesCabinerShare = form.watch(
    feesAccessor + ".openFees.consultingPercentageFees"
  );
  const custodyFees = form.watch(feesAccessor + ".custodyFees.amount");
  const custodyFeesCabinerShare = form.watch(
    feesAccessor + ".custodyFees.consultingPercentageFees"
  );

  const openFeesCabinerRate = useMemo<number>(() => {
    if (!openFeesCabinerShare || !openFees) return 0;
    return (openFees * openFeesCabinerShare) / 100;
  }, [openFees, openFeesCabinerShare]);

  const custodyFeesCabinerRate = useMemo<number>(() => {
    if (!custodyFeesCabinerShare || !custodyFees) return 0;
    return (custodyFees * custodyFeesCabinerShare) / 100;
  }, [custodyFees, custodyFeesCabinerShare]);

  return (
    <div className="py-4">
      <h1 className="text-[#4761C8] font-bold text-xl mb-4">
        {t("scenes.customers.projects.feesForm.title")}
      </h1>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-lg">
            {t("scenes.customers.projects.feesForm.managerialFees")}
          </h2>
          <div className="flex flex-col justify-between gap-4 flex-wrap xl:flex-row xl:items-end 2xl:items-center w-full">
            <div className="flex flex-wrap xl:max-2xl:flex-col xl:max-2xl:items-start flex-row items-center justify-between gap-4">
              <Label
                label={t("scenes.customers.projects.feesForm.consultingFees")}
              />
              <div className="flex flex-row gap-1 items-center">
                <Controller
                  control={form.control}
                  name={feesAccessor + ".managerFees.adviceFees"}
                  render={({ field }) => (
                    <InputNumber
                      className="border bg-slate-50 h-7 w-48"
                      inputClassName="text-right bg-gray-100/50 text-sm"
                      type="currency"
                      placeholder="0,00"
                      currency={"EUR"}
                      locale="fr-FR"
                      inputMode="decimal"
                      value={field.value}
                      inputRef={field.ref}
                      onChange={(e) => field.onChange(e.value)}
                      minFractionDigits={2}
                      // {...field}
                    />
                  )}
                />
                <span className="font-bold text-[#4761C8]">€</span>
              </div>
            </div>
            <div className="flex flex-wrap xl:max-2xl:flex-col xl:max-2xl:items-start flex-row items-center justify-between gap-4">
              <Label
                label={t("scenes.customers.projects.feesForm.followUpFees")}
              />
              <div className="flex flex-row gap-1 items-center">
                <Controller
                  control={form.control}
                  name={feesAccessor + ".managerFees.followFees"}
                  render={({ field }) => (
                    <InputNumber
                      className="border bg-slate-50 h-7 w-48"
                      inputClassName="text-right bg-gray-100/50 text-sm"
                      type="currency"
                      placeholder="0,00"
                      currency={"EUR"}
                      locale="fr-FR"
                      inputMode="decimal"
                      value={field.value}
                      inputRef={field.ref}
                      onChange={(e) => field.onChange(e.value)}
                      minFractionDigits={2}
                    />
                  )}
                />
                <span className="font-bold text-[#4761C8]">€</span>
              </div>
            </div>
            <div className="flex flex-wrap xl:max-2xl:flex-col xl:max-2xl:items-start flex-row items-center justify-between gap-4">
              <Label
                label={t("scenes.customers.projects.feesForm.managementFees")}
              />
              <div className="flex flex-row gap-1 items-center">
                <Controller
                  control={form.control}
                  name={feesAccessor + ".managerFees.managementPercentageFees"}
                  render={({ field }) => (
                    <InputNumber
                      className="border bg-slate-50 h-7 w-48"
                      inputClassName="text-right bg-gray-100/50 text-sm"
                      type="percent"
                      placeholder="0,00"
                      locale="fr-FR"
                      max={100}
                      inputMode="decimal"
                      value={field.value}
                      inputRef={field.ref}
                      onChange={(e) => field.onChange(e.value)}
                      minFractionDigits={2}
                    />
                  )}
                />
                <span className="font-bold text-[#4761C8]">%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-lg">
            {t("scenes.customers.projects.feesForm.accountFees")}
          </h2>
          <div className="flex flex-row justify-between items-center gap-8 flex-wrap">
            <div className="flex flex-col justify-between gap-4 flex-wrap xl:flex-row xl:items-end 2xl:items-center w-full">
              <div className="flex flex-wrap xl:max-2xl:flex-col xl:max-2xl:items-start flex-row items-center justify-between gap-4">
                <Label
                  label={t("scenes.customers.projects.feesForm.openFees")}
                  className="min-w-[7.6rem]"
                />
                <div className="flex flex-row gap-1 items-center">
                  <Controller
                    control={form.control}
                    name={feesAccessor + ".openFees.amount"}
                    render={({ field }) => (
                      <InputNumber
                        className="border bg-slate-50 h-7 w-48"
                        inputClassName="text-right bg-gray-100/50 text-sm"
                        placeholder="0,00"
                        inputMode="decimal"
                        locale="fr-FR"
                        value={field.value}
                        inputRef={field.ref}
                        onChange={(e) => field.onChange(e.value)}
                        minFractionDigits={2}
                      />
                    )}
                  />
                  <span className="font-bold text-[#4761C8]">%</span>
                </div>
              </div>
              <div className="flex flex-wrap xl:max-2xl:flex-col xl:max-2xl:items-start flex-row items-center justify-between gap-4">
                <Label
                  label={t("scenes.customers.projects.feesForm.cabinerShare")}
                />
                <div className="flex flex-row gap-1 items-center">
                  <Controller
                    control={form.control}
                    name={feesAccessor + ".openFees.consultingPercentageFees"}
                    render={({ field }) => (
                      <InputNumber
                        className="border bg-slate-50 h-7 w-48"
                        inputClassName="text-right bg-gray-100/50 text-sm"
                        type="percent"
                        locale="fr-FR"
                        max={100}
                        value={field.value}
                        inputRef={field.ref}
                        onChange={(e) => field.onChange(e.value)}
                        placeholder="0,00"
                        minFractionDigits={2}
                        inputMode="decimal"
                      />
                    )}
                  />
                  <span className="font-bold text-[#4761C8]">%</span>
                </div>
              </div>
              <div className="flex flex-wrap flex-row justify-between items-center gap-4">
                <Label
                  label={t("scenes.customers.projects.feesForm.cabinerRate")}
                />
                <div className="flex flex-row gap-1 items-center">
                  <span className="h-7 w-32 max-xl:w-48 flex items-center justify-end text-sm px-2">
                    {openFeesCabinerRate.toFixed(2)}
                  </span>
                  <span className="font-bold text-[#4761C8]">%</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4 flex-wrap xl:flex-row xl:items-end 2xl:items-center w-full">
              <div className="flex  flex-wrap xl:max-2xl:flex-col xl:max-2xl:items-start flex-row items-center justify-between gap-4">
                <Label
                  label={t("scenes.customers.projects.feesForm.custodyFees")}
                  className=" min-w-[7.6rem]"
                />
                <div className="flex flex-row gap-1 items-center">
                  <Controller
                    control={form.control}
                    name={feesAccessor + ".custodyFees.amount"}
                    render={({ field }) => (
                      <InputNumber
                        className="border bg-slate-50 h-7 w-48"
                        inputClassName="text-right bg-gray-100/50 text-sm"
                        type="currency"
                        locale="fr-FR"
                        placeholder="0,00"
                        inputMode="decimal"
                        value={field.value}
                        inputRef={field.ref}
                        onChange={(e) => field.onChange(e.value)}
                        minFractionDigits={2}
                      />
                    )}
                  />
                  <span className="font-bold text-[#4761C8]">%</span>
                </div>
              </div>
              <div className="flex flex-wrap xl:max-2xl:flex-col xl:max-2xl:items-start flex-row items-center justify-between gap-4">
                <Label
                  label={t("scenes.customers.projects.feesForm.cabinerShare")}
                />
                <div className="flex flex-row gap-1 items-center">
                  <Controller
                    control={form.control}
                    name={
                      feesAccessor + ".custodyFees.consultingPercentageFees"
                    }
                    render={({ field }) => (
                      <InputNumber
                        className="border bg-slate-50 h-7 w-48"
                        inputClassName="text-right bg-gray-100/50 text-sm"
                        type="percent"
                        locale="fr-FR"
                        max={100}
                        value={field.value}
                        inputRef={field.ref}
                        onChange={(e) => field.onChange(e.value)}
                        placeholder="0,00"
                        minFractionDigits={2}
                        inputMode="decimal"
                      />
                    )}
                  />
                  <span className="font-bold text-[#4761C8]">%</span>
                </div>
              </div>
              <div className="flex flex-wrap flex-row justify-between items-center gap-4">
                <Label
                  label={t("scenes.customers.projects.feesForm.cabinerRate")}
                />
                <div className="flex flex-row gap-1 items-center">
                  <span className="h-7 w-32 max-xl:w-48 flex items-center justify-end text-sm px-2">
                    {custodyFeesCabinerRate.toFixed(2)}
                  </span>
                  <span className="font-bold text-[#4761C8]">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
