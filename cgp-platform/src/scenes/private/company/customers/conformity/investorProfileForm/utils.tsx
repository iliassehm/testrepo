import { t } from "i18next";
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormReturn,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  InstrumentsSchemaKeys,
  InvestorProfileFormInputs,
} from "../../../../../../../shared/schemas/investorProfileFormSchema";
import { Text } from "../../../../../../components";
import { Info } from "../../../../../../components/info";
import { Label } from "../../../../../../components/Label";
import { clsx } from "../../../../../../helpers";

interface RadioOrCheckboxProps {
  name: string;
  label: string;
  type: "radio" | "checkbox";
  align?: "vertical" | "horizontal";
  subTitle?: string;
  value?: string;
  className?: string;
  defaultValue?: number;
  disabled?: boolean;
  register: UseFormRegister<InvestorProfileFormInputs>;
  submitOnValueChange?: () => void;
}

export interface InvestorProfileListItem {
  value: string;
  subTitle?: boolean;
}
export interface InvestorProfileListGraphqItem extends InvestorProfileListItem {
  icon?: string;
  hasTitle?: boolean;
  description?: boolean;
}
interface RadioWithCheckboxProps
  extends Pick<RadioOrCheckboxProps, "name" | "value" | "register" | "align"> {
  list: InvestorProfileListItem[];
  i18nKey: string;
  subTitle?: boolean;
  checkbable?: boolean;
  info?: string;
  submitOnValueChange?: () => void;
}

interface Radio2ImagesProps
  extends Pick<RadioOrCheckboxProps, "name" | "value" | "register" | "align"> {
  data: InvestorProfileListItem[];
  i18nKey: string;
  color1: string;
  color2: string;
  imageSrc1: string;
  imageSrc2: string;
  subTitle?: boolean;
  checkbable?: boolean;
  submitOnValueChange?: () => void;
}

interface ListWrapperProps {
  i18nKey: string;
  children: React.ReactNode;
  info?: string;
}

export function Table({
  register,
  control,
  list,
  name,
  submitOnValueChange,
}: {
  register: UseFormReturn<InvestorProfileFormInputs>["register"];
  control: Control<InvestorProfileFormInputs>;
  list: InstrumentsSchemaKeys[];
  name: string;
  submitOnValueChange?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div>
      <table className="min-w-full bg-white border-collapse border border-gray-200">
        <thead>
          <tr>
            <th
              className="py-2 px-4 border border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600"
              rowSpan={2}
            >
              {t(
                `scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.financialInstrumentsProduced.title`
              )}
            </th>
            <th
              className="py-2 px-4 border border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600"
              rowSpan={2}
            >
              {t(
                `scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.knowledge`
              )}
            </th>
            <th
              className="py-2 px-4 border border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600"
              rowSpan={2}
            >
              {t(
                `scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.capitalLossRisk`
              )}
            </th>
            <th
              className="py-2 px-4 border border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600"
              rowSpan={2}
            >
              {t(
                `scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.holdingPeriod`
              )}
            </th>

            <th
              className="py-2 px-4 border border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600"
              colSpan={3}
            >
              {t(
                `scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.transactionsLast12Months.title`
              )}
            </th>
            <th
              className="py-2 px-4 border border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600"
              colSpan={3}
            >
              {t(
                `scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.investmentsLast12MonthsAmount.title`
              )}
            </th>
          </tr>
          <tr>
            <th className="py-2 px-4 border border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">
              {t(
                `scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.transactionsLast12Months.1`
              )}
            </th>
            <th className="py-2 px-4 border border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">
              {t(
                `scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.transactionsLast12Months.2`
              )}
            </th>
            <th className="py-2 px-4 border border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">
              {t(
                `scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.transactionsLast12Months.3`
              )}
            </th>

            <th className="py-2 px-4 border border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">
              {t(
                `scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.investmentsLast12MonthsAmount.1`
              )}
            </th>
            <th className="py-2 px-4 border border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">
              {t(
                `scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.investmentsLast12MonthsAmount.2`
              )}
            </th>
            <th className="py-2 px-4 border border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">
              {t(
                `scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.investmentsLast12MonthsAmount.3`
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={`${name}-${item}`}>
              <td className="py-2 px-4 border border-gray-200">
                {t(
                  `scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.financialInstrumentsProduced.${index + 1}`
                )}
              </td>

              <td className="py-2 px-4 border border-gray-200 text-center align-middle">
                <label className="flex justify-between items-center">
                  {t(
                    "scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.knowledgetOptions.none"
                  )}
                  <input
                    type="radio"
                    id={`${item}.knowledgeActivityInFinancialProductsInstruments.${index}.KNOWLEDGE`}
                    data-testid={`${item}.knowledgeActivityInFinancialProductsInstruments.${index}.KNOWLEDGE.none`}
                    value="none"
                    {...register(
                      `financialKnowledgeAndExperience.instruments.${item}.knowledge`
                    )}
                    onChange={(e) => {
                      register(
                        `financialKnowledgeAndExperience.instruments.${item}.knowledge`
                      )?.onChange(e);
                      submitOnValueChange?.();
                    }}
                  />
                </label>
                <label className="flex justify-between items-center">
                  {t(
                    "scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.knowledgetOptions.basic"
                  )}
                  <input
                    type="radio"
                    id={`${item}.knowledgeActivityInFinancialProductsInstruments.${index}.KNOWLEDGE`}
                    data-testid={`${item}.knowledgeActivityInFinancialProductsInstruments.${index}.KNOWLEDGE.basic`}
                    value="basic"
                    {...register(
                      `financialKnowledgeAndExperience.instruments.${item}.knowledge`
                    )}
                    onChange={(e) => {
                      register(
                        `financialKnowledgeAndExperience.instruments.${item}.knowledge`
                      )?.onChange(e);
                      submitOnValueChange?.();
                    }}
                  />
                </label>
                <label className="flex justify-between items-center">
                  {t(
                    "scenes.customers.conformity.investorProfile.form.financialKnowledgeAndExperience.financeKnowledgeAndActivity.knowledgetOptions.good"
                  )}
                  <input
                    type="radio"
                    id={`${item}.knowledgeActivityInFinancialProductsInstruments.${index}.KNOWLEDGE`}
                    data-testid={`${item}.knowledgeActivityInFinancialProductsInstruments.${index}.KNOWLEDGE.good`}
                    value="good"
                    {...register(
                      `financialKnowledgeAndExperience.instruments.${item}.knowledge`
                    )}
                    onChange={(e) => {
                      register(
                        `financialKnowledgeAndExperience.instruments.${item}.knowledge`
                      )?.onChange(e);
                      submitOnValueChange?.();
                    }}
                  />
                </label>
              </td>
              <Controller
                control={control}
                name={`financialKnowledgeAndExperience.instruments.${item}.knowledgeActivityInFinancialProductsInstruments`}
                render={({ field }) => {
                  const fieldValues = (field.value as string[]) ?? [];

                  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = e.target.value;
                    if (e.target.checked) {
                      field.onChange([...fieldValues, newValue]);
                    } else {
                      field.onChange(
                        fieldValues.filter((val: string) => val !== newValue)
                      );
                    }
                    submitOnValueChange?.();
                  };

                  return (
                    <>
                      <td className="py-2 px-4 border border-gray-200 text-center align-middle">
                        <input
                          type="checkbox"
                          id={`${item}.knowledgeActivityInFinancialProductsInstruments.${index}.RISK_CAPITAL_LOSS`}
                          data-testid={`${item}.knowledgeActivityInFinancialProductsInstruments.${index}.RISK_CAPITAL_LOSS`}
                          value="RISK_CAPITAL_LOSS"
                          checked={fieldValues.includes("RISK_CAPITAL_LOSS")}
                          onChange={onChange}
                        />
                      </td>
                      <td className="py-2 px-4 border border-gray-200 text-center align-middle">
                        <input
                          type="checkbox"
                          id={`${item}.knowledgeActivityInFinancialProductsInstruments.${index}.HOLDINGS`}
                          data-testid={`${item}.knowledgeActivityInFinancialProductsInstruments.${index}.HOLDINGS`}
                          checked={fieldValues.includes("HOLDINGS")}
                          value="HOLDINGS"
                          onChange={onChange}
                        />
                      </td>
                    </>
                  );
                }}
              />

              <td className="py-2 px-4 border border-gray-200 text-center align-middle">
                <input
                  type="radio"
                  id={`${item}.transactionsNumberLast12Months.${index}.LESS_3`}
                  data-testid={`${item}.transactionsNumberLast12Months.${index}.LESS_3`}
                  value="LESS_3"
                  {...register(
                    `financialKnowledgeAndExperience.instruments.${item}.transactionsNumberLast12Months`
                  )}
                  onChange={(e) => {
                    register(
                      `financialKnowledgeAndExperience.instruments.${item}.transactionsNumberLast12Months`
                    )?.onChange(e);
                    submitOnValueChange?.();
                  }}
                />
              </td>
              <td className="py-2 px-4 border border-gray-200 text-center align-middle">
                <input
                  type="radio"
                  id={`${item}.transactionsNumberLast12Months.${index}.BETWEEN_3_12`}
                  data-testid={`${item}.transactionsNumberLast12Months.${index}.BETWEEN_3_12`}
                  value="BETWEEN_3_12"
                  {...register(
                    `financialKnowledgeAndExperience.instruments.${item}.transactionsNumberLast12Months`
                  )}
                  onChange={(e) => {
                    register(
                      `financialKnowledgeAndExperience.instruments.${item}.transactionsNumberLast12Months`
                    )?.onChange(e);
                    submitOnValueChange?.();
                  }}
                />
              </td>
              <td className="py-2 px-4 border border-gray-200 text-center align-middle">
                <input
                  type="radio"
                  id={`${item}.transactionsNumberLast12Months.${index}.MORE_12`}
                  data-testid={`${item}.transactionsNumberLast12Months.${index}.MORE_12`}
                  value="MORE_12"
                  {...register(
                    `financialKnowledgeAndExperience.instruments.${item}.transactionsNumberLast12Months`
                  )}
                  onChange={(e) => {
                    register(
                      `financialKnowledgeAndExperience.instruments.${item}.transactionsNumberLast12Months`
                    )?.onChange(e);
                    submitOnValueChange?.();
                  }}
                />
              </td>

              <td className="py-2 px-4 border border-gray-200 text-center align-middle">
                <input
                  type="radio"
                  id={`${item}.investmentsAmountMadeLast12Months.${index}.LESS_1000`}
                  data-testid={`${item}.investmentsAmountMadeLast12Months.${index}.LESS_1000`}
                  value="LESS_1000"
                  {...register(
                    `financialKnowledgeAndExperience.instruments.${item}.investmentsAmountMadeLast12Months`
                  )}
                  onChange={(e) => {
                    register(
                      `financialKnowledgeAndExperience.instruments.${item}.investmentsAmountMadeLast12Months`
                    )?.onChange(e);
                    submitOnValueChange?.();
                  }}
                />
              </td>
              <td className="py-2 px-4 border border-gray-200 text-center align-middle">
                <input
                  type="radio"
                  id={`${item}.investmentsAmountMadeLast12Months.${index}.BETWEEN_1000_10000`}
                  data-testid={`${item}.investmentsAmountMadeLast12Months.${index}.BETWEEN_1000_10000`}
                  value="BETWEEN_1000_10000"
                  {...register(
                    `financialKnowledgeAndExperience.instruments.${item}.investmentsAmountMadeLast12Months`
                  )}
                  onChange={(e) => {
                    register(
                      `financialKnowledgeAndExperience.instruments.${item}.investmentsAmountMadeLast12Months`
                    )?.onChange(e);
                    submitOnValueChange?.();
                  }}
                />
              </td>
              <td className="py-2 px-4 border border-gray-200 text-center align-middle">
                <input
                  type="radio"
                  id={`${item}.investmentsAmountMadeLast12Months.${index}.MORE_10000`}
                  data-testid={`${item}.investmentsAmountMadeLast12Months.${index}.MORE_10000`}
                  value="MORE_10000"
                  {...register(
                    `financialKnowledgeAndExperience.instruments.${item}.investmentsAmountMadeLast12Months`
                  )}
                  onChange={(e) => {
                    register(
                      `financialKnowledgeAndExperience.instruments.${item}.investmentsAmountMadeLast12Months`
                    )?.onChange(e);
                    submitOnValueChange?.();
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RadioListGraph({
  name,
  list,
  i18nKey,
  register,
  submitOnValueChange,
}: Omit<RadioWithCheckboxProps, "value">) {
  const colors = [
    "#fb544b",
    "#ff8d06",
    "#fff078",
    "#259c34",
    "#06e5ff",
    "#4861c8",
    "#ff6dc2",
  ];

  return (
    <ListWrapper i18nKey={i18nKey}>
      <img src="/images/investorProfileForm/GraphLines.png" />
      {list.map((item, index) => {
        return (
          <div
            key={`${name}-${index}`}
            className="flex items-center gap-2 vertical"
          >
            <input
              type="radio"
              id={`${name}-CurveRadio${index}`}
              data-testid={`${name}-CurveRadio${index}`}
              value={item.value}
              {...register(name as keyof InvestorProfileFormInputs)}
              onChange={(e) => {
                register(name as keyof InvestorProfileFormInputs)?.onChange(e);
                submitOnValueChange?.();
              }}
            />
            <div>
              <Label
                id={`${name}-CurveRadio${index}`}
                label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.curve${index + 1}`}
                className={`font-bold text-investorProfileForm-curve${index + 1}`}
                style={{ color: colors[index] }}
              />
              <Label
                id={`${name}-CurveRadio${index}`}
                label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.${index + 1}`}
              />
            </div>
          </div>
        );
      })}
    </ListWrapper>
  );
}

export function Radio2Images({
  name,
  data,
  color1,
  color2,
  imageSrc1,
  imageSrc2,
  i18nKey,
  register,
  submitOnValueChange,
  ...props
}: Omit<Radio2ImagesProps, "value">) {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <div className="mb-6">
        <Text
          className="text-base mb-2 bg-grey-400 pl-5"
          label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.title`}
        />
      </div>
      <div className="flex justify-between items-center gap-10 ml-5 mr-5 align-middle">
        <div className="flex-1 flex-col justify-center">
          <div className="flex justify-center items-center gap-2 mb-4 vertical">
            <input
              type="radio"
              id={`${name}-Radio1`}
              data-testid={`${name}-Radio1`}
              value={data[0].value}
              {...register(name as keyof InvestorProfileFormInputs)}
              onChange={(e) => {
                register(name as keyof InvestorProfileFormInputs)?.onChange(e);
                submitOnValueChange?.();
              }}
            />
            <div>
              <Label
                id={`${name}-Radio1`}
                label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.1`}
              />
              <Label
                id={`${name}-Radio1`}
                label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.value1`}
                className={`font-bold text-investorProfileForm-investment15000Over10YearsBlue`}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <img src={imageSrc1} className="w-64 h-64 object-cover" />
          </div>
        </div>

        <div className="flex-1 flex-col justify-center">
          <div className="flex justify-center items-center gap-2 mb-4 vertical">
            <input
              type="radio"
              id={`${name}-Radio2`}
              value={data[1].value}
              {...register(name as keyof InvestorProfileFormInputs)}
              onChange={(e) => {
                register(name as keyof InvestorProfileFormInputs)?.onChange(e);
                submitOnValueChange?.();
              }}
            />
            <div>
              <Label
                id={`${name}-Radio2`}
                label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.2`}
              />
              <Label
                id={`${name}-Radio2`}
                label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.value2`}
                className={`font-bold text-investorProfileForm-${color1}`}
              />
              <Label
                id={`${name}-Radio2`}
                label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.3`}
              />
              <Label
                id={`${name}-Radio2`}
                label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.value3`}
                className={`font-bold text-investorProfileForm-${color2}`}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <img src={imageSrc2} className="w-64 h-64 object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Lists
function ListWrapper({ i18nKey, children, info }: ListWrapperProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-2">
        <Text
          label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.title`}
          className="mb-2 bg-grey-400 pl-5"
        />
        {info && (
          <Info
            text={t(
              `scenes.customers.conformity.investorProfile.form.${i18nKey}.info`
            )}
            vertical="top"
          />
        )}
      </div>
      <div className="pl-5">{children}</div>
    </div>
  );
}
export function RadioList({
  name,
  list,
  i18nKey,
  info,
  register,
  submitOnValueChange,
  ...props
}: Omit<RadioWithCheckboxProps, "value">) {
  return (
    <ListWrapper i18nKey={i18nKey} info={info}>
      {list.map((item, index) => (
        <InputElement
          key={`${item.value}-${index}`}
          type="radio"
          name={name as keyof InvestorProfileFormInputs}
          value={item.value}
          subTitle={
            item.subTitle
              ? `scenes.customers.conformity.investorProfile.form.${i18nKey}.subTitle`
              : undefined
          }
          register={register}
          align={props.align}
          label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.${
            index + 1
          }`}
          submitOnValueChange={submitOnValueChange}
        />
      ))}
    </ListWrapper>
  );
}

export function CheckBoxListV1({
  data,
  i18nKey,
  register,
  ...props
}: {
  data: Record<string, string>;
  register: UseFormRegister<InvestorProfileFormInputs>;
  i18nKey: string;
  align?: RadioOrCheckboxProps["align"];
}) {
  return (
    <ListWrapper i18nKey={i18nKey}>
      {Object.entries(data).map(([key, value], index) => (
        <InputElement
          type="checkbox"
          key={`${key}-${index}`}
          value={value}
          name={key as keyof InvestorProfileFormInputs}
          register={register}
          label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.${
            index + 1
          }`}
          {...props}
        />
      ))}
    </ListWrapper>
  );
}

export function CheckBoxList({
  name,
  data,
  i18nKey,
  control,
  align,
  className,
  submitOnValueChange,
}: {
  name?: string;
  data: Record<string, string>;
  register: UseFormRegister<InvestorProfileFormInputs>;
  control: Control<InvestorProfileFormInputs>;
  i18nKey: string;
  className?: string;
  align?: RadioOrCheckboxProps["align"];
  submitOnValueChange?: () => void;
}) {
  return (
    <ListWrapper i18nKey={i18nKey}>
      <Controller
        control={control}
        name={name as keyof InvestorProfileFormInputs}
        render={({ field }) => {
          return (
            <div>
              {Object.entries(data).map(([key, value], index) => {
                const fieldValues = (field.value as string[]) ?? [];
                const isChecked = fieldValues.includes?.(value);
                const id = `${key}-${index}`;

                return (
                  <div
                    key={`${key}-${index}`}
                    className={clsx(
                      "flex gap-2",
                      align === "vertical" && "items-center",
                      className
                    )}
                  >
                    <input
                      type="checkbox"
                      value={value}
                      checked={isChecked}
                      id={id}
                      data-testid={id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...fieldValues, value]);
                        } else {
                          field.onChange(
                            fieldValues.filter((val: string) => val !== value)
                          );
                        }
                        submitOnValueChange?.();
                      }}
                    />
                    <div>
                      <Label
                        id={id}
                        label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.${
                          index + 1
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }}
      />
    </ListWrapper>
  );
}

function InputElement({
  name,
  type,
  label,
  align = "vertical",
  value,
  subTitle,
  disabled,
  className,
  register,
  submitOnValueChange,
}: RadioOrCheckboxProps) {
  const id = `${name}-${value}`;

  return (
    <div
      className={clsx(
        "flex gap-2",
        align === "vertical" && "items-center",
        className
      )}
    >
      <input
        type={type}
        id={id}
        data-testid={id}
        value={value}
        {...register(name as keyof InvestorProfileFormInputs, {
          disabled,
        })}
        onChange={(e) => {
          register(name as keyof InvestorProfileFormInputs)?.onChange(e);
          submitOnValueChange?.();
        }}
      />
      <div>
        <Label id={id} label={label} subTitle={subTitle} />
      </div>
    </div>
  );
}

// Elements
export function RadioWithCheckbox({
  name,
  list,
  value,
  subTitle,
  checkbable = true,
  i18nKey = "q3a.3",
  register,
  ...props
}: RadioWithCheckboxProps) {
  const _label = `scenes.customers.conformity.investorProfile.form.${i18nKey}.check`;
  const _subTitle = subTitle
    ? `scenes.customers.conformity.investorProfile.form.${i18nKey}.subTitle`
    : undefined;

  return (
    <div
      className={clsx(
        "mb-2",
        props.align === "horizontal" &&
          "flex flex-col md:flex-row md:justify-between mb-2 md:mb-0"
      )}
    >
      {checkbable ? (
        <InputElement
          type="checkbox"
          value={value}
          name={`${name}Check` as keyof InvestorProfileFormInputs}
          register={register}
          subTitle={_subTitle}
          label={_label}
        />
      ) : (
        <Label label={_label} subTitle={_subTitle} />
      )}
      <div
        className={clsx(
          "ml-4 flex flex-col gap-2 px-2",
          checkbable && "bg-gray-50",
          props.align === "horizontal" && "flex-row items-center"
        )}
      >
        {list.map((item, index) => (
          <InputElement
            key={`${item.value}-${index}`}
            type="radio"
            name={name}
            value={item.value}
            subTitle={
              item.subTitle
                ? `scenes.customers.conformity.investorProfile.form.${i18nKey}.subTitle`
                : undefined
            }
            register={register}
            label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.${
              index + 1
            }`}
            {...props}
          />
        ))}
      </div>
    </div>
  );
}

export function RadioWithCheckboxList({
  data,
  i18nKey,
  checkbable = true,
  register,
  ...props
}: {
  data: {
    key: string;
    list: {
      subTitle?: boolean;
      list: InvestorProfileListItem[];
    }[];
  };
  register: UseFormRegister<InvestorProfileFormInputs>;
  i18nKey: string;
  align?: RadioOrCheckboxProps["align"];
  checkbable?: boolean;
}) {
  return (
    <ListWrapper i18nKey={i18nKey}>
      {data.list.map(({ list, subTitle }, index) => {
        const key = `${data.key}.${index + 1}`;

        return (
          <RadioWithCheckbox
            key={key}
            checkbable={checkbable}
            subTitle={subTitle}
            name={key as keyof InvestorProfileFormInputs}
            list={list}
            register={register}
            i18nKey={key}
            {...props}
          />
        );
      })}
    </ListWrapper>
  );
}

export function RadioWithGraph({
  name,
  list,
  i18nKey,
  register,
  ...props
}: Omit<RadioWithCheckboxProps, "value" | "list"> & {
  list: InvestorProfileListGraphqItem[];
}) {
  return (
    <ListWrapper i18nKey={i18nKey}>
      <div className="flex items-stretch">
        {list.map((item, index) => (
          <Item key={`${item.value}-${item}`} item={item} index={index + 1} />
        ))}
      </div>
    </ListWrapper>
  );

  function Item({
    item,
    index,
  }: {
    index: number;
    item: InvestorProfileListGraphqItem;
  }) {
    return (
      <div key={index} className="flex flex-1 flex-col justify-between ">
        {!!item.hasTitle && (
          <Text
            className="px-2 text-center"
            label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.${index}.title`}
          />
        )}
        <div>
          <img src={item.icon} className="mb-4 block" />
          {item.description && (
            <Label
              label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.${index}.description`}
            />
          )}
          <InputElement
            type="radio"
            name={name}
            value={item.value}
            subTitle={
              item.subTitle
                ? `scenes.customers.conformity.investorProfile.form.${i18nKey}.subTitle`
                : undefined
            }
            register={register}
            align={props.align}
            label={`scenes.customers.conformity.investorProfile.form.${i18nKey}.${index}.label`}
          />
        </div>
      </div>
    );
  }
}

type DataType = InvestorProfileFormInputs;

export function calcInvestorProfileStats(data?: DataType): number[] {
  const results: number[] = [];
  for (let i = 1; i <= 6; i++) results.push(0);

  return results;
}
