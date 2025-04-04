import { Link } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { Trans } from "react-i18next";

import { EnvelopeReminderData } from "../../../../../../../shared/schemas/notification";

interface NotificationTypeEnvelopeReminderProps {
  data: EnvelopeReminderData;
}

export function NotificationTypeEnvelopeReminder({
  data,
}: NotificationTypeEnvelopeReminderProps) {
  const params = useParams({
    from: "/company/$companyId/notifications",
  });

  return (
    <>
      <p className="text-sm">
        <Trans
          i18nKey={`notifications.list.${data.type}.by_${data.by}.body`}
          values={{
            ...data,
            expiration: new Date(
              Date.parse(data.envelope.expiration as unknown as string)
            ),
            formatParams: {
              expiration: {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            },
          }}
          components={{
            Link: (
              <Link
                to="/company/$companyId/customer/$customerId/conformity"
                params={{
                  companyId: params.companyId,
                  customerId: data.customer.id,
                }}
                search={{
                  tab: "ged",
                }}
              />
            ),
          }}
        />
      </p>
    </>
  );
}
