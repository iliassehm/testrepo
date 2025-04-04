import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import TabSelect from "../../../../../../components/TabSelect";
import { gql } from "../../../../../../service/client";
import { Performance } from "../../../../../../types";
import { ActivitiesWidgetLogic } from "./activitiesWidget.logic";

interface ActivitiesGraphProps {
  assetId: string;
  assetName?: string;
  onPerformanceChange?: (performance: Performance) => void;
}
export const ActivitiesGraph = ({
  assetId,
  assetName,
  onPerformanceChange,
}: ActivitiesGraphProps) => {
  const graphDurations = {
    "7d": new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    "30d": new Date(
      new Date().setDate(new Date().getDate() - 30)
    ).toISOString(),
    "90d": new Date(
      new Date().setDate(new Date().getDate() - 90)
    ).toISOString(),
    "1y": new Date(
      new Date().setFullYear(new Date().getFullYear() - 1)
    ).toISOString(),
    all: new Date(
      new Date().setFullYear(new Date().getFullYear() - 10)
    ).toISOString(),
    ytd: new Date(new Date().getFullYear(), 0, 1).toISOString(),
  };
  const [selectedDuration, setSelectedDuration] =
    useState<keyof typeof graphDurations>("30d");
  const { t } = useTranslation();
  const { data } = useQuery(
    ["asset_activities_graph", assetId, selectedDuration],
    () =>
      gql.client.request(ActivitiesWidgetLogic.getGraphData(), {
        assetId: assetId,
        from: graphDurations[selectedDuration],
      }),
    {
      keepPreviousData: true,
      enabled: true,
    }
  );

  useEffect(() => {
    if (
      !data?.customerWalletActivitiesGraph ||
      data.customerWalletActivitiesGraph.length < 2
    ) {
      return;
    }

    const performance: Performance = {
      gain:
        data.customerWalletActivitiesGraph[
          data.customerWalletActivitiesGraph.length - 1
        ].value - data.customerWalletActivitiesGraph[0].value,
      evolution:
        (data.customerWalletActivitiesGraph[
          data.customerWalletActivitiesGraph.length - 1
        ].value -
          data.customerWalletActivitiesGraph[0].value) /
        data.customerWalletActivitiesGraph[0].value,
    };
    onPerformanceChange?.(performance);
  }, [data]);

  const seriesData = useMemo<{ x: string; y: number }[]>(() => {
    // filter out duplicate dates
    const uniqueData: { x: string; y: number }[] = [];
    const uniqueDates: Set<string> = new Set();

    data?.customerWalletActivitiesGraph?.forEach((activity) => {
      if (!uniqueDates.has(activity.start) && activity.start) {
        uniqueDates.add(activity.start);
        uniqueData.push({
          x: activity.start,
          y: activity.value,
        });
      }
    });

    return uniqueData;
  }, [data]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <TabSelect
        tabs={Object.keys(graphDurations).map((key) => ({
          label: t(`scenes.wealth.activities.duration.${key}`),
          value: key,
        }))}
        selectedTab={selectedDuration}
        onSelect={(tab) =>
          setSelectedDuration(tab as keyof typeof graphDurations)
        }
      />
      <div className="w-full rounded-lg shadow-lg">
        <ReactApexChart
          options={{
            chart: {
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
            },
            yaxis: {
              labels: {
                formatter: function (val) {
                  return val.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  });
                },
              },
            },
            xaxis: {
              categories: seriesData.map((activity) => activity.x),
              labels: {
                formatter: function (val) {
                  return new Date(val).toLocaleDateString("fr-FR");
                },
                rotate: -45,
                hideOverlappingLabels: false,
                showDuplicates: false,
                trim: false,
              },
              tickAmount: 10,
            },

            fill: {
              type: "gradient",
              gradient: {
                opacityFrom: 0.7,
                opacityTo: 0,
                stops: [0, 100],
              },
              colors: ["#4761c8"],
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: "smooth",
              width: 3,
              colors: ["#4761c8"],
            },
          }}
          series={[
            {
              name: assetName,
              data: seriesData,
            },
          ]}
          type="area"
          width="100%"
          height={350}
          animations={{
            enabled: true,
            easing: "easein",
            dynamicAnimation: {
              speed: 500,
            },
          }}
        />
      </div>
    </div>
  );
};
