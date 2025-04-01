import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import { Button, Icon } from "../../../../../components";
import { formatCurrency } from "../../../../../helpers";
import { downloadFile } from "../../../../../helpers/downloadFile";
import { gql } from "../../../../../service/client";
import { AssetsSearchTable } from "./AssetsSearchTable";
import InvestmentSearchResultTable from "./investmentSearchResult.table";
import { CompanyCustomersSearchLogic } from "./search.logic";
import { useSaveSearch } from "./useSaveSearch";

export const CustomersSearchResult: React.FC<{ defaultRoute?: string }> = ({
  defaultRoute = "company",
}) => {
  const { t } = useTranslation();

  const url =
    defaultRoute === "company"
      ? "/company/$companyId/customers/search/result/$id"
      : "/parent-company/$companyId/customers/search/result/$id";

  const searchParams = useSearch({
    from: url,
  }) as { hasInvestQuery?: boolean };

  const params = useParams({
    from: url,
  });
  const navigate = useNavigate({
    from: url,
  });

  const resultsQuery = useQuery({
    queryFn: () =>
      gql.client.request(CompanyCustomersSearchLogic.customersSearchResult(), {
        id: params.id,
        companyID: params.companyId,
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: exportSearchResult, isLoading: isExporting } = useMutation(
    "exportSearchResult",
    () =>
      gql.client.request(CompanyCustomersSearchLogic.exportSearchResult(), {
        id: params.id,
        companyID: params.companyId,
        hasInvestQuery: Boolean(searchParams.hasInvestQuery),
      }),
    {
      onSuccess: (response) => {
        if (response?.url) {
          downloadFile(response.url, `results`);
        }
      },
    }
  );

  const addToFavorites = useSaveSearch();

  const resultData = useMemo(
    () => (resultsQuery.data?.getSearchResult as any)?.result ?? [],
    [resultsQuery.data]
  );

  const totalSearchResult = useMemo(
    () =>
      resultsQuery.data?.getSearchResult?.result.reduce(
        (acc, result) =>
          acc +
          (result.__typename === "CustomerAsset" ? result.valuation ?? 0 : 0),
        0
      ) ?? 0,
    [resultsQuery.data?.getSearchResult?.result]
  );

  const totalSupportAmount = useMemo(
    () =>
      resultsQuery.data?.getSearchResult?.result.reduce(
        (acc, result) =>
          acc +
          (result.__typename === "CustomerAsset"
            ? result.investmentValuation ?? 0
            : 0),
        0
      ) ?? 0,
    [resultsQuery]
  );

  return (
    <div className="flex flex-col gap-12 container">
      <div className="flex items-center justify-between w-full">
        <AmountDisplay
          assetAmount={totalSearchResult}
          supportAmount={totalSupportAmount}
          showSupportAmount={Boolean(searchParams.hasInvestQuery)}
        />
        <div className={"flex gap-4"}>
          <Button
            isLoading={isExporting}
            label=""
            variant="bordered"
            className="flex items-center justify-center py-3 px-4"
            onClick={() => exportSearchResult()}
          >
            <Icon type="download" className="w-5 h-5" />
          </Button>
          <Button
            label={t("scenes.customersSearch.results.saveSearch")}
            className="text-xl self-center justify-self-end rounded-full bg-white drop-shadow-xl text-black border border-black/20 px-4"
            disabled={!resultsQuery.data?.getSearchResult?.schema}
            loading={addToFavorites.isLoading}
            onClick={() =>
              addToFavorites.mutate(resultsQuery.data?.getSearchResult?.schema)
            }
          />
          <Button
            label={t("scenes.customersSearch.results.updateSearch")}
            className="text-xl self-center justify-self-end rounded-full px-6 drop-shadow-xl"
            onClick={() =>
              navigate({
                to: "/company/$companyId/customers/search",
                search: {
                  tab: resultsQuery.data?.getSearchResult?.schema.type,
                  schema: resultsQuery.data?.getSearchResult?.schema,
                },
              })
            }
          />
        </div>
      </div>
      <div className="bg-white p-4 drop-shadow-lg rounded-xl">
        {searchParams.hasInvestQuery ? (
          <InvestmentSearchResultTable data={resultData} />
        ) : (
          <AssetsSearchTable
            data={resultData}
            isLoading={resultsQuery.isLoading || resultsQuery.isRefetching}
          />
        )}
      </div>
    </div>
  );
};

const AmountDisplay: React.FC<{
  supportAmount: number;
  assetAmount: number;
  showSupportAmount?: boolean;
}> = ({ supportAmount = 0, assetAmount = 0, showSupportAmount }) => {
  const { t } = useTranslation();

  return (
    <div className={"rounded-xl shadow p-4 bg-white"}>
      <div className={"flex items-center gap-4 font-bold"}>
        <p className={"text-lg"}>
          {t("scenes.customersSearch.results.assetAmount")}&nbsp;:
        </p>
        <p className={"text-2xl text-blue-800"}>
          {formatCurrency({ value: assetAmount, instrument: "EUR" })}
        </p>
      </div>
      {showSupportAmount && (
        <>
          <div className={"h-4"} />
          <div className={"flex items-center gap-4 font-bold"}>
            <p className={"text-lg"}>
              {t("scenes.customersSearch.results.supportAmount")}&nbsp;:
            </p>
            <p className={"text-2xl text-blue-800"}>
              {formatCurrency({ value: supportAmount, instrument: "EUR" })}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
