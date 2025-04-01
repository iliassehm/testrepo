import { useParams } from "@tanstack/react-router";
import { TFunction } from "i18next";
import { Checkbox } from "primereact/checkbox";
import { useMemo, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { Control, Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { twMerge } from "tailwind-merge";

import { Button, Select, SelectOption, Text } from "../../../../../components";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import FieldAmount from "../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldNumber } from "../../../../../UIComponents/FieldNumber/FieldNumber";
import FieldPercentage from "../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../UIComponents/Label/Label";
import { fieldDefaultClassName } from "../../../../../UIComponents/style";
import { CustomerSkeleton } from "../CustomersSkeleton";
import { useChargeMutations } from "../kyc/charges/useChargeMutations";
import { useChargeQueries } from "../kyc/charges/useChargeQueries";
import { CompanyCustomersFiscalityLogic } from "./fiscality.logic";

interface FiscalityFormType {
  wages: number;
  pension: number;
  bic: number;
  bnc: number;
  ba: number;
  furnitureIncome: number;
  propertyIncome: number;
  totalReportedIncome: number;
  totalGrossIncome: number;
  deductibleExpenses: number;
  taxableIncome: number;
  partsNumber: number;
  marginalTaxRate: number;
  taxReductionsCredits: number;

  builtBuildings: number;
  unbuiltBuildings: number;
  realEstateRights: number;
  deductibleLiabilities: number;
  taxBase: number;
  realEstateWealthTax: number;
  realEstateWealthTaxReduction: number;

  subjectToIncomeTax: boolean;
  socialContributions: number;
  payableTax: number;
  subjectRealEstateWealthTax: boolean;
  realEstateWealthPayableTax: number;
}

function getYearOptions(startingYear = 2000) {
  const currentYear = new Date().getFullYear();
  const yearsOptions: SelectOption[] = [];

  if (startingYear > currentYear)
    throw new Error("Starting year should be before current year.");

  while (startingYear <= currentYear) {
    yearsOptions.push({
      value: startingYear.toString(),
      label: startingYear.toString(),
    });
    startingYear++;
  }

  return yearsOptions;
}

export function CompanyCustomersFiscality() {
  // State
  const [selectedYear, setSelectedYear] = useState(
    new Date().getUTCFullYear() + ""
  );

  // Hooks
  const { t } = useTranslation();
  const toast = useToast();
  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/fiscality",
  });
  const queryClient = useQueryClient();
  const yearsOptions = useMemo(() => getYearOptions(2000).reverse(), []);

  // Queries
  const { data, isLoading } = useQuery(
    ["companyCustomersInformations", companyId, customerId, selectedYear],
    () =>
      gql.client.request(CompanyCustomersFiscalityLogic.queries(), {
        companyID: companyId as string,
        customerID: customerId as string,
        year: parseInt(selectedYear),
      })
  );
  const { charges } = useChargeQueries(companyId, customerId);

  // Form
  const defaultValues = data?.customer?.fiscality ?? {};
  const { control, watch, handleSubmit } = useForm<FiscalityFormType>({
    values: defaultValues,
    mode: "all",
    resetOptions: {
      keepDirtyValues: false, // user-interacted input will be retained
      keepErrors: false, // input errors will be retained with value update
    },
  });

  // Mutations
  const { budgetCreation, budgetDelete } = useChargeMutations(
    companyId,
    customerId
  );

  const { mutate: updateFiscality, isLoading: fiscalityLoading } = useMutation(
    (input: FiscalityFormType) =>
      gql.client.request(CompanyCustomersFiscalityLogic.updateFiscality(), {
        companyID: companyId as string,
        customerID: customerId as string,
        input,
        year: parseInt(selectedYear),
      }),
    {
      onSuccess: (data) => {
        /* If customer not subject to wealth tax OR modify his tax, remove all expenses real estate wealth tax */
        if (
          data?.customerFiscality?.subjectRealEstateWealthTax === false ||
          data?.customerFiscality?.realEstateWealthPayableTax
        ) {
          removeExpensesWealthTax();
        }

        if (
          data?.customerFiscality?.subjectRealEstateWealthTax === true &&
          data?.customerFiscality?.realEstateWealthPayableTax
        ) {
          addExpensesWealthTax(
            data?.customerFiscality?.realEstateWealthPayableTax
          );
        }

        toast?.current?.show({
          severity: "success",
          summary: "Success",
          detail: t("forms.fields.notifications.success.save"),
        });
        queryClient.invalidateQueries([
          "companyCustomersInformations",
          companyId,
          customerId,
        ]);
      },
    }
  );

  const removeExpensesWealthTax = () => {
    const wealthTaxCharges = charges.filter(
      (charge) => charge.name === "realEstateWealthTax"
    );
    Promise.all(
      wealthTaxCharges.map((charge) =>
        budgetDelete.mutateAsync({ budgetID: charge.id })
      )
    );
  };

  const addExpensesWealthTax = (realEstateWealthPayableTax: number) => {
    budgetCreation.mutate({
      input: {
        type: "taxeGeneral",
        name: "realEstateWealthTax",
        amount: realEstateWealthPayableTax,
      },
      updateFiscality: false,
    });
  };

  if (isLoading) return <CustomerSkeleton />;

  const hasSubjectToIncomeTax = watch("subjectToIncomeTax");
  const hasSubjectRealEstateWealthTax = watch("subjectRealEstateWealthTax");

  return (
    <>
      <form
        className="section flex max-w-8xl flex-col p-8 md:flex-row md:justify-between md:gap-x-10 2xl:justify-start 2xl:gap-x-20"
        onSubmit={handleSubmit((data) => updateFiscality(data))}
      >
        <div className="md:w-1/2">
          <div className="mb-10 flex items-center gap-x-2">
            <Text
              as="label"
              className="font-bold text-base text-blue-1000"
              label="forms.fields.fiscality.wagesTaxes"
            />
            <Select
              defaultValue={selectedYear.toString()}
              options={yearsOptions}
              name="yearsOptions"
              onChange={setSelectedYear}
              className="bg-blue-800 pl-1 pr-2 font-bold text-white"
            />
            <Text as="label" className="font-bold text-base text-blue-1000">
              {t("forms.fields.fiscality.onRevenue") as string}
              {parseInt(selectedYear) - 1}
            </Text>
          </div>
          <div className="flex flex-col gap-2  mb-10 md:mb-0">
            <FiscalityForm control={control} t={t} />
            <div className="flex w-full items-center justify-between pb-2 pt-3">
              <Controller
                name="subjectToIncomeTax"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center w-1/2 gap-2">
                    <Label htmlFor={field.name}>
                      {t("forms.fields.fiscality.subjectToIncomeTax")}
                    </Label>
                    <Checkbox
                      inputId={field.name}
                      checked={field.value}
                      inputRef={field.ref}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                  </div>
                )}
              />
              {!!hasSubjectToIncomeTax && (
                <div className="w-1/2">
                  <Controller
                    name="payableTax"
                    control={control}
                    render={({ field }) => (
                      <FieldAmount id={field.name} {...field} />
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="-mt-[4px] mb-11 flex items-center justify-between">
            <Text as="label" className="font-bold text-base text-blue-1000">
              {t("forms.fields.fiscality.wagesTaxes") as string}
              {selectedYear}
            </Text>
            <Button
              label={`actions.save`}
              type="submit"
              size="small"
              className="hidden h-auto md:flex"
              loading={fiscalityLoading}
            />
          </div>

          <div className="flex flex-col gap-2 mb-10 md:mb-0">
            <CurrentFiscalityForm control={control} t={t} />
            <div className="flex w-full items-center justify-between pb-2 pt-3">
              <Controller
                name="subjectRealEstateWealthTax"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center w-1/2 gap-2">
                    <Label htmlFor={field.name}>
                      {t("forms.fields.fiscality.subjectRealEstateWealthTax")}
                    </Label>
                    <Checkbox
                      inputId={field.name}
                      checked={field.value}
                      inputRef={field.ref}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                  </div>
                )}
              />
              {!!hasSubjectRealEstateWealthTax && (
                <Controller
                  name="realEstateWealthPayableTax"
                  control={control}
                  render={({ field }) => (
                    <FieldAmount id={field.name} {...field} className="w-1/3" />
                  )}
                />
              )}
            </div>
          </div>
        </div>
        <Button
          label="actions.save"
          type="submit"
          size="small"
          className="flex h-6 md:hidden"
          loading={fiscalityLoading}
        />
      </form>
    </>
  );
}

interface FiscalityFormProps {
  control: Control<FiscalityFormType>;
  t: TFunction;
}
function FiscalityForm({ control, t }: FiscalityFormProps) {
  return (
    <>
      <Controller
        name="wages"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.wages")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/2" />
          </div>
        )}
      />
      <Controller
        name="pension"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.pension")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/2" />
          </div>
        )}
      />
      <Controller
        name="bic"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.bic")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/2" />
          </div>
        )}
      />
      <Controller
        name="bnc"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.bnc")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/2" />
          </div>
        )}
      />
      <Controller
        name="ba"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.ba")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/2" />
          </div>
        )}
      />
      <Controller
        name="furnitureIncome"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.furnitureIncome")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/2" />
          </div>
        )}
      />
      <Controller
        name="propertyIncome"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.propertyIncome")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/2" />
          </div>
        )}
      />
      <Controller
        name="totalReportedIncome"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.totalReportedIncome")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/2" />
          </div>
        )}
      />
      <Controller
        name="totalGrossIncome"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.totalGrossIncome")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/2" />
          </div>
        )}
      />
      <Controller
        name="deductibleExpenses"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.deductibleExpenses")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/2" />
          </div>
        )}
      />
      <Controller
        name="taxableIncome"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.taxableIncome")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/2" />
          </div>
        )}
      />
      <Controller
        name="partsNumber"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.partsNumber")}
            </Label>
            <CurrencyInput
              {...field}
              allowDecimals
              onValueChange={(value, _, values) => {
                const result = values
                  ? values.float
                  : Number.parseFloat(value as string);

                if (!result && result !== 0) return;
                field.onChange(result);
              }}
              className={twMerge(
                fieldDefaultClassName,
                "flex text-right w-1/2"
              )}
            />
          </div>
        )}
      />
      <Controller
        name="marginalTaxRate"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.marginalTaxRate")}
            </Label>
            <FieldPercentage id={field.name} {...field} className="w-1/2" />
          </div>
        )}
      />
      <Controller
        name="taxReductionsCredits"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.taxReductionsCredits")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/2" />
          </div>
        )}
      />
    </>
  );
}

interface CurrentFiscalityFormProps {
  control: Control<FiscalityFormType>;
  t: TFunction;
}
function CurrentFiscalityForm({ control, t }: CurrentFiscalityFormProps) {
  return (
    <>
      <Controller
        name="builtBuildings"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.builtBuildings")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/3" />
          </div>
        )}
      />
      <Controller
        name="unbuiltBuildings"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.unbuiltBuildings")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/3" />
          </div>
        )}
      />
      <Controller
        name="realEstateRights"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.realEstateRights")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/3" />
          </div>
        )}
      />
      <Controller
        name="deductibleLiabilities"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.deductibleLiabilities")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/3" />
          </div>
        )}
      />
      <Controller
        name="taxBase"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.taxBase")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/3" />
          </div>
        )}
      />
      <Controller
        name="realEstateWealthTax"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.realEstateWealthTax")}
            </Label>
            <FieldPercentage id={field.name} {...field} className="w-1/3" />
          </div>
        )}
      />
      <Controller
        name="realEstateWealthTaxReduction"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="w-1/2">
              {t("forms.fields.fiscality.realEstateWealthTaxReduction")}
            </Label>
            <FieldAmount id={field.name} {...field} className="w-1/3" />
          </div>
        )}
      />
    </>
  );
}
