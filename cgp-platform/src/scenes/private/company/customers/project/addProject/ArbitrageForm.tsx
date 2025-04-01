import { useParams } from "@tanstack/react-router";
import { type FC } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

import {
  arbitrageCifSchema,
  arbitrageInsuranceSchema,
} from "../../../../../../../shared/schemas/project";
import { gql } from "../../../../../../service/client";
import { AssetGroup } from "../../../../../../types";
import { WealthLogic } from "../../wealth/wealth.logic";
import { companyCustomersProjectUpdateRoute } from "../route";
import { ArbitrageCifForm } from "./ArbitrageCIFForm";
import { ArbitrageInsuranceForm } from "./ArbitrageInsuranceForm";

type ArbitrageFormValues = z.infer<typeof arbitrageInsuranceSchema>;

type ArbitrageFormProps = {
  contractID: string;
  name?: string;
  initialData?:
    | z.infer<typeof arbitrageCifSchema>
    | z.infer<typeof arbitrageInsuranceSchema>;
  sriTolerate?: number;
};

export const ArbitrageForm: FC<ArbitrageFormProps> = ({
  contractID,
  name,
  initialData,
  sriTolerate,
}) => {
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
        <ArbitrageInsuranceForm
          contractID={contractID}
          name={name}
          initialData={initialData as z.infer<typeof arbitrageInsuranceSchema>}
          instrumentQuery={instrumentQuery}
          sriTolerate={sriTolerate}
        />
      ) : (
        <ArbitrageCifForm
          contractID={contractID}
          name={name}
          initialData={initialData as z.infer<typeof arbitrageCifSchema>}
          instrumentQuery={instrumentQuery}
          sriTolerate={sriTolerate}
        />
      )}
    </div>
  );
};
