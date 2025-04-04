import { useParams } from "@tanstack/react-router";
import { TFunction } from "i18next";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

import { Dialog } from "../../../../../components";
import { PdfViewer } from "../../../../../components/ui/PdfViewer";
import { clsx } from "../../../../../helpers";
import { useCustomerUpload } from "../../../../../hooks/useCustomerUpload";
import { Document } from "../../../../../types";
import { DocumentUpdateProps } from "./conformityCreation/commons";
import { ConformityUpdate } from "./ConformityUpdate";

export type ConformityDocumentType = "image" | "pdf" | "other";
export type ConformityActionType = "create" | "read" | "update" | "delete";
export interface ModalActionType {
  type: ConformityActionType;
  payload?: {
    document?: Document;
  };
}

interface ModalProps {
  showDialog?: ModalActionType;
  setShowDialog: Dispatch<SetStateAction<ModalActionType | undefined>>;
  handleDocumentUpdate: (params: DocumentUpdateProps) => void;
  documentIsUpdating: boolean;
  categoryOptions: { label: string; value: string }[];
  t: TFunction<"translation", undefined, "translation">;
}

export function ConformityModal({
  showDialog,
  setShowDialog,
  handleDocumentUpdate,
  documentIsUpdating,
  categoryOptions,
  t,
}: ModalProps) {
  let component: ReactNode;
  const [fullscreen, setFullscreen] = useState(false);
  const document = showDialog?.payload?.document;
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  });

  const uploadMutation = useCustomerUpload(
    {
      companyID: params.companyId as string,
      customerID: params.customerId as string,
    },
    {
      onSuccess: (res) => {
        if (!document) return;

        handleDocumentUpdate({
          id: document?.id,
          update: {
            updatedFile: `${res[0].name}.${res[0].extension}`,
          },
        });
      },
    }
  );

  if (showDialog) {
    if (showDialog.type === "read") {
      const payload = showDialog.payload;

      if (!payload || !document?.url || !payload.document?.extension)
        return null;
      if (payload.document?.extension === "pdf")
        component = (
          <div className={clsx("grow", fullscreen ? "w-full" : "w-[100vh]")}>
            <PdfViewer
              document={document?.url}
              name={document?.name}
              isLoading={uploadMutation.isLoading || documentIsUpdating}
              onSave={(file) =>
                uploadMutation.mutate({
                  files: [file],
                  uploadRequest: [
                    {
                      MIME: file.type,
                      name: file.name,
                    },
                  ],
                })
              }
              className={fullscreen ? "" : "flex flex-col h-[60vh]"}
            />
          </div>
        );
      else if (["png", "jpg"].includes(payload.document.extension))
        component = <img src={document?.url} className="h-full w-full" />;
      else {
        component = <iframe src={document?.url} className="h-full w-full" />;
      }
    } else if (showDialog.type === "update" && document) {
      component = (
        <ConformityUpdate
          document={document}
          onUpdate={handleDocumentUpdate}
          categoryOptions={categoryOptions}
          fullscreen={fullscreen}
          t={t}
        />
      );
    }
  }

  if (!component) return null;

  return (
    <Dialog
      open={!!showDialog}
      onOpenChange={() => setShowDialog(undefined)}
      className="flex flex-col px-8 overflow-visible"
      canFullScreen
      onFullScreenUpdate={setFullscreen}
    >
      {component}
    </Dialog>
  );
}
