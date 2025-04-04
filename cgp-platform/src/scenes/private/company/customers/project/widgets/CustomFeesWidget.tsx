import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FieldAmount from "../../../../../../UIComponents/FieldAmount/FieldAmount";
import FieldPercentage from "../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { LinkTypes, SimpleCifAddFeesWidget } from "./SimpleCifAddFeesWidget";

interface FeesWidgetProps {
  form: ReturnType<typeof useForm<any>>;
  textAccessor:
    | "cif"
    | "insurance"
    | "arbitrage"
    | "complementary"
    | "redemption";
  feesType: "cif" | "insurance" | "arbitrage" | "complementary" | "redemption";
  transfersAmount: number;
  transferAmountWithoutLiquidity?: number;
  deinvestedAmount?: number;
  useTitle?: boolean;
}
export const CustomFeesWidget: React.FC<FeesWidgetProps> = ({
  form,
  textAccessor,
  feesType,
  transfersAmount,
  transferAmountWithoutLiquidity,
  deinvestedAmount,
  useTitle = true,
}) => {
  const { t } = useTranslation();

  const formValues = form.watch();

  const deleteCustomFees = (index: number) => () => {
    const customFees = form.getValues("customFees");
    customFees.splice(index, 1);
    form.setValue("customFees", customFees);
  };

  return (
    <div className="mb-10">
      {feesType !== "arbitrage" && useTitle && (
        <h1 className="text-[#4761C8] font-bold text-xl mb-4">
          {t("scenes.customers.projects.feesForm.title")}
        </h1>
      )}
      <div className="flex flex-col">
        <div className="grid gap-4 grid-cols-3 bg-blue-800 text-white py-2 px-4 mt-5 mb-7 rounded-xl">
          <div className="flex justify-center items-center">
            {t(`scenes.customers.projects.addProject.totalFees`)}
          </div>
          <div className="flex justify-center items-center">
            {t(`scenes.customers.projects.addProject.contractPart`)}
          </div>
          <div className="flex justify-center items-center">
            {t(`scenes.customers.projects.addProject.companyPart`)}
          </div>
        </div>
        <div className="">
          {Object.keys(formValues.fees).map((fees, index) => (
            <div className="grid gap-4 grid-cols-3 pl-2" key={index}>
              <div className="flex items-center">
                <div className="text-xs ml-8">
                  {t(
                    `scenes.customers.projects.addProject.${textAccessor}.fees.${fees}`
                  )}
                </div>
                <div className="flex ml-auto">
                  <div className="">
                    <Controller
                      name={`fees.${fees}.totalPercentage`}
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
                              const totalAmount =
                                Math.round(
                                  transfersAmount * (value / 100) * 100
                                ) / 100;
                              form.setValue(
                                `fees.${fees}.totalAmount`,
                                totalAmount
                              );
                              form.setValue(
                                `fees.${fees}.contractAmount`,
                                Math.round(
                                  totalAmount *
                                    formValues.fees[fees]?.contractPercentage
                                ) / 100
                              );
                              form.setValue(
                                `fees.${fees}.companyAmount`,
                                Math.round(
                                  totalAmount *
                                    (formValues.fees[fees]?.companyPercentage ??
                                      0)
                                ) / 100
                              );
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="ml-4">
                    <Controller
                      name={`fees.${fees}.totalAmount`}
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
                              const totalPercentage =
                                transfersAmount > 0
                                  ? Math.round(
                                      (value / transfersAmount) * 100 * 100
                                    ) / 100 // 2 decimals precision
                                  : 0;
                              form.setValue(
                                `fees.${fees}.totalPercentage` as const,
                                totalPercentage
                              );
                              form.setValue(
                                `fees.${fees}.contractAmount` as const,
                                Math.round(
                                  value *
                                    (formValues.fees[fees]
                                      ?.contractPercentage ?? 0)
                                ) / 100
                              );
                              form.setValue(
                                `fees.${fees}.companyAmount`,
                                Math.round(
                                  value *
                                    (formValues.fees[fees]?.companyPercentage ??
                                      0)
                                ) / 100
                              );
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center border-l border-r pb-2">
                <div className="">
                  <Controller
                    name={`fees.${fees}.contractPercentage`}
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
                            const contractAmount =
                              Math.round(
                                (formValues.fees[fees]?.totalAmount ?? 0) *
                                  (value / 100) *
                                  100
                              ) / 100;
                            form.setValue(
                              `fees.${fees}.contractAmount`,
                              contractAmount
                            );
                            form.setValue(
                              `fees.${fees}.companyAmount`,
                              Math.round(
                                ((formValues.fees[fees]?.totalAmount ?? 0) -
                                  contractAmount) *
                                  100
                              ) / 100
                            );
                            form.setValue(
                              `fees.${fees}.companyPercentage`,
                              100 - value
                            );
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
                <div className="ml-4">
                  <Controller
                    name={`fees.${fees}.contractAmount`}
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
                            const totalAmount =
                              formValues.fees[fees]?.totalAmount ?? 0;
                            const contractPercentage =
                              totalAmount > 0
                                ? Math.round((value / totalAmount) * 100)
                                : 0;
                            form.setValue(
                              `fees.${fees}.contractPercentage`,
                              contractPercentage
                            );
                            form.setValue(
                              `fees.${fees}.companyAmount`,
                              Math.round(
                                ((formValues.fees[fees]?.totalAmount ?? 0) -
                                  value) *
                                  100
                              ) / 100
                            );
                            form.setValue(
                              `fees.${fees}.companyPercentage`,
                              100 - contractPercentage
                            );
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="">
                  <Controller
                    name={`fees.${fees}.companyPercentage`}
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
                            const companyAmount =
                              Math.round(
                                (formValues.fees[fees]?.totalAmount ?? 0) *
                                  (value / 100) *
                                  100
                              ) / 100;
                            form.setValue(
                              `fees.${fees}.companyAmount`,
                              companyAmount
                            );
                            form.setValue(
                              `fees.${fees}.contractAmount`,
                              Math.round(
                                ((formValues.fees[fees]?.totalAmount ?? 0) -
                                  companyAmount) *
                                  100
                              ) / 100
                            );
                            form.setValue(
                              `fees.${fees}.contractPercentage`,
                              100 - value
                            );
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
                <div className="ml-4">
                  <Controller
                    name={`fees.${fees}.companyAmount`}
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
                            const totalAmount =
                              formValues.fees[fees]?.totalAmount ?? 0;
                            const companyPercentage =
                              totalAmount > 0
                                ? Math.round((value / totalAmount) * 100)
                                : 0;
                            form.setValue(
                              `fees.${fees}.companyPercentage`,
                              companyPercentage
                            );
                            form.setValue(
                              `fees.${fees}.contractAmount`,
                              Math.round(
                                ((formValues.fees[fees]?.totalAmount ?? 0) -
                                  value) *
                                  100
                              ) / 100
                            );
                            form.setValue(
                              `fees.${fees}.contractPercentage`,
                              100 - companyPercentage
                            );
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
          {formValues?.customFees &&
            Object.keys(formValues.customFees).map((index) => (
              <div className="grid gap-4 grid-cols-3 pl-2" key={index}>
                <div className="flex items-center">
                  <div className="flex items-center text-xs">
                    <div
                      className="w-6 h-6 "
                      onClick={deleteCustomFees(index as unknown as number)}
                    >
                      <i
                        className="pi pi-trash cursor-pointer"
                        style={{
                          fontSize: "16px",
                          color: "red",
                          fontWeight: "300",
                        }}
                        data-pr-position="left"
                        data-pr-at="leftcenter"
                        data-pr-my="right center"
                      ></i>
                    </div>
                    <Controller
                      name={`customFees[${index}].label`}
                      control={form.control}
                      render={({ field }) => (
                        <div className="w-48">
                          <div className="ml-2 mr-12 text-xs">
                            <FieldText
                              id={field.name}
                              {...field}
                              value={formValues.customFees[index].label}
                              className="w-full bg-slate-50 h-10"
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex ml-auto">
                    <div className="">
                      <Controller
                        name={`customFees[${index}].totalPercentage`}
                        control={form.control}
                        render={({ field }) => (
                          <div className="w-32">
                            <FieldPercentage
                              id={field.name}
                              {...field}
                              value={
                                formValues.customFees[index].totalPercentage
                              }
                              className="w-full bg-slate-50 h-10"
                              onChange={(value) => {
                                field.onChange(value);
                                const totalAmount =
                                  Math.round(
                                    (feesType === "arbitrage"
                                      ? formValues.customFees[index]
                                          .arbitrationValueType ===
                                        "complementary"
                                        ? transferAmountWithoutLiquidity ?? 0
                                        : formValues.customFees[index]
                                              .arbitrationValueType ===
                                            "desinvest"
                                          ? deinvestedAmount ?? 0
                                          : transfersAmount ?? 0
                                      : transfersAmount) *
                                      (value / 100) *
                                      100
                                  ) / 100;
                                form.setValue(
                                  `customFees[${index}].totalAmount`,
                                  totalAmount
                                );
                                form.setValue(
                                  `customFees[${index}].contractAmount`,
                                  Math.round(
                                    totalAmount *
                                      formValues.customFees[index]
                                        ?.contractPercentage
                                  ) / 100
                                );
                                form.setValue(
                                  `customFees[${index}].companyAmount`,
                                  Math.round(
                                    totalAmount *
                                      (formValues.customFees[index]
                                        ?.companyPercentage ?? 0)
                                  ) / 100
                                );
                              }}
                            />
                          </div>
                        )}
                      />
                    </div>
                    <div className="ml-4">
                      <Controller
                        name={`customFees[${index}].totalAmount`}
                        control={form.control}
                        render={({ field }) => (
                          <div className="w-32">
                            <FieldAmount
                              id={field.name}
                              {...field}
                              value={formValues.customFees[index].totalAmount}
                              className="w-full bg-slate-50 h-10"
                              placeholder={"€"}
                              onChange={(value) => {
                                field.onChange(value);
                                const totalPercentage =
                                  (feesType === "arbitrage"
                                    ? formValues.customFees[index]
                                        .arbitrationValueType ===
                                      "complementary"
                                      ? transferAmountWithoutLiquidity ?? 0
                                      : formValues.customFees[index]
                                            .arbitrationValueType ===
                                          "desinvest"
                                        ? deinvestedAmount ?? 0
                                        : transfersAmount ?? 0
                                    : transfersAmount) > 0
                                    ? Math.round(
                                        (value /
                                          (feesType === "arbitrage"
                                            ? formValues.customFees[index]
                                                .arbitrationValueType ===
                                              "complementary"
                                              ? transferAmountWithoutLiquidity ??
                                                0
                                              : formValues.customFees[index]
                                                    .arbitrationValueType ===
                                                  "desinvest"
                                                ? deinvestedAmount ?? 0
                                                : transfersAmount ?? 0
                                            : transfersAmount)) *
                                          100 *
                                          100
                                      ) / 100 // 2 decimals precision
                                    : 0;
                                form.setValue(
                                  `customFees[${index}].totalPercentage` as const,
                                  totalPercentage
                                );
                                form.setValue(
                                  `customFees[${index}].contractAmount` as const,
                                  Math.round(
                                    value *
                                      (formValues.customFees[index]
                                        ?.contractPercentage ?? 0)
                                  ) / 100
                                );
                                form.setValue(
                                  `customFees[${index}].companyAmount`,
                                  Math.round(
                                    value *
                                      (formValues.customFees[index]
                                        ?.companyPercentage ?? 0)
                                  ) / 100
                                );
                              }}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center border-l border-r pb-2">
                  <div className="">
                    <Controller
                      name={`customFees[${index}].contractPercentage`}
                      control={form.control}
                      render={({ field }) => (
                        <div className="w-32">
                          <FieldPercentage
                            id={field.name}
                            {...field}
                            value={
                              formValues.customFees[index].contractPercentage
                            }
                            className="w-full bg-slate-50 h-10"
                            onChange={(value) => {
                              field.onChange(value);
                              const contractAmount =
                                Math.round(
                                  (formValues.customFees[index]?.totalAmount ??
                                    0) *
                                    (value / 100) *
                                    100
                                ) / 100;
                              form.setValue(
                                `customFees[${index}].contractAmount`,
                                contractAmount
                              );
                              form.setValue(
                                `customFees[${index}].companyAmount`,
                                Math.round(
                                  ((formValues.customFees[index]?.totalAmount ??
                                    0) -
                                    contractAmount) *
                                    100
                                ) / 100
                              );
                              form.setValue(
                                `customFees[${index}].companyPercentage`,
                                100 - value
                              );
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="ml-4">
                    <Controller
                      name={`customFees[${index}].contractAmount`}
                      control={form.control}
                      render={({ field }) => (
                        <div className="w-32">
                          <FieldAmount
                            id={field.name}
                            {...field}
                            value={formValues.customFees[index].contractAmount}
                            className="w-full bg-slate-50 h-10"
                            placeholder={"€"}
                            onChange={(value) => {
                              field.onChange(value);
                              const totalAmount =
                                formValues.customFees[index]?.totalAmount ?? 0;
                              const contractPercentage =
                                totalAmount > 0
                                  ? Math.round((value / totalAmount) * 100)
                                  : 0;
                              form.setValue(
                                `customFees[${index}].contractPercentage`,
                                contractPercentage
                              );
                              form.setValue(
                                `customFees[${index}].companyAmount`,
                                Math.round(
                                  ((formValues.customFees[index]?.totalAmount ??
                                    0) -
                                    value) *
                                    100
                                ) / 100
                              );
                              form.setValue(
                                `customFees[${index}].companyPercentage`,
                                100 - contractPercentage
                              );
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="">
                    <Controller
                      name={`customFees[${index}].companyPercentage`}
                      control={form.control}
                      render={({ field }) => (
                        <div className="w-32">
                          <FieldPercentage
                            id={field.name}
                            {...field}
                            value={
                              formValues.customFees[index].companyPercentage
                            }
                            className="w-full bg-slate-50 h-10"
                            onChange={(value) => {
                              field.onChange(value);
                              const companyAmount =
                                Math.round(
                                  (formValues.customFees[index]?.totalAmount ??
                                    0) *
                                    (value / 100) *
                                    100
                                ) / 100;
                              form.setValue(
                                `customFees[${index}].companyAmount`,
                                companyAmount
                              );
                              form.setValue(
                                `customFees[${index}].contractAmount`,
                                Math.round(
                                  ((formValues.customFees[index]?.totalAmount ??
                                    0) -
                                    companyAmount) *
                                    100
                                ) / 100
                              );
                              form.setValue(
                                `customFees[${index}].contractPercentage`,
                                100 - value
                              );
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="ml-4">
                    <Controller
                      name={`customFees[${index}].companyAmount`}
                      control={form.control}
                      render={({ field }) => (
                        <div className="w-32">
                          <FieldAmount
                            id={field.name}
                            {...field}
                            value={formValues.customFees[index].companyAmount}
                            className="w-full bg-slate-50 h-10"
                            placeholder={"€"}
                            onChange={(value) => {
                              field.onChange(value);
                              const totalAmount =
                                formValues.customFees[index]?.totalAmount ?? 0;
                              const companyPercentage =
                                totalAmount > 0
                                  ? Math.round((value / totalAmount) * 100)
                                  : 0;
                              form.setValue(
                                `customFees[${index}].companyPercentage`,
                                companyPercentage
                              );
                              form.setValue(
                                `customFees[${index}].contractAmount`,
                                Math.round(
                                  ((formValues.customFees[index]?.totalAmount ??
                                    0) -
                                    value) *
                                    100
                                ) / 100
                              );
                              form.setValue(
                                `customFees[${index}].contractPercentage`,
                                100 - companyPercentage
                              );
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          {formValues.customFees && (
            <SimpleCifAddFeesWidget
              form={form}
              linkType={LinkTypes.servicesFees}
              i18nKey="title"
              type={
                feesType === "redemption"
                  ? "redemption"
                  : feesType === "arbitrage"
                    ? "insuranceArbitration"
                    : "insurance"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};
