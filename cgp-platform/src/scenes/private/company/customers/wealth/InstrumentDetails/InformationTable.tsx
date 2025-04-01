import React from "react";
import { useTranslation } from "react-i18next";

import { Widget } from "../../../../../../components/Widget";

interface InformationTableProps {
  instrument: any;
  onEdit?: () => void;
}

export const InformationTable: React.FC<InformationTableProps> = ({
  instrument,
}) => {
  const { t } = useTranslation();
  const investmentTypes = t("investmentTypes", {
    returnObjects: true,
  }) as Record<string, string>;

  return (
    <Widget className="p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-blue-600">
        {t(`forms.fields.instrumentDetails.information.label`)}
      </h2>
      <div>
        <table className="w-full overflow-hidden rounded-lg shadow-lg">
          <thead>
            <tr className="text-[11px] bg-gray-50">
              <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                {t(`forms.fields.instrumentDetails.information.code`)}
              </th>
              <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                {t(
                  `forms.fields.instrumentDetails.information.managementCompany`
                )}
              </th>
              <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                {t(`forms.fields.instrumentDetails.information.currency`)}
              </th>
              <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                {t(`forms.fields.instrumentDetails.information.type`)}
              </th>
              <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                {t(`forms.fields.instrumentDetails.information.nature`)}
              </th>
              <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                {t(`forms.fields.instrumentDetails.information.location`)}
              </th>
              <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                {t(`forms.fields.instrumentDetails.information.sri`)}
              </th>
              <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                {t(`forms.fields.instrumentDetails.information.sfdr`)}
              </th>
              <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                {t(`forms.fields.instrumentDetails.information.pea`)}
              </th>
              <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                {t(`forms.fields.instrumentDetails.information.peaPme`)}
              </th>
              <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                {t(`forms.fields.instrumentDetails.information.esg`)}
              </th>
              <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                {t(`forms.fields.instrumentDetails.information.referenceIndex`)}
              </th>
              {instrument.dic ? (
                <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                  {t(`forms.fields.instrumentDetails.information.dic`)}
                </th>
              ) : (
                <></>
              )}
              {instrument.prospectus ? (
                <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                  {t(`forms.fields.instrumentDetails.information.pros`)}
                </th>
              ) : (
                <></>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="text-[11px]">
              <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-center">
                {instrument?.code ?? "-"}
              </td>
              <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-center">
                {instrument?.managementCompany ?? "-"}
              </td>
              <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-center">
                {instrument?.currency ?? "-"}
              </td>
              <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-center">
                {investmentTypes[instrument?.category] ?? "-"}
              </td>
              <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-center">
                {instrument?.subcategory ?? "-"}
              </td>
              <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-center">
                {instrument?.location ?? "-"}
              </td>
              <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-center">
                {instrument?.riskIndicator ?? "-"}
              </td>
              <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-center">
                {(instrument?.sfdr as string) ?? "-"}
              </td>
              <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-center">
                {instrument.pea != null
                  ? instrument?.pea
                    ? t(`forms.fields.instrumentDetails.information.yes`)
                    : t(`forms.fields.instrumentDetails.information.no`)
                  : "-"}
              </td>
              <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-center">
                {instrument.peaPme != null
                  ? instrument?.peaPme
                    ? t(`forms.fields.instrumentDetails.information.yes`)
                    : t(`forms.fields.instrumentDetails.information.no`)
                  : "-"}
              </td>
              <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-center">
                {instrument.esg != null
                  ? instrument?.esg
                    ? t(`forms.fields.instrumentDetails.information.yes`)
                    : t(`forms.fields.instrumentDetails.information.no`)
                  : "-"}
              </td>
              <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-center">
                {instrument?.indiceReference ?? "-"}
              </td>
              {instrument?.dic ? (
                <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-center">
                  <a
                    href={instrument.dic}
                    target="_blank"
                    className="flex justify-center"
                  >
                    <img
                      src="/svg/pdf-upload.svg"
                      alt={instrument.dic}
                      className="w-5"
                    />
                  </a>
                </td>
              ) : (
                <></>
              )}
              {instrument?.prospectus ? (
                <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-center">
                  <a
                    href={instrument.prospectus}
                    target="_blank"
                    className="flex justify-center"
                  >
                    <img
                      src="/svg/pdf-upload.svg"
                      alt={instrument.prospectus}
                      className="w-5"
                    />
                  </a>
                </td>
              ) : (
                <></>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </Widget>
  );
};
