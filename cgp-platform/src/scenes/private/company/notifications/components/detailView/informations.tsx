import { Link, useParams } from "@tanstack/react-router";
import { Trans, useTranslation } from "react-i18next";

import { InformationFillData } from "../../../../../../../shared/schemas/notification";
import { Text } from "../../../../../../components";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../UIComponents/Label/Label";

interface NotificationTypeInformationsProps {
  data: InformationFillData;
}
export function NotificationTypeInformations({
  data,
}: NotificationTypeInformationsProps) {
  const params = useParams({
    from: "/company/$companyId/notifications",
  });

  return (
    <p className="text-sm">
      <Trans
        i18nKey={`notifications.list.${data.type}.by_${data.by}.body`}
        values={data}
        components={{
          Link: (
            <Link
              to="/company/$companyId/customer/$customerId/wealth"
              params={{
                companyId: params.companyId,
                customerId: data.customerId,
              }}
            />
          ),
        }}
      />

      <div className="mt-4">
        <Link
          to="/company/$companyId/customer/$customerId/informations"
          params={{
            companyId: params.companyId,
            customerId: data.customerId,
          }}
          search={{
            tab: data.formType === "general" ? "general" : "details",
          }}
          className="text-center"
        >
          <Text className="text-sm mb-2" label="commons.seeMore" />
        </Link>
        <Form data={data} />
      </div>
    </p>
  );
}

interface FormProps {
  data: InformationFillData;
}
function Form({ data }: FormProps) {
  if (!data.updatedFields) return null;
  const { t } = useTranslation();

  return (
    <form className="flex flex-col gap-2">
      {Object.keys(data.updatedFields).map((k) => {
        let key = k;

        if (key.includes("Street")) {
          key = "street";
        } else if (key.includes("City")) {
          key = "city";
        } else if (key.includes("ZipCode")) {
          key = "zipCode";
        } else if (key.includes("Country")) {
          key = "country";
        } else if (key.includes("Phone")) {
          key = "phone";
        } else if (key.includes("Address")) {
          key = "address";
        }

        return (
          <div>
            <Label htmlFor={key}>
              {t(`forms.fields.customers.details.${key}`)}
            </Label>
            <FieldText id={key} value={data.updatedFields[key] as string} />
          </div>
        );
      })}
    </form>
  );
}
