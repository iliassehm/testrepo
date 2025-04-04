import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CompanyFinancialSchema } from "../../../../../../../../shared/schemas/companyHolding";
import { Text } from "../../../../../../../components";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";

export function BankAccountsForm({
  control,
  handleBlur,
}: {
  control: Control<CompanyFinancialSchema>;
  handleBlur?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2 pl-5">
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="scenes.customers.details.companies.bankAccounts"
      />

      <div className="flex flex-col md:grid grid-rows-2 grid-cols-2 grid-flow-col gap-x-10 gap-y-4">
        <Controller
          name="banks"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>{t("forms.fields.banks")}</Label>
              <FieldText id={field.name} {...field} onBlur={handleBlur} />
            </div>
          )}
        />
        <Controller
          name="iban"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>{t("forms.fields.iban")}</Label>
              <FieldText id={field.name} {...field} onBlur={handleBlur} />
            </div>
          )}
        />
        <Controller
          name="bankAccountNumbers"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.bankAccountNumbers")}
              </Label>
              <FieldText id={field.name} {...field} onBlur={handleBlur} />
            </div>
          )}
        />
        <Controller
          name="bic"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>{t("forms.fields.bic")}</Label>
              <FieldText id={field.name} {...field} onBlur={handleBlur} />
            </div>
          )}
        />
      </div>
    </div>
  );
}
