import { useNavigate } from "@tanstack/react-router";
import { t } from "i18next";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { AssetIcon, Loading, Text } from "../../../../../../components";
import { clsx } from "../../../../../../helpers";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import {
  AssetGroup,
  Customer,
  CustomerAsset,
  GlobalSearchParams,
  InvestmentValues,
  RealEstate,
  WealthCreationParams,
  WealthFilter,
} from "../../../../../../types";
import { FieldText } from "../../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../../UIComponents/Label/Label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../../UIComponents/RadioGroup/RadioGroup";
import Select from "../../../../../../UIComponents/Select/Select";
import { GlobalWealthLogic } from "../../../globalWealth/globalWealth.logic";
import { AssetDetailLogic } from "../AssetDetail/assetDetail.logic";
import { WealthLogic } from "../wealth.logic";
import { AssetCreationLogic } from "./AssetCreation.logic";
import { BenefitsForm } from "./BenefitsForm";
import { CrowdfundingForm } from "./CrowdfundingForm";
import { CryptoForm } from "./CryptoForm";
// import { CryptoForm } from "./CryptoForm";
import { ExoticForm } from "./ExoticForm";
import { LifeInsuranceCapitalizationForm } from "./LifeInsuranceCapitalizationForm";
import { LoanForm } from "./LoanForm";
import { LongTermAssetCreation } from "./LongTermAsset";
import { PrivateEquityForm } from "./PrivateEquityForm";
import { RealEstateForm, RealEstateFormType } from "./RealEstateForm";
import { RetirementEmployeeForm } from "./RetirementEmployeeForm";
import { SCPIForm } from "./SCPIForm/index";
import { SecuritiesForm } from "./SecuritiesForm";
import { StandardAssetForm } from "./StandardAssetForm";

type AssetDetail = {
  asset: CustomerAsset;
};

type AssetCreationProps = {
  visible: boolean;
  onHide: () => void;
};

const standardTypes = [AssetGroup.Banking];

export const orderedTypes: AssetGroup[] = [
  AssetGroup.LifeInsuranceCapitalization,
  AssetGroup.Banking,
  AssetGroup.RockPaper,
  AssetGroup.HeritageRealEstate,
  AssetGroup.CommercialRealEstate,
  AssetGroup.ProfessionalRealEstate,

  AssetGroup.RetirementEmployee,
  AssetGroup.Securities,
  AssetGroup.Crypto,
  AssetGroup.Crowdfunding,
  AssetGroup.HomeLoan,

  AssetGroup.Exotic,
  AssetGroup.PrivateEquity,
  AssetGroup.Benefits,
];

const customNameTypes = [
  AssetGroup.LifeInsuranceCapitalization,
  AssetGroup.RetirementEmployee,
  AssetGroup.RockPaper,
];

export type LongTermAssetType =
  | AssetGroup.LifeInsuranceCapitalization
  | AssetGroup.RetirementEmployee
  | AssetGroup.RockPaper;

export const AssetCreation = ({ visible, onHide }: AssetCreationProps) => {
  // States
  const [isUnderManagement, setIsUnderManagement] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<AssetGroup | null>(null);
  const [realEstateFormType, setRealEstateFormType] =
    useState<RealEstateFormType>(RealEstateFormType.DETAILED);
  const [name, setName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [bindToProperty, setBindToProperty] = useState("");

  // Hooks
  const route = useCurrentRoute();
  const params = route.params as Record<string, string>;
  const search = route.search as GlobalSearchParams & WealthCreationParams;
  useEffect(() => {
    if (search.assetType) setSelectedType(search.assetType);
    if (search.isUnderManagement !== undefined)
      setIsUnderManagement(search.isUnderManagement);
  }, [search.assetType, search.isUnderManagement]);

  const navigate = useNavigate({
    from: route.routeId,
  });
  const toast = useToast();
  const queryClient = useQueryClient();

  // Queries
  const {
    data,
    isSuccess,
    isLoading: assetDetailLoading,
  } = useQuery(
    ["asset_detail", params.assetId],
    () =>
      gql.client.request<AssetDetail>(AssetDetailLogic.queries(), {
        id: params.assetId,
      }),
    {
      enabled: params.assetId ? true : false, //&& visible,
      onSuccess: async ({ asset }) => {
        if (asset?.metadata?.bindToProperty) {
          setBindToProperty(asset?.metadata?.bindToProperty);
        }
      },
    }
  );

  const assetsRealEstateListQuery = useQuery(
    ["customerAssets", params.companyId, params.customerId],
    () =>
      gql.client.request(WealthLogic.customerAssets(), {
        companyID: params.companyId ?? "",
        id: params.customerId ?? "",
        groups: [AssetGroup.HeritageRealEstate],
      }),
    {
      enabled:
        selectedType === AssetGroup.HomeLoan ||
        data?.asset?.group === AssetGroup.HomeLoan
          ? true
          : false,
    }
  );

  const { data: otherOwnerData } = useQuery(
    ["asset_other_owner", data?.asset?.id],
    () =>
      gql.client.request<{ otherOwner: Customer }>(
        AssetDetailLogic.retrieveOtherOwner(),
        {
          assetId: asset?.id,
          currentOwnerId: params.customerId,
        }
      ),
    {
      enabled:
        data?.asset?.id && data?.asset?.metadata?.ownership < 1 ? true : false,
    }
  );

  const { data: usersInCustomerReferenceData } = useQuery(
    ["users_in_customer_reference", params.companyId, params.customerId],
    () =>
      gql.client.request<{ users: Customer[] }>(
        AssetDetailLogic.getUsersInCustomerReference(),
        {
          companyId: params.companyId,
          customerId: params.customerId,
        }
      )
  );

  const otherOwners = usersInCustomerReferenceData?.users
    ? usersInCustomerReferenceData?.users
        ?.filter((u) => u.id !== params.customerId)
        .map((u) => ({
          value: u.id,
          label: u.name,
        }))
    : [];

  // const otherOwners = [
  //   {
  //     value: "1",
  //     label: "User test 1",
  //   },
  //   {
  //     value: "2",
  //     label: "User test 2",
  //   },
  //   {
  //     value: "3",
  //     label: "User test 3",
  //   },
  // ];

  useEffect(() => {
    if (isSuccess) {
      setName(data?.asset?.name);
      setSelectedType(data?.asset?.group);
      setIsUnderManagement(data?.asset?.underManagement);
      setCategoryName(data?.asset?.categoryName ?? "");
    }
  }, [isSuccess, data]);

  const asset = data?.asset;
  const assetsRealEstateList =
    assetsRealEstateListQuery?.data?.customerAssets || [];

  const assetsRealEstateListOptions = assetsRealEstateList.map((asset) => ({
    label: asset.name,
    value: asset.id,
  }));

  // Mutations
  const assetCreationMutation = useMutation(
    "asset_creation",
    (data: {
      name: string;
      type: AssetGroup;
      values: unknown;
      investments?: InvestmentValues[];
      isUnderManagement: boolean;
    }) => {
      const values = data.values;
      return AssetCreationLogic.creation({
        customerId: params.customerId as string,
        companyId: params.companyId as string,
        name: data.name,
        group: data.type,
        values: values,
        investments: data.investments,
        isUnderManagement: data.isUnderManagement,
      });
    },
    {
      onSuccess: async (data) => {
        toast?.current?.show({
          severity: "success",
          summary: t("scenes.wealth.creation.success.summary") as string,
          detail: t("scenes.wealth.creation.success.detail", {
            name: data?.created?.name,
          }),
        });
        await queryClient.invalidateQueries([
          "customer_wealth",
          params.customerId,
          params.companyId,
        ]);
        await queryClient.invalidateQueries([
          "layout_customer",
          params.companyId,
          params.customerId,
          search.period,
        ]);
        onHide();
        if (
          selectedType === AssetGroup.LifeInsuranceCapitalization ||
          selectedType === AssetGroup.RetirementEmployee ||
          selectedType === AssetGroup.Securities
        ) {
          navigate({
            to: "/company/$companyId/customer/$customerId/wealth/$type/$investmentId",
            params: {
              companyId: params.companyId as string,
              customerId: params.customerId as string,
              investmentId: data?.created?.id as string,
              type: selectedType,
            },
          });
        } else {
          navigate({
            to: "/company/$companyId/customer/$customerId/wealth/",
            params: {
              companyId: params.companyId as string,
              customerId: params.customerId as string,
            },
            search: () => ({ assetID: data?.created?.id }),
          });
        }
        setName("");
      },
      async onError(error, variables) {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t("scenes.wealth.creation.error.summary") as string,
          detail: t("scenes.wealth.creation.error.detail", {
            name: variables.name,
          }),
        });
      },
    }
  );

  const assetUpdateMutation = useMutation(
    "asset_update",
    (data: {
      name: string;
      type: AssetGroup;
      values: unknown;
      investments?: InvestmentValues[];
      isUnderManagement: boolean;
    }) => {
      const values = data.values;
      return AssetCreationLogic.update({
        customerId: params.customerId as string,
        companyId: params.companyId as string,
        assetId: params.assetId as string,
        name: data.name,
        group: data.type,
        values: values,
        investments: data.investments,
        isUnderManagement: data.isUnderManagement,
      });
    },
    {
      onSuccess: async (data) => {
        toast?.current?.show({
          severity: "success",
          summary: t("scenes.wealth.update.success.summary") as string,
          detail: t("scenes.wealth.update.success.detail", {
            name: data?.updated?.name,
          }),
        });
        await queryClient.invalidateQueries([
          "customer_wealth",
          params.customerId,
          params.companyId,
        ]);
        await queryClient.invalidateQueries([
          "layout_customer",
          params.companyId,
          params.customerId,
          search.period,
        ]);
        onHide();
        if (
          selectedType === AssetGroup.LifeInsuranceCapitalization ||
          selectedType === AssetGroup.RetirementEmployee
        ) {
          navigate({
            to: "/company/$companyId/customer/$customerId/wealth/$type/$investmentId",
            params: {
              companyId: params.companyId as string,
              customerId: params.customerId as string,
              investmentId: data?.updated?.id as string,
              type: selectedType,
            },
          });
        } else {
          navigate({
            to: "/company/$companyId/customer/$customerId/wealth/",
            params: {
              companyId: params.companyId as string,
              customerId: params.customerId as string,
            },
            search: () => ({ assetID: data?.updated?.id }),
          });
        }
        setName("");
      },
      async onError(error, variables) {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t("scenes.wealth.update.error.summary") as string,
          detail: t("scenes.wealth.update.error.detail", {
            name: variables.name,
          }),
        });
      },
    }
  );

  const switchAssetManagementMutation = useMutation(
    "switch_asset_management",
    (data: { asset: CustomerAsset; assetIsUnderManagement: boolean }) => {
      return GlobalWealthLogic.managementSwitch({
        id: data.asset.id,
        customerID: params.customerId as string,
        companyID: params.companyId as string,
        domain: data.assetIsUnderManagement
          ? WealthFilter.UnderManagements
          : WealthFilter.Customers,
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["asset_detail", params.assetId]);
      },
    }
  );

  const assetUpdateGroupMutation = useMutation(
    "asset_update_group",
    (group: AssetGroup) => {
      return AssetCreationLogic.updateGroup({
        companyId: params.companyId as string,
        assets: [params.assetId],
        group: group as AssetGroup,
      });
    },
    {
      onSuccess: async (data) => {
        toast?.current?.show({
          severity: "success",
          summary: t("scenes.wealth.update.success.summary") as string,
          detail: t("scenes.wealth.update.success.detail", {
            name: data?.updated?.[0]?.name,
          }),
        });
      },
      async onError(error, group) {
        console.error(error);
        toast?.current?.show({
          severity: "error",
          summary: t("scenes.wealth.update.error.summary") as string,
          detail: t("scenes.wealth.update.error.detail", {
            name: group,
          }),
        });
      },
    }
  );

  const onSubmit = (data: unknown, investments?: InvestmentValues[]) => {
    const bindToPropertyName = assetsRealEstateListOptions?.find(
      (option) => option.value === bindToProperty
    )?.label;

    if (!params.assetId) {
      assetCreationMutation.mutate({
        name: (data as { name?: string }).name ?? bindToPropertyName ?? name,
        type: selectedType as AssetGroup,
        values: {
          ...(data as { [key: string]: any }),
          ...(selectedType === AssetGroup.HomeLoan && {
            bindToProperty: bindToProperty,
          }),
        },
        investments: investments ?? undefined,
        isUnderManagement: isUnderManagement,
      });
    } else {
      assetUpdateMutation.mutate({
        name: (data as { name?: string }).name ?? bindToPropertyName ?? name,
        type: selectedType as AssetGroup,
        values: {
          ...(data as { [key: string]: any }),
          ...(selectedType === AssetGroup.HomeLoan && {
            bindToProperty: bindToProperty,
          }),
        },
        investments: investments ?? undefined,
        isUnderManagement: isUnderManagement,
      });
    }
  };

  const referenceInstrument = "EUR";

  const hasLoanOrRealEstate = [
    AssetGroup.HomeLoan,
    AssetGroup.HeritageRealEstate,
  ];

  const realEstateFormTypeOptions = [
    {
      label: t(`forms.fields.wealth.realEstate.formType.simplified`) as string,
      value: RealEstateFormType.SIMPLIFIED,
    },
    {
      label: t(`forms.fields.wealth.realEstate.formType.detailed`) as string,
      value: RealEstateFormType.DETAILED,
    },
  ];

  if (assetDetailLoading) return <Loading />;

  return (
    <div
      className={clsx(visible || params.assetId ? "flex flex-col" : "hidden")}
    >
      <Text
        label={
          params.assetId
            ? t(`scenes.wealth.assetEdit`)
            : t(`scenes.wealth.assetAdd`)
        }
        as="h2"
        className="mb-8 font-bold text-2xl text-blue-1100"
      />
      <div className="flex w-full flex-col gap-x-4 gap-y-4 md:flex-row">
        <div className="w-1/2 rounded-xl bg-white">
          {/* <label className="ml-3 text-xs font-medium text-blue-1000">
            {t(`forms.fields.wealth.assetType.label`)}
          </label> */}
          <Dropdown
            value={{
              name: t(`asset_group.${selectedType}`),
              type: selectedType,
            }}
            onChange={(e) => {
              if (params.assetId) {
                navigate({
                  to: `/company/$companyId/customer/$customerId/edit/$assetId`,
                  search: { ...search, assetType: e.value.type },
                });
              } else {
                navigate({
                  to: `/company/$companyId/customer/$customerId/add`,
                  search: { ...search, assetType: e.value.type },
                });
              }
              setSelectedType(e.value.type);
              if (params.assetId) {
                assetUpdateGroupMutation.mutate(e.value.type);
              }
            }}
            options={orderedTypes.map((type) => ({
              name: t(`asset_group.${type}`),
              type: type,
            }))}
            valueTemplate={
              selectedType
                ? (option, { value }) => {
                    const elem = option ?? value;

                    return (
                      <div className="flex flex-row items-center gap-2">
                        <AssetIcon assetName={elem.type} size="sm" />
                        <p>{elem.name}</p>
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
            className="w-full rounded-xl border-none"
            panelStyle={{ marginTop: 8 }}
            panelClassName="asset-creation-dropdown"
          />
        </div>
        <div className="w-1/2 float-left flex justify-center items-center">
          <label htmlFor="switch-underManagement" className="mr-3">
            {isUnderManagement
              ? t(`forms.fields.wealth.isUnderManagement`)
              : t(`forms.fields.wealth.isNotUnderManagement`)}
          </label>
          <InputSwitch
            inputId="switch-underManagement"
            checked={isUnderManagement}
            onChange={(e) => {
              if (e.value != null) {
                if (params.assetId) {
                  navigate({
                    to: `/company/$companyId/customer/$customerId/edit/$assetId`,
                    search: { ...search, isUnderManagement: e.value },
                  });
                } else {
                  navigate({
                    to: `/company/$companyId/customer/$customerId/add`,
                    search: { ...search, isUnderManagement: e.value },
                  });
                }
                setIsUnderManagement(e.value);
                if (asset) {
                  switchAssetManagementMutation.mutate({
                    asset: asset,
                    assetIsUnderManagement: e.value,
                  });
                }
              }
            }}
          />
        </div>
      </div>
      {(!asset || asset?.isManual) && (
        <div
          className={clsx(
            "mx-auto mt-4 flex w-full flex-col justify-center",
            !!selectedType &&
              hasLoanOrRealEstate.includes(selectedType) &&
              "w-fit lg:w-full"
          )}
        >
          <div className="flex flex-row">
            {selectedType && selectedType === AssetGroup.Crypto ? (
              <div className="mb-4 w-1/3 rounded-xl bg-white pb-2">
                <Label
                  htmlFor="name"
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.walletName.label`)}
                </Label>
                <FieldText
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-none"
                  placeholder={
                    t(`forms.fields.wealth.walletName.placeholder`) || ""
                  }
                />
              </div>
            ) : selectedType && selectedType === AssetGroup.HomeLoan ? (
              <div className="mb-4 w-1/2 rounded-xl bg-white">
                <Label
                  htmlFor="bindToProperty"
                  className="ml-3 font-medium text-xs text-blue-1000"
                >
                  {t(`forms.fields.wealth.accountName.label`)}
                </Label>
                <Select
                  id="bindToProperty"
                  name="bindToProperty"
                  value={assetsRealEstateListOptions?.find(
                    (option) => option.value === bindToProperty
                  )}
                  onChange={(option) =>
                    setBindToProperty((option?.value as string) ?? "")
                  }
                  options={assetsRealEstateListOptions}
                  placeholder={
                    t(`forms.fields.wealth.accountName.placeholder`) || ""
                  }
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      // backgroundColor: "var(--bg-slate-50)",
                      borderColor: "var(--input-border-color)",
                    }),
                  }}
                />
              </div>
            ) : null}
            {selectedType === AssetGroup.HeritageRealEstate ||
            selectedType === AssetGroup.CommercialRealEstate ||
            selectedType === AssetGroup.ProfessionalRealEstate ||
            selectedType === AssetGroup.LifeInsuranceCapitalization ||
            selectedType === AssetGroup.RetirementEmployee ||
            selectedType === AssetGroup.RockPaper ||
            selectedType === AssetGroup.Securities ? (
              <div className="mb-4 w-1/2 float-left flex">
                <RadioGroup
                  onValueChange={(value) =>
                    setRealEstateFormType(value as RealEstateFormType)
                  }
                  value={realEstateFormType}
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id="realEstateFormType-simplified"
                      value={RealEstateFormType.SIMPLIFIED}
                      className="bg-white"
                    />
                    <Label
                      htmlFor="realEstateFormType-simplified"
                      className="cursor-pointer"
                    >
                      {realEstateFormTypeOptions[0].label}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id="realEstateFormType-detail"
                      value={RealEstateFormType.DETAILED}
                      className="bg-white"
                    />
                    <Label
                      htmlFor="realEstateFormType-detail"
                      className="cursor-pointer"
                    >
                      {realEstateFormTypeOptions[1].label}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            ) : null}
          </div>
          {selectedType && standardTypes.includes(selectedType) && (
            <StandardAssetForm
              onSubmit={(data) => onSubmit(data, undefined)}
              type={selectedType}
              referenceInstrument={referenceInstrument}
              isLoading={
                assetCreationMutation.isLoading || assetUpdateMutation.isLoading
              }
              asset={asset}
            />
          )}
          {selectedType === AssetGroup.Crowdfunding && (
            <CrowdfundingForm
              onSubmit={(data) => onSubmit(data, undefined)}
              type={selectedType}
              referenceInstrument={referenceInstrument}
              isLoading={
                assetCreationMutation.isLoading || assetUpdateMutation.isLoading
              }
              asset={asset}
            />
          )}
          {selectedType === AssetGroup.HomeLoan && (
            <LoanForm
              customerId={params.customerId}
              onSubmit={(data) => onSubmit(data, undefined)}
              type={selectedType}
              referenceInstrument={referenceInstrument}
              isLoading={
                assetCreationMutation.isLoading || assetUpdateMutation.isLoading
              }
              asset={asset}
            />
          )}
          {selectedType === AssetGroup.LifeInsuranceCapitalization && (
            <LifeInsuranceCapitalizationForm
              customerId={params.customerId}
              onSubmit={(data, investments) => onSubmit(data, investments)}
              formType={realEstateFormType}
              isLoading={
                assetCreationMutation.isLoading || assetUpdateMutation.isLoading
              }
              asset={asset}
              otherOwners={otherOwners}
              otherOwner={otherOwnerData?.otherOwner}
            />
          )}
          {selectedType === AssetGroup.RetirementEmployee && (
            <RetirementEmployeeForm
              customerId={params.customerId}
              onSubmit={(data, investments) => onSubmit(data, investments)}
              formType={realEstateFormType}
              isLoading={
                assetCreationMutation.isLoading || assetUpdateMutation.isLoading
              }
              asset={asset}
              otherOwners={otherOwners}
              otherOwner={otherOwnerData?.otherOwner}
            />
          )}
          {selectedType === AssetGroup.RockPaper && (
            <SCPIForm
              customerId={params.customerId}
              asset={asset}
              onSubmit={(data, investments) => onSubmit(data, investments)}
              isLoading={
                assetCreationMutation.isLoading || assetUpdateMutation.isLoading
              }
              formType={realEstateFormType}
              otherOwners={otherOwners}
              otherOwner={otherOwnerData?.otherOwner}
            />
          )}
          {selectedType === AssetGroup.Crypto && (
            <CryptoForm
              asset={asset}
              onSubmit={(data) => onSubmit(data, undefined)}
              type={selectedType}
              isLoading={
                assetCreationMutation.isLoading || assetUpdateMutation.isLoading
              }
            />
          )}

          {selectedType === AssetGroup.Exotic && (
            <ExoticForm
              customerId={params.customerId}
              onSubmit={(data) => onSubmit(data, undefined)}
              type={selectedType}
              referenceInstrument={referenceInstrument}
              isLoading={
                assetCreationMutation.isLoading || assetUpdateMutation.isLoading
              }
              asset={asset}
            />
          )}
          {selectedType === AssetGroup.PrivateEquity && (
            <PrivateEquityForm
              customerId={params.customerId}
              onSubmit={(data) => onSubmit(data, undefined)}
              type={selectedType}
              referenceInstrument={referenceInstrument}
              isLoading={
                assetCreationMutation.isLoading || assetUpdateMutation.isLoading
              }
              asset={asset}
            />
          )}
          {(selectedType === AssetGroup.HeritageRealEstate ||
            selectedType === AssetGroup.CommercialRealEstate ||
            selectedType === AssetGroup.ProfessionalRealEstate) && (
            <RealEstateForm
              customerId={params.customerId}
              onSubmit={(data) => onSubmit(data, undefined)}
              type={selectedType}
              referenceInstrument={referenceInstrument}
              isLoading={
                assetCreationMutation.isLoading || assetUpdateMutation.isLoading
              }
              realEstateFormType={realEstateFormType}
              asset={asset}
              otherOwners={otherOwners}
              otherOwner={otherOwnerData?.otherOwner}
            />
          )}
          {selectedType === AssetGroup.Securities && (
            <SecuritiesForm
              onSubmit={(data, investments) => onSubmit(data, investments)}
              formType={realEstateFormType}
              isLoading={
                assetCreationMutation.isLoading || assetUpdateMutation.isLoading
              }
              asset={asset}
            />
          )}
          {selectedType === AssetGroup.Benefits && (
            <BenefitsForm
              customerId={params.customerId}
              asset={asset}
              onSubmit={(data, investments) => onSubmit(data, investments)}
              isLoading={
                assetCreationMutation.isLoading || assetUpdateMutation.isLoading
              }
              otherOwners={otherOwners}
              otherOwner={otherOwnerData?.otherOwner}
            />
          )}
        </div>
      )}
    </div>
  );
};
