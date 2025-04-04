import { InputNumber } from "primereact/inputnumber";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "../../../../../../components";
import { getFormErrorMessage } from "../../../../../../constants";
import { BudgetCreationInput } from "../../../../../../types";
import { Label } from "../../../../../../UIComponents/Label/Label";
import Select, { Option } from "../../../../../../UIComponents/Select/Select";
import { annualExpensesNames } from "../../budget/budgetPerson";
import { BudgetCreationInputForm } from "./types";

interface ChargeFormProps {
  defaultValues?: BudgetCreationInputForm;
  chargeType: string;
  onSubmit: (data: { input: BudgetCreationInput; budgetID?: string }) => void;
  isLoading: boolean;
}

export default function ChargeForm({
  defaultValues,
  chargeType,
  onSubmit,
  isLoading,
}: ChargeFormProps) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetCreationInputForm>({
    defaultValues,

    resetOptions: {
      keepDirty: false,
      keepDirtyValues: false,
      keepValues: false,
      keepIsSubmitted: false,
    },
  });

  const referenceInstrument = "EUR";

  const currentAnnualCharge = annualExpensesNames.find(
    (annualCharge) => annualCharge.label === chargeType
  );
  const selectOptions: Option[] = currentAnnualCharge
    ? currentAnnualCharge?.items.map((item) => ({
        ...item,
        label: t(`forms.fields.budget.${item.value}`),
      }))
    : [];

  const _onSubmit = (data: BudgetCreationInputForm) => {
    const item = annualExpensesNames.find((item) =>
      item.items.find((i) => i.value === data.name)
    );

    if (!item)
      return console.error("Item not found ", annualExpensesNames, data);

    onSubmit({
      input: {
        amount: data.amount,
        name: data.name,
        type: item?.label,
      },
      budgetID: data.id,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(_onSubmit)}>
      <div className="mx-auto mt-4 flex w-full justify-between space-x-12">
        <Controller
          name="name"
          control={control}
          rules={{
            required: t(`forms.fields.budget.budgetType.error`) as string,
          }}
          render={({ field }) => (
            <div className="rounded-xl border border-grey-400 bg-white w-full px-3">
              <Label
                htmlFor={field.name}
                className="font-medium text-xs text-blue-1000"
              >
                {t(`forms.fields.budget.budgetType.label`)}
              </Label>
              <Select
                id={chargeType + "-" + field.name}
                {...field}
                name={chargeType + "-" + field.name}
                value={selectOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => field.onChange(option?.value)}
                options={selectOptions}
                isDisabled={defaultValues && defaultValues.id.length > 0}
              />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />
        <Controller
          name="amount"
          control={control}
          rules={{
            required: t(`forms.fields.budget.budgetAmount.error`) as string,
            validate: (value) =>
              value !== 0 ||
              (t(`forms.fields.budget.budgetAmount.label`) as string),
          }}
          render={({ field }) => (
            <div className="rounded-xl border border-grey-400 bg-white w-full">
              <label
                htmlFor={field.name}
                className="font-medium text-xs text-blue-1000 ml-3"
              >
                {t(`forms.fields.budget.budgetAmount.label`)}
              </label>
              <InputNumber
                id={chargeType + "-" + field.name}
                data-testid={chargeType + "-" + field.name}
                defaultValue={0}
                inputRef={field.ref}
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={(e) => field.onChange(e.target.value)}
                useGrouping={false}
                className="w-full rounded-xl border-none"
                inputStyle={{
                  height: 50,
                  border: "none",
                  borderRadius: 12,
                }}
                placeholder={
                  t("forms.fields.budget.budgetAmount.placeholder") as string
                }
                mode="currency"
                currency={referenceInstrument}
              />
              {getFormErrorMessage(field.name, errors)}
            </div>
          )}
        />
      </div>
      <Button
        id={chargeType + "-submit"}
        label={
          defaultValues?.id
            ? t(`forms.fields.actions.update`)
            : t(`forms.fields.actions.add`)
        }
        type="submit"
        icon="pi pi-plus"
        className="flex justify-self-center"
        loading={isLoading}
      />
    </form>
  );
}
