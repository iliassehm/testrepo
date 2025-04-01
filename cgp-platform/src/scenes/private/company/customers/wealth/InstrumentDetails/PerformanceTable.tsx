import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { Widget } from "../../../../../../components/Widget";

export interface PerformanceCalendaire {
  year: string;
  value: string;
}

interface PerformanceTableProps {
  performances: PerformanceCalendaire[];
}

enum Period {
  DAY = "forms.fields.instrumentDetails.performance.periods.day",
  WEEK = "forms.fields.instrumentDetails.performance.periods.week",
  MONTH = "forms.fields.instrumentDetails.performance.periods.month",
  YEAR = "forms.fields.instrumentDetails.performance.periods.year",
  START_YEAR = "forms.fields.instrumentDetails.performance.periods.startYear",
  UNKNOWN = "forms.fields.instrumentDetails.performance.periods.unknown",
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({
  performances,
}) => {
  const { t } = useTranslation();

  return (
    <Widget className="p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-blue-600">
        {t(`forms.fields.instrumentDetails.performance.label`)}
      </h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
        <table className="w-full overflow-hidden rounded-lg shadow-lg">
          <thead>
            <tr className="text-[11px] bg-gray-50">
              <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                {t(`forms.fields.instrumentDetails.performance.periods.label`)}
              </th>
              <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                {t(`forms.fields.instrumentDetails.performance.performance`)}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {performances.map((perf, index) => (
              <tr key={index} className="text-[11px] hover:bg-gray-50">
                <td className="h-8 border-b border-r border-slate-100  text-xs text-center text-grey-700">
                  {perf.year}
                </td>
                <td
                  className={clsx(
                    "h-8 border-b border-r border-slate-100 pr-10 text-xs text-right",
                    {
                      "text-green-500":
                        parseFloat(perf.value as string) * 100 > 0,
                      "text-red-500":
                        parseFloat(perf.value as string) * 100 <= 0,
                    }
                  )}
                >
                  {Math.round(parseFloat(perf.value) * 10000) / 100}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Widget>
  );
};
