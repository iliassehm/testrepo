import React, { useMemo } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import { AppLogic } from "../../../../../../App/App.logic";
import { Text } from "../../../../../../components";
import { gql } from "../../../../../../service/client";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { FieldTextarea } from "../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../UIComponents/Label/Label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../../UIComponents/RadioGroup/RadioGroup";
import Select from "../../../../../../UIComponents/Select/Select";
import { useCustomerContext } from "../../customerContext";

export function EnteringRelationship({
  showNote = true,
}: {
  showNote?: boolean;
}) {
  const { t } = useTranslation();

  const {
    companyId,
    generalInfosForm: { control },
  } = useCustomerContext();

  const THESEIS_COMPANY_ID_PRODUCTION = "cd394031-415c-4f45-8b32-8ce3ae3b060d";

  const authenticatedQuery = useQuery(
    "authenticated",
    () => gql.client.request(AppLogic.authenticatedQuery()),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const company = useMemo(
    () =>
      authenticatedQuery.data?.authenticated?.manager?.companyList?.find(
        (company) => company?.id === companyId
      ),
    [authenticatedQuery]
  );

  if (authenticatedQuery.isLoading) return null;

  const originCustomerRelationshipList = t(
    "scenes.customers.conformity.lcbFtLab.originCustomerRelationshipList",
    { returnObjects: true }
  );

  const originCustomerRelationships = Object.entries(
    originCustomerRelationshipList
  )
    .filter(function ([key]) {
      if (
        company?.parentCompanyId !== THESEIS_COMPANY_ID_PRODUCTION &&
        (key === "aktifPlusMeeting" || key === "ifbMeeting")
      ) {
        return false;
      }
      return true;
    })
    .map(([_, originCustomerRelationshipName]) => {
      return {
        value: originCustomerRelationshipName,
        label: originCustomerRelationshipName,
      };
    });
  originCustomerRelationships.unshift({ value: "", label: "" });

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className={"col-span-full"}>
          <Text
            as="h3"
            className="font-bold text-blue-800"
            label={`scenes.customers.conformity.lcbFtLab.enteringRelationship`}
          />
        </div>

        <div className="flex items-center text-blue-1000 col-span-1 gap-4">
          <Controller
            name="entryDateIntoRelationship"
            control={control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-normal text-s text-blue-1000"
                >
                  {t(
                    "scenes.customers.conformity.lcbFtLab.entryDateIntoRelationship"
                  )}
                </Label>
                <FieldDate
                  id={field.name}
                  {...field}
                  placeholder="scenes.customers.conformity.lcbFtLab.entryDateIntoRelationship"
                  className={"flex-1"}
                />
              </>
            )}
          />
        </div>

        <div className="flex items-center text-blue-1000 col-span-1 gap-4">
          <Controller
            name="originCustomerRelationship"
            control={control}
            render={({ field }) => {
              if (
                !originCustomerRelationships.find(
                  (option) => option.value === field.value
                ) &&
                field.value
              ) {
                originCustomerRelationships.unshift({
                  value: field.value,
                  label: field.value,
                });
              }
              return (
                <>
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000"
                  >
                    {t(
                      "scenes.customers.conformity.lcbFtLab.originCustomerRelationship"
                    )}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={originCustomerRelationships.find(
                      (option) => option.value === field.value
                    )}
                    options={originCustomerRelationships}
                    onChange={(option) => {
                      field.onChange(option?.value);
                    }}
                    className={"flex-1"}
                  />
                </>
              );
            }}
          />
        </div>

        <div className="flex items-center text-blue-1000 col-span-1 gap-4">
          <Controller
            name="contactCustomerRelationship"
            control={control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-normal text-s text-blue-1000"
                >
                  {t(
                    "scenes.customers.conformity.lcbFtLab.contactCustomerRelationship"
                  )}
                </Label>
                <FieldText
                  id="contactCustomerRelationship"
                  {...field}
                  value={field.value as string}
                  className={"flex-1"}
                />
              </>
            )}
          />
        </div>

        <div className="flex items-center text-blue-1000 col-span-1 gap-4">
          <Controller
            name="dateLastMeeting"
            control={control}
            render={({ field }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className="font-normal text-s text-blue-1000"
                >
                  {t("scenes.customers.conformity.lcbFtLab.dateLastMeeting")}
                </Label>
                <FieldDate
                  id={field.name}
                  {...field}
                  placeholder="scenes.customers.conformity.lcbFtLab.dateLastMeeting"
                  className={"flex-1"}
                />
              </>
            )}
          />
        </div>

        <div className="flex items-center gap-4 col-span-1">
          <Controller
            name="remoteOpening"
            control={control}
            render={({ field }) => (
              <>
                <Text
                  as="h3"
                  className="leading-6 text-blue-1100 font-normal"
                  label="scenes.customers.conformity.lcbFtLab.remoteOpening"
                />
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value === "true");
                  }}
                  defaultValue={field.value + ""}
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="horizontal-true" value="true" />
                    <Label htmlFor="horizontal-true" className="cursor-pointer">
                      {t("forms.fields.yes")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="horizontal-false" value="false" />
                    <Label
                      htmlFor="horizontal-false"
                      className="cursor-pointer"
                    >
                      {t("forms.fields.no")}
                    </Label>
                  </div>
                </RadioGroup>
              </>
            )}
          />
        </div>

        {showNote ? (
          <div className="flex items-center gap-4 col-span-full">
            <Controller
              name="entryIntoRelationshipNote"
              control={control}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000"
                  >
                    {t(
                      "scenes.customers.conformity.lcbFtLab.entryIntoRelationshipNote.label"
                    )}
                  </Label>
                  <FieldTextarea
                    id="entryIntoRelationshipNote"
                    placeholder={t(
                      "scenes.customers.conformity.lcbFtLab.entryIntoRelationshipNote.placeholder"
                    )}
                    {...field}
                  />
                </>
              )}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
