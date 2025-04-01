import { TFunction } from "i18next";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTableExpandedRows,
  DataTableValueArray,
} from "primereact/datatable";
import { Tooltip } from "primereact/tooltip";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  accessOrderBodyTemplate,
  dateBodyTemplate,
  stateBodyTemplate,
  treatmentBodyTemplate,
} from "../../../../../helpers";
import {
  Document,
  Envelope,
  NotificationRequest,
  NotificationTransport,
} from "../../../../../types";
import { ConformityActionType, ModalActionType } from "./conformityModal";

interface DocumentTableProps {
  documentList: Partial<Document>[];
  t: TFunction;
  onNotification: (params: {
    documentId: string;
    requests: [NotificationRequest];
  }) => void;
  onDocumentDelete: (documentID: string[]) => void;
  setShowDialog: Dispatch<SetStateAction<ModalActionType | undefined>>;
}

export function DocumentTable({
  documentList,
  t,
  setShowDialog,
  onNotification,
  onDocumentDelete,
}: DocumentTableProps) {
  const [selected, setSelected] = useState<Document[]>([]);

  const actionBodyTemplate = (data: Document) => (
    <TableActions
      type="single"
      data={[data]}
      onNotification={onNotification}
      onClick={(type: ConformityActionType) =>
        setShowDialog({
          type,
          payload: {
            document: data,
          },
        })
      }
      onDocumentDelete={onDocumentDelete}
    />
  );

  const header = useMemo(
    () => (
      <div className="flex justify-end">
        {!!selected.length && (
          <TableActions
            data={selected}
            onNotification={onNotification}
            onDocumentDelete={onDocumentDelete}
          />
        )}
      </div>
    ),
    [selected]
  );

  return (
    <DataTable
      selectionMode="checkbox"
      value={documentList}
      tableStyle={{ minWidth: "50rem" }}
      selection={selected}
      onSelectionChange={(e) => setSelected(e.value as Document[])}
      emptyMessage={t(`emptyMessage.noDocument`)}
    >
      <Column selectionMode="multiple" />
      <Column
        field="treatement"
        sortable
        sortField="treatement"
        header={t("scenes.customers.conformity.conformity.state")}
        body={stateBodyTemplate}
      />
      <Column
        field="name"
        sortable
        header={t("forms.fields.document")}
        style={{ width: "40%", padding: 10 }}
        bodyClassName="p-3"
      />
      <Column
        field="expiration"
        sortable
        header={t("forms.fields.tables.validityDate")}
        body={dateBodyTemplate}
        style={{
          width: 150,
        }}
      />
      <Column
        field="treatement"
        header={t("forms.fields.tables.status")}
        body={treatmentBodyTemplate}
        style={{
          width: 90,
        }}
      />
      <Column
        align="right"
        body={actionBodyTemplate}
        header={header}
        headerClassName="header-right"
        style={{
          width: 185,
        }}
      />
    </DataTable>
  );
}

interface EnvelopeTableProps extends Omit<DocumentTableProps, "documentList"> {
  envelopeList: Partial<Envelope>[];
}

export function EnvelopeTable({
  envelopeList = [],
  t,
  ...props
}: EnvelopeTableProps) {
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined);

  const rowExpansionTemplate = (data: Envelope) => (
    <DocumentTable {...props} documentList={data.documentList || []} t={t} />
  );

  const allowExpansion = (rowData: Envelope) => !!rowData?.documentList?.length;

  return (
    <DataTable
      value={envelopeList}
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data)}
      rowExpansionTemplate={rowExpansionTemplate}
      emptyMessage={t(`emptyMessage.noEnvelope`)}
    >
      <Column expander={allowExpansion} style={{ width: "5rem" }} />
      <Column
        field="name"
        header={t("forms.fields.tables.name") as string}
        sortable
      />
      <Column
        field="expiration"
        header={t("forms.fields.tables.validityDate") as string}
        body={dateBodyTemplate}
        style={{
          width: 150,
        }}
      />
      <Column
        header={t("forms.fields.envelopeAccess.title") as string}
        field="access"
        body={accessOrderBodyTemplate}
        style={{
          width: 296,
          textAlign: "right",
        }}
        headerClassName="header-right"
      />
    </DataTable>
  );
}

interface TableActionsProps
  extends Pick<DocumentTableProps, "onNotification" | "onDocumentDelete"> {
  type?: "single" | "multiple";
  data: Document[];
  onClick?: (type: ConformityActionType) => void;
}
// Actions
const TableActions = ({
  type = "multiple",
  data,
  onClick,
  onNotification,
  onDocumentDelete,
}: TableActionsProps) => {
  const { t } = useTranslation();
  const documentIdList = data.map((d) => d.id);

  return (
    <div className="flex justify-end gap-4">
      <Tooltip target=".notification-target-icon" position="top" />
      {type === "single" && (
        <>
          <div>
            <i
              className="notification-target-icon pi pi-search h-4 w-4 cursor-pointer"
              data-pr-tooltip={t("forms.fields.tables.view") as string}
              onClick={() => onClick?.("read")}
            />
          </div>
          <div>
            <i
              className="notification-target-icon pi pi-pencil h-4 w-4 cursor-pointer"
              data-pr-tooltip={t("forms.fields.tables.edit") as string}
              onClick={() => onClick?.("update")}
            />
          </div>
        </>
      )}
      <div>
        <i
          className="notification-target-icon pi pi-envelope h-4 w-4 cursor-pointer"
          data-pr-tooltip={t("forms.fields.tables.sendByEmail") as string}
          onClick={() =>
            onNotification({
              documentId: documentIdList[0],
              requests: [{ transport: NotificationTransport.Mail }],
            })
          }
        />
      </div>
      <div>
        <i
          className="notification-target-icon pi pi-bell h-4 w-4 cursor-pointer"
          data-pr-tooltip={
            t("forms.fields.tables.sendByPushNotification") as string
          }
          onClick={() =>
            onNotification({
              documentId: documentIdList[0],
              requests: [{ transport: NotificationTransport.Push }],
            })
          }
        />
      </div>
      <div>
        <i
          className="notification-target-icon pi pi-trash h-4 w-4 cursor-pointer"
          data-pr-tooltip={t("forms.fields.tables.delete") as string}
          onClick={() =>
            confirm(t("forms.confirm.delete") as string) &&
            onDocumentDelete(documentIdList)
          }
        />
      </div>
    </div>
  );
};
