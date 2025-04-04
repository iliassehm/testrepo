import { faker } from "@faker-js/faker";
import { HttpResponse, graphql as mswGraphl } from "msw";

import { graphql } from "../../../../../../types";
import type {
  CreateTransactionMutation,
  CustomerWalletTransactionsQuery,
  TransactionDeleteMutation,
  TransactionUpdateMutation,
} from "../../../../../../types";

export namespace TransactionsWidgetLogic {
  export function queries() {
    return graphql(`
      query CustomerWalletTransactions(
        $assetId: ID!
        $pagination: Pagination!
        $search: String
        $dateRange: DateRange
      ) {
        customerWalletTransactions(
          assetId: $assetId
          pagination: $pagination
          search: $search
          dateRange: $dateRange
        ) {
          transactions {
            id
            name
            date
            dateBO
            value
            comment
            typeOperation
            manager
            metadata
            statusBO
            statusValidation
            managerBO
          }
          totalCount
          totalPages
        }
      }
    `);
  }

  export function transactionCreation() {
    return graphql(`
      mutation CreateTransaction(
        $companyID: ID!
        $customerID: ID!
        $assetID: ID!
        $input: TransactionCreationInput!
      ) {
        customerWalletAddTransaction(
          companyID: $companyID
          customerID: $customerID
          assetID: $assetID
          input: $input
        ) {
          id
        }
      }
    `);
  }

  export function transactionUpdate() {
    return graphql(`
      mutation TransactionUpdate(
        $companyID: ID!
        $customerID: ID!
        $transactionID: ID!
        $input: TransactionCreationInput!
      ) {
        customerWalletTransactionUpdate(
          companyID: $companyID
          customerID: $customerID
          transactionID: $transactionID
          input: $input
        ) {
          id
        }
      }
    `);
  }

  export function transactionDelete() {
    return graphql(`
      mutation TransactionDelete(
        $companyID: ID!
        $customerID: ID!
        $transactionID: ID!
      ) {
        customerWalletTransactionDeletion(
          companyID: $companyID
          customerID: $customerID
          transactionID: $transactionID
        )
      }
    `);
  }

  // Mocks

  // fake data

  export function customerWalletTransactionsMock() {
    return mswGraphl.query<CustomerWalletTransactionsQuery>(
      "CustomerWalletTransactions",
      () => {
        return HttpResponse.json({
          data: {
            customerWalletTransactions: {
              transactions: [
                {
                  id: faker.database.mongodbObjectId(),
                  name: "Transaction 1",
                  date: new Date().toISOString(),
                  value: faker.number.float(),
                  comment: faker.lorem.sentence(),
                  typeOperation: "arbitrages",
                  metadata: {
                    fee: 2,
                  },
                },
              ],
              totalCount: 1,
              totalPages: 1,
            },
          },
        });
      }
    );
  }

  export function transactionCreationMock() {
    return mswGraphl.mutation<CreateTransactionMutation>(
      "CreateTransaction",
      () => {
        return HttpResponse.json({
          data: {
            customerWalletAddTransaction: {
              id: faker.database.mongodbObjectId(),
            },
          },
        });
      }
    );
  }

  export function transactionUpdateMock() {
    return mswGraphl.mutation<TransactionUpdateMutation>(
      "TransactionUpdate",
      () => {
        return HttpResponse.json({
          data: {
            customerWalletTransactionUpdate: {
              id: faker.database.mongodbObjectId(),
            },
          },
        });
      }
    );
  }

  export function transactionDeleteMock() {
    return mswGraphl.mutation<TransactionDeleteMutation>(
      "TransactionDelete",
      () => {
        return HttpResponse.json({
          data: {
            customerWalletTransactionDeletion: true,
          },
        });
      }
    );
  }

  export const handlers = [
    customerWalletTransactionsMock(),
    transactionCreationMock(),
    transactionUpdateMock(),
    transactionDeleteMock(),
  ];
}
