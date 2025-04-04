import { Link, useParams } from "@tanstack/react-router";
import { t } from "i18next";
import { Trans } from "react-i18next";

import { RegulationKitUpdateData } from "../../../../../../../shared/schemas/notification";

interface NotificationTypeRegulationKitUpdateProps {
  data: RegulationKitUpdateData;
}
export function NotificationTypeRegulationKitUpdate({
  data = {} as RegulationKitUpdateData,
}: NotificationTypeRegulationKitUpdateProps) {
  const params = useParams({
    from: "/company/$companyId/notifications",
  });

  return (
    <p className="flex flex-col gap-y-2 text-base">
      <div>
        <Trans
          i18nKey={`notifications.list.${data.type}.body`}
          values={{
            ...data,
          }}
          components={{
            Link: (
              <Link
                to="/company/$companyId/settings/documentModels"
                params={{
                  companyId: params.companyId,
                }}
              />
            ),
          }}
        />
      </div>
      <div className="flex flex-col gap-y-4">
        {data.added && (
          <ul>
            {data.added.map((name, index) => (
              <li key={`${name}-${index}`} className="flex items-center gap-2">
                <i className="pi pi-check text-xs"></i>

                {name}
              </li>
            ))}
          </ul>
        )}
        {data.removed && (
          <ul>
            {data.removed.map((name, index) => (
              <li key={`${name}-${index}`} className="flex items-center gap-2">
                <i className="pi pi-times text-xs"></i>
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link
        to="/company/$companyId/settings/documentModels"
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
