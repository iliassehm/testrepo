import { Link, useParams } from "@tanstack/react-router";
import { t } from "i18next";
import { Trans } from "react-i18next";

import {
  AggregationCgptData,
  AggregationClientData,
} from "../../../../../../../shared/schemas/notification";

interface NotificationTypeAggregationProps {
  data: AggregationCgptData | AggregationClientData;
}
export function NotificationTypeAggregation({
  data = {} as AggregationCgptData | AggregationClientData,
}: NotificationTypeAggregationProps) {
  const params = useParams({
    from: "/company/$companyId/notifications",
  });

  return (
    <p className="flex flex-col gap-y-2 text-sm">
      <div>
        <Trans
          i18nKey={`notifications.list.${data.type}.${data.method}.by_${data.by}.body`}
          values={{
            ...data,
            contractType:
              data.connectorName ?? t(`asset_group.${data.assetGroup}`),
          }}
          components={{
            Link: (
              <Link
                to="/company/$companyId/customer/$customerId/wealth"
                params={{
                  companyId: params.companyId,
                  customerId: data.customerId as string,
                }}
              />
            ),
          }}
        />
      </div>
      {data.assetId && data.assetGroup === "lifeInsurance_capitalization" ? (
        <Link
          to="/company/$companyId/customer/$customerId/wealth/$type/$investmentId"
          className="text-blue-500"
          params={{
            companyId: params.companyId,
            customerId: data.customerId as string,
            type: data.assetGroup,
            investmentId: data.assetId,
          }}
        >
          {t(`notifications.list.${data.type}.view`)}
        </Link>
      ) : (
        <Link
          to="/company/$companyId/customer/$customerId/wealth/"
          className="text-blue-500"
          params={{
            companyId: params.companyId,
            customerId: data.customerId as string,
          }}
          search={{
            assetID: data.assetId,
          }}
        >
          {t(`notifications.list.${data.type}.view`)}
        </Link>
      )}
    </p>
  );
}
