import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useQuery } from "react-query";

import { gql } from "../../../../../../service/client";
import { CustomerWallet } from "../../../../../../types";
import { ActivitiesWidgetLogic } from "./activitiesWidget.logic";

interface PerformanceGraphProps {
  assetId: CustomerWallet["id"];
  assetName?: string;
}
export const PerformanceGraph = ({
  assetId,
  assetName,
}: PerformanceGraphProps) => {
  const [seriesData, setSeriesData] = useState<{ x: string; y: number }[]>([]);
  const activitiesQuery = useQuery(
    ["asset_activities", assetId],
    () =>
      gql.client.request(ActivitiesWidgetLogic.getActivitiesByYear(), {
        assetId: assetId,
      }),
    {
      keepPreviousData: true,
      enabled: true,
      onSuccess: (data) => {
        const newSeriesData: { x: string; y: number }[] = [];
        data?.customerWalletActivitiesByYear?.map((activity) => {
          newSeriesData.push({
            x: activity.year.toString(),
            y: parseFloat(activity.endValue || '0') as number,
          });
        });
        setSeriesData(newSeriesData);
      },
    }
  );

  return (
    <div className="flex flex-col gap-4 w-full">
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
