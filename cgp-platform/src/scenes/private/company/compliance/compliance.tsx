import { useParams } from "@tanstack/react-router";
import { useQuery } from "react-query";

import { PercentChart, Text } from "../../../../components";
import { CardWithTitle } from "../../../../components/Card";
import { complianceCategoryName } from "../../../../constants";
import { gql } from "../../../../service/client";
import {
  CompanyCompliance as CompanyComplianceType,
  CompanyGlobalCompliance,
} from "../../../../types";
import { CompanyComplianceLogic } from "./compliance.logic";
import { ComplianceSkeleton } from "./complianceSkeleton";

export function CompanyCompliance() {
  const { companyId } = useParams({
    from: "/company/$companyId/company-compliance/",
  });

  const { data, isLoading } = useQuery(["companyCompliance", companyId], () =>
    gql.client.request(CompanyComplianceLogic.queries(), {
      company: companyId as string,
    })
  );

  if (isLoading) return <ComplianceSkeleton />;

  const gloabalCompliance: CompanyGlobalCompliance = data?.globalCompliance ?? {
    valid: 0,
    unvalid: 0,
    waiting: 0,
  };
  data?.customersCompliance.sort((a, b) => {
    if (
      complianceCategoryName(a.category.name) <
      complianceCategoryName(b.category.name)
    )
      return -1;
    if (
      complianceCategoryName(a.category.name) >
      complianceCategoryName(b.category.name)
    )
      return 1;
    return 0;
  });

  return (
    <div className="max-w-8xl">
      <GlobalConformity data={gloabalCompliance} />
      <div className="mt-8 grid sm:grid-cols-3 grid-cols-1 gap-4">
        {data?.customersCompliance?.map((compliance, index) => (
          <Card
            key={`${compliance.category.key}-${index}`}
            category={{
              ...compliance.category,
              customerVisibility: true,
            }}
            levels={compliance.levels}
          />
        ))}
      </div>
    </div>
  );
}

function Card({
  category,
  levels: { valid, unvalid, waiting },
}: CompanyComplianceType) {
  const label = complianceCategoryName(category.name);
  return (
    <CardWithTitle title={label}>
      <>
        {/* Content */}
        <div className="px-9">
          <div className="min-h-20 mt-5 flex justify-between">
            <div className="w-full text-center">
              <PercentChart level="valid" label="Valid" percent={valid} />
              <Text
                label="scenes.companyCompliance.valid"
                className="font-medium text-sm text-blue-1000"
              />
            </div>
            <div className="w-full text-center">
              <PercentChart level="warning" label="waiting" percent={waiting} />
              <Text
                label="scenes.companyCompliance.waiting"
                className="font-medium text-sm text-blue-1000"
              />
            </div>
          </div>
          <div className="m-auto my-4 w-4/5 border border-black text-black" />
          <div className="flex items-center justify-between text-center">
            <Text
              label="scenes.companyCompliance.unvalid"
              className="w-1/2 font-medium text-blue-1000"
            />
            <div className="w-1/2">
              <PercentChart level="error" label="Unvalid" percent={unvalid} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mb-4 text-center">
          <Text
            to={`/company/$companyId/company-compliance/${category.key}`}
            label="commons.seeMore"
            className="mt-2 cursor-pointer text-sm uppercase text-gray-500 underline"
          />
        </div>
      </>
    </CardWithTitle>
  );
}

function GlobalConformity({ data }: { data: CompanyGlobalCompliance }) {
  return (
    <CardWithTitle title="scenes.companyCompliance.global">
      <div className="my-4 flex w-full flex-col items-center justify-around px-10 xl:mx-0 xl:flex-row">
        <div className="flex w-full items-center justify-between gap-x-0 text-center xl:w-1/3 xl:justify-center xl:gap-x-14">
          <Text
            label="scenes.companyCompliance.valid"
            className="font-bold text-xl text-blue-1000"
          />
          <div className="w-1/2">
            <PercentChart level="valid" label="Valid" percent={data.valid} />
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-x-0 text-center xl:w-1/3 xl:justify-center xl:gap-x-14">
          <Text
            label="scenes.companyCompliance.waiting"
            className="font-bold text-xl text-blue-1000"
          />
          <div className="w-1/2">
            <PercentChart
              level="warning"
              label="waiting"
              percent={data.waiting}
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-x-0 text-center xl:w-1/3 xl:justify-center xl:gap-x-14">
          <Text
            label="scenes.companyCompliance.unvalid"
            className="font-bold text-xl text-blue-1000"
          />
          <div className="w-1/2">
            <PercentChart
              level="error"
              label="Unvalid"
              percent={data.unvalid}
            />
          </div>
        </div>
      </div>
      <div className="mb-4 text-center">
        <Text
          to={`/company/$companyId/company-compliance/GLOBAL`}
          label="commons.seeMore"
          className="mt-2 cursor-pointer text-sm uppercase text-gray-500 underline"
        />
      </div>
    </CardWithTitle>
  );
}
