import { Tooltip } from "primereact/tooltip";
import { Dispatch, SetStateAction } from "react";
import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { HoldingManagerSchema } from "../../../../../../../../shared/schemas/companyHolding";
import { Text } from "../../../../../../../components";
import { countriesOptions } from "../../../../../../../constants";
import { FieldDate } from "../../../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";
import Select, {
  Option,
} from "../../../../../../../UIComponents/Select/Select";

export function ManagerForm({
  control,
  documentLoading,
  documentName,
  documentURL,
  onRemoveDocument,
  setShowDialogDocumentAdd,
  handleBlur,
}: {
  control: Control<HoldingManagerSchema>;
  setShowDialogDocumentAdd: Dispatch<SetStateAction<boolean>>;
  documentLoading?: boolean;
  documentName?: string;
  documentURL?: string;
  onRemoveDocument: () => void;
  handleBlur?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2 pl-5">
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="scenes.customers.details.companies.managersInformations"
      />

      <div className="flex flex-col md:grid grid-rows-5 grid-cols-2 grid-flow-col gap-x-10 gap-y-4">
        <Controller
          name="lastNameFirstName"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.lastNameFirstName")}
              </Label>
              <FieldText id={field.name} {...field} onBlur={handleBlur} />
            </div>
          )}
        />
        <Controller
          name="function"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>{t("forms.fields.function")}</Label>
              <FieldText id={field.name} {...field} onBlur={handleBlur} />
            </div>
          )}
        />
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>{t("forms.fields.birthDate")}</Label>
              <FieldDate
                id={field.name}
                {...field}
                onValueChange={() => {
                  handleBlur?.();
                }}
              />
            </div>
          )}
        />
        <Controller
          name="nationality"
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
                onChange={(option) => {
                  field.onChange(option?.value);
                  handleBlur?.();
                }}
                options={countriesOptions as Option[]}
              />
            </div>
          )}
        />
        <Controller
          name="personalAddress"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.personalAddress")}
              </Label>
              <FieldText id={field.name} {...field} onBlur={handleBlur} />
            </div>
          )}
        />
        <Controller
          name="personalPhoneNumber"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.personalPhoneNumber")}
              </Label>
              <FieldText id={field.name} {...field} onBlur={handleBlur} />
            </div>
          )}
        />
        <Controller
          name="personalEmailAddress"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.personalEmailAddress")}
              </Label>
              <FieldText
                id={field.name}
                {...field}
                type="email"
                onBlur={handleBlur}
              />
            </div>
          )}
        />
        <Controller
          name="shareholderInformation"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.shareholderInformation")}
              </Label>
              <FieldText id={field.name} {...field} onBlur={handleBlur} />
            </div>
          )}
        />
        <Controller
          name="idCard"
          control={control}
          render={() => (
            <div className="flex justify-between w-full">
              <div>
                <Text
                  as="label"
                  className="leading-6 text-blue-1100 font-normal"
                  label="forms.fields.customers.details.idCard"
                />
              </div>

              <div>
                {documentLoading && (
                  <div className="flex justify-center items-center w-6 h-6text-blue-800">
                    <i className="pi pi-spin pi-spinner text-xs"></i>
                  </div>
                )}
                <a
                  className="leading-6 text-blue-800 font-normal"
                  href={documentURL}
                  target="_blank" // Open in a new tab
                  rel="noopener noreferrer" // Security best practice
                >
                  {documentName}
                </a>
              </div>
              <div className="flex align-center justify-center gap-1">
                <div
                  className="flex justify-center items-center w-6 h-6 rounded-full bg-blue-800 text-white hover:!bg-blue-900 cursor-pointer"
                  id="addDocumentButton"
                  onClick={() => setShowDialogDocumentAdd(true)}
                >
                  <Tooltip target="#addDocumentButton" position="top">
                    {documentName
                      ? t("forms.fields.actions.update")
                      : t("forms.fields.actions.add")}
                  </Tooltip>
                  <i
                    className={`pi ${documentName ? "pi-pencil" : "pi-plus"} text-xs`}
                    style={{ color: "white", fontWeight: "900" }}
                    data-pr-position="left"
                    data-pr-at="left-15 center"
                    data-pr-my="right center"
                  ></i>
                </div>
                {documentName && (
                  <div
                    className="flex justify-center items-center w-6 h-6 rounded-full bg-blue-800 text-white hover:!bg-blue-900 cursor-pointer"
                    id="removeDocumentButton"
                    onClick={() => onRemoveDocument()}
                  >
                    <Tooltip target="#removeDocumentButton" position="top">
                      {t("forms.fields.actions.remove")}
                    </Tooltip>
                    <i
                      className={`pi pi-times text-xs`}
                      style={{ color: "white", fontWeight: "900" }}
                      data-pr-position="left"
                      data-pr-at="left-15 center"
                      data-pr-my="right center"
                    ></i>
                  </div>
                )}
              </div>
            </div>
          )}
        />
        <Controller
          name="idNumber"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="idNumber">
                {t("forms.fields.customers.details.idNumber")}
              </Label>
              <FieldText
                id="idNumber"
                {...field}
                value={field.value as string}
                onBlur={handleBlur}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}
