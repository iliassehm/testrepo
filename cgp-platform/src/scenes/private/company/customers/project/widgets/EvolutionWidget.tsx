import ReactApexChart from "react-apexcharts";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type EvolutionData = {
  evolutionPercentage: number;
  evolutionAmount: number;
};

interface EvolutionFeesWidgetProps {
  form: ReturnType<typeof useForm<any>>;
}
export const EvolutionFeesWidget: React.FC<EvolutionFeesWidgetProps> = ({
  form,
}) => {
  const { t } = useTranslation();

  const evolutionValues: EvolutionData[] = form.watch("evolution");

  return (
    <div className="mb-10">
      <div className="pb-4">
        <h1 className="text-[#4761C8] font-bold text-xl mb-4">
          {t("scenes.customers.projects.addProject.cif.fees.exanteFeesLabel")}
        </h1>
      </div>

      <div>
        <div className="flex flex-col">
          <div className="grid gap-4 grid-cols-6 bg-blue-800 text-white py-2 px-4 mt-2 rounded-xl">
            <div className="flex ml-10 items-center">
              {t(`scenes.customers.projects.addProject.cif.evolution.years`)}
            </div>
            {Array.from({ length: 5 }, (_, year) => (
              <div className="flex justify-center items-center" key={year}>
                {year + 1}
              </div>
            ))}
          </div>
        </div>
        <div className="">
          <div className="grid gap-4 grid-cols-6 pl-2 pt-2">
            <div className="flex items-center">
              <div className="ml-12 text-xs">
                {t(
                  `scenes.customers.projects.addProject.cif.evolution.percentFees`
                )}
              </div>
            </div>
            {Array.from({ length: 5 }, (_, year) => (
              <div className="pt-2">
                <div className="flex justify-center items-center">
                  <div className="text-xs">
                    {evolutionValues[year].evolutionPercentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-4 grid-cols-6 pl-2 pt-2">
            <div className="flex items-center">
              <div className="ml-12 text-xs">
                {t(
                  `scenes.customers.projects.addProject.cif.evolution.euroFees`
                )}
              </div>
            </div>
            {Array.from({ length: 5 }, (_, year) => (
              <div className="pt-2">
                <div className="flex justify-center items-center">
                  <div className="text-xs">
                    {evolutionValues[year].evolutionAmount}€
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                  return (val / 100).toLocaleString("fr-FR", {
                    style: "percent",
                    minimumFractionDigits: 2,
                  });
                },
              },
            },
            xaxis: {
              categories: evolutionValues.map((_, index) => index + 1),
              labels: {
                rotate: -45,
                formatter: function (val) {
                  return val;
                },
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
              enabled: true,
            },
            stroke: {
              curve: "smooth",
              width: 3,
              colors: ["#4761c8"],
            },
          }}
          series={[
            {
              name: t(
                `scenes.customers.projects.addProject.cif.evolution.percentFees`
              ),
              data: evolutionValues.map(
                (evolution) => evolution.evolutionPercentage
              ),
            },
          ]}
          type="area"
          width="100%"
          height={350}
        />
      </div>
    </div>
  );
};
