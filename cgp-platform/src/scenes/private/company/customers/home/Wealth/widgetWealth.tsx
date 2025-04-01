import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Skeleton } from "primereact/skeleton";
import { useQuery } from "react-query";

import { Text } from "../../../../../../components/Text";
import {
  financialAssetGroups,
  nonFinancialAssetGroups,
  othersAssetGroups,
  passiveAssetGroups,
} from "../../../../../../constants/assets";
import { percentFormatter } from "../../../../../../helpers/formatting";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import { gql } from "../../../../../../service/client";
import { AssetGroup, WealthFilter } from "../../../../../../types";
import {
  companyCustomersWealthIndexRoute,
  CustomerWealthAssetSearch,
} from "../../wealth/route";
import { WidgetWealthItemProps } from "./wealthTypes";
import { WidgetWealthLogic } from "./widgetWealth.logic";
import WidgetWealthItem from "./widgetWealthItem";

const WidgetWealth = () => {
  const currentRoute = useCurrentRoute();
  const params = useParams({
    from: currentRoute.routeId,
  }) as { companyId: string; customerId: string };
  const currentRouteId = currentRoute.routeId;
  const search = useSearch({
    from: currentRouteId,
  }) as CustomerWealthAssetSearch;
  const navivate = useNavigate();

  const query = useQuery(
    ["customer_wealth", params.customerId, params.companyId, search.period],
    () => {
      if (params.customerId === undefined || params.companyId === undefined) {
        throw new Error("Missing params");
      }

      return gql.client.request(WidgetWealthLogic.queries(), {
        id: params.customerId,
        companyID: params.companyId,
        ...search.range,
        financialIgnoredGroup: Object.values(AssetGroup).filter(
          (value) => !financialAssetGroups.includes(value)
        ),
        nonFinancialIgnoredGroup: Object.values(AssetGroup).filter(
          (value) => !nonFinancialAssetGroups.includes(value)
        ),
        passiveIgnoredGroup: Object.values(AssetGroup).filter(
          (value) => !passiveAssetGroups.includes(value)
        ),
        othersIgnoredGroup: Object.values(AssetGroup).filter(
          (value) => !othersAssetGroups.includes(value)
        ),
        totalIgnoredGroup: [],
      });
    }
  );

  if (query.isLoading) {
    return (
      <Skeleton
        width="100%"
        height="100%"
        className="absolute left-0 top-0 rounded-b-2xl"
      />
    );
  }
  const customer = query.data?.customer ?? undefined;

  const financialTotal = customer?.financialWealth?.value;

  const passiveTotal = customer?.passiveWealth?.value;

  const nonFinancialTotal = customer?.nonFinancialWealth?.value;

  const othersTotal = customer?.othersWealth?.value;

  const totalAmount = customer?.totalWealth?.value ?? 0;
  const financialTotalPercentage = financialTotal / totalAmount;
  const nonFinancialTotalPercentage = nonFinancialTotal / totalAmount;
  // const passiveTotalPercentage = passiveTotal / totalAmount;
  const managedAssetsTotalAmountsPercentage =
    (customer?.underManagement?.value ?? 0) / totalAmount;

  const widgetItems: WidgetWealthItemProps[] = [
    {
      label: "scenes.wealth.financialAssets",
      value: financialTotal,
      gain: customer?.financialPerformance?.gain,
      evolution: customer?.financialPerformance?.evolution ?? 0,
      percentage: percentFormatter.format(
        isNaN(financialTotalPercentage) ? 0 : financialTotalPercentage
      ),
      onClick: () =>
        navivate({
          to: "/company/$companyId/customer/$customerId/wealth/",
          params,
        }),
    },
    {
      label: "scenes.wealth.nonFinancialAssets",
      value: nonFinancialTotal,
      gain: customer?.nonFinancialPerformance?.gain,
      evolution: customer?.nonFinancialPerformance?.evolution ?? 0,
      percentage: percentFormatter.format(
        isNaN(nonFinancialTotalPercentage) ? 0 : nonFinancialTotalPercentage
      ),
      onClick: () =>
        navivate({
          to: "/company/$companyId/customer/$customerId/wealth/",
          params,
        }),
    },
    {
      label: "scenes.wealth.passive",
      value: passiveTotal,
      gain: { value: 0, instrument: "EUR" },
      evolution: 0,
      percentage: undefined,
      onClick: () =>
        navivate({
          to: "/company/$companyId/customer/$customerId/wealth/",
          params,
        }),
    },
    {
      label: "scenes.wealth.managedAssets",
      value: customer?.underManagement?.value,
      gain: customer?.underManagementPerformance?.gain,
      evolution: customer?.underManagementPerformance?.evolution ?? 0,
      percentage: percentFormatter.format(
        isNaN(managedAssetsTotalAmountsPercentage)
          ? 0
          : managedAssetsTotalAmountsPercentage
      ),
      onClick: () =>
        navivate({
          to: "/company/$companyId/customer/$customerId/wealth/",
          params,
          search: {
            wealthFilter: WealthFilter.UnderManagements,
          },
        }),
    },
  ];

  if (othersTotal > 0) {
    widgetItems.splice(3, 0, {
      label: "scenes.wealth.others",
      value: othersTotal,
      gain: { value: 0, instrument: "EUR" },
      evolution: 0,
      percentage: undefined,
      onClick: () =>
        navivate({
          to: "/company/$companyId/customer/$customerId/wealth/",
          params,
        }),
    });
  }

  return (
    <>
      <div className="flex flex-col w-full mr-3">
        <div className="flex mb-4 mt-4 absolute">
          <div className="w-full">
            <Text
              as="label"
              label="scenes.customers.wealth.tabs.globalWealth"
              className="text-xl font-bold"
            />
          </div>
        </div>
        <div className="flex w-full mt-10">
          <div className="flex w-full justify-end mx-6 gap-10">
            <Text
              as="label"
              label="forms.fields.tables.activity"
              className="text-base text-grey-600 font-semibold"
            />
          </div>
          <div className="w-1/6 flex justify-center">
            <Text
              as="label"
              label="scenes.customers.wealth.allocation"
              className="text-base text-grey-600 font-semibold"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {widgetItems.map((item, index) => {
            if (item.label === "scenes.wealth.managedAssets") {
              return (
                <div key={index}>
                  <div className="flex mb-4 mt-4">
                    <div className="w-full">
                      <Text
                        as="label"
                        label="scenes.customers.wealth.tabs.wallet"
                        className="text-xl font-bold"
                      />
                    </div>
                  </div>
                  <WidgetWealthItem key={index} {...item} />
                </div>
              );
            }
            return <WidgetWealthItem key={index} {...item} />;
          })}
        </div>
      </div>
      <div className="flex items-center justify-center pt-10">
        <div>
          <Text
            to={companyCustomersWealthIndexRoute.fullPath}
            params={{
              ...params,
            }}
            label="commons.viewAll"
            className="text-xs text-gray-500 underline hover:text-gray-700 whitespace-nowrap"
          />
        </div>
      </div>
    </>
  );
};

export default WidgetWealth;
