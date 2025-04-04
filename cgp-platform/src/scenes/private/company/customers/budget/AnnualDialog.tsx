import { TFunction } from "i18next";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button, Dialog } from "../../../../../components";
import { BudgetCreationInput } from "../../../../../types";

type Item = {
  label: string;
  value: string;
};

export type BudgetFormItemList = {
  label: string;
  items: Item[];
};

export type AnnualDialogProps = {
  visible: boolean;
  onHide: () => void;
  items: BudgetFormItemList[];
  onSubmit: (data: { input: BudgetCreationInput; budgetID?: string }) => void;
  isLoading: boolean;
};

export const AnnualDialog = ({
  visible,
  onHide,
  isLoading,
  items = [],
  ...props
}: AnnualDialogProps) => {
  const { t } = useTranslation();

  const defaultValues: BudgetCreationInput = {
    type: "",
    amount: 0,
    name: "",
  };

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<BudgetCreationInput>({
    defaultValues,
    resetOptions: {
      keepDirty: false,
      keepDirtyValues: false,
      keepValues: false,
      keepIsSubmitted: false,
    },
  });

  const referenceInstrument = "EUR";

  const onSubmit = (data: BudgetCreationInput) => {
    const item = items.find((item) =>
      item.items.find((i) => i.value === data.name)
    );

    if (!item) return console.error("Item not found ", items, data);

    props.onSubmit({ input: { ...data, type: item?.label } });
    reset(defaultValues);
  };

  return (
    <>
      <Dialog
        header={t(`scenes.wealth.budgetAdd`)}
        open={visible}
        className="w-1/3"
        onOpenChange={onHide}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-auto mt-4 flex w-full flex-col justify-center gap-y-3">
            <div className="rounded-xl border border-grey-400 bg-white">
              <Controller
                name="name"
                control={control}
                rules={{
                  required: t(`forms.fields.budget.budgetType.error`) as string,
                }}
                render={({ field }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.budget.budgetType.label`)}
                    </label>
                    <Dropdown
                      id={field.name}
                      value={field.value}
                      valueTemplate={itemTemplate(t)}
                      onChange={(e) => field.onChange(e.value)}
                      options={items}
                      optionLabel="label"
                      optionGroupLabel="label"
                      optionGroupChildren="items"
                      optionGroupTemplate={groupedItemTemplate(t)}
                      focusInputRef={field.ref}
                      itemTemplate={itemTemplate(t)}
                      className="w-full rounded-xl border-none"
                      style={{ height: 50 }}
                      panelStyle={{
                        marginTop: 16,
                      }}
                      placeholder={
                        t(
                          `forms.fields.budget.budgetType.placeholder`
                        ) as string
                      }
                    />
                    {getFormErrorMessage(errors, field.name)}
                  </>
                )}
              />
            </div>
            <div className="rounded-xl border border-grey-400 bg-white">
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.budget.budgetAmount.error`
                  ) as string,
                  validate: (value) =>
                    value !== null ||
                    (t(`forms.fields.budget.budgetAmount.label`) as string),
                }}
                render={({ field }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="ml-3 font-medium text-xs text-blue-1000"
                    >
                      {t(`forms.fields.budget.budgetAmount.label`)}
                    </label>
                    <InputNumber
                      id={field.name}
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
                        t(
                          "forms.fields.budget.budgetAmount.placeholder"
                        ) as string
                      }
                      mode="currency"
                      currency={referenceInstrument}
                    />
                    {getFormErrorMessage(errors, field.name)}
                  </>
                )}
              />
            </div>
            <Button
              label={t(`forms.fields.actions.add`)}
              type="submit"
              icon="pi pi-plus"
              className="mx-auto mt-10"
              loading={isLoading}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
};

function groupedItemTemplate(t: TFunction) {
  return (option: BudgetFormItemList) => (
    <div className="align-items-center flex">
      <div className="font-bold text-blue-1100">
        {t(`forms.fields.budget.${option.label}`)}
      </div>
    </div>
  );
}

function itemTemplate(t: TFunction) {
  return (item: Item) => {
    if (!item) return t("forms.fields.budget.budgetType.placeholder");

    return (
      <div>
        <div>{t(`forms.fields.budget.${item?.label}`)}</div>
      </div>
    );
  };
}

function getFormErrorMessage(
  errors: FieldErrors<BudgetCreationInput>,
  name: keyof BudgetCreationInput
) {
  return (
    errors &&
    name &&
    errors[name] && (
      <small className="p-error -mt-3">{errors[name]?.message}</small>
    )
  );
}
