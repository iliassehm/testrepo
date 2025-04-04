import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Trans, useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { PercentPie, Text } from "../../../../../components";
import { Accordion } from "../../../../../components/Accordion";
import { LargeTitle } from "../../../../../components/LargeTitle";
import { Widget } from "../../../../../components/Widget";
import {
  benefitsAssetGroups,
  financialAssetGroups,
  nonFinancialAssetGroups,
  othersAssetGroups,
  passiveAssetGroups,
} from "../../../../../constants/assets";
import { globalAmountFormatting } from "../../../../../helpers/formatting";
import { useCustomerWealth } from "../../../../../hooks/useCustomerWealth";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import {
  AssetGroup,
  Customer,
  CustomerAsset,
  CustomerType,
  CustomerWealth,
  WealthFilter,
} from "../../../../../types";
import { GlobalWealthLogic } from "../../globalWealth/globalWealth.logic";
import { AssetDetail } from "./AssetDetail/AssetDetail";
import { AssetDetailLogic } from "./AssetDetail/assetDetail.logic";
import { AssetTable } from "./AssetTable";
import { CustomerWealthAssetSearch } from "./route";
import { OwnershipModal } from "./WalletTab/ownershipModal";
import { WealthLogic } from "./wealth.logic";
import { WealthSkeleton } from "./wealth.skeleton";

export type FinancialAsset = CustomerWealth & {
  name: AssetGroup;
  id: string;
};
export type FinancialItem = CustomerAsset & {
  amount: { value: number };
};

export const GlobalWealthTab = ({
  computing,
}: {
  computing?: WealthFilter;
}) => {
  // Hooks
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/wealth/",
  });

  const navigate = useNavigate({
    from: "/company/$companyId/customer/$customerId/wealth/",
  });
  const { t } = useTranslation();
  const search = useSearch({
    from: "/company/$companyId/customer/$customerId/wealth/",
  }) as CustomerWealthAssetSearch;

  const toast = useToast();
  const queryClient = useQueryClient();

  // Queries
  const query = useCustomerWealth({
    customerId: params.customerId,
    company: params.companyId,
    search: search,
    computing: computing,
  });

  const { data: usersInCustomerReferenceData } = useQuery(
    ["users_in_customer_reference", params.companyId, params.customerId],
    () =>
      gql.client.request<{ users: Customer[] }>(
        AssetDetailLogic.getUsersInCustomerReference(),
        {
          companyId: params.companyId,
          customerId: params.customerId,
        }
      )
  );

  const mutation = useMutation(
    "AssetManagementSwitch",
    GlobalWealthLogic.managementSwitch,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("customer_wealth");
        toast?.current?.show({
          severity: "success",
          summary: t(
            `scenes.customers.wealth.actions.management_switch.success_${data.asset?.underManagement ? WealthFilter.UnderManagements : WealthFilter.Customers}.summary`
          ),
          detail: t(
            `scenes.customers.wealth.actions.management_switch.success_${data.asset?.underManagement ? WealthFilter.UnderManagements : WealthFilter.Customers}.detail`,
            { asset_name: data.asset?.name }
          ),
        });
      },
      onError: (error, variables) => {
        console.error("fail asset managment switch", {
          error: error,
          asset: variables.id,
        });
        toast?.current?.show({
          severity: "error",
          summary: t(
            `scenes.customers.wealth.actions.management_switch.failure_${variables.domain}.summary`
          ),
          detail: t(
            `scenes.customers.wealth.actions.management_switch.failure_${variables.domain}.detail`
          ),
        });
      },
    }
  );

  // Callbacks
  const dimissAssetDetail = () => {
    navigate({
      search: (current: CustomerWealthAssetSearch) => ({
        ...current,
        assetID: undefined,
      }),
    } as never);
  };
  const onAssetDelete = () => {
    query.refetch();
    dimissAssetDetail();
  };
  const dismissOwnershipModal = () => {
    navigate({
      search: (current: CustomerWealthAssetSearch) => ({
        ...current,
        assetOwnershipID: undefined,
      }),
    } as never);
    query.refetch();
  };

  const onAssetSwitch = (item: FinancialItem, domain: WealthFilter) => {
    confirmDialog({
      header: t("scenes.customers.wealth.actions.management_switch.title"),
      message: (
        <Trans
          i18nKey={`scenes.customers.wealth.actions.management_switch.description_${domain}`}
          values={{ asset_name: item.name }}
        />
      ),
      icon: "pi pi-exclamation-triangle",
      acceptLabel: t(
        "scenes.customers.wealth.actions.management_switch.accept"
      ),
      rejectLabel: t(
        "scenes.customers.wealth.actions.management_switch.reject"
      ),
      accept: async () =>
        mutation.mutate({
          id: item.id,
          domain,
          companyID: params.companyId as string,
          customerID: params.customerId as string,
        }),
      // reject,
    });
  };

  const presentAssetDetail = (asset: CustomerAsset) => {
    if (
      (asset.underManagement && asset.group === AssetGroup.RockPaper) ||
      (asset.underManagement && asset.group === AssetGroup.PrivateEquity) ||
      asset.group === AssetGroup.Securities ||
      asset.group === AssetGroup.LifeInsuranceCapitalization ||
      asset.group === AssetGroup.RetirementEmployee
    ) {
      navigate({
        to: "/company/$companyId/customer/$customerId/wealth/$type/$investmentId",
        params: {
          ...(params as Required<typeof params>),
          investmentId: asset.id,
          type: asset.group,
        },
        search: {
          wealthFilter: asset.underManagement
            ? WealthFilter.UnderManagements
            : WealthFilter.Customers,
        },
      });
    } else {
      navigate({
        search: (current: CustomerWealthAssetSearch) => ({
          ...current,
          assetID: asset.id,
        }),
      } as never);
    }
  };

  if (query.isLoading) return <WealthSkeleton />;

  // data
  const financialAssetsData = query.data?.financialWealth ?? [];
  const passive = query.data?.passiveWealth ?? [];
  const nonFinancialAssetsData = query.data?.nonfinancialWealth ?? [];
  const benefitsAssetData = query.data?.benefitsWealth ?? [];
  const othersAssetsData = query.data?.othersWealth ?? [];
  const repartition = (query.data?.repartition ?? []).map((value) => {
    return {
      id: value.name,
      label: t(`asset_group.${value.name}`),
      // Process negative value for bank accounts asset as nothing.
      // So we don't have strange percentage cause by the value value.
      value:
        value.name === AssetGroup.Banking && value.amount.value < 0
          ? 0
          : value.amount.value,
    };
  });

  const financialTotal = financialAssetsData.reduce((value, group) => {
    return value + group.amount.value;
  }, 0);

  const passiveTotal = passive.reduce((value, group) => {
    return value + group.amount.value;
  }, 0);

  const nonFinancialTotal = nonFinancialAssetsData.reduce((value, group) => {
    return value + group.amount.value;
  }, 0);
  const othersTotal = othersAssetsData.reduce((value, group) => {
    return value + group.amount.value;
  }, 0);

  const otherUsersInCustomerReference =
    usersInCustomerReferenceData?.users?.filter(
      (user) => user.id !== params.customerId
    ) ?? [];

  return (
    <div className="flex max-w-8xl flex-col gap-x-8 lg:flex-row">
      <ConfirmDialog />
      <OwnershipModal
        assetId={search.assetOwnershipID ?? ""}
        visible={search.assetOwnershipID != undefined}
        loading={false}
        onClose={dismissOwnershipModal}
        refetchCustomerWealth={query.refetch}
      />
      <div className="mb-8 flex w-full flex-col gap-y-8 lg:mb-0 lg:w-1/2">
        <AssetDetail
          visible={search.assetID !== undefined}
          onHide={dimissAssetDetail}
          companyID={params.companyId as string}
          customerID={params.customerId as string}
          assetID={search.assetID ?? ""}
          onDelete={onAssetDelete}
        />
        <Widget
          title="scenes.wealth.financialAssets"
          className="h-fit w-full"
          rightElement={
            <LargeTitle
              title={Intl.NumberFormat(undefined, {
                ...globalAmountFormatting,
                currency: "EUR",
              }).format(financialTotal)}
              className="font-bold text-xl"
            />
          }
        >
          <div className="flex flex-col gap-x-2 gap-y-4">
            {financialAssetsData.map((financialAsset, index) => (
              <Accordion
                key={`${financialAsset.name}-${index}`}
                amount={financialAsset.amount.value}
                assetType={financialAsset.name}
                title={t(`asset_group.${financialAsset.name}`)}
                className="drop-shadow-none border bg-grey-300"
                rightComponent={
                  <div className="flex flex-col items-end justify-start gap-y-1">
                    <Text
                      label={Intl.NumberFormat(undefined, {
                        ...globalAmountFormatting,
                        currency: "EUR",
                      }).format(financialAsset.amount.value)}
                      className="font-bold text-base text-grey-800"
                    />
                    {/* {financialAsset.performance &&
                      financialAsset.name !== AssetGroup.Banking ? (
                      <DoubleLabel
                        data={financialAsset.performance}
                        displayValue="evolution"
                        className="text-left"
                      />
                    ) : null} */}
                  </div>
                }
              >
                <AssetTable
                  onRowClick={presentAssetDetail}
                  value={financialAsset.data as unknown as FinancialItem[]}
                  passiveAsset={financialAsset as unknown as CustomerAsset}
                  managementSwitch={onAssetSwitch}
                />
              </Accordion>
            ))}
          </div>
        </Widget>
        <PercentPie
          data={repartition}
          legendSide="bottom"
          className="hidden h-auto w-full lg:flex"
        />
      </div>
      <div className="flex w-full flex-col gap-y-8 lg:w-1/2">
        <Widget
          title="scenes.wealth.nonFinancialAssets"
          rightElement={
            <LargeTitle
              title={Intl.NumberFormat(undefined, {
                ...globalAmountFormatting,
                currency: "EUR",
              }).format(nonFinancialTotal)}
              className="font-bold text-xl"
            />
          }
        >
          <div className="flex flex-col gap-x-2 gap-y-4">
            {nonFinancialAssetsData.map((nonFinancialAsset, index) => (
              <Accordion
                key={`${nonFinancialAsset.name}-${index}`}
                amount={nonFinancialAsset.amount.value}
                title={t(`asset_group.${nonFinancialAsset.name}`)}
                assetType={nonFinancialAsset.name}
                className="drop-shadow-none border bg-grey-300"
                rightComponent={
                  <div className="flex flex-col items-end gap-y-1">
                    <Text
                      label={Intl.NumberFormat(undefined, {
                        ...globalAmountFormatting,
                        currency: "EUR",
                      }).format(nonFinancialAsset.amount.value)}
                      className="font-bold text-base text-grey-800"
                    />
                  </div>
                }
              >
                <AssetTable
                  onRowClick={presentAssetDetail}
                  value={nonFinancialAsset.data as unknown as FinancialItem[]}
                  passiveAsset={nonFinancialAsset as unknown as CustomerAsset}
                  managementSwitch={onAssetSwitch}
                />
              </Accordion>
            ))}
          </div>
        </Widget>

        <Widget
          title="scenes.wealth.passive"
          rightElement={
            <LargeTitle
              title={Intl.NumberFormat(undefined, {
                ...globalAmountFormatting,
                currency: "EUR",
              }).format(Math.abs(passiveTotal))}
              className="font-bold text-xl"
            />
          }
        >
          <div className="flex flex-col gap-x-2 gap-y-4">
            {passive.map((passiveAsset, index) => (
              <Accordion
                key={`${passiveAsset.name}-${index}`}
                amount={Math.abs(passiveAsset.amount.value)}
                title={t(`asset_group.${passiveAsset.name}`)}
                assetType={passiveAsset.name}
                className="drop-shadow-none border bg-grey-300"
                rightComponent={
                  <div className="flex flex-col items-end gap-y-1">
                    <Text
                      label={Intl.NumberFormat(undefined, {
                        ...globalAmountFormatting,
                        currency: "EUR",
                      }).format(Math.abs(passiveAsset.amount.value))}
                      className="font-bold text-base text-grey-800"
                    />
                  </div>
                }
              >
                <AssetTable
                  onRowClick={presentAssetDetail}
                  value={passiveAsset.data as unknown as FinancialItem[]}
                  passiveAsset={passiveAsset as unknown as CustomerAsset}
                  showValuation={false}
                  managementSwitch={onAssetSwitch}
                />
              </Accordion>
            ))}
          </div>
        </Widget>
        <Widget title="scenes.wealth.benefits">
          <div className="flex flex-col gap-x-2 gap-y-4">
            {benefitsAssetData.map((benefitsAsset, index) => (
              <Accordion
                key={`${benefitsAsset.name}-${index}`}
                amount={Math.abs(benefitsAsset.amount.value)}
                title={t(`asset_group.${benefitsAsset.name}`)}
                assetType={benefitsAsset.name}
                className="drop-shadow-none border bg-grey-300"
              >
                <AssetTable
                  onRowClick={presentAssetDetail}
                  value={benefitsAsset.data as unknown as FinancialItem[]}
                  passiveAsset={benefitsAsset as unknown as CustomerAsset}
                  showValuation={false}
                  managementSwitch={onAssetSwitch}
                />
              </Accordion>
            ))}
          </div>
        </Widget>
        {othersAssetsData?.length > 0 && (
          <Widget
            title="scenes.wealth.others"
            rightElement={
              <LargeTitle
                title={Intl.NumberFormat(undefined, {
                  ...globalAmountFormatting,
                  currency: "EUR",
                }).format(othersTotal)}
                className="font-bold text-xl"
              />
            }
          >
            <div className="flex flex-col gap-x-2 gap-y-4">
              {othersAssetsData.map((othersAsset, index) => (
                <Accordion
                  key={`${othersAsset.name}-${index}`}
                  amount={othersAsset.amount.value}
                  title={t(`asset_group.${othersAsset.name}`)}
                  assetType={othersAsset.name}
                  className="drop-shadow-none border bg-grey-300"
                  rightComponent={
                    <div className="flex flex-col items-end gap-y-1">
                      <Text
                        label={Intl.NumberFormat(undefined, {
                          ...globalAmountFormatting,
                          currency: "EUR",
                        }).format(othersAsset.amount.value)}
                        className="font-bold text-base text-grey-800"
                      />
                    </div>
                  }
                  // performance={othersAsset.performance as Performance}
                >
                  <AssetTable
                    onRowClick={presentAssetDetail}
                    value={othersAsset.data as unknown as FinancialItem[]}
                    passiveAsset={othersAsset as unknown as CustomerAsset}
                    managementSwitch={onAssetSwitch}
                  />
                </Accordion>
              ))}
            </div>
          </Widget>
        )}
        {otherUsersInCustomerReference.map((otherUser) => (
          <div
            className="relative flex w-full flex-col rounded-xl bg-blue-1000 drop-shadow-xl cursor-pointer mb-3"
            onClick={async () => {
              await navigate({
                to: "/company/$companyId/customer/$customerId/wealth",
                params: {
                  companyId: params.companyId,
                  customerId: otherUser.id,
                },
              });
            }}
          >
            <div className="flex w-full items-center justify-between text-white py-3 pl-8 pr-6">
              <LargeTitle
                title={t(
                  otherUser.type === CustomerType.Person
                    ? `scenes.wealth.goToWealthPhysicalPerson`
                    : `scenes.wealth.goToWealthLegalPerson`,
                  {
                    name: otherUser.name,
                  }
                )}
                className="flex-1 font-bold text-xl"
              />
              <i className="pi pi-fw pi-arrow-right" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex w-full lg:hidden">
        <div className="xl:w-3/3 w-full">
          <PercentPie data={repartition} legendSide="bottom" />
        </div>
      </div>
    </div>
  );
};
