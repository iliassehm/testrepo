import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Dialog } from "../../../../../../../components";
import { Label } from "../../../../../../../components/Label";
import Table from "../../../../../../../components/Table";
import { DataType } from "../../../../../../../components/Table/tableTypes";
import {
  clsx,
  DeleteConfirmationDialog,
  formatDate,
  globalAmountFormatting,
} from "../../../../../../../helpers";
import { CustomerAsset } from "../../../../../../../types";
import { Option } from "../../../../../../../UIComponents/Select/Select";
import standardTableCell from "../../utils/standardTableCell";
import valuationTableCell from "../../utils/valuationTableCell";
import LoanForm from "../forms/LoanForm";

const columnListClassName =
  "bg-blue-800 text-white font-normal border-r-2 border-x-white text-xs";

const assetsDataType: Record<string, DataType> = {
  loanType: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  loanAmount: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  interestRate: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  outstandingCapital: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  date: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  loanPeriod: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  endDate: {
    type: "string",
    sortable: true,
    className: clsx(columnListClassName),
  },
  monthlyAmount: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  applicationFees: {
    type: "amount",
    sortable: true,
    className: clsx(columnListClassName),
  },
  loanOwnership: {
    type: "string",
    sortable: true,
    className: clsx("w-[90px]", columnListClassName),
  },
};

interface LoanTableProps {
  assets: CustomerAsset[];
  customerHeritageRealEstateAssets: CustomerAsset[];
  onDelete: (assetID: string) => void;
  onUpdateAsset: (data: unknown, assetId: string) => void;
  isLoanSettled?: boolean;
  isLoading?: boolean;
}

export default function LoanTable({
  assets,
  customerHeritageRealEstateAssets,
  onDelete,
  onUpdateAsset,
  isLoanSettled,
  isLoading,
}: LoanTableProps) {
  const { t } = useTranslation();
  const [assetIdDeletion, setDeletion] = useState<string>();
  const [editingAsset, setEditingAsset] = useState<CustomerAsset | null>(null);
  const loanTypeOptions: Option[] = [
    {
      label: t(`scenes.customers.kyc.loanTypes.amortissable`) as string,
      value: "amortissable",
    },
    {
      label: t(`scenes.customers.kyc.loanTypes.in-fine`) as string,
      value: "in-fine",
    },
    {
      label: t(`scenes.customers.kyc.loanTypes.differe-total`) as string,
      value: "differe-total",
    },
    {
      label: t(`scenes.customers.kyc.loanTypes.differe-partiel`) as string,
      value: "differe-partiel",
    },
  ];

  const outstandCapitalCell = (asset: CustomerAsset) => {
    let outstandingCapital = 0;
    if (
      asset.metadata?.loanedAmount &&
      asset.metadata?.start &&
      asset.metadata?.duration
    ) {
      const currentDate = new Date();
      const startDate = new Date(asset.metadata?.start);
      const timeDifferenceInMilliseconds = Math.abs(
        currentDate.getTime() - startDate.getTime()
      );
      const timeDifferenceInMonths = Math.ceil(
        timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24 * 30)
      );

      outstandingCapital =
        (asset.metadata?.loanedAmount / asset.metadata?.duration) *
        (asset.metadata?.duration - timeDifferenceInMonths);
    }
    return (
      <div className="my-1 flex flex-col items-end justify-end">
        <span className="flex items-center rounded-l-xl pr-3 text-left text-xs text-[#04182B]">
          {Intl.NumberFormat(undefined, {
            ...globalAmountFormatting,
            currency: "EUR",
          }).format(outstandingCapital)}
        </span>
      </div>
    );
  };

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
      <button className="mr-1" onClick={() => setEditingAsset(asset)}>
        <i
          className="notification-target-icon pi pi-pencil h-4 w-4 cursor-pointer"
          data-pr-tooltip={t("forms.fields.tables.edit") as string}
        />
      </button>
    );
  };
  const deleteBodyTemplate = (asset: CustomerAsset) => {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDeletion(asset.id);
        }}
      >
        <i className="notification-target-icon pi pi-trash text-red-500 h-4 w-4 cursor-pointer" />
      </button>
    );
  };

  return (
    <>
      <Dialog
        header={<Label label="scenes.wealth.assetEdit" />}
        open={!!editingAsset}
        onOpenChange={() => setEditingAsset(null)}
        className="w-[70vw]"
      >
        <LoanForm
          asset={(editingAsset as CustomerAsset) || {}}
          onSubmit={(data) => {
            onUpdateAsset(
              {
                ...data,
                comment: "",
                settledLoan: editingAsset?.metadata?.settledLoan,
              },
              editingAsset?.id ?? ""
            );
            setEditingAsset(null);
          }}
          isLoading={isLoading}
          customerHeritageRealEstateAssets={customerHeritageRealEstateAssets}
        />
      </Dialog>
      <Table
        data={assets}
        dataType={
          isLoanSettled === undefined
            ? {
                ...assetsDataType,
                settledLoan: {
                  type: "string",
                  sortable: false,
                  className: clsx(columnListClassName),
                },
                assignment: {
                  type: "string",
                  sortable: true,
                  className: clsx(columnListClassName),
                },
                actions: {
                  type: "action",
                  sortable: false,
                  className: clsx("w-14 last:border-r-0", columnListClassName),
                },
              }
            : {
                ...assetsDataType,

                assignment: {
                  type: "string",
                  sortable: true,
                  className: clsx(columnListClassName),
                },
                actions: {
                  type: "action",
                  sortable: false,
                  className: clsx("w-14 last:border-r-0", columnListClassName),
                },
              }
        }
        className="shadow-none table-fixed mt-4"
      >
        <Table.Head translationPrefix="scenes.customers.kyc.loanTableColumns" />
        {
          <Table.Body>
            {({ data }: { data: CustomerAsset[] }) =>
              data?.map((asset, index) => (
                <Table.Row
                  key={index}
                  className="even:bg-[#4761C84D] even:hover:bg-[#4761c897]"
                >
                  <Table.Cell
                    value={standardTableCell(
                      loanTypeOptions.find(
                        (option) => option.value === asset.metadata?.type
                      )?.label ?? ""
                    )}
                    className="truncate"
                  />
                  <Table.Cell
                    type="amount"
                    value={valuationTableCell(
                      asset.metadata?.loanedAmount ?? 0
                    )}
                    className="truncate"
                  />
                  <Table.Cell
                    type="string"
                    value={standardTableCell(
                      `${asset.metadata?.interests ?? 0} %`
                    )}
                    className="truncate"
                  />
                  <Table.Cell
                    type="amount"
                    value={outstandCapitalCell(asset)}
                    className="truncate"
                  />
                  <Table.Cell
                    type="string"
                    value={standardTableCell(
                      asset.metadata?.start
                        ? formatDate(asset.metadata?.start)
                        : ""
                    )}
                    className="truncate"
                  />
                  <Table.Cell
                    type="string"
                    value={standardTableCell(
                      asset.metadata?.duration
                        ? `${asset.metadata?.duration} mois`
                        : ""
                    )}
                    className="truncate"
                  />
                  <Table.Cell
                    type="string"
                    value={standardTableCell(
                      asset.metadata?.endDate
                        ? formatDate(asset.metadata?.endDate)
                        : ""
                    )}
                    className="truncate"
                  />
                  <Table.Cell
                    type="amount"
                    value={valuationTableCell(
                      asset.metadata?.monthlyPayment ?? 0
                    )}
                    className="truncate"
                  />
                  <Table.Cell
                    type="amount"
                    value={valuationTableCell(
                      asset.metadata?.applicationFee ?? 0
                    )}
                    className="truncate"
                  />
                  <Table.Cell
                    type="string"
                    value={standardTableCell(
                      asset.metadata?.loanOwnership
                        ? Math.round(asset.metadata?.loanOwnership * 100) + " %"
                        : ""
                    )}
                    className="truncate"
                  />
                  {isLoanSettled === undefined && (
                    <Table.Cell
                      type="string"
                      value={standardTableCell(
                        asset.metadata?.settledLoan
                          ? t("forms.fields.yes")
                          : t("forms.fields.no")
                      )}
                      className="truncate"
                    />
                  )}
                  <Table.Cell
                    type="string"
                    value={standardTableCell(asset.name ?? "")}
                    className="truncate"
                  />
                  <Table.Cell type="action" value={ActionBodyTemplate(asset)} />
                </Table.Row>
              ))
            }
          </Table.Body>
        }
      </Table>
      <DeleteConfirmationDialog
        visible={!!assetIdDeletion}
        onDeleteConfirmation={() => {
          !!assetIdDeletion && onDelete(assetIdDeletion);
          setDeletion(undefined);
        }}
        onClose={() => setDeletion(undefined)}
      />
    </>
  );
}
