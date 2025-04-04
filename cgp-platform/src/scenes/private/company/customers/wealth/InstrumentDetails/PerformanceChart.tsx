import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";

import { Widget } from "../../../../../../components/Widget";

interface PerformanceChartProps {
  data: { x: string; y: number }[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const { t } = useTranslation();
  const normalizedData = data.sort((a, b) => parseInt(a.x) - parseInt(b.x));

  const options = {
    chart: {
      type: "area" as const,
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth" as const,
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    xaxis: {
      type: "category" as const,
      tickAmount: Math.min(data.length),
      labels: {
        show: true,
        rotate: -45,
        formatter: (val: string) => {
          return val;
        },
      },
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
      },
    },
    tooltip: {
      x: {
        format: "yyyy",
      },
    },
    colors: ["#4F46E5"],
  };

  const series = [
    {
      name: "Price",
      data: normalizedData,
    },
  ];

  return (
    <Widget className="p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-blue-600">
        {t(`forms.fields.instrumentDetails.performanceLabel`)}
      </h2>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </Widget>
  );
};
