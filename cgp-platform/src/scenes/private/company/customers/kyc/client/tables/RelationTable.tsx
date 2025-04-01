import { useTranslation } from "react-i18next";

import { CustomerRelationForm } from "../../../../../../../../shared/schemas/relation";
import Table from "../../../../../../../components/Table";
import { DataType } from "../../../../../../../components/Table/tableTypes";
import {
  clsx,
  DeleteWithConfirmationDialog,
} from "../../../../../../../helpers";
import { Customer } from "../../../../../../../types";
import calculateAge from "../../utils/calculateAge";
import standardTableCell from "../../utils/standardTableCell";

const columnListClassName =
  "bg-blue-800 text-white font-normal border-r-2 border-x-white text-xs";

interface RelationTableProps {
  relations?: CustomerRelationForm[];
  linkedRelations?: Customer[];
  setShowEditModal: (relation: CustomerRelationForm) => void;
  onDelete: (id: CustomerRelationForm["id"]) => void;
}

const relationDataType: Record<string, DataType> = {
  firstName: {
    type: "string",
    sortable: true,
    className: clsx("w-[100px]", columnListClassName),
  },
  lastName: {
    type: "string",
    sortable: true,
    className: clsx("w-[100px]", columnListClassName),
  },
  birthDate: {
    type: "string",
    sortable: true,
    className: clsx("w-12", columnListClassName),
  },
  maritalStatus: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  denomination: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  nationality: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  birthPlace: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  countryOfBirth: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  phone: {
    type: "string",
    sortable: true,
    className: clsx("w-[100px]", columnListClassName),
  },
  linked: {
    type: "string",
    sortable: true,
    className: clsx("w-[100px]", columnListClassName),
  },
  actions: {
    type: "action",
    sortable: false,
    className: clsx("w-14 last:border-r-0", columnListClassName),
  },
};

export default function RelationTable({
  relations = [],
  linkedRelations = [],
  setShowEditModal,
  onDelete,
}: RelationTableProps) {
  const { t } = useTranslation();

  const ActionBodyTemplate = (relation: CustomerRelationForm) => {
    return (
      <div className="w-full flex justify-center">
        {editBodyTemplate(relation)}
        {deleteBodyTemplate(relation)}
      </div>
    );
  };

  const editBodyTemplate = (relation: CustomerRelationForm) => {
    return (
      <button className="mr-1" onClick={() => setShowEditModal(relation)}>
        <i
          className="notification-target-icon pi pi-pencil h-4 w-4 cursor-pointer"
          data-pr-tooltip={t("forms.fields.tables.edit") as string}
        />
      </button>
    );
  };

  const deleteBodyTemplate = (relation: CustomerRelationForm) => {
    return (
      <DeleteWithConfirmationDialog
        buttonClassName="!p-0 !py-0 !w-fit !h-fit"
        onClick={() => onDelete(relation.id)}
        testId={`relation-${relation.id}-delete`}
      />
    );
  };

  return (
    <>
      {relations.length > 0 && (
        <Table
          data={relations}
          dataType={relationDataType}
          className="shadow-none table-fixed mt-4"
          defaultSort="firstName"
        >
          <Table.Head translationPrefix="scenes.customers.kyc.relationTableColumns" />
          {
            <Table.Body>
              {({ data }: { data: CustomerRelationForm[] }) =>
                data?.map((relation, index) => (
                  <Table.Row
                    key={index}
                    className="even:bg-[#4761C84D] even:hover:bg-[#4761c897]"
                  >
                    <Table.Cell
                      value={standardTableCell(relation.firstName)}
                      className="truncate"
                    />
                    <Table.Cell
                      value={standardTableCell(relation.lastName)}
                      className="truncate"
                    />
                    <Table.Cell
                      value={standardTableCell(
                        relation.birthDate
                          ? calculateAge(relation.birthDate.toString()) ?? ""
                          : ""
                      )}
                      className="truncate"
                    />
                    <Table.Cell
                      value={standardTableCell(
                        relation.maritalStatus
                          ? t(`maritalStatus.${relation.maritalStatus}`)
                          : ""
                      )}
                      className="truncate"
                    />
                    <Table.Cell
                      value={standardTableCell(
                        relation.denomination
                          ? t(
                              `scenes.company.settings.denomination.familyStatusList.${relation.denomination}`
                            )
                          : ""
                      )}
                      className="truncate"
                    />
                    <Table.Cell
                      value={standardTableCell(relation.nationality)}
                      className="truncate"
                    />
                    <Table.Cell
                      value={standardTableCell(relation.birthPlace)}
                      className="truncate"
                    />
                    <Table.Cell
                      value={standardTableCell(relation.countryOfBirth)}
                      className="truncate"
                    />
                    <Table.Cell
                      value={standardTableCell(relation.phone)}
                      className="truncate"
                    />
                    <Table.Cell
                      value={standardTableCell(
                        linkedRelations.some((lr) => lr.id === relation.id)
                          ? t("forms.fields.yes")
                          : t("forms.fields.no")
                      )}
                      className="truncate"
                    />
                    <Table.Cell
                      type="action"
                      value={ActionBodyTemplate(relation)}
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
