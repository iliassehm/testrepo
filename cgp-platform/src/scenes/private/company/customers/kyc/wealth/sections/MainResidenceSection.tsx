import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Text } from "../../../../../../../components";
import { CustomerAsset } from "../../../../../../../types";
import MainResidenceForm from "../forms/MainResidenceForm";
import { RealEstateAssetData } from "../types";

interface MainResidenceSectionProps {
  isCustomerWealthQueryLoading: boolean;
  mainResidence: CustomerAsset | null;
  updateMainResidence: (data: RealEstateAssetData) => void;
  createMainResidence: (data: RealEstateAssetData) => void;
}

export default function MainResidenceSection({
  isCustomerWealthQueryLoading,
  mainResidence,
  updateMainResidence,
  createMainResidence,
}: MainResidenceSectionProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = (data: RealEstateAssetData) => {
    if (mainResidence?.id) {
      updateMainResidence(data);
    } else {
      createMainResidence(data);
    }
  };

  return (
    <div className="form-section-collapsible">
      <div className="cursor-pointer" onClick={handleHeaderClick}>
        <div className="form-header-section-collapsible">
          <Text
            as="h3"
            className="font-bold text-blue-800"
            label={t("scenes.customers.kyc.formsTitle.mainResidence")}
          />
          <ChevronDown
            className={`chevron ${isExpanded ? "" : "-rotate-180"}`}
          />
        </div>
      </div>

      <div
        className={`transition-all duration-200 ${
          isExpanded
            ? "opacity-100 transition-all h-auto"
            : "transition-all h-0 py-0 opacity-0 overflow-hidden"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <MainResidenceForm
          isLoading={isCustomerWealthQueryLoading}
          mainResidence={mainResidence}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
