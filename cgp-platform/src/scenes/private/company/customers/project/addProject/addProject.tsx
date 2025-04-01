import { useParams, useSearch } from "@tanstack/react-router";
import { useQuery } from "react-query";

import { InvestorProfileFormInputs } from "../../../../../../../shared/schemas/investorProfileFormSchema";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import { gql } from "../../../../../../service/client";
import { ProjectType } from "../../../../../../types";
import { CustomersConformityLogic } from "../../conformity/conformity.logic";
import { ArbitrageCifForm } from "./ArbitrageCIFForm";
import { ArbitrageForm } from "./ArbitrageForm";
import { ArbitrageInsuranceForm } from "./ArbitrageInsuranceForm";
import { CifSubscriptionForm } from "./CifSubscriptionForm";
import { ComplementarySubscriptionForm } from "./ComplementarySubscriptionForm";
import { InsuranceSubscriptionForm } from "./InsuranceSubscriptionForm";
import { RedemptionForm } from "./RedemptionForm";

export const CompanyCustomersProjectAdd = () => {
  const currentRoute = useCurrentRoute();
  const params = useParams({
    from: currentRoute.routeId,
  }) as { companyId: string; customerId: string; projectID: string };
  const search = useSearch({
    from: "/company/$companyId/customer/$customerId/projects/add",
  });

  const queryKey = ["investorProfile", params.companyId, params.customerId];
  const { data } = useQuery(
    queryKey,
    () =>
      gql.client.request(CustomersConformityLogic.investorProfileQueries(), {
        companyID: params.companyId,
        customerID: params.customerId,
      }),
    {
      select: (data) => {
        const investorProfileForm = (data?.investorProfileForm ??
          {}) as InvestorProfileFormInputs;

        const finalSRI = investorProfileForm?.finalSri;
        const manualSRI = investorProfileForm?.manualSri;

        return {
          investorProfileForm: {
            finalSri: finalSRI ?? null,
            manualSri: manualSRI ?? null,
          },
        };
      },
    }
  );

  if (search.type === ProjectType.SubscriptionLifeInsurance) {
    return (
      <InsuranceSubscriptionForm
        name={search.name as string}
        product={search.product}
        initialData={{
          objectives: search.objectives as string,
          horizon: search.horizon as number,
        }}
        sriTolerate={
          data?.investorProfileForm.manualSri ??
          data?.investorProfileForm.finalSri
        }
      />
    );
  }

  if (search.type === ProjectType.SubscriptionCif) {
    return (
      <CifSubscriptionForm
        name={search.name as string}
        product={search.product}
        initialData={{
          objectives: search.objectives as string,
          horizon: search.horizon as number,
        }}
        sriTolerate={
          data?.investorProfileForm.manualSri ??
          data?.investorProfileForm.finalSri
        }
      />
    );
  }

  if (
    (search.type === ProjectType.ArbitrageLifeInsurance ||
      search.type === ProjectType.ArbitrageCif) &&
    search.contractID !== undefined
  ) {
    return (
      <ArbitrageForm
        contractID={search.contractID}
        name={search.name}
        sriTolerate={
          data?.investorProfileForm.manualSri ??
          data?.investorProfileForm.finalSri
        }
      />
    );
  }

  if (
    search.type === ProjectType.Redemption &&
    search.contractID !== undefined
  ) {
    return (
      <RedemptionForm
        contractID={search.contractID}
        name={search.name}
        sriTolerate={
          data?.investorProfileForm.manualSri ??
          data?.investorProfileForm.finalSri
        }
      />
    );
  }

  if (
    (search.type === ProjectType.ComplementaryCif ||
      search.type === ProjectType.ComplementaryLifeInsurance) &&
    search.contractID !== undefined
  ) {
    return (
      <ComplementarySubscriptionForm
        contractID={search.contractID}
        name={search.name}
        sriTolerate={
          data?.investorProfileForm.manualSri ??
          data?.investorProfileForm.finalSri
        }
      />
    );
  }

  return null;
};
