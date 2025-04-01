import { Loading } from "../../../../../../components";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import { AssetGroup } from "../../../../../../types";
import { useMainResidenceMutations } from "./hooks/useMainResidenceMutations";
import { useMainResidenceQueries } from "./hooks/useMainResidenceQueries";
import CustomerRealEstatesSection from "./sections/CustomerRealEstatesSection";
import LoansSection from "./sections/LoansSection";
import MainResidenceSection from "./sections/MainResidenceSection";

export default function Wealth() {
  // Hooks
  const route = useCurrentRoute();
  const params = route.params as Record<string, string>;

  const {
    isCustomerWealthQueryLoading,
    mainResidence,
    customerRealEstateAssets,
    customerHomeLoansAssets,
    setMainResidence,
    refetchCustomerWealth,
  } = useMainResidenceQueries(params.customerId, params.companyId);

  const { assetUpdateMutation, assetCreationMutation } =
    useMainResidenceMutations(
      params.customerId,
      params.companyId,
      refetchCustomerWealth,
      mainResidence,
      setMainResidence
    );

  if (isCustomerWealthQueryLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100 w-[90%] mx-auto flex flex-col space-y-8 py-3">
      <MainResidenceSection
        isCustomerWealthQueryLoading={
          isCustomerWealthQueryLoading ||
          assetCreationMutation.isLoading ||
          assetUpdateMutation.isLoading
        }
        mainResidence={mainResidence}
        updateMainResidence={assetUpdateMutation.mutate}
        createMainResidence={assetCreationMutation.mutate}
      />
      <LoansSection
        data={customerHomeLoansAssets}
        refetchCustomerWealth={refetchCustomerWealth}
        customerHeritageRealEstateAssets={customerRealEstateAssets.filter(
          (e) => e.group === AssetGroup.HeritageRealEstate
        )}
      />

      <CustomerRealEstatesSection
        data={customerRealEstateAssets}
        refetchCustomerWealth={refetchCustomerWealth}
        homeLoans={customerHomeLoansAssets}
      />
    </div>
  );
}
