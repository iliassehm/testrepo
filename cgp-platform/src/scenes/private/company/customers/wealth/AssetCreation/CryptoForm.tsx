import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "../../../../../../components";
import { Widget } from "../../../../../../components/Widget";
import { AssetGroup, Customer, CustomerAsset } from "../../../../../../types";
import { FieldTextarea } from "../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { Label } from "../../../../../../UIComponents/Label/Label";

interface CryptoFormData {
  metadata: { comment: string };
}

export const CryptoForm = ({
  asset,
  onSubmit,
  isLoading,
}: {
  asset?: CustomerAsset;
  onSubmit: (data: CryptoFormData) => void;
  type: AssetGroup;
  isLoading?: boolean;
}) => {
  const defaultValues: CryptoFormData = {
    metadata: { comment: asset?.metadata?.comment ?? "" },
  };

  const form = useForm({
    defaultValues,
  });

  const { control, formState, handleSubmit } = form;
  const { t } = useTranslation();

  return (
    <Widget className="pt-4">
      <form
        className="flex flex-col items-center"
        onSubmit={handleSubmit((data) => onSubmit({ ...data }))}
      >
        <div className="grid mt-6 w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
          <div className="col-span-2 md:col-span-3 md:col-start-2">
            <Controller
              name="metadata.comment"
              control={control}
              render={({ field }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className="ml-3 font-medium text-xs text-blue-1000"
                  >
                    {t(`forms.fields.wealth.comment`)}
                  </Label>
                  <FieldTextarea
                    className="pl-2 pr-2"
                    id={field.name}
                    {...field}
                    value={field.value as string}
                  />
                </>
              )}
            />
          </div>
        </div>
        <Button
          label={
            asset?.id
              ? t(`forms.fields.actions.update`)
              : t(`forms.fields.actions.add`)
          }
          type="submit"
          icon="pi pi-plus"
          className="mx-auto mt-10"
          loading={isLoading}
        />
      </form>
    </Widget>
  );
};
