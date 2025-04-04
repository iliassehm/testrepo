import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { fr } from "primelocale/js/fr.js";
import { addLocale, locale } from "primereact/api";
import { Paginator } from "primereact/paginator";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { deepEqual, unPick } from "src/helpers";
import { z } from "zod";

import { Select } from "../../../../components";
import { gql } from "../../../../service/client";
import { CompanyTaskFilterStatus } from "../../../../types";
import { AddDialog } from "../customers/home/Task/AddDialog";
import { TaskState } from "../customers/home/Task/task";
import { TaskLogic } from "../customers/home/Task/task.logic";
import { useTasks } from "../customers/home/Task/useTasks";
import { CompanyGeneralLogic } from "../settings/office/generalOffice/general.logic";
import { AddCategoryDialog } from "./components/AddCategoryDialog";
import { CategoryList } from "./components/CategoryList";
import { GeneralSection } from "./components/GeneralSection";
import { Header } from "./components/Header";
import { TaskDetails } from "./components/TaskDetails";
import { TaskList } from "./components/TaskList";

addLocale("fr", fr);

export const defaultFilters: CompanyTaskFilter = {
  status: CompanyTaskFilterStatus.All,
  take: 10,
  page: 1,
};

const defaultTaskState = {
  title: "",
  manager: "",
  customer: "",
  category: "",
  contractNumber: "",
  text: "",
  schedule: new Date().toISOString(),
  id: "",
  edit: false,
};

export function Tasks() {
  const { t, i18n } = useTranslation();
  locale(i18n.language);

  const params = useParams({
    from: "/company/$companyId/tasks",
  });

  const queryClient = useQueryClient();
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [taskState, setTaskState] = useState(defaultTaskState);

  useEffect(() => {
    if (taskState.id) {
      setAddDialogVisible(true);
    } else {
      setAddDialogVisible(false);
    }
  }, [taskState.id]);

  const {
    filters,
    setFilters,
    resetFilters,
    selectedTaskId,
    tasksQuery,
    taskCountByStatusQuery,
    taskCountByManagersQuery,
    taskCountByCategoriesQuery,
    contractNumbers,
  } = useCompanyTasksSearch(params.companyId);
  const [addCategoryDialogVisible, setAddCategoryDialogVisible] =
    useState(false);

  const listTaskCategories = useQuery(
    ["company", "taskcategories", params.companyId],
    () =>
      gql.client.request(TaskLogic.taskCategoryList(), {
        companyID: params.companyId,
      })
  );

  const listManagers = useQuery(
    ["company", "managers", params.companyId],
    async () => CompanyGeneralLogic.managerListQuery(params.companyId)
  );

  const selectedTasksQuery = useQuery(["singleTask", selectedTaskId], () => {
    if (!selectedTaskId) return Promise.resolve(null);
    return gql.client.request(TaskLogic.fetchSingleTask(), {
      id: selectedTaskId,
      companyID: params.companyId,
    });
  });

  const { submitUpdateTask, handleAddTask, exportTasks, isExportingTasks } =
    useTasks(
      params.companyId as string,
      selectedTasksQuery?.data?.fetchSingleTask?.customer?.id as string,
      taskState,
      setTaskState,
      undefined
    );

  // if (tasksQuery.isLoading) return <Loading />;

  async function handleSubmit(newTask: TaskState) {
    setTaskState(newTask);
    if (newTask.title === "") return;

    if (taskState.edit) await submitUpdateTask(newTask);
    else await handleAddTask(newTask);

    setAddDialogVisible(false);
    await queryClient.invalidateQueries(["companyTasks", params.companyId]);
    setFilters((f) => ({ ...f, category: newTask.category }));
  }

  const totalTasks =
    taskCountByStatusQuery.data?.companyTaskCountByStatus?.reduce(
      (acc, curr) => acc + curr.count,
      0
    ) ?? 0;

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="section max-w-10xl flex-1 pb-4">
        <Header
          t={t}
          count={totalTasks}
          late={
            taskCountByStatusQuery.data?.companyTaskCountByStatus?.find(
              (s) => s.status === CompanyTaskFilterStatus.Late
            )?.count ?? 0
          }
          setAddDialogVisible={setAddDialogVisible}
          exportTasks={exportTasks}
          isExportingTasks={isExportingTasks}
        />
        <div className="flex md:flex-row flex-col border-2 rounded-lg h-[650px] mx-10 my-5 overflow-hidden">
          <div className="md:basis-2/12 min-w-[224px] shrink-0 bg-stone-100 rounded-lg overflow-auto">
            <div className="p-4">
              <GeneralSection
                count={totalTasks}
                showAll={isSameFilters(filters, defaultFilters)}
                onClick={resetFilters}
              />
              <CategoryList
                categoryName="forms.taskForm.categories.label"
                prefix="forms.taskForm.categories."
                onSelect={(category) => {
                  const newCategory =
                    category === "wealthcome.internal.task.category.no_category"
                      ? ""
                      : category;
                  setFilters((f) => ({
                    ...f,
                    category:
                      f.category === newCategory ? undefined : newCategory,
                    page: 0,
                  }));
                }}
                items={
                  taskCountByCategoriesQuery.data?.companyTaskCountByCategories?.map(
                    ({ category, count }) => ({
                      id: category,
                      label: category,
                      count,
                    })
                  ) ?? []
                }
                selected={
                  filters.category === ""
                    ? "wealthcome.internal.task.category.no_category"
                    : filters.category
                }
                addCategory={() => setAddCategoryDialogVisible(true)}
              />
              <CategoryList
                categoryName="forms.taskForm.manager.label"
                onSelect={(manager) =>
                  setFilters((f) => ({
                    ...f,
                    manager: f.manager === manager ? undefined : manager,
                    page: 0,
                  }))
                }
                items={
                  taskCountByManagersQuery.data?.companyTaskCountByManagers?.map(
                    ({ id, name, count }) => ({
                      id,
                      label: name,
                      count,
                    })
                  ) ?? []
                }
                selected={filters.manager}
              />
            </div>
            <div className="h-1" />
            <AddCategoryDialog
              visible={addCategoryDialogVisible}
              onHide={() => setAddCategoryDialogVisible(false)}
              isLoading={false}
            />
          </div>

          <div className="w-full h-full divide-x divide-gray-200 flex">
            <div className="shrink flex flex-col h-full w-full">
              <div className="py-3 px-2 border-b-2 min-h-[64px] border-[#F0F0F0] grid grid-cols-4 gap-2">
                <Select
                  name="manager"
                  options={[
                    {
                      label: t("forms.taskForm.manager.label"),
                      value: "",
                    },
                  ].concat(
                    listManagers.data?.companyManagersStats?.map((manager) => ({
                      label: manager.name || "",
                      value: manager.id || "",
                    })) || []
                  )}
                  defaultValue={filters.manager ?? ""}
                  className="pl-1 pr-2"
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      manager: value.length > 0 ? value : undefined,
                    });
                  }}
                />
                <Select
                  name="category"
                  options={[
                    {
                      label: t("forms.taskForm.categories.label"),
                      value: "",
                    },
                  ].concat(
                    listTaskCategories.data?.taskCategoryList
                      ?.map((category) => ({
                        label: i18n.exists(
                          "forms.taskForm.categories." + category.key
                        )
                          ? (t(
                              "forms.taskForm.categories." + category.key
                            ) as string)
                          : category.name,
                        value: category.key,
                      }))
                      .sort((a, b) => a.label.localeCompare(b.label)) ?? []
                  )}
                  defaultValue={filters.category ?? ""}
                  className="pl-1 pr-2"
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      category: value,
                    });
                  }}
                />
                <Select
                  name="contractNumber"
                  options={[
                    {
                      label: t("forms.taskForm.contractNumber.label"),
                      value: "",
                    },
                  ].concat(
                    contractNumbers.map((contractNumber) => ({
                      label: contractNumber,
                      value: contractNumber,
                    })) || []
                  )}
                  defaultValue={filters.contractNumber ?? ""}
                  className="pl-1 pr-2"
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      contractNumber: value,
                    });
                  }}
                />
                <Select
                  name="status"
                  options={["all", "in_progress", "late", "completed"].map(
                    (status) => ({
                      value: status,
                      label: t("forms.taskForm.status." + status),
                    })
                  )}
                  defaultValue={
                    filters.status ?? CompanyTaskFilterStatus.InProgress
                  }
                  className="pl-1 pr-2"
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      status: value as CompanyTaskFilterStatus,
                    });
                  }}
                />
              </div>
              {(tasksQuery.data?.companyTaskSearch?.count ?? 0) >
              (tasksQuery.data?.companyTaskSearch?.tasks?.length ?? 0) ? (
                <Paginator
                  className="w-full"
                  lang="fr"
                  template={{
                    layout: selectedTasksQuery.data
                      ? `PrevPageLink CurrentPageReport NextPageLink`
                      : `FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown`,
                  }}
                  first={(filters.take ?? 10) * ((filters.page ?? 1) - 1)}
                  totalRecords={tasksQuery.data?.companyTaskSearch?.count ?? 0}
                  rowsPerPageOptions={[10, 25, 50]}
                  onPageChange={(e) => {
                    setFilters({ ...filters, page: e.page + 1, take: e.rows });
                  }}
                  rows={filters.take ?? 10}
                />
              ) : null}
              <TaskList
                count={tasksQuery.data?.companyTaskSearch?.count ?? 0}
                tasks={tasksQuery.data?.companyTaskSearch?.tasks || []}
                selectedTask={selectedTaskId}
                onSelect={(taskId) =>
                  setFilters((f) => ({
                    ...f,
                    id: f.id === taskId ? undefined : taskId,
                  }))
                }
              />
            </div>

            {selectedTasksQuery.data?.fetchSingleTask && (
              <TaskDetails
                task={selectedTasksQuery.data.fetchSingleTask}
                taskState={taskState}
                setTaskState={setTaskState}
                companyId={params.companyId}
                closePanel={() => {
                  setFilters((f) => ({ ...f, id: undefined }));
                }}
              />
            )}
          </div>
        </div>
        <AddDialog
          visible={addDialogVisible}
          onHide={() => {
            setAddDialogVisible(false);
            setTaskState(defaultTaskState);
          }}
          taskState={taskState}
          onSubmit={handleSubmit}
          isLoading={false}
        />
      </div>
    </div>
  );
}

export const companyTaskFilterSchema = z.object({
  category: z.string().optional(),
  contractNumber: z.string().optional(),
  limit: z.coerce.number().optional(),
  manager: z.string().optional(),
  id: z.string().optional(),
  page: z.coerce
    .number()
    .optional()
    .default(1)
    .transform((p) => p || 1),
  status: z.nativeEnum(CompanyTaskFilterStatus).optional(),
  take: z.coerce.number().optional().default(10),
});
export type CompanyTaskFilter = z.infer<typeof companyTaskFilterSchema>;

function useCompanyTasksSearch(companyId: string) {
  const navigate = useNavigate({
    from: "/company/$companyId/tasks",
  });
  const search = useSearch({
    from: "/company/$companyId/tasks",
  });
  const filters = companyTaskFilterSchema.parse(search);
  const setFilters = useCallback<Dispatch<SetStateAction<CompanyTaskFilter>>>(
    (update) => {
      const newFilters = update instanceof Function ? update(filters) : update;
      navigate({ search: newFilters });
    },
    [filters, navigate]
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [setFilters]);

  const taskCountByStatusQuery = useQuery(
    ["companyTaskCountByStatus", companyId],
    () =>
      gql.client.request(TaskLogic.companyTaskCountByStatus(), {
        companyID: companyId,
        filter: unPick(defaultFilters, ["take", "page", "limit"]),
      }),
    { keepPreviousData: true }
  );

  const taskCountByCategoriesQuery = useQuery(
    [
      "companyTaskCountByCategory",
      companyId,
      unPick(defaultFilters, ["take", "page", "limit"]),
    ],
    () =>
      gql.client.request(TaskLogic.companyTaskCountByCategories(), {
        companyID: companyId,
        filter: unPick(defaultFilters, ["take", "page", "limit"]),
      }),
    { keepPreviousData: true }
  );
  const taskCountByManagersQuery = useQuery(
    [
      "companyTaskCountByManagers",
      companyId,
      unPick(defaultFilters, ["take", "page", "limit"]),
    ],
    () =>
      gql.client.request(TaskLogic.companyTaskCountByManagers(), {
        companyID: companyId,
        filter: unPick(defaultFilters, ["take", "page", "limit"]),
      }),
    { keepPreviousData: true }
  );

  const tasksQuery = useQuery(
    ["companyTasks", companyId, filters],
    () =>
      gql.client.request(TaskLogic.companyTaskSearch(), {
        companyID: companyId,
        filter: filters,
      }),
    { keepPreviousData: true }
  );

  const contractNumbers = useMemo<string[]>(
    () =>
      Array.from(
        new Set(
          tasksQuery.data?.companyTaskSearch?.tasks?.map(
            (task) => task.contractNumber
          )
        ).add(filters.contractNumber)
      ).filter(Boolean) as string[],
    [tasksQuery.data]
  );

  return {
    filters,
    setFilters,
    resetFilters,
    selectedTaskId: search.id,
    tasksQuery,
    taskCountByStatusQuery,
    taskCountByCategoriesQuery,
    taskCountByManagersQuery,
    contractNumbers,
  };
}

function stripUndefinedKeys<T extends Record<string, unknown>>(obj: T): T {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
}

function isSameFilters(a: CompanyTaskFilter, b: CompanyTaskFilter) {
  return deepEqual(
    stripUndefinedKeys(unPick(a, ["take", "page", "limit"])),
    stripUndefinedKeys(unPick(b, ["take", "page", "limit"]))
  );
}
