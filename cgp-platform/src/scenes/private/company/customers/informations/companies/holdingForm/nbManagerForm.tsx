import { Button as PrimereacButton } from "primereact/button";
import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { NbHoldingManagerSchema } from "../../../../../../../../shared/schemas/companyHolding";
import { textAs } from "../../../../../../../components";
import { countriesOptions } from "../../../../../../../constants";
import { clsx } from "../../../../../../../helpers";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import Select, {
  Option,
} from "../../../../../../../UIComponents/Select/Select";

export function NbManagerForm({
  control,
  nb,
}: {
  control: Control<NbHoldingManagerSchema>;
  nb: number;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2 pl-5">
      <div className="flex gap-2 items-center">
        <p className={clsx("font-bold text-blue-800", textAs.h3)}>
          {t("scenes.customers.details.companies.nManagersInformations", {
            nb,
          })}
        </p>
        <PrimereacButton
          size="small"
          type="button"
          icon="pi pi-plus"
          className="rounded-full !w-5 !h-5 !p-0 bg-blue-800"
        />
      </div>

      <div className="flex flex-col md:grid grid-rows-4 grid-cols-2 grid-flow-col gap-x-10 gap-y-4">
        <Controller
          name={`lastNameFirstName-${nb}` as any}
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.lastNameFirstName")}
              </Label>
              <FieldText id={field.name} {...field} />
            </div>
          )}
        />
        <Controller
          name={`function-${nb}` as any}
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>{t("forms.fields.function")}</Label>
              <FieldText id={field.name} {...field} />
            </div>
          )}
        />
        <Controller
          name={`birthDate-${nb}` as any}
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>{t("forms.fields.birthDate")}</Label>
              <FieldDate
                id={field.name}
                {...field}
                onValueChange={field.onChange}
              />
            </div>
          )}
        />
        <Controller
          name={`nationality-${nb}` as any}
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.nationality")}
              </Label>
              <Select
                id={field.name}
                {...field}
                value={countriesOptions?.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => field.onChange(option?.value)}
                options={countriesOptions as Option[]}
              />
            </div>
          )}
        />
        <Controller
          name={`personalAddress-${nb}` as any}
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.personalAddress")}
              </Label>
              <FieldText id={field.name} {...field} />
            </div>
          )}
        />
        <Controller
          name={`personalPhoneNumber-${nb}` as any}
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.personalPhoneNumber")}
              </Label>
              <FieldText id={field.name} {...field} />
            </div>
          )}
        />
        <Controller
          name={`personalEmailAddress-${nb}` as any}
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.personalEmailAddress")}
              </Label>
              <FieldText id={field.name} {...field} type="email" />
            </div>
          )}
        />
      </div>
    </div>
  );
}
