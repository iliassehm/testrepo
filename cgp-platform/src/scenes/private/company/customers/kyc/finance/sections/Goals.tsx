import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button, Text } from "../../../../../../../components";
import { getFormErrorMessage } from "../../../../../../../constants";
import Checkbox from "../../../../../../../UIComponents/Checkbox/Checkbox";
import FieldAmount from "../../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldTextarea } from "../../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import {
  objectivesFormData,
  ObjectivesFormDataType,
} from "../../../conformity/goals/form";

interface GoalsProps {
  defaultValues: ObjectivesFormDataType;
  isLoading: boolean;
  goalsUpdate: (data: ObjectivesFormDataType) => void;
}
export default function Goals({
  defaultValues: _defaultValues,
  isLoading,
  goalsUpdate,
}: GoalsProps) {
  const { t } = useTranslation();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const goalsFormDataKeys = Object.keys(
    objectivesFormData
  ) as (keyof typeof objectivesFormData)[];

  const defaultValues =
    _defaultValues ??
    [...goalsFormDataKeys].reduce(
      (obj, key) => {
        return {
          ...obj,
          [`${key}Amount`]: 0,
          [`${key}Checkbox`]: false,
        };
      },
      {} as Record<keyof typeof objectivesFormData, null>
    );

  useEffect(() => {
    const newGoals: string[] = [];
    goalsFormDataKeys.forEach((key) => {
      if (defaultValues && defaultValues[`${key}Checkbox`]) newGoals.push(key);
    });
    setSelectedGoals(newGoals);
  }, [_defaultValues]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<ObjectivesFormDataType>({
    defaultValues,
  });

  const _goalsUpdate = (data: ObjectivesFormDataType) => {
    let goalsCheckbox = selectedGoals.reduce((acc, goal) => {
      acc[`${goal}Checkbox`] = 1;

      if (defaultValues[`${goal}`] && getValues([`${goal}`])[0] === null) {
        acc[`${goal}`] = defaultValues[`${goal}`];
      }

      return acc;
    }, {} as ObjectivesFormDataType);
    if (Object.keys(goalsCheckbox).length === 0) {
      goalsCheckbox = goalsFormDataKeys.reduce((acc, key) => {
        acc[`${key}Checkbox`] = 0;
        return acc;
      }, {} as ObjectivesFormDataType);
    }
    goalsUpdate({ ...data, ...goalsCheckbox });
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((i) => i !== goal));
    } else {
      setSelectedGoals(
        [...selectedGoals, goal].sort(
          (a, b) =>
            goalsFormDataKeys.indexOf(a as keyof typeof objectivesFormData) -
            goalsFormDataKeys.indexOf(b as keyof typeof objectivesFormData)
        )
      );
    }
  };

  return (
    <>
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label={t(`scenes.customers.kyc.formsTitle.goals`)}
      />
      <div className="flex flex-wrap gap-4">
        {goalsFormDataKeys.map((goal) => (
          <div
            key={goal}
            data-testid={goal}
            className="inline-flex items-center cursor-pointer"
            onClick={() => toggleGoal(goal)}
          >
            <Checkbox
              id={goal}
              checked={selectedGoals.includes(goal)}
              className="border-[#04182B] bg-white rounded-md data-[state=checked]:bg-blue-800"
            />
            <Label className="ml-2 text-xs text-gray-700 cursor-pointer">
              {t(`forms.fields.conformity.objectives.${goal}`)}
            </Label>
          </div>
        ))}
      </div>
      <form
        className="grid gap-4 grid-cols-1 md:grid-cols-2"
        onSubmit={handleSubmit(_goalsUpdate)}
        name="goals-form"
        id="goals-form"
      >
        {selectedGoals.map((goal) => (
          <div
            className="flex flex-col bg-white p-2 rounded-md gap-4 border border-[#0000004A]"
            key={goal}
          >
            <Label>{t(`forms.fields.conformity.objectives.${goal}`)}</Label>
            <div className="flex gap-4">
              <Controller
                name={`${goal}Amount`}
                control={control}
                defaultValue={defaultValues[`${goal}Amount`]}
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <Label>
                      {t(`forms.fields.conformity.objectives.amount`)}
                    </Label>
                    <FieldAmount
                      id={field.name}
                      data-testid={field.name}
                      {...field}
                      className="border-[#0000004A]"
                    />
                    {getFormErrorMessage(field.name ?? "", errors)}
                  </div>
                )}
              />{" "}
              <Controller
                name={goal}
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-2 w-full">
                    <Label>
                      {t(`forms.fields.conformity.objectives.note`)}
                    </Label>
                    <FieldTextarea
                      id={`${field.name}-note`}
                      data-testid={field.name}
                      {...field}
                      className="border-[#0000004A]"
                      defaultValue={defaultValues[goal]}
                    />
                    {getFormErrorMessage(field.name ?? "", errors)}
                  </div>
                )}
              />{" "}
            </div>
          </div>
        ))}
      </form>
      <Button
        id="goals-submit"
        form="goals-form"
        size="small"
        label={"forms.fields.actions.save"}
        isLoading={isLoading}
      />
    </>
  );
}
