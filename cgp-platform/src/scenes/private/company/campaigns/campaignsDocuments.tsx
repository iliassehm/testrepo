import { useParams, useRouter } from "@tanstack/react-router";
import { TFunction } from "i18next";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";

import {
  dateBodyTemplate,
  stateBodyTemplate,
  treatmentBodyTemplate,
} from "../../../../helpers";
import { Document } from "../../../../types";

interface DocumentTableProps {
  documentList: Partial<Document>[];
  t: TFunction;
}

export function CampaignsDocumentTable({
  documentList,
  t,
}: DocumentTableProps) {
  const router = useRouter();
  const params = useParams({
    from: "/company/$companyId/campaigns",
  });
  const [selected, setSelected] = useState<Document[]>([]);

  return (
    <DataTable
      value={documentList}
      tableStyle={{ minWidth: "50rem" }}
      selection={selected}
      onSelectionChange={(e) => setSelected(e.value as Document[])}
      emptyMessage={t(`emptyMessage.noDocument`)}
      rowClassName={() => "cursor-pointer"}
      cellSelection={false}
      selectionMode="multiple"
      onRowClick={(e) =>
        router.navigate({
          to: "/company/$companyId/customer/$customerId/conformity",
          params: {
            companyId: params.companyId as string,
            customerId: (e.data as Document).customer.id as string,
          },
          search: {
            tab: "conformity",
          },
        })
      }
    >
      <Column
        field="treatement"
        sortable
        sortField="treatement"
        style={{ width: "60px" }}
        header={t("scenes.customers.conformity.conformity.state")}
        body={stateBodyTemplate}
      />
      <Column
        field="name"
        sortable
        header={t("forms.fields.document")}
        style={{ width: "50%" }}
      />
      <Column
        field="expiration"
        sortable
        style={{ width: "20%" }}
        header={t("forms.fields.tables.validityDate")}
        body={dateBodyTemplate}
      />
      <Column
        field="treatement"
        style={{ width: "20%" }}
        header={t("forms.fields.tables.status")}
        body={treatmentBodyTemplate}
      />
      <Column
        field="status"
        style={{ width: "48px" }}
        body={() => <div className="h-4 w-4" />}
      />
    </DataTable>
  );
}
