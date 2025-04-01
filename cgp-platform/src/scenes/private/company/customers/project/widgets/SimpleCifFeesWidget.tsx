import { Tooltip } from "primereact/tooltip";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FieldAmount from "../../../../../../UIComponents/FieldAmount/FieldAmount";
import FieldPercentage from "../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { LinkTypes, SimpleCifAddFeesWidget } from "./SimpleCifAddFeesWidget";

interface FeesWidgetProps {
  form: ReturnType<typeof useForm<any>>;
  transfersAmount?: number;
  desinvestAmount?: number;
  transfersAmountWithoutDesinvest?: number;
  arbitrage?: boolean;
}
export const SimpleCifFeesWidget: React.FC<FeesWidgetProps> = ({
  form,
  transfersAmount,
  desinvestAmount,
  transfersAmountWithoutDesinvest,
  arbitrage,
}) => {
  const { t } = useTranslation();

  const arbitrationFeesDependsOnDesinvest = ["arbitration"];
  const arbitrationFeesDependsOnTransfersAmountWithoutDesinvest = [
    "opening",
    "brokerage",
  ];

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

  const arbitrationEnterFeesValue = [
    "opening",
    "arbitration",
    "advice",
    "followingAdvice",
    "brokerage",
    "exchange",
    "enterRight",
  ];

  const arbitrationVariableFeesValue = [
    "transfer",
    "closing",
    "custodialRight",
    "accountManagement",
    "inactivity",
    "managementAssignments",
    "surperformance",
  ];

  const formValues = form.watch();

  const evolutionValues = form.watch("evolution");
  function updateEvolutionValues() {
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
          (transfersAmount ?? formValues.amount) *
            (evolutionValues[year].evolutionPercentage / 100) *
            100
        ) / 100
      );
    });
  }

  function UpdateValues() {
    Object.keys(formValues.fees.services).forEach((service) => {
      form.setValue(
        `fees.services.${service}.amount`,
        Math.round(
          (arbitrage
            ? arbitrationFeesDependsOnDesinvest.includes(service)
              ? desinvestAmount ?? 0
              : arbitrationFeesDependsOnTransfersAmountWithoutDesinvest.includes(
                    service
                  )
                ? transfersAmountWithoutDesinvest ?? 0
                : transfersAmount
            : transfersAmount ?? formValues.amount) *
            (formValues.fees.services[service].percentage / 100) *
            100
        ) / 100
      );
    });

    Object.keys(formValues.fees.customFees).forEach((index) => {
      form.setValue(
        `fees.customFees.${index}.amount`,
        Math.round(
          (arbitrage
            ? formValues.fees.customFees[index].arbitrationValueType ===
              "desinvest"
              ? desinvestAmount
              : formValues.fees.customFees[index].arbitrationValueType ===
                  "both"
                ? transfersAmount
                : transfersAmountWithoutDesinvest
            : transfersAmount ?? formValues.amount) *
            (formValues.fees.customFees[index].percentage / 100) *
            100
        ) / 100
      );
    });

    Object.keys(formValues.fees.tiers).forEach((tier) => {
      form.setValue(
        `fees.tiers.${tier}.amount`,
        Math.round(
          (arbitrage
            ? arbitrationFeesDependsOnDesinvest.includes(tier)
              ? desinvestAmount ?? 0
              : arbitrationFeesDependsOnTransfersAmountWithoutDesinvest.includes(
                    tier
                  )
                ? transfersAmountWithoutDesinvest ?? 0
                : transfersAmount
            : transfersAmount ?? formValues.amount) *
            ((formValues.fees.tiers[tier]?.percentage ?? 0) / 100) *
            100
        ) / 100
      );
    });
    Object.keys(formValues.fees.products).forEach((product) => {
      form.setValue(
        `fees.products.${product}.amount`,
        Math.round(
          (product === "enterRight"
            ? (transfersAmount ?? formValues.amount) -
              GetFixedFeesWithoutEnterRight()
            : arbitrage
              ? arbitrationFeesDependsOnDesinvest.includes(product)
                ? desinvestAmount ?? 0
                : arbitrationFeesDependsOnTransfersAmountWithoutDesinvest.includes(
                      product
                    )
                  ? transfersAmountWithoutDesinvest ?? 0
                  : transfersAmount
              : transfersAmount ?? formValues.amount) *
            (formValues.fees.products[product].percentage / 100) *
            100
        ) / 100
      );
    });
  }

  function GetFixedFeesWithoutEnterRight() {
    let fixedFees = 0;
    Object.keys(formValues.fees.services).forEach((service) => {
      if (
        service !== "enterRight" &&
        ((arbitrage && arbitrationEnterFeesValue.includes(service)) ||
          (!arbitrage && enterFeesValue.includes(service)))
      )
        fixedFees += formValues.fees.services[service].amount;
    });
    Object.keys(formValues.fees.customFees).forEach((index) => {
      if (formValues.fees.customFees[index].feesType === "enter")
        fixedFees += formValues.fees.customFees[index]?.amount ?? 0;
    });
    Object.keys(formValues.fees.products).forEach((product) => {
      if (
        product !== "enterRight" &&
        ((arbitrage && arbitrationEnterFeesValue.includes(product)) ||
          (!arbitrage && enterFeesValue.includes(product)))
      )
        fixedFees += formValues.fees.products[product].amount;
    });
    return fixedFees;
  }

  function UpdateTotalValues() {
    let enterAmount = 0;
    let variableAmount = 0;

    let enterPercent = 0;
    let variablePercent = 0;

    let percent = 0;
    let amount = 0;

    Object.keys(formValues.fees.services).forEach((service) => {
      percent +=
        formValues.fees.services[
          service as keyof typeof formValues.fees.services
        ]?.percentage ?? 0;
      amount +=
        formValues.fees.services[
          service as keyof typeof formValues.fees.services
        ]?.amount ?? 0;

      if (
        arbitrage
          ? arbitrationEnterFeesValue.includes(service)
          : enterFeesValue.includes(service)
      ) {
        enterAmount +=
          formValues.fees.services[
            service as keyof typeof formValues.fees.services
          ]?.amount ?? 0;
        enterPercent +=
          formValues.fees.services[
            service as keyof typeof formValues.fees.services
          ]?.percentage ?? 0;
      }

      if (
        arbitrage
          ? arbitrationVariableFeesValue.includes(service)
          : variableFeesValue.includes(service)
      ) {
        variableAmount +=
          formValues.fees.services[
            service as keyof typeof formValues.fees.services
          ]?.amount ?? 0;
        variablePercent +=
          formValues.fees.services[
            service as keyof typeof formValues.fees.services
          ]?.percentage ?? 0;
      }
    });

    Object.keys(formValues.fees.customFees).forEach((index) => {
      percent += formValues.fees.customFees[index]?.percentage ?? 0;
      amount += formValues.fees.customFees[index]?.amount ?? 0;

      if (formValues.fees.customFees[index]?.feesType === "enter") {
        enterAmount += formValues.fees.customFees[index]?.amount ?? 0;
        enterPercent += formValues.fees.customFees[index]?.percentage ?? 0;
      } else {
        variableAmount += formValues.fees.customFees[index]?.amount ?? 0;
        variablePercent += formValues.fees.customFees[index]?.percentage ?? 0;
      }
    });

    Object.keys(formValues.fees.products).forEach((product) => {
      percent +=
        formValues.fees.products[
          product as keyof typeof formValues.fees.products
        ]?.percentage ?? 0;
      amount +=
        formValues.fees.products[
          product as keyof typeof formValues.fees.products
        ]?.amount ?? 0;

      if (
        arbitrage
          ? arbitrationEnterFeesValue.includes(product)
          : enterFeesValue.includes(product)
      ) {
        enterAmount +=
          formValues.fees.products[
            product as keyof typeof formValues.fees.products
          ]?.amount ?? 0;
        enterPercent +=
          formValues.fees.products[
            product as keyof typeof formValues.fees.products
          ]?.percentage ?? 0;
      }

      if (
        arbitrage
          ? arbitrationVariableFeesValue.includes(product)
          : variableFeesValue.includes(product)
      ) {
        variableAmount +=
          formValues.fees.products[
            product as keyof typeof formValues.fees.products
          ]?.amount ?? 0;
        variablePercent +=
          formValues.fees.products[
            product as keyof typeof formValues.fees.products
          ]?.percentage ?? 0;
      }
    });

    enterAmount = Math.round(enterAmount * 100) / 100;
    variableAmount = Math.round(variableAmount * 100) / 100;
    form.setValue("fees.enterFeesAmount", enterAmount);
    form.setValue("fees.variableFeesAmount", variableAmount);

    enterPercent = arbitrage
      ? Math.round(
          (enterAmount / (transfersAmount ?? formValues.amount)) * 10000
        ) / 100
      : Math.round(enterPercent * 100) / 100;
    variablePercent = arbitrage
      ? Math.round(
          (variableAmount / (transfersAmount ?? formValues.amount)) * 10000
        ) / 100
      : Math.round(variablePercent * 100) / 100;
    form.setValue("fees.enterPercent", enterPercent);
    form.setValue("fees.variablePercent", variablePercent);

    percent = Math.round((enterPercent + variablePercent) * 100) / 100;
    amount = Math.round(amount * 100) / 100;
    form.setValue("fees.totalValue", amount);
    form.setValue("fees.totalPercentage", percent);

    updateEvolutionValues();
  }

  const deleteCustomFees = (index: number) => () => {
    const customFees = form.getValues("fees.customFees");
    customFees.splice(index, 1);
    form.setValue("fees.customFees", customFees);

    UpdateValues();
    UpdateTotalValues();
  };

  return (
    <div className="grid gap-8 grid-cols-2">
      <div className="flex flex-col">
        <div className="grid gap-4 grid-cols-3 bg-blue-800 text-white py-2 px-4 mt-2 rounded-xl">
          <div className="flex ml-10 items-center">
            {t(
              `scenes.customers.projects.addProject.cif.fees.servicesFeesLabel`
            )}
          </div>
          <div className="flex justify-center items-center">
            {t(`scenes.customers.projects.addProject.cif.fees.absoluteValue`)}
          </div>
          <div className="flex justify-center items-center">
            {t(`scenes.customers.projects.addProject.cif.fees.percentage`)}
          </div>
        </div>
        <div className="">
          {Object.keys(formValues.fees.services).map((service, index) => (
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
                  name={`fees.services.${service}.amount`}
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
                            `fees.services.${service}.percentage`,
                            Math.round(
                              (formValues.fees.services[service].amount /
                                (desinvestAmount &&
                                transfersAmountWithoutDesinvest
                                  ? arbitrationFeesDependsOnDesinvest.includes(
                                      service
                                    )
                                    ? desinvestAmount
                                    : arbitrationFeesDependsOnTransfersAmountWithoutDesinvest.includes(
                                          service
                                        )
                                      ? transfersAmountWithoutDesinvest
                                      : transfersAmount ?? formValues.amount
                                  : transfersAmount ?? formValues.amount)) *
                                10000
                            ) / 100
                          );

                          if (
                            service !== "enterRight" &&
                            ((arbitrage &&
                              arbitrationEnterFeesValue.includes(service)) ||
                              (!arbitrage && enterFeesValue.includes(service)))
                          ) {
                            form.setValue(
                              `fees.products.enterRight.amount`,
                              Math.round(
                                ((transfersAmount ?? formValues.amount) -
                                  GetFixedFeesWithoutEnterRight()) *
                                  (formValues.fees.products.enterRight
                                    .percentage /
                                    100) *
                                  100
                              ) / 100
                            );
                          }
                          UpdateTotalValues();
                        }}
                      />
                    </div>
                  )}
                />
              </div>
              <div className="flex justify-center items-center">
                <Controller
                  name={`fees.services.${service}.percentage`}
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
                            `fees.services.${service}.amount`,
                            Math.round(
                              (arbitrage
                                ? arbitrationFeesDependsOnDesinvest.includes(
                                    service
                                  )
                                  ? desinvestAmount ?? 0
                                  : arbitrationFeesDependsOnTransfersAmountWithoutDesinvest.includes(
                                        service
                                      )
                                    ? transfersAmountWithoutDesinvest ?? 0
                                    : transfersAmount
                                : transfersAmount ?? formValues.amount) *
                                //transfersAmount ?? formValues.amount) *
                                (formValues.fees.services[service].percentage /
                                  100) *
                                100
                            ) / 100
                          );
                          UpdateValues();
                          UpdateTotalValues();
                        }}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          ))}
          {Object.keys(formValues.fees.customFees)
            .filter(
              (index) =>
                formValues.fees.customFees[index].feesLink === "services"
            )
            .map((index) => (
              <div className="grid gap-4 grid-cols-3 pl-2 pt-2" key={index}>
                <div className="flex items-center">
                  <>
                    <div
                      className="w-6 h-6 ml-4"
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
                      name={`fees.customFees[${index}].label`}
                      control={form.control}
                      render={({ field }) => (
                        <div className="w-64">
                          <div className="ml-2 mr-12 text-xs">
                            <FieldText
                              id={field.name}
                              {...field}
                              value={field.value}
                              className="w-full bg-slate-50 h-10"
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    />
                  </>
                </div>
                <div className="flex justify-center items-center">
                  <Controller
                    name={`fees.customFees[${index}].amount`}
                    control={form.control}
                    render={({ field }) => (
                      <div className="w-32">
                        <FieldAmount
                          id={field.name}
                          {...field}
                          value={formValues.fees.customFees[index].amount}
                          className="w-full bg-slate-50 h-10"
                          placeholder={"€"}
                          onChange={(value) => {
                            field.onChange(value);
                            // percent service
                            form.setValue(
                              `fees.customFees[${index}].percentage`,
                              Math.round(
                                (formValues.fees.customFees[index].amount /
                                  (arbitrage
                                    ? formValues.fees.customFees[index]
                                        .arbitrationValueType === "desinvest"
                                      ? desinvestAmount
                                      : formValues.fees.customFees[index]
                                            .arbitrationValueType === "both"
                                        ? transfersAmount
                                        : transfersAmountWithoutDesinvest
                                    : formValues.amount)) *
                                  100 *
                                  100
                              ) / 100
                            );

                            if (
                              form.getValues(`fees.customFees[${index}]`)
                                .feesType === "enter"
                            ) {
                              form.setValue(
                                `fees.products.enterRight.amount`,
                                Math.round(
                                  ((transfersAmount ?? formValues.amount) -
                                    GetFixedFeesWithoutEnterRight()) *
                                    (formValues.fees.products.enterRight
                                      .percentage /
                                      100) *
                                    100
                                ) / 100
                              );
                            }

                            UpdateTotalValues();
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <Controller
                    name={`fees.customFees[${index}].percentage`}
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
                              `fees.customFees[${index}].amount`,
                              Math.round(
                                (arbitrage
                                  ? formValues.fees.customFees[index]
                                      .arbitrationValueType === "desinvest"
                                    ? desinvestAmount
                                    : formValues.fees.customFees[index]
                                          .arbitrationValueType === "both"
                                      ? transfersAmount
                                      : transfersAmountWithoutDesinvest
                                  : formValues.amount) *
                                  (formValues.fees.customFees[index]
                                    .percentage /
                                    100) *
                                  100
                              ) / 100
                            );

                            UpdateValues();
                            UpdateTotalValues();
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
            ))}
        </div>
        <div>
          <SimpleCifAddFeesWidget
            form={form}
            linkType={LinkTypes.servicesFees}
            i18nKey={"addServicesFees"}
            type={arbitrage ? "arbitration" : "other"}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="grid gap-4 grid-cols-3 bg-blue-800 text-white py-2 px-4 mt-2 rounded-xl">
          <div className="flex ml-10 items-center">
            {t(`scenes.customers.projects.addProject.cif.fees.tiersFeesLabel`)}
          </div>
          <div className="flex justify-center items-center">
            {t(`scenes.customers.projects.addProject.cif.fees.absoluteValue`)}
          </div>
          <div className="flex justify-center items-center">
            {t(`scenes.customers.projects.addProject.cif.fees.percentage`)}
          </div>
        </div>
        <div>
          {Object.keys(formValues.fees.tiers).map((tier, index) => (
            <div className="grid gap-4 grid-cols-3 pl-2 pt-2" key={index}>
              <div className="flex items-center">
                <div className="ml-12 text-xs">
                  {t(`scenes.customers.projects.addProject.cif.fees.${tier}`)}
                </div>
              </div>
              <div className="flex justify-center items-center">
                <Controller
                  name={`fees.tiers.${tier}.amount`}
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
                            `fees.tiers.${tier}.percentage`,
                            Math.round(
                              (formValues.fees.tiers[tier].amount /
                                (desinvestAmount &&
                                transfersAmountWithoutDesinvest
                                  ? arbitrationFeesDependsOnDesinvest.includes(
                                      tier
                                    )
                                    ? desinvestAmount
                                    : arbitrationFeesDependsOnTransfersAmountWithoutDesinvest.includes(
                                          tier
                                        )
                                      ? transfersAmountWithoutDesinvest
                                      : transfersAmount ?? formValues.amount
                                  : transfersAmount ?? formValues.amount)) *
                                10000
                            ) / 100
                          );

                          UpdateTotalValues();
                        }}
                      />
                    </div>
                  )}
                />
              </div>
              <div className="flex justify-center items-center">
                <Controller
                  name={`fees.tiers.${tier}.percentage`}
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
                            `fees.tiers.${tier}.amount`,
                            Math.round(
                              (formValues.fees.tiers[tier].amount /
                                (desinvestAmount &&
                                transfersAmountWithoutDesinvest
                                  ? arbitrationFeesDependsOnDesinvest.includes(
                                      tier
                                    )
                                    ? desinvestAmount
                                    : arbitrationFeesDependsOnTransfersAmountWithoutDesinvest.includes(
                                          tier
                                        )
                                      ? transfersAmountWithoutDesinvest
                                      : transfersAmount ?? formValues.amount
                                  : transfersAmount ?? formValues.amount)) *
                                (formValues.fees.tiers[tier]?.percentage /
                                  100) *
                                100
                            ) / 100
                          );
                          UpdateValues();
                          UpdateTotalValues();
                        }}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-4 grid-cols-3 bg-blue-800 text-white py-2 px-4 mt-2 rounded-xl">
          <div className="flex ml-10 items-center">
            {t(
              `scenes.customers.projects.addProject.cif.fees.productsFeesLabel`
            )}
          </div>
          <div className="flex justify-center items-center">
            {t(`scenes.customers.projects.addProject.cif.fees.absoluteValue`)}
          </div>
          <div className="flex justify-center items-center">
            {t(`scenes.customers.projects.addProject.cif.fees.percentage`)}
          </div>
        </div>
        <div>
          {Object.keys(formValues.fees.products).map((product, index) => (
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
                  name={`fees.products.${product}.amount`}
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
                            `fees.products.${product}.percentage`,
                            Math.round(
                              (formValues.fees.products[product]?.amount /
                                (product === "enterRight"
                                  ? (transfersAmount ?? formValues.amount) -
                                    GetFixedFeesWithoutEnterRight()
                                  : desinvestAmount &&
                                      transfersAmountWithoutDesinvest
                                    ? arbitrationFeesDependsOnDesinvest.includes(
                                        product
                                      )
                                      ? desinvestAmount
                                      : arbitrationFeesDependsOnTransfersAmountWithoutDesinvest.includes(
                                            product
                                          )
                                        ? transfersAmountWithoutDesinvest
                                        : transfersAmount ?? formValues.amount
                                    : transfersAmount ?? formValues.amount)) *
                                10000
                            ) / 100
                          );

                          UpdateTotalValues();
                        }}
                      />
                    </div>
                  )}
                />
              </div>
              <div className="flex justify-center items-center">
                <Controller
                  name={`fees.products.${product}.percentage`}
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

                          UpdateValues();
                          UpdateTotalValues();
                        }}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          ))}
          {Object.keys(formValues.fees.customFees)
            .filter(
              (index) =>
                formValues.fees.customFees[index].feesLink === "products"
            )
            .map((index) => (
              <div className="grid gap-4 grid-cols-3 pl-2 pt-2" key={index}>
                <div className="flex items-center">
                  <>
                    <div
                      className="w-6 h-6 ml-4"
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
                      name={`fees.customFees[${index}].label`}
                      control={form.control}
                      render={({ field }) => (
                        <div className="w-64">
                          <div className="ml-2 mr-12 text-xs">
                            <FieldText
                              id={field.name}
                              {...field}
                              value={formValues.fees.customFees[index].label}
                              className="w-full bg-slate-50 h-10"
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    />
                  </>
                </div>
                <div className="flex justify-center items-center">
                  <Controller
                    name={`fees.customFees[${index}].amount`}
                    control={form.control}
                    render={({ field }) => (
                      <div className="w-32">
                        <FieldAmount
                          id={field.name}
                          {...field}
                          value={formValues.fees.customFees[index].amount}
                          className="w-full bg-slate-50 h-10"
                          placeholder={"€"}
                          onChange={(value) => {
                            field.onChange(value);

                            // percent service
                            form.setValue(
                              `fees.customFees[${index}].percentage`,
                              Math.round(
                                (formValues.fees.customFees[index].amount /
                                  (arbitrage
                                    ? formValues.fees.customFees[index]
                                        .arbitrationValueType === "desinvest"
                                      ? desinvestAmount
                                      : formValues.fees.customFees[index]
                                            .arbitrationValueType === "both"
                                        ? transfersAmount
                                        : transfersAmountWithoutDesinvest
                                    : formValues.amount)) *
                                  100 *
                                  100
                              ) / 100
                            );

                            form.setValue(
                              `fees.products.enterRight.amount`,
                              Math.round(
                                (formValues.amount -
                                  GetFixedFeesWithoutEnterRight()) *
                                  (formValues.fees.products.enterRight
                                    .percentage /
                                    100) *
                                  100
                              ) / 100
                            );

                            UpdateTotalValues();
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <Controller
                    name={`fees.customFees[${index}].percentage`}
                    control={form.control}
                    render={({ field }) => (
                      <div className="w-32">
                        <FieldPercentage
                          id={field.name}
                          {...field}
                          value={formValues.fees.customFees[index].percentage}
                          className="w-full bg-slate-50 h-10"
                          onChange={(value) => {
                            field.onChange(value);

                            // montant frais service
                            form.setValue(
                              `fees.customFees[${index}].amount`,
                              Math.round(
                                (arbitrage
                                  ? formValues.fees.customFees[index]
                                      .arbitrationValueType === "desinvest"
                                    ? desinvestAmount
                                    : formValues.fees.customFees[index]
                                          .arbitrationValueType === "both"
                                      ? transfersAmount
                                      : transfersAmountWithoutDesinvest
                                  : formValues.amount) *
                                  (formValues.fees.customFees[index]
                                    .percentage /
                                    100) *
                                  100
                              ) / 100
                            );

                            UpdateValues();
                            UpdateTotalValues();
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
            ))}
        </div>
        <div>
          <SimpleCifAddFeesWidget
            form={form}
            linkType={LinkTypes.productsFees}
            i18nKey={"addProductsFees"}
            type={arbitrage ? "arbitration" : "other"}
          />
        </div>

        <div className="grid gap-4 grid-cols-3 bg-blue-800 text-white py-2 px-4 mt-2 rounded-xl">
          <div className="flex ml-10 items-center">
            {t(`scenes.customers.projects.addProject.cif.fees.totalFeesLabel`)}
          </div>
          <div className="flex justify-center items-center">
            {t(`scenes.customers.projects.addProject.cif.fees.absoluteValue`)}
          </div>
          <div className="flex justify-center items-center">
            {t(`scenes.customers.projects.addProject.cif.fees.percentage`)}
          </div>
        </div>
        <div>
          <div className="grid gap-4 grid-cols-3 bg-blue-600 bg-opacity-20 pl-2 mt-2 rounded-xl">
            <div className="flex items-center">
              <div className="ml-12 text-xs">
                {t(`scenes.customers.projects.addProject.cif.fees.fixedFees`)}
              </div>
            </div>
            <div className="flex justify-center items-center pr-4">
              <div className="w-32 text-right px-1 py-2 text-sm">
                {formValues.fees.enterFeesAmount} €
              </div>
            </div>
            <div className="flex justify-center items-center pr-4">
              <div className="w-32 text-right px-1 py-2 text-sm">
                {formValues.fees.enterPercent} %
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
                {formValues.fees.variableFeesAmount} €
              </div>
            </div>
            <div className="flex justify-center items-center pr-4">
              <div className="w-32 text-right px-1 py-2 text-sm">
                {formValues.fees.variablePercent} %
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
                {formValues.fees.totalValue} €
              </div>
            </div>
            <div className="flex justify-center items-center pr-4">
              <div className="w-32 text-right px-1 py-2 text-sm">
                {formValues.fees.totalPercentage} %
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
