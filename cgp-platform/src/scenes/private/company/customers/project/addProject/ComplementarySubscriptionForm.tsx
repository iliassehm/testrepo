import { useParams } from "@tanstack/react-router";
import React from "react";
import { useQuery } from "react-query";
import { z } from "zod";

import {
  complementaryCIFSchema,
  complementaryInsuranceSchema,
} from "../../../../../../../shared/schemas/project";
import { gql } from "../../../../../../service/client";
import { AssetGroup } from "../../../../../../types";
import { WealthLogic } from "../../wealth/wealth.logic";
import { companyCustomersProjectUpdateRoute } from "../route";
import { ComplementarySubscriptionCIFForm } from "./ComplementarySubscriptionCIFForm";
import { ComplementarySubscriptionInsuranceForm } from "./ComplementarySubscriptionInsuranceForm";

interface ComplementarySubscriptionFormProps {
  contractID: string;
  name?: string;
  initialData?:
    | z.infer<typeof complementaryCIFSchema>
    | z.infer<typeof complementaryInsuranceSchema>;
  sriTolerate?: number;
}
export const ComplementarySubscriptionForm: React.FC<
  ComplementarySubscriptionFormProps
> = ({ contractID, initialData, name, sriTolerate }) => {
  const params = useParams({
    from: companyCustomersProjectUpdateRoute.fullPath,
  });

  const instrumentQuery = useQuery(
    ["customerWalletInstrument", params.companyId, contractID],
    () =>
      gql.client.request(WealthLogic.customerWalletQueries(), {
        companyID: params.companyId ?? "",
        id: contractID,
        group: AssetGroup.LifeInsuranceCapitalization,
      })
  );

  if (!instrumentQuery.data) return null;

  return (
    <div>
      {instrumentQuery.data?.customerWallet?.group ===
        AssetGroup.LifeInsuranceCapitalization ||
      instrumentQuery.data?.customerWallet?.group ===
        AssetGroup.RetirementEmployee ? (
        <ComplementarySubscriptionInsuranceForm
          contractID={contractID}
          name={name}
          initialData={
            initialData as z.infer<typeof complementaryInsuranceSchema>
          }
          instrumentQuery={instrumentQuery}
          sriTolerate={sriTolerate}
        />
      ) : (
        <ComplementarySubscriptionCIFForm
          contractID={contractID}
          name={name}
          initialData={initialData as z.infer<typeof complementaryCIFSchema>}
          instrumentQuery={instrumentQuery}
          sriTolerate={sriTolerate}
        />
      )}
    </div>
  );
};
