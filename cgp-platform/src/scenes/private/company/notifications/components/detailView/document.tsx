import { Link } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { Trans } from "react-i18next";

import {
  DocumentExpirationData,
  DocumentSendData,
  DocumentSignatureData,
} from "../../../../../../../shared/schemas/notification";

interface NotificationTypeDocumentProps {
  data: DocumentSendData | DocumentSignatureData | DocumentExpirationData;
}

export function NotificationTypeDocument({
  data,
}: NotificationTypeDocumentProps) {
  const params = useParams({
    from: "/company/$companyId/notifications",
  });

  return (
    <>
      <p className="text-sm">
        <Trans
          i18nKey={`notifications.list.${data.type}.by_${data.by}.body`}
          values={data}
          components={{
            Link: (
              <Link
                to="/company/$companyId/customer/$customerId/conformity"
                params={{
                  companyId: params.companyId,
                  customerId: data.customerId,
                }}
                search={{
                  tab: "ged",
                }}
              />
            ),
          }}
        />
      </p>
      <ul className="list-none ml-3 w-full">
        <li className="mt-2">
          <div className="flex justify-between">
            <div className="mr-4 text-base">
              <Link
                to="/company/$companyId/customer/$customerId/conformity"
                params={{
                  companyId: params.companyId,
                  customerId: data.customerId,
                }}
                search={{
                  tab: "ged",
                  documentId: data.documentId,
                }}
              >
                {data.documentName}
              </Link>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}
