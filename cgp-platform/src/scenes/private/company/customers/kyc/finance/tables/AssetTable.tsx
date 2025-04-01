import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Dialog } from "../../../../../../../components";
import { Label } from "../../../../../../../components/Label";
import Table from "../../../../../../../components/Table";
import { DataType } from "../../../../../../../components/Table/tableTypes";
import {
  DeleteConfirmationDialog,
  formatDate,
} from "../../../../../../../helpers";
import { AssetGroup, CustomerAsset } from "../../../../../../../types";
import { FinancialItem } from "../../../wealth/globalWealthTab";
import { actionTableCell } from "../../utils/actionTableCell";
import standardTableCell from "../../utils/standardTableCell";
import valuationTableCell from "../../utils/valuationTableCell";
import { AssetEditForm } from "./AssetEditForm";
import {
  dataTypeBanking,
  dataTypeBenefits,
  dataTypeCrowdfunding,
  dataTypeExotic,
  dataTypeLongTermAsset,
  dataTypePrivateEquity,
  dataTypeSecurities,
} from "./dataTypes";

interface AssetTypeRowProps {
  asset: CustomerAsset;
  t: (key: string) => string;
}

interface AssetTableProps {
  assets: CustomerAsset[];
  isLoading: boolean;
  onDelete: (assetID: string) => void;
  onUpdateAsset: (
    data: unknown,
    assetId: string,
    assetIsUnderManagement: boolean
  ) => void;
  currentAssetType: AssetGroup;
}

export function AssetTable({
  assets,
  isLoading,
  onDelete,
  onUpdateAsset,
  currentAssetType,
}: AssetTableProps) {
  const { t } = useTranslation();
  const [assetIdDeletion, setDeletion] = useState<string>();
  const [editingAsset, setEditingAsset] = useState<CustomerAsset | null>(null);

  const getDataType = (): Record<string, DataType> => {
    switch (currentAssetType) {
      case AssetGroup.Banking:
        return dataTypeBanking;
      case AssetGroup.Securities:
        return dataTypeSecurities;
      case AssetGroup.LifeInsuranceCapitalization:
        return dataTypeLongTermAsset;
      case AssetGroup.RetirementEmployee:
        return dataTypeLongTermAsset;
      case AssetGroup.Crowdfunding:
        return dataTypeCrowdfunding;
      case AssetGroup.PrivateEquity:
        return dataTypePrivateEquity;
      case AssetGroup.Benefits:
        return dataTypeBenefits;
      case AssetGroup.RockPaper:
        return dataTypeLongTermAsset;
      case AssetGroup.Exotic:
        return dataTypeExotic;
      default:
        return dataTypeBanking;
    }
  };

  const BankingRow = ({ asset, t }: AssetTypeRowProps) => {
    return (
      <>
        <Table.Cell
          value={standardTableCell(asset.metadata?.bank ?? "")}
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
          value={standardTableCell(formatDate(asset.metadata?.date) ?? "")}
          className="truncate"
        />
        <Table.Cell
          type="amount"
          value={
            asset.valuation != null ? valuationTableCell(asset.valuation) : ""
          }
        />
        <Table.Cell
          type="action"
          value={actionTableCell(asset, setEditingAsset, setDeletion, t)}
        />
      </>
    );
  };

  const SecuritiesRow = ({ asset, t }: AssetTypeRowProps) => {
    return (
      <>
        <Table.Cell
          value={standardTableCell(asset.name ?? "")}
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
          value={standardTableCell(asset.accountNumber ?? "")}
          className="truncate"
        />
        <Table.Cell
          value={standardTableCell(formatDate(asset.openDate) ?? "")}
          className="truncate"
        />
        <Table.Cell
          type="amount"
          value={
            asset.activity?.value
              ? valuationTableCell(asset.activity?.value)
              : ""
          }
        />
        <Table.Cell
          type="action"
          value={actionTableCell(asset, setEditingAsset, setDeletion, t)}
        />
      </>
    );
  };

  const LongTermAssetRow = ({ asset, t }: AssetTypeRowProps) => {
    return (
      <>
        <Table.Cell
          value={standardTableCell(asset.name ?? "")}
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
          value={standardTableCell(asset.accountNumber ?? "")}
          className="truncate"
        />
        <Table.Cell
          value={standardTableCell(
            asset.metadata?.bank ?? asset.metadata?.insuranceCompany ?? ""
          )}
          className="truncate"
        />
        <Table.Cell
          value={standardTableCell(formatDate(asset.openDate) ?? "")}
          className="truncate"
        />
        <Table.Cell
          type="amount"
          value={
            asset.metadata?.transfersAmount != null
              ? valuationTableCell(asset.metadata?.transfersAmount)
              : ""
          }
        />
        <Table.Cell
          value={standardTableCell(
            asset.metadata?.scheduledPaymentList
              ? t(`forms.fields.cycles.${asset.metadata?.scheduledPaymentList}`)
              : ""
          )}
          className="truncate"
        />
        <Table.Cell
          type="amount"
          value={
            asset.metadata?.scheduledPayment != null
              ? valuationTableCell(asset.metadata?.scheduledPayment)
              : ""
          }
        />
        {/* For RockPaper we have to select accountType instead of type */}
        <Table.Cell
          value={standardTableCell(
            asset.metadata?.type || asset.metadata?.accountType
              ? t(
                  `forms.fields.wealth.lifeInsurance.accountType.${asset.metadata?.type ? asset.metadata?.type : asset.metadata?.accountType}`
                )
              : ""
          )}
          className="truncate"
        />
        <Table.Cell
          type="action"
          value={actionTableCell(asset, setEditingAsset, setDeletion, t)}
        />
      </>
    );
  };

  const CrowdfundingRow = ({ asset, t }: AssetTypeRowProps) => {
    return (
      <>
        <Table.Cell
          value={standardTableCell(asset.metadata?.providerName ?? "")}
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
          value={standardTableCell(asset.metadata?.investmentField ?? "")}
          className="truncate"
        />
        <Table.Cell
          type="amount"
          value={
            asset.valuation != null ? valuationTableCell(asset.valuation) : ""
          }
          className="truncate"
        />
        <Table.Cell
          value={standardTableCell(
            asset.metadata?.efficiency
              ? Math.round(asset.metadata?.efficiency) + " %"
              : ""
          )}
          className="truncate"
        />
        <Table.Cell
          value={standardTableCell(formatDate(asset.metadata?.date) ?? "")}
          className="truncate"
        />
        <Table.Cell
          value={standardTableCell(formatDate(asset.metadata?.endDate) ?? "")}
          className="truncate"
        />
        <Table.Cell
          type="action"
          value={actionTableCell(asset, setEditingAsset, setDeletion, t)}
        />
      </>
    );
  };

  const PrivateEquityRow = ({ asset, t }: AssetTypeRowProps) => {
    return (
      <>
        <Table.Cell
          value={standardTableCell(asset.metadata?.establishment?.name ?? "")}
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
          value={standardTableCell(
            asset.metadata?.ownership
              ? Math.round(asset.metadata?.ownership * 100) + " %"
              : ""
          )}
          className="truncate"
        />
        <Table.Cell
          type="amount"
          value={standardTableCell(asset.metadata?.socialCapital ?? "")}
          className="truncate"
        />
        <Table.Cell
          type="amount"
          value={standardTableCell(asset.metadata?.unitPrice ?? "")}
          className="truncate"
        />
        <Table.Cell
          value={standardTableCell(asset.metadata?.quantity ?? "")}
          className="truncate"
        />
        <Table.Cell
          type="amount"
          value={
            asset.valuation != null ? valuationTableCell(asset.valuation) : ""
          }
          className="truncate"
        />
        <Table.Cell
          value={standardTableCell(formatDate(asset.metadata?.opened) ?? "")}
          className="truncate"
        />
        <Table.Cell
          type="amount"
          value={
            asset.metadata?.valuation != null
              ? valuationTableCell(asset.metadata?.valuation)
              : ""
          }
          className="truncate"
        />
        <Table.Cell
          type="action"
          value={actionTableCell(asset, setEditingAsset, setDeletion, t)}
        />
      </>
    );
  };

  const BenefitsRow = ({ asset, t }: AssetTypeRowProps) => {
    return (
      <>
        <Table.Cell
          value={standardTableCell(asset.name ?? "")}
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
          value={standardTableCell(asset.accountNumber ?? "")}
          className="truncate"
        />
        <Table.Cell
          value={standardTableCell(asset.metadata?.bank ?? "")}
          className="truncate"
        />
        <Table.Cell
          value={standardTableCell(formatDate(asset.openDate) ?? "")}
          className="truncate"
        />
        <Table.Cell
          type="amount"
          value={
            asset.metadata?.scheduledPayment != null
              ? valuationTableCell(asset.metadata?.scheduledPayment)
              : ""
          }
        />
        <Table.Cell
          value={standardTableCell(
            asset.metadata?.scheduledPaymentList
              ? t(`forms.fields.cycles.${asset.metadata?.scheduledPaymentList}`)
              : ""
          )}
          className="truncate"
        />
        <Table.Cell
          value={standardTableCell(
            asset.metadata?.type
              ? t(
                  `forms.fields.wealth.lifeInsurance.accountType.${asset.metadata?.type}`
                )
              : ""
          )}
          className="truncate"
        />
        <Table.Cell
          type="action"
          value={actionTableCell(asset, setEditingAsset, setDeletion, t)}
        />
      </>
    );
  };

  const ExoticRow = ({ asset, t }: AssetTypeRowProps) => {
    return (
      <>
        <Table.Cell
          value={standardTableCell(asset.name ?? "")}
          className="truncate"
        />
        <Table.Cell
          value={standardTableCell(
            asset.categoryName
              ? t(`asset_categories_exotic.${asset.categoryName}`)
              : ""
          )}
          className="truncate"
        />
        <Table.Cell
          type="amount"
          value={
            asset.metadata?.buyingValue != null
              ? valuationTableCell(asset.metadata?.buyingValue)
              : ""
          }
        />
        <Table.Cell
          type="amount"
          value={
            asset.valuation != null ? valuationTableCell(asset.valuation) : ""
          }
        />
        <Table.Cell
          value={standardTableCell(asset.metadata?.quantity ?? "")}
          className="truncate"
        />
        <Table.Cell
          value={standardTableCell(
            asset.metadata?.ownership
              ? Math.round(asset.metadata?.ownership * 100) + " %"
              : ""
          )}
          className="truncate"
        />
        <Table.Cell
          value={standardTableCell(formatDate(asset.metadata?.date) ?? "")}
          className="truncate"
        />
        <Table.Cell
          type="action"
          value={actionTableCell(asset, setEditingAsset, setDeletion, t)}
        />
      </>
    );
  };

  return (
    <>
      <Dialog
        header={<Label label="scenes.wealth.assetEdit" />}
        open={!!editingAsset}
        onOpenChange={() => setEditingAsset(null)}
        className="w-[70vw] overflow-visible"
      >
        <AssetEditForm
          currentAssetType={currentAssetType}
          editingAsset={editingAsset}
          onUpdateAsset={onUpdateAsset}
          setEditingAsset={setEditingAsset}
          isLoading={isLoading}
        />
      </Dialog>
      <Table
        data={assets}
        dataType={getDataType()}
        className="shadow-none table-fixed mt-4"
      >
        <Table.Head translationPrefix="forms.fields.tables" />
        <Table.Body>
          {({ data }: { data: FinancialItem[] }) =>
            data?.map((asset, index) => (
              <Table.Row
                key={index}
                className="even:bg-[#4761C84D] even:hover:bg-[#4761c897]"
              >
                {currentAssetType === AssetGroup.Banking && (
                  <BankingRow asset={asset} t={t} />
                )}
                {currentAssetType === AssetGroup.Securities && (
                  <SecuritiesRow asset={asset} t={t} />
                )}
                {currentAssetType ===
                  AssetGroup.LifeInsuranceCapitalization && (
                  <LongTermAssetRow asset={asset} t={t} />
                )}
                {currentAssetType === AssetGroup.RetirementEmployee && (
                  <LongTermAssetRow asset={asset} t={t} />
                )}
                {currentAssetType === AssetGroup.Crowdfunding && (
                  <CrowdfundingRow asset={asset} t={t} />
                )}
                {currentAssetType === AssetGroup.PrivateEquity && (
                  <PrivateEquityRow asset={asset} t={t} />
                )}
                {currentAssetType === AssetGroup.Benefits && (
                  <BenefitsRow asset={asset} t={t} />
                )}
                {currentAssetType === AssetGroup.RockPaper && (
                  <LongTermAssetRow asset={asset} t={t} />
                )}
                {currentAssetType === AssetGroup.Exotic && (
                  <ExoticRow asset={asset} t={t} />
                )}
              </Table.Row>
            ))
          }
        </Table.Body>
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
