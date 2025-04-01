import { Link, useParams } from "@tanstack/react-router";
import { AutoComplete } from "primereact/autocomplete";
import { type FC, useState } from "react";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";

import { AssetIcon } from "../../../../../../components";
import { gql } from "../../../../../../service/client";
import { Campaign } from "../../../../../../types";
// import { companycampaignsScene } from "../../../campaigns";
import { CustomersConformityLogic } from "../conformity.logic";
import { ConformtityCreationValidationSchema } from "./commons";

type CampaignInputProps = {
  control: Control<ConformtityCreationValidationSchema>;
  setValue: UseFormSetValue<ConformtityCreationValidationSchema>;
};

const CampaignInput: FC<CampaignInputProps> = ({ control, setValue }) => {
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  });
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState("");

  const searchCampaignQuery = useMutation((text: string) => {
    if (!params.companyId) throw new Error();

    return gql.client.request(CustomersConformityLogic.searchCampaign(), {
      companyID: params.companyId,
      text,
    });
  });

  return (
    <Controller
      name="campaignId"
      control={control}
      render={({ field }) => (
        <div>
          <div className="flex flex-row items-center">
            <AutoComplete
              placeholder={
                t(`forms.fields.campaignCreation.searchCampaign`) as string
              }
              value={searchInput}
              disabled={!!field.value}
              onChange={(e) => setSearchInput(e.value)}
              field="name"
              suggestions={searchCampaignQuery.data?.searchCampaign || []}
              completeMethod={(e) => searchCampaignQuery.mutate(e.query)}
              inputClassName="w-96 rounded-xl border-0 border-white py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onSelect={(e) => {
                const value = e.value as Campaign;

                setValue("name", value.name);
                field.onChange(value.id);
              }}
              itemTemplate={(item) => (
                <div className="flex items-center gap-4">
                  <AssetIcon assetName={item.assetType} size="sm" />
                  <div className="flex flex-col">
                    <p className="text-sm"> {item.name}</p>
                    <p className="text-xs font-light text-gray-500">
                      {item.provider}
                    </p>
                  </div>
                </div>
              )}
              showEmptyMessage
              emptyMessage={
                t(`forms.fields.campaignCreation.searchNoCampaign`) as string
              }
              forceSelection
            />
            {!!field.value && (
              <button
                className="ml-2"
                onClick={() => {
                  setSearchInput("");
                  field.onChange(undefined);
                }}
              >
                <i className="pi pi-times"></i>
              </button>
            )}
          </div>
          {/* <Link
            to={companycampaignsScene.to}
            params={{
              companyId: params.companyId as string,
            }}
            className="font-medium text-sm hover:opacity-70"
          >
            {t(`forms.fields.campaignCreation.searchCreate`)}
          </Link> */}
        </div>
      )}
    />
  );
};

export default CampaignInput;
