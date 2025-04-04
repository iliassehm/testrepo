import { MagnifyingGlassIcon, Pencil1Icon } from "@radix-ui/react-icons";
import {
  Link,
  ToPathOption,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import {
  NotificationData,
  TaskReminderData,
} from "../../../../../shared/schemas/notification";
import { AssetIcon, Text } from "../../../../components";
import { BlurFeature } from "../../../../components/BlurFeature";
import { Widget } from "../../../../components/Widget";
import {
  complianceCategoryName,
  NOTIFICATION_INTERVAL,
} from "../../../../constants";
import { globalAmountFormatting, relativeTime } from "../../../../helpers";
import { gql } from "../../../../service/client";
import {
  AssetStats,
  CustomerDetails,
  GlobalSearchParams,
  HomeQuery,
  NotificationListQuery,
} from "../../../../types";
import { companycampaignsScene } from "../campaigns";
import { CompanyCustomersLogic } from "../customers/customers.logic";
import Tasks from "../customers/home/Task/task";
import { NotificationTitle } from "../notifications/components/NotificationList";
import { companyIndexRoute } from "../route";
import { defaultFilters } from "../tasks/tasks";
import { CompanyHomeLogic } from "./home.logic";
import { HomeSkeleton } from "./home.skeleton";
import { HomeTable } from "./homeTable";

interface WidgetProps {
  data?: HomeQuery;
}

const percentFormatter = Intl.NumberFormat(undefined, {
  style: "percent",
});

export function CompanyHome() {
  // Hooks
  const params = useParams({
    from: companyIndexRoute.id,
  });
  const navigate = useNavigate({
    from: companyIndexRoute.id,
  });
  const search = useSearch({
    from: companyIndexRoute.id,
  }) as GlobalSearchParams;

  // Queries
  const { data, isLoading, refetch } = useQuery(
    ["companyHome", params.companyId, search.period],
    () =>
      gql.client.request(CompanyHomeLogic.queries(), {
        companyID: params.companyId as string,
        input: {
          limit: 6,
        },
        ...search.range,
        campaignLimit: 5,
        projectRange: { from: null, to: null },
        taskFilter: { limit: 6 },
        projectValidated: true,
        projectLimit: 5,
      })
  );

  const { data: dataNotifications } = useQuery(
    ["companyHomeNotifications", params.companyId],
    () =>
      gql.client.request(CompanyHomeLogic.notificationList(), {
        companyID: params.companyId as string,
        filter: {
          take: 3,
        },
      }),
    {
      refetchInterval: NOTIFICATION_INTERVAL,
    }
  );

  const { data: dataCustomerDetails } = useQuery(
    ["customerDetails", params.companyId],
    () =>
      gql.client.request(CompanyCustomersLogic.customerDetails(), {
        companyID: params.companyId as string,
      })
  );

  if (isLoading) return <HomeSkeleton />;

  let liquidity = "N/A";
  if (data?.liquidity?.instrument && data?.liquidity?.value)
    liquidity = Intl.NumberFormat(undefined, {
      ...globalAmountFormatting,
      currency: data?.liquidity?.instrument ?? "EUR",
    }).format(data.liquidity?.value);

  let liquidityRepresentation = "N/A";
  if (
    data?.liquidity?.value &&
    dataCustomerDetails?.company?.wealth?.value &&
    dataCustomerDetails.company.wealth.value
  ) {
    const ratio =
      data.liquidity.value / dataCustomerDetails.company.wealth.value;
    liquidityRepresentation = Intl.NumberFormat(undefined, {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(ratio);
  }

  let assetsUnderManagementPercent = "N/A";
  if (
    dataCustomerDetails?.customerDetails?.managedWealth.value &&
    dataCustomerDetails?.company?.wealth?.value &&
    dataCustomerDetails.company.wealth.value
  ) {
    const ratio =
      dataCustomerDetails?.customerDetails?.managedWealth.value /
      dataCustomerDetails?.company?.wealth.value;
    assetsUnderManagementPercent = percentFormatter.format(ratio);
  }

  let averageWealth = "N/A";
  if (dataCustomerDetails?.customerDetails?.averageWealth.value) {
    averageWealth = Intl.NumberFormat(undefined, {
      ...globalAmountFormatting,
      currency: "EUR",
    }).format(dataCustomerDetails?.customerDetails?.averageWealth.value);
  }

  if (!params.companyId) throw new Error("No company ID provided");
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <HomeTable
          company={data?.company}
          params={params}
          navigate={navigate}
        />
      </div>
      <div className="xl:col-span-1">
        {data?.customersCompliance && <DocumentsWidget data={data} />}
      </div>
      <div className="flex h-full w-full flex-col gap-x-4 gap-y-4 md:flex-row md:gap-y-0 xl:col-span-3">
        <Widget
          className="relative xl:flex xl:items-stretch"
          viewAll={{
            to: "/company/$companyId/tasks",
            search: defaultFilters,
          }}
        >
          <Tasks data={data?.listCompanyTask} refetchHome={refetch} />
        </Widget>
        <NotificationsWidget data={dataNotifications?.notificationList} />
        <ProjectsWidget projects={data?.projectCompanyList ?? []} />
      </div>

      <div className="flex h-full w-full flex-col gap-x-8 gap-y-8 md:flex-row md:gap-y-0 xl:col-span-3">
        <FirmWidget
          data={dataCustomerDetails?.customerDetails as CustomerDetails}
          mostOccuringAsset={data?.mostOccuringAssetType as AssetStats}
          assetsUnderManagementPercent={assetsUnderManagementPercent}
          liquidity={liquidity}
          liquidityRepresentation={liquidityRepresentation}
          averageWealth={averageWealth}
          params={params}
        />
      </div>
    </div>
  );
}

export function FirmWidget({
  data,
  params,
  liquidity,
  averageWealth,
  groupView,
  mostOccuringAsset,
  liquidityRepresentation,
  assetsUnderManagementPercent,
}: {
  liquidity: string;
  groupView?: boolean;
  data: CustomerDetails;
  averageWealth: string;
  mostOccuringAsset?: AssetStats | null;
  liquidityRepresentation: string;
  params: {
    companyId?: string | undefined;
  };
  assetsUnderManagementPercent: string;
}) {
  return (
    <Widget
      title={groupView ? "parent-company.my_group" : "widgets.sub_wealth"}
      largeTitle
      viewAll={
        groupView
          ? undefined
          : {
              to: "/company/$companyId/global-wealth",
              params: {
                companyId: params.companyId,
              },
            }
      }
    >
      <div className="flex gap-4">
        <div className="bg-gradient-custom border rounded-lg border-stone-100 bg-stone-100 w-[18%] p-4">
          <Text
            as="h3"
            label="scenes.company.assetTypeWealth.stats.managedWealth"
            className="text-center text-white text-base"
          />
          <div className="flex items-center justify-center p-4">
            <p className=" text-2xl text-white">
              {assetsUnderManagementPercent}
            </p>
          </div>
        </div>

        <div className="bg-gradient-custom border rounded-lg border-stone-100 bg-stone-100 w-[18%] p-4">
          <Text
            as="h3"
            label="scenes.company.assetTypeWealth.stats.average_wealth"
            className="text-center text-white text-base"
          />
          <div className="flex items-center justify-center p-4">
            <p className=" text-2xl text-white">{averageWealth}</p>
          </div>
        </div>

        <div className="bg-gradient-custom border rounded-lg border-stone-100 bg-stone-100 w-[18%] p-4">
          <Text
            as="h3"
            label="scenes.company.assetTypeWealth.stats.nb_clients"
            className="text-center  text-white text-base"
          />
          <div className="flex items-center justify-center p-4">
            <p className=" text-2xl text-white">{data?.count ?? 0}</p>
          </div>
        </div>

        <div className="bg-gradient-custom border rounded-lg border-stone-100 bg-stone-100 w-[23%] p-4">
          <Text
            as="h3"
            label="scenes.sub.mostPopularInvestment"
            className="text-center text-white text-base"
          />
          <div className="relative flex items-center justify-center">
            {mostOccuringAsset ? (
              <div className="flex flex-col items-center justify-center">
                <div className="relative flex items-center mt-3 gap-1">
                  <AssetIcon
                    size="sm"
                    assetName={`asset_group.${mostOccuringAsset.group}`}
                  />
                  <div className="text-white">
                    <Text
                      label={`asset_group.${mostOccuringAsset.group}`}
                      className="inline-block leading-none text-center text-[0.8rem]"
                    />
                  </div>
                </div>
                <div className="text-xs text-white text-[9px] text-nowrap flex mt-3">
                  <span>{mostOccuringAsset.count}</span>{" "}
                  <span className="ml-1">contrats</span>
                </div>
              </div>
            ) : (
              <p className=" text-2xl text-white">N/A</p>
            )}
          </div>
        </div>

        <div className="bg-gradient-custom border rounded-lg border-stone-100 bg-stone-100 w-[23%] p-4">
          <Text
            as="h3"
            label="scenes.sub.cash"
            className="text-center text-white text-base"
          />
          <div className="relative flex items-center justify-center gap-3 p-4">
            <p className=" text-2xl text-white">{liquidity}</p>
            <p className="text-sm text-white">{liquidityRepresentation}</p>
          </div>
        </div>
      </div>
    </Widget>
  );
}

function DocumentsWidget({ data }: WidgetProps) {
  const customersCompliance = data?.customersCompliance ?? [];

  // Sorting
  customersCompliance.sort((a, b) => {
    if (
      complianceCategoryName(a.category.name) <
      complianceCategoryName(b.category.name)
    )
      return -1;
    if (
      complianceCategoryName(a.category.name) >
      complianceCategoryName(b.category.name)
    )
      return 1;
    return 0;
  });

  return (
    <Widget title="widgets.conformity" largeTitle className="flex-1 h-full">
      <BlurFeature feature="conformity" />
      <div className="flex flex-col gap-4 flex-1 overflow-y-auto max-h-[480px] pr-4">
        {customersCompliance?.map((compliance, index) => {
          let validPercent = 0;

          if (compliance.levels.valid)
            validPercent =
              compliance.levels.valid /
              (compliance.levels.valid +
                compliance.levels.unvalid +
                compliance.levels.waiting);

          return (
            <div key={index} className="flex items-center gap-4 w-full">
              <div
                key={index}
                className="flex justify-between border rounded-lg border-stone-100 bg-stone-100 p-3 gap-4 w-full"
              >
                <div>
                  <Text
                    className="text-sm"
                    label={complianceCategoryName(compliance.category.name)}
                  />
                </div>

                <div className="text-sm text-blue-800">
                  {percentFormatter.format(validPercent)}
                </div>
              </div>
              <div>
                <Text
                  to={
                    `/company/$companyId/company-compliance/${compliance.category.key}` as ToPathOption["to"]
                  }
                  label="commons.viewAll"
                  className="text-sm text-gray-500 underline hover:text-gray-700 whitespace-nowrap"
                />
              </div>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}

interface NotificationsWidgetProps {
  data: NotificationListQuery["notificationList"];
}
export function NotificationsWidget({ data }: NotificationsWidgetProps) {
  const { t } = useTranslation();

  return (
    <Widget
      title="widgets.alerts"
      viewAll={{
        to: "/company/$companyId/notifications",
      }}
    >
      <BlurFeature feature="alerts" />
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-y-2">
          {data?.map((notification) => (
            <div
              key={notification.id}
              className={`flex cursor-pointer gap-x-3 rounded-lg p-2 ${
                notification.type === "document_expiration" ||
                (notification.data as TaskReminderData)?.action === "expiration"
                  ? "bg-red-50 hover:bg-red-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <div
                className={`cright-0 mr-3 h-auto w-[6px] rounded-r-md ${
                  notification.type === "document_expiration" ||
                  (notification.data as TaskReminderData)?.action ===
                    "expiration"
                    ? "bg-red-500"
                    : "bg-blue-800"
                }`}
              />
              <div className="w-4/5">
                <div className="text-10 text-blue-1000">
                  <NotificationTitle
                    data={notification.data as NotificationData}
                  />
                </div>
                <Link
                  to="/company/$companyId/notifications"
                  params={{
                    companyId: notification.company.id,
                  }}
                  search={{
                    type: notification.type,
                    id: notification.id,
                  }}
                  className="text-10 text-blue-800 underline"
                >
                  {t(`notification.seeDetail`)}
                </Link>
                <div className="flex flex-row items-center text-grey-700">
                  {!!notification.updated && (
                    <p className="text-10  mr-2">
                      {relativeTime(new Date(notification.updated))}
                    </p>
                  )}
                  {notification.company && (
                    <>
                      {"•"}
                      <i className="ml-1 pi pi-fw pi-building text-sm mr-0.5" />

                      <p className="text-10">{notification.company.name}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  );
}

export function ProjectsWidget({
  projects,
}: {
  projects: HomeQuery["projectCompanyList"];
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams({
    from: "/company/$companyId/",
  });

  const handleClick = (
    project: NonNullable<HomeQuery["projectCompanyList"]>[number]
  ) => {
    navigate({
      to: "/company/$companyId/customer/$customerId/projects/$projectID/update",
      params: {
        companyId: params.companyId as string,
        customerId: project.customer.id,
        projectID: project.id,
      },
      search: {
        type: project.type,
        contractID: project.metadata.assetID,
      },
    });
  };

  return (
    <Widget title="scenes.customers.projects.currentProject" largeTitle>
      <BlurFeature feature="project" />

      <table className="border-separate border-spacing-y-2">
        <thead>
          <tr className="mt-4 mb-2">
            <th className="px-2 w-[50%] text-left">
              <label className="text-xs font-bold xl-w:text-sm">
                {t("scenes.customers.projects.addProject.projectName")}
              </label>
            </th>
            <th className="w-[50%] px-2 text-left">
              <label className="text-xs font-bold xl-w:text-sm">
                {t("scenes.customers.projects.addProject.customerName")}
              </label>
            </th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {projects?.map((project, index) => (
            <tr
              key={index}
              className="w-full my-2  h-min-14 px-4 bg-[#4761C84D] cursor-pointer"
              onClick={() => handleClick(project)}
            >
              <td className="w-[50%] px-2 rounded-l-lg">
                <div>
                  <label className="text-xs xl-w:text-sm cursor-pointer">
                    {project.name ?? ""}
                  </label>
                </div>
              </td>
              <td className="w-[50%] px-2">
                <div>
                  <label className="text-xs xl-w:text-sm cursor-pointer">
                    {project.customer.name}
                  </label>
                </div>
              </td>
              <td className="px-2 rounded-r-lg">
                {project.metadata.assetID && (
                  <div>
                    <MagnifyingGlassIcon className="cursor-pointer" />
                  </div>
                )}
                {!project.metadata.assetID && (
                  <div>
                    <Pencil1Icon className="cursor-pointer" />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
  );
}

export function CampaignsWidget({
  campaigns,
}: {
  campaigns: { name: string }[];
}) {
  const params = useParams({
    from: "/company/$companyId/",
  });

  return (
    <Widget
      title="widgets.currentOperations"
      largeTitle
      className="h-fit"
      viewAll={{
        to: companyIndexRoute.fullPath,
        params: {
          companyId: params.companyId as string,
        },
      }}
    >
      <>
        {campaigns.map((campaign, index) => (
          <Link
            to={companycampaignsScene.fullPath}
            params={{ companyId: params.companyId as string }}
            key={`${campaign.name}-${index}`}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg border-b border-slate-200 px-2 py-2 hover:bg-gray-50"
          >
            <Text
              label={campaign.name}
              as="p"
              className="text-sm text-grey-700"
            />
            <img src="/svg/file.svg" />
          </Link>
        ))}
      </>
    </Widget>
  );
}
