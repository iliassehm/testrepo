import { TFunction } from "i18next";
import { useState } from "react";
import { Control, Controller, set, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CustomerRelationForm } from "../../../../../../../shared/schemas/relation";
import { Button, Text } from "../../../../../../components";
import {
  countriesOptions,
  denominations,
  maritalStatusOptions,
} from "../../../../../../constants";
import { formatDateBykeys } from "../../../../../../helpers";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../UIComponents/Label/Label";
import Select, { Option } from "../../../../../../UIComponents/Select/Select";
import { ExistingCustomerModal } from "./ExistingCustomerModal";

interface RelationFormProps {
  isLoading?: boolean;
  isUpdate?: boolean;
  defaultValues?: CustomerRelationForm;
  onSubmit: (data: CustomerRelationForm) => void;
}

export function RelationForm({
  defaultValues,
  isLoading,
  isUpdate,
  onSubmit,
}: RelationFormProps) {
  const { t } = useTranslation();
  const [openExistingCustomer, setOpenExistingCustomer] =
    useState<boolean>(false);
  const { handleSubmit, control, reset } = useForm<CustomerRelationForm>({
    defaultValues: formatDateBykeys(defaultValues as object, ["birthDate"]),
    mode: "all",
  });

  const _onSubmit = (data: CustomerRelationForm) => {
    if (!data.firstName || !data.lastName) return;
    onSubmit(data);
    reset();
  };

  const fieldSuffix = isUpdate ? "update" : "";

  return (
    <form onSubmit={handleSubmit(_onSubmit)} className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        {!fieldSuffix && (
          <div className="flex items-center">
            <Text
              as="h3"
              className="font-bold text-blue-800"
              label="scenes.company.settings.relation.newMember"
            />
            <Button
              className="ml-4 py-1"
              label={t(
                "scenes.customers.details.companies.linkExistingCustomer"
              )}
              onClick={() => setOpenExistingCustomer(true)}
            />
          </div>
        )}
        <div className="grid grid-rows-5 grid-cols-2 grid-flow-col gap-x-10 gap-y-4">
          <FormFields control={control} fieldSuffix={fieldSuffix} t={t} />
        </div>
      </div>
      <Button
        label={
          defaultValues
            ? "forms.fields.actions.save"
            : "forms.fields.actions.add"
        }
        type="submit"
        className="m-auto"
        isLoading={isLoading}
      />
      <ExistingCustomerModal
        open={openExistingCustomer}
        setOpen={() => setOpenExistingCustomer(!openExistingCustomer)}
        t={t}
      />
    </form>
  );
}

interface FormProps {
  control: Control<CustomerRelationForm>;
  t: TFunction;
  fieldSuffix?: string;
}

function FormFields({ control, fieldSuffix, t }: FormProps) {
  return (
    <>
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <div>
            <Label htmlFor={field.name + fieldSuffix}>
              {t("forms.fields.firstName")}
            </Label>
            <FieldText id={field.name + fieldSuffix} {...field} />
          </div>
        )}
      />
      <Controller
        name="lastName"
        control={control}
        render={({ field }) => (
          <div>
            <Label htmlFor={field.name + fieldSuffix}>
              {t("forms.fields.lastName")}
            </Label>
            <FieldText id={field.name + fieldSuffix} {...field} />
          </div>
        )}
      />
      <Controller
        name="denomination"
        control={control}
        render={({ field }) => (
          <div>
            <Label htmlFor={field.name + fieldSuffix}>
              {t("forms.fields.denomination")}
            </Label>
            <select
              id={field.name + fieldSuffix}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
              {...field}
            >
              <optgroup label={denominations.familyStatus}>
                {Object.entries(denominations.familyStatusList).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </optgroup>
              <optgroup label={denominations.maritalStatus}>
                {Object.entries(denominations.maritalStatusList).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </optgroup>
              <optgroup label={denominations.otherStatus}>
                {Object.entries(denominations.otherStatusList).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </optgroup>
            </select>
          </div>
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <div>
            <Label htmlFor={field.name + fieldSuffix}>
              {t("forms.fields.phone")}
            </Label>
            <FieldText id={field.name + fieldSuffix} {...field} />
          </div>
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <div>
            <Label htmlFor={field.name + fieldSuffix}>
              {t("forms.fields.email")}
            </Label>
            <FieldText id={field.name + fieldSuffix} type="email" {...field} />
          </div>
        )}
      />
      <Controller
        name="birthDate"
        control={control}
        render={({ field }) => (
          <div>
            <Label htmlFor={field.name + fieldSuffix}>
              {t("forms.fields.birthDate")}
            </Label>
            <FieldDate
              id={field.name + fieldSuffix}
              {...field}
              onValueChange={field.onChange}
            />
          </div>
        )}
      />
      <Controller
        name="nationality"
        control={control}
        render={({ field }) => (
          <div>
            <Label htmlFor={field.name + fieldSuffix}>
              {t("forms.fields.nationality")}
            </Label>
            <FieldText id={field.name + fieldSuffix} {...field} />
          </div>
        )}
      />
      <Controller
        name="birthPlace"
        control={control}
        render={({ field }) => (
          <div>
            <Label htmlFor={field.name + fieldSuffix}>
              {t("forms.fields.birthPlace")}
            </Label>
            <FieldText id={field.name + fieldSuffix} {...field} />
          </div>
        )}
      />
      <Controller
        name="countryOfBirth"
        control={control}
        render={({ field }) => (
          <div>
            <Label htmlFor={field.name + fieldSuffix}>
              {t("forms.fields.countryOfBirth")}
            </Label>
            <Select
              id={field.name + fieldSuffix}
              {...field}
              value={countriesOptions?.find(
                (option) => option.value === field.value
              )}
              onChange={(option) => field.onChange(option?.value)}
              options={countriesOptions as Option[]}
            />
          </div>
        )}
      />
      <Controller
        name="maritalStatus"
        control={control}
        render={({ field }) => (
          <div>
            <Label htmlFor={field.name + fieldSuffix}>
              {t("forms.fields.maritalStatus")}
            </Label>
            <Select
              {...field}
              value={maritalStatusOptions?.find(
                (option) => option.value === field.value
              )}
              onChange={(option) => field.onChange(option?.value)}
              options={maritalStatusOptions as Option[]}
            />
          </div>
        )}
      />
    </>
  );
}
