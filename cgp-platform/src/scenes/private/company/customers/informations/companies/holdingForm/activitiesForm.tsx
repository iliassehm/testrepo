import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CompanyActivitiesSchema } from "../../../../../../../../shared/schemas/companyHolding";
import { Text } from "../../../../../../../components";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";

export function ActivitiesForm({
  control,
  handleBlur,
}: {
  control: Control<CompanyActivitiesSchema>;
  handleBlur?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2 pl-5">
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="scenes.customers.details.companies.activities"
      />

      <div className="flex flex-col md:grid grid-rows-3 grid-cols-2 grid-flow-col gap-x-10 gap-y-4">
        <Controller
          name="mainActivities"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.mainActivities")}
              </Label>
              <FieldText id="mainActivities" {...field} onBlur={handleBlur} />
            </div>
          )}
        />
        <Controller
          name="secondaryActivities"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.secondaryActivities")}
              </Label>
              <FieldText id={field.name} {...field} onBlur={handleBlur} />
            </div>
          )}
        />
        <Controller
          name="clients"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>{t("forms.fields.clients")}</Label>
              <FieldText id={field.name} {...field} onBlur={handleBlur} />
            </div>
          )}
        />
        <Controller
          name="suppliers"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>{t("forms.fields.suppliers")}</Label>
              <FieldText id={field.name} {...field} onBlur={handleBlur} />
            </div>
          )}
        />
        <Controller
          name="competitors"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.competitors")}
              </Label>
              <FieldText id={field.name} {...field} onBlur={handleBlur} />
            </div>
          )}
        />
      </div>
    </div>
  );
}
