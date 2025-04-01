import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Text } from "../../../../../components";
import { List } from "../../../../../components/ui/List";
import { Widget } from "../../../../../components/Widget";
import { ProjectType } from "../../../../../types";
import { FieldDate } from "../../../../../UIComponents/FieldDate/FieldDate";
import { AddProjectDialog } from "./AddProjectDialog";
import { AdequacyDialog } from "./AdequacyDialog";
import { projectTypes } from "./projectConstants";
import { ProjectTable } from "./ProjectTable";
import { useProjectDelete } from "./useProjectDelete";
import { useProjectList } from "./useProjectList";
import { useProjectProductTypes } from "./useProjectProductTypes";
import { useProjectValidation } from "./useProjectValidation";

type FilterDate = {
  from: Date | null;
  to: Date | null;
};

export function CompanyCustomersProject() {
  const { t } = useTranslation();
  const [range, setRange] = useState<FilterDate>({
    from: null,
    to: null,
  });
  const search = useSearch({
    from: "/company/$companyId/customer/$customerId/projects/",
  });

  const navigate = useNavigate({
    from: "/company/$companyId/customer/$customerId/projects/",
  });
  const [addProjectDialogVisible, setAddProjectDialogVisible] = useState(false);

  const params = useParams({
    from: "/company/$companyId/customer/$customerId/projects/",
  });

  const projects = useProjectList({
    range,
    productType: search.product === "all" ? undefined : search.product,
  });

  const { data: projectProductTypesData } = useProjectProductTypes();

  const projectValidationMutation = useProjectValidation();
  const projectDeleteMutation = useProjectDelete();

  const projectsFiltered = useMemo(() => {
    if (!projects.data?.projectList) {
      return [];
    }
    if (search.type === "subscription") {
      // with new project types, we need to filter by old "subscription" too and both new types
      return projects.data.projectList.filter(
        (el) =>
          el.type === ProjectType.SubscriptionLifeInsurance ||
          el.type === ProjectType.SubscriptionCif ||
          (el.type as unknown as string) === "subscription"
      );
    }
    if (search.type === "complementary") {
      return projects.data.projectList.filter(
        (el) =>
          el.type === ProjectType.ComplementaryLifeInsurance ||
          el.type === ProjectType.ComplementaryCif ||
          (el.type as unknown as string) === "complementary"
      );
    }
    if (search.type === "arbitrage") {
      return projects.data.projectList.filter(
        (el) =>
          el.type === ProjectType.ArbitrageLifeInsurance ||
          el.type === ProjectType.ArbitrageCif ||
          (el.type as unknown as string) === "arbitrage"
      );
    }
    return projects.data.projectList.filter((el) => el.type === search.type);
  }, [projects.data?.projectList, search.type]);

  return (
    <Widget className="p-4">
      <>
        <div className="flex items-center mb-8 gap-4 flex-wrap">
          <div className="flex gap-4 grow flex-wrap">
            <div className="flex items-center gap-4">
              <div>{t("scenes.customers.projects.filter")}</div>
              <span>{t("scenes.customers.projects.from")}</span>
              <FieldDate
                name="from"
                value={range.from ?? undefined}
                onValueChange={(value) => setRange({ ...range, from: value })}
              />
            </div>
            <div className="flex items-center gap-4">
              <span>{t("scenes.customers.projects.to")}</span>
              <FieldDate
                name="to"
                value={range.to ?? undefined}
                onValueChange={(value) => setRange({ ...range, to: value })}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              label="scenes.customers.projects.add"
              onClick={() => setAddProjectDialogVisible(true)}
            />
          </div>
          <AddProjectDialog
            visible={addProjectDialogVisible}
            setVisible={setAddProjectDialogVisible}
          />
        </div>

        <div className="flex md:flex-row flex-col border-2 rounded-lg min-h-[350px]">
          {" "}
          <div className="md:w-65 shrink-0 bg-stone-100 rounded-lg overflow-auto">
            <div className="flex items-center justify-between p-4">
              <Text
                as="h3"
                className="font-bold"
                label="scenes.customers.projects.type"
              />
            </div>

            <div className="h-1" />

            <List
              isCategory
              items={projectTypes}
              selectedKey="id"
              selected={{
                id: search.type as string,
                name: "",
              }}
              onSelect={(type) => {
                navigate({
                  params: { ...params },
                  search: {
                    ...search,
                    type: type.id as ProjectType,
                    product:
                      type.id === ProjectType.SubscriptionCif ||
                      type.id === ProjectType.SubscriptionLifeInsurance
                        ? search.product
                        : undefined,
                  },
                });
              }}
            />
          </div>
          {search.type === "subscription" && (
            <div className="md:w-65 shrink-0 border-r-4 border-[#F0F0F0]">
              <div className="flex items-center justify-between p-4">
                <Text
                  as="h3"
                  className="font-bold"
                  label="scenes.customers.projects.product"
                />
              </div>

              <div className="h-1 bg-[#F0F0F0]" />

              <List
                items={[
                  {
                    id: "all",
                    name: t("scenes.customers.projects.products.all"),
                  },
                  ...(projectProductTypesData?.projectProductTypes?.map(
                    (type) => ({
                      id: type,
                      name: t("scenes.customers.projects.products." + type),
                    })
                  ) ?? []),
                ]}
                selectedKey={"id"}
                className="max-h-[350px] overflow-auto"
                selected={{
                  id: search.product,
                  name: "",
                }}
                onSelect={(product) => {
                  navigate({
                    search: {
                      ...search,
                      type: search.type as ProjectType,
                      product: product.id as string,
                    },
                    params: { ...params },
                  });
                }}
              />
            </div>
          )}
          <div className="grow p-8 overflow-auto">
            {projectsFiltered && projectsFiltered.length > 0 ? (
              <ProjectTable
                data={projectsFiltered}
                onDelete={(project) => {
                  projectDeleteMutation.mutate({ id: project.id });
                }}
                onUpdate={(project) => {
                  navigate({
                    to: "/company/$companyId/customer/$customerId/projects/$projectID/update",
                    params: {
                      ...params,
                      companyId: params.companyId as string,
                      customerId: params.customerId as string,
                      projectID: project.id,
                    },
                    search: {
                      ...search,
                      type: project.type,
                      contractID: project.metadata.assetID,
                    },
                  });
                }}
                onValidate={(project) => {
                  projectValidationMutation.mutate({
                    id: project.id,
                    companyID: params.companyId,
                    customerID: params.customerId,
                  });
                }}
              />
            ) : (
              <div className="flex justify-center items-center h-full">
                <Text label="scenes.customers.projects.noProjects" />
              </div>
            )}
          </div>
        </div>
      </>
    </Widget>
  );
}
