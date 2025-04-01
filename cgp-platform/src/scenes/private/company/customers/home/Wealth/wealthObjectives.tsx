import { useParams } from "@tanstack/react-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import { Text } from "../../../../../../components/Text";
import { formatDate } from "../../../../../../helpers";
import { globalAmountFormatting } from "../../../../../../helpers/formatting";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import { gql } from "../../../../../../service/client";
import { CustomersConformityLogic } from "../../conformity/conformity.logic";
import { companyCustomersConformityRoute } from "../../conformity/route";

const WealthObjectives = () => {
  const currentRoute = useCurrentRoute();
  const { companyId, customerId } = useParams({
    from: currentRoute.routeId,
  }) as { companyId: string; customerId: string };

  const { t } = useTranslation();
  const { data } = useQuery(
    ["customerConformityObjectives", companyId, customerId],
    () =>
      gql.client.request(
        CustomersConformityLogic.customerConformityObjectives(),
        {
          companyID: companyId as string,
          customerID: customerId as string,
        }
      )
  );

  const conformityObjectives = data?.customer?.conformityObjectives ?? {};

  return (
    <div className="relative h-full flex flex-col justify-between">
      <div>
        <div className="flex mb-4 mt-4">
          <div className="w-full">
            <Text
              as="label"
              label="scenes.objectivesHeritage"
              className="text-xl font-bold"
            />
          </div>
        </div>

        <div className="flex mb-4 mt-4 items-center">
          <label className="text-xs xl-w:text-sm font-bold text-gray-400 mr-5">
            {t("lastUpdate")}
          </label>

          {!!conformityObjectives.updated && (
            <label className="text-xs xl-w:text-sm font-bold text-blue-800 mr-10">
              {formatDate(new Date(conformityObjectives.updated))}
            </label>
          )}
        </div>

        <ul className="list-disc pl-8">
          {Object.entries(conformityObjectives)
            .filter(
              ([objective]) => (
                objective !== "updated" &&
                objective.includes("Checkbox") && conformityObjectives[objective] === true
              )
            )
            .slice(0, 7)
            .map(([objective], index) => (
              <li key={index} className="text-xs xl-w:text-sm mt-1">
                <span>
                  {t(`forms.fields.conformity.objectives.${objective.replace("Checkbox", "")}`)}
                </span>
                {conformityObjectives[`${objective.replace("Checkbox", "")}Amount`] && (
                  <span className="text-blue-800 ml-2">
                    {Intl.NumberFormat(undefined, {
                      ...globalAmountFormatting,
                      currency: "EUR",
                    }).format(
                      Math.abs(
                        conformityObjectives[`${objective.replace("Checkbox", "")}Amount`] ?? 0
                      )
                    )}
                  </span>
                )}
              </li>
            ))}
        </ul>
      </div>

      <div className="pt-10 w-full flex justify-center">
        <div>
          <Text
            to={companyCustomersConformityRoute.fullPath}
            search={{
              tab: "goals",
            }}
            label="commons.viewAll"
            className="text-xs text-gray-500 underline hover:text-gray-700 whitespace-nowrap"
          />
        </div>
      </div>
    </div>
  );
};

export default WealthObjectives;
