import {
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "react-query";

import { Button } from "../../../../../../components";
import { gql } from "../../../../../../service/client";
import { ClientSupport, ClientSupportTable } from "./ClientSupportTable";
import { EditInformationModal } from "./EditInformationModal";
import { FeesTable } from "./FeesTable";
import { FundHeader } from "./FundHeader";
import { InformationTable } from "./InformationTable";
import { InstrumentDetailLogic } from "./InstrumentDetail.logic";
import { InstrumentDetailSkeleton } from "./InstrumentDetailSkeleton";
import { PerformanceChart } from "./PerformanceChart";
import { PerformanceCalendaire, PerformanceTable } from "./PerformanceTable";
import { StatisticsTable } from "./StatisticsTable";

// Mock data
const mockData = {
  priceData: Array.from({ length: 100 }, (_, i) => ({
    x: new Date(2015 + i / 12, 0, 1).toISOString(),
    y: 0,
  })),
};

export interface EditInformationData {
  code: string;
  name: string;
  managementCompany: string;
  currency: string;
  category: string;
  subcategory: string;
  location: string;
  riskIndicator: number;
  sfdr: number;
}

export interface FundInformation {
  code: string;
  label: string;
  category: string;
  managementCompany: string;
  subcategory: string;
  riskIndicator: number;
  dic: string;
  prospectus: string;
  location: string;
  currency: string;
  sfdr: number;
}

export interface CustomerFilters {
  page: number;
  limit: number;
}

export function InstrumentDetail() {
  const router = useRouter();

  const navigate = useNavigate({
    from: "/company/$companyId/customer/$customerId/wealth/instrument/$instrumentCode",
  });
  const search = useSearch({
    from: "/company/$companyId/customer/$customerId/wealth/instrument/$instrumentCode",
  });
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/wealth/instrument/$instrumentCode",
  });

  const [filters, setFilters] = useState<CustomerFilters>({
    page: 0,
    limit: 5,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const onNavigateBack = () => router.history.back();

  const handleFiltersChange = (newFilters: Partial<CustomerFilters>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  // Queries
  const instrumentQuery = useQuery(
    ["instrumentDetailsQuery", params.instrumentCode],
    () =>
      gql.client.request(InstrumentDetailLogic.instrumentDetailsQuery(), {
        id: params.instrumentCode,
      })
  );

  const investmentsQuery = useQuery(
    ["investmentsQuery", params.instrumentCode, filters],
    () =>
      gql.client.request(
        InstrumentDetailLogic.searchInvestmentsByInstrumentCodeInAssets(),
        {
          companyID: params.companyId,
          code: params.instrumentCode,
          page: filters.page,
          limit: filters.limit,
        }
      )
  );

  const instrumentFavoriteQuery = useQuery(
    ["getInstrumentIsFavorite", params.companyId, params.instrumentCode],
    () =>
      gql.client.request(InstrumentDetailLogic.getInstrumentIsFavorite(), {
        companyID: params.companyId,
        code: params.instrumentCode,
      })
  );

  if (instrumentQuery.isLoading) return <InstrumentDetailSkeleton />;

  if (
    instrumentQuery.status !== "success" &&
    investmentsQuery.status !== "success" &&
    instrumentFavoriteQuery.status !== "success"
  )
    return <InstrumentDetailSkeleton />;

  return (
    <>
      <div className="p-6">
        <div className="pl-4 pb-4">
          <Button
            size="small"
            icon="pi pi-chevron-left"
            label="forms.fields.actions.back"
            onClick={onNavigateBack}
          />
        </div>
        <div className=" mx-auto">
          <FundHeader
            title={instrumentQuery.data?.instrumentDetails.label}
            sfdr={instrumentQuery.data?.instrumentDetails.sfdr as number}
            companyID={params.companyId}
            code={params.instrumentCode}
            isFavorite={instrumentFavoriteQuery.data?.instrumentIsFavorite}
            lastValue={
              instrumentQuery.data?.instrumentDetails.closePrice as number
            }
            onEdit={() => setIsEditModalOpen(true)}
          />
          <InformationTable
            instrument={instrumentQuery.data?.instrumentDetails}
          />
          <PerformanceChart
            data={
              instrumentQuery.data?.instrumentDetails?.perfCalendaire
                ? instrumentQuery.data?.instrumentDetails?.perfCalendaire.map(
                    (perf) => ({
                      x: perf.year,
                      y: perf.value as unknown as number,
                    })
                  )
                : []
            }
          />
          <div className="grid grid-cols-2 gap-6">
            <StatisticsTable
              statistics={{
                minimumInvestissement:
                  instrumentQuery.data?.instrumentDetails
                    .minimumInvestissement ?? undefined,
                frequenceValorisation:
                  instrumentQuery.data?.instrumentDetails
                    .frequenceValorisation ?? undefined,
                nombreParts:
                  instrumentQuery.data?.instrumentDetails.nombreParts ??
                  undefined,
                lastPrice: {
                  value:
                    instrumentQuery.data?.instrumentDetails.closePrice ?? null,
                  date: instrumentQuery.data?.instrumentDetails.closePriceDate,
                },
              }}
            />
            <FeesTable
              fees={{
                priips:
                  instrumentQuery.data?.instrumentDetails.fraisPriips ??
                  undefined,
                current:
                  instrumentQuery.data?.instrumentDetails.fraisCourants ??
                  undefined,
                gestion:
                  instrumentQuery.data?.instrumentDetails.fraisGestion ??
                  undefined,
                subscription:
                  instrumentQuery.data?.instrumentDetails.fraisSouscription ??
                  undefined,
                redemption:
                  instrumentQuery.data?.instrumentDetails.fraisRachat ??
                  undefined,
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <PerformanceTable
              performances={
                instrumentQuery.data?.instrumentDetails?.perfCalendaire
                  ? (instrumentQuery.data?.instrumentDetails?.perfCalendaire.map(
                      (perf) => ({
                        year: perf.year,
                        value: perf.value,
                      })
                    ) as unknown as PerformanceCalendaire[])
                  : []
              }
            />
            <ClientSupportTable
              data={
                (investmentsQuery.data
                  ?.searchInvestmentsByInstrumentCodeInAssets
                  .edges as ClientSupport[]) ?? []
              }
              totalRecordsProps={
                investmentsQuery.data?.searchInvestmentsByInstrumentCodeInAssets
                  .totalCount
              }
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          <EditInformationModal
            companyID={params.companyId}
            code={params.instrumentCode}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            information={
              instrumentQuery.data?.instrumentDetails as FundInformation
            }
          />
        </div>
      </div>
    </>
  );
}
