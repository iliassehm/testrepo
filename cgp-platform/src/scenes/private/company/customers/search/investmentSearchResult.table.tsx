import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useTranslation } from "react-i18next";

import { AssetIcon } from "../../../../../components";
import { formatCurrency, formatDate } from "../../../../../helpers";
import { totalDisplay } from "../wealth/WalletTab/investmentTableUtils";
import { DiscriminatedResult } from "./AssetsSearchTable";

type InvestmentSearchResultTableProps = {
  data: DiscriminatedResult<"CustomerAsset">[];
};
const InvestmentSearchResultTable: React.FC<
  InvestmentSearchResultTableProps
> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <>
      <DataTable
        value={data}
        tableStyle={{ minWidth: "50rem" }}
        stripedRows
        scrollable
        scrollHeight={"800px"}
      >
        <Column
          field="customer.name"
          header={t("scenes.customersSearch.results.table.name")}
          className={"w-[200px] text-sm"}
          headerClassName={"!bg-neutral-100"}
        />
        <Column
          field="group"
          header={t("scenes.customersSearch.results.table.assetType")}
          className={"text-sm"}
          headerClassName={"!bg-neutral-100"}
          body={({ group }) => (
            <div className="flex items-center gap-2">
              <AssetIcon assetName={group} size="sm" />
              <p>{t(`asset_group.${group}`)}</p>
            </div>
          )}
        />
        <Column
          field="name"
          header={t("scenes.customersSearch.results.table.assetName")}
          className={"text-sm"}
          headerClassName={"!bg-neutral-100"}
        />
        <Column
          field="accountNumber"
          header={t("scenes.customersSearch.results.table.number")}
          className={"text-sm"}
          headerClassName={"!bg-neutral-100"}
        />
        <Column
          field="openDate"
          header={t("scenes.customersSearch.results.table.openDate")}
          className={"text-sm"}
          headerClassName={"!bg-neutral-100"}
          body={({ openDate }) => (
            <p>{openDate ? formatDate(openDate) : "-"}</p>
          )}
        />
        <Column
          field="valuation"
          header={t("scenes.customersSearch.results.table.amount")}
          className={"text-sm"}
          headerClassName={"!bg-neutral-100"}
          body={({ valuation }) => (
            <p className="font-medium text-right">
              {formatCurrency({ value: valuation, instrument: "EUR" })}
            </p>
          )}
        />
        <Column
          field="investmentLabel"
          header={t("scenes.customersSearch.results.table.supportName")}
          className={"text-sm"}
          headerClassName={"!bg-neutral-100"}
        />
        <Column
          field="investmentValuation"
          header={t("scenes.customersSearch.results.table.supportAmount")}
          className={"text-sm"}
          headerClassName={"!bg-neutral-100"}
          body={({ investmentValuation }) => (
            <p className="font-medium text-right">
              {investmentValuation
                ? formatCurrency({
                    value: investmentValuation,
                    instrument: "EUR",
                  })
                : "N/A"}
            </p>
          )}
        />
        <Column
          field="investmentValuation"
          header={t("scenes.customersSearch.results.table.weightInContract")}
          className={"w-32 text-sm"}
          headerClassName={"!bg-neutral-100"}
          body={({ investmentValuation, valuation }) => {
            if (investmentValuation && valuation) {
              return (
                <p className="font-medium">
                  {((investmentValuation / valuation) * 100).toFixed(2)} %
                </p>
              );
            }
            return "N/A";
          }}
        />
        <Column
          field="investmentPerformance"
          header={t("scenes.customersSearch.results.table.supportPerf")}
          className={"w-36 text-sm"}
          headerClassName={"!bg-neutral-100"}
          body={({ investmentPerformance }) => (
            <p>
              {!investmentPerformance.gain || !investmentPerformance.evolution
                ? "N/A"
                : totalDisplay(
                    investmentPerformance.gain,
                    investmentPerformance.evolution
                  )}
            </p>
          )}
        />
      </DataTable>
    </>
  );
};

export default InvestmentSearchResultTable;
