import { useTranslation } from "react-i18next";

import Table from "../../../../../../components/Table";
import { DataType } from "../../../../../../components/Table/tableTypes";
import { clsx, DeleteWithConfirmationDialog } from "../../../../../../helpers";
import standardTableCell from "../utils/standardTableCell";
import valuationTableCell from "../utils/valuationTableCell";
import { Charge } from "./types";

const columnListClassName =
  "bg-blue-800 text-white font-normal border-r-2 border-x-white text-xs";

interface ChargeTableProps {
  charges?: Charge[];
  setShowModal: (charge: Charge) => void;
  onDelete: ({
    budgetID,
    budgetName,
  }: {
    budgetID: Charge["id"];
    budgetName?: Charge["name"];
  }) => void;
  chargeType: string;
}

const chargeDataType: Record<string, DataType> = {
  type: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  amount: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  actions: {
    type: "action",
    sortable: false,
    className: clsx("w-14 last:border-r-0", columnListClassName),
  },
};

export default function ChargeTable({
  charges = [],
  setShowModal,
  onDelete,
  chargeType,
}: ChargeTableProps) {
  const { t } = useTranslation();

  const chargesFiltered = charges.filter(
    (charge) => charge.type === chargeType
  );

  if (!(chargesFiltered.length > 0)) return null;

  const ActionBodyTemplate = (charge: Charge) => {
    return (
      <div className="w-full flex justify-center">
        {editBodyTemplate(charge)}
        {deleteBodyTemplate(charge)}
      </div>
    );
  };

  const editBodyTemplate = (charge: Charge) => {
    return (
      <button className="mr-1" onClick={() => setShowModal(charge)}>
        <i
          className="notification-target-icon pi pi-pencil h-4 w-4 cursor-pointer"
          data-pr-tooltip={t("forms.fields.tables.edit") as string}
        />
      </button>
    );
  };

  const deleteBodyTemplate = (charge: Charge) => {
    return (
      <DeleteWithConfirmationDialog
        buttonClassName="!p-0 !py-0 !w-fit !h-fit"
        onClick={() =>
          onDelete({ budgetID: charge.id, budgetName: charge.name })
        }
      />
    );
  };

  return (
    <>
      {charges.length > 0 && (
        <Table
          data={chargesFiltered}
          dataType={chargeDataType}
          className="shadow-none table-fixed mt-4"
          defaultSort="type"
        >
          <Table.Head translationPrefix="forms.fields.tables" />
          {
            <Table.Body>
              {({ data }: { data: Charge[] }) =>
                data?.map((charge, index) => (
                  <Table.Row
                    key={index}
                    className="even:bg-[#4761C84D] even:hover:bg-[#4761c897]"
                  >
                    <Table.Cell
                      value={standardTableCell(
                        charge.type
                          ? t(`forms.fields.budget.${charge.name}`)
                          : ""
                      )}
                      className="truncate"
                    />
                    <Table.Cell
                      value={valuationTableCell(charge.amount.value ?? 0)}
                      type="amount"
                      className="truncate"
                    />
                    <Table.Cell
                      type="action"
                      value={ActionBodyTemplate(charge)}
                    />
                  </Table.Row>
                ))
              }
            </Table.Body>
          }
        </Table>
      )}
    </>
  );
}
