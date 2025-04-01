import { useParams } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Dialog, Text } from "../../../../../../../components";
import { Label } from "../../../../../../../components/Label";
import { AssetGroup, CustomerAsset } from "../../../../../../../types";
import CustomerRealEstateAssetForm from "../forms/CustomerRealEstateAssetForm";
import { useCustomerRealEstateMutations } from "../hooks/useCustomerRealEstateMutations";
import { useCustomerRealEstateSectionState } from "../hooks/useCustomerRealEstateSectionState";
import { useLoanMutations } from "../hooks/useLoanMutations";
import LoanTable from "../tables/LoanTable";
import RealEstateTable from "../tables/RealEstateTable";

interface CustomerRealEstateWrapperProps {
  title: string;
  data: CustomerAsset[];
  currentGroup: AssetGroup;
  refetchCustomerWealth: () => void;
  loans?: CustomerAsset[];
}

export default function CustomerRealEstateWrapper({
  title,
  data,
  currentGroup,
  refetchCustomerWealth,
  loans,
}: CustomerRealEstateWrapperProps) {
  const { t } = useTranslation();
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/kyc",
  });
  const { state, setShowModal, toggleExpanded } =
    useCustomerRealEstateSectionState(data);
  const { assetUpdateMutation, assetCreationMutation, assetDelete } =
    useCustomerRealEstateMutations(
      params.customerId,
      params.companyId,
      refetchCustomerWealth
    );

  const { loanDelete, loanUpdate, mutationsLoading } = useLoanMutations(
    params.companyId,
    params.customerId,
    refetchCustomerWealth
  );

  return (
    <div className="form-section-collapsible">
      <Dialog
        header={<Label label="scenes.wealth.assetEdit" />}
        open={!!state.showModal}
        onOpenChange={() => setShowModal(null)}
        className="w-[70vw] overflow-visible"
      >
        <CustomerRealEstateAssetForm
          defaultValues={(state.showModal as CustomerAsset) || {}}
          onSubmit={assetUpdateMutation.mutate}
          isLoading={
            assetUpdateMutation.isLoading ||
            assetCreationMutation.isLoading ||
            assetDelete.isLoading
          }
          isUpdate
          currentGroup={currentGroup}
        />
      </Dialog>

      <div className="cursor-pointer" onClick={toggleExpanded}>
        <div className="form-header-section-collapsible">
          <div className="flex items-center gap-2">
            <Text as="h3" className="font-bold text-blue-800" label={title} />
          </div>
          <ChevronDown
            className={`chevron ${state.isExpanded ? "" : "-rotate-180"}`}
          />
        </div>
      </div>

      <div
        className={`transition-all duration-200 p-4 flex flex-col ${
          state.isExpanded
            ? "opacity-100 transition-all h-auto"
            : "transition-all h-0 py-0 opacity-0 overflow-hidden"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CustomerRealEstateAssetForm
          onSubmit={assetCreationMutation.mutate}
          isLoading={
            assetUpdateMutation.isLoading ||
            assetCreationMutation.isLoading ||
            assetDelete.isLoading
          }
          currentGroup={currentGroup}
        />

        <RealEstateTable
          assets={state.assets}
          setShowModal={setShowModal}
          onDelete={assetDelete.mutate}
          loans={loans}
        />
        {loans && loans.length > 0 && (
          <>
            <Text
              as="h3"
              className="font-bold text-blue-800 mt-4"
              label={t(`scenes.customers.kyc.formsTitle.loans_${currentGroup}`)}
            />
            <LoanTable
              assets={loans}
              customerHeritageRealEstateAssets={data}
              onDelete={loanDelete.mutate}
              onUpdateAsset={(data, assetId) =>
                loanUpdate.mutate({
                  assetId,
                  type: AssetGroup.HomeLoan,
                  values: data,
                })
              }
              isLoading={mutationsLoading}
            />
          </>
        )}
      </div>
    </div>
  );
}
