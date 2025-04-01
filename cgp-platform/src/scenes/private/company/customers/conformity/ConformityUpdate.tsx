import { zodResolver } from "@hookform/resolvers/zod";
import { TFunction } from "i18next";
import { useState } from "react";
import { IFileWithMeta } from "react-dropzone-uploader";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button, Text } from "../../../../../components";
import { Upload } from "../../../../../components/upload";
import { getFormErrorMessage } from "../../../../../constants";
import { addDays } from "../../../../../helpers";
import { Document, DocumentUpdate, Treatement } from "../../../../../types";
import { FieldDate } from "../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../UIComponents/Label/Label";
import Select from "../../../../../UIComponents/Select/Select";
import { DocumentUpdateProps } from "./conformityCreation/commons";

export interface ConformityUpdateProps {
  onUpdate: (params: DocumentUpdateProps) => void;
  document: Document;
  categoryOptions: { label: string; value: string }[];
  fullscreen?: boolean;
  t: TFunction<"translation", undefined, "translation">;
}

const validationSchema = z.object({
  name: z.string({ required_error: "forms.rules.required" }),
  treatement: z.string().trim().min(1, "forms.rules.required"),
  category: z.string().optional(),
  files: z.instanceof(FileList).optional(),
  expirationDate: z.date().optional(),
  importDate: z.date().optional(),
  signingDate: z.date().optional(),
  validatingDate: z.date().optional(),
});
type ValidationSchema = z.infer<typeof validationSchema>;

export const ConformityUpdate = ({
  onUpdate,
  document,
  categoryOptions,
  fullscreen = false,
  t,
}: ConformityUpdateProps) => {
  const [files, setFiles] = useState<IFileWithMeta[]>([]);

  const handleUpload = (meta: IFileWithMeta) => {
    setFiles((files) => [
      ...files.filter((e) => e.file.name !== meta.file.name),
      meta,
    ]);
  };

  const { handleSubmit, watch, control, formState } = useForm<ValidationSchema>(
    {
      defaultValues: {
        treatement: (document.treatement as Treatement) ?? "",
        name: document.name,
        category: document.category.key,
        expirationDate: document.expiration
          ? new Date(document.expiration)
          : undefined,
        importDate: document.created ? new Date(document.created) : undefined,
        signingDate: document.signature?.signed
          ? new Date(document.signature.signed)
          : undefined,
        validatingDate: document.signature?.validated
          ? new Date(document.signature?.validated)
          : undefined,
      },
      resolver: zodResolver(validationSchema),
    }
  );

  const options = [
    {
      label: t("scenes.customers.conformity.conformity.progress") as string,
      value: Treatement.Unvalid,
    },
    {
      label: t("scenes.customers.conformity.conformity.done") as string,
      value: Treatement.Valid,
    },
    {
      label: t("scenes.customers.conformity.conformity.todo") as string,
      value: Treatement.Waiting,
    },
  ];

  const onSubmit = (data: ValidationSchema) => {
    if (!data) return;

    const update: DocumentUpdate = {
      ...data,
      treatement: data.treatement as Treatement,
    };

    if (files) {
      for (let i = 0; i < files.length; i++) {
        files[i].meta.name = data.name;
      }
    }

    onUpdate({
      id: document.id,
      files: files.map((e) => e.file),
      update,
    });
  };

  const watchTreatement = watch("treatement");

  return (
    <div className="w-full">
      <div>
        <Text
          as="h1"
          label="scenes.customers.conformity.conformity.updateDocument"
        />
        <Text label={document.name ?? ""} as="h3" className="font-bold" />
      </div>

      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="mt-4 flex w-full flex-col gap-y-10"
      >
        <div className="flex flex-col gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor={field.name}>{t(`forms.fields.name`)}</Label>
                <div>
                  <FieldText id={field.name} {...field} />
                  {getFormErrorMessage(field.name, formState.errors)}
                </div>
              </div>
            )}
          />

          <div>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000 w-10"
                  >
                    {t("forms.fields.tables.category")}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={categoryOptions?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                    options={categoryOptions}
                  />
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="treatement"
              control={control}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000 w-10"
                  >
                    {t("forms.fields.tables.status")}
                  </Label>
                  <Select
                    id={field.name}
                    {...field}
                    value={options?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                    options={options}
                  />
                  {getFormErrorMessage(field.name, formState.errors)}
                </div>
              )}
            />
          </div>
          <div
            className={`grid gap-4 ${!fullscreen ? "grid grid-cols-1 md:grid-cols-2" : ""}`}
          >
            <Controller
              name="importDate"
              control={control}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000 w-10"
                  >
                    {t("scenes.customers.conformity.conformity.importedThe")}
                  </Label>
                  <FieldDate
                    className="w-full justify-center"
                    id={field.name}
                    {...field}
                    onValueChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              name="expirationDate"
              control={control}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000 w-10"
                  >
                    {t("forms.fields.expirationDate")}
                  </Label>
                  <FieldDate
                    className="w-full justify-center"
                    id={field.name}
                    {...field}
                    onValueChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              name="signingDate"
              control={control}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000 w-10"
                  >
                    {t("scenes.customers.conformity.conformity.signedThe")}
                  </Label>
                  <FieldDate
                    className="w-full justify-center"
                    id={field.name}
                    {...field}
                    onValueChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              name="validatingDate"
              control={control}
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="font-normal text-s text-blue-1000 w-10"
                  >
                    {t("scenes.customers.conformity.conformity.validatedThe")}
                  </Label>
                  <FieldDate
                    className="w-full justify-center"
                    id={field.name}
                    {...field}
                    onValueChange={field.onChange}
                  />
                </div>
              )}
            />
          </div>
        </div>
        <div className="mx-auto w-fit cursor-pointer rounded-md border px-10 py-2 font-bold">
          <Upload
            accept="application/pdf"
            multiple={false}
            onUpload={handleUpload}
          />
        </div>
        <Button
          label={t("forms.fields.actions.update")}
          type="submit"
          className="self-center"
        />
      </form>
    </div>
  );
};
