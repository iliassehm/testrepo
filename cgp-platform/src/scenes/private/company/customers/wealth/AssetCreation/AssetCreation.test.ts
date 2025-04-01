import { describe, expect, it } from "vitest";

import { AssetGroup } from "../../../../../../types";
import { AssetCreationLogic } from "./AssetCreation.logic";

describe("AssetCreation", () => {
  describe("Mutation", () => {
    it("should update group of asset", async () => {
      const updateGroupAsset = await AssetCreationLogic.updateGroup({
        companyId: "1",
        assets: ["1"],
        group: AssetGroup.LifeInsuranceCapitalization,
        categoryName: "life_insurance",
      });

      expect(updateGroupAsset.updated[0].group).toEqual(
        AssetGroup.LifeInsuranceCapitalization
      );
      expect(updateGroupAsset.updated[0].categoryName).toEqual(
        "life_insurance"
      );
    });
  });
});
