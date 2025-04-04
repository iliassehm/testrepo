import { useParams } from "@tanstack/react-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import { Text } from "../../../../../../components/Text";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import { gql } from "../../../../../../service/client";
import { DocumentCategoryV2, StatusData } from "../../../../../../types";
import { GedLogic } from "../../conformity/ged/ged.logic";
import WidgetRegulationItem, {
  WidgetRegulationItemProps,
} from "../Regulation/widgetRegulationItem";
import { RegulationLogic } from "./regulation.logic";

interface RegulationItem {
  label: string;
  date: string;
  statusIcon: string;
  name: string;
  documentId?: string;
}

const formatDate = (date: string | null) => {
  if (!date) return "";
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

const mapStatusToIcon = (status: string | undefined) => {
  switch (status) {
    case "IN_PROGRESS":
      return "in_progress";
    case "VALIDATED":
      return "done";
    default:
      return "cancel";
  }
};

const WidgetRegulation: React.FC = () => {
  const currentRoute = useCurrentRoute();
  const { companyId, customerId } = useParams({
    from: currentRoute.routeId,
  }) as { companyId: string; customerId: string };

  const { t } = useTranslation();
  const queryKey = ["conformityStatus", companyId, customerId];
  const { data, refetch } = useQuery(queryKey, () =>
    gql.client.request(RegulationLogic.queries(), {
      companyID: companyId || "",
      customerID: customerId || "",
    })
  );

  const { data: documentData } = useQuery(
    ["gedDocumentList", companyId, customerId],
    () =>
      gql.client.request(GedLogic.gedDocumentCategoryQuery(), {
        companyID: companyId as string,
        customerID: customerId as string,
      }),
    {
      select: (data) => {
        return data.documentCategoryList
          ?.filter((category) => {
            return category.documents?.some((document) => {
              return document.envelope || !document.envelope;
            });
          })
          .map((category) => {
            return {
              ...category,
              documents: category.documents?.filter((document) => {
                return document.envelope || !document.envelope;
              }),
            };
          });
      },
    }
  );

  function regulationDateDisplay(statusData?: StatusData | null) {
    const info = statusData?.info;
    if (!info) return "";

    const percent = parseFloat(info).toFixed(0);

    return t(`forms.regulation.infoPercent.${statusData.status}`, { percent });
  }

  const items: RegulationItem[] = [
    {
      name: "informationCollections",
      label: t("forms.regulation.informationCollections"),
      date: regulationDateDisplay(
        data?.conformityStatus?.informationCollections
      ),
      statusIcon: mapStatusToIcon(
        data?.conformityStatus?.informationCollections?.status
      ),
    },
    {
      name: "LCB",
      label: t("forms.regulation.LCB"),
      date: regulationDateDisplay(data?.conformityStatus?.LCB),
      statusIcon: mapStatusToIcon(data?.conformityStatus?.LCB?.status),
    },
    {
      name: "DER",
      label: t("forms.regulation.DER"),
      date: formatDate(data?.conformityStatus?.DER?.date),
      statusIcon: mapStatusToIcon(data?.conformityStatus?.DER?.status),
      documentId: data?.conformityStatus?.DER?.documentId as string,
    },
    {
      name: "engagementLetter",
      label: t("forms.regulation.engagementLetter"),
      date: formatDate(data?.conformityStatus?.engagementLetter?.date),
      statusIcon: mapStatusToIcon(
        data?.conformityStatus?.engagementLetter?.status
      ),
      documentId: data?.conformityStatus?.engagementLetter
        ?.documentId as string,
    },
    {
      name: "officialDocuments",
      label: t("forms.regulation.officialDocuments"),
      date: formatDate(data?.conformityStatus?.officialDocuments?.date),
      statusIcon: mapStatusToIcon(
        data?.conformityStatus?.officialDocuments?.status
      ),
    },
    {
      name: "investorProfile",
      label: t("forms.regulation.investorProfile"),
      date: formatDate(data?.conformityStatus?.investorProfile?.date),
      statusIcon: mapStatusToIcon(
        data?.conformityStatus?.investorProfile?.status
      ),
      documentId: data?.conformityStatus?.investorProfile?.documentId as string,
    },
    {
      name: "objectivesHeritage",
      label: t("forms.regulation.objectivesHeritage"),
      date: formatDate(data?.conformityStatus?.objectivesHeritage?.date),
      statusIcon: mapStatusToIcon(
        data?.conformityStatus?.objectivesHeritage?.status
      ),
      documentId: data?.conformityStatus?.objectivesHeritage
        ?.documentId as string,
    },
  ];

  return (
    <div>
      <div className="flex mb-4 mt-4">
        <div className="w-full">
          <Text
            as="label"
            label="forms.regulation.title"
            className="text-xl font-bold"
          />
        </div>
      </div>
      {items.map((item, index) => (
        <WidgetRegulationItem
          key={index}
          label={item.label}
          date={item.date}
          documentId={item.documentId}
          conformityId={data?.conformityStatus?.conformityId as string}
          name={item.name as WidgetRegulationItemProps["name"]}
          statusIcon={`/svg/${item.statusIcon}.svg`}
          geqQuery={documentData as DocumentCategoryV2[]}
          refetch={refetch}
        />
      ))}
    </div>
  );
};

export default WidgetRegulation;
