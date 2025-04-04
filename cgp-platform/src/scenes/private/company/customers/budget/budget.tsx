import { useParams } from "@tanstack/react-router";
import { useQuery } from "react-query";

import { Loading } from "../../../../../components";
import { gql } from "../../../../../service/client";
import { CompanyCustomersInformationsLogic } from "../informations/informations.logic";
import { BudgetCompany } from "./budgetCompany";
import { BudgetPerson } from "./budgetPerson";

export function CompanyCustomersBudget() {
  // Hooks
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/informations",
  });

  // Queries
  const { data, isLoading } = useQuery(
    ["companyCustomersInformationsGeneral", params.customerId],
    () =>
      gql.client.request(CompanyCustomersInformationsLogic.queries(), {
        companyID: params.companyId as string,
        customerID: params.customerId as string,
      })
  );

  if (isLoading) return <Loading />;

  if (data?.customer?.type === "person") {
    return <BudgetPerson />;
  }
  return <BudgetCompany />;
}
