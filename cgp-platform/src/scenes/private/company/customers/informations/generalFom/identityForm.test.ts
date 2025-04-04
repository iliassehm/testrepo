import { CompanyGeneralLogic } from "../../../settings/office/generalOffice/general.logic";

describe("Identity Form", () => {
  describe("Queries", () => {
    it("should return a list of selected managers", async () => {
      const selectedManagersList =
        await CompanyGeneralLogic.selectedManagerListQuery("1", "128835894912");

      expect(selectedManagersList).toHaveProperty(
        "customerReferenceAccessList"
      );
      expect(
        Array.isArray(selectedManagersList.customerReferenceAccessList)
      ).toBe(true);

      for (const manager of selectedManagersList?.customerReferenceAccessList ??
        []) {
        expect(manager).toHaveProperty("manager");
        expect(manager.manager).toHaveProperty("id");
        expect(manager.manager).toHaveProperty("name");
        expect(typeof manager.manager.id).toBe("string");
        expect(typeof manager.manager.name).toBe("string");

        expect(manager).toHaveProperty("primary");
        expect(typeof manager.primary).toBe("boolean");

        expect(manager).toHaveProperty("customer");
        expect(manager.customer).toHaveProperty("id");
        expect(manager.customer).toHaveProperty("name");
        expect(manager.customer).toHaveProperty("email");
        expect(typeof manager.customer.id).toBe("string");
        expect(typeof manager.customer.name).toBe("string");
        expect(typeof manager.customer.email).toBe("string");
      }
    });

    it("should return a list of manager", async () => {
      const managersList = await CompanyGeneralLogic.managerListQuery("1");

      expect(managersList).toHaveProperty("companyManagersStats");
      expect(Array.isArray(managersList.companyManagersStats)).toBe(true);

      for (const manager of managersList?.companyManagersStats ?? []) {
        expect(manager).toHaveProperty("id");
        expect(typeof manager.id).toBe("string");

        expect(manager).toHaveProperty("name");
        expect(typeof manager.name).toBe("string");

        expect(manager).toHaveProperty("claims");

        expect(manager).toHaveProperty("nbClients");
        expect(typeof manager.nbClients).toBe("number");

        expect(manager).toHaveProperty("nbContracts");
        expect(typeof manager.nbContracts).toBe("number");

        expect(manager).toHaveProperty("lastActive");
        expect(typeof manager.lastActive).toBe("string");

        expect(manager).toHaveProperty("email");
        expect(typeof manager.email).toBe("string");
      }
    });
  });
});
