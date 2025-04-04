import { useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import { Select } from "../../../../components";
import Table from "../../../../components/Table";
import { DataType } from "../../../../components/Table/tableTypes";
import { numberFormat } from "../../../../helpers";
import { AccountingManagersListQuery } from "../../../../types";
import { AccountingLogic } from "./Accounting.logic";
import { FeesSection } from "./fees";

type DateRange = { from: Date; to: Date };

const dataType: Record<string, DataType> = {
  name: {
    type: "string",
    sortable: true,
    field: "name",
    filterType: "string",
    sortBy: "name",
  },
  date: { type: "date", sortable: true, filterType: "date", field: "date" },
  sales: {
    type: "amount",
    sortable: true,
    field: "value",
    filterType: "number",
    sortBy: "value",
  },
};

const fakePeriodSales: any[] = [];
// const fakePeriodSales = [
//   {
//     advisor: "John Doe",
//     clients: [
//       {
//         name: "Client 1",
//         date: new Date("2021-01-01"),
//         sales: 1000,
//       },
//       {
//         name: "Client 2",
//         date: new Date("2021-01-01"),
//         sales: 2000,
//       },
//     ],
//     partners: [
//       {
//         name: "Partner 1",
//         date: new Date("2021-01-01"),
//         sales: 3000,
//       },
//       {
//         name: "Partner 2",
//         date: new Date("2021-01-01"),
//         sales: 4000,
//       },
//     ],
//     products: [
//       {
//         name: "Product 1",
//         date: new Date("2021-01-01"),
//         sales: 5000,
//       },
//       {
//         name: "Product 2",
//         date: new Date("2021-01-01"),
//         sales: 6000,
//       },
//     ],
//   },
//   {
//     advisor: "Jane Doe",
//     clients: [
//       {
//         name: "Client 3",
//         date: new Date("2021-01-01"),
//         sales: 7000,
//       },
//       {
//         name: "Client 4",
//         date: new Date("2021-01-01"),
//         sales: 8000,
//       },
//     ],
//     partners: [
//       {
//         name: "Jean Pierre Nom très long",
//         date: new Date("2021-01-01"),
//         sales: 9000,
//       },
//       {
//         name: "Partner 4",
//         date: new Date("2021-01-01"),
//         sales: 10000,
//       },
//     ],
//     products: [
//       {
//         name: "Product 3",
//         date: new Date("2021-01-01"),
//         sales: 11000,
//       },
//       {
//         name: "Product 4",
//         date: new Date("2021-01-01"),
//         sales: 12000,
//       },
//     ],
//   },
//   {
//     advisor: "John Doe",
//     clients: [
//       {
//         name: "Client 1",
//         date: new Date("2021-02-01"),
//         sales: 13000,
//       },
//       {
//         name: "Client 2",
//         date: new Date("2021-02-01"),
//         sales: 14000,
//       },
//     ],
//     partners: [
//       {
//         name: "Partner 1",
//         date: new Date("2021-02-01"),
//         sales: 15000,
//       },
//       {
//         name: "Partner 2",
//         date: new Date("2021-02-01"),
//         sales: 16000,
//       },
//     ],
//     products: [
//       {
//         name: "Product 1",
//         date: new Date("2021-02-01"),
//         sales: 17000,
//       },
//       {
//         name: "Product 2",
//         date: new Date("2021-02-01"),
//         sales: 18000,
//       },
//     ],
//   },
// ];

export const PeriodSales = (props: { range: DateRange }) => {
  const { t } = useTranslation();
  const [selectedAdvisor, setSelectedAdvisor] = useState<
    | NonNullable<
        NonNullable<AccountingManagersListQuery["company"]>["list"]
      >[number]["id"]
    | undefined
  >(undefined);

  const params = useParams({
    from: "/company/$companyId/customer/$customerId",
  });

  const managerListQuery = useQuery(
    ["company", params.companyId, "accounting", "sales"],
    () => AccountingLogic.managerList(params.companyId)
  );
  const advisors = [];

  const advisorData: never[] = [];

  if (managerListQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (
    managerListQuery.status != "success" ||
    managerListQuery.data.company?.list == null
  ) {
    return <div>Error...</div>;
  }

  if (selectedAdvisor == null)
    setSelectedAdvisor(managerListQuery.data.company.list[0].id);

  const advisorOptions = managerListQuery.data.company.list.map((manager) => ({
    value: manager.id ?? "N/A",
    label: manager.name ?? "N/A",
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-5">
        <h1>{t("scenes.customers.accounting.advisorSales")}</h1>
        <Select
          name="advisor"
          options={advisorOptions}
          defaultValue={selectedAdvisor}
          onChange={(value) => setSelectedAdvisor(value)}
          className="w-64"
        />
      </div>
      <div className="flex gap-4 flex-col md:flex-row lg:flex-col xl:flex-row">
        <div className="flex-1">
          <h2 className="text-sm font-semibold p-2 rounded-t-lg w-full bg-investorProfileForm-curve6 text-white">
            {t("scenes.customers.accounting.clients")}
          </h2>
          <Table data={/*advisorData?.clients ??*/ []} dataType={dataType}>
            <Table.Head translationPrefix="forms.fields.tables" />
            <Table.Body>
              {({
                data,
              }: {
                data: { name: string; date: Date; sales: number }[];
              }) => (
                <>
                  {data.map((item, index) => (
                    <Table.Row key={index}>
                      <Table.Cell value={item.name} />
                      <Table.Cell value={item.date.toLocaleDateString()} />
                      <Table.Cell
                        value={numberFormat(item.sales)}
                        type="amount"
                      />
                    </Table.Row>
                  ))}
                </>
              )}
            </Table.Body>
          </Table>
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-semibold p-2 rounded-t-lg w-full bg-investorProfileForm-curve6 text-white">
            {t("scenes.customers.accounting.partners")}
          </h2>
          <Table data={/*advisorData?.partners ?? */ []} dataType={dataType}>
            <Table.Head translationPrefix="forms.fields.tables" />
            <Table.Body>
              {({
                data,
              }: {
                data: { name: string; date: Date; sales: number }[];
              }) => (
                <>
                  {data.map((item, index) => (
                    <Table.Row key={index}>
                      <Table.Cell value={item.name} />
                      <Table.Cell value={item.date.toLocaleDateString()} />
                      <Table.Cell
                        value={numberFormat(item.sales)}
                        type="amount"
                      />
                    </Table.Row>
                  ))}
                </>
              )}
            </Table.Body>
          </Table>
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-semibold p-2 rounded-t-lg w-full bg-investorProfileForm-curve6 text-white">
            {t("scenes.customers.accounting.products")}
          </h2>
          <Table data={/*advisorData?.products ?? */ []} dataType={dataType}>
            <Table.Head translationPrefix="forms.fields.tables" />
            <Table.Body>
              {({
                data,
              }: {
                data: { name: string; date: Date; sales: number }[];
              }) => (
                <>
                  {data.map((item, index) => (
                    <Table.Row key={index}>
                      <Table.Cell value={item.name} />
                      <Table.Cell value={item.date.toLocaleDateString()} />
                      <Table.Cell
                        value={numberFormat(item.sales)}
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
      <FeesSection />
    </div>
  );
};

export const RecurrentSales = (props: { range: DateRange }) => {
  const { t } = useTranslation();
  const [selectedAdvisor, setSelectedAdvisor] = useState<
    | NonNullable<
        NonNullable<AccountingManagersListQuery["company"]>["list"]
      >[number]["id"]
    | undefined
  >(undefined);

  const params = useParams({
    from: "/company/$companyId/customer/$customerId",
  });

  const managerListQuery = useQuery(
    ["company", params.companyId, "accounting", "sales"],
    () => AccountingLogic.managerList(params.companyId)
  );
  const advisors = [];

  const advisorData: never[] = [];

  if (managerListQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (
    managerListQuery.status != "success" ||
    managerListQuery.data.company?.list == null
  ) {
    return <div>Error...</div>;
  }

  if (selectedAdvisor == null)
    setSelectedAdvisor(managerListQuery.data.company.list[0].id);

  const advisorOptions = managerListQuery.data.company.list.map((manager) => ({
    value: manager.id ?? "N/A",
    label: manager.name ?? "N/A",
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-5">
        <h1>{t("scenes.customers.accounting.advisorSales")}</h1>
        <Select
          name="advisor"
          options={advisorOptions}
          defaultValue={selectedAdvisor}
          onChange={(value) => setSelectedAdvisor(value)}
          className="w-64"
        />
      </div>
      <div className="flex gap-4 flex-col md:flex-row lg:flex-col xl:flex-row">
        <div className="flex-1">
          <h2 className="text-sm font-semibold p-2 rounded-t-lg w-full bg-investorProfileForm-curve6 text-white">
            {t("scenes.customers.accounting.clients")}
          </h2>
          <Table data={[]} dataType={dataType}>
            <Table.Head translationPrefix="forms.fields.tables" />
            <Table.Body>
              {({
                data,
              }: {
                data: { name: string; date: Date; sales: number }[];
              }) => (
                <>
                  {data.map((item, index) => (
                    <Table.Row key={index}>
                      <Table.Cell value={item.name} />
                      <Table.Cell value={item.date.toLocaleDateString()} />
                      <Table.Cell
                        value={numberFormat(item.sales)}
                        type="amount"
                      />
                    </Table.Row>
                  ))}
                </>
              )}
            </Table.Body>
          </Table>
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-semibold p-2 rounded-t-lg w-full bg-investorProfileForm-curve6 text-white">
            {t("scenes.customers.accounting.partners")}
          </h2>
          <Table data={[]} dataType={dataType}>
            <Table.Head translationPrefix="forms.fields.tables" />
            <Table.Body>
              {({
                data,
              }: {
                data: { name: string; date: Date; sales: number }[];
              }) => (
                <>
                  {data.map((item, index) => (
                    <Table.Row key={index}>
                      <Table.Cell value={item.name} />
                      <Table.Cell value={item.date.toLocaleDateString()} />
                      <Table.Cell
                        value={numberFormat(item.sales)}
                        type="amount"
                      />
                    </Table.Row>
                  ))}
                </>
              )}
            </Table.Body>
          </Table>
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-semibold p-2 rounded-t-lg w-full bg-investorProfileForm-curve6 text-white">
            {t("scenes.customers.accounting.products")}
          </h2>
          <Table data={[]} dataType={dataType}>
            <Table.Head translationPrefix="forms.fields.tables" />
            <Table.Body>
              {({
                data,
              }: {
                data: { name: string; date: Date; sales: number }[];
              }) => (
                <>
                  {data.map((item, index) => (
                    <Table.Row key={index}>
                      <Table.Cell value={item.name} />
                      <Table.Cell value={item.date.toLocaleDateString()} />
                      <Table.Cell
                        value={numberFormat(item.sales)}
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
      <FeesSection />
    </div>
  );
};

export const OneShotSales = (props: { range: DateRange }) => {
  const { t } = useTranslation();
  const [selectedAdvisor, setSelectedAdvisor] = useState<
    | NonNullable<
        NonNullable<AccountingManagersListQuery["company"]>["list"]
      >[number]["id"]
    | undefined
  >(undefined);

  const params = useParams({
    from: "/company/$companyId/customer/$customerId",
  });

  const managerListQuery = useQuery(
    ["company", params.companyId, "accounting", "sales"],
    () => AccountingLogic.managerList(params.companyId)
  );
  const advisors = [];

  const advisorData: never[] = [];

  if (managerListQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (
    managerListQuery.status != "success" ||
    managerListQuery.data.company?.list == null
  ) {
    return <div>Error...</div>;
  }

  if (selectedAdvisor == null)
    setSelectedAdvisor(managerListQuery.data.company.list[0].id);

  const advisorOptions = managerListQuery.data.company.list.map((manager) => ({
    value: manager.id ?? "N/A",
    label: manager.name ?? "N/A",
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-5">
        <h1>{t("scenes.customers.accounting.advisorSales")}</h1>
        <Select
          name="advisor"
          options={advisorOptions}
          defaultValue={selectedAdvisor}
          onChange={(value) => setSelectedAdvisor(value)}
          className="w-64"
        />
      </div>
      <div className="flex gap-4 flex-col md:flex-row lg:flex-col xl:flex-row">
        <div className="flex-1">
          <h2 className="text-sm font-semibold p-2 rounded-t-lg w-full bg-investorProfileForm-curve6 text-white">
            {t("scenes.customers.accounting.clients")}
          </h2>
          <Table data={[]} dataType={dataType}>
            <Table.Head translationPrefix="forms.fields.tables" />
            <Table.Body>
              {({
                data,
              }: {
                data: { name: string; date: Date; sales: number }[];
              }) => (
                <>
                  {data.map((item, index) => (
                    <Table.Row key={index}>
                      <Table.Cell value={item.name} />
                      <Table.Cell value={item.date.toLocaleDateString()} />
                      <Table.Cell
                        value={numberFormat(item.sales)}
                        type="amount"
                      />
                    </Table.Row>
                  ))}
                </>
              )}
            </Table.Body>
          </Table>
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-semibold p-2 rounded-t-lg w-full bg-investorProfileForm-curve6 text-white">
            {t("scenes.customers.accounting.partners")}
          </h2>
          <Table data={[]} dataType={dataType}>
            <Table.Head translationPrefix="forms.fields.tables" />
            <Table.Body>
              {({
                data,
              }: {
                data: { name: string; date: Date; sales: number }[];
              }) => (
                <>
                  {data.map((item, index) => (
                    <Table.Row key={index}>
                      <Table.Cell value={item.name} />
                      <Table.Cell value={item.date.toLocaleDateString()} />
                      <Table.Cell
                        value={numberFormat(item.sales)}
                        type="amount"
                      />
                    </Table.Row>
                  ))}
                </>
              )}
            </Table.Body>
          </Table>
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-semibold p-2 rounded-t-lg w-full bg-investorProfileForm-curve6 text-white">
            {t("scenes.customers.accounting.products")}
          </h2>
          <Table data={[]} dataType={dataType}>
            <Table.Head translationPrefix="forms.fields.tables" />
            <Table.Body>
              {({
                data,
              }: {
                data: { name: string; date: Date; sales: number }[];
              }) => (
                <>
                  {data.map((item, index) => (
                    <Table.Row key={index}>
                      <Table.Cell value={item.name} />
                      <Table.Cell value={item.date.toLocaleDateString()} />
                      <Table.Cell
                        value={numberFormat(item.sales)}
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
      <FeesSection />
    </div>
  );
};
