import { Link, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import { investorProfileScore } from "../../../../../../../shared/utils/calculateInvestorProfile";
import { Button } from "../../../../../../components";
import { Text } from "../../../../../../components/Text";
import { formatDate } from "../../../../../../helpers";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { Form as SchemaForm } from "../../../../../../types";
import { CustomersConformityLogic } from "../../conformity/conformity.logic";
import { useTranslatedStaticData } from "../../conformity/investorProfileForm/contants";
import { calcInvestorProfileStats } from "../../conformity/investorProfileForm/utils";
import { companyCustomersConformityRoute } from "../../conformity/route";

const InvestorProfile = () => {
  const currentRoute = useCurrentRoute();
  const params = useParams({
    from: currentRoute.routeId,
  }) as { companyId: string; customerId: string };
  const toast = useToast();
  const { t } = useTranslation();

  const queryKey = ["investorProfile", params.companyId, params.customerId];
  const { data } = useQuery(queryKey, () =>
    gql.client.request(CustomersConformityLogic.investorProfileQueries(), {
      companyID: params.companyId || "",
      customerID: params.customerId || "",
    })
  );
  const investorProfileForm = data?.investorProfileForm ?? {};
  const donutData = calcInvestorProfileStats(investorProfileForm);
  const {
    nonFinancialSensitivity,
    riskProfile,
    newRiskProfile,
    knowledgeAndExperience,
    environmentalActivities,
    environmentalSocialGoal,
  } = useTranslatedStaticData();

  const {
    knowledgeAndExperienceResult,
    riskProfileResult,
    sustainableInvestmentResult,
  } = investorProfileScore(investorProfileForm);

  const environmentalActivitiesLabel = environmentalActivities.find(
    (item) => item.id === donutData[3]
  )?.label;
  const environmentalSocialGoalLabel = environmentalSocialGoal.find(
    (item) => item.id === donutData[4]
  )?.label;

  const { mutate: sendInvestorProfileFormToCustomer } = useMutation(
    () =>
      gql.client.request(
        CustomersConformityLogic.requestCustomerToFillInvestorProfileForm(),
        {
          companyID: params.companyId,
          customerID: params.customerId,
          form: SchemaForm.ProfilInvest,
        }
      ),
    {
      onSuccess: () => {
        toast.current?.show({
          severity: "success",
          detail: t("forms.fields.notifications.success.send"),
        });
      },
    }
  );
  const isFirstVersion = investorProfileForm?.version === "1";
  const hasManualSri = investorProfileForm?.manualSri !== undefined;

  // Risk profile data is different between first version and new version
  const riskProfileData =
    hasManualSri || !isFirstVersion ? newRiskProfile : riskProfile;
  const riskProfileLabel =
    riskProfileData.find((item) => item.id === riskProfileResult)?.label || "";

  // Non financial
  const nonFinancialSensitivityLabel =
    nonFinancialSensitivity.find(
      (item) => item.id === sustainableInvestmentResult
    )?.label || "";

  // Knowledge and experience
  const knowledgeAndExperienceLabel =
    knowledgeAndExperience.find(
      (item) => item.id === knowledgeAndExperienceResult
    )?.label || "";

  return (
    <div className="h-full relative flex flex-col gap-4">
      <div className="flex justify-between mt-4">
        <Text
          as="label"
          label="scenes.investorProfile"
          className="text-xl font-bold"
        />
        <Button
          variant="bordered"
          size="small"
          className="py-1 rounded-md border ring-0"
          label="forms.fields.conformity.investorProfile.sendToCustomer"
          onClick={() => sendInvestorProfileFormToCustomer()}
        />
      </div>

      <div className="grow">
        <div className="flex items-center mb-4">
          <p className="text-xs xl-w:text-sm font-bold text-gray-400 mr-5">
            {t("lastUpdate")}
          </p>

          {!!investorProfileForm.updated && (
            <p className="text-xs xl-w:text-sm font-bold text-blue-800 mr-10">
              {formatDate(new Date(investorProfileForm.updated))}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-2">
          {environmentalActivitiesLabel && (
            <ProfileItem
              label={t(
                "scenes.customers.conformity.investorProfile.environmentalActivities"
              )}
              value={t(environmentalActivitiesLabel)}
              params={params}
            />
          )}
          {environmentalSocialGoalLabel && (
            <ProfileItem
              label={t(
                "scenes.customers.conformity.investorProfile.environmentalSocialGoal"
              )}
              params={params}
              value={t(environmentalSocialGoalLabel)}
            />
          )}
          <ProfileItem
            label={t(
              "scenes.customers.conformity.investorProfile.knowledge-and-experience"
            )}
            params={params}
            value={t(knowledgeAndExperienceLabel)}
          />
          <ProfileItem
            label={t(
              "scenes.customers.conformity.investorProfile.risk-profile"
            )}
            params={params}
            value={t(riskProfileLabel)}
          />
          <ProfileItem
            label={t(
              "scenes.customers.conformity.investorProfile.non-financial-sensitivity"
            )}
            params={params}
            value={t(nonFinancialSensitivityLabel)}
          />
        </div>
      </div>

      <div className="pt-10 flex justify-center items-end grow">
        <div>
          <Text
            to={companyCustomersConformityRoute.fullPath}
            search={{
              tab: "investorProfile",
            }}
            label="commons.viewAll"
            className="text-xs text-gray-500 underline hover:text-gray-700 whitespace-nowrap"
          />
        </div>
      </div>
    </div>
  );
};

interface ProfileItemProps {
  label: string;
  value: string;
  params: { companyId: string; customerId: string };
}

function ProfileItem({ label, value, params }: ProfileItemProps) {
  return (
    <div className="flex justify-between gap-4">
      <div>
        <p className="text-xs xl-w:text-sm whitespace-nowrap">{label}</p>
      </div>
      <Link
        to="/company/$companyId/customer/$customerId/conformity"
        params={params}
        search={{
          tab: "investorProfile",
        }}
        className="flex items-center border justify-center rounded-lg border-stone-100 bg-stone-100 h-8  px-4 w-[100px] cursor-pointer"
      >
        <p className="text-xs xl-w:text-sm text-blue-800">{value}</p>
      </Link>
    </div>
  );
}

export default InvestorProfile;
