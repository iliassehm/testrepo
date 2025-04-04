import {
  CheckCircledIcon,
  DoubleArrowRightIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";

import { Text } from "../../../../../components";
import { formatDate } from "../../../../../helpers";
import { TaskQuery } from "../../../../../types";
import { FieldTextarea } from "../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { TaskState } from "../../customers/home/Task/task";
import { useTasks } from "../../customers/home/Task/useTasks";

interface TaskDetailsProps {
  task: NonNullable<TaskQuery["fetchSingleTask"]>;
  taskState: TaskState;
  setTaskState: Dispatch<SetStateAction<TaskState>>;
  companyId: string;
  closePanel(): void;
}
export function TaskDetails({
  task,
  taskState,
  setTaskState,
  companyId,
  closePanel,
}: TaskDetailsProps) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const { handleDeleteTask, handleUpdateTask } = useTasks(
    companyId,
    task.customer?.id,
    taskState,
    setTaskState,
    undefined
  );

  return (
    <div className="shrink-0">
      <div className="flex justify-between p-3 bg-stone-100 min-h-[64px]">
        <div className="flex gap-1 items-center">
          <DoubleArrowRightIcon
            className="h-8 w-8 p-2 stroke-black/75 fill-black/75 stroke-1 hover:bg-gray-200 cursor-pointer rounded-md"
            onClick={closePanel}
          />
          <Text
            className="text-xl w-96 truncate"
            label={task.title ?? task.content ?? ""}
          />
        </div>
        {!task.completed && (
          <div className="flex items-center w-1/6 max-w-1/6">
            <CheckCircledIcon
              className="w-5 h-5 cursor-pointer mr-2"
              onClick={async () => {
                await handleDeleteTask(task.id);
                await queryClient.invalidateQueries([
                  "companyTasks",
                  companyId,
                ]);
              }}
            />
            <Pencil1Icon
              className="w-5 h-5 cursor-pointer"
              onClick={() => handleUpdateTask(task)}
            />
          </div>
        )}
      </div>

      <div
        className="p-10 link-color-parent"
        style={{
          maxHeight: "calc(100% - 125px)",
        }}
      >
        <Text
          as="h3"
          label="forms.taskForm.informations"
          className="font-medium text-xl"
        />
        <div className="flex border-b py-1.5 text-sm">
          <Text
            label="forms.taskForm.contractNumber.label"
            className="text-[#9DA1AB] font-medium grow text-sm"
          />
          <p>{task.contractNumber}</p>
        </div>
        <div className="flex border-b py-1.5 text-sm">
          <Text
            label="forms.taskForm.customer.label"
            className="text-[#9DA1AB] font-medium grow text-sm"
          />
          <p>{task.customer?.name ?? ""}</p>
        </div>
        <div className="flex border-b py-1.5 text-sm">
          <Text
            label="forms.taskForm.manager.label"
            className="text-[#9DA1AB] font-medium grow text-sm"
          />
          <p>{task.assigned_manager?.name ?? ""}</p>
        </div>
        <div className="flex border-b py-1.5 text-sm">
          <Text
            label="forms.taskForm.category.label"
            className="text-[#9DA1AB] font-medium grow text-sm"
          />
          <p>
            {task.category
              ? task.category ===
                "wealthcome.internal.task.category.no_category"
                ? t(`forms.taskForm.categories.no_category`)
                : i18n.exists("forms.taskForm.categories." + task.category)
                  ? (t("forms.taskForm.categories." + task.category) as string)
                  : task.category
              : ""}
          </p>
        </div>
        <div className="flex border-b py-1.5 text-sm">
          <Text
            label="forms.fields.creationDate"
            className="text-[#9DA1AB] font-medium grow text-sm"
          />
          <p>{formatDate(task.created)}</p>
        </div>
        <div className="flex border-b py-1.5 text-sm">
          <Text
            label="forms.taskForm.schedule.label"
            className={"text-[#9DA1AB] font-medium grow text-sm"}
          />
          <p
            className={`${task.schedule && new Date(task.schedule) < new Date() ? "text-red-500" : ""}`}
          >
            {formatDate(task.schedule)}
          </p>
        </div>
        <Text
          as="h3"
          label="forms.taskForm.text.label"
          className="font-medium text-xl mt-4 mb-1.5"
        />

        <FieldTextarea
          placeholder="Note...."
          value={task.content ?? ""}
          disabled
        />
      </div>
    </div>
  );
}
