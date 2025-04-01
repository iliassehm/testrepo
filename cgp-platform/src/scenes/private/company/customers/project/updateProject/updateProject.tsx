import { useParams, useSearch } from "@tanstack/react-router";
import { useQuery } from "react-query";

import { InvestorProfileFormInputs } from "../../../../../../../shared/schemas/investorProfileFormSchema";
import { gql } from "../../../../../../service/client";
import { ProjectType } from "../../../../../../types";
import { CustomersConformityLogic } from "../../conformity/conformity.logic";
import { ArbitrageCifForm } from "../addProject/ArbitrageCIFForm";
import { ArbitrageForm } from "../addProject/ArbitrageForm";
import { CifSubscriptionForm } from "../addProject/CifSubscriptionForm";
import { ComplementarySubscriptionForm } from "../addProject/ComplementarySubscriptionForm";
import { InsuranceSubscriptionForm } from "../addProject/InsuranceSubscriptionForm";
import { RedemptionForm } from "../addProject/RedemptionForm";
import { useProject } from "../useProject";

export const CompanyCustomersProjectUpdate = () => {
  const search = useSearch({
    from: "/company/$companyId/customer/$customerId/projects/$projectID/update",
  });

  const params = useParams({
    from: "/company/$companyId/customer/$customerId/projects/$projectID/update",
  });

  const project = useProject({
    id: params.projectID as string,
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

  if (project.isLoading) {
    return null;
  }

  if (search.type === ProjectType.SubscriptionLifeInsurance) {
    return (
      <InsuranceSubscriptionForm
        initialData={project.data?.project.metadata}
        name={project.data?.project.name ?? ""}
        isUpdate
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
        initialData={project.data?.project.metadata}
        name={project.data?.project.name ?? ""}
        isUpdate
        sriTolerate={
          data?.investorProfileForm.manualSri ??
          data?.investorProfileForm.finalSri
        }
      />
    );
  }

  if (
    search.type === ProjectType.ArbitrageCif ||
    search.type === ProjectType.ArbitrageLifeInsurance
  ) {
    return (
      <ArbitrageForm
        contractID={project.data?.project.metadata.assetID}
        initialData={project.data?.project.metadata}
        name={project.data?.project.name ?? ""}
        sriTolerate={
          data?.investorProfileForm.manualSri ??
          data?.investorProfileForm.finalSri
        }
      />
    );
  }

  if (search.type === ProjectType.Redemption) {
    return (
      <RedemptionForm
        contractID={project.data?.project.metadata.assetID}
        initialData={project.data?.project.metadata}
        name={project.data?.project.name ?? ""}
        sriTolerate={
          data?.investorProfileForm.manualSri ??
          data?.investorProfileForm.finalSri
        }
      />
    );
  }

  if (
    search.type === ProjectType.ComplementaryCif ||
    search.type === ProjectType.ComplementaryLifeInsurance
  ) {
    return (
      <ComplementarySubscriptionForm
        contractID={project.data?.project.metadata.assetID}
        initialData={project.data?.project.metadata}
        name={project.data?.project.name ?? ""}
        sriTolerate={
          data?.investorProfileForm.manualSri ??
          data?.investorProfileForm.finalSri
        }
      />
    );
  }

  return null;
};
