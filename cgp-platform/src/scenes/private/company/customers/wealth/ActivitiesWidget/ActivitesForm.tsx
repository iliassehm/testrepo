import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Label } from "../../../../../../UIComponents/Label/Label";
import { ActivityByYear, ActivityYearHistoryCreationInput } from "../../../../../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldNumber } from "../../../../../../UIComponents/FieldNumber/FieldNumber";
import { getFormErrorMessage } from "../../../../../../constants";
import FieldPercentage from "../../../../../../UIComponents/FieldPercentage/FieldPercentage";
import FieldAmount from "../../../../../../UIComponents/FieldAmount/FieldAmount";
import { Button } from "../../../../../../components";


export type IActivitiesFormProps = {
    onSubmit(data: ActivityYearHistoryCreationInput): void
    defaultValues?: Partial<ActivityYearHistoryCreationInput> | null | undefined
    mode?: 'create' | 'update'
    abort?(): void
}

export default function ActivitiesForm({
    defaultValues,
    onSubmit,
    abort,
    mode,
}: IActivitiesFormProps) {
    const { handleSubmit, control, formState, watch, getValues } = useForm<ActivityYearHistoryCreationInput>({
        defaultValues: {
            year: new Date().getFullYear(),
            startValue: '0',
            ...defaultValues,
        },
    });
    const { t } = useTranslation();

    return <form className="flex flex-col gap-4" onSubmit={handleSubmit((data) => onSubmit(data))}>
        <Controller
            name="year"
            control={control}
            rules={{ required: t("forms.errors.required") }}
            render={({ field }) => (
                <div className="w-2/3">
                    <Label
                        htmlFor={field.name}
                        className="text-[#4761C8] font-medium"
                    >
                        {t("scenes.wealth.activities.years")}
                    </Label>
                    <FieldNumber
                        id={field.name}
                        className="text-left"
                        {...field}
                        disabled={mode === 'update'}
                        value={field.value}
                    />
                    {getFormErrorMessage(field.name, formState.errors)}
                </div>
            )}
        />
        <div className="grid grid-cols-2 gap-4">
            <Controller
                name="startValue"
                control={control}
                rules={{ required: t("forms.errors.required") }}
                render={({ field }) => (
                    <div>
                        <Label
                            htmlFor={field.name}
                            className="text-[#4761C8] font-medium"
                        >
                            {t("scenes.wealth.activities.startValue")}
                        </Label>
                        <FieldAmount id={field.name} {...field} value={field.value || 0} />
                        {getFormErrorMessage(field.name, formState.errors)}
                    </div>
                )}
            />
            <Controller
                name="endValue"
                control={control}
                render={({ field }) => (
                    <div>
                        <Label
                            htmlFor={field.name}
                            className="text-[#4761C8] font-medium"
                        >
                            {t("scenes.wealth.activities.endValue")}
                        </Label>
                        <FieldAmount id={field.name} {...field} value={field.value || 0} />
                        {getFormErrorMessage(field.name, formState.errors)}
                    </div>
                )}
            />
        </div>
        <div className="flex justify-end gap-4 mt-4">
            {abort ? (
                <Button
                    type="button"
                    variant="white"
                    label="forms.fields.actions.cancel"
                    onClick={abort}
                />
            ) : null}
            <Button
                type="submit"
                label={mode === 'update' ?
                    "forms.fields.actions.update" :
                    "forms.fields.actions.create"}
            />
        </div>
    </form>
}
