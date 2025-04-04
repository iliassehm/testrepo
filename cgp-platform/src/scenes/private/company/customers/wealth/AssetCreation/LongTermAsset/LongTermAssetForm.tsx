import { t } from "i18next";
import { Controller, UseFormReturn } from "react-hook-form";

import {
  contraTypeList,
  LongTermAssetFormData,
  scheduledPaymentList,
  scpiList,
} from ".";
import { Text } from "../../../../../../../components/Text";
import {
  displayFormErrorMessage,
  getFormErrorMessage,
} from "../../../../../../../constants";
import { AssetGroup, CustomerAsset } from "../../../../../../../types";
import FieldAmount from "../../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import FieldPercentage from "../../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import Select from "../../../../../../../UIComponents/Select/Select";
import { LongTermAssetType } from "../AssetCreation";

export interface LongTermAssetFormProps {
  asset?: CustomerAsset;
  form: UseFormReturn<LongTermAssetFormData, unknown, undefined>;
  onSubmit: (data: LongTermAssetFormData) => void;
  type: LongTermAssetType;
  referenceInstrument: string;
  isLoading?: boolean;
  variableFeeAmount: number;
}

const categoryNamesLifeInsurance = [
  { label: t("asset_categories.life_insurance"), value: "life_insurance" },
  {
    label: t("asset_categories.contrat_capitalisation"),
    value: "contrat_capitalisation",
  },
  {
    label: t("asset_categories.pep_life_insurance"),
    value: "pep_life_insurance",
  },
  {
    label: t("asset_categories.pb_delayed_life_insurance"),
    value: "pb_delayed_life_insurance",
  },
];

const categoryNamesRetirementEmployee = [
  { label: t("asset_categories.per"), value: "per" },
  { label: t("asset_categories.perp"), value: "perp" },
  { label: t("asset_categories.perco_percoi"), value: "perco_percoi" },
  { label: t("asset_categories.pee_pei"), value: "pee_pei" },
  {
    label: t("asset_categories.contrat_article_82"),
    value: "contrat_article_82",
  },
  {
    label: t("asset_categories.contrat_article_83"),
    value: "contrat_article_83",
  },
  {
    label: t("asset_categories.contrat_loi_madelin"),
    value: "contrat_loi_madelin",
  },
  {
    label: t("asset_categories.others_retirement"),
    value: "others_retirement",
  },
];

export const LongTermAssetForm = ({
  type,
  form,
  variableFeeAmount,
}: LongTermAssetFormProps) => {
  const { control } = form;

  const isLifeInsurance = type === AssetGroup.LifeInsuranceCapitalization;
  const isRetirement = type === AssetGroup.RetirementEmployee;
  const isPrivateCivilRealestate = type === AssetGroup.RockPaper;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-4">
        {isRetirement || isLifeInsurance ? (
          <div className="flex-1 bg-white">
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
                      value: field.value as string,
                      label: field.value
                        ? (t("asset_categories." + field.value) as string)
                        : "",
                    }}
                    onChange={(option) => field.onChange(option?.value)}
                    options={
                      isRetirement
                        ? categoryNamesRetirementEmployee
                        : categoryNamesLifeInsurance
                    }
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "var(--bg-slate-50)",
                        borderColor: "var(--input-border-color)",
                        zIndex: 9999,
                      }),
                    }}
                  />
                  {getFormErrorMessage(field.name, form.formState.errors)}
                </>
              )}
            />
          </div>
        ) : null}
        {isPrivateCivilRealestate ? (
          <div className="flex-1 bg-white">
            <Controller
              name="accountType"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.longTermAsset.scpiType.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.longTermAsset.scpiType.label`)}
                  </Label>
                  <Select
                    name={field.name}
                    onChange={(option) => field.onChange(option?.value)}
                    value={scpiList.find(
                      (option) => option.value === field.value
                    )}
                    className="w-full bg-slate-50 h-10"
                    options={scpiList}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "var(--bg-slate-50)",
                        borderColor: "var(--input-border-color)",
                      }),
                    }}
                  />
                  {getFormErrorMessage(field.name, form.formState.errors)}
                </>
              )}
            />
          </div>
        ) : !isRetirement ? (
          <div className="flex-1 bg-white">
            <Controller
              name="contractName"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.longTermAsset.contractName.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(
                      isRetirement
                        ? "forms.fields.name"
                        : "forms.fields.wealth.longTermAsset.contractName.label"
                    )}
                  </Label>
                  <FieldText
                    id={field.name}
                    {...field}
                    className="w-full bg-slate-50 h-10"
                    placeholder={
                      t(
                        isRetirement
                          ? "forms.fields.name"
                          : `forms.fields.wealth.longTermAsset.contractName.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, form.formState.errors)}
                </>
              )}
            />
          </div>
        ) : null}
        <div className="flex-1 bg-white">
          <Controller
            name="provider"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.longTermAsset.insuranceCompany.error`
              ) as string,
            }}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(
                    isRetirement || isPrivateCivilRealestate
                      ? "forms.fields.name"
                      : "forms.fields.wealth.longTermAsset.insuranceCompany.label"
                  )}
                </Label>
                <FieldText
                  id={field.name}
                  {...field}
                  className="w-full bg-slate-50 h-10"
                  placeholder={
                    t(
                      isRetirement || isPrivateCivilRealestate
                        ? "forms.fields.name"
                        : `forms.fields.wealth.longTermAsset.insuranceCompany.placeholder`
                    ) || ""
                  }
                />
                {getFormErrorMessage(field.name, form.formState.errors)}
              </>
            )}
          />
        </div>
        <div className="flex-1 bg-white">
          <Controller
            name="accountNumber"
            control={control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.longTermAsset.contractNumber.label`)}
                </Label>
                <FieldText
                  id={field.name}
                  {...field}
                  className="w-full bg-slate-50 h-10"
                  placeholder={
                    t(
                      `forms.fields.wealth.longTermAsset.contractNumber.placeholder`
                    ) || ""
                  }
                />
                {getFormErrorMessage(field.name, form.formState.errors)}
              </>
            )}
          />
        </div>

        {isPrivateCivilRealestate && (
          <div className="flex-1 bg-white">
            <Controller
              name="managementCompany"
              control={control}
              rules={{
                required: t(
                  `forms.fields.wealth.longTermAsset.managementCompany.error`
                ) as string,
              }}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(
                      `forms.fields.wealth.longTermAsset.managementCompany.label`
                    )}
                  </Label>
                  <FieldText
                    id={field.name}
                    {...field}
                    className="w-full bg-slate-50 h-10"
                    placeholder={
                      t(
                        `forms.fields.wealth.longTermAsset.managementCompany.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, form.formState.errors)}
                </>
              )}
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 pr-4">
        {isRetirement || isLifeInsurance ? (
          <div className="basis-1/2 bg-white">
            <Controller
              name="beneficiaryClause"
              control={control}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(
                      `forms.fields.wealth.longTermAsset.beneficiaryClause.label`
                    )}
                  </Label>
                  <FieldText
                    id={field.name}
                    {...field}
                    className="w-full bg-slate-50 h-10"
                    placeholder={
                      t(
                        `forms.fields.wealth.longTermAsset.beneficiaryClause.placeholder`
                      ) || ""
                    }
                  />
                  {getFormErrorMessage(field.name, form.formState.errors)}
                </>
              )}
            />
          </div>
        ) : null}
        <div className="flex-1 bg-white">
          <Controller
            name="date"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.longTermAsset.date.error`
              ) as string,
            }}
            render={({ field }) => (
              <div className="flex flex-col w-32 h-full">
                <Label
                  htmlFor={field.name}
                  className="ml-3 pt-[6px] pb-[2px] font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.longTermAsset.date.label`)}
                </Label>
                <FieldDate
                  id={field.name}
                  {...field}
                  onValueChange={field.onChange}
                  className="border bg-slate-50 w-fit"
                  placeholder={
                    t(`forms.fields.wealth.longTermAsset.date.placeholder`) ||
                    ""
                  }
                />
                {getFormErrorMessage(field.name, form.formState.errors)}
              </div>
            )}
          />
        </div>
      </div>

      <div className="flex">
        {/* Add variableExpenses, percent, fixedExpenses */}
        <div className="mt-3 mr-32">
          <Text
            as="label"
            label={t(`forms.fields.wealth.officeFees`)}
            className="font-bold"
          />
          <div className="flex flex-wrap gap-4">
            <div className="bg-white">
              <Controller
                name="metadata.variableFees.percentage"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.longTermAsset.variableExpenses.error`
                  ) as string,
                  validate: (value) => {
                    return (
                      (value !== null && typeof value === "number") ||
                      t(
                        `forms.fields.wealth.longTermAsset.variableExpenses.error`
                      ) ||
                      ""
                    );
                  },
                }}
                render={({ field }) => (
                  <div className="w-32">
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.longTermAsset.variableExpenses.label`
                      )}
                    </Label>
                    <FieldPercentage
                      id={field.name}
                      {...field}
                      className="w-full bg-slate-50 h-10"
                      placeholder={
                        t(
                          `forms.fields.wealth.longTermAsset.variableExpenses.placeholder`
                        ) || ""
                      }
                    />
                    {displayFormErrorMessage(
                      form.getFieldState(field.name).error
                    )}
                  </div>
                )}
              />
            </div>

            <div className="bg-white">
              <Controller
                name="metadata.variableFees.companyPercentage"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.longTermAsset.percent.error`
                  ) as string,
                  validate: (value) => {
                    return (
                      (value !== null && typeof value === "number") ||
                      t(`forms.fields.wealth.longTermAsset.percent.error`) ||
                      ""
                    );
                  },
                }}
                render={({ field }) => (
                  <div className="w-32">
                    <Label
                      htmlFor={field.name}
                      className="ml-3 mt-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.longTermAsset.percent.label`)}
                    </Label>
                    <FieldPercentage
                      id={field.name}
                      {...field}
                      className="w-full bg-slate-50 h-10"
                    />
                    {displayFormErrorMessage(
                      form.getFieldState(field.name).error
                    )}
                    {!form.getFieldState(field.name).error && (
                      <Label className="ml-3 mt-3 font-medium text-xs text-blue-1000">
                        {t(
                          `forms.fields.wealth.longTermAsset.percent.suffixLabel`
                        )}
                      </Label>
                    )}
                  </div>
                )}
              />
            </div>

            {!isPrivateCivilRealestate && (
              <div className="bg-white">
                <div className="w-32">
                  <Label className="ml-3 mt-3 font-medium text-xs text-blue-1000">
                    {t(
                      `forms.fields.wealth.longTermAsset.totalExpenses.placeholder`
                    )}
                  </Label>
                  <FieldAmount
                    id={"totalVariableFees"}
                    value={variableFeeAmount}
                    className="w-full bg-slate-50 h-10"
                    placeholder="%"
                    contentEditable={false}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white">
              <Controller
                name="metadata.fixedFees"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.longTermAsset.fixedExpenses.error`
                  ) as string,
                  validate: (value) =>
                    value !== null ||
                    (t(
                      `forms.fields.wealth.longTermAsset.fixedExpenses.label`
                    ) as string),
                }}
                render={({ field }) => (
                  <div className="w-32">
                    <Label
                      htmlFor={field.name}
                      className="ml-3 mt-3 font-medium text-xs text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.longTermAsset.fixedExpenses.label`
                      )}
                    </Label>
                    <FieldAmount
                      id={field.name}
                      {...field}
                      value={field.value as number}
                      className="w-full bg-slate-50 h-10"
                      placeholder={
                        t(
                          `forms.fields.wealth.longTermAsset.fixedExpenses.placeholder`
                        ) || ""
                      }
                    />
                    {displayFormErrorMessage(
                      form.getFieldState(field.name).error
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <Text
            as="label"
            label={t(`forms.fields.wealth.contractFeesCompany`)}
            className="font-bold"
          />
          <div className="flex flex-wrap gap-4">
            <div className="bg-white">
              <Controller
                name="metadata.contractVariableFees.percentage"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.longTermAsset.variableExpenses.error`
                  ) as string,
                  validate: (value) => {
                    return (
                      (value !== null && typeof value === "number") ||
                      t(
                        `forms.fields.wealth.longTermAsset.variableExpenses.error`
                      ) ||
                      ""
                    );
                  },
                }}
                render={({ field }) => (
                  <div className="w-32">
                    <Label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.longTermAsset.variableExpenses.label`
                      )}
                    </Label>
                    <FieldPercentage
                      id={field.name}
                      {...field}
                      className="w-full bg-slate-50 h-10"
                      placeholder={
                        t(
                          `forms.fields.wealth.longTermAsset.variableExpenses.placeholder`
                        ) || ""
                      }
                    />
                    {displayFormErrorMessage(
                      form.getFieldState(field.name).error
                    )}
                  </div>
                )}
              />
            </div>

            <div className="bg-white">
              <Controller
                name="metadata.contractVariableFees.companyPercentage"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.longTermAsset.percent.error`
                  ) as string,
                  validate: (value) => {
                    return (
                      (value !== null && typeof value === "number") ||
                      t(`forms.fields.wealth.longTermAsset.percent.error`) ||
                      ""
                    );
                  },
                }}
                render={({ field }) => (
                  <div className="w-32">
                    <Label
                      htmlFor={field.name}
                      className="ml-3 mt-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.wealth.longTermAsset.percent.label`)}
                    </Label>
                    <FieldPercentage
                      id={field.name}
                      {...field}
                      className="w-full bg-slate-50 h-10"
                    />
                    {displayFormErrorMessage(
                      form.getFieldState(field.name).error
                    )}
                  </div>
                )}
              />
              <Label className="ml-3 mt-3 font-medium text-xs text-blue-1000">
                {t(`forms.fields.wealth.longTermAsset.percent.suffixLabel`)}
              </Label>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-white">
              <Controller
                name="metadata.contractFixedFees"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.longTermAsset.fixedExpenses.error`
                  ) as string,
                  validate: (value) =>
                    value !== null ||
                    (t(
                      `forms.fields.wealth.longTermAsset.fixedExpenses.error`
                    ) as string),
                }}
                render={({ field }) => (
                  <div className="w-32">
                    <Label
                      htmlFor={field.name}
                      className="ml-3 mt-3 font-medium text-xs text-blue-1000"
                    >
                      {t(
                        `forms.fields.wealth.longTermAsset.fixedExpenses.label`
                      )}
                    </Label>
                    <FieldAmount
                      id={field.name}
                      {...field}
                      value={field.value as number}
                      className="w-full bg-slate-50 h-10"
                      placeholder={
                        t(
                          `forms.fields.wealth.longTermAsset.fixedExpenses.placeholder`
                        ) || ""
                      }
                    />
                    {displayFormErrorMessage(
                      form.getFieldState(field.name).error
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="bg-white">
          <Controller
            name="value"
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
                  {t(`forms.fields.wealth.longTermAsset.transfersAmount.label`)}
                </Label>
                <FieldAmount
                  id={field.name}
                  {...field}
                  value={field.value as number}
                  className="w-full bg-slate-50 h-10"
                  style={{
                    backgroundColor: "#F3F4F6",
                    background: "#F3F4F6",
                  }}
                  placeholder={
                    t(
                      `forms.fields.wealth.longTermAsset.transfersAmount.placeholder`
                    ) || ""
                  }
                />
                {getFormErrorMessage(field.name, form.formState.errors)}
              </div>
            )}
          />
        </div>

        <div className="bg-white">
          <Controller
            name="scheduledPaymentList"
            control={control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(
                    `forms.fields.wealth.longTermAsset.scheduledPaymentList.label`
                  )}
                </Label>
                <Select
                  name={field.name}
                  value={{
                    value: field.value as string,
                    label: field.value
                      ? (t("forms.fields.cycles." + field.value) as string)
                      : "",
                  }}
                  onChange={(option) => field.onChange(option?.value)}
                  className="w-full bg-slate-50 h-10"
                  menuPlacement="top"
                  options={scheduledPaymentList}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "var(--bg-slate-50)",
                    }),
                  }}
                />
                {getFormErrorMessage(field.name, form.formState.errors)}
              </>
            )}
          />
        </div>
        <div className="bg-white">
          <Controller
            name="scheduledPayment"
            control={control}
            rules={{
              required: t(
                `forms.fields.wealth.longTermAsset.scheduledPayment.error`
              ) as string,
              validate: (value) =>
                value !== null ||
                (t(
                  `forms.fields.wealth.longTermAsset.scheduledPayment.error`
                ) as string),
            }}
            render={({ field }) => (
              <div className="w-60">
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(
                    `forms.fields.wealth.longTermAsset.scheduledPayment.preLabel`
                  )}
                </Label>
                <FieldAmount
                  id={field.name}
                  {...field}
                  className="w-full bg-slate-50 h-10"
                  placeholder={
                    t(
                      `forms.fields.wealth.longTermAsset.scheduledPayment.placeholder`
                    ) || ""
                  }
                />
                {getFormErrorMessage(field.name, form.formState.errors)}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};
