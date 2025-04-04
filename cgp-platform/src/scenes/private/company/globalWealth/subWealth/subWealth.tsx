import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Tooltip } from "primereact/tooltip";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import { PercentPie } from "../../../../../components";
import { Button, Text } from "../../../../../components";
import { Accordion } from "../../../../../components/Accordion";
import DoubleLabel from "../../../../../components/DoubleLabels/DoubleLabels";
import { Widget } from "../../../../../components/Widget";
import {
  clsx,
  globalAmountFormatting,
  numberFormat,
} from "../../../../../helpers";
import { gql } from "../../../../../service/client";
import {
  AssetGroup,
  Customer,
  CustomerAsset,
  WealthFilter,
} from "../../../../../types";
import { companyGlobalAddAutomaticRoute } from "../../addWealth/route";
import {
  companyAssetTypeWealthRoute,
  companyGlobalSubWealthRoute,
} from "../route";
import { SubWealthLogic } from "./subWealth.logic";
import { SubWealthSkeleton } from "./subWealth.skeleton";

const AssetGroupPlatform = [AssetGroup.Crypto, AssetGroup.Securities];

const ignoredPerformanceType = [AssetGroup.Banking, AssetGroup.HomeLoan];

export function SubWealth() {
  // Hooks
  const params = useParams({
    from: companyGlobalSubWealthRoute.id,
  });
  const search = useSearch({
    from: companyGlobalSubWealthRoute.id,
  });
  const { t } = useTranslation();
  const navigate = useNavigate({
    from: companyGlobalSubWealthRoute.id,
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
    ["subWealth", params.companyId, search.period, search.wealthFilter],
    () =>
      gql.client.request(SubWealthLogic.queries(), {
        company: params.companyId ?? "",
        ...search.range,
        computing: search.wealthFilter,
        limit: 7,
      })
  );

  if (query.status == "loading" || query.status != "success")
    return <SubWealthSkeleton />;

  const navigateToInvestment = (
    customerId: Customer["id"],
    assetId: CustomerAsset["id"],
    assetType: AssetGroup
  ) => {
    if (
      assetType === AssetGroup.LifeInsuranceCapitalization ||
      assetType === AssetGroup.RetirementEmployee
    ) {
      navigate({
        to: "/company/$companyId/customer/$customerId/wealth/$type/$investmentId",
        params: {
          companyId: params.companyId,
          customerId: customerId,
          investmentId: assetId,
          type: assetType,
        },
        from: companyGlobalSubWealthRoute.fullPath,
      });
    } else {
      navigate({
        to: "/company/$companyId/customer/$customerId/wealth/",
        params: {
          companyId: params.companyId,
          customerId: customerId,
        },
        from: companyGlobalSubWealthRoute.fullPath,
        search: { assetID: assetId },
      });
    }
  };

  // Data
  const assets = query.data.assetsTypes ?? [];
  const repartition = (query.data?.assetsTypes ?? [])
    .filter((value) => !!value.amount)
    .map((asset) => {
      const value = asset.amount?.value ?? 0;

      return {
        id: asset.name,
        label: t(`asset_group.${asset.name}`),
        value: asset.name === AssetGroup.HomeLoan ? Math.abs(value) : value,
      };
    });

  const Add = () => (
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
        label={
          search.wealthFilter === WealthFilter.Customers
            ? t("scenes.wealthConnection.add.label")
            : t("scenes.wealthConnection.add.tooltip")
        }
        icon="pi pi-plus"
        onClick={handleAddWealth}
        className="hidden md:flex"
      />
    </div>
  );

  return (
    <Widget
      className="h-fit max-w-8xl"
      title={
        search.wealthFilter === WealthFilter.UnderManagements
          ? `header.underManagement`
          : `scenes.subWealth.title`
      }
      rightElement={<Add />}
    >
      <div className="relative flex w-full flex-col items-start gap-x-0 gap-y-8 md:flex-row md:gap-x-8 md:gap-y-0">
        {assets.length === 0 ? (
          <div>
            <img
              src="/svg/encours_empty.svg"
              alt="encours_empty"
              className="w-full p-4"
            />
          </div>
        ) : (
          <>
            <div className="flex w-full flex-col gap-y-4 md:w-1/2">
              {assets
                .filter(
                  // - note: removing platform account section that have a valuation equal to zero because, it will only show placeholder assets.
                  (assetSection) =>
                    assetSection.amount?.value !== 0 ||
                    !AssetGroupPlatform.includes(assetSection.name)
                )
                .map((asset, index) => {
                  const isLoan = asset.name === AssetGroup.HomeLoan;
                  const assetType = asset.name;

                  return (
                    <Accordion
                      key={`${asset.name}-${index}`}
                      title={t(`asset_group.${asset.name}`)}
                      performance={
                        ignoredPerformanceType.includes(asset.name) ||
                        !asset.performance
                          ? undefined
                          : asset.performance
                      }
                      rightComponent={
                        <div className="flex flex-col items-end gap-y-1">
                          <Text
                            label={Intl.NumberFormat(undefined, {
                              ...globalAmountFormatting,
                              currency: "EUR",
                            }).format(
                              isLoan
                                ? Math.abs(asset.amount.value)
                                : asset.amount.value
                            )}
                            className="font-bold text-base text-grey-800"
                          />

                          {ignoredPerformanceType.includes(asset.name) ==
                            false && !!asset.performance ? (
                            <DoubleLabel
                              data={asset.performance}
                              displayValue="evolution"
                            />
                          ) : undefined}
                        </div>
                      }
                      assetType={asset.name}
                      amount={asset.amount.value}
                    >
                      <div className="flex w-full flex-col">
                        <table className="mb-2 min-w-full divide-y divide-gray-900">
                          <tbody className="divide-y divide-gray-200">
                            {(asset.assetsUnderManagement ?? [])
                              .filter(
                                // - note: Removing platform account for crypto and stocks that are equal to zero.
                                // Because internaly the backend create an asset of both type for each market account.
                                (sub_asset) =>
                                  !AssetGroupPlatform.includes(asset.name) ||
                                  sub_asset.valuation?.value !== 0
                              )
                              .map((asset, index) => (
                                <tr
                                  key={`${asset.name}-${index}`}
                                  className={clsx(
                                    "rounded-xl hover:bg-gray-50",
                                    asset.customer
                                      ? "cursor-pointer"
                                      : undefined
                                  )}
                                  onClick={() => {
                                    asset.customer
                                      ? navigateToInvestment(
                                          asset.customer.id,
                                          asset.id,
                                          assetType
                                        )
                                      : null;
                                  }}
                                >
                                  <td className="w-2/6 py-2 pr-3 text-left text-sm text-grey-700">
                                    <div className="flex items-center gap-x-2 text-sm">
                                      {asset.customer?.name ? (
                                        asset.customer?.name
                                      ) : (
                                        <img src="/svg/flag.svg" />
                                      )}
                                    </div>
                                  </td>
                                  <td className="w-2/6 py-2 pr-3 text-left text-sm text-grey-700">
                                    {asset.name}
                                  </td>
                                  <td className="w-2/6 px-3 py-2 text-right text-sm text-grey-700">
                                    {numberFormat(
                                      isLoan
                                        ? Math.abs(asset.valuation ?? 0)
                                        : asset.valuation ?? 0
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                        <div className="mx-auto mb-2 mt-auto">
                          <Text
                            to={companyAssetTypeWealthRoute.fullPath}
                            params={{
                              ...params,
                              type: asset.name,
                            }}
                            search={{ wealthFilter: search.wealthFilter }}
                            label="commons.viewAll"
                            className="text-xs text-gray-500 underline hover:text-gray-700"
                          />
                        </div>
                      </div>
                    </Accordion>
                  );
                })}
            </div>
            <div className="w-full md:w-1/2">
              <PercentPie data={repartition} legendSide="bottom" />
            </div>
          </>
        )}
      </div>
    </Widget>
  );
}
