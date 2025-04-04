import { MagnifyingGlassIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Text } from "../../../../../../components/Text";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import { ProjectListQuery } from "../../../../../../types";
import { ProductCategory } from "../../project/projectConstants";
import { companyCustomersProjectRoute } from "../../project/route";
import { useProjectList } from "../../project/useProjectList";
import { companyCustomersWalletInvestmentRoute } from "../../wealth/route";

const formatFrenchDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return `${day}/${month}/${year}`;
};

const WidgetProjectItem = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentRoute = useCurrentRoute();
  const params = useParams({
    from: currentRoute.routeId,
  }) as { companyId: string; customerId: string };

  const projects = useProjectList({
    range: { from: null, to: null },
    productType: undefined,
  });

  const projectListing = useMemo(() => {
    const list = projects?.data?.projectList ?? [];
    const sortedList = list.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    );
    return sortedList.slice(0, 5);
  }, [projects?.data?.projectList]);

  const handleClick = (
    project: NonNullable<ProjectListQuery["projectList"]>[number]
  ) => {
    if (project.metadata.assetID) {
      navigate({
        to: companyCustomersWalletInvestmentRoute.fullPath,
        params: {
          companyId: params.companyId as string,
          customerId: params.customerId as string,
          investmentId: project.metadata.assetID,
          type: ProductCategory.LifeInsurance,
        },
      });
    } else {
      navigate({
        to: "/company/$companyId/customer/$customerId/projects/$projectID/update",
        params: {
          companyId: params.companyId as string,
          customerId: params.customerId as string,
          projectID: project.id,
        },
        search: {
          type: project.type,
          contractID: project.metadata.assetID,
        },
      });
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex mt-4 mb-4">
        <div className="w-full">
          <Text
            as="label"
            label="scenes.customers.projects.currentProject"
            className="text-xl font-bold"
          />
        </div>
      </div>
      <table className="border-separate border-spacing-y-2">
        <thead>
          <tr className="mt-4 mb-2">
            <th className="px-2 w-[40%] text-left">
              <label className="text-xs font-bold xl-w:text-sm">
                {t("scenes.customers.projects.addProject.projectName")}
              </label>
            </th>
            <th className="w-[25%] px-2">
              <label className="text-xs font-bold xl-w:text-sm">
                {t("scenes.customers.projects.addProject.createdDate")}
              </label>
            </th>
            <th className="w-[35%] px-2 text-left">
              <label className="text-xs font-bold xl-w:text-sm">
                {t("scenes.customers.projects.addProject.typeProduct")}
              </label>
            </th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {projectListing?.map((project, index) => (
            <tr
              key={index}
              className="w-full my-2  h-min-14 px-4 bg-[#4761C84D] cursor-pointer"
              onClick={() => handleClick(project)}
            >
              <td className="w-[40%] px-2 rounded-l-lg">
                <div>
                  <label className="text-xs xl-w:text-sm">
                    {project.name ?? ""}
                  </label>
                </div>
              </td>
              <td className="w-[25%] px-2 text-center">
                <label className="text-xs xl-w:text-sm">
                  {formatFrenchDate(project.created)}
                </label>
              </td>
              <td className="w-[35%] px-2">
                <div>
                  <label className="text-xs xl-w:text-sm">
                    {project.metadata.product
                      ? t(
                          `scenes.customers.projects.products.${project.metadata.product}`
                        )
                      : "-"}
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

      <div className="flex items-end justify-center pt-10 grow">
        <Text
          to={companyCustomersProjectRoute.fullPath}
          params={{
            ...params,
          }}
          search={{ type: "subscription" }}
          label={`${t("commons.viewAll")} (${projects?.data?.projectList?.length})`}
          className="text-xs text-gray-500 underline hover:text-gray-700 whitespace-nowrap"
        />
      </div>
    </div>
  );
};

export default WidgetProjectItem;
