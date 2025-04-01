import {
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import { t } from "i18next";
import { Skeleton } from "primereact/skeleton";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { AssetIcon, Button, Text } from "../../../../../../components";
import ContentWithLineBreaks from "../../../../../../components/ContentWithLineBreaks/ContentWithLineBreaks";
import DoubleLabel from "../../../../../../components/DoubleLabels/DoubleLabels";
import { Tab } from "../../../../../../components/Tabs";
import { statusOptions } from "../../../../../../constants";
import {
  DeleteConfirmationDialog,
  formatCurrency,
} from "../../../../../../helpers";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import {
  Amount,
  AssetGroup,
  CustomerInvestment,
  CustomerWallet,
  Performance,
  WealthFilter,
} from "../../../../../../types";
import { FieldDate } from "../../../../../../UIComponents/FieldDate/FieldDate";
import Select, { Option } from "../../../../../../UIComponents/Select/Select";
import { CompanyCustomersLogic } from "../../customers.logic";
import { ActivitiesWidget } from "../ActivitiesWidget/ActivitiesWidget";
import { AssetCreationLogic } from "../AssetCreation/AssetCreation.logic";
import { AssetDetailLogic } from "../AssetDetail/assetDetail.logic";
import { MovementsWidget } from "../MovementsWidget/MovementsWidget";
import { CustomerWealthAssetSearch } from "../route";
import { WealthTabs } from "../wealth";
import { WealthLogic } from "../wealth.logic";
import { InvestmentTable } from "./investmentTable";

export function WalletInvestment() {
  const router = useRouter();
  const toast = useToast();

  const { t } = useTranslation();
  const navigate = useNavigate({
    from: "/company/$companyId/customer/$customerId/wealth/$type/$investmentId",
  });
  const search = useSearch({
    from: "/company/$companyId/customer/$customerId/wealth/$type/$investmentId",
  });
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/wealth/$type/$investmentId",
  });

  const [deletionVisible, setDeletionVisible] = useState(false);
  const queryClient = useQueryClient();

  const deletionMutation = useMutation(
    "asset_delete",
    () =>
      gql.client.request(AssetDetailLogic.deletion(), {
        assetID: params.investmentId,
        companyID: params.companyId,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["underManagementAssetGroups"]);
        queryClient.invalidateQueries([params.investmentId]);
        queryClient.invalidateQueries(["customer_wealth"]);
        navigate({
          to: "/company/$companyId/customer/$customerId/wealth/",
        });
      },
      onError: () => {
        toast?.current?.show({
          severity: "error",
          summary: t("forms.fields.notifications.error.delete") as string,
        });
      },
    }
  );

  // Queries
  const instrumentQuery = useQuery(
    ["customerWalletInstrument", params.companyId, params.investmentId],
    () =>
      gql.client.request(WealthLogic.customerWalletQueries(), {
        companyID: params.companyId ?? "",
        id: params.investmentId ?? "",
      })
  );

  const managerQuery = useQuery({
    queryKey: ["manager", params.customerId, params.companyId],
    queryFn: () =>
      gql.client.request(CompanyCustomersLogic.customerManager(), {
        id: params.customerId,
        companyID: params.companyId,
      }),
  });

  // Events
  const onTabChange = (tab: Tab["id"]) => {
    const entries = Object.entries(WealthFilter);
    let filter: WealthFilter | undefined = undefined;
    const key = entries.find(([, value]) => value === tab)?.[0];
    if (key) filter = WealthFilter[key as keyof typeof WealthFilter];
    if (tab === "default") {
      filter = undefined;
    }
    navigate({
      to: "/company/$companyId/customer/$customerId/wealth/",
      search: (current: CustomerWealthAssetSearch) => ({
        ...current,
        wealthFilter: filter,
      }),
    } as never);
  };
  const onNavigateBack = () => router.history.back();

  if (
    instrumentQuery.status === "loading" ||
    instrumentQuery.status !== "success"
  )
    return <WealthSkeleton />;

  const wallet = instrumentQuery.data?.customerWallet;
  if (!wallet)
    return (
      <div>
        <img
          src="/svg/encours_empty.svg"
          alt="encours_empty"
          className="w-full p-4"
        />
      </div>
    );

  const performance = undefined;

  const totalAmount: Amount = {
    instrument: "EUR",
    value: 0,
  };

  const data = (wallet.investments || []).map((investment) => {
    totalAmount.value += investment.valuation.value;
    totalAmount.instrument = investment.valuation.instrument;

    return {
      ...investment,
    };
  });

  totalAmount.value = wallet.valuation;

  return (
    <>
      <WealthTabs
        onNavigateBack={onNavigateBack}
        defaultTab={search.wealthFilter}
        onChange={onTabChange}
      />
      <div className="flex flex-col gap-8">
        <div className="relative flex w-full flex-col overflow-hidden rounded-xl bg-white p-5 drop-shadow-xl">
          <Header
            wallet={wallet as CustomerWallet}
            totalAmount={totalAmount}
            performance={performance}
            manager={managerQuery.data?.customer?.manager?.name}
          />
          <InvestmentTable
            data={data as CustomerInvestment[]}
            group={wallet.group}
          />

          <div className="flex flex-col items-start justify-center mt-4">
            <h1 className="font-DMSansBold text-l text-blue-1100 md:text-xl">
              {t("scenes.wealth.sri")}
            </h1>
            {wallet.sri != null && wallet.sri > 0 ? (
              <div className="grid grid-cols-12 gap-4 py-4">
                {Array.from({ length: 7 }).map((it, index) => (
                  <div
                    className={`px-8 py-0 rounded-full font-bold ${wallet.sri === index + 1 ? "bg-blue-800 text-white" : "bg-[#4761C84D]"}`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-blue-800">NC</div>
            )}
          </div>
        </div>
        <>
          <MovementsWidget
            companyID={params.companyId}
            customerID={params.customerId}
            managerID={managerQuery.data?.customer?.manager?.id}
            assetId={wallet.id}
            assetType={params.type as AssetGroup}
            name={wallet.name}
          />
          <ActivitiesWidget
            assetId={wallet.id}
            assetType={params.type as AssetGroup}
            name={wallet.name}
            wallet={wallet as CustomerWallet}
          />
          <div className="relative flex w-2/3 flex-col gap-4 overflow-hidden rounded-xl bg-white p-5 drop-shadow-xl">
            <h1 className="font-DMSansBold text-l text-blue-1100 md:text-xl">
              {t("scenes.wealth.comment")}
            </h1>
            <div className="flex flex-col gap-4">
              <ContentWithLineBreaks
                content={wallet?.metadata?.comment ?? ""}
              />
            </div>
          </div>
        </>
        <Button
          label={"forms.fields.actions.delete"}
          type="button"
          variant="danger"
          onClick={() => {
            setDeletionVisible(true);
          }}
        />
        <DeleteConfirmationDialog
          visible={deletionVisible}
          loading={deletionMutation.isLoading}
          onDeleteConfirmation={() => {
            deletionMutation.mutate();
            setDeletionVisible(false);
          }}
          onClose={() => setDeletionVisible(false)}
        />
      </div>
    </>
  );
}

interface HeaderProps {
  totalAmount: Amount;
  wallet: CustomerWallet;
  performance?: Performance;
  manager?: string | null;
}

interface DatesAndStatusForm {
  openDate?: Date;
  closeDate?: Date;
  status: string;
}

function Header({ wallet, totalAmount, performance, manager }: HeaderProps) {
  // Hooks
  const route = useCurrentRoute();
  const params = route.params as Record<string, string>;
  const toast = useToast();

  // Mutations
  const assetUpdateDatesAndStatusMutation = useMutation(
    "assetUpdateDatesAndStatus",
    (data: DatesAndStatusForm) => {
      return AssetCreationLogic.assetUpdateDatesAndStatus({
        customerID: params.customerId,
        companyID: params.companyId,
        assetID: params.investmentId,
        openDate: data.openDate as Date,
        closeDate: data.closeDate as Date,
        status: data.status,
      });
    },
    {
      onSuccess: async (data) => {
        toast?.current?.show({
          severity: "success",
          summary: t("scenes.wealth.update.success.summary") as string,
          detail: t("scenes.wealth.update.success.detail", {
            name: data?.updated?.name,
          }),
        });
      },
      async onError(error) {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t("scenes.wealth.update.error.summary") as string,
          detail: t("scenes.wealth.update.error.detail"),
        });
      },
    }
  );

  const onSubmit = (data: DatesAndStatusForm) => {
    if (!data.openDate) return;
    assetUpdateDatesAndStatusMutation.mutate(data);
  };

  const form = useForm<DatesAndStatusForm>({
    defaultValues: {
      openDate: wallet.openDate ? new Date(wallet.openDate) : undefined,
      closeDate: wallet.metadata?.closed
        ? new Date(wallet.metadata?.closed)
        : undefined,
      status: wallet.metadata?.status ?? undefined,
    },
  });

  const { control, handleSubmit } = form;

  return (
    <div className="flex flex-row justify-between items-center gap-8 flex-wrap">
      <div className="flex gap-2 mb-2 items-center">
        <AssetIcon assetName={`asset_group.${wallet.group}`} />
        <div className="flex flex-col items-start justify-center">
          <Text
            as="span"
            label={wallet.name}
            className="font-DMSansBold text-lg underline tracking-tight text-blue-1100"
          />
          {performance && (
            <DoubleLabel
              data={performance}
              displayValue="gain"
              valueStyle="text-grey-800"
            />
          )}
        </div>
      </div>

      <div className="flex flex-row gap-4 justify-between flex-1">
        <div className="flex flex-row gap-8">
          <div className="flex flex-col mb-2">
            <Text
              as="span"
              label={"forms.fields.tables.insuranceCompany"}
              className="font-bold text-sm tracking-tight text-blue-800"
            />
            <Text
              as="span"
              label={
                wallet.metadata?.establishment?.name ??
                wallet.metadata?.insuranceCompany ??
                wallet.metadata?.bank ??
                "-"
              }
              className="text-sm tracking-tight"
            />
          </div>
          <div className="flex flex-col mb-2">
            <Text
              as="span"
              label={"forms.fields.tables.accountNumber"}
              className="font-bold text-sm tracking-tight text-blue-800"
            />
            <Text
              as="span"
              label={wallet.accountNumber || "-"}
              className="text-sm tracking-tight"
            />
          </div>

          <form
            className="flex flex-row gap-8"
            onSubmit={handleSubmit((information) =>
              onSubmit({
                ...information,
              })
            )}
          >
            <div>
              <Controller
                name="openDate"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.lifeInsurance.date`
                  ) as string,
                }}
                render={({ field }) => (
                  <>
                    <div className="flex flex-col mb-2">
                      <Text
                        as="span"
                        label={"forms.fields.tables.openDate"}
                        className="font-bold text-sm tracking-tight text-blue-800"
                      />
                      <div className="flex items-center gap-2">
                        <FieldDate
                          id={field.name}
                          {...field}
                          onValueChange={field.onChange}
                          className="bg-slate-50"
                          placeholder={
                            t(`forms.fields.wealth.lifeInsurance.date`) || ""
                          }
                        />
                        <button
                          disabled={
                            form.getValues("openDate") === wallet.openDate
                          }
                          type="submit"
                          className="disabled:opacity-25 disabled:cursor-not-allowed "
                        >
                          <i className="pi pi-save text-blue-800" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              />
            </div>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col mb-2">
                    <Text
                      as="span"
                      label={"forms.fields.tables.status"}
                      className="font-bold text-sm tracking-tight text-blue-800"
                    />
                    <Select
                      id={field.name}
                      {...field}
                      value={statusOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => {
                        field.onChange(option?.value);
                      }}
                      options={statusOptions as Option[]}
                      className="w-full"
                    />
                  </div>
                  <button type="submit">
                    <i className="pi pi-save text-blue-800" />
                  </button>
                </div>
              )}
            />
            <div>
              <Controller
                name="closeDate"
                control={control}
                rules={{
                  required: t(
                    `forms.fields.wealth.lifeInsurance.closeDate`
                  ) as string,
                }}
                render={({ field }) => (
                  <>
                    <div className="flex flex-col mb-2">
                      <Text
                        as="span"
                        label={"forms.fields.tables.closeDate"}
                        className="font-bold text-sm tracking-tight text-blue-800"
                      />
                      <div className="flex items-center gap-2">
                        <FieldDate
                          id={field.name}
                          {...field}
                          onValueChange={field.onChange}
                          className="bg-slate-50"
                          placeholder={
                            t(`forms.fields.wealth.lifeInsurance.closeDate`) ||
                            ""
                          }
                        />
                        <button
                          disabled={
                            form.getValues("closeDate") === wallet.openDate
                          }
                          type="submit"
                          className="disabled:opacity-25 disabled:cursor-not-allowed "
                        >
                          <i className="pi pi-save text-blue-800" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              />
            </div>
          </form>
          {manager && (
            <p className="self-center justify-center">
              {t("forms.fields.tables.advisor")} : {manager}
            </p>
          )}
        </div>
        <div className="flex flex-col mb-2 text-right">
          <Text
            as="h1"
            label={formatCurrency(totalAmount) || "-"}
            className="text-2xl"
          />
        </div>
      </div>
    </div>
  );
}

function IrrInfo() {
  return (
    <div className="relative w-52 overflow-hidden bg-white">
      <p className="p-2 text-sm text-blue-1100">{t("info.irr")}</p>
    </div>
  );
}

function WealthSkeleton() {
  return (
    <div>
      <div className="h-screen w-full">
        <Skeleton height="70%" className="mb-2 rounded-3xl"></Skeleton>
      </div>
    </div>
  );
}
