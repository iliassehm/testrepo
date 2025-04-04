import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { holdingCreationSchema } from "../../../../../../../../shared/schemas/companyHolding";
import { Button } from "../../../../../../../components";
import FieldAmount from "../../../../../../../UIComponents/FieldAmount/FieldAmount";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";

export type HoldingCreationFormData = z.infer<typeof holdingCreationSchema>;

interface HoldingCreationFormProps {
  defaultValues?: HoldingCreationFormData;
  onSubmit: (data: HoldingCreationFormData) => void;
}
export function HoldingCreationForm(props: HoldingCreationFormProps) {
  const { t } = useTranslation();

  const form = useForm<HoldingCreationFormData>({
    defaultValues: props.defaultValues,
  });

  const formSuffix = "holding";

  return (
    <form
      onSubmit={form.handleSubmit(props.onSubmit)}
      className="flex flex-col gap-5 min-w-fit sm:min-w-[400px] m-auto"
    >
      <div className="flex flex-col gap-4">
        <Controller
          name="name"
          control={form.control}
          rules={{ required: true }}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + formSuffix}>
                {t("forms.fields.name")}
              </Label>
              <FieldText id={field.name + formSuffix} {...field} />
            </div>
          )}
        />
        <Controller
          name="siren"
          control={form.control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + formSuffix}>
                {t("forms.fields.siren")}
              </Label>
              <FieldText id={field.name + formSuffix} {...field} />
            </div>
          )}
        />
        <Controller
          name="siret"
          control={form.control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + formSuffix}>
                {t("forms.fields.siret")}
              </Label>
              <FieldText id={field.name + formSuffix} {...field} />
            </div>
          )}
        />
        <Controller
          name="ape"
          control={form.control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + formSuffix}>
                {t("forms.fields.ape")}
              </Label>
              <FieldText id={field.name + formSuffix} {...field} />
            </div>
          )}
        />
        <Controller
          name="creationDate"
          control={form.control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + formSuffix}>
                {t("forms.fields.creationDate")}
              </Label>
              <FieldDate
                id={field.name + formSuffix}
                {...field}
                onValueChange={field.onChange}
              />
            </div>
          )}
        />
        <Controller
          name="legalForm"
          control={form.control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + formSuffix}>
                {t("forms.fields.legalForm")}
              </Label>
              <FieldText
                id={field.name + formSuffix}
                {...field}
                value={field.value ?? ""}
              />
            </div>
          )}
        />
        <Controller
          name="socialCapital"
          control={form.control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + formSuffix}>
                {t("forms.fields.socialCapital")}
              </Label>
              <FieldAmount id={field.name + formSuffix} {...field} />
            </div>
          )}
        />
        <Controller
          name="headOfficeAddress"
          control={form.control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + formSuffix}>
                {t("forms.fields.headOfficeAddress")}
              </Label>
              <FieldText id={field.name + formSuffix} {...field} />
            </div>
          )}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + formSuffix}>
                {t("forms.fields.phone")}
              </Label>
              <FieldText id={field.name + formSuffix} {...field} />
            </div>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + formSuffix}>
                {t("forms.fields.email")}
              </Label>
              <FieldText id={field.name + formSuffix} type="email" {...field} />
            </div>
          )}
        />
        <Controller
          name="holdingAvailability"
          control={form.control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name + formSuffix}>
                {t("forms.fields.holdingAvailability")}
              </Label>
              <FieldText id={field.name + formSuffix} {...field} />
            </div>
          )}
        />
      </div>
      <Button
        type="submit"
        label="forms.fields.actions.save"
        className="m-auto"
      />
    </form>
  );
}
