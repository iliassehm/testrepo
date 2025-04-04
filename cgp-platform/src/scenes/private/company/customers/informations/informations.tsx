import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Loading } from "../../../../../components";
import { Tab, Tabs } from "../../../../../components/Tabs";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import { Customer } from "../../../../../types";
import { useCustomerContext } from "../customerContext";
import { CompaniesInformations } from "./companies";
import { CompaniesActivitiesInformations } from "./companies/CompaniesActivitiesInformations";
import { CompaniesBankAccountsInformations } from "./companies/CompaniesBankAccountsInformations";
import { CompaniesManagersInformations } from "./companies/CompaniesManagersInformations";
import { DetailInformations } from "./detailInformationsForm";
import GeneralInformationsForm from "./generalFom";
import { CompanyCustomersInformationsLogic } from "./informations.logic";
import { Relation } from "./relation";

export type SelectedBusiness = Pick<Customer, "name" | "id">;

export function CompanyCustomersInformations() {
  // Hooks
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { companyId, customerId, customer, customerQuery } =
    useCustomerContext();

  const search = useSearch({
    from: "/company/$companyId/customer/$customerId/informations",
  });
  const navigate = useNavigate({
    from: "/company/$companyId/customer/$customerId/informations",
  });

  const [selectedBusiness, setSelectedBusiness] = useState<
    SelectedBusiness | undefined
  >(undefined);

  const businessListQuery = useQuery(
    ["companyCustomersInformationsBusiness", companyId, customerId],
    () =>
      gql.client.request(
        CompanyCustomersInformationsLogic.businessListQuery(),
        {
          companyID: companyId,
          customerId: customerId,
        }
      ),
    {
      onSuccess: (data) => {
        if (data.businessList?.length) {
          setSelectedBusiness({
            id: data.businessList[0].id,
            name: data.businessList[0].name,
          });
        }
      },
    }
  );

  // Mutations

  const updateManagerMutation = useMutation({
    mutationFn: (managerID: string) =>
      gql.client.request(
        CompanyCustomersInformationsLogic.customerManagerUpdate(),
        {
          customerID: customerId,
          companyID: companyId,
          managerID,
        }
      ),
    onError: () => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: t("forms.fields.updateManager.error"),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["manager", customerId]);
      queryClient.invalidateQueries(["company", "managers"]);
    },
  });

  const createCustomerFromBusiness = useMutation(
    (input: { id: string; addToCustomerReference: boolean }) =>
      gql.client.request(
        CompanyCustomersInformationsLogic.createCustomerFromBusiness(),
        {
          companyID: companyId,
          customerID: customerId,
          businessID: input.id,
          addToCustomerReference: input.addToCustomerReference,
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "companyCustomersInformations",
          companyId,
          customerId,
        ]);

        toast?.current?.show({
          severity: "success",
          summary: "Success",
          detail: t("forms.fields.notifications.success.save"),
        });

        queryClient.invalidateQueries("layout_customer");
      },
    }
  );

  // Events
  const onChange = (tab: Tab["id"]) => {
    customerQuery.refetch();
    navigate({
      to: "/company/$companyId/customer/$customerId/informations",
      params: { companyId, customerId },
      search: {
        tab: tab,
      },
    });
  };

  if (customerQuery.isLoading) return <Loading />;

  const currentBusiness = businessListQuery.data?.businessList?.find(
    (business) => business.id === selectedBusiness?.id
  );

  const generalInformations =
    customer?.type === "person"
      ? currentBusiness?.informations?.general
      : customer?.informations?.general;

  const tabs = [] as any[];
  const tabsCompany = [
    {
      id: "companies",
      label: "scenes.customers.details.tabs.companies",
      component: customerQuery.isRefetching ? (
        <Loading />
      ) : (
        <div>
          <CompaniesInformations
            defaultValues={{
              ...(generalInformations?.information ?? {}),
              seniorAdvisor:
                generalInformations?.seniorAdvisor ??
                generalInformations?.information?.seniorAdvisor,
              secondaryAdvisor:
                generalInformations?.secondaryAdvisor ??
                generalInformations?.information?.secondaryAdvisor,
            }}
            displaySelectBusiness={customer?.type === "person"}
            businessList={
              (businessListQuery.data?.businessList as Customer[]) ?? []
            }
            // tag={data?.customer?.tag}
          />
        </div>
      ),
    },
    {
      id: "managers",
      label: "scenes.customers.details.tabs.managers",
      component: customerQuery.isRefetching ? (
        <Loading />
      ) : (
        <div>
          <CompaniesManagersInformations
            managers={generalInformations?.managers}
            nbManager={generalInformations} //.nbManager
            setSelectedBusiness={setSelectedBusiness}
            selectedBusiness={selectedBusiness}
            displaySelectBusiness={customer?.type === "person"}
            businessList={
              (businessListQuery.data?.businessList as Customer[]) ?? []
            }
            createCustomerFromBusiness={createCustomerFromBusiness.mutate}
          />
        </div>
      ),
    },
    {
      id: "activities",
      label: "scenes.customers.details.tabs.activities",
      component: customerQuery.isRefetching ? (
        <Loading />
      ) : (
        <div>
          <CompaniesActivitiesInformations
            activities={generalInformations?.activities}
            setSelectedBusiness={setSelectedBusiness}
            selectedBusiness={selectedBusiness}
            displaySelectBusiness={customer?.type === "person"}
            businessList={
              (businessListQuery.data?.businessList as Customer[]) ?? []
            }
            createCustomerFromBusiness={createCustomerFromBusiness.mutate}
          />
        </div>
      ),
    },
    {
      id: "bankAccounts",
      label: "scenes.customers.details.tabs.bankAccounts",
      component: customerQuery.isRefetching ? (
        <Loading />
      ) : (
        <div>
          <CompaniesBankAccountsInformations
            bankAccounts={generalInformations?.bankAccounts}
            setSelectedBusiness={setSelectedBusiness}
            selectedBusiness={selectedBusiness}
            displaySelectBusiness={customer?.type === "person"}
            businessList={
              (businessListQuery.data?.businessList as Customer[]) ?? []
            }
            createCustomerFromBusiness={createCustomerFromBusiness.mutate}
          />
        </div>
      ),
    },
  ];

  const tabsHuman = [
    {
      id: "general",
      label: "scenes.customers.details.tabs.general",
      component: customerQuery.isRefetching ? (
        <Loading />
      ) : (
        <div className="flex gap-x-4">
          <GeneralInformationsForm />
        </div>
      ),
    },
    {
      id: "details",
      label: "scenes.customers.details.tabs.details",
      component: customerQuery.isRefetching ? (
        <Loading />
      ) : (
        <div className="flex gap-x-4">
          <DetailInformations />
        </div>
      ),
    },
    {
      id: "companies",
      label: "scenes.customers.details.tabs.companies",
      component: customerQuery.isRefetching ? (
        <Loading />
      ) : (
        <div>
          <CompaniesInformations
            defaultValues={{ ...generalInformations?.information }}
            displaySelectBusiness={customer?.type === "person"}
            businessList={
              (businessListQuery.data?.businessList as Customer[]) ?? []
            }
          />
        </div>
      ),
    },
    {
      id: "relations",
      label: "scenes.customers.details.tabs.relation",
      component: (
        <div>
          <Relation />
        </div>
      ),
    },
  ];

  if (customer?.type === "person") {
    tabs.push(...tabsHuman);
  } else {
    search.tab = "companies";
    tabs.push(...tabsCompany);
  }

  return (
    <>
      <div className="section relative max-w-8xl pb-4">
        <Tabs
          tabs={tabs}
          defaultTab={search.tab}
          onChange={onChange}
          panelClassname="px-10"
        />
      </div>
    </>
  );
}
