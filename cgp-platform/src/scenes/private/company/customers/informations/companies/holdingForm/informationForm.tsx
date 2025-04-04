import { HoldingCompanyInfo } from "@shared-schemas/companyHolding";
import { MultiSelect } from "primereact/multiselect";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import { Text } from "../../../../../../../components";
import { getFormErrorMessage } from "../../../../../../../constants";
import { useClaims } from "../../../../../../../hooks/useClaims";
import {
  ManagerClaims,
  ReferenceAccessValue,
} from "../../../../../../../types";
import FieldAmount from "../../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import FieldPercentage from "../../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import { SelectWithRef } from "../../../../../../../UIComponents/Select/Select";
import { CompanyGeneralLogic } from "../../../../settings/office/generalOffice/general.logic";
import { EnteringRelationship } from "../../../conformity/LCB/EnteringRelationship";
import { useCustomerContext } from "../../../customerContext";

export function InformationForm({
  displaySelectBusiness,
}: {
  displaySelectBusiness: boolean;
}) {
  const { t } = useTranslation();
  const [primary, setPrimary] = useState<string>("");
  const [secondary, setSecondary] = useState<ReferenceAccessValue[]>([]);

  const { companyId, customer } = useCustomerContext();

  const claimsQuery = useClaims({ companyID: companyId });

  const listManagers = useQuery(["company", "managers", companyId], async () =>
    CompanyGeneralLogic.managerListQuery(companyId)
  );

  const {
    control,
    formState: { errors },
  } = useFormContext<HoldingCompanyInfo & { tag?: string | null }>();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "managers",
  });

  useEffect(() => {
    const managers = customer?.informations?.general.information?.managers;

    if (managers) {
      setPrimary(
        managers.find((manager: { primary: boolean }) => manager.primary)
          ?.managerID
      );
      setSecondary(
        managers.filter(
          (manager: { primary: boolean }) => !manager.primary
        ) as ReferenceAccessValue[]
      );
    }
  }, [customer]);

  return (
    <div className="flex flex-wrap pl-5">
      {displaySelectBusiness && (
        <div className="flex flex-col w-full gap-2 pt-4">
          <Text
            as="h3"
            className="font-bold text-blue-800"
            label="scenes.customers.details.businessAssets"
          />
          <div className="flex flex-col md:grid grid-cols-2 gap-x-10">
            <Controller
              name="ownership"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor={field.name}>
                    {t("forms.fields.ownership")}
                  </Label>
                  <FieldPercentage
                    id={field.name}
                    {...field}
                    maxVal={100}
                    value={field.value ?? undefined}
                    className="w-full border bg-slate-50"
                    placeholder={t(`forms.fields.ownership`) || ""}
                    type="percent"
                  />
                </div>
              )}
            />
            <Controller
              name="valuation"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor={field.name}>
                    {t("forms.fields.valuation")}
                  </Label>

                  <FieldAmount
                    id={field.name}
                    {...field}
                    value={field.value ?? undefined}
                  />
                </div>
              )}
            />
          </div>
        </div>
      )}

      <EnteringRelationship />

      <div className="flex flex-col w-full gap-2 pt-4">
        <Text
          as="h3"
          className="font-bold text-blue-800"
          label="scenes.customers.details.identity"
        />
        <div className="flex flex-col md:grid grid-cols-2 gap-x-10">
          <Controller
            name="seniorAdvisor"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor="seniorAdvisor">
                  {t("forms.fields.customers.details.seniorAdvisor")}
                </Label>
                <SelectWithRef
                  className="rounded-xl"
                  formatOptionLabel={({ value, label }) => {
                    const manager =
                      listManagers.data?.companyManagersStats?.find(
                        (manager) => manager.id === value
                      );

                    return (
                      <div className="flex items-center gap-2">
                        <span>{label}</span>
                        {manager?.providerCode && (
                          <span className="text-sm text-blue-800">
                            {manager.providerCode}
                          </span>
                        )}
                      </div>
                    );
                  }}
                  menuPortalTarget={document.body}
                  options={listManagers.data?.companyManagersStats
                    ?.filter((manager) => manager.id !== primary)
                    ?.filter(
                      (manager) =>
                        !secondary?.some((sec) => sec.managerID === manager.id)
                    )
                    .map((manager) => ({
                      label: manager.name || "",
                      value: manager.id || "",
                    }))}
                  isDisabled={
                    !claimsQuery.data?.authenticated?.manager?.claims?.includes(
                      ManagerClaims.ClientsReads
                    )
                  }
                  {...field}
                  value={{
                    label:
                      listManagers.data?.companyManagersStats?.find(
                        (manager) => manager.id === primary
                      )?.name ?? "",
                    value: field.value ?? "",
                  }}
                  onChange={(e) => {
                    let selectedManager;
                    if (!e?.value) {
                      selectedManager = fields.filter(
                        (manager) => !manager.primary
                      );
                      replace(selectedManager);
                      setSecondary?.(
                        selectedManager as unknown as ReferenceAccessValue[]
                      );
                    } else {
                      const selectedManager =
                        listManagers.data?.companyManagersStats?.find(
                          (manager) => manager.id === e.value
                        );
                      if (selectedManager) {
                        const currentPrimaryIndex = fields.findIndex(
                          (manager) => manager.primary === true
                        );
                        if (currentPrimaryIndex !== -1) {
                          remove(currentPrimaryIndex);
                        }
                        append({
                          managerID: selectedManager.id,
                          primary: true,
                        });
                      }
                    }
                    setPrimary?.(e?.value as string);
                    field.onChange(e?.value);
                  }}
                />
              </div>
            )}
          />
          <Controller
            name="secondaryAdvisor"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor="secondaryAdvisor">
                  {t("forms.fields.customers.details.secondaryAdvisor")}
                </Label>
                <MultiSelect
                  filter
                  className="rounded-xl"
                  pt={{
                    label: { className: "!py-1.5" },
                    root: { className: "background-blue-800" },
                  }}
                  optionLabel="label"
                  optionValue="value"
                  options={listManagers.data?.companyManagersStats
                    ?.filter((manager) => manager.id !== primary)
                    .map((manager) => ({
                      label: manager.name || "",
                      value: manager.id || "",
                    }))}
                  value={secondary
                    ?.filter((manager) => manager.managerID !== primary)
                    ?.map((selected) => selected.managerID)}
                  onChange={(e) => {
                    let selectedManager;
                    if (!e?.value.length) {
                      selectedManager = fields.filter(
                        (manager) => manager.primary
                      );
                      replace(selectedManager);
                      setSecondary?.(
                        selectedManager as unknown as ReferenceAccessValue[]
                      );
                    } else {
                      const primaryManager = fields.find((m) => m.primary);
                      const newIds = new Set(e.value);
                      const newManagers = [
                        ...(primaryManager &&
                        !newIds.has(primaryManager.managerID)
                          ? [primaryManager]
                          : []),
                        ...Array.from(newIds).map((id) => ({
                          managerID: id as string,
                          primary: false,
                        })),
                      ];
                      replace(newManagers);
                      setSecondary?.(newManagers as ReferenceAccessValue[]);
                    }
                  }}
                />
              </div>
            )}
          />
        </div>
      </div>
      <div className="flex flex-col w-full gap-2 pt-4">
        <Text
          as="h3"
          className="font-bold text-blue-800"
          label="scenes.customers.details.companies.information"
        />
        <div className="flex flex-col md:grid grid-rows-5 grid-cols-2 grid-flow-col gap-x-10 gap-y-4">
          <Controller
            name="socialReason"
            control={control}
            rules={{
              minLength: {
                value: 1,
                message: t(`forms.rules.required`) as string,
              },
            }}
            render={({ field }) => (
              <div>
                <Label htmlFor={field.name}>
                  {t("forms.fields.socialReason")}
                </Label>
                <FieldText id={field.name} {...field} />
                {getFormErrorMessage(field.name, errors)}
              </div>
            )}
          />
          <Controller
            name="siren"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor={field.name}>{t("forms.fields.siren")}</Label>

                <FieldText id={field.name} {...field} />
              </div>
            )}
          />
          <Controller
            name="siret"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor={field.name}>{t("forms.fields.siret")}</Label>

                <FieldText id={field.name} {...field} />
              </div>
            )}
          />
          <Controller
            name="ape"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor={field.name}>{t("forms.fields.ape")}</Label>

                <FieldText id={field.name} {...field} />
              </div>
            )}
          />
          <Controller
            name="creationDate"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor={field.name}>
                  {t("forms.fields.creationDate")}
                </Label>
                <FieldDate
                  id={field.name}
                  {...field}
                  onValueChange={() => {
                    field.onChange;
                  }}
                />
              </div>
            )}
          />
          <Controller
            name="socialCapital"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor={field.name}>
                  {t("forms.fields.socialCapital")}
                </Label>
                <FieldAmount id={field.name} {...field} />
              </div>
            )}
          />
          <Controller
            name="headOfficeAddress"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor={field.name}>
                  {t("forms.fields.headOfficeAddress")}
                </Label>
                <FieldText id={field.name} {...field} />
              </div>
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor={field.name}>{t("forms.fields.phone")}</Label>
                <FieldText id={field.name} {...field} />
              </div>
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor={field.name}>{t("forms.fields.email")}</Label>
                <FieldText id={field.name} type="email" {...field} />
              </div>
            )}
          />
          {!displaySelectBusiness ? (
            <Controller
              name="tag"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor="tag">
                    {t("forms.fields.customers.details.tag")}
                  </Label>
                  <FieldText
                    id="tag"
                    {...field}
                    value={field.value as string}
                  />
                </div>
              )}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
