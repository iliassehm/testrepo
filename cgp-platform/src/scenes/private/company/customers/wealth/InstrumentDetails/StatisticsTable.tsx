import { useTranslation } from "react-i18next";

import { Widget } from "../../../../../../components/Widget";

interface Statistics {
  minimumInvestissement?: string;
  frequenceValorisation?: string;
  nombreParts?: string;
  lastPrice?: { value: number | null; date: string };
}

interface StatisticsTableProps {
  statistics?: Statistics;
}

const frequenceValorisationValues = [
  {
    value: "Annuel",
    label: "forms.fields.instrumentDetails.statsvalorisationFrequency..annual",
  },
  {
    value: "Bi-annuel",
    label:
      "forms.fields.instrumentDetails.stats.valorisationFrequency.biannual",
  },
  {
    value: "Trimestriel",
    label:
      "forms.fields.instrumentDetails.stats.valorisationFrequency.quarterly",
  },
  {
    value: "Mensuel",
    label: "forms.fields.instrumentDetails.stats.valorisationFrequency.monthly",
  },
  {
    value: "Bi-mensuel",
    label:
      "forms.fields.instrumentDetails.stats.valorisationFrequency.bimonthly",
  },
  {
    value: "Hebdomadaire",
    label: "forms.fields.instrumentDetails.stats.valorisationFrequency.weekly",
  },
  {
    value: "Quotidien",
    label: "forms.fields.instrumentDetails.stats.valorisationFrequency.daily",
  },
  {
    value: "Irregulier",
    label:
      "forms.fields.instrumentDetails.stats.valorisationFrequency.irregular",
  },
  {
    value: "Autre regulier",
    label: "forms.fields.instrumentDetails.stats.valorisationFrequency.other",
  },
];

export const StatisticsTable: React.FC<StatisticsTableProps> = ({
  statistics,
}) => {
  const { t } = useTranslation();
  return (
    <Widget className="p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-center text-blue-600">
        {t(`forms.fields.instrumentDetails.stats.label`)}
      </h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="text-xs text-gray-600 mb-1 text-center">
            {t(`forms.fields.instrumentDetails.stats.minInvestment`)}
          </div>
          <div className="text-sm text-center">
            {statistics?.minimumInvestissement
              ? Math.round(parseFloat(statistics.minimumInvestissement))
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €"
              : "-"}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="text-xs text-gray-600 mb-1 text-center">
            {t(
              `forms.fields.instrumentDetails.stats.valorisationFrequency.label`
            )}
          </div>
          <div className="text-sm text-center">
            {statistics?.frequenceValorisation
              ? t(
                  frequenceValorisationValues.find(
                    (item) => item.value === statistics?.frequenceValorisation
                  )?.label || "-"
                )
              : "-"}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="h-8 text-xs text-gray-600 mb-1 text-center">
            {t(`forms.fields.instrumentDetails.stats.sharesNb`)}
          </div>
          <div className="text-sm text-center">
            {statistics?.nombreParts
              ? Math.round(parseFloat(statistics.nombreParts))
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              : "-"}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="h-8 text-xs text-gray-600 mb-1 text-center">
            {t(`forms.fields.instrumentDetails.stats.latestPrice`)}
          </div>
          <div className="text-sm text-center">
            {statistics?.lastPrice?.value
              ? Math.round(statistics.lastPrice.value * 100) / 100
              : "-"}{" "}
            €
          </div>
        </div>
      </div>
    </Widget>
  );
};
