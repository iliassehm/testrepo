import { useSearch } from "@tanstack/react-router";
import { OverlayPanel } from "primereact/overlaypanel";
import { Skeleton } from "primereact/skeleton";
import { Tooltip } from "primereact/tooltip";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import { AssetIcon, Button, Dialog, Text } from "../../../../../../components";
import ContentWithLineBreaks from "../../../../../../components/ContentWithLineBreaks/ContentWithLineBreaks";
import DoubleLabel from "../../../../../../components/DoubleLabels/DoubleLabels";
import { DeleteWithConfirmationDialog } from "../../../../../../helpers";
import { globalAmountFormatting } from "../../../../../../helpers/formatting";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import {
  AppartmentCondition,
  AppartmentType,
  AssetGroup,
  CustomerAsset,
  Direction,
  GardenType,
  Performance,
  PoolType,
  RealEstate,
} from "../../../../../../types";
import { AssetDetailLogic } from "./assetDetail.logic";
import { AssetDetailTable } from "./AssetDetailTable";
import { AssetLoanDetail } from "./AssetLoanDetail";
import { InvestmentOverlay } from "./Investments/InvestmentOverlay";

type AssetDetailProps = {
  visible: boolean;
  assetID: string;
  companyID: string;
  customerID: string;

  onHide: () => void;
  onDelete: () => void;
};

type AssetDetail = {
  asset: CustomerAsset;
};

export function AssetDetail({
  visible,
  assetID,
  companyID,
  customerID,

  onHide,
  onDelete,
}: AssetDetailProps) {
  // Hooks
  const { t } = useTranslation();
  const toast = useToast();
  const investmentCreationPanel = useRef<OverlayPanel | null>(null);

  // Queries
  const query = useQuery(
    ["asset_detail", assetID],
    () =>
      gql.client.request<AssetDetail>(AssetDetailLogic.queries(), {
        id: assetID,
      }),
    {
      enabled: visible,
    }
  );

  // Mutations
  const deletionMutation = useMutation(
    "asset_delete",
    () =>
      gql.client.request(AssetDetailLogic.deletion(), {
        assetID,
        companyID,
      }),
    {
      onSuccess: onDelete,
      onError: () => {
        toast?.current?.show({
          severity: "error",
          summary: t("forms.fields.notifications.error.delete") as string,
        });
      },
    }
  );

  // data
  const asset = query.data?.asset;
  const data = {
    evolution: asset?.performance?.evolution ?? 0,
    gain: asset?.performance?.gain ?? { value: 0, instrument: "EUR" },
  };
  const invesments = asset?.investmentList ?? [];
  const isLoan = [
    AssetGroup.HomeLoan,
    AssetGroup.OtherLoan,
    AssetGroup.BusinessLoan,
    AssetGroup.ConsumerLoan,
  ].includes(asset?.group ?? AssetGroup.Banking);

  // Renders
  let headerContent: JSX.Element = (
    <Skeleton height="20px" className="my-2 rounded-3xl" />
  );

  if (query.data?.asset != undefined) {
    const activity = asset?.activity;
    const gainData: Performance = {
      ...data,
      gain: {
        ...data.gain,
        value: isLoan ? Math.abs(data.gain.value) : data.gain.value,
      },
    };

    const assetName =
      asset?.group === AssetGroup.Banking
        ? asset?.metadata?.bank
        : asset?.name ?? "";
    headerContent = (
      <div className="flex w-full flex-col items-start justify-between lg:flex-row items-center">
        <div className="flex items-center justify-center gap-2">
          <AssetIcon assetName={query.data?.asset.group} size="xl" />
          <Text as="h1" label={assetName} className="font-bold" />

          {asset?.underManagement && (
            <>
              <Tooltip target=".custom-target-icon" className="text-sm" />{" "}
              <i
                className="pi pi-flag-fill custom-target-icon cursor-pointer"
                data-pr-tooltip={t("scenes.wealth.isUnderManagement")}
                data-pr-position="right"
                data-pr-at="right+5 top"
                data-pr-my="left center-2"
                style={{ color: "#4761C8" }}
              ></i>
            </>
          )}
        </div>
        <div className="flex flex-col items-start gap-y-1 lg:items-end">
          <Text
            as="h1"
            label={Intl.NumberFormat(undefined, {
              ...globalAmountFormatting,
              currency: activity?.instrument ?? "EUR",
            }).format(
              isLoan ? Math.abs(activity?.value ?? 0) : activity?.value ?? 0
            )}
            className="font-bold"
          />
          <DoubleLabel data={gainData} displayValue="gain" />
        </div>
      </div>
    );
  }

  const TableHeader = () => {
    return (
      <div className="align-items-center justify-content-end flex gap-2">
        <Button
          label={t("forms.fields.actions.add") ?? ""}
          severity="info"
          onClick={(e) => investmentCreationPanel.current?.toggle(e)}
          className="rounded-md text-sm py-1"
        />
        <OverlayPanel ref={investmentCreationPanel}>
          <InvestmentOverlay
            assetID={assetID}
            companyID={companyID}
            customerID={customerID}
            hide={() => {
              investmentCreationPanel.current?.setState(false);
            }}
            type={asset?.group ?? AssetGroup.Banking}
          />
        </OverlayPanel>
      </div>
    );
  };

  const housing = {
    [AppartmentType.House]: t(`forms.fields.wealth.realEstate.type.home`),
    [AppartmentType.Simplex]: t(
      `forms.fields.wealth.realEstate.type.apartment`
    ),
    [AppartmentType.Duplex]: "",
    [AppartmentType.Triplex]: "",
    [AppartmentType.Land]: t(`forms.fields.wealth.realEstate.type.land`),
  };

  const condition = {
    [AppartmentCondition.Redone]: t(
      `forms.fields.wealth.realEstate.condition.REDONE`
    ) as string,
    [AppartmentCondition.Refreshed]: t(
      `forms.fields.wealth.realEstate.condition.REFRESHED`
    ) as string,
    [AppartmentCondition.Standard]: t(
      `forms.fields.wealth.realEstate.condition.STANDARD`
    ) as string,
    [AppartmentCondition.ToRefresh]: t(
      `forms.fields.wealth.realEstate.condition.TO_REFRESH`
    ) as string,
    [AppartmentCondition.ImportantWork]: t(
      `forms.fields.wealth.realEstate.condition.IMPORTANT_WORK`
    ) as string,
  };

  const orientation = {
    [Direction.North]: t(
      `forms.fields.wealth.realEstate.orientation.north`
    ) as string,
    [Direction.East]: t(
      `forms.fields.wealth.realEstate.orientation.east`
    ) as string,
    [Direction.South]: t(
      `forms.fields.wealth.realEstate.orientation.south`
    ) as string,
    [Direction.West]: t(
      `forms.fields.wealth.realEstate.orientation.west`
    ) as string,
  };

  const pool = {
    [PoolType.None]: t(`forms.fields.wealth.realEstate.pool.NONE`) as string,
    [PoolType.Standard]: t(
      `forms.fields.wealth.realEstate.pool.STANDARD`
    ) as string,
    [PoolType.Standing]: t(
      `forms.fields.wealth.realEstate.pool.STANDING`
    ) as string,
  };

  const garden = {
    [GardenType.Landscape]: t(
      `forms.fields.wealth.realEstate.garden.LANDSCAPE`
    ) as string,
    [GardenType.Landscaped]: t(
      `forms.fields.wealth.realEstate.garden.LANDSCAPED`
    ) as string,
    [GardenType.StandardNone]: t(
      `forms.fields.wealth.realEstate.garden.STANDARD_NONE`
    ) as string,
    [GardenType.ToBeLandscaped]: t(
      `forms.fields.wealth.realEstate.garden.TO_BE_LANDSCAPED`
    ) as string,
  };

  let formattedDate = "";
  if (asset?.metadata?.buyingDate) {
    const buyingDate = new Date(asset?.metadata?.buyingDate);
    const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    formattedDate = dateFormatter.format(buyingDate);
  }

  return (
    <Dialog
      header={headerContent}
      open={visible}
      onOpenChange={onHide}
      className={
        asset?.group === AssetGroup.HeritageRealEstate
          ? "min-w-[30%]"
          : "min-w-[50%]"
      }
    >
      {query.isLoading || query.isError ? (
        <Skeleton height="20px" className="my-2 rounded-3xl" />
      ) : (
        <>
          {asset?.group &&
            [
              AssetGroup.Crypto,
              AssetGroup.Securities,
              AssetGroup.LifeInsuranceCapitalization,
            ].includes(asset?.group) && (
              <div className="mb-4 flex max-h-96 flex-col gap-2 overflow-auto">
                {asset?.group !== AssetGroup.Securities && <TableHeader />}
                <AssetDetailTable data={invesments} />
              </div>
            )}
          {isLoan && (
            <div className="mb-4 flex max-h-100 flex-col gap-2 overflow-auto">
              <AssetLoanDetail customerID={customerID} asset={asset} />
            </div>
          )}
          {asset?.group === AssetGroup.HeritageRealEstate && (
            <div className="flex flex-col gap-3">
              {asset?.metadata?.source && (
                <div className="flex flex-row justify-between">
                  <Text
                    as="span"
                    label={t(`forms.fields.wealth.realEstate.location.label`)}
                    className="font-bold text-base tracking-tight text-blue-1100"
                  />
                  <Text
                    as="span"
                    label={asset?.metadata?.source ?? ""}
                    className="font-bold text-base tracking-tight text-blue-800"
                  />
                </div>
              )}
              {asset?.metadata?.price > 0 && (
                <div className="flex flex-row justify-between">
                  <Text
                    as="span"
                    label={t(
                      `forms.fields.wealth.realEstate.buyingPrice.label`
                    )}
                    className="font-bold text-base tracking-tight text-blue-1100"
                  />
                  <Text
                    as="span"
                    label={Intl.NumberFormat(undefined, {
                      ...globalAmountFormatting,
                      currency: "EUR",
                    }).format(asset?.metadata?.price ?? 0)}
                    className="font-bold text-base tracking-tight text-blue-800"
                  />
                </div>
              )}
              {asset?.metadata?.annualRevenues > 0 && (
                <div className="flex flex-row justify-between">
                  <Text
                    as="span"
                    label={t(
                      `forms.fields.wealth.realEstate.annualRevenues.label`
                    )}
                    className="font-bold text-base tracking-tight text-blue-1100"
                  />
                  <Text
                    as="span"
                    label={Intl.NumberFormat(undefined, {
                      ...globalAmountFormatting,
                      currency: "EUR",
                    }).format(asset?.metadata?.annualRevenues ?? 0)}
                    className="font-bold text-base tracking-tight text-blue-800"
                  />
                </div>
              )}
              {formattedDate && (
                <div className="flex flex-row justify-between">
                  <Text
                    as="span"
                    label={t(`forms.fields.wealth.realEstate.buyingDate.label`)}
                    className="font-bold text-base tracking-tight text-blue-1100"
                  />
                  <Text
                    as="span"
                    label={formattedDate}
                    className="font-bold text-base tracking-tight text-blue-800"
                  />
                </div>
              )}
              {asset?.metadata?.typeId && (
                <div className="flex flex-row justify-between">
                  <Text
                    as="span"
                    label={t(`forms.fields.wealth.realEstate.type.label`)}
                    className="font-bold text-base tracking-tight text-blue-1100"
                  />
                  <Text
                    as="span"
                    label={
                      asset?.metadata?.typeId
                        ? housing[
                            asset?.metadata?.typeId as keyof typeof housing
                          ]
                        : ""
                    }
                    className="font-bold text-base tracking-tight text-blue-800"
                  />
                </div>
              )}
              {asset?.metadata?.area && (
                <div className="flex flex-row justify-between">
                  <Text
                    as="span"
                    label={t(`forms.fields.wealth.realEstate.area.label`)}
                    className="font-bold text-base tracking-tight text-blue-1100"
                  />
                  <Text
                    as="span"
                    label={
                      asset?.metadata?.area ? asset?.metadata?.area + " m²" : ""
                    }
                    className="font-bold text-base tracking-tight text-blue-800"
                  />
                </div>
              )}

              {asset?.metadata?.areaLand && (
                <div className="flex flex-row justify-between">
                  <Text
                    as="span"
                    label={t(`forms.fields.wealth.realEstate.areaLand.label`)}
                    className="font-bold text-base tracking-tight text-blue-1100"
                  />
                  <Text
                    as="span"
                    label={
                      asset?.metadata?.areaLand
                        ? asset?.metadata?.areaLand + " m²"
                        : ""
                    }
                    className="font-bold text-base tracking-tight text-blue-800"
                  />
                </div>
              )}
              {asset?.metadata?.rooms && (
                <div className="flex flex-row justify-between">
                  <Text
                    as="span"
                    label={t(`forms.fields.wealth.realEstate.rooms.label`)}
                    className="font-bold text-base tracking-tight text-blue-1100"
                  />
                  <Text
                    as="span"
                    label={asset?.metadata?.rooms ?? ""}
                    className="font-bold text-base tracking-tight text-blue-800"
                  />
                </div>
              )}
              {asset?.metadata?.bedrooms && (
                <div className="flex flex-row justify-between">
                  <Text
                    as="span"
                    label={t(`forms.fields.wealth.realEstate.bedrooms.label`)}
                    className="font-bold text-base tracking-tight text-blue-1100"
                  />
                  <Text
                    as="span"
                    label={asset?.metadata?.bedrooms ?? ""}
                    className="font-bold text-base tracking-tight text-blue-800"
                  />
                </div>
              )}
              {asset?.metadata?.floors && (
                <div className="flex flex-row justify-between">
                  <Text
                    as="span"
                    label={t(`forms.fields.wealth.realEstate.floors.label`)}
                    className="font-bold text-base tracking-tight text-blue-1100"
                  />
                  <Text
                    as="span"
                    label={asset?.metadata?.floors ?? ""}
                    className="font-bold text-base tracking-tight text-blue-800"
                  />
                </div>
              )}
              {asset?.metadata?.condition && (
                <div className="flex flex-row justify-between">
                  <Text
                    as="span"
                    label={t(`forms.fields.wealth.realEstate.condition.label`)}
                    className="font-bold text-base tracking-tight text-blue-1100"
                  />
                  <Text
                    as="span"
                    label={
                      asset?.metadata?.condition
                        ? condition[
                            asset?.metadata?.condition as keyof typeof condition
                          ]
                        : ""
                    }
                    className="font-bold text-base tracking-tight text-blue-800"
                  />
                </div>
              )}
              {asset?.metadata?.orientation && (
                <div className="flex flex-row justify-between">
                  <Text
                    as="span"
                    label={t(
                      `forms.fields.wealth.realEstate.orientation.label`
                    )}
                    className="font-bold text-base tracking-tight text-blue-1100"
                  />
                  <Text
                    as="span"
                    label={
                      asset?.metadata?.orientation
                        ? orientation[
                            asset?.metadata
                              ?.orientation as keyof typeof orientation
                          ]
                        : ""
                    }
                    className="font-bold text-base tracking-tight text-blue-800"
                  />
                </div>
              )}
              {asset?.metadata?.pool && (
                <div className="flex flex-row justify-between">
                  <Text
                    as="span"
                    label={t(`forms.fields.wealth.realEstate.pool.label`)}
                    className="font-bold text-base tracking-tight text-blue-1100"
                  />
                  <Text
                    as="span"
                    label={
                      asset?.metadata?.pool
                        ? pool[asset?.metadata?.pool as keyof typeof pool]
                        : ""
                    }
                    className="font-bold text-base tracking-tight text-blue-800"
                  />
                </div>
              )}
              {asset?.metadata?.garden && (
                <div className="flex flex-row justify-between">
                  <Text
                    as="span"
                    label={t(`forms.fields.wealth.realEstate.garden.label`)}
                    className="font-bold text-base tracking-tight text-blue-1100"
                  />
                  <Text
                    as="span"
                    label={
                      asset?.metadata?.garden
                        ? garden[asset?.metadata?.garden as keyof typeof garden]
                        : ""
                    }
                    className="font-bold text-base tracking-tight text-blue-800"
                  />
                </div>
              )}
              {asset?.metadata?.comment && (
                <div className="flex flex-row justify-between">
                  <div className="relative flex w-full flex-col gap-4 overflow-hidden">
                    <h1 className="font-bold text-base tracking-tight text-blue-1100">
                      {t("scenes.wealth.comment")}
                    </h1>
                    <div className="flex flex-col gap-4">
                      <ContentWithLineBreaks
                        content={asset?.metadata?.comment ?? ""}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <>
            <DeleteWithConfirmationDialog
              onClick={() => deletionMutation.mutate()}
              Action={
                <Button
                  label={t("forms.fields.actions.delete") as string}
                  severity="danger"
                  className="rounded-md text-sm py-1 mx-auto block"
                />
              }
            />
          </>
        </>
      )}
    </Dialog>
  );
}
