import { useParams } from "@tanstack/react-router";
import type { ClientError } from "graphql-request";
import { ContextMenu } from "primereact/contextmenu";
import type { MenuItem } from "primereact/menuitem";
import { Tooltip } from "primereact/tooltip";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import { type TFunction, useTranslation } from "react-i18next";
import { useMutation } from "react-query";

import { useToast } from "../../../../../../../hooks/useToast";
import { gql } from "../../../../../../../service/client";
import {
  type Document,
  DocumentSignatory,
  type Envelope,
  type EnvelopeUrlQueryVariables,
  type NotificationRequest,
  NotificationTransport,
} from "../../../../../../../types";
import {
  CustomersConformityLogic,
  type EnvelopeAccessURL,
} from "../../conformity.logic";
import type { DocumentUpdateProps } from "../../conformityCreation/commons";
import { ConformityModal, type ModalActionType } from "../../conformityModal";

interface TableActionsProps {
  document: Document;
  categoryOptions: { label: string; value: string }[];
  envelope?: { digital: boolean; id: Envelope["id"] };
  refetch: () => void;
}

export const DocumentActions = ({
  document,
  categoryOptions,
  envelope,
  refetch,
}: TableActionsProps) => {
  const { t } = useTranslation();
  const [showDialog, setShowDialog] = useState<ModalActionType>();
  const {
    documentUpdate,
    documentDeletion,
    documentNotification,
    envelopeURLMutation,
  } = useDocumentActions({
    document,
    t,
    refetch,
    setShowDialog,
  });

  const onViewClick = useCallback(async () => {
    if (!document?.url) return;

    setShowDialog((prev) => ({
      type: "read",
      ...prev,
      payload: {
        document,
      },
    }));
  }, [document]);

  const cm = useRef<ContextMenu>(null);
  let envelopeURL: JSX.Element | null = null;
  if (envelope != null && envelope?.digital === true) {
    const items: MenuItem[] = [];

    if (document.signature?.signatories?.includes(DocumentSignatory.Manager)) {
      items.push({
        label: t("envelope.actions.url.company"),
        icon: "pi pi-copy",
        command: () =>
          envelopeURLMutation.mutate({ access: "company", id: envelope?.id }),
      });
    }

    if (document.signature?.signatories?.includes(DocumentSignatory.Customer)) {
      items.push({
        label: t("envelope.actions.url.customer"),
        icon: "pi pi-copy",
        command: () =>
          envelopeURLMutation.mutate({ access: "customer", id: envelope?.id }),
      });
    }

    envelopeURL = (
      <>
        <Tooltip target=".url-target-icon" position="top" />
        <div>
          <ContextMenu model={items} ref={cm} breakpoint="767px" />
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <i
            className="url-target-icon pi pi-link h-4 w-4 cursor-pointer"
            data-pr-tooltip={t("envelope.actions.url.tooltip") as string}
            onClick={(e) => cm.current?.show(e)}
          />
        </div>
      </>
    );
  }

  return (
    <div className="flex justify-end gap-4">
      {envelopeURL}
      <Tooltip target=".notification-target-icon" position="top" />
      <div>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <i
          className="notification-target-icon pi pi-search h-4 w-4 cursor-pointer"
          data-pr-tooltip={t("forms.fields.tables.view") as string}
          data-testid="document-action-view"
          onClick={onViewClick}
        />
      </div>
      <div>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <i
          className="notification-target-icon pi pi-pencil h-4 w-4 cursor-pointer"
          data-pr-tooltip={t("forms.fields.tables.edit") as string}
          data-testid="document-action-edit"
          onClick={() =>
            setShowDialog({
              type: "update",
              payload: {
                document,
              },
            })
          }
        />
      </div>
      <div>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <i
          className="notification-target-icon pi pi-envelope h-4 w-4 cursor-pointer"
          data-pr-tooltip={t("forms.fields.tables.sendByEmail") as string}
          data-testid="document-action-email"
          onClick={() =>
            documentNotification.mutate({
              documentId: document.id,
              requests: [{ transport: NotificationTransport.Mail }],
            })
          }
        />
      </div>
      <div>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <i
          className="notification-target-icon pi pi-bell h-4 w-4 cursor-pointer"
          data-pr-tooltip={
            t("forms.fields.tables.sendByPushNotification") as string
          }
          data-testid="document-action-notification"
          onClick={() =>
            documentNotification.mutate({
              documentId: document.id,
              requests: [{ transport: NotificationTransport.Push }],
            })
          }
        />
      </div>
      <div>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <i
          className="notification-target-icon pi pi-trash h-4 w-4 cursor-pointer"
          data-pr-tooltip={t("forms.fields.tables.delete") as string}
          data-testid="document-action-delete"
          onClick={() =>
            confirm(t("forms.confirm.delete") as string) &&
            documentDeletion.mutate()
          }
        />
      </div>
      <ConformityModal
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        handleDocumentUpdate={documentUpdate.mutate}
        documentIsUpdating={documentUpdate.isLoading}
        categoryOptions={categoryOptions}
        t={t}
      />
    </div>
  );
};

export function useDocumentActions({
  document,
  t,
  refetch,
  setShowDialog,
}: {
  document?: Document;
  t: TFunction;
  refetch: TableActionsProps["refetch"];
  setShowDialog: Dispatch<SetStateAction<ModalActionType | undefined>>;
}) {
  const toast = useToast();
  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  });

  const documentDeletion = useMutation(
    () =>
      gql.client.request(CustomersConformityLogic.documentDeletion(), {
        companyID: companyId as string,
        customerID: customerId as string,
        documentID: document?.id as string,
      }),
    {
      onSuccess: () => refetch(),
    }
  );

  const envelopeURLMutation = useMutation(
    (data: {
      access: EnvelopeAccessURL;
      id: EnvelopeUrlQueryVariables["id"];
    }) =>
      CustomersConformityLogic.envelopeURL(data.id, data.access, customerId),
    {
      onSuccess: (data, variables) => {
        navigator.clipboard.writeText(
          variables.access === "company"
            ? data.envelope?.companyURL
            : data.envelope?.customerURL
        );
      },
    }
  );

  const documentNotification = useMutation({
    mutationKey: "notifyDocumentStatus",
    mutationFn: (params: {
      documentId: string;
      requests: [NotificationRequest];
    }) =>
      gql.client.request(
        CustomersConformityLogic.NotifyDocumentStatusMutation(),
        {
          documentID: params.documentId,
          requests: params.requests,
        }
      ),
    onSuccess: () => {
      toast?.current?.show({
        severity: "success",
        summary: t("forms.fields.notifications.success.success"),
        detail: t("forms.fields.notifications.success.send"),
      });
    },
    onError: () => {
      toast?.current?.show({
        severity: "error",
        summary: "Error",
        detail: t("forms.fields.notifications.error.send"),
      });
    },
  });

  const documentUpdate = useMutation({
    mutationKey: "documentUpdate",
    mutationFn: ({ id, update }: DocumentUpdateProps) =>
      gql.client.request(CustomersConformityLogic.documentUpdate(), {
        companyID: companyId as string,
        id,
        update,
      }),
    onSuccess: () => {
      refetch();
      setShowDialog(undefined);

      toast?.current?.show({
        severity: "success",
        summary: "Success",
        detail: t("forms.fields.notifications.success.save"),
      });
    },
    onError: (error: ClientError) => {
      const message = error.response.errors?.[0]?.message;

      toast?.current?.show({
        severity: "error",
        ...(message === "DOCUMENT_ALREADY_SIGNED"
          ? {
              detail: t(
                "forms.fields.notifications.error.DOCUMENT_ALREADY_SIGNED"
              ),
            }
          : {
              detail: t("forms.fields.notifications.error.save"),
            }),
      });
    },
  });

  return {
    documentUpdate,
    documentDeletion,
    documentNotification,
    envelopeURLMutation,
  };
}
