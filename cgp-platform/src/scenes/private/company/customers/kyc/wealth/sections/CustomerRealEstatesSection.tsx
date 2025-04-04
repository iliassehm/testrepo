import { t } from "i18next";

import { AssetGroup, CustomerAsset } from "../../../../../../../types";
import CustomerRealEstateWrapper from "./CustomerRealEstateWrapper";

interface CustomerRealEstatesSectionProps {
  data?: CustomerAsset[];
  refetchCustomerWealth: () => void;
  homeLoans: CustomerAsset[];
}

export default function CustomerRealEstatesSection({
  data = [],
  refetchCustomerWealth,
  homeLoans,
}: CustomerRealEstatesSectionProps) {
  return (
    <>
      <CustomerRealEstateWrapper
        title={t("scenes.customers.kyc.formsTitle.heritageRealEstate")}
        data={data.filter((e) => e.group === AssetGroup.HeritageRealEstate)}
        currentGroup={AssetGroup.HeritageRealEstate}
        refetchCustomerWealth={refetchCustomerWealth}
        loans={homeLoans}
      />
      <CustomerRealEstateWrapper
        title={t("scenes.customers.kyc.formsTitle.professionalRealEstate")}
        data={data.filter((e) => e.group === AssetGroup.ProfessionalRealEstate)}
        currentGroup={AssetGroup.ProfessionalRealEstate}
        refetchCustomerWealth={refetchCustomerWealth}
      />
      <CustomerRealEstateWrapper
        title={t("scenes.customers.kyc.formsTitle.commercialRealEstate")}
        data={data.filter((e) => e.group === AssetGroup.CommercialRealEstate)}
        currentGroup={AssetGroup.CommercialRealEstate}
        refetchCustomerWealth={refetchCustomerWealth}
      />
    </>
  );
}
