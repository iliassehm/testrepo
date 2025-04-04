import { Link, useParams } from "@tanstack/react-router";
import clsx from "clsx";
import { Paginator } from "primereact/paginator";
import { useTranslation } from "react-i18next";

import { Widget } from "../../../../../../components/Widget";
import { CustomerFilters } from "./InstrumentDetail";

export interface ClientSupport {
  code: string;
  assetId: string;
  assetName: string;
  assetGroup: string;
  customerId: string;
  customerName: string;
  amount: number;
  performance: {
    amount: number;
    percentage: number;
  };
  detentions?: number | null;
}

interface ClientSupportTableProps {
  data: ClientSupport[];
  filters: CustomerFilters;
  totalRecordsProps?: number;
  onFiltersChange?: (filters: Partial<CustomerFilters>) => void;
}

export const ClientSupportTable: React.FC<ClientSupportTableProps> = ({
  data,
  filters,
  totalRecordsProps,
  onFiltersChange,
}) => {
  const { t } = useTranslation();
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/wealth",
  });

  const page = filters.page ?? 0;
  const limit = filters.limit ?? 0;
  const skip = page * limit;
  const totalRecords = totalRecordsProps ?? 0;

  const handleSearch = (filters: Partial<CustomerFilters>) => {
    onFiltersChange?.(filters);
  };
  return (
    <Widget className="p-6">
      <>
        <h2 className="text-lg font-semibold mb-4 text-blue-600">
          {t(`forms.fields.instrumentDetails.customers.label`)}
        </h2>

        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
          <table className="w-full overflow-hidden rounded-lg shadow-lg">
            <thead>
              <tr className="text-[11px] bg-gray-50">
                <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                  {t(`forms.fields.instrumentDetails.customers.name`)}
                </th>
                <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                  {t(`forms.fields.instrumentDetails.customers.amount`)}
                </th>
                <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                  {t(`forms.fields.instrumentDetails.customers.performance`)}
                </th>
                <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                  {t(`forms.fields.instrumentDetails.customers.detention`)}
                </th>
                <th className="bg-stone-100 p-2 text-sm text-slate-600 text-center">
                  {t(`forms.fields.instrumentDetails.customers.contractName`)}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((el, index) => (
                <tr key={index} className="text-[11px] hover:bg-grey-50">
                  <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700">
                    {el.customerName}
                  </td>
                  <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-right">
                    {el.amount}€
                  </td>
                  <td
                    className={clsx(
                      "h-14 border-b border-r border-slate-100 p-2 text-xs text-right",
                      {
                        "text-green-500": el.performance.amount > 0,
                        "text-red-500": el.performance.amount <= 0,
                      }
                    )}
                  >
                    <div className="flex">
                      <div className="w-1/2 text-center">
                        {el.performance.amount < 0 ? "- " : "+ "}
                        {el.performance.amount}€
                      </div>
                      <div className="w-1/2 text-center">
                        {el.performance.percentage}%
                      </div>
                    </div>
                  </td>
                  <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-right">
                    {el.detentions ?? "-"} %
                  </td>
                  <td className="h-14 border-b border-r border-slate-100 p-2 text-xs text-grey-700 text-right">
                    <Link
                      to="/company/$companyId/customer/$customerId/wealth/$type/$investmentId"
                      params={{
                        companyId: params.companyId,
                        customerId: el.customerId as string,
                        type: el.assetGroup,
                        investmentId: el.assetId,
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      {el.assetName}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Paginator
            first={skip}
            totalRecords={totalRecords}
            rowsPerPageOptions={[5, 15, 30]}
            rows={limit}
            onPageChange={(e) => handleSearch({ page: e.page, limit: e.rows })}
          />
        </div>
      </>
    </Widget>
  );
};
