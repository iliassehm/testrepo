import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Skeleton } from "primereact/skeleton";
import { useQuery } from "react-query";

import { Text } from "../../../../../../components";
import { Accordion } from "../../../../../../components/Accordion";
import { globalAmountFormatting } from "../../../../../../helpers";
import { gql } from "../../../../../../service/client";
import { AssetGroup, WealthFilter } from "../../../../../../types";
import { AssetDetail } from "../AssetDetail/AssetDetail";
import { CustomerWealthAssetSearch } from "../route";
import { WealthLogic } from "../wealth.logic";
import { OwnershipModal } from "./ownershipModal";
import { WalletTable } from "./walletTable";

export function WalletTab() {
  // Hooks
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/wealth/",
  });

  const search = useSearch({
    from: "/company/$companyId/customer/$customerId/wealth/",
  });

  const navigate = useNavigate({
    from: "/company/$companyId/customer/$customerId/wealth/",
  });

  // const [currency, setCurrency] = useState<string>("EUR");
  // const [refreshDate, setRefreshDate] = useState<Date | null>(null);

  // const currencies = [
  //   { label: "EUR", value: "EUR" },
  //   { label: "USD", value: "USD" },
  // ];

  const assetGroupsQuery = useQuery({
    queryKey: [
      "underManagementAssetGroups",
      params.companyId,
      params.customerId,
    ],
    queryFn: () => {
      return gql.client.request(
        WealthLogic.underManagementAssetGroupsQueries(),
        {
          companyID: params.companyId,
          customerID: params.customerId,
          computing: WealthFilter.UnderManagements,
          groups: Object.values(AssetGroup),
        }
      );
    },
    select: (data) => {
      return data.customerWealth;
    },
  });

  if (
    assetGroupsQuery.status === "loading" ||
    assetGroupsQuery.status !== "success"
  )
    return <WealthSkeleton />;

  // Callbacks
  const dismissAssetDetail = () => {
    navigate({
      search: (current: CustomerWealthAssetSearch) => ({
        ...current,
        assetID: undefined,
      }),
    } as never);
  };

  const dismissOwnershipModal = () => {
    navigate({
      search: (current: CustomerWealthAssetSearch) => ({
        ...current,
        assetOwnershipID: undefined,
      }),
    } as never);
  };

  const onAssetDelete = () => {
    assetGroupsQuery.refetch();
    dismissAssetDetail();
  };

  return (
    <div className="mb-4 flex flex-col gap-4">
      <AssetDetail
        visible={search.assetID !== undefined}
        onHide={dismissAssetDetail}
        companyID={params.companyId as string}
        customerID={params.customerId as string}
        assetID={search.assetID ?? ""}
        onDelete={onAssetDelete}
      />
      <OwnershipModal
        assetId={search.assetOwnershipID ?? ""}
        visible={search.assetOwnershipID != undefined}
        loading={false}
        onClose={dismissOwnershipModal}
      />
      {assetGroupsQuery.data?.length === 0 ? (
        <div>
          <img
            src="/svg/encours_empty.svg"
            alt="encours_empty"
            className="w-full p-4"
          />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-y-4 rounded-xl border-2 border-grey-300 bg-white p-6 drop-shadow-md hover:bg-gray-50">
          {/* <div className="flex w-full justify-between font-bold">
            <div className="flex items-center gap-x-4">
              {t("scenes.customers.wealth.refreshDate")}
              <FieldDate
                id="refreshDate"
                name="refreshDate"
                onValueChange={(value) => setRefreshDate(value)}
                className="bg-blue-800 text-white"
                placeholder={t(`forms.fields.wealth.lifeInsurance.date`) || ""}
              />
              <div className="border border-blue-800 rounded-md h-5 w-5 flex items-center justify-center">
                <i className="notification-target-icon pi pi-exclamation-circle text-xs text-blue-800 cursor-pointer" />
              </div>
              <div className="border border-blue-800 rounded-md h-5 w-5 flex items-center justify-center">
                <i className="notification-target-icon pi pi-sync text-xs text-blue-800 cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center gap-x-4">
              {t("scenes.customers.wealth.reportingCurrency")}
              <Select
                defaultValue={currency}
                options={currencies}
                name="currency"
                onChange={(option) => {
                  setCurrency(option);
                }}
                className="bg-blue-800 pl-1 pr-2 font-bold text-white"
              />
              <div className="">
                <i className="notification-target-icon pi pi-pencil h-4 w-4 cursor-pointer" />
              </div>
            </div>
          </div> */}

          {/* <h3 className="text-lg font-bold text-blue-800">Mr Pierre jean</h3> */}
          {assetGroupsQuery.data?.map((value) => {
            return (
              <Accordion
                key={value.group}
                title=""
                defaultOpen
                assetType={value.group}
                className="bg-stone-100"
                classNamePanel="border-2 border-grey-300 bg-white py-2 px-4 shadow-lg"
                rightComponent={
                  <div>
                    <Text
                      label={Intl.NumberFormat(undefined, {
                        ...globalAmountFormatting,
                        currency: "EUR",
                      }).format(value.valuation.value)}
                      className="font-bold text-2xl text-grey-800"
                    />
                  </div>
                }
              >
                <WalletTable data={value.assets} />
              </Accordion>
            );
          })}
        </div>
      )}
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
