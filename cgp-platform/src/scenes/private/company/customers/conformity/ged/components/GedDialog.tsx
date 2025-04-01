import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "primereact/checkbox";
import type { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button, Dialog } from "../../../../../../../components";
import { getFormErrorMessage } from "../../../../../../../constants";
import { FieldText } from "../../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../../UIComponents/Label/Label";

export interface GenDialogProps {
  title: string;
  visible: boolean;
  isLoading?: boolean;
  defaultValues?: { name: string; customerVisibility: boolean };
  onSubmit: (data: GenValidationSchema) => void;
  setVisible: Dispatch<
    SetStateAction<
      boolean | { key: string; name: string; customerVisibility: boolean }
    >
  >;
}

const validationSchema = z.object({
  name: z.string({ required_error: "forms.rules.required" }),
  customerVisibility: z.boolean(),
});

type GenValidationSchema = z.infer<typeof validationSchema>;
export function GedDialog({
  title,
  visible,
  isLoading,
  defaultValues,
  onSubmit,
  setVisible,
}: GenDialogProps) {
  const { t } = useTranslation();
  const form = useForm<GenValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const handleSubmit = async (data: GenValidationSchema) => {
    onSubmit(data);
    setVisible(false);
    form.reset();
  };

  return (
    <Dialog
      header={t(title)}
      open={!!visible}
      className="w-96"
      onOpenChange={() => setVisible(false)}
    >
      <form
        onSubmit={form.handleSubmit((data) => handleSubmit(data))}
        className="flex flex-col gap-4"
      >
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => (
            <div>
              <Label
                htmlFor={field.name}
                className="ml-3 font-medium text-xs text-blue-1000"
              >
                {t("forms.fields.name")}
              </Label>
              <FieldText
                id={field.name}
                dataTestId={`add-category-${field.name}-input`}
                {...field}
              />
              {getFormErrorMessage(field.name, form.formState.errors)}
            </div>
          )}
        />
        <Controller
          name="customerVisibility"
          control={form.control}
          render={({ field }) => (
            <div className="mt-2 flex items-center gap-x-3">
              <Checkbox
                inputId={field.name}
                data-testid={`add-category-${field.name}-checkbox`}
                checked={field.value}
                inputRef={field.ref}
                onChange={(e) => field.onChange(e.checked)}
              />
              <label htmlFor={field.name} className="text-nowrap">
                {t("scenes.customers.conformity.tabs.customerVisibility")}
              </label>
            </div>
          )}
        />
        <Button
          type="submit"
          id="add-category-save-button"
          label="forms.fields.actions.save"
          loading={isLoading}
        />
      </form>
    </Dialog>
  );
}
