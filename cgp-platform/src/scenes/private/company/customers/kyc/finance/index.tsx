import { useParams } from "@tanstack/react-router";
import { t } from "i18next";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import { AssetIcon, Loading, Text } from "../../../../../../components";
import { globalAmountFormatting } from "../../../../../../helpers";
import {
  AssetGroup,
  CustomerAsset,
  CustomerConformityObjectivesQuery,
  InvestmentValues,
} from "../../../../../../types";
import Checkbox from "../../../../../../UIComponents/Checkbox/Checkbox";
import { Label } from "../../../../../../UIComponents/Label/Label";
import { ObjectivesFormDataType } from "../../conformity/goals/form";
import { BankingForm } from "./forms/BankingForm";
import { BenefitsForm } from "./forms/BenefitsForm";
import { CrowdfundingForm } from "./forms/CrowdfundingForm";
import { ExoticForm } from "./forms/ExoticForm";
import { LifeInsuranceCapitalizationForm } from "./forms/LifeInsuranceCapitalizationForm";
import { PrivateEquityForm } from "./forms/PrivateEquityForm";
import { RetirementEmployeeForm } from "./forms/RetirementEmployeeForm";
import { RockPaperForm } from "./forms/RockPaperForm";
import { SecuritiesForm } from "./forms/SecuritiesForm";
import { useFinanceQueries } from "./hooks/useFinanceQueries";
import { useFinancesMutations } from "./hooks/useFinancesMutations";
import { useGoalsMutations } from "./hooks/useGoalsMutations";
import { useGoalsQueries } from "./hooks/useGoalsQueries";
import Goals from "./sections/Goals";
import { AssetTable } from "./tables/AssetTable";
import { DataAssetGroup } from "./types";

export const kycAssetTypes = [
  AssetGroup.Banking,
  AssetGroup.Securities,
  AssetGroup.LifeInsuranceCapitalization,
  AssetGroup.RetirementEmployee,
  AssetGroup.Crowdfunding,
  AssetGroup.PrivateEquity,
  AssetGroup.Benefits,
  AssetGroup.RockPaper,
  AssetGroup.Exotic,
].map((value) => ({
  label: t(`asset_group.${value}`) as string,
  value,
}));

export default function Finance() {
  /* Hooks */
  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/kyc/finance",
  });
  const [selectedAssetsType, setSelectedAssetsType] = useState<AssetGroup[]>(
    []
  );
  const [isExpanded, setIsExpanded] = useState<string[]>([]);

  const { dataAssetGroups, isAssetGroupsQueryLoading, refetchAssetGroups } =
    useFinanceQueries(companyId, customerId);
  const { goalsData, isGoalsQueryLoading } = useGoalsQueries(
    companyId,
    customerId
  );
  const { goalsUpdate, isGoalsMutationsLoading } = useGoalsMutations(
    companyId,
    customerId
  );

  const {
    assetCreation,
    assetDelete,
    assetUpdate,
    isFinancesMutationsLoading,
  } = useFinancesMutations(companyId, customerId, refetchAssetGroups);

  const [assetGroups, setAssetGroups] = useState(dataAssetGroups);

  useEffect(() => {
    const newSelectedAssetsType: AssetGroup[] = [];
    if (dataAssetGroups && selectedAssetsType.length === 0) {
      dataAssetGroups.forEach((assetGroup) => {
        if (
          !newSelectedAssetsType.includes(assetGroup.group) &&
          kycAssetTypes.find((item) => item.value === assetGroup.group)
        ) {
          newSelectedAssetsType.push(assetGroup.group);
        }
      });
      setSelectedAssetsType(
        newSelectedAssetsType.sort((a, b) => {
          const indexA = kycAssetTypes.findIndex((item) => item.value === a);
          const indexB = kycAssetTypes.findIndex((item) => item.value === b);
          return indexA - indexB;
        })
      );
    }

    setAssetGroups(dataAssetGroups);
  }, [dataAssetGroups]);

  /* Helpers */
  const toggleAssetType = (assetType: AssetGroup) => {
    if (selectedAssetsType.includes(assetType)) {
      setSelectedAssetsType(selectedAssetsType.filter((i) => i !== assetType));
    } else {
      setSelectedAssetsType(
        [...selectedAssetsType, assetType].sort((a, b) => {
          const indexA = kycAssetTypes.findIndex((item) => item.value === a);
          const indexB = kycAssetTypes.findIndex((item) => item.value === b);
          return indexA - indexB;
        })
      );
    }
    toggleInExpanded(assetType);
  };

  const toggleInExpanded = (assetType: string) => {
    if (isExpanded.includes(assetType)) {
      setIsExpanded(isExpanded.filter((i) => i !== assetType));
    } else {
      setIsExpanded([...isExpanded, assetType]);
    }
  };

  if (isAssetGroupsQueryLoading || isGoalsQueryLoading) return <Loading />;

  return (
    <FinanceComponent
      assetGroups={assetGroups}
      selectedAssetsType={selectedAssetsType}
      toggleAssetType={toggleAssetType}
      toggleInExpanded={toggleInExpanded}
      isExpanded={isExpanded}
      assetCreation={assetCreation.mutate}
      assetDelete={assetDelete.mutate}
      assetUpdate={assetUpdate.mutate}
      isFinancesMutationsLoading={isFinancesMutationsLoading}
      isAssetGroupsQueryLoading={isAssetGroupsQueryLoading}
      goalsData={goalsData}
      goalsUpdate={goalsUpdate.mutate}
      isGoalsMutationsLoading={isGoalsMutationsLoading}
    />
  );
}

interface FinanceComponentProps {
  assetGroups: DataAssetGroup[];
  selectedAssetsType: AssetGroup[];
  toggleAssetType: (assetType: AssetGroup) => void;
  toggleInExpanded: (assetType: string) => void;
  isExpanded: string[];
  assetCreation: (data: {
    name?: string;
    type: AssetGroup;
    values: unknown;
    investments?: InvestmentValues[];
    isUnderManagement: boolean;
  }) => void;
  assetDelete: (id: string) => void;
  assetUpdate: (data: {
    assetId: string;
    name?: string;
    type: AssetGroup;
    values: unknown;
    investments?: InvestmentValues[];
    isUnderManagement: boolean;
  }) => void;
  isFinancesMutationsLoading: boolean;
  isAssetGroupsQueryLoading: boolean;
  goalsData?: CustomerConformityObjectivesQuery;
  goalsUpdate: (data: ObjectivesFormDataType) => void;
  isGoalsMutationsLoading: boolean;
}

export const FinanceComponent = ({
  assetGroups,
  selectedAssetsType,
  toggleAssetType,
  toggleInExpanded,
  isExpanded,
  assetCreation,
  assetDelete,
  assetUpdate,
  isFinancesMutationsLoading,
  isAssetGroupsQueryLoading,
  goalsData,
  goalsUpdate,
  isGoalsMutationsLoading,
}: FinanceComponentProps) => {
  return (
    <div className="min-h-screen bg-gray-100 w-[90%] mx-auto flex flex-col space-y-8">
      <div>
        <Text
          as="h3"
          className="font-bold text-blue-800 mb-4"
          label={t(`scenes.customers.kyc.formsTitle.finances`)}
        />
        <div className="flex flex-wrap gap-4">
          {kycAssetTypes.map((assetType) => (
            <div
              key={assetType.value}
              className="inline-flex items-center cursor-pointer"
              onClick={() => toggleAssetType(assetType.value)}
              data-testid={`finance-checkbox-${assetType.value}`}
            >
              <Checkbox
                id={assetType.label}
                checked={selectedAssetsType.includes(assetType.value)}
                className="border-[#04182B] bg-white rounded-md data-[state=checked]:bg-blue-800"
              />
              <Label className="ml-2 text-xs text-gray-700 cursor-pointer">
                {t(`asset_group.${assetType.value}`)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {assetGroups &&
        selectedAssetsType?.map((selectedAssetType: AssetGroup) => {
          const dataGroup = assetGroups?.find(
            (assetGroup) => assetGroup.group === selectedAssetType
          );
          return (
            <div
              key={selectedAssetType}
              className="form-section-collapsible"
              data-testid={`finance-section-${selectedAssetType}`}
            >
              <div
                className="cursor-pointer"
                onClick={() => toggleInExpanded(selectedAssetType)}
              >
                <div className="form-header-section-collapsible">
                  <div className="flex items-center gap-2">
                    <AssetIcon assetName={`asset_group.${selectedAssetType}`} />
                    <Text
                      as="h3"
                      className="font-bold text-blue-800"
                      label={t(`asset_group.${selectedAssetType}`)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {dataGroup && (
                      <Text
                        label={Intl.NumberFormat(undefined, {
                          ...globalAmountFormatting,
                          currency: "EUR",
                        }).format(dataGroup?.amount?.value)}
                        className="font-bold text-2xl text-grey-800"
                      />
                    )}

                    <ChevronDown
                      className={`chevron ${
                        isExpanded.includes(selectedAssetType)
                          ? ""
                          : "-rotate-180"
                      }`}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`transition-all duration-200 ${
                  isExpanded.includes(selectedAssetType)
                    ? "opacity-100 transition-all h-auto"
                    : "transition-all h-0 py-0 opacity-0 overflow-hidden"
                }`}
              >
                <div className="p-4">
                  {selectedAssetType === AssetGroup.Banking && (
                    <BankingForm
                      onSubmit={(data) =>
                        assetCreation({
                          type: selectedAssetType,
                          values: data,
                          isUnderManagement: data.isUnderManagement,
                        })
                      }
                      isLoading={
                        isAssetGroupsQueryLoading || isFinancesMutationsLoading
                      }
                    />
                  )}
                  {selectedAssetType === AssetGroup.Securities && (
                    <SecuritiesForm
                      onSubmit={(data) => {
                        assetCreation({
                          type: selectedAssetType,
                          values: {
                            ...data,
                            activity: {
                              value: data.transfersAmount,
                              instrument: "EUR",
                            },
                            metadata: {
                              transfersAmount: data.transfersAmount,
                            },
                          },
                          isUnderManagement: data.isUnderManagement,
                        });
                      }}
                      isLoading={
                        isAssetGroupsQueryLoading || isFinancesMutationsLoading
                      }
                    />
                  )}
                  {selectedAssetType ===
                    AssetGroup.LifeInsuranceCapitalization && (
                    <LifeInsuranceCapitalizationForm
                      onSubmit={(data) => {
                        assetCreation({
                          type: selectedAssetType,
                          values: {
                            ...data,
                            activity: {
                              value: data.transfersAmount,
                              instrument: "EUR",
                            },
                            metadata: {
                              insuranceCompany: data.insuranceCompany,
                              beneficiaryClause: data.beneficiaryClause,
                              transfersAmount: data.transfersAmount,
                              scheduledPaymentList: data.scheduledPaymentList,
                              scheduledPayment: data.scheduledPayment,
                              accountType: data.accountType,
                            },
                          },
                          isUnderManagement: data.isUnderManagement,
                        });
                      }}
                      isLoading={
                        isAssetGroupsQueryLoading || isFinancesMutationsLoading
                      }
                    />
                  )}
                  {selectedAssetType === AssetGroup.RetirementEmployee && (
                    <RetirementEmployeeForm
                      onSubmit={(data) => {
                        assetCreation({
                          type: selectedAssetType,
                          values: {
                            ...data,
                            activity: {
                              value: data.transfersAmount,
                              instrument: "EUR",
                            },
                            metadata: {
                              insuranceCompany: data.insuranceCompany,
                              beneficiaryClause: data.beneficiaryClause,
                              transfersAmount: data.transfersAmount,
                              scheduledPaymentList: data.scheduledPaymentList,
                              scheduledPayment: data.scheduledPayment,
                              accountType: data.accountType,
                            },
                          },
                          isUnderManagement: data.isUnderManagement,
                        });
                      }}
                      isLoading={
                        isAssetGroupsQueryLoading || isFinancesMutationsLoading
                      }
                    />
                  )}
                  {selectedAssetType === AssetGroup.Crowdfunding && (
                    <CrowdfundingForm
                      onSubmit={(data) => {
                        assetCreation({
                          type: selectedAssetType,
                          values: { ...data, comment: "" },
                          isUnderManagement: data.isUnderManagement,
                        });
                      }}
                      isLoading={
                        isAssetGroupsQueryLoading || isFinancesMutationsLoading
                      }
                    />
                  )}
                  {selectedAssetType === AssetGroup.PrivateEquity && (
                    <PrivateEquityForm
                      onSubmit={(data) => {
                        assetCreation({
                          type: selectedAssetType,
                          values: {
                            ...data,
                            activity: {
                              value: data.value,
                              instrument: data.currency,
                            },
                            metadata: {
                              establishment: {
                                name: data.name,
                              },
                              valuation: data.valuation,
                              ownership: data.ownership,
                              socialCapital: data.socialCapital,
                              unitPrice: data.unitPrice,
                              quantity: data.quantity,
                              opened: data.opened,
                            },
                          },
                          isUnderManagement: data.isUnderManagement,
                        });
                      }}
                      isLoading={
                        isAssetGroupsQueryLoading || isFinancesMutationsLoading
                      }
                    />
                  )}
                  {selectedAssetType === AssetGroup.Benefits && (
                    <BenefitsForm
                      onSubmit={(data) => {
                        assetCreation({
                          type: selectedAssetType,
                          values: {
                            ...data,
                            activity: {
                              value: 0,
                              instrument: "EUR",
                            },
                            metadata: {
                              insuranceCompany: data.insuranceCompany,
                              scheduledPaymentList: data.scheduledPaymentList,
                              scheduledPayment: data.scheduledPayment,
                              accountType: data.accountType,
                              guarantees: {
                                maintenance_salary: {
                                  isChecked: data.maintenanceSalaryIsChecked,
                                  label: data.maintenanceSalaryLabel,
                                },
                                maintenance_disability: {
                                  isChecked:
                                    data.maintenanceDisabilityIsChecked,
                                  label: data.maintenanceDisabilityLabel,
                                },
                                maintenance_death: {
                                  isChecked: data.maintenanceDeathIsChecked,
                                  label: data.maintenanceDeathLabel,
                                },
                              },
                              comment: "",
                            },
                          },
                          isUnderManagement: data.isUnderManagement,
                        });
                      }}
                      isLoading={
                        isAssetGroupsQueryLoading || isFinancesMutationsLoading
                      }
                    />
                  )}
                  {selectedAssetType === AssetGroup.RockPaper && (
                    <RockPaperForm
                      onSubmit={(data) => {
                        assetCreation({
                          type: selectedAssetType,
                          values: {
                            ...data,
                            activity: {
                              value: data.transfersAmount,
                              instrument: "EUR",
                            },
                            metadata: {
                              insuranceCompany: data.insuranceCompany,
                              transfersAmount: data.transfersAmount,
                              scheduledPaymentList: data.scheduledPaymentList,
                              scheduledPayment: data.scheduledPayment,
                              accountType: data.accountType,
                              comment: "",
                              fees: {},
                            },
                          },
                          isUnderManagement: data.isUnderManagement,
                        });
                      }}
                      isLoading={
                        isAssetGroupsQueryLoading || isFinancesMutationsLoading
                      }
                    />
                  )}
                  {selectedAssetType === AssetGroup.Exotic && (
                    <ExoticForm
                      onSubmit={(data) => {
                        assetCreation({
                          type: selectedAssetType,
                          values: data,
                          isUnderManagement: data.isUnderManagement,
                        });
                      }}
                      isLoading={
                        isAssetGroupsQueryLoading || isFinancesMutationsLoading
                      }
                    />
                  )}
                  {dataGroup && (
                    <AssetTable
                      assets={dataGroup.assets as CustomerAsset[]}
                      onDelete={assetDelete}
                      onUpdateAsset={(data, assetId, assetIsUnderManagement) =>
                        assetUpdate({
                          assetId,
                          type: selectedAssetType,
                          values: data,
                          isUnderManagement: assetIsUnderManagement,
                        })
                      }
                      currentAssetType={selectedAssetType}
                      isLoading={
                        isFinancesMutationsLoading || isAssetGroupsQueryLoading
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      <Goals
        defaultValues={goalsData?.customer?.conformityObjectives}
        isLoading={isGoalsMutationsLoading}
        goalsUpdate={goalsUpdate}
      />
    </div>
  );
};
