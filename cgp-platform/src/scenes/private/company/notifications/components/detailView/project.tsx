import { Link, useParams } from "@tanstack/react-router";
import { t } from "i18next";
import { Trans } from "react-i18next";

import {
  BaseProjectInfo,
  NotificationType,
  ProjectArbitrageData,
  ProjectNewProjectData,
  ProjectOtherProjectData,
  ProjectRedemptionData,
  ProjectSubscriptionData,
} from "../../../../../../../shared/schemas/notification";

interface NotificationTypeProjectProps {
  data:
    | ProjectArbitrageData
    | ProjectRedemptionData
    | ProjectSubscriptionData
    | ProjectNewProjectData
    | ProjectOtherProjectData;
}
export function NotificationTypeProject({
  data = {} as
    | ProjectArbitrageData
    | ProjectRedemptionData
    | ProjectSubscriptionData
    | ProjectNewProjectData
    | ProjectOtherProjectData,
}: NotificationTypeProjectProps) {
  const params = useParams({
    from: "/company/$companyId/notifications",
  });

  const sharedEvents: BaseProjectInfo["eventType"][] = ["generate", "signed"];

  const i18nKey = sharedEvents.includes(data.eventType)
    ? `notifications.list.projects.sharedEvents.${data.eventType}.body`
    : `notifications.list.projects.${data.type}.${data.eventType}.body`;

  return (
    <p className="flex flex-col gap-y-2 text-sm">
      <div>
        <Trans
          i18nKey={i18nKey}
          values={{
            ...data,
          }}
          components={{
            Link: (
              <Link
                to="/company/$companyId/customer/$customerId/projects"
                params={{
                  companyId: params.companyId,
                  customerId: data.customerId,
                }}
              />
            ),
          }}
        />
      </div>
      <Link
        to="/company/$companyId/customer/$customerId/projects"
        className="text-blue-500"
        params={{
          companyId: params.companyId,
          customerId: data.customerId,
        }}
      >
        {t(`notifications.list.projects.view`)}
      </Link>
    </p>
  );
}
