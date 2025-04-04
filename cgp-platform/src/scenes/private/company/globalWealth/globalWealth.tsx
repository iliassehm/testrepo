import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Tooltip } from "primereact/tooltip";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import { CompanyMetadata } from "../../../../../shared/schemas/companyMetadata";
import {
  AssetIcon,
  AssetItem,
  Button,
  PercentPie,
  Text,
} from "../../../../components";
import { EventSlider } from "../../../../components/EventSlider";
import { LargeTitle } from "../../../../components/LargeTitle";
import { PerformanceTable } from "../../../../components/PerformanceTable";
import { SmallTabs } from "../../../../components/Tabs";
import { Widget } from "../../../../components/Widget";
import { globalAmountFormatting } from "../../../../helpers";
import { gql } from "../../../../service/client";
import {
  AssetGroup,
  AssetPerformanceOrder,
  WealthFilter,
} from "../../../../types";
import { companyGlobalAddAutomaticRoute } from "../addWealth/route";
import { CampaignsWidget } from "../home/home";
import events from "./events.json";
import { GlobalWealthLogic } from "./globalWealth.logic";
import { GlobalWealthSkeleton } from "./globalWealth.skeleton";
import {
  companyAssetTypeWealthRoute,
  companydGlobalWealthIndexRoute,
  companyGlobalSubWealthRoute,
} from "./route";

export enum AssetCategory {
  asset,
  support,
}

const percentFormatter = Intl.NumberFormat(undefined, {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const ignoredPerformanceType = [AssetGroup.Banking, AssetGroup.HomeLoan];

export function GlobalWealth() {
  // Hooks
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(AssetPerformanceOrder.Best);
  const params = useParams({ from: companydGlobalWealthIndexRoute.id });
  const navigate = useNavigate({ from: companydGlobalWealthIndexRoute.id });
  const search = useSearch({
    from: companydGlobalWealthIndexRoute.id,
  });

  const handleAddWealth = () => {
    navigate({
      to: companyGlobalAddAutomaticRoute.fullPath,
      params,
      search,
    });
  };

  // Queries
  const query = useQuery(
    ["global_wealth", params.companyId, search.period, search.wealthFilter],
    () => {
      return gql.client.request(GlobalWealthLogic.queries(), {
        company: params.companyId ?? "",
        options: selectedTab,
        ...search.range,
        computing: search.wealthFilter,
        ignoring: ignoredPerformanceType,
        campaignLimit: 5,
      });
    }
  );

  const assetData = query.data?.assets ?? [];
  const topflop =
    (query.data?.company?.metadata as CompanyMetadata)?.topflop ?? {};

  const performanceData = useMemo(() => {
    return Object.keys(topflop)
      .map((groupName) => {
        const group = (topflop as any)[groupName];
        const topOrFlop =
          selectedTab == AssetPerformanceOrder.Worst ? "flop" : "top";
        const gain = group?.[topOrFlop]?.[0]?.realizedGain
          ? group?.[topOrFlop]?.[0]?.realizedGain
          : 0;
        return {
          type: groupName as AssetGroup,
          name: t(`asset_group.${groupName}`),
          gain: {
            value: gain,
            instrument: "EUR",
          },
          evolution: group?.[topOrFlop]?.[0]?.globalPerformance
            ? group?.[topOrFlop]?.[0]?.globalPerformance
            : 0,
        };
      })
      .sort((a, b) => {
        return selectedTab == AssetPerformanceOrder.Worst
          ? (a.evolution ?? 0) - (b.evolution ?? 0)
          : (b.evolution ?? 0) - (a.evolution ?? 0);
      })
      .slice(0, 3);
  }, [topflop, assetData, selectedTab]);

  if (query.isLoading) return <GlobalWealthSkeleton />;
  let liquidity = "N/A";
  if (query.data?.liquidity?.instrument && query.data?.liquidity?.value)
    liquidity = Intl.NumberFormat(undefined, {
      ...globalAmountFormatting,
      currency: query.data?.liquidity?.instrument ?? "EUR",
    }).format(query.data.liquidity?.value);

  let liquidityRepresentation = "N/A";
  if (
    query.data?.liquidity?.value &&
    query.data.company?.wealth?.value &&
    query.data.company.wealth.value
  ) {
    const ratio = query.data.liquidity.value / query.data.company.wealth.value;
    liquidityRepresentation = Intl.NumberFormat(undefined, {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(ratio);
  }

  let assetsUnderManagementPercent = "N/A";
  if (
    query.data?.details?.managedWealth?.value &&
    query.data.company?.wealth?.value &&
    query.data.company.wealth.value
  ) {
    const ratio =
      query.data?.details?.managedWealth?.value /
      query.data?.company?.wealth.value;
    assetsUnderManagementPercent = percentFormatter.format(ratio);
  }

  const repartition = (query.data?.companyWealth ?? [])
    .filter((value) => !!value.amount)
    .map((value) => ({
      id: value.name,
      label: t(`asset_group.${value.name}`),
      value: value.amount.value,
    }));

  const changeTab = (changed: WealthFilter) => {
    navigate({
      to: companydGlobalWealthIndexRoute.id,
      params: params,
      search: { wealthFilter: changed },
    });
  };

  const navigateToAssetTypeWealth = (type: AssetGroup) => {
    navigate({
      to: companyAssetTypeWealthRoute.id,
      params: { ...params, type: type },
      search: { wealthFilter: search.wealthFilter } as any,
    });
  };

  return (
    <div className="flex max-w-8xl flex-col">
      <div className="mb-8 flex flex-col gap-x-8 gap-y-8 xl:flex-row">
        {query.data?.companyWealth ? (
          <Widget
            className="w-full pt-4 xl:w-1/2"
            viewAll={{
              to: companyGlobalSubWealthRoute.fullPath,
              search: { wealthFilter: search.wealthFilter },
            }}
          >
            <SmallTabs
              tabs={[
                {
                  id: WealthFilter.Customers,
                  label: "scenes.globalWealth.clientsWealth",
                  component: (
                    <div className="flex flex-col gap-y-1">
                      {!query.isLoading &&
                        query.data?.companyWealth
                          ?.slice(0, 8)
                          .map((asset, index) => (
                            <div
                              key={`${asset.name}-${index}`}
                              className="border-b border-grey-300 pb-1"
                            >
                              <AssetItem
                                assetName={`asset_group.${asset.name}`}
                                amount={
                                  asset.name === AssetGroup.HomeLoan
                                    ? Math.abs(asset.amount?.value ?? 0)
                                    : asset.amount?.value
                                }
                                gain={
                                  ignoredPerformanceType.includes(asset.name) ==
                                  false
                                    ? asset.performance?.gain
                                    : undefined
                                }
                                evolution={
                                  ignoredPerformanceType.includes(asset.name) ==
                                  false
                                    ? asset.performance?.evolution ?? 0
                                    : undefined
                                }
                                onClick={() =>
                                  navigateToAssetTypeWealth(asset.name)
                                }
                              />
                            </div>
                          ))}
                    </div>
                  ),
                },
                {
                  id: WealthFilter.UnderManagements,
                  label: "scenes.globalWealth.assetsManagement",
                  component: (
                    <div className="flex flex-col gap-y-1">
                      {!query.isLoading &&
                        query.data?.companyWealth
                          ?.slice(0, 8)
                          .map((asset, index) => (
                            <div
                              key={`${asset.name}-${index}`}
                              className="border-b border-grey-300 pb-1"
                            >
                              <AssetItem
                                assetName={`asset_group.${asset.name}`}
                                amount={asset.amount.value}
                                gain={
                                  ignoredPerformanceType.includes(asset.name) ==
                                  false
                                    ? asset.performance?.gain
                                    : undefined
                                }
                                evolution={
                                  ignoredPerformanceType.includes(asset.name) ==
                                  false
                                    ? asset.performance?.evolution ?? 0
                                    : undefined
                                }
                                onClick={() => {
                                  navigateToAssetTypeWealth(asset.name);
                                }}
                              />
                            </div>
                          ))}
                    </div>
                  ),
                },
              ]}
              selected={search.wealthFilter ?? WealthFilter.Customers}
              setSelected={changeTab}
            />
          </Widget>
        ) : (
          <img
            src="/svg/encours_empty.svg"
            alt="encours_empty"
            className="w-full rounded-lg bg-white p-4 pt-4 xl:w-1/2"
          />
        )}
        <div className="flex h-auto w-full flex-col justify-between gap-y-8 xl:w-1/2">
          {search.wealthFilter === WealthFilter.UnderManagements ? (
            <div
              className="flex cursor-pointer items-center justify-center self-end rounded-full bg-blue-800 drop-shadow-xl hover:bg-blue-1000"
              onClick={handleAddWealth}
            >
              <Tooltip target=".pi-plus" />
              <i
                className="pi pi-plus flex rounded-full p-2 md:hidden"
                style={{ color: "white", fontWeight: "900" }}
                data-pr-tooltip={t("scenes.wealthConnection.add.tooltip") ?? ""}
                data-pr-position="left"
                data-pr-at="left-15 center"
                data-pr-my="right center"
              ></i>
              <Button
                label={t("scenes.wealthConnection.add.tooltip")}
                icon="pi pi-plus"
                onClick={handleAddWealth}
                className="hidden md:flex"
              />
            </div>
          ) : (
            ""
          )}
          {performanceData.length > 0 ? (
            <PerformanceTable
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              data={performanceData}
            />
          ) : (
            <img
              src="/svg/flop_empty.svg"
              alt="flop_empty"
              className="w-full rounded-lg bg-white p-4"
            />
          )}
          {search.wealthFilter === WealthFilter.Customers &&
            query.data?.mostOccuring && (
              <div className="flex h-full gap-x-3">
                <div className="section flex w-1/2 flex-col items-center justify-center p-2 drop-shadow-xl">
                  <div className="flex w-full flex-col items-center justify-center gap-y-3 py-4">
                    <Text
                      as="h3"
                      label="scenes.sub.mostPopularInvestment"
                      className="text-center font-medium text-blue-1100"
                    />
                    {query.data?.mostOccuring ? (
                      <div className="relative flex flex-col items-center gap-y-3">
                        <AssetIcon
                          assetName={`asset_group.${query.data.mostOccuring.group}`}
                        />
                        <div className="text-sm text-blue-1100">
                          <Text
                            label={`asset_group.${query.data.mostOccuring.group}`}
                            className="inline-block text-center"
                          />

                          <sup> ({query.data.mostOccuring.count})</sup>
                        </div>
                      </div>
                    ) : (
                      <LargeTitle className="text-center text-xl" title="N/A" />
                    )}
                  </div>
                </div>
                <div className="section flex h-auto w-1/2 flex-col items-center p-2 drop-shadow-xl">
                  <div className="flex h-full w-fit flex-col items-center justify-evenly">
                    <Text
                      as="h3"
                      label="scenes.sub.cash"
                      className="text-center font-medium text-blue-1100"
                    />
                    <div className="relative">
                      <p className="font-bold text-2xl text-blue-800">
                        {liquidity}
                      </p>
                      <p className="flex flex-row-reverse font-medium text-sm text-blue-800">
                        {liquidityRepresentation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          {search.wealthFilter === WealthFilter.UnderManagements && (
            <div className="flex h-full gap-x-3">
              <CampaignsWidget campaigns={query.data?.campaigns ?? []} />
              <div className="section flex h-auto w-1/2 flex-col items-center p-2 drop-shadow-xl">
                <div className="flex h-full flex-col items-center justify-evenly">
                  <Text
                    as="h3"
                    label="scenes.sub.assetsManagement"
                    className="text-center font-medium text-blue-1100"
                  />
                  <div className="relative">
                    <p className="font-bold text-2xl text-blue-800">
                      {assetsUnderManagementPercent}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {search.wealthFilter === WealthFilter.Customers && (
        <EventSlider events={events} />
      )}
      {search.wealthFilter === WealthFilter.UnderManagements && (
        <div className="w-1/2">
          <PercentPie data={repartition} legendSide="bottom" />
        </div>
      )}
    </div>
  );
}
