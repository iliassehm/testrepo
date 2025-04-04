import { useParams } from "@tanstack/react-router";
import { Divider } from "primereact/divider";
import { MultiSelect } from "primereact/multiselect";
import { Tree } from "primereact/tree";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import { Button, Dialog } from "../../../../../../components";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { DocumentTemplate } from "../../../../../../types";
import { CustomersConformityLogic } from "../conformity.logic";
import { GedLogic } from "../ged/ged.logic";
import { ConformityStepper } from "./confirmityCreationV2";

interface DocumentTemplateProps {
  selectedDocumentTemplate: DocumentTemplate[];
  setSelectedDocumentTemplate: Dispatch<SetStateAction<DocumentTemplate[]>>;
}

type UploadStepProps = {
  onSubmit: (data: ConformityStepper["step2"]) => void;
  goBack: () => void;
  defaultValues?: ConformityStepper["step2"];
};

export function UploadStep({
  goBack,
  onSubmit,
  defaultValues,
}: UploadStepProps) {
  const [selectedDocumentTemplate, setSelectedDocumentTemplate] = useState<
    DocumentTemplate[]
  >(defaultValues?.selectedDocumentTemplate ?? []);
  const [files, setFiles] = useState<File[]>(defaultValues?.filesUpload ?? []);
  const [selectedGedDocuments, setSelectedGedDocuments] = useState<string[]>(
    defaultValues?.selectedGedDocuments ?? []
  );
  const { t } = useTranslation();
  const [showErrorModal, setShowErrorModal] = useState(false);

  const toast = useToast();

  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  });

  const createFilesMutation = useMutation({
    mutationKey: "createFiles",
    mutationFn: async () => {
      const errors: ConformityStepper["step2"]["errors"] = [];

      const filesFromTemplate =
        selectedDocumentTemplate.length > 0
          ? await gql.client
              .request(CustomersConformityLogic.createFilesFromTemplate(), {
                companyID: companyId as string,
                customerID: customerId as string,
                templates: selectedDocumentTemplate.map(({ id, category }) => ({
                  id,
                  category,
                })),
              })
              .then((res) => {
                return Promise.all(
                  res.createFilesFromTemplate?.map(async (file, i) => {
                    if (!file) {
                      errors.push({
                        document: selectedDocumentTemplate[i].name,
                        type: "template",
                      });
                      return null;
                    }

                    const res = await fetch(file.url);
                    const arrayBuffer = await res.arrayBuffer();

                    return {
                      ...file,
                      file: arrayBuffer,
                    };
                  }) ?? []
                );
              })
          : null;

      const filesFromGED =
        selectedGedDocuments.length > 0
          ? await gql.client
              .request(CustomersConformityLogic.createFilesFromGED(), {
                companyID: companyId as string,
                customerID: customerId as string,
                gedDocumentsID: selectedGedDocuments,
              })
              .then((res) => {
                return Promise.all(
                  res.createFilesFromGedDocuments?.map(async (file, i) => {
                    if (!file) {
                      errors.push({
                        document: selectedGedDocuments[i],
                        type: "ged",
                      });
                      return null;
                    }

                    const res = await fetch(file.url);
                    const arrayBuffer = await res.arrayBuffer();

                    return {
                      ...file,
                      file: arrayBuffer,
                    };
                  }) ?? []
                );
              })
          : null;

      const allFiles: ConformityStepper["step2"]["outputFiles"] = [];

      for (const file of files) {
        const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
        const name = file.name.split(".").shift() ?? "new_document";
        let fileBuffer: ArrayBuffer;

        if (extension === "docx" || extension === "pdf" || extension === "doc")
          fileBuffer = await file.arrayBuffer();
        else continue;

        allFiles.push({
          type: "upload",
          file: fileBuffer,
          name: name,
          extension: extension,
          digitalAction: false,
          category: defaultValues?.defaultCategory ?? "official",
        });
      }

      filesFromTemplate?.forEach((file) => {
        if (!file || !file.name) return;

        allFiles.push({
          type: "template",
          file: file.file,
          name: file.name,
          extension: file.extension,
          category: file.category,
          digitalAction: false,
        });
      });

      filesFromGED?.forEach((file) => {
        if (!file || !file.name) return;

        allFiles.push({
          type: "ged",
          file: file.file,
          name: file.name,
          extension: file.extension,
          category: file.category,
          digitalAction: false,
        });
      });

      if (allFiles.length === 0) {
        throw new Error(t("forms.errors.errorGED"));
      }

      return {
        allFiles,
        errors,
      };
    },
    onSuccess: (res) => {
      if (res.errors.length === 0) {
        onSubmit({
          selectedDocumentTemplate,
          selectedGedDocuments,
          filesUpload: files,
          outputFiles: res.allFiles,
          errors: res.errors,
        });
      } else {
        setShowErrorModal(true);
      }
    },
    onError: (err: Error) => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message,
      });
    },
  });

  return (
    <>
      <div className="flex flex-col h-full items-center">
        <div className="flex justify-between items-center h-full grow">
          <div className="min-w-[400px] flex flex-col items-center justify-center h-full">
            <DocumentTemplateSelection
              selectedDocumentTemplate={selectedDocumentTemplate}
              setSelectedDocumentTemplate={setSelectedDocumentTemplate}
            />
          </div>
          <div className="flex justify-center h-full py-8">
            <Divider layout="vertical" className="h-full" />
          </div>
          <div className="min-w-[400px] flex flex-col items-center justify-center h-full">
            <DocumentGedSelection
              selectedGedDocuments={selectedGedDocuments}
              setSelectedGedDocuments={setSelectedGedDocuments}
            />
          </div>
          <div className="flex justify-center h-full py-8">
            <Divider layout="vertical" className="h-full" />
          </div>
          <div className="min-w-[400px] justify-center flex flex-col h-full">
            <h2 className="mx-auto text-lg mb-4 font-bold">
              {t("forms.fields.upload.label")}
            </h2>
            <div className="flex flex-row justify-center gap-4">
              <label
                htmlFor="fileInput"
                className="w-32 border bg-[#F8F9FB] border-black/30 rounded h-14 cursor-pointer flex justify-center items-center"
              >
                <i className="pi pi-download text-xl" />
              </label>
              <input
                id="fileInput"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                hidden
                onChange={(e) => {
                  if (!e.target.files) return;
                  const filesToAdd: File[] = [];
                  for (let i = 0; i < e.target.files.length; i++) {
                    if (
                      [
                        "application/pdf",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "application/msword",
                      ].includes(e.target.files[i].type)
                    ) {
                      filesToAdd.push(e.target.files[i]);
                    } else {
                      toast.current?.show({
                        severity: "error",
                        summary: t("forms.fields.errorUploadingDocuments"),
                        detail: t("forms.fields.errorUploadingDocumentsFormat"),
                      });
                    }
                  }
                  setFiles((cur) => [...cur, ...filesToAdd]);
                }}
                multiple
              />
            </div>

            {/* <Upload type="multi" {...props} /> */}
            <div className="text-sm mx-auto mt-1">
              <p className="text-center">
                {files?.length} {t("forms.fields.selectedDocuments")}
              </p>
              <div className="mt-4 gap-2 flex flex-col overflow-auto max-h-[170px] w-full">
                {files?.map((e, i) => (
                  <div
                    key={i}
                    className="flex flex-row items-center gap-4 bg-gray-200 rounded px-4 py-2 justify-between w-full"
                  >
                    <p className="overflow-ellipsis line-clamp-1">{e.name}</p>
                    <i
                      className="pi pi-times text-red-500 cursor-pointer"
                      onClick={() => {
                        setFiles((cur) => cur.filter((f) => f.name !== e.name));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
            loading={createFilesMutation.isLoading}
            disabled={
              files.length === 0 &&
              selectedDocumentTemplate.length === 0 &&
              selectedGedDocuments.length === 0
            }
            onClick={() => {
              createFilesMutation.mutate();
            }}
          />
        </div>
      </div>
      <Dialog
        open={showErrorModal}
        onOpenChange={() => setShowErrorModal(false)}
        modal
      >
        <p className="text-red-500 font-bold mt-4 text-lg">
          {t("forms.errors.errorGEDPartial")}
        </p>

        <ul className="list-disc px-4">
          {createFilesMutation.data?.errors?.map((error, i) => (
            <li key={i}>{error.document}</li>
          ))}
        </ul>

        <div className="flex flex-row justify-center mt-4 gap-4">
          <Button
            label="forms.fields.actions.back"
            onClick={() => setShowErrorModal(false)}
            variant="white"
          />
          <Button
            label="forms.fields.actions.continue"
            onClick={() => {
              setShowErrorModal(false);
              onSubmit({
                selectedDocumentTemplate,
                selectedGedDocuments,
                filesUpload: files,
                outputFiles: createFilesMutation.data!.allFiles,
                errors: createFilesMutation.data!.errors,
              });
            }}
          />
        </div>
      </Dialog>
    </>
  );
}

interface DocumentGedProps {
  selectedGedDocuments: string[];
  setSelectedGedDocuments: Dispatch<SetStateAction<string[]>>;
  max?: number;
  envelopeFilter?: boolean;
  categoriesListFilter?: string[];
}
export function DocumentGedSelection({
  selectedGedDocuments,
  setSelectedGedDocuments,
  max,
  envelopeFilter = true,
  categoriesListFilter,
}: DocumentGedProps) {
  const { t, i18n } = useTranslation();
  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  });

  const [keys, setKeys] = useState<Record<string, any>>({});

  const geqQuery = useQuery(
    "gedDocumentList",
    () =>
      gql.client.request(GedLogic.gedDocumentCategoryQuery(), {
        companyID: companyId as string,
        customerID: customerId as string,
      }),
    {
      select: (data) => {
        return data.documentCategoryList
          ?.filter((category) => {
            return (
              category.documents?.some((document) => {
                return envelopeFilter ? !document.envelope : true;
              }) &&
              (!categoriesListFilter ||
                categoriesListFilter.includes(category.name))
            );
          })
          .map((category) => {
            return {
              ...category,
              documents: category.documents?.filter((document) => {
                return envelopeFilter ? !document.envelope : true;
              }),
            };
          });
      },
    }
  );

  const handleSelect = (e: any) => {
    if (max && selectedGedDocuments.length >= max) {
      return;
    }
    setSelectedGedDocuments((cur) => [...cur, e.node.id] as any);
  };

  const handleUnselect = (e: any) => {
    setSelectedGedDocuments((cur) => cur.filter((id) => id !== e.node.id));
  };

  return (
    <div className="justify-content-center flex-col flex">
      <h2 className="mx-auto text-lg mb-4 font-bold">
        {t("forms.fields.chooseFromGED")}
      </h2>

      <Tree
        value={geqQuery.data?.map((category) => ({
          label: i18n.exists(`documentsCategories.${category.name}`)
            ? t(`documentsCategories.${category.name}`)
            : category.name,
          key: category.key,
          selectable: false,

          children: category.documents?.map((document) => ({
            ...document,
            key: document.id,
            label: document.name,
          })),
        }))}
        selectionMode="checkbox"
        selectionKeys={keys}
        onSelect={handleSelect}
        onUnselect={handleUnselect}
        onSelectionChange={(e) => {
          setKeys(e.value as any);
        }}
        className="w-[320px] bg-[#F8F9FB] max-h-[280px] overflow-auto text-sm"
      />
      <p className="text-sm mx-auto mt-1">
        {selectedGedDocuments.length} {t("forms.fields.selectedDocuments")}
      </p>
    </div>
  );
}

function DocumentTemplateSelection({
  selectedDocumentTemplate,
  setSelectedDocumentTemplate,
}: DocumentTemplateProps) {
  const { t } = useTranslation();
  const { companyId } = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  });

  const documentTemplate = useQuery("documentTemplateList", () =>
    gql.client.request(CustomersConformityLogic.envelopDocumentTemplateList(), {
      companyID: companyId as string,
      available: true,
    })
  );

  // sort by name
  const options =
    documentTemplate.data?.documentTemplateList
      ?.filter(doc => !doc.productType)
      ?.sort((a, b) =>
      a.name.localeCompare(b.name)
    ) || [];

  return (
    <div className="justify-content-center flex-col flex">
      <h2 className="mx-auto text-lg mb-4 font-bold">
        {t("forms.fields.chooseDocumentModel")}
      </h2>
      <MultiSelect
        value={selectedDocumentTemplate}
        onChange={(e) =>
          setSelectedDocumentTemplate(e.value as DocumentTemplate[])
        }
        options={options}
        optionLabel="name"
        display="chip"
        placeholder={t("forms.fields.selectFavoriteDocumentTemplate") as string}
        maxSelectedLabels={1}
        className="rem max-w-[320px] bg-[#F8F9FB]"
      />
      <p className="text-sm mx-auto mt-1">
        {selectedDocumentTemplate.length} {t("forms.fields.selectedDocuments")}
      </p>
    </div>
  );
}
