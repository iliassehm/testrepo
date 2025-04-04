import { useParams } from "@tanstack/react-router";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import { Button, Select } from "../../../../../../components";
import {
  complianceCategoryName,
  defaultCategories,
} from "../../../../../../constants";
import { gql } from "../../../../../../service/client";
import { DocumentAction } from "../../../../../../types";
import { GedLogic } from "../ged/ged.logic";
import type { ConformityStepper } from "./confirmityCreationV2";

type DocUpdateProps = {
  onSubmit: (data: ConformityStepper["step4"]) => void;
  goBack: () => void;
  defaultValues?: ConformityStepper["step4"];
  files: ConformityStepper["step2"]["outputFiles"];
};

export const DocUpdate: FC<DocUpdateProps> = ({ goBack, onSubmit, files }) => {
  const { t } = useTranslation();
  const [updatedFiles, setUpdatedFiles] =
    useState<ConformityStepper["step4"]["outputFiles"]>(files);

  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  });

  const { data: categories } = useQuery(
    "gedDocumentList",
    () =>
      gql.client.request(GedLogic.gedDocumentCategoryQuery(), {
        companyID: companyId as string,
        customerID: customerId as string,
      }),
    {
      select: (data) => {
        const categories = data.documentCategoryList?.flatMap((category) => {
          return { key: category.key, name: category.name };
        });

        const standartCategories = defaultCategories.filter(
          (category) => !categories?.some((c) => c.key === category.key)
        );

        return [...standartCategories, ...(categories ?? [])];
      },
    }
  );

  return (
    <div className="flex flex-col h-full  items-center">
      <DataTable
        value={updatedFiles}
        editMode="row"
        dataKey="id"
        onRowEditComplete={({ data: oldData, newData }) => {
          const newName = newData.name;

          setUpdatedFiles((prev) => {
            const index = prev.findIndex((f) => f.name === oldData.name);
            const newFiles = [...prev];
            newFiles[index] = { ...newFiles[index], name: newName };
            return newFiles;
          });
        }}
        emptyMessage={t("emptyMessage.noFile")}
        className="grow mt-8"
      >
        <Column
          field="name"
          header={t("forms.fields.name")}
          editor={(options) => (
            <InputText
              type="text"
              value={options.value}
              onChange={(e) => options?.editorCallback?.(e.target.value)}
            />
          )}
        />
        <Column
          rowEditor
          headerStyle={{ width: "10%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          header={t("forms.fields.signators")}
          body={(data) => (
            <MultiSelect
              value={data.signers}
              onChange={(e) => {
                const index = updatedFiles.findIndex(
                  (f) => f.name === data.name
                );
                const newFiles = [...updatedFiles];
                newFiles[index] = { ...newFiles[index], signers: e.value };
                setUpdatedFiles(newFiles);
              }}
              options={[
                {
                  name: t("forms.fields.steps.manager"),
                  signer: DocumentAction.MangagerSigned,
                },
                {
                  name: t("forms.fields.steps.customer"),
                  signer: DocumentAction.CustomerSigned,
                },
              ]}
              optionLabel="name"
              display="chip"
              placeholder={t("forms.fields.steps.select") ?? ""}
              className="md:w-20rem w-full"
            />
          )}
        />
        <Column
          header={t("forms.fields.category")}
          body={(data) => (
            <Select
              name="category"
              options={
                categories?.map((category) => ({
                  value: category.key,
                  label: complianceCategoryName(category.name),
                })) ?? []
              }
              defaultValue={data.category}
              className="min-w-[150px]"
              onChange={(value) => {
                const index = updatedFiles.findIndex(
                  (f) => f.name === data.name
                );
                const newFiles = [...updatedFiles];
                newFiles[index] = {
                  ...newFiles[index],
                  category: value,
                };
                setUpdatedFiles(newFiles);
              }}
            />
          )}
        />

        <Column
          header={t("forms.fields.digitalAction")}
          body={(data) => (
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-gray-600"
              checked={data.digitalAction}
              onChange={(e) =>
                setUpdatedFiles((prev) => {
                  const index = prev.findIndex((f) => f.name === data.name);
                  const newFiles = [...prev];
                  const isChecked = e.target.checked;
                  let signers = newFiles[index].signers ?? [];

                  if (isChecked && !signers.length) {
                    signers = [
                      {
                        name: t("forms.fields.steps.customer"),
                        signer: DocumentAction.CustomerSigned,
                      },
                    ];
                  }

                  newFiles[index] = {
                    ...newFiles[index],
                    digitalAction: isChecked,
                    signers,
                  };
                  return newFiles;
                })
              }
            />
          )}
        />
      </DataTable>

      <div className="flex flex-row mt-5">
        <Button
          label="forms.fields.actions.previous"
          type="button"
          className="mr-4"
          onClick={goBack}
        />
        <Button
          label="forms.fields.actions.next"
          type="submit"
          className="mr-4"
          onClick={() =>
            onSubmit({
              outputFiles: updatedFiles,
            })
          }
        />
      </div>
    </div>
  );
};
