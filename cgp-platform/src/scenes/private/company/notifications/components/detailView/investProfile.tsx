import { Link, useParams } from "@tanstack/react-router";
import { t } from "i18next";
import { Trans } from "react-i18next";

import { InvestProfileUpdateData } from "../../../../../../../shared/schemas/notification";

interface NotificationTypeInvestProfileProps {
  data: InvestProfileUpdateData;
}
export function NotificationTypeInvestProfile({
  data = {} as InvestProfileUpdateData,
}: NotificationTypeInvestProfileProps) {
  const params = useParams({
    from: "/company/$companyId/notifications",
  });

  return (
    <p className="flex flex-col gap-y-2 text-sm">
      <div>
        <Trans
          i18nKey={`notifications.list.${data.type}.by_${data.by}.body`}
          values={{
            ...data,
          }}
          components={{
            Link: (
              <Link
                to="/company/$companyId/customer/$customerId/conformity"
                params={{
                  companyId: params.companyId,
                  customerId: data.customerId,
                }}
                search={{
                  tab: "investorProfile",
                }}
              />
            ),
          }}
        />
      </div>
      <Link
        to="/company/$companyId/customer/$customerId/conformity"
        className="text-blue-500"
        params={{
          companyId: params.companyId,
          customerId: data.customerId,
        }}
        search={{
          tab: "investorProfile",
        }}
      >
        {t(`notifications.list.${data.type}.view`)}
      </Link>
    </p>
  );
}
