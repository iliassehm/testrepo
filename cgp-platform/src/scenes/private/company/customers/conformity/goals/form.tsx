import { Controller, useForm } from "react-hook-form";

import { Button, CheckableInput, Loading } from "../../../../../../components";
import { Label } from "../../../../../../components/Label";
import { getFormErrorMessage } from "../../../../../../constants";
import { useDebounce } from "../../../../../../hooks/useDebounce";
import i18n from "../../../../../../i18n";
import FieldAmount from "../../../../../../UIComponents/FieldAmount/FieldAmount";

export const objectivesFormData = {
  retirementPreparation: {},
  fiscalityOptimization: {},
  savingsPrecaution: {},
  longTermCapital: {},
  buildHeritage: {},
  convertToLifetimeAndCapital: {},
  luxembourgInvestment: {},
  managementDelegationToProfessionnal: {},
  reduceRealEstateTax: {},
  realEstateFinancing: {},
  helpChildren: {},
  anticipateGeographicMobility: {},
  lifeIncidentsProtection: {},
  survivingSpouseProtection: {},
  relativesProtection: {},
  heritageTransmission: {},
  companyTransmission: {},
  getAdditionalIncome: {},
  returnInvestmentsOptimization: {},
};

export const savingsObjectivesFormData: Record<string, Partial<any>> = {
  monthlySavings: {
    type: "number",
  },
  precautionarySavingsAmount: {
    type: "number",
  },
};

export type ObjectivesFormDataType = Record<
  keyof typeof objectivesFormData | keyof typeof savingsObjectivesFormData,
  number
>;

interface GoalsFormProps {
  defaultValues: ObjectivesFormDataType;
  isLoading?: boolean;
  isUpdateConformityLoading?: boolean;
  isSendGoalsFormToCustomerLoading?: boolean;
  submitPosition?: "end" | "start";
  onSubmit: (data: ObjectivesFormDataType) => void;
  sendGoalsFormToCustomer?: () => void;
}
export const GoalsForm = ({
  defaultValues: _defaultValues,
  isLoading,
  isUpdateConformityLoading,
  isSendGoalsFormToCustomerLoading,
  submitPosition = "start",
  onSubmit,
  sendGoalsFormToCustomer,
}: GoalsFormProps) => {
  if (isLoading) {
    return <Loading />;
  }

  // data
  const objectivesFormDataKeys = Object.keys(
    objectivesFormData
  ) as (keyof typeof objectivesFormData)[];
  const savingsObjectivesFormDataKeys = Object.keys(
    savingsObjectivesFormData
  ) as (keyof typeof savingsObjectivesFormData)[];

  const defaultValues =
    _defaultValues ??
    [...objectivesFormDataKeys, ...savingsObjectivesFormDataKeys].reduce(
      (obj, key) => {
        return {
          ...obj,
          [key]: null,
        };
      },
      {} as Record<
        keyof typeof objectivesFormData &
          keyof typeof savingsObjectivesFormData,
        null
      >
    );

  return (
    <Form
      defaultValues={defaultValues}
      submitPosition={submitPosition}
      objectivesFormDataKeys={objectivesFormDataKeys}
      savingsObjectivesFormDataKeys={savingsObjectivesFormDataKeys}
      onSubmit={onSubmit}
      sendGoalsFormToCustomer={sendGoalsFormToCustomer}
      isLoading={isLoading}
      isUpdateConformityLoading={isUpdateConformityLoading}
      isSendGoalsFormToCustomerLoading={isSendGoalsFormToCustomerLoading}
    />
  );
};

interface FormProps extends Omit<GoalsFormProps, "isLoading"> {
  objectivesFormDataKeys: (keyof typeof objectivesFormData)[];
  savingsObjectivesFormDataKeys: (keyof typeof savingsObjectivesFormData)[];
  isLoading?: boolean;
}

function Form({
  defaultValues,
  submitPosition = "start",
  objectivesFormDataKeys,
  savingsObjectivesFormDataKeys,
  onSubmit,
  sendGoalsFormToCustomer,
  isUpdateConformityLoading,
  isSendGoalsFormToCustomerLoading,
}: FormProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<ObjectivesFormDataType>({
    defaultValues,
  });

  const language = i18n.language;
  const currencyMode = {
    currency: language === "fr" ? "EUR" : "USD",
    locale: language === "fr" ? "fr-FR" : "en-US",
  };

  const debouncedOnSubmit = useDebounce((currentValues) => {
    onSubmit(currentValues);
  }, 3000);

  const handleBlur = () => {
    const currentValues = getValues();
    debouncedOnSubmit(currentValues);
  };

  return (
    <>
      <form
        className="flex w-full flex-col pb-10"
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        <div className="flex self-end mb-4 gap-3">
          {sendGoalsFormToCustomer && (
            <Button
              variant="bordered"
              size="small"
              type="button"
              isLoading={isSendGoalsFormToCustomerLoading}
              // className="rounded-md"
              label="forms.fields.conformity.investorProfile.sendToCustomer"
              onClick={() => sendGoalsFormToCustomer()}
            />
          )}
          {submitPosition === "start" && (
            <Button
              label="actions.save"
              type="submit"
              size="small"
              isLoading={isUpdateConformityLoading}
            />
          )}
        </div>
        <div className="grid grid-cols-1 divide-y gap-2">
          <div className="ml-auto w-[60%]">
            <div className="flex gap-2">
              <div className="flex flex-1 justify-between w-1/2">
                <Label
                  label="forms.fields.conformity.objectives.note"
                  className="pl-9"
                />
                <div className="w-[150px] text-center">
                  <Label label="forms.fields.conformity.objectives.amount" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 divide-y gap-2">
          {objectivesFormDataKeys.map((key) => (
            <div className="flex" key={key}>
              <div className="w-[40%]">
                <Label label={`forms.fields.conformity.objectives.${key}`} />
              </div>
              <div className="flex-1 flex gap-2">
                <CheckableInput
                  key={key}
                  name={key}
                  mode="currency"
                  checkboxName={`${key}Checkbox`}
                  defaultChecked={!!defaultValues[`${key}Checkbox`]}
                  {...currencyMode}
                  {...objectivesFormData[
                    key as unknown as keyof typeof objectivesFormData
                  ]}
                  control={control}
                  className="pt-2 flex-1 items-center justify-between gap-x-4"
                  defaultValue={defaultValues[key]}
                  submitOnValueChange={handleBlur}
                />
                <Controller
                  name={`${key}Amount`}
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <div className="flex items-center">
                      <FieldAmount
                        id={field.name}
                        {...field}
                        onBlur={handleBlur}
                      />
                      {getFormErrorMessage(field.name, errors)}
                    </div>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 mt-4">
          {savingsObjectivesFormDataKeys.map((key) => (
            <div className="flex" key={key}>
              <div className="w-[40%]">
                <Label
                  label={`forms.fields.conformity.objectives.${key}`}
                  className="text-blue-800 font-medium"
                />
              </div>
              <Controller
                name={key}
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <div className="flex items-center">
                    <FieldAmount
                      id={field.name}
                      {...field}
                      onBlur={handleBlur}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </div>
                )}
              />
            </div>
          ))}
        </div>
        {submitPosition === "end" && (
          <Button
            label="actions.save"
            className="mx-auto mt-6"
            type="submit"
            size="small"
            loading={isUpdateConformityLoading}
          />
        )}
      </form>
    </>
  );
}
