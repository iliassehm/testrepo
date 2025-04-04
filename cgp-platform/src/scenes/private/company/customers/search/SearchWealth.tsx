import { useParams } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { ProgressSpinner } from "primereact/progressspinner";
import type { FC } from "react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { z } from "zod";

import {
  customersSearchSchema,
  formToSchema,
  schemaToForm,
  SearchSchemaToForm,
} from "../../../../../../shared/schemas/customers.search";
import { Button } from "../../../../../components";
import { Label } from "../../../../../components/Label";
import { gql } from "../../../../../service/client";
import { FieldText } from "../../../../../UIComponents/FieldText/FieldText";
import MultiSelect from "../../../../../UIComponents/SelectMultiple/SelectMultiple";
import { CompanyCustomersSearchLogic } from "./search.logic";

const CustomersSearchInput = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-center">
      <Label label={label} className="w-[324px] text-base" />
      {children}
    </div>
  );
};

type SearchWealthProps = {
  onSearchSubmit: (schema: unknown) => void;
  onSaveSubmit: (schema: unknown) => void;
  onClose: () => void;
  defaultValues?: z.infer<typeof customersSearchSchema>;
  isSaving?: boolean;
  isSearching?: boolean;
};

type FormValues = SearchSchemaToForm<
  z.infer<typeof customersSearchSchema>["conditions"][number]
>;

export const SearchWealth: FC<SearchWealthProps> = ({
  onSearchSubmit,
  onSaveSubmit,
  onClose,
  defaultValues,
  isSaving,
  isSearching,
}) => {
  const params = useParams({
    from: "/company/$companyId/customers/search",
  });
  const { t } = useTranslation();
  const {
    handleSubmit,
    register,
    watch,
    reset,
    setValue,
    control,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      assets: {
        account_number: "",
        name: "",
        "metadata->establishment->>name": [],
        group: [],
        category_name: [],
      },
      investments: {
        management_company: [],
        category: [],
        code: "",
        label: "",
      },
      customer_references: {
        tag: [],
      },
    },
  });

  const values = watch();

  const customersSearchFiltersQuery = useQuery({
    queryKey: "customersSearchFilters",
    queryFn: () =>
      gql.client.request(CompanyCustomersSearchLogic.customersSearchFilters(), {
        companyID: params.companyId,
      }),
  });

  useEffect(() => {
    if (!defaultValues) return;

    reset();

    const values = schemaToForm(defaultValues);

    for (const [key, value] of Object.entries(values)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(key as any, value, {
        shouldDirty: true,
      });
    }
  }, [defaultValues]);

  if (customersSearchFiltersQuery.isLoading) {
    return (
      <div className={"flex flex-col justify-center items-center"}>
        <ProgressSpinner
          style={{ width: "50px", height: "50px" }}
          strokeWidth="2"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
        <h2 className={"w-[500px] text-center mt-4 font-medium"}>
          {t("scenes.customersSearch.loadingFilters")}
        </h2>
      </div>
    );
  }

  const emptySelectMessage = (label: string, pre = "de ") => {
    return t("forms.emptySelect", {
      label: label.toLowerCase(),
      pre,
    });
  };

  const filters = customersSearchFiltersQuery.data?.customersSearchFilters;

  const knownTypes = (t("investmentTypes", {
    returnObjects: true,
  }) || {}) as Record<string, string>;

  const investmentTypeOptions = filters?.investmentType
    ?.map((value) => ({
      value: knownTypes[value] ?? value,
      label: knownTypes[value] ? t(`investmentTypes.${value}`) : value,
    }))
    .sort((a, b) => a.label.toLowerCase().localeCompare(b.label));

  const groupOptions = filters?.group
    ?.map((value) => ({
      value,
      label: t(`asset_group.${value}`) || value,
    }))
    .sort((a, b) => a.label.toLowerCase().localeCompare(b.label));

  const categoryOptions = filters?.category
    ?.map((value) => ({
      value,
      label: t([`asset_categories.${value}`, value]) as string,
    }))
    .sort((a, b) => a.label.toLowerCase().localeCompare(b.label));

  return (
    <form
      className="grow flex flex-col justify-between gap-8"
      onSubmit={handleSubmit((data) =>
        onSearchSubmit(formToSchema("wealth", data))
      )}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="py-4 flex-col gap-2 flex">
          <h2 className="font-bold text-xl text-blue-800 mb-4">
            {t("scenes.customersSearch.contract")}
          </h2>

          <CustomersSearchInput
            label={t("scenes.customersSearch.forms.assets.account_number")}
          >
            <FieldText
              className="h-7 bg-[#F8F9FB] border border-[#000000]/30"
              {...register("assets.account_number")}
            />
          </CustomersSearchInput>

          <CustomersSearchInput
            label={t("scenes.customersSearch.forms.assets.name")}
          >
            <FieldText
              className="h-7 bg-[#F8F9FB] border border-[#000000]/30"
              {...register("assets.name")}
            />
          </CustomersSearchInput>

          <CustomersSearchInput
            label={t(
              "scenes.customersSearch.forms.assets.metadata->establishment->>name"
            )}
          >
            <Controller
              control={control}
              name="assets.metadata->establishment->>name"
              render={({ field }) => (
                <MultiSelect
                  className="w-full"
                  placeholder={t("forms.fields.steps.select")}
                  noOptionsMessage={() =>
                    emptySelectMessage(
                      t(
                        "scenes.customersSearch.forms.assets.metadata->establishment->>name"
                      ),
                      "d'"
                    )
                  }
                  options={filters?.insuranceCompany?.map((value) => ({
                    value,
                    label: value,
                  }))}
                  value={(field.value as string[]).map((value) => ({
                    value,
                    label: value,
                  }))}
                  onChange={(value) => {
                    field.onChange(value.map((v) => v.value));
                  }}
                />
              )}
            />
          </CustomersSearchInput>

          <CustomersSearchInput
            label={t("scenes.customersSearch.forms.assets.group")}
          >
            <Controller
              control={control}
              name="assets.group"
              render={({ field }) => (
                <MultiSelect
                  className="w-full"
                  placeholder={t("forms.fields.steps.select")}
                  noOptionsMessage={() =>
                    emptySelectMessage(
                      t("scenes.customersSearch.forms.assets.group")
                    )
                  }
                  options={groupOptions}
                  value={(field.value as string[]).map((value) => ({
                    value,
                    label: t(`asset_group.${value}`),
                  }))}
                  onChange={(value) => {
                    field.onChange(value.map((v) => v.value));
                  }}
                />
              )}
            />
          </CustomersSearchInput>

          <CustomersSearchInput
            label={t("scenes.customersSearch.forms.assets.category_name")}
          >
            <Controller
              control={control}
              name="assets.category_name"
              render={({ field }) => (
                <MultiSelect
                  className="w-full"
                  placeholder={t("forms.fields.steps.select")}
                  noOptionsMessage={() =>
                    emptySelectMessage(
                      t("scenes.customersSearch.forms.assets.category_name")
                    )
                  }
                  options={categoryOptions}
                  value={(field.value as string[]).map((value) => ({
                    value,
                    label: t([`asset_categories.${value}`, value]),
                  }))}
                  onChange={(value) => {
                    field.onChange(value.map((v) => v.value));
                  }}
                />
              )}
            />
          </CustomersSearchInput>
        </div>

        <div className="py-4 flex-col gap-2 flex mb-48">
          <h2 className="font-bold text-xl text-blue-800 mb-4">
            {t("scenes.customersSearch.underlying")}
          </h2>

          <CustomersSearchInput
            label={t(
              "scenes.customersSearch.forms.investments.management_company"
            )}
          >
            <Controller
              control={control}
              name="investments.management_company"
              render={({ field }) => (
                <MultiSelect
                  className="w-full"
                  placeholder={t("forms.fields.steps.select")}
                  noOptionsMessage={() =>
                    emptySelectMessage(
                      t(
                        "scenes.customersSearch.forms.investments.management_company"
                      )
                    )
                  }
                  options={filters?.investmentManagementCompany?.map(
                    (value) => ({
                      value,
                      label: value,
                    })
                  )}
                  value={(field.value as string[]).map((value) => ({
                    value,
                    label: value,
                  }))}
                  onChange={(value) => {
                    field.onChange(value.map((v) => v.value));
                  }}
                />
              )}
            />
          </CustomersSearchInput>

          <CustomersSearchInput
            label={t("scenes.customersSearch.forms.investments.category")}
          >
            <Controller
              control={control}
              name="investments.category"
              render={({ field }) => (
                <MultiSelect
                  className="w-full"
                  placeholder={t("forms.fields.steps.select")}
                  noOptionsMessage={() =>
                    emptySelectMessage(
                      t("scenes.customersSearch.forms.investments.category")
                    )
                  }
                  options={investmentTypeOptions}
                  value={(field.value as string[]).map((value) => ({
                    value,
                    label: t(`investmentTypes.${value}`, value),
                  }))}
                  onChange={(value) => {
                    field.onChange(value.map((v) => v.value));
                  }}
                />
              )}
            />
          </CustomersSearchInput>

          <CustomersSearchInput
            label={t("scenes.customersSearch.forms.investments.code")}
          >
            <FieldText
              className="h-7 bg-[#F8F9FB] border border-[#000000]/30"
              {...register("investments.code")}
            />
          </CustomersSearchInput>

          <CustomersSearchInput
            label={t("scenes.customersSearch.forms.investments.label")}
          >
            <FieldText
              className="h-7 bg-[#F8F9FB] border border-[#000000]/30"
              {...register("investments.label")}
            />
          </CustomersSearchInput>

          <CustomersSearchInput
            label={t("scenes.customersSearch.forms.customer_references.tag")}
          >
            <Controller
              control={control}
              name="customer_references.tag"
              render={({ field }) => (
                <MultiSelect
                  className="w-full"
                  placeholder={t("forms.fields.steps.select")}
                  noOptionsMessage={() =>
                    emptySelectMessage(
                      t("scenes.customersSearch.forms.customer_references.tag"),
                      "d' "
                    )
                  }
                  options={filters?.tags?.map((value) => ({
                    value,
                    label: value,
                  }))}
                  value={(field.value as string[]).map((value) => ({
                    value,
                    label: value,
                  }))}
                  onChange={(value) => {
                    field.onChange(value.map((v) => v.value));
                  }}
                />
              )}
            />
          </CustomersSearchInput>
        </div>
      </div>
      <div className="flex justify-end items-center self-end gap-4">
        <button
          className="disabled:opacity-50"
          onClick={() => reset()}
          type="button"
          disabled={!isDirty}
        >
          <RotateCcw />
        </button>
        <Button
          label={t("forms.fields.actions.save")}
          type="button"
          disabled={!isDirty || isSearching}
          loading={isSaving}
          className=" bg-blue-800 text-white w-32 h-10 rounded-lg py-0"
          onClick={() => onSaveSubmit(formToSchema("wealth", values))}
        />
        <Button
          label={t("forms.fields.actions.search")}
          type="submit"
          disabled={!isDirty || isSaving}
          loading={isSearching}
          className=" bg-blue-800 text-white w-32 h-10 rounded-lg py-0"
        />
        <Button
          label={t("forms.fields.actions.close")}
          type="button"
          className="text-blue-800 bg-white border w-32 h-10 rounded-lg py-0"
          onClick={() => onClose()}
        />
      </div>
    </form>
  );
};
