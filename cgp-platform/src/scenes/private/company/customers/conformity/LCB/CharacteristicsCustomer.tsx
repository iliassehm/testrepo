import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { LCBForm } from "../../../../../../../shared/schemas/lcb";
import { Text } from "../../../../../../components";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../UIComponents/Label/Label";
import Select, { Option } from "../../../../../../UIComponents/Select/Select";
import { useCustomerContext } from "../../customerContext";

export const CharacteristicsCustomer = () => {
  const { t } = useTranslation();

  const { control } = useFormContext<LCBForm>();
  const { generalInfosForm } = useCustomerContext();

  const protectiveMeasureList = t(
    "scenes.customers.conformity.lcbFtLab.protectiveMeasureList",
    { returnObjects: true }
  );

  const protectiveMeasures = Object.entries(protectiveMeasureList).map(
    ([, protectiveMeasureName]) => {
      return { value: protectiveMeasureName, label: protectiveMeasureName };
    }
  );

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <Text
          as="h3"
          className="font-bold text-blue-800"
          label={`scenes.customers.conformity.lcbFtLab.characteristicsCustomer`}
        />
        <div className="flex gap-6 w-full">
          <div className="flex items-center justify-between text-blue-1000 w-full">
            <Controller
              name="birthDate"
              control={generalInfosForm.control}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000 w-3/4"
                  >
                    {t(`scenes.customers.conformity.lcbFtLab.birthDate`)}
                  </Label>
                  <FieldDate
                    id={field.name}
                    {...field}
                    onValueChange={() => {
                      field.onChange;
                    }}
                    className="w-full"
                  />
                </>
              )}
            />
          </div>

          <div className="flex items-center justify-between text-blue-1000 w-full">
            <Controller
              name="protectiveMeasure"
              control={control}
              render={({ field }) => (
                <div className="w-full flex items-center gap-2">
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000 w-3/4"
                  >
                    {t(
                      `scenes.customers.conformity.lcbFtLab.protectiveMeasure`
                    )}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={protectiveMeasures.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => {
                      field.onChange(option?.value);
                    }}
                    options={protectiveMeasures as Option[]}
                    className="w-full"
                  />
                </div>
              )}
            />
          </div>

          <div className="flex items-center justify-between text-blue-1000 w-full">
            <Controller
              name="legalRepresentative"
              control={control}
              render={({ field }) => (
                <div className="w-full flex items-center gap-2">
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000 w-3/4"
                  >
                    {t(
                      `scenes.customers.conformity.lcbFtLab.legalRepresentative`
                    )}
                  </Label>
                  <FieldText id={field.name} {...field} className="w-full" />
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};
