import { zodResolver } from "@hookform/resolvers/zod";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button, Dialog, Select } from "../../../../../../../components";
import { complianceCategoryName } from "../../../../../../../constants";

export interface GenDialogProps {
  title: string;
  visible: boolean;
  isLoading?: boolean;
  onSubmit: (data: GenValidationSchema & { file: File }) => void;
  defaultCategory?: string;
  categories: { key: string; name: string }[];
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const validationSchema = z.object({
  category: z.string({ required_error: "forms.rules.required" }),
  file: z.instanceof(FileList),
});

type GenValidationSchema = z.infer<typeof validationSchema>;

export function GedDialogAdd({
  visible,
  title,
  setVisible,
  isLoading,
  onSubmit,
  categories,
  defaultCategory,
}: GenDialogProps) {
  const { t } = useTranslation();
  const {
    formState: { isValid },
    reset,
    handleSubmit,
    setValue,
    resetField,
    register,
    watch,
  } = useForm<GenValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      category: defaultCategory,
    },
  });

  const formOnSubmit = async (data: GenValidationSchema) => {
    await onSubmit({
      ...data,
      file: data.file[0] as FileList & File,
    });
    setVisible(false);
    reset();
  };

  const file = watch("file");

  return (
    <Dialog
      header={t(title)}
      open={!!visible}
      onOpenChange={() => setVisible(false)}
    >
      <form
        onSubmit={handleSubmit((data) => formOnSubmit(data))}
        className="flex flex-col gap-4 w-96"
      >
        <h2 className="mx-auto text-lg font-bold">
          {t("forms.fields.chooseCategory")}
        </h2>
        <Select
          name="category"
          options={categories.map((category) => ({
            value: category.key,
            label: complianceCategoryName(category.name),
          }))}
          className="min-w-[150px]"
          defaultValue={defaultCategory}
          onChange={(value) => {
            setValue("category", value, {
              shouldValidate: true,
            });
          }}
        />
        <h2 className="mx-auto text-lg font-bold flex flex-col items-center justify-center">
          {t("forms.fields.upload.label")}
        </h2>
        <div className="mx-auto w-fit cursor-pointer rounded-md px-10 py-2 font-bold">
          <label
            htmlFor="fileInput"
            className="w-32 border bg-[#F8F9FB] border-black/30 rounded h-14 cursor-pointer flex justify-center items-center"
          >
            <i className="pi pi-download text-xl" />
          </label>
          <input
            id="fileInput"
            type="file"
            hidden
            accept=".pdf, .docx, .odt"
            {...register("file")}
          />
        </div>
        {file && file.length > 0 ? (
          <div className="gap-2 flex flex-col overflow-auto max-h-[170px] w-full">
            <div className="flex flex-row items-center gap-4 bg-gray-200 rounded px-4 py-2 justify-between w-full">
              <p className="overflow-ellipsis line-clamp-1">{file[0].name}</p>
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
              <i
                className="pi pi-times text-red-500 cursor-pointer"
                onClick={() => {
                  resetField("file");
                }}
              />
            </div>
          </div>
        ) : null}
        <Button
          type="submit"
          label="forms.fields.actions.save"
          disabled={!isValid || isLoading}
          loading={isLoading}
          className="mx-auto"
        />
      </form>
    </Dialog>
  );
}
