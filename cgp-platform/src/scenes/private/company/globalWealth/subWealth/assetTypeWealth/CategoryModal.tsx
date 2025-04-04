import { useParams } from "@tanstack/react-router";
import { Dropdown } from "primereact/dropdown";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import {
  AssetIcon,
  Button,
  Dialog,
  Select as SelectRealEstate,
  Text,
} from "../../../../../../components";
import { useToast } from "../../../../../../hooks/useToast";
import {
  Amount,
  AssetGroup,
  AssetUpdateGroupMutationVariables,
} from "../../../../../../types";
import { Label } from "../../../../../../UIComponents/Label/Label";
import Select from "../../../../../../UIComponents/Select/Select";
import { orderedTypes } from "../../../customers/wealth/AssetCreation";
import { AssetCreationLogic } from "../../../customers/wealth/AssetCreation/AssetCreation.logic";
import { categoryNames as categoryNamesBenefits } from "../../../customers/wealth/AssetCreation/BenefitsForm";
import { categoryNames as categoryNamesCrowdfunding } from "../../../customers/wealth/AssetCreation/CrowdfundingForm";
import { categoryNames as categoryNamesLifeInsurance } from "../../../customers/wealth/AssetCreation/LifeInsuranceCapitalizationForm";
// import { categoryNames as categoryNamesCrypto } from "../../../customers/wealth/AssetCreation/CryptoForm";
// import { categoryNames as categoryNamesExotic } from "../../../customers/wealth/AssetCreation/ExoticForm";
import { categoryNames as categoryNamesPrivateEquity } from "../../../customers/wealth/AssetCreation/PrivateEquityForm";
import { categoryNames as categoryNamesRealEstate } from "../../../customers/wealth/AssetCreation/RealEstateForm";
import { categoryNames as categoryNamesRetirement } from "../../../customers/wealth/AssetCreation/RetirementEmployeeForm";
import { categoryNames as categoryNamesSecurities } from "../../../customers/wealth/AssetCreation/SecuritiesForm";
import { categoryNames as categoryNamesBanking } from "../../../customers/wealth/AssetCreation/StandardAssetForm";

export interface Account {
  id: string;
  name: string;
  amount?: number;
}

const categories = {
  [AssetGroup.LifeInsuranceCapitalization]: categoryNamesLifeInsurance,
  [AssetGroup.Banking]: categoryNamesBanking,
  [AssetGroup.RockPaper]: [],
  [AssetGroup.HeritageRealEstate]: categoryNamesRealEstate,
  [AssetGroup.RetirementEmployee]: categoryNamesRetirement,
  [AssetGroup.Securities]: categoryNamesSecurities,
  [AssetGroup.Crypto]: [],
  [AssetGroup.Crowdfunding]: categoryNamesCrowdfunding,
  [AssetGroup.HomeLoan]: categoryNamesRealEstate,
  [AssetGroup.Exotic]: [],
  [AssetGroup.PrivateEquity]: categoryNamesPrivateEquity,
  [AssetGroup.Benefits]: categoryNamesBenefits,
  [AssetGroup.Unrecognized]: [],
};

export const CategoryModal = ({
  open,
  setOpen,
  accounts,
  onSuccess,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  accounts: Account[];
  onSuccess: () => void;
}) => {
  const { companyId } = useParams({
    from: "/company/$companyId/global-wealth/sub/",
  });
  const toast = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<AssetGroup>(
    AssetGroup.LifeInsuranceCapitalization
  );
  const [categoryName, setCategoryName] = useState<string>(
    categories[AssetGroup.LifeInsuranceCapitalization][0].value
  );

  // Mutation
  const { mutate: assetUpdateGroup, isLoading } = useMutation(
    "assetUpdateGroup",
    (input: Omit<AssetUpdateGroupMutationVariables, "companyID">) =>
      AssetCreationLogic.updateGroup({
        companyId: companyId as string,
        group: input.group,
        categoryName: input.categoryName as string,
        assets: input.assets as string[],
      }),
    {
      onSuccess: async () => {
        toast?.current?.show({
          severity: "success",
          summary: t("forms.fields.notifications.success.save"),
          detail: t("forms.fields.assetCategorization.categorizeAsset", {
            count: accounts.length,
            name: t(`asset_group.${selectedType}`),
          }),
          life: 3000,
        });
        queryClient.invalidateQueries([
          "companyAssetUnderManagement",
          companyId,
        ]);
        onSuccess();
      },
      onError: () => {
        toast?.current?.show({
          severity: "error",
          summary: "Error",
          detail: t("forms.fields.notifications.error.send"),
        });
      },
    }
  );

  function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    assetUpdateGroup({
      assets: accounts.map((asset) => asset.id),
      group: selectedType as AssetGroup,
      categoryName: categoryName,
    });
  }

  const DialogHeader = () => {
    return (
      <div>
        <Text
          label={t("forms.fields.assetCategorization.categorize")}
          as="h1"
          className="font-bold"
        />
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => setOpen(false)}
      header={<DialogHeader />}
      className="min-w-[500px]"
    >
      <div className="my-8 flex w-full flex-col">
        <div className="flex w-full flex-col gap-x-4 gap-y-5">
          <div className="rounded-xl bg-white">
            <Dropdown
              value={{
                name: t(`asset_group.${selectedType}`),
                type: selectedType,
              }}
              onChange={(e) => {
                setSelectedType(e.value.type);
                if (
                  categories[e.value.type as keyof typeof categories]?.length >
                  0
                ) {
                  setCategoryName(
                    categories[e.value.type as keyof typeof categories][0].value
                  );
                } else {
                  setCategoryName("");
                }
              }}
              options={orderedTypes.map((type) => ({
                name: t(`asset_group.${type}`),
                type: type,
              }))}
              valueTemplate={
                selectedType
                  ? (option) => {
                      return (
                        <div className="flex flex-row items-center gap-2">
                          <AssetIcon assetName={option.type} size="sm" />
                          <p>{option.name}</p>
                        </div>
                      );
                    }
                  : undefined
              }
              itemTemplate={(option) => (
                <div className="flex flex-row items-center gap-2">
                  <AssetIcon assetName={option.type} size="sm" />
                  <p>{option.name}</p>
                </div>
              )}
              optionLabel="name"
              placeholder={
                t(`forms.fields.wealth.assetType.placeholder`) as string
              }
              className="w-full rounded-xl border"
              panelStyle={{
                marginTop: 8,
                backgroundColor: "var(--bg-slate-50)",
                borderColor: "var(--input-border-color)",
              }}
              panelClassName="asset-creation-dropdown"
            />
          </div>
          {selectedType !== AssetGroup.HeritageRealEstate &&
            categories[selectedType as keyof typeof categories]?.length > 0 && (
              <div className="rounded-xl bg-white">
                <Label
                  htmlFor="categoryName"
                  className="ml-3 font-bold text-sm text-blue-1000"
                >
                  {t(`forms.fields.category`)}
                </Label>
                <Select
                  id="categoryName"
                  value={{
                    value: categoryName,
                    label: t("asset_categories." + categoryName) as string,
                  }}
                  onChange={(option) =>
                    setCategoryName(option?.value as string)
                  }
                  options={categories[selectedType as keyof typeof categories]}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "var(--bg-slate-50)",
                      borderColor: "var(--input-border-color)",
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>
            )}
          {selectedType === AssetGroup.HeritageRealEstate && (
            <div className="rounded-xl bg-white">
              <Label
                htmlFor="categoryName"
                className="ml-3 font-bold text-sm text-blue-1000"
              >
                {t(`forms.fields.category`)}
              </Label>
              <SelectRealEstate
                name="categoryName"
                defaultValue={categoryName}
                options={categories[AssetGroup.HeritageRealEstate].map(
                  (option) => ({
                    value: option.value,
                    label: option.label,
                    optgroup: t(
                      "forms.fields.wealth.realEstate.mainCategory." +
                        option.category
                    ),
                  })
                )}
                className="min-w-[150px] py-2"
                onChange={(option) => setCategoryName(option as string)}
              />
            </div>
          )}
        </div>
        <Button
          className="mx-auto mt-8"
          label={t("forms.fields.assetCategorization.categorize")}
          loading={isLoading}
          onClick={handleSubmit}
        />
      </div>
    </Dialog>
  );
};
