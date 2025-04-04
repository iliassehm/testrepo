import { t } from "i18next";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Text } from "../../../../../../../components";
import { matrimonialRegime } from "../../../../../../../constants";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../../../UIComponents/RadioGroup/RadioGroup";
import { Option } from "../../../../../../../UIComponents/Select/Select";
import { PersonalInfoFormData } from "../types";

export default function MaritalSituationForm({
  maritalSituationValue,
  onSubmit,
}: {
  maritalSituationValue?: string;
  onSubmit: (data: PersonalInfoFormData) => void;
}) {
  const maritalStatusOptions: Option[] = Object.entries(matrimonialRegime)
    .map(([value, label]: [string, string]) => ({
      value,
      label,
    }))
    .filter((option) => option.value !== "none");
  const { handleSubmit, control, reset } = useForm<{
    maritalSituation: string;
  }>({
    defaultValues: {
      maritalSituation: maritalSituationValue,
    },
  });
  useEffect(() => {
    reset({ maritalSituation: maritalSituationValue });
  }, [maritalSituationValue, reset]);

  return (
    <div className="flex flex-col space-y-6">
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label={t("scenes.customers.kyc.formsTitle.maritalSituation")}
      />
      <Controller
        name="maritalSituation"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            className="flex flex-wrap gap-8 gap-y-4"
            onValueChange={(value) => {
              field.onChange(value);
              handleSubmit(() => onSubmit({ matrimonialRegime: value }))();
            }}
          >
            {maritalStatusOptions.map((option) => (
              <div
                className="flex items-center space-x-2"
                key={`${option.value}`}
              >
                <RadioGroupItem
                  id={`maritalSituation-${option.value}`}
                  value={`${option.value}`}
                  className="bg-white border-[#04182B]"
                />
                <Label
                  htmlFor={`maritalSituation-${option.value}`}
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
