import { Checkbox } from "primereact/checkbox";
import { MultiSelect } from "primereact/multiselect";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Label } from "../../../../../../../components/Label";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { useContractFilters } from "../../useContractFilters";
import { SearchContractFormValues } from "./SearchContractDialog";

interface SearchContractFormProps {
  form: UseFormReturn<SearchContractFormValues>;
}

export const SearchContractForm: React.FC<SearchContractFormProps> = ({
  form,
}) => {
  const { t } = useTranslation();
  const { data: contractFilters } = useContractFilters();

  return (
    <div className="flex flex-row gap-4 flex-wrap">
      <div className="flex flex-row justify-between items-center gap-4">
        <Label
          label={t(
            "scenes.customers.projects.searchContract.managementCompany"
          )}
        />
        <Controller
          control={form.control}
          name="insuranceCompanies"
          render={({ field }) => (
            <MultiSelect
              className="w-64 rounded-xl"
              pt={{
                label: {
                  className: "!py-1.5",
                },
              }}
              optionLabel="name"
              optionValue="name"
              options={contractFilters?.contractFilters.insuranceCompanies?.map(
                (company) => ({
                  name: company,
                })
              )}
              value={field.value ?? []}
              onChange={(e) => field.onChange(e.value)}
            />
          )}
        />
      </div>

      <div className="flex flex-row justify-between items-center gap-4">
        <Label label={t("scenes.customers.projects.searchContract.type")} />
        <Controller
          control={form.control}
          name="types"
          render={({ field }) => (
            <MultiSelect
              className="w-64 rounded-xl"
              pt={{
                label: {
                  className: "!py-1.5",
                },
              }}
              optionLabel="name"
              optionValue="id"
              maxSelectedLabels={3}
              options={contractFilters?.contractFilters.types?.map((type) => ({
                name: type,
                id: type,
              }))}
              {...field}
              onChange={(e) => field.onChange(e.value)}
            />
          )}
        />
      </div>
      <div className="flex flex-row justify-between items-center gap-4">
        <Label label={t("scenes.customers.projects.searchContract.name")} />
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => (
            <FieldText id={field.name} {...field} className="w-64" />
          )}
        />
      </div>
      <div className="flex flex-row justify-between items-center gap-4">
        <Label
          label={t("scenes.customers.projects.searchContract.favoritesOnly")}
          id="selected"
        />
        <Controller
          control={form.control}
          name="selected"
          render={({ field }) => (
            <Checkbox
              className="w-64 rounded-xl"
              checked={field.value ?? false}
              onChange={(e) => field.onChange(e.checked)}
            />
          )}
        />
      </div>
    </div>
  );
};
