import { useTranslation } from "react-i18next";

import Table from "../../../../../../../components/Table";
import { DataType } from "../../../../../../../components/Table/tableTypes";
import {
  clsx,
  DeleteWithConfirmationDialog,
  formatDate,
} from "../../../../../../../helpers";
import { AppartmentType, CustomerAsset } from "../../../../../../../types";
import standardTableCell from "../../utils/standardTableCell";
import valuationTableCell from "../../utils/valuationTableCell";

const columnListClassName =
  "bg-blue-800 text-white font-normal border-r-2 border-x-white text-xs";

interface RealEstateTableProps {
  assets?: CustomerAsset[];
  setShowModal: (asset: CustomerAsset) => void;
  onDelete: (id: CustomerAsset["id"]) => void;
  loans?: CustomerAsset[];
}

const assetsDataType: Record<string, DataType> = {
  name: {
    type: "string",
    sortable: true,
    className: clsx("w-[100px]", columnListClassName),
  },
  category: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  source: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  typeId: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  buyingDate: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  price: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  ownership: {
    type: "string",
    sortable: true,
    className: clsx("w-[90px]", columnListClassName),
  },
  annualRevenus: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  value: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  loanName: {
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

export default function RealEstateTable({
  assets = [],
  setShowModal,
  onDelete,
  loans,
}: RealEstateTableProps) {
  const { t } = useTranslation();
  const housingOptions = [
    {
      label: t(`forms.fields.wealth.realEstate.type.apartment`) as string,
      value: AppartmentType.Simplex,
    },
    {
      label: t(`forms.fields.wealth.realEstate.type.home`) as string,
      value: AppartmentType.House,
    },
    {
      label: t(`forms.fields.wealth.realEstate.type.land`) as string,
      value: AppartmentType.Land,
    },
  ];

  const ActionBodyTemplate = (asset: CustomerAsset) => {
    return (
      <div className="w-full flex justify-center">
        {editBodyTemplate(asset)}
        {deleteBodyTemplate(asset)}
      </div>
    );
  };

  const editBodyTemplate = (asset: CustomerAsset) => {
    return (
      <button className="mr-1" onClick={() => setShowModal(asset)}>
        <i
          className="notification-target-icon pi pi-pencil h-4 w-4 cursor-pointer"
          data-pr-tooltip={t("forms.fields.tables.edit") as string}
        />
      </button>
    );
  };

  const deleteBodyTemplate = (asset: CustomerAsset) => {
    return (
      <DeleteWithConfirmationDialog
        buttonClassName="!p-0 !py-0 !w-fit !h-fit"
        onClick={() => onDelete(asset.id)}
      />
    );
  };
  return (
    <>
      {assets.length > 0 && (
        <Table
          data={assets}
          dataType={assetsDataType}
          className="shadow-none table-fixed mt-4"
          defaultSort="name"
        >
          <Table.Head translationPrefix="scenes.customers.kyc.realEstateTableColumns" />

          <Table.Body>
            {({ data }: { data: CustomerAsset[] }) =>
              data?.map((asset, index) => {
                let loanedAmount = 0;
                loans?.forEach((e) => {
                  if (
                    e.name === asset.name &&
                    e.metadata?.settledLoan === false
                  ) {
                    loanedAmount += e.metadata?.loanedAmount;
                  }
                });
                return (
                  <Table.Row
                    key={index}
                    className="even:bg-[#4761C84D] even:hover:bg-[#4761c897]"
                  >
                    <Table.Cell
                      value={standardTableCell(asset.name)}
                      className="truncate"
                    />
                    <Table.Cell
                      value={standardTableCell(
                        asset.categoryName
                          ? t(`asset_categories.${asset.categoryName}`)
                          : ""
                      )}
                      className="truncate"
                    />
                    <Table.Cell
                      value={standardTableCell(asset.metadata?.source ?? "")}
                      className="truncate"
                    />
                    <Table.Cell
                      value={standardTableCell(
                        housingOptions.find(
                          (e) => e.value === asset.metadata?.typeId
                        )?.label ?? ""
                      )}
                      className="truncate"
                    />
                    <Table.Cell
                      value={standardTableCell(
                        formatDate(asset.metadata?.buyingDate) ?? ""
                      )}
                      className="truncate"
                    />
                    <Table.Cell
                      type="amount"
                      className="truncate"
                      value={valuationTableCell(asset.metadata?.price ?? 0)}
                    />
                    <Table.Cell
                      className="truncate"
                      type="amount"
                      value={standardTableCell(
                        asset.metadata?.ownership
                          ? Math.round(asset.metadata?.ownership * 100) + " %"
                          : ""
                      )}
                    />
                    <Table.Cell
                      type="amount"
                      className="truncate"
                      value={valuationTableCell(
                        asset.metadata?.annualRevenus ?? 0
                      )}
                    />
                    <Table.Cell
                      type="amount"
                      className="truncate"
                      value={valuationTableCell(asset.activity?.value ?? 0)}
                    />
                    <Table.Cell
                      value={valuationTableCell(loanedAmount)}
                      className="truncate"
                    />
                    <Table.Cell
                      type="action"
                      value={ActionBodyTemplate(asset)}
                    />
                  </Table.Row>
                );
              })
            }
          </Table.Body>
        </Table>
      )}
    </>
  );
}
