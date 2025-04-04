import { useParams } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CustomerRelationForm } from "../../../../../../../../shared/schemas/relation";
import { Text } from "../../../../../../../components";
import PersonalInfoSpouseForm from "../forms/PersonalInfoSpouseForm";
import { useRelationMutations } from "../hooks/useRelationMutations";

interface PersonalInfoSpouseSectionProps {
  spouse: CustomerRelationForm | null;
  isLoading: boolean;
}

export default function PersonalInfoSpouseSection({
  spouse,
  isLoading,
}: PersonalInfoSpouseSectionProps) {
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/kyc",
  });
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const { relationCreation, relationUpdate } = useRelationMutations(
    params.companyId,
    params.customerId,
    undefined,
    undefined,
    undefined,
    spouse
  );

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
            label={t(
              "scenes.customers.kyc.formsTitle.personalInformationsSpouse"
            )}
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
        <PersonalInfoSpouseForm
          defaultValues={spouse ?? undefined}
          onSubmit={spouse ? relationUpdate.mutate : relationCreation.mutate}
          isLoading={
            isLoading || relationCreation.isLoading || relationUpdate.isLoading
          }
        />
      </div>
    </div>
  );
}
