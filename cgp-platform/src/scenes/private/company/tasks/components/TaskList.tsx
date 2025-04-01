import { useTranslation } from "react-i18next";

import { Text } from "../../../../../components";
import { clsx, relativeTime } from "../../../../../helpers";
import { TaskSearchResult } from "../../../../../types";

interface TaskListProps {
  tasks: TaskSearchResult[];
  onSelect: (taskId: string) => void;
  selectedTask?: string;
  count?: number;
}

export function TaskList({
  tasks,
  selectedTask,
  onSelect,
  count = 0,
}: TaskListProps) {
  const { t } = useTranslation();
  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="flex text-gray-700 flex-row items-center justify-start px-4 py-2 gap-2">
        <Text className="text-sm font-medium" label={count} />
        <Text className="text-sm font-medium" label={t("tasks")} />
      </div>
      {tasks?.map((task, index) => (
        <div key={index}>
          <div
            className="flex flex-col px-4 py-2 cursor-pointer"
            onClick={() => onSelect(task.id)}
          >
            <div
              className={clsx(
                "flex flex-row w-full px-2 py-1 rounded-md",
                selectedTask === task.id
                  ? "text-black bg-stone-100"
                  : task.schedule &&
                      new Date(task.schedule) < new Date() &&
                      !task.completed
                    ? "bg-red-100"
                    : ""
              )}
            >
              <div className="flex flex-1 flex-col">
                <div className="flex flex-row">
                  <Text
                    className="text-sm font-medium mt-1"
                    label={task.title ?? task.content ?? ""}
                  />
                  <div className="flex flex-none ml-auto">
                    {task.created ? (
                      <Text
                        className="text-sm text-blue-800 ml-auto mt-1"
                        label={relativeTime(new Date(task.created))}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="flex flex-row w-full flex-wrap">
                  <div className="truncate w-1/2">
                    <Text
                      className="text-sm text-grey-500 mt-1"
                      label={
                        t("forms.taskForm.contractNumber.label") +
                        ": " +
                        (task.contractNumber ?? "")
                      }
                    />
                  </div>
                  <div className="flex flex-row grow">
                    <Text
                      className="text-sm text-grey-500 mt-1"
                      label={t("forms.taskForm.customer.label") + ": "}
                    />
                    <Text
                      className="text-sm text-blue-800 mt-1 ml-1"
                      label={task.customerName ?? ""}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {index < tasks.length - 1 && (
            <div className="h-0.5 bg-[#F0F0F0] mx-4" />
          )}
        </div>
      ))}
    </div>
  );
}
