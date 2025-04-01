import { useTranslation } from "react-i18next";



import Table from "../../../../components/Table";
import { DataType } from "../../../../components/Table/tableTypes";
import { numberFormat, percentFormatter } from "../../../../helpers";

type DateRange = { from: Date; to: Date };

type CommisionIssueType = {
  name: string;
  provider: string;
  contractId: string;
  date: Date;
  payment: number;
  feesCharged: number;
  takenRate: number;
  feesReturned: number;
  returnedRate: number;
  buyback: number;
  arbitration: number;
};

const dataType: Record<string, DataType> = {
  name: {
    type: "string",
    sortable: true,
    field: "name",
    filterType: "string",
    sortBy: "name",
  },
  provider: {
    type: "string",
    sortable: true,
    field: "provider",
    filterType: "string",
    sortBy: "provider",
  },
  contractId: {
    type: "string",
    sortable: true,
    field: "contractId",
    filterType: "string",
    sortBy: "contractId",
  },
  date: {
    type: "date",
    sortable: true,
    field: "date",
    filterType: "date",
    sortBy: "date",
  },
  payment: {
    type: "amount",
    sortable: true,
    field: "payment",
    sortBy: "payment",
  },
  feesCharged: {
    type: "amount",
    sortable: true,
    field: "feesCharged",
    sortBy: "feesCharged",
  },
  takenRate: {
    type: "percent",
    sortable: true,
    field: "takenRate",
    sortBy: "takenRate",
  },
  feesReturned: {
    type: "amount",
    sortable: true,
    field: "feesReturned",
    sortBy: "feesReturned",
  },
  returnedRate: {
    type: "percent",
    sortable: true,
    field: "returnedRate",
    sortBy: "returnedRate",
  },
  buyback: {
    type: "amount",
    sortable: true,
    field: "buyback",
    sortBy: "buyback",
  },
  arbitration: {
    type: "amount",
    sortable: true,
    field: "arbitration",
    sortBy: "arbitration",
  },
};

const mockData = [
  {
    name: "Contract Alpha",
    provider: "Provider A",
    contractId: "CTR-001",
    date: new Date("2024-01-15"),
    payment: 25000,
    feesCharged: 2000,
    takenRate: 0.08,
    feesReturned: 300,
    returnedRate: 0.015,
    buyback: 5000,
    arbitration: 1000,
  },
  {
    name: "Contract Beta",
    provider: "Provider B",
    contractId: "CTR-002",
    date: new Date("2024-02-20"),
    payment: 15000,
    feesCharged: 1200,
    takenRate: 0.08,
    feesReturned: 200,
    returnedRate: 0.013,
    buyback: 3000,
    arbitration: 500,
  },
  {
    name: "Contract Gamma",
    provider: "Provider C",
    contractId: "CTR-003",
    date: new Date("2024-03-10"),
    payment: 30000,
    feesCharged: 2500,
    takenRate: 0.083,
    feesReturned: 400,
    returnedRate: 0.013,
    buyback: 7000,
    arbitration: 800,
  },
  {
    name: "Contract Delta",
    provider: "Provider A",
    contractId: "CTR-004",
    date: new Date("2024-04-05"),
    payment: 20000,
    feesCharged: 1800,
    takenRate: 0.09,
    feesReturned: 500,
    returnedRate: 0.025,
    buyback: 4000,
    arbitration: 700,
  },
  {
    name: "Contract Epsilon",
    provider: "Provider B",
    contractId: "CTR-005",
    date: new Date("2024-05-12"),
    payment: 50000,
    feesCharged: 4000,
    takenRate: 0.08,
    feesReturned: 1000,
    returnedRate: 0.02,
    buyback: 10000,
    arbitration: 1500,
  },
];

// const mockData: any = [];

export const CommisionIssues = (props: { range: DateRange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 w-full overflow-hidden">
      <h2 className="text-sm font-semibold p-2 rounded-t-lg w-full bg-investorProfileForm-curve6 text-white">
        {t("scenes.customers.accounting.commissionIssues.title")}
      </h2>
      <div className="w-full overflow-x-auto">
        <Table data={mockData || []} dataType={dataType}>
          <Table.Head translationPrefix="scenes.customers.accounting.commissionIssues" />
          <Table.Body>
            {({ data }: { data: CommisionIssueType[] }) => (
              <>
                {data.map((item: CommisionIssueType, index: any) => (
                  <Table.Row key={index}>
                    <Table.Cell value={item.name} />
                    <Table.Cell value={item.provider} />
                    <Table.Cell value={item.contractId} />
                    <Table.Cell value={item.date.toLocaleDateString()} />
                    <Table.Cell
                      value={numberFormat(item.payment)}
                      type="amount"
                    />
                    <Table.Cell
                      value={numberFormat(item.feesCharged)}
                      type="amount"
                    />
                    <Table.Cell
                      value={percentFormatter.format(item.takenRate)}
                      type="percent"
                    />
                    <Table.Cell
                      value={numberFormat(item.feesReturned)}
                      type="amount"
                    />
                    <Table.Cell
                      value={percentFormatter.format(item.returnedRate)}
                      type="percent"
                    />
                    <Table.Cell
                      value={numberFormat(item.buyback)}
                      type="amount"
                    />
                    <Table.Cell
                      value={numberFormat(item.arbitration)}
                      type="amount"
                    />
                  </Table.Row>
                ))}
              </>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};