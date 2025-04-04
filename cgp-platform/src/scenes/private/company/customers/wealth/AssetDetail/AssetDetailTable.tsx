import DoubleLabel from "../../../../../../components/DoubleLabels/DoubleLabels";
import Table from "../../../../../../components/Table";
import { DataType } from "../../../../../../components/Table/tableTypes";
import { formatCurrency, numberFormat } from "../../../../../../helpers";
import { CustomerAssetInvestment } from "../../../../../../types";

interface AssetDetailTable {
  data: CustomerAssetInvestment[];
}

const dataType: Record<string, DataType> = {
  name: { type: "string", sortable: true },
  unitValue: { type: "number", sortable: true },
  quantity: { type: "number", sortable: true },
  valuation: { type: "amount", sortable: true, field: "valuation.value" },
  performance: {
    type: "number",
    sortable: true,
    field: "performance.gain.value",
  },
};
export function AssetDetailTable({ data }: AssetDetailTable) {
  return (
    <div>
      <Table
        data={data}
        dataType={dataType}
        className="shadow-none"
        defaultSort="performance"
      >
        <Table.Head translationPrefix="forms.fields.tables" />
        <Table.Body>
          {({ data }: { data: CustomerAssetInvestment[] }) =>
            data?.map((element, index) => (
              <Table.Row key={index}>
                <Table.Cell value={logoWithLabelTemplate(element)} />
                <Table.Cell
                  type="number"
                  value={numberFormat(element.unitValue as number)}
                />
                <Table.Cell type="number" value={element.quantity} />
                <Table.Cell
                  type="amount"
                  value={formatCurrency(element.valuation)}
                />
                <Table.Cell value={performanceTemplate(element)} />
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
    </div>
  );
}

function performanceTemplate(data: CustomerAssetInvestment) {
  const value = data.performance;

  if (!value) return "-";

  return (
    <div className="flex w-full flex-col items-end justify-end">
      <DoubleLabel
        data={value}
        displayValue="gain"
        className="text-base text-grey-800"
      />
      <DoubleLabel data={value} displayValue="evolution" />
    </div>
  );
}

function logoWithLabelTemplate(data: CustomerAssetInvestment) {
  let logo = data.logo;

  if (data && !logo) {
    if (data.code === "BTC") logo = "/icons/default/crypto.svg";
  }

  return (
    <div className="flex h-4 items-center gap-x-3 py-0 font-normal text-blue-1000">
      {data ? (
        <>
          {!!logo && (
            <img
              src={logo}
              className="h-6 w-6 rounded-full object-contain"
              alt={data.name}
            />
          )}
          {data.name}
        </>
      ) : (
        "-"
      )}
    </div>
  );
}
