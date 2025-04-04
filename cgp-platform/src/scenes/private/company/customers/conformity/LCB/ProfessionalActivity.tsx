import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { LCBForm } from "@shared-schemas/lcb";
import { Text } from "../../../../../../components";
import FieldAmount from "../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { FieldTextarea } from "../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../UIComponents/Label/Label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../../UIComponents/RadioGroup/RadioGroup";
import Select, { Option } from "../../../../../../UIComponents/Select/Select";
import { useCustomerContext } from "../../customerContext";

export const ProfessionalActivity = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<LCBForm>();
  const { generalInfosForm } = useCustomerContext();

  const professionalCategoryList = t(
    "scenes.customers.conformity.lcbFtLab.professionalCategoryList",
    { returnObjects: true }
  );

  const professionalCategories = Object.entries(professionalCategoryList).map(
    ([, professionalCategoryName]) => {
      return {
        value: professionalCategoryName,
        label: professionalCategoryName,
      };
    }
  );
  professionalCategories.unshift({ value: "", label: "" });

  return (
    <>
      <div className="flex flex-col gap-2 w-full mt-5">
        <Text
          as="h3"
          className="font-bold text-blue-800"
          label={`scenes.customers.conformity.lcbFtLab.professionalActivity`}
        />
        <div className="flex flex-col gap-4">
          <div className="flex w-1/3">
            <Controller
              name="professionalCategory"
              control={control}
              render={({ field }) => (
                <div className="flex w-full items-center gap-6">
                  <Label htmlFor={field.name}>
                    {t(
                      "scenes.customers.conformity.lcbFtLab.professionalCategory"
                    )}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={professionalCategories?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => {
                      field.onChange(option?.value);
                    }}
                    options={professionalCategories as Option[]}
                    className="w-full"
                  />
                </div>
              )}
            />
          </div>

          <div className="flex items-center gap-6 w-full">
            <Controller
              name="occupation"
              control={generalInfosForm.control}
              render={({ field }) => (
                <>
                  <Label htmlFor={field.name}>
                    {t("scenes.customers.conformity.lcbFtLab.occupation")}
                  </Label>
                  <FieldText id={field.name} {...field} />
                </>
              )}
            />
            <div className="flex items-center justify-center w-11/12 gap-2">
              <Controller
                name="heritage"
                control={control}
                render={({ field }) => (
                  <>
                    <Label htmlFor={field.name}>
                      {t("scenes.customers.conformity.lcbFtLab.heritage")}
                    </Label>
                    <FieldAmount
                      id={field.name}
                      {...field}
                      value={field.value as number}
                    />
                  </>
                )}
              />
            </div>
            <div className="flex items-center justify-center w-11/12 gap-2">
              <Controller
                name="income"
                control={control}
                render={({ field }) => (
                  <>
                    <Label htmlFor={field.name}>
                      {t("scenes.customers.conformity.lcbFtLab.income")}
                    </Label>
                    <FieldAmount
                      id={field.name}
                      {...field}
                      value={field.value}
                    />
                  </>
                )}
              />
            </div>
          </div>

          <div className="flex gap-10 w-full">
            <div className="flex items-center flex-row gap-10 w-2/4">
              <Controller
                name="consistency"
                control={control}
                render={({ field }) => (
                  <>
                    <Text
                      className="font-normal text-blue-1000 w-1/4"
                      label="scenes.customers.conformity.lcbFtLab.consistency"
                    />
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value as string}
                      className="flex"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="consistency-true" value="true" />
                        <Label
                          htmlFor="consistency-true"
                          className="cursor-pointer"
                        >
                          {t("scenes.customers.conformity.lcbFtLab.yes")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="consistency-false" value="false" />
                        <Label
                          htmlFor="consistency-false"
                          className="cursor-pointer"
                        >
                          {t("scenes.customers.conformity.lcbFtLab.no")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </>
                )}
              />
            </div>

            <div className="flex items-center flex-row gap-10 w-1/2">
              <Controller
                name="riskyActivity"
                control={control}
                render={({ field }) => (
                  <>
                    <Text
                      className="font-normal text-blue-1000 w-1/4"
                      label="scenes.customers.conformity.lcbFtLab.riskyActivity"
                    />
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value as string}
                      className="flex"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="riskyActivity-true" value="true" />
                        <Label
                          htmlFor="riskyActivity-true"
                          className="cursor-pointer"
                        >
                          {t("scenes.customers.conformity.lcbFtLab.yes")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          id="riskyActivity-false"
                          value="false"
                        />
                        <Label
                          htmlFor="riskyActivity-false"
                          className="cursor-pointer"
                        >
                          {t("scenes.customers.conformity.lcbFtLab.no")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </>
                )}
              />
            </div>
          </div>

          <div className="flex items-center flex-row gap-10 w-1/2">
            <Controller
              name="remunerationProof"
              control={control}
              render={({ field }) => (
                <>
                  <Text
                    className="text-blue-1100"
                    label="scenes.customers.conformity.lcbFtLab.remunerationProof"
                  />
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        id="remunerationProof-true"
                        value="true"
                      />
                      <Label
                        htmlFor="remunerationProof-true"
                        className="cursor-pointer"
                      >
                        {t("scenes.customers.conformity.lcbFtLab.yes")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        id="remunerationProof-false"
                        value="false"
                      />
                      <Label
                        htmlFor="remunerationProof-false"
                        className="cursor-pointer"
                      >
                        {t("scenes.customers.conformity.lcbFtLab.no")}
                      </Label>
                    </div>
                  </RadioGroup>
                </>
              )}
            />
          </div>

          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-20">
                <Label htmlFor="comment" className="text-blue-1100">
                  {t("scenes.customers.conformity.lcbFtLab.comment")}
                </Label>
                <FieldTextarea id={field.name} {...field} />
              </div>
            )}
          />
        </div>
      </div>
    </>
  );
};
