import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button } from "../../../../../../components";
import { getFormErrorMessage } from "../../../../../../constants";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../UIComponents/Label/Label";
import CampaignInput from "./CampaignInput";
import { ConformityStepper } from "./confirmityCreationV2";

export const envelopSchema = z.object({
  name: z
    .string({ required_error: "forms.rules.required" })
    .min(1, "forms.rules.required"),
  expiration: z.date(),
  campaignId: z.string().nullish(),
});

type EnvelopSchema = z.infer<typeof envelopSchema>;

type EnvelopStepProps = {
  onSubmit: (data: ConformityStepper["step1"]) => void;
  defaultValues?: ConformityStepper["step1"];
};

export function EnvelopStep({ onSubmit, defaultValues }: EnvelopStepProps) {
  const { t } = useTranslation();

  const {
    formState: { errors, isValid },
    control,
    setValue,
    handleSubmit,
  } = useForm<EnvelopSchema>({
    resolver: zodResolver(envelopSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full h-full justify-center pb-[45px] space-y-6"
    >
      <div className="flex flex-col gap-4 grow justify-center">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div className="flex flex-row items-center">
              <Label htmlFor={field.name} className="w-64">
                {t(`forms.fields.name`)}
              </Label>
              <div className="w-64">
                <FieldText
                  id={field.name}
                  {...field}
                  placeholder={t(
                    "scenes.customers.conformity.conformity.form.envelopPlaceholder"
                  )}
                />
                {getFormErrorMessage(field.name, errors)}
              </div>
            </div>
          )}
        />

        <Controller
          name="expiration"
          control={control}
          render={({ field }) => (
            <div className="flex flex-row items-center">
              <Label htmlFor={field.name} className="w-64">
                {t(`forms.fields.tables.validityDate`)}
              </Label>
              <div>
                <FieldDate
                  id={field.name}
                  {...field}
                  onValueChange={field.onChange}
                />
                {getFormErrorMessage(field.name, errors)}
              </div>
            </div>
          )}
        />

        <div className="flex flex-row items-center mb-5">
          <label className="text-base text-blue-1000 w-64">
            {t(`forms.fields.tables.campaignAssignment`)}
          </label>
          <CampaignInput control={control} setValue={setValue} />
        </div>
      </div>

      <div className="flex flex-row justify-center">
        <Button
          label="forms.fields.actions.next"
          type="submit"
          disabled={!isValid}
          className="mr-4"
        />
      </div>
    </form>
  );
}
