import { CheckCircledIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useNavigate, useParams } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Icon } from "../../../../../../components";
import ContentWithLineBreaks from "../../../../../../components/ContentWithLineBreaks/ContentWithLineBreaks";
import { Text } from "../../../../../../components/Text";
import { formatDate } from "../../../../../../helpers/date";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import {
  EntityRelatedType,
  HomeQuery,
  ListCustomerTaskQuery,
} from "../../../../../../types";
import { AddDialog } from "./AddDialog";
import { useTasks } from "./useTasks";

export interface TaskState {
  title: string;
  manager: string;
  customer: string;
  category: string;
  contractNumber: string;
  text: string;
  id: string;
  schedule: string;
  edit: boolean;
}

type TaskProps = {
  mode?: string;
  data?: HomeQuery["listCompanyTask"];
  withCompany?: boolean;
  withManager?: boolean;
  refetchHome?: any;
};

const Tasks: React.FC<TaskProps> = ({
  mode,
  data,
  withCompany = false,
  withManager = false,
  refetchHome,
}) => {
  const currentRoute = useCurrentRoute();
  const navigate = useNavigate();
  const { companyId, customerId } = useParams({
    from: currentRoute.routeId,
  }) as { companyId: string; customerId: string };
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [taskState, setTaskState] = useState({
    title: "",
    manager: "",
    customer: customerId,
    category: "",
    contractNumber: "",
    text: "",
    schedule: new Date().toISOString(),
    id: "",
    edit: false,
  });
  const { t, i18n } = useTranslation();
  const {
    listTask,
    exportTasks,
    isExportingTasks,
    handleAddTask,
    handleDeleteTask,
    handleUpdateTask,
    submitUpdateTask,
  } = useTasks(companyId, customerId, taskState, setTaskState, refetchHome);

  useEffect(() => {
    if (taskState.id) {
      setAddDialogVisible(true);
    }
  }, [taskState.id]);

  const handleClickTask = (
    task: NonNullable<ListCustomerTaskQuery["listCustomerTask"]>[number]
  ) => {
    if (!task.customer) return;
    if (
      task.entityRelatedType === EntityRelatedType.Document &&
      task.entityRelatedId
    ) {
      navigate({
        to: "/company/$companyId/customer/$customerId/conformity",
        params: {
          companyId: task.company.id,
          customerId: task.customer.id,
        },
        search: {
          tab: "ged",
          documentId: task.entityRelatedId,
        },
      });
    }
    navigate({
      to: "/company/$companyId/customer/$customerId",
      params: {
        companyId: task.company.id,
        customerId: task.customer.id,
      },
    });
  };

  const tasksData = data?.edges ?? listTask;
  const nbLateTasks =
    data?.lateCount ??
    listTask?.filter((item) => new Date(item.schedule) < new Date()).length ??
    0;

  return (
    <div className="min-h-[300px] max-h-[300px] xl:max-h-none flex flex-col gap-4 pt-4 w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-row items-center gap-2">
          <Text as="label" label="forms.task" className="text-xl font-bold" />
          <Button
            label=""
            variant="basic"
            className="flex items-center justify-center px-2 rounded-full aspect-square"
            onClick={() => setAddDialogVisible(true)}
          >
            <i
              className="pi pi-plus text-xs font-black"
              data-pr-position="left"
              data-pr-at="left-15 center"
              data-pr-my="right center"
            />
          </Button>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Button
            loading={isExportingTasks}
            label=""
            variant="bordered"
            className="flex items-center justify-center px-3 rounded-md"
            onClick={() => exportTasks()}
          >
            <Icon type="download" className="w-4 h-4" />
          </Button>
          <div className="bg-red-500 text-white text-sm font-medium me-2 px-2.5 py-0.5 rounded-full ">
            {nbLateTasks}
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto max-h-[300px] gap-1.5 flex flex-col mt-4">
        {tasksData?.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClickTask(item)}
            className={`flex items-center justify-between border rounded-lg bg-[#4761C84D] w-full px-4 max-w-full ${mode === "read" && "cursor-pointer"}`}
          >
            <div className="flex flex-col w-5/6 max-w-5/6">
              <div>
                <ContentWithLineBreaks
                  content={item.title ?? item.content ?? ""}
                />
              </div>
              <div>
                <ContentWithLineBreaks content={item.customer?.name ?? ""} />
              </div>
              <div className="flex mt-1">
                {item.category && (
                  <label className="text-xs xl-w:text-sm font-medium opacity-75 flex items-center">
                    <ContentWithLineBreaks
                      content={
                        i18n.exists(
                          "forms.taskForm.categories." + item.category
                        )
                          ? (t(
                              "forms.taskForm.categories." + item.category
                            ) as string)
                          : item.category
                      }
                    />
                    <span className="mx-2">{"•"}</span>
                  </label>
                )}
                <label
                  className={`text-xs xl-w:text-sm font-medium text-blue-800 ${
                    new Date(item.schedule) > new Date()
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatDate(item.schedule)}
                </label>
                <div className="">
                  {item.company && withCompany && (
                    <label className="ml-2 text-xs xl-w:text-sm font-medium opacity-75 flex items-center">
                      <span>{"•"}</span>
                      <i className="ml-1 pi pi-fw pi-building text-sm mr-0.5" />
                      <span>{item.company.name}</span>
                    </label>
                  )}
                  {item.assigned_manager && withManager && (
                    <label className="ml-2 text-xs xl-w:text-sm font-medium opacity-75">
                      <span>{"•"}</span>
                      <i className="ml-1 pi pi-fw pi-user text-sm mr-1" />
                      <span>{item.assigned_manager.name}</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center w-1/6 max-w-1/6">
              <CheckCircledIcon
                className="w-5 h-5 cursor-pointer mr-2"
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleDeleteTask(item.id);
                }}
              />
              <Pencil1Icon
                className="w-5 h-5 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateTask(item);
                  setAddDialogVisible(!addDialogVisible);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="w-full relative flex items-center">
        {mode && mode === "read" ? (
          <Button
            size="small"
            className="py-1 rounded-md border ring-0 mx-auto"
            label="forms.taskForm.add"
            onClick={() => setAddDialogVisible(true)}
          />
        ) : null}
        <AddDialog
          visible={addDialogVisible}
          onHide={() => setAddDialogVisible(false)}
          taskState={taskState}
          onSubmit={(newTask) => {
            setTaskState(newTask);
            if (newTask.title === "") return;

            taskState.edit ? submitUpdateTask(newTask) : handleAddTask(newTask);

            setAddDialogVisible(false);
          }}
          isLoading={false}
        />
      </div>
    </div>
  );
};

export default Tasks;
