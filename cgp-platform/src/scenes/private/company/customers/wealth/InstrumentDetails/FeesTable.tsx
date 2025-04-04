import { useTranslation } from "react-i18next";

import { Widget } from "../../../../../../components/Widget";

interface Fees {
  priips?: string;
  current?: string;
  gestion?: string;
  subscription?: string;
  redemption?: string;
}

interface FeesTableProps {
  fees?: Fees;
}

export const FeesTable: React.FC<FeesTableProps> = ({ fees }) => {
  const { t } = useTranslation();
  return (
    <Widget className="p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-center text-blue-600">
        {t(`forms.fields.instrumentDetails.fees.label`)}
      </h2>
      <div className="grid grid-cols-5 gap-4">
        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="text-xs text-gray-600 mb-1 text-center">
            {t(`forms.fields.instrumentDetails.fees.priips`)}
          </div>
          <div className="text-sm text-center">
            {fees?.priips
              ? `${(fees.priips as unknown as number) * 100}%`
              : "-"}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="text-xs text-gray-600 mb-1 text-center">
            {t(`forms.fields.instrumentDetails.fees.current`)}
          </div>
          <div className="text-sm text-center">
            {fees?.current
              ? `${(fees.current as unknown as number) * 100}%`
              : "-"}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="text-xs text-gray-600 mb-1 text-center">
            {t(`forms.fields.instrumentDetails.fees.gestion`)}
          </div>
          <div className="text-sm text-center">
            {fees?.gestion
              ? `${(fees.gestion as unknown as number) * 100}%`
              : "-"}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="text-xs text-gray-600 mb-1 text-center">
            {t(`forms.fields.instrumentDetails.fees.subscription`)}
          </div>
          <div className="text-sm text-center">
            {fees?.subscription
              ? `${(fees.subscription as unknown as number) * 100}%`
              : "-"}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="text-xs text-gray-600 mb-1 text-center">
            {t(`forms.fields.instrumentDetails.fees.redemption`)}
          </div>
          <div className="text-sm text-center">
            {fees?.redemption
              ? `${(fees.redemption as unknown as number) * 100}%`
              : "-"}
          </div>
        </div>
      </div>
    </Widget>
  );
};
