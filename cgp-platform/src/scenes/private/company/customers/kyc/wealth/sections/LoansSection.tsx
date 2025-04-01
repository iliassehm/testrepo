import { t } from "i18next";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { AssetIcon, Text } from "../../../../../../../components";
import { useCurrentRoute } from "../../../../../../../hooks/useCurrentRoute";
import { AssetGroup, CustomerAsset } from "../../../../../../../types";
import LoanForm from "../forms/LoanForm";
import { useLoanMutations } from "../hooks/useLoanMutations";
import LoanTable from "../tables/LoanTable";

interface LoansSectionProps {
  data: CustomerAsset[];
  refetchCustomerWealth: () => void;
  customerHeritageRealEstateAssets: CustomerAsset[];
}

export default function LoansSection({
  data,
  refetchCustomerWealth,
  customerHeritageRealEstateAssets,
}: LoansSectionProps) {
  const [isExpanded, setIsExpanded] = useState<string[]>([]);
  const route = useCurrentRoute();
  const params = route.params as Record<string, string>;

  const { loanCreation, loanDelete, loanUpdate, mutationsLoading } =
    useLoanMutations(
      params.companyId,
      params.customerId,
      refetchCustomerWealth
    );

  const toggleInExpanded = (formTitle: string) => {
    if (isExpanded.includes(formTitle)) {
      setIsExpanded(isExpanded.filter((i) => i !== formTitle));
    } else {
      setIsExpanded([...isExpanded, formTitle]);
    }
  };

  return (
    <>
      {isExpanded.length > 0 && (
        <Text
          as="h3"
          className="font-bold text-blue-800 mb-4"
          label={t("scenes.customers.kyc.formsTitle.loans")}
        />
      )}

      <div className="form-section-collapsible">
        <div
          className="cursor-pointer"
          onClick={() => toggleInExpanded("currentLoans")}
        >
          <div className="form-header-section-collapsible">
            <div className="flex items-center gap-2">
              <AssetIcon assetName={`asset_group.home_loan`} />
              <Text
                as="h3"
                className="font-bold text-blue-800"
                label={t(`scenes.customers.kyc.formsTitle.currentLoans`)}
              />
            </div>
            <ChevronDown
              className={`chevron ${
                isExpanded.includes("currentLoans") ? "" : "-rotate-180"
              }`}
            />
          </div>
        </div>

        <div
          className={`transition-all duration-200 ${
            isExpanded.includes("currentLoans")
              ? "opacity-100 transition-all h-auto"
              : "transition-all h-0 py-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="p-4">
            <LoanForm
              onSubmit={(data) =>
                loanCreation.mutate({
                  type: AssetGroup.HomeLoan,
                  values: { ...data, comment: "", settledLoan: false },
                })
              }
              isLoading={mutationsLoading}
              customerHeritageRealEstateAssets={
                customerHeritageRealEstateAssets
              }
            />

            {data.filter((e) => e.metadata?.settledLoan === false).length >
              0 && (
              <LoanTable
                assets={data.filter((e) => e.metadata?.settledLoan === false)}
                customerHeritageRealEstateAssets={
                  customerHeritageRealEstateAssets
                }
                onDelete={loanDelete.mutate}
                onUpdateAsset={(data, assetId) =>
                  loanUpdate.mutate({
                    assetId,
                    type: AssetGroup.HomeLoan,
                    values: data,
                  })
                }
                isLoanSettled={false}
                isLoading={mutationsLoading}
              />
            )}
          </div>
        </div>
      </div>
      <div className="form-section-collapsible">
        <div
          className="cursor-pointer"
          onClick={() => toggleInExpanded("settledLoans")}
        >
          <div className="form-header-section-collapsible">
            <div className="flex items-center gap-2">
              <AssetIcon assetName={`asset_group.home_loan`} />
              <Text
                as="h3"
                className="font-bold text-blue-800"
                label={t(`scenes.customers.kyc.formsTitle.settledLoans`)}
              />
            </div>
            <ChevronDown
              className={`chevron ${
                isExpanded.includes("settledLoans") ? "" : "-rotate-180"
              }`}
            />
          </div>
        </div>

        <div
          className={`transition-all duration-200 ${
            isExpanded.includes("settledLoans")
              ? "opacity-100 transition-all h-auto"
              : "transition-all h-0 py-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="p-4">
            <LoanForm
              onSubmit={(data) =>
                loanCreation.mutate({
                  type: AssetGroup.HomeLoan,
                  values: { ...data, comment: "", settledLoan: true },
                })
              }
              isLoading={mutationsLoading}
              customerHeritageRealEstateAssets={
                customerHeritageRealEstateAssets
              }
            />

            {data.filter((e) => e.metadata?.settledLoan === true).length >
              0 && (
              <LoanTable
                assets={data.filter((e) => e.metadata?.settledLoan === true)}
                customerHeritageRealEstateAssets={
                  customerHeritageRealEstateAssets
                }
                onDelete={loanDelete.mutate}
                onUpdateAsset={(data, assetId) =>
                  loanUpdate.mutate({
                    assetId,
                    type: AssetGroup.HomeLoan,
                    values: data,
                  })
                }
                isLoanSettled={true}
                isLoading={mutationsLoading}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
