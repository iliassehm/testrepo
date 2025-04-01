import { Dispatch, SetStateAction } from "react";

import { Button, Icon, Text } from "../../../../../components";

interface HeaderProps {
  count: number;
  late: number;
  t: (key: string) => string;
  setAddDialogVisible: Dispatch<SetStateAction<boolean>>;
  exportTasks: () => void;
  isExportingTasks: boolean;
}
export function Header({
  count = 0,
  late = 0,
  t,
  setAddDialogVisible,
  exportTasks,
  isExportingTasks,
}: HeaderProps) {
  return (
    <div className="flex justify-start items-center mx-10 mt-5">
      <div className="flex items-center mr-12">
        <Text className="text-3xl mr-3" label={`${t("forms.tasks")} : `} />{" "}
        <div className="text-blue-800 text-2xl font-bold pt-1">{count}</div>
      </div>
      <div className="flex items-center mr-6">
        <Text
          className="text-xl mr-2"
          label={`${t("forms.taskForm.status.late")} : `}
        />{" "}
        <div className="text-blue-800 text-xl text-center font-bold">
          {late}
        </div>
      </div>
      <div className="flex items-center mr-12">
        <Button
          id="export-tasks-button"
          loading={isExportingTasks}
          label=""
          variant="bordered"
          className="flex items-center justify-center px-3 rounded-md"
          onClick={exportTasks}
        >
          <Icon type="download" className="w-4 h-4" />
        </Button>
      </div>
      <div className="ml-auto">
        <Button
          size="small"
          className="flex items-center justify-center py-1 ring-0 "
          label="forms.taskForm.add"
          onClick={() => setAddDialogVisible(true)}
        />
      </div>
    </div>
  );
}
