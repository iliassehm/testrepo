import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { InputSwitch } from "primereact/inputswitch";
import { useQuery } from "react-query";

import { InvestorProfileFormInputs } from "../../../../../../shared/schemas/investorProfileFormSchema";
import { Text } from "../../../../../components";
import { DonutPie } from "../../../../../components/DonutPie";
import { Tab, Tabs } from "../../../../../components/Tabs";
import { gql } from "../../../../../service/client";
import { CustomersConformityLogic } from "./conformity.logic";
import { Ged } from "./ged";
import { Objectives } from "./goals";
import { InvestorProfile } from "./InvestorProfile";
import { useTranslatedStaticData } from "./investorProfileForm/contants";
import { calcInvestorProfileStats } from "./investorProfileForm/utils";
import { LCB } from "./LCB/LCB";

const tabs = [
  {
    id: "ged",
    label: "scenes.customers.conformity.tabs.ged",
    component: <Ged />,
  },
  {
    id: "investorProfile",
    label: "scenes.customers.conformity.tabs.investorProfile",
    component: <InvestorProfile />,
  },
  {
    id: "goals",
    label: "scenes.customers.conformity.tabs.goals",
    component: (
      <div className="flex gap-x-4">
        <Objectives />
      </div>
    ),
  },
  {
    id: "lcbFtLab",
    label: "scenes.customers.conformity.tabs.lcbFtLab",
    component: (
      <div className="flex gap-x-4">
        <LCB />
      </div>
    ),
  },
];

export function CompanyCustomersConformity() {
  const { tab } = useSearch({
    from: "/company/$companyId/customer/$customerId/conformity",
  });
  const navigate = useNavigate({
    from: "/company/$companyId/customer/$customerId/conformity",
  });
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  });
  const isInvestorProfile = tab === "investorProfile";

  // Queries
  const { data: investorProfile } = useQuery(
    ["investorProfileStats_", params.companyId, params.customerId],
    () =>
      gql.client.request(CustomersConformityLogic.investorProfileStats(), {
        companyID: params.companyId as string,
        customerID: params.customerId as string,
      }),
    {
      enabled: isInvestorProfile,
    }
  );

  const onChange = (tab: Tab["id"]) => {
    navigate({
      to: "/company/$companyId/customer/$customerId/conformity",
      params: params,
      search: {
        tab,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="section max-w-8xl flex-1 pb-4">
        <Tabs
          tabs={tabs}
          defaultTab={tab}
          onChange={onChange}
          panelClassname="px-4"
        />
      </div>
      {isInvestorProfile && (
        <div className="section max-w-xs">
          <Stats investorProfileForm={investorProfile?.investorProfileForm} />
        </div>
      )}
    </div>
  );
}

function Stats({
  investorProfileForm,
}: {
  investorProfileForm?: InvestorProfileFormInputs;
}) {
  const { environmentalActivities, environmentalSocialGoal } =
    useTranslatedStaticData();
  const donutData = calcInvestorProfileStats(investorProfileForm);

  const hasSri = investorProfileForm?.finalSri !== undefined;

  if (hasSri) return null;

  return (
    <div className="flex h-full flex-col items-stretch justify-start gap-y-4 py-4">
      <div className="px-4">
        <Text
          label="scenes.customers.conformity.investorProfile.environmentalActivities"
          className="mb-5 text-center font-bold text-lg text-blue-800"
        />
        <DonutPie
          className="mb-20"
          centeredText="scenes.customers.conformity.investorProfile.non-financial-sensitivity"
          current={donutData[3]}
          data={environmentalActivities}
        />
      </div>
      <div className="px-4">
        <Text
          label="scenes.customers.conformity.investorProfile.environmentalSocialGoal"
          className="mb-2 text-center font-bold text-lg text-blue-800"
        />
        <DonutPie
          className="mb-20"
          centeredText="scenes.customers.conformity.investorProfile.non-financial-sensitivity"
          current={donutData[4]}
          data={environmentalSocialGoal}
        />
      </div>
      {/* {investorProfileForm?.q19 === "1" && (
        <div className="px-4 text-center">
          <Text
            label="scenes.customers.conformity.investorProfile.negativeImpacts"
            className="mb-5 text-center font-bold text-lg text-blue-800"
          />
          <InputSwitch checked={!!investorProfileForm?.q19} disabled />
          <p className="text-center">{investorProfileForm?.q19Answer}</p>
        </div>
      )} */}
    </div>
  );
}
