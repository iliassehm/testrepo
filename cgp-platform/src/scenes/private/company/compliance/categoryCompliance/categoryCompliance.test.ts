import { beforeAll, describe, expect, it } from "vitest";

import { gql } from "../../../../../service/client";
import {
  DocumentCustomerListQuery,
  NotificationTransport,
} from "../../../../../types";
import { DocumentCategoryLogic } from "./categoryCompliance.logic";

describe("Company category", () => {
  describe("CocumentCustomerList", () => {
    let documentCustomerListQuery: DocumentCustomerListQuery;
    const limit = 6;
    const input = {
      limit,
      name: "customer",
      page: 1,
      skip: 0,
    };

    beforeAll(async () => {
      documentCustomerListQuery = await gql.client.request(
        DocumentCategoryLogic.documentQuery(),
        {
          company: "1",
          documentCategory: "ARBITRARY",
          input,
        }
      );
    });

    it("should match documentCustomerListQuery keys", () => {
      expect(Object.keys(documentCustomerListQuery).sort()).toEqual(
        ["documentCustomerList"].sort()
      );
    });

    it("should return a company customer by category", async () => {
      expect(
        documentCustomerListQuery.documentCustomerList.edges.length
      ).toEqual(limit);
    });
  });

  describe("DocumentNotification", () => {
    const documentIdList = ["1"];

    it("should call the documentNotification mutation by email", async () => {
      const notifyByEmail = await gql.client.request(
        DocumentCategoryLogic.documentNotificationMutation(),
        {
          documentID: documentIdList[0],
          requests: [{ transport: NotificationTransport.Mail }],
        }
      );

      expect(notifyByEmail.notifyDocumentStatus).toEqual([{ id: "1" }]);
    });
    it("should call the documentNotification mutation by push notification", async () => {
      const notifyByPush = await gql.client.request(
        DocumentCategoryLogic.documentNotificationMutation(),
        {
          documentID: documentIdList[0],
          requests: [{ transport: NotificationTransport.Push }],
        }
      );

      expect(notifyByPush.notifyDocumentStatus).toEqual([{ id: "1" }]);
    });
  });
});
