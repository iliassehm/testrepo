import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Text } from "../../../../../../../components";
import PersonalInfoForm from "../forms/PersonalInfoForm";
import { PersonalInfoFormData } from "../types";

interface PersonalInfoSectionProps {
  data?: PersonalInfoFormData;
  updateGeneralInformations: (data: PersonalInfoFormData) => void;
  isLoading: boolean;
}

export default function PersonalInfoSection({
  data = {},
  isLoading,
  updateGeneralInformations,
}: PersonalInfoSectionProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="form-section-collapsible">
      <div className="cursor-pointer" onClick={handleHeaderClick}>
        <div className="form-header-section-collapsible">
          <Text
            as="h3"
            className="font-bold text-blue-800"
            label={t("scenes.customers.kyc.formsTitle.personalInformations")}
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
        <PersonalInfoForm
          data={data}
          onSubmit={updateGeneralInformations}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
