import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { LCBForm } from "../../../../../../../shared/schemas/lcb";
import { Text } from "../../../../../../components";
import { countriesOptions } from "../../../../../../constants";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { FieldTextarea } from "../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../UIComponents/Label/Label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../../UIComponents/RadioGroup/RadioGroup";
import Select, { Option } from "../../../../../../UIComponents/Select/Select";
import { useCustomerContext } from "../../customerContext";
import { LegalText } from "./LegalText";

export const PersonalInformations = () => {
  const { t } = useTranslation();

  const { control } = useFormContext<LCBForm>();

  const { generalInfosForm, detailsInfosForm } = useCustomerContext();

  return (
    <>
      <div className="flex flex-col gap-2 w-full mt-5">
        <Text
          as="h3"
          className="font-bold text-blue-800"
          label="scenes.customers.conformity.lcbFtLab.personalInformations"
        />
        <div className="flex gap-6 w-full">
          <div className="flex items-center justify-between text-blue-1000 w-full">
            <Controller
              name="nationality"
              control={generalInfosForm.control}
              render={({ field }) => (
                <div className="w-full flex items-center gap-2">
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000"
                  >
                    {t("scenes.customers.conformity.lcbFtLab.nationality")}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={countriesOptions?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => {
                      field.onChange(option?.value);
                    }}
                    options={countriesOptions as Option[]}
                    className="w-full"
                  />
                </div>
              )}
            />
          </div>

          <div className="flex items-center justify-between text-blue-1000 w-full">
            <Controller
              name="secondaryNationality"
              control={generalInfosForm.control}
              render={({ field }) => (
                <div className="w-full flex items-center gap-2">
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000"
                  >
                    {t(
                      "scenes.customers.conformity.lcbFtLab.secondaryNationality"
                    )}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={countriesOptions?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => {
                      field.onChange(option?.value);
                    }}
                    options={countriesOptions as Option[]}
                    className="w-full"
                  />
                </div>
              )}
            />
          </div>

          <div className="flex items-center justify-between text-blue-1000 w-full">
            <Controller
              name="taxResidence"
              control={generalInfosForm.control}
              render={({ field }) => (
                <div className="w-full flex items-center gap-2">
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000"
                  >
                    {t("scenes.customers.conformity.lcbFtLab.taxResidence")}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={countriesOptions?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => {
                      field.onChange(option?.value);
                    }}
                    options={countriesOptions as Option[]}
                    className="w-full"
                  />
                </div>
              )}
            />
          </div>
        </div>
        <>
          <Text
            as="h3"
            className="font-bold text-blue-800"
            label="scenes.customers.details.others"
          />
          <div className="flex gap-6 w-full">
            <Controller
              name="pep"
              control={generalInfosForm.control}
              render={({ field }) => (
                <div>
                  <Text
                    as="h3"
                    className="leading-6 text-blue-1100 font-normal"
                    label="forms.fields.customers.details.pep"
                  />
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value === "true");
                    }}
                    defaultValue={field.value + ""}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="pep-true" value="true" />
                      <Label htmlFor="pep-true">{t("forms.fields.yes")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="pep-false" value="false" />
                      <Label htmlFor="pep-false">{t("forms.fields.no")}</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            />
          </div>
        </>

        {/* LegalTextComponent */}
        <LegalText />

        {/* Adresse */}
        <div className="flex flex-col gap-4 w-full mt-5">
          <div className="flex items-center gap-6 w-full">
            <Controller
              name="street"
              control={detailsInfosForm.control}
              render={({ field }) => (
                <div className="flex items-center gap-2 w-full">
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000 w-fit whitespace-nowrap"
                  >
                    {t("scenes.customers.conformity.lcbFtLab.street")}
                  </Label>
                  <FieldText id={field.name} {...field} className="w-1/2" />
                </div>
              )}
            />
          </div>
          <div className="flex items-center gap-6">
            <Controller
              name="zipCode"
              control={detailsInfosForm.control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000 w-3/4"
                  >
                    {t("scenes.customers.conformity.lcbFtLab.zipCode")}
                  </Label>
                  <FieldText id={field.name} {...field} />
                </div>
              )}
            />
            <Controller
              name="city"
              control={detailsInfosForm.control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000 w-1/10 whitespace-normal"
                  >
                    {t("scenes.customers.conformity.lcbFtLab.city")}
                  </Label>
                  <FieldText id={field.name} {...field} className="w-full" />
                </div>
              )}
            />
          </div>

          <div className="flex items-center w-full">
            <Controller
              name="country"
              control={detailsInfosForm.control}
              render={({ field }) => (
                <div className="flex items-center gap-2 w-full">
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000 w-10"
                  >
                    {t("scenes.customers.conformity.lcbFtLab.country")}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={countriesOptions?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => {
                      field.onChange(option?.value);
                    }}
                    options={countriesOptions as Option[]}
                    className="w-1/3 h-3/4 items-center"
                  />
                </div>
              )}
            />
          </div>
          <div className="flex items-center justify-between w-1/2">
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2 w-8/12">
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-sm w-11 text-blue-1000 whitespace-normal"
                  >
                    {t("scenes.customers.conformity.lcbFtLab.note")}
                  </Label>
                  <FieldTextarea id={field.name} {...field} />
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};
