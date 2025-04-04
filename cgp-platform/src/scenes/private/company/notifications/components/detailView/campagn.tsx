import { Link, useParams } from "@tanstack/react-router";
import { t } from "i18next";
import { Trans } from "react-i18next";

import { CampaignData } from "../../../../../../../shared/schemas/notification";

interface NotificationTypeCampaignProps {
  data: CampaignData;
}
export function NotificationTypeCampaign({
  data = {} as CampaignData,
}: NotificationTypeCampaignProps) {
  const params = useParams({
    from: "/company/$companyId/notifications",
  });

  return (
    <p className="flex flex-col gap-y-2 text-sm">
      <div>
        <Trans
          i18nKey={`notifications.list.${data.type}.body`}
          values={{
            ...data,
          }}
          components={{
            Link: (
              <Link
                to="/company/$companyId/campaigns"
                params={{
                  companyId: params.companyId,
                }}
              />
            ),
          }}
        />
      </div>
      <Link
        to="/company/$companyId/campaigns"
        className="text-blue-500"
        params={{
          companyId: params.companyId,
        }}
      >
        {t(`notifications.list.${data.type}.view`)}
      </Link>
    </p>
  );
}
