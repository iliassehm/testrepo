import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { downloadFile } from "../../../../../../helpers/downloadFile";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { TaskInput } from "../../../../../../types";
import { TaskState } from "./task";
import { TaskLogic } from "./task.logic";

export const useTasks = (
  companyId: string,
  customerId: string | undefined | null,
  taskState: TaskState,
  setTaskState: Dispatch<SetStateAction<TaskState>>,
  refetchHome: any | undefined
) => {
  const toast = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const queryKey = ["listCustomerTask", companyId, customerId, "companyHome"];

  const { data: tasksData } = useQuery(
    queryKey,
    () => {
      if (!customerId) {
        // Type safety, query should be disabled if no customerId
        throw new Error("No Customer");
      }
      return gql.client.request(TaskLogic.queries(), {
        companyID: companyId,
        customerID: customerId,
      });
    },
    {
      enabled: !!customerId,
    }
  );

  const { mutate: exportTasks, isLoading: isExportingTasks } = useMutation(
    () =>
      gql.client.request(TaskLogic.exportTasks(), {
        companyID: companyId,
        customerID: customerId,
      }),
    {
      onSuccess: (response) => {
        if (response?.url) {
          downloadFile(response.url, `tasks`);
        }
        queryClient.invalidateQueries(queryKey);
      },
    }
  );

  const createTask = useMutation(
    ({ input, customer }: { input: TaskInput; customer: string }) =>
      gql.client.request(TaskLogic.createTask(), {
        input,
        companyID: companyId,
        customerID: customer,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
        setTaskState({
          ...taskState,
          title: "",
          manager: "",
          category: "",
          contractNumber: "",
          schedule: new Date().toISOString(),
          text: "",
          id: "",
          edit: false,
        });
        toast.current?.show({
          severity: "success",
          summary: t("forms.taskForm.toast.add"),
        });
      },
    }
  );

  const deleteTask = useMutation(
    ({ taskId }: { taskId: string }) =>
      gql.client.request(TaskLogic.completedTask(), { taskId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
        toast.current?.show({
          severity: "success",
          summary: t("forms.taskForm.toast.completed"),
        });
      },
    }
  );

  const updateTask = useMutation(
    ({ input, taskId }: { input: TaskInput; taskId: string }) =>
      gql.client.request(TaskLogic.updateTask(), {
        taskId,
        companyID: companyId,
        input,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
        refetchHome ? refetchHome() : undefined;
        setTaskState({
          ...taskState,
          title: "",
          manager: "",
          category: "",
          contractNumber: "",
          schedule: new Date().toISOString(),
          text: "",
          id: "",
          edit: false,
        });
        toast.current?.show({
          severity: "success",
          summary: t("forms.taskForm.toast.edit"),
        });
      },
    }
  );

  const handleAddTask = (newTask: any) => {
    return createTask.mutateAsync({
      input: {
        title: newTask.title,
        manager: newTask.manager,
        category: newTask.category,
        contractNumber: newTask.contractNumber,
        schedule: newTask.schedule,
        content: newTask.text,
      },
      customer: newTask.customer ?? customerId,
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask.mutateAsync({ taskId });
  };

  const handleUpdateTask = (task: any) => {
    setTaskState({
      ...taskState,
      title: task.title,
      manager: task.assigned_manager?.id ?? "",
      customer: task.customer?.id ?? "",
      category: task.category,
      contractNumber: task.contractNumber,
      schedule: task.schedule,
      text: task.content,
      id: task.id,
      edit: true,
    });
  };

  const submitUpdateTask = async (newTask: TaskState) => {
    const input = {
      title: newTask.title,
      manager: newTask.manager,
      customer: newTask.customer,
      category: newTask.category,
      contractNumber: newTask.contractNumber,
      schedule: newTask.schedule,
      content: newTask.text,
    };
    await updateTask.mutateAsync({ input, taskId: newTask.id });
  };

  return {
    listTask: tasksData?.listCustomerTask,
    exportTasks,
    isExportingTasks,
    handleAddTask,
    handleDeleteTask,
    handleUpdateTask,
    submitUpdateTask,
  };
};
