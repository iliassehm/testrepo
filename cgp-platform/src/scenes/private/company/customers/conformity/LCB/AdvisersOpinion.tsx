import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { LCBForm } from "../../../../../../../shared/schemas/lcb";
import { Text } from "../../../../../../components";
import { FieldTextarea } from "../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../UIComponents/Label/Label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../../UIComponents/RadioGroup/RadioGroup";
import Select from "../../../../../../UIComponents/Select/Select";

export const AdvisersOpinion = () => {
  const { t } = useTranslation();

  const { control } = useFormContext<LCBForm>();

  const classificationForceList = [
    "standard",
    "enhanced",
    "businessRejection",
  ].map((key) => ({
    label: t(`scenes.customers.conformity.lcbFtLab.${key}`),
    value: key,
  }));

  return (
    <div className="flex flex-col gap-2 mt-5">
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="scenes.customers.conformity.lcbFtLab.adviserOpinion"
      />
      <div className="flex flex-col gap-4">
        <div className="flex gap-10 w-full">
          <div className="flex items-center flex-row gap-10 w-2/4">
            <Controller
              name="potentialRisk"
              control={control}
              render={({ field }) => (
                <>
                  <Text
                    className="font-normal text-blue-1000 w-full"
                    label="scenes.customers.conformity.lcbFtLab.potentialRisk"
                  />
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="potentialRisk-true" value="true" />
                      <Label
                        htmlFor="potentialRisk-true"
                        className="cursor-pointer"
                      >
                        {t("scenes.customers.conformity.lcbFtLab.yes")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="potentialRisk-false" value="false" />
                      <Label
                        htmlFor="potentialRisk-false"
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
              name="suspicionTaxFraud"
              control={control}
              render={({ field }) => (
                <>
                  <Text
                    className="font-normal text-blue-1000"
                    label="scenes.customers.conformity.lcbFtLab.suspicionTaxFraud"
                  />
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                    className="flex w-1/4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        id="suspicionTaxFraud-true"
                        value="true"
                      />
                      <Label
                        htmlFor="suspicionTaxFraud-true"
                        className="cursor-pointer"
                      >
                        {t("scenes.customers.conformity.lcbFtLab.yes")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        id="suspicionTaxFraud-false"
                        value="false"
                      />
                      <Label
                        htmlFor="suspicionTaxFraud-false"
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

        <div className="flex gap-6 w-full">
          <div className="flex items-center text-blue-1000 w-1/3">
            <Controller
              name="classificationForce"
              control={control}
              render={({ field }) => (
                <div className="flex w-full items-center gap-2">
                  <Label htmlFor={field.name}>
                    {t(
                      "scenes.customers.conformity.lcbFtLab.classificationForce"
                    )}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={classificationForceList?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => {
                      field.onChange(option?.value);
                    }}
                    options={classificationForceList}
                    className="w-full"
                  />
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex gap-32">
          <Controller
            name="motivation"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-32 w-full">
                <Label htmlFor={field.name} className="text-blue-1100">
                  {t("scenes.customers.conformity.lcbFtLab.motivation")}
                </Label>
                <FieldTextarea id={field.name} {...field} />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};
