import type { DocumentEditorContainerComponent } from "@syncfusion/ej2-react-documenteditor";
import type { PdfViewerComponent } from "@syncfusion/ej2-react-pdfviewer";
import { useParams } from "@tanstack/react-router";
import clsx from "clsx";
import type { Dispatch, FC, SetStateAction } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";

import {
  TEMPLATE_VARIABLES_FRONTEND,
  wealthcomeSignatureZone,
} from "../../../../../../../shared/contants/templateVariables";
import { Button } from "../../../../../../components";
import { DocxViewer } from "../../../../../../components/ui/DocxViewer";
import { PdfViewer } from "../../../../../../components/ui/PdfViewer";
import { populateTemplateVariables } from "../../../../../../components/VariableViewersSidebar/utils";
import { DocumentExtension } from "../../../../../../constants";
import { useCustomerUpload } from "../../../../../../hooks/useCustomerUpload";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { CustomersConformityLogic } from "../conformity.logic";
import type { ConformityForm, ConformityStepper } from "./confirmityCreationV2";

type DocConfigurationProps = {
  onSubmit: (data: ConformityStepper["step3"]) => void;
  goBack?: () => void;
  files: ConformityForm["files"];
  projectID?: string;
  setAddParagraphs?: Dispatch<SetStateAction<boolean>>;
};

export const DocConfiguration: FC<DocConfigurationProps> = ({
  files,
  goBack,
  onSubmit,
  projectID,
  setAddParagraphs,
}) => {
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  const pdfViewerRef = useRef<PdfViewerComponent | null>(null);
  const editorsRef = useRef<Record<number, DocumentEditorContainerComponent>>(
    {}
  );
  const toast = useToast();

  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  });

  const customerUpload = useCustomerUpload({
    companyID: companyId as string,
    customerID: customerId as string,
  });

  const convertToPdfMutation = useMutation({
    mutationFn: async (fileUrl: string) => {
      const cleanUrl = fileUrl.split("?")[0];

      const { convertDocumentToPdf } = await gql.client.request(
        CustomersConformityLogic.documentToPdf(),
        {
          companyID: companyId,
          customerID: customerId,
          fileUrl: cleanUrl,
        }
      );

      return convertDocumentToPdf;
    },
    onError: () => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to convert document to PDF",
      });
    },
  });

  const templateVariablesQuery = useQuery(
    ["templateVariables", companyId, customerId, projectID],
    async () => {
      const response = await gql.client.request(
        CustomersConformityLogic.templateVariables(),
        {
          companyID: companyId,
          customerID: customerId,
          projectID,
        }
      );
      return response.templateVariables;
    }
  );

  const populatedVariables = useMemo(() => {
    if (templateVariablesQuery.isLoading) return null;
    return populateTemplateVariables(
      TEMPLATE_VARIABLES_FRONTEND,
      templateVariablesQuery.data ?? []
    );
  }, [templateVariablesQuery]);

  const convertDocumentMutation = useMutation({
    mutationFn: async () => {
      const finalFiles = [];
      2;
      for (const [index, file] of files.entries()) {
        if ([DocumentExtension.DOCX, "docx", "doc"].includes(file.extension)) {
          const editor = editorsRef.current[index];

          if (!editor) {
            throw new Error(`Failed to get editor instance for file ${index}`);
          }

          try {
            const blob = await addStyleToSignatureZone(editor);

            if (!blob || blob.size === 0) {
              throw new Error("Failed to get modified document content");
            }

            const docxFile = new File([blob], `${file.name}.docx`, {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });

            const uploadResult = await customerUpload.mutateAsync({
              uploadRequest: [
                {
                  name: docxFile.name,
                  MIME: docxFile.type,
                },
              ],
              files: [docxFile],
            });

            if (!uploadResult[0]?.url) {
              throw new Error("Failed to upload DOCX file");
            }

            const pdfUrl = await convertToPdfMutation.mutateAsync(
              uploadResult[0].url
            );
            const response = await fetch(pdfUrl);
            const pdfBuffer = await response.arrayBuffer();

            finalFiles.push({
              ...file,
              extension: "pdf",
              file: pdfBuffer,
            });
          } catch (error) {
            throw new Error("Error processing file", { cause: error });
          }
        } else if (file.extension === DocumentExtension.PDF) {
          finalFiles.push(file);
        } else {
          throw new Error("Unsupported file extension");
        }
      }

      return finalFiles;
    },
    onSuccess: (convertedFiles) => {
      onSubmit({ outputFiles: convertedFiles });
    },
    onError: () => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to convert document",
      });
    },
  });

  useEffect(() => {
    files.forEach((file, index) => {
      if (file.extension === DocumentExtension.PDF) {
        try {
          const blob = new Blob([file.file], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setDocumentUrls((prev) => {
            const newUrls = [...prev];
            newUrls[index] = url;
            return newUrls;
          });

          return () => {
            URL.revokeObjectURL(url);
          };
        } catch (error) {
          console.error("Error creating PDF URL:", error);
        }
      }
    });
  }, [files]);

  return (
    <div className="w-full h-full grid grid-rows-[auto,_minmax(0,_1fr)] shrink overflow-hidden">
      <div className="flex justify-between items-center max-w-[100vw]">
        <div className="flex grow flex-nowrap overflow-y-auto">
          {files.map((file, index) => (
            <div
              key={file.name}
              className={clsx(
                "min-w-[200px] px-6 first:pl-4 py-1.5 -mr-2 rounded-tr-lg border border-b-0 border-l-0 cursor-pointer bg-gray-50",
                currentFileIndex === index
                  ? "!bg-blue-800 border-blue-800 text-white"
                  : "bg-gray-50 hover:bg-gray-200 border-gray-200"
              )}
              style={{ zIndex: files.length - index }}
              onClick={() => setCurrentFileIndex(index)}
            >
              <div
                className={clsx(
                  "text-xs font-light italic",
                  currentFileIndex === index ? "text-white" : "text-gray-600"
                )}
              >
                {file.extension}
              </div>
              <div className="text-sm font-light max-w-[256px] truncate">
                {file.name}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 shrink-0 gap-1 ml-5 mr-5">
          {goBack && (
            <Button
              label="forms.fields.actions.previous"
              type="button"
              size="medium"
              className="w-full h-fit"
              onClick={goBack}
            />
          )}
          <Button
            label="forms.fields.actions.next"
            type="button"
            size="medium"
            className="w-full h-fit"
            loading={convertToPdfMutation.isLoading || customerUpload.isLoading}
            onClick={() => convertDocumentMutation.mutate()}
          />
        </div>
      </div>
      <div className="relative h-full w-full shrink">
        {files.map((file, index) => {
          if ([DocumentExtension.DOCX, "docx", "doc"].includes(file.extension))
            return (
              <DocxViewer
                key={file.name}
                ref={(el) => {
                  if (el) editorsRef.current[index] = el;
                }}
                document={file.file}
                templateVariables={populatedVariables}
                setAddParagraphs={setAddParagraphs}
                className={
                  currentFileIndex === index
                    ? ""
                    : "absolute -top-full -left-full opacity-0"
                }
              />
            );
          if (file.extension === DocumentExtension.PDF)
            return (
              <PdfViewer
                ref={pdfViewerRef}
                document={documentUrls[index]}
                name={file.name}
                className={
                  currentFileIndex === index
                    ? "h-full"
                    : "absolute -top-full -left-full opacity-0"
                }
              />
            );
          return null;
        })}
      </div>
    </div>
  );
};

async function addStyleToSignatureZone(
  editor: DocumentEditorContainerComponent
) {
  if (!editor) return;

  editor.documentEditor.search.findAll(wealthcomeSignatureZone, "None");

  const list = editor.documentEditor.search.textSearchResults.length;

  for (let i = 0; i < list; i++) {
    editor.documentEditor.search.searchResults.index = i;

    editor.documentEditor.editor.createStyle(
      JSON.stringify({
        type: "Character",
        name: "New CharacterStyle",
        basedOn: "Default Paragraph Font",
        characterFormat: {
          fontColor: "#ffffff",
        },
      }),
      true
    );
    editor.documentEditor.editorModule.applyStyle("New CharacterStyle", true);
  }

  const blob = await editor.documentEditor.saveAsBlob("Docx");

  return blob;
}
