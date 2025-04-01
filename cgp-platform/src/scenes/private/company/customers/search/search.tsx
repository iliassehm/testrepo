import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";

import { Dialog } from "../../../../../components";
import { Tabs } from "../../../../../components/Tabs";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import FavoriteSearches from "./FavoriteSearches";
import { CompanyCustomersSearchLogic } from "./search.logic";
import { SearchWealth } from "./SearchWealth";
import { useSaveSearch } from "./useSaveSearch";

export const CustomerSearch = ({
  defaultRoute = "company",
}: {
  defaultRoute?: string;
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const url =
    defaultRoute === "company"
      ? "/company/$companyId/customers/search"
      : "/parent-company/$companyId/customers/search";

  const search = useSearch({
    from: url,
  });
  const params = useParams({
    from: url,
  });
  const navigate = useNavigate({
    from: url,
  });

  const saveMutation = useSaveSearch();

  const searchMutation = useMutation({
    mutationFn: async (schema: unknown) => {
      return gql.client.request(CompanyCustomersSearchLogic.customersSearch(), {
        companyID: params.companyId,
        schema,
      });
    },
    onSuccess: (data, variables) => {
      if (!data.searchCustomers?.id) return;

      const hasInvestQuery = (
        variables as { conditions: Array<{ field: string }> }
      ).conditions.some((el) => el.field.startsWith("investments"));

      navigate({
        to:
          defaultRoute === "company"
            ? "/company/$companyId/customers/search/result/$id"
            : "/parent-company/$companyId/customers/search/result/$id",
        ...(hasInvestQuery && {
          search: {
            hasInvestQuery: true,
          },
        }),
        params: {
          id: data.searchCustomers.id,
        },
      });
    },
    onError: async (err) => {
      toast.current?.show({
        summary: "Error",
        detail:
          err instanceof Error
            ? err.message
            : t("scenes.customersSearch.errors.search"),
        severity: "error",
      });
    },
  });

  return (
    <Dialog
      open
      onOpenChange={() =>
        navigate({
          to: "/company/$companyId/customers",
          params,
        })
      }
      className="container px-0 py-0"
    >
      <div className="flex gap-8 lg:flex-row flex-col">
        <div className="flex flex-col p-8 py-6 grow min-h-[400px]">
          <Tabs
            tabs={
              [
                {
                  id: "wealth",
                  label: "scenes.customersSearch.tabs.wealth",
                  component: (
                    <SearchWealth
                      onSearchSubmit={searchMutation.mutate}
                      onSaveSubmit={saveMutation.mutate}
                      isSaving={saveMutation.isLoading}
                      isSearching={searchMutation.isLoading}
                      onClose={() =>
                        navigate({
                          to: "/company/$companyId/customers",
                          params,
                        })
                      }
                      defaultValues={search.schema}
                    />
                  ),
                },
                // {
                //   id: "budget",
                //   label: "scenes.customersSearch.tabs.budget",
                //   component: <div></div>,
                // },
              ] as const
            }
            defaultTab={search.tab}
            onChange={(tab) => {
              navigate({
                to: "/company/$companyId/customers/search",
                search: {
                  tab,
                },
              });
            }}
          />
        </div>

        <div className="min-w-[400px] bg-[#F6F4F3] flex flex-col py-6 px-8 shadow-xl drop-shadow-xl flex-wrap shrink">
          <FavoriteSearches defaultRoute={defaultRoute} />
        </div>
      </div>
    </Dialog>
  );
};
