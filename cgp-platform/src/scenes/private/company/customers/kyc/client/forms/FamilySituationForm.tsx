import { t } from "i18next";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Text } from "../../../../../../../components";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../../../UIComponents/RadioGroup/RadioGroup";
import { Option } from "../../../../../../../UIComponents/Select/Select";
import { PersonalInfoFormData } from "../types";

export default function FamilySituationForm({
  familySituationValue,
  onSubmit,
}: {
  familySituationValue?: string;
  onSubmit: (data: PersonalInfoFormData) => void;
}) {
  const familySituations =
    t("scenes.customers.kyc.familySituation", { returnObjects: true }) || {};

  const familySituationOptions: Option[] = Object.entries(familySituations).map(
    ([value, label]: [string, string]) => ({
      value,
      label,
    })
  );

  const { handleSubmit, control, reset } = useForm<{
    familySituation: string;
  }>({
    defaultValues: { familySituation: familySituationValue },
  });

  useEffect(() => {
    reset({ familySituation: familySituationValue });
  }, [familySituationValue, reset]);

  return (
    <div className="flex flex-col space-y-6">
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label={t("scenes.customers.kyc.formsTitle.familySituation")}
      />
      <Controller
        name="familySituation"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            className="flex flex-wrap gap-8 gap-y-4"
            onValueChange={(value) => {
              field.onChange(value);
              handleSubmit(() => onSubmit({ familySituation: value }))();
            }}
          >
            {familySituationOptions.map((option) => (
              <div
                className="flex items-center space-x-2"
                key={`${option.value}`}
              >
                <RadioGroupItem
                  id={`familySituation-${option.value}`}
                  value={`${option.value}`}
                  className="bg-white border-[#04182B]"
                />
                <Label
                  htmlFor={`familySituation-${option.value}`}
                  className="cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </div>
  );
}
