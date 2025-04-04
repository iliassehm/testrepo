import { Link, useParams } from "@tanstack/react-router";
import { Trans } from "react-i18next";

import { TaskReminderData } from "../../../../../../../shared/schemas/notification";

interface NotificationTypeTaskReminderProps {
  data: TaskReminderData;
}
export function NotificationTypeTaskReminder({
  data = {} as TaskReminderData,
}: NotificationTypeTaskReminderProps) {
  const params = useParams({
    from: "/company/$companyId/notifications",
  });

  return (
    <p className="flex flex-col gap-y-2 text-sm">
      <div>
        <Trans
          i18nKey={`notifications.list.${data.type}.${data.taskType}.${data.action}.body`}
          values={data}
          components={{
            Link: (
              <Link
                to="/company/$companyId/customer/$customerId/"
                params={{
                  companyId: params.companyId,
                  customerId: data.customerId as string,
                }}
              />
            ),
          }}
        />
      </div>
    </p>
  );
}
