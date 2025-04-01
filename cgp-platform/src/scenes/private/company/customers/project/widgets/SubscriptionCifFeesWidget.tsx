import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FieldAmount from "../../../../../../UIComponents/FieldAmount/FieldAmount";
import FieldPercentage from "../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { LinkTypes, SimpleCifAddFeesWidget } from "./SimpleCifAddFeesWidget";

interface FeesWidgetProps {
  form: ReturnType<typeof useForm<any>>;
  transfersAmount: number;
}
export const SubscriptionCifFeesWidget: React.FC<FeesWidgetProps> = ({
  form,
  transfersAmount,
}) => {
  const { t } = useTranslation();

  const enterFeesValue = [
    "opening",
    "advice",
    "brokerage",
    "exchange",
    "enterRight",
  ];

  const variableFeesValue = [
    "arbitration",
    "transfer",
    "closing",
    "followingAdvice",
    "custodialRight",
    "accountManagement",
    "inactivity",
    "managementAssignments",
    "gestion",
    "surperformance",
  ];

  const formValues = form.watch();

  function GetFixedFeesWithoutEnterRight() {
    let fixedFees = 0;
    Object.keys(formValues.fees.services).forEach((service) => {
      if (service !== "enterRight" && enterFeesValue.includes(service))
        fixedFees += formValues.fees.services[service].amount;
    });
    Object.keys(formValues.fees.customFees).forEach((index) => {
      if (formValues.fees.customFees[index].feesType === "enter")
        fixedFees += formValues.fees.customFees[index]?.amount ?? 0;
    });
    Object.keys(formValues.fees.products).forEach((product) => {
      if (product !== "enterRight" && enterFeesValue.includes(product))
        fixedFees += formValues.fees.products[product].amount;
    });
    return fixedFees;
  }

  const deleteCustomFees = (index: number) => () => {
    const customFees = form.getValues("fees.customFees");
    customFees.splice(index, 1);
    form.setValue("fees.customFees", customFees);
  };

  function updateValues() {
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
      totalAmount += formValues.fees.customFees[index]?.amount ?? 0;
      if (formValues.fees.customFees[index].feesType === "enter")
        enterAmount += formValues.fees.customFees[index]?.amount ?? 0;
      else variableAmount += formValues.fees.customFees[index]?.amount ?? 0;
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
  }

  function updatePercentages() {
    let totalPercent = 0;
    let enterPercent = 0;
    let variablePercent = 0;

    Object.keys(formValues.fees.services).forEach((service) => {
      const serviceKey = service as keyof typeof formValues.fees.services;
      totalPercent += formValues.fees.services[serviceKey]?.percentage ?? 0;
      if (enterFeesValue.includes(service)) {
        enterPercent += formValues.fees.services[serviceKey]?.percentage ?? 0;
      } else if (variableFeesValue.includes(service)) {
        variablePercent +=
          formValues.fees.services[serviceKey]?.percentage ?? 0;
      }
    });

    Object.keys(formValues.fees.customFees).forEach((index) => {
      totalPercent += formValues.fees.customFees[index]?.percentage ?? 0;
      if (formValues.fees.customFees[index].feesType === "enter")
        enterPercent += formValues.fees.customFees[index]?.percentage ?? 0;
      else
        variablePercent += formValues.fees.customFees[index]?.percentage ?? 0;
    });

    Object.keys(formValues.fees.products).forEach((product) => {
      const productKey = product as keyof typeof formValues.fees.products;
      totalPercent += formValues.fees.products[productKey]?.percentage ?? 0;
      if (enterFeesValue.includes(product)) {
        enterPercent += formValues.fees.products[productKey]?.percentage ?? 0;
      } else if (variableFeesValue.includes(product)) {
        variablePercent +=
          formValues.fees.products[productKey]?.percentage ?? 0;
      }
    });

    form.setValue("fees.enterPercent", Math.round(enterPercent * 100) / 100);
    form.setValue(
      "fees.variablePercent",
      Math.round(variablePercent * 100) / 100
    );
    form.setValue("fees.totalPercentage", Math.round(totalPercent * 100) / 100);
  }

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
          formValues.amount *
            (evolutionValues[year].evolutionPercentage / 100) *
            100
        ) / 100
      );
    });
  }

  return (
    <div className="mb-10">
      <h1 className="text-[#4761C8] font-bold text-xl mb-4">
        {t("scenes.customers.projects.addProject.cif.fees.feesLabel")}
      </h1>
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
                                  formValues.amount) *
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

                            updateValues();
                            updatePercentages();
                            updateEvolutionValues();
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
                            updatePercentages();

                            // montant frais service
                            form.setValue(
                              `fees.services.${service}.amount`,
                              Math.round(
                                formValues.amount *
                                  (formValues.fees.services[service]
                                    .percentage /
                                    100) *
                                  100
                              ) / 100
                            );

                            updateValues();
                            updateEvolutionValues();
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
                                    formValues.amount) *
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

                              updateValues();
                              updatePercentages();
                              updateEvolutionValues();
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
                              updatePercentages();

                              // montant frais service
                              form.setValue(
                                `fees.customFees[${index}].amount`,
                                Math.round(
                                  formValues.amount *
                                    (formValues.fees.customFees[index]
                                      .percentage /
                                      100) *
                                    100
                                ) / 100
                              );

                              updateValues();
                              updateEvolutionValues();
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
              i18nKey="addServicesFees"
              type="other"
            />
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
                                  formValues.amount) *
                                  10000
                              ) / 100
                            );

                            updateValues();
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
                                formValues.amount *
                                  (formValues.fees.tiers[tier]?.percentage /
                                    100) *
                                  100
                              ) / 100
                            );
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
                                    ? formValues.amount -
                                      GetFixedFeesWithoutEnterRight()
                                    : formValues.amount)) *
                                  10000
                              ) / 100
                            );

                            updateValues();
                            updatePercentages();
                            updateEvolutionValues();
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

                            // montant frais service
                            form.setValue(
                              `fees.products.${product}.amount`,
                              Math.round(
                                (product === "enterRight"
                                  ? formValues.amount -
                                    GetFixedFeesWithoutEnterRight()
                                  : formValues.amount) *
                                  (formValues.fees.products[product]
                                    .percentage /
                                    100) *
                                  100
                              ) / 100
                            );

                            updatePercentages();
                            updateValues();
                            updateEvolutionValues();
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
                                    formValues.amount) *
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

                              updateValues();
                              updatePercentages();
                              updateEvolutionValues();
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
                              updatePercentages();

                              // montant frais service
                              form.setValue(
                                `fees.customFees[${index}].amount`,
                                Math.round(
                                  formValues.amount *
                                    (formValues.fees.customFees[index]
                                      .percentage /
                                      100) *
                                    100
                                ) / 100
                              );

                              updateValues();
                              updateEvolutionValues();
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
              i18nKey="addProductsFees"
              type="other"
            />
          </div>

          <div className="grid gap-4 grid-cols-3 bg-blue-800 text-white py-2 px-4 mt-2 rounded-xl">
            <div className="flex ml-10 items-center">
              {t(
                `scenes.customers.projects.addProject.cif.fees.totalFeesLabel`
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
    </div>
  );
};
