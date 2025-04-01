import { graphql, HttpResponse } from "msw";

import {
  companyListMock,
  customerListMock,
} from "../../../../mocks/handlers/mock";
import {
  AssetGroup,
  AssetListQuery,
  AssetsNumberQuery,
  NewCustomersCountQuery,
  NewCustomersQuery,
  NewTransactionsQuery,
} from "../../../../types";

export namespace AccountingLogicMock {
  export function newCustomersQueriesMock() {
    return graphql.query<NewCustomersQuery>("NewCustomers", ({ variables }) => {
      const customerList = customerListMock();

      return HttpResponse.json({
        data: {
          company: {
            id: companyListMock()[0].id,
            customerList: {
              totalCount: customerList.length,
              edges: [],
            },
          },
        },
      });
    });
  }

  export function newContractNumbersQueryMock() {
    return graphql.query<AssetsNumberQuery>("AssetsNumber", () => {
      return HttpResponse.json({
        data: {
          company: {
            list: {
              totalCount: 12,
            },
          },
        },
      });
    });
  }

  export function clientCountQueryMock() {
    return graphql.query<NewCustomersCountQuery>("NewCustomersCount", () => {
      return HttpResponse.json({
        data: {
          company: {
            id: "1",
            customerList: {
              totalCount: 12,
            },
          },
        },
      });
    });
  }

  export function assetListQueryMock() {
    return graphql.query<AssetListQuery>("AssetList", () => {
      return HttpResponse.json({
        data: {
          accountingAssets: [
            AssetGroup.Banking,
            AssetGroup.Benefits,
            AssetGroup.BusinessLoan,
          ],
        },
      });
    });
  }

  export function newTransactionsQueryMock() {
    return graphql.query<NewTransactionsQuery>("NewTransactions", () => {
      return HttpResponse.json({
        data: {
          list: {
            totalCount: 1,
            edges: [
              {
                node: {
                  id: "1",
                  date: new Date(),
                  amount: 0,
                  name: "name",
                  entityName: "entityName",
                  assetName: "assetName",
                },
              },
            ],
          },
        },
      });
    });
  }

  export const handlers = [
    newCustomersQueriesMock(),
    newContractNumbersQueryMock(),
    clientCountQueryMock(),
    assetListQueryMock(),
    newTransactionsQueryMock(),
  ];
}
