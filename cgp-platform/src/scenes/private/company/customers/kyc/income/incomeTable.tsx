import clsx from "clsx";
import { useTranslation } from "react-i18next";

import Table from "../../../../../../components/Table";
import { DataType } from "../../../../../../components/Table/tableTypes";
import { DeleteWithConfirmationDialog } from "../../../../../../helpers";
import standardTableCell from "../utils/standardTableCell";
import valuationTableCell from "../utils/valuationTableCell";
import { Income } from "./types";

const columnListClassName =
  "bg-blue-800 text-white font-normal border-r-2 border-x-white text-xs";

interface IncomeTableProps {
  incomes?: Income[];
  setShowModal: (income: Income) => void;
  onDelete: (id: Income["id"]) => void;
  incomeType: string;
}

const incomeDataType: Record<string, DataType> = {
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

export default function IncomeTable({
  incomes = [],
  setShowModal,
  onDelete,
  incomeType,
}: IncomeTableProps) {
  const { t } = useTranslation();

  const incomesFiltered = incomes.filter(
    (income) => income.type === incomeType
  );

  if (!(incomesFiltered.length > 0)) return null;

  const ActionBodyTemplate = (income: Income) => {
    return (
      <div className="w-full flex justify-center">
        {editBodyTemplate(income)}
        {deleteBodyTemplate(income)}
      </div>
    );
  };

  const editBodyTemplate = (income: Income) => {
    return (
      <button className="mr-1" onClick={() => setShowModal(income)}>
        <i
          className="notification-target-icon pi pi-pencil h-4 w-4 cursor-pointer"
          data-pr-tooltip={t("forms.fields.tables.edit") as string}
        />
      </button>
    );
  };

  const deleteBodyTemplate = (income: Income) => {
    return (
      <DeleteWithConfirmationDialog
        buttonClassName="!p-0 !py-0 !w-fit !h-fit"
        onClick={() => onDelete(income.id)}
      />
    );
  };

  return (
    <>
      {incomes.length > 0 && (
        <Table
          data={incomesFiltered}
          dataType={incomeDataType}
          className="shadow-none table-fixed mt-4"
          defaultSort="type"
        >
          <Table.Head translationPrefix="forms.fields.tables" />
          {
            <Table.Body>
              {({ data }: { data: Income[] }) =>
                data?.map((income, index) => (
                  <Table.Row
                    key={index}
                    className="even:bg-[#4761C84D] even:hover:bg-[#4761c897]"
                  >
                    <Table.Cell
                      value={standardTableCell(
                        income.type
                          ? t(`forms.fields.budget.${income.name}`)
                          : ""
                      )}
                      className="truncate"
                    />
                    <Table.Cell
                      value={valuationTableCell(income.amount.value ?? 0)}
                      type="amount"
                      className="truncate"
                    />
                    <Table.Cell
                      type="action"
                      value={ActionBodyTemplate(income)}
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
