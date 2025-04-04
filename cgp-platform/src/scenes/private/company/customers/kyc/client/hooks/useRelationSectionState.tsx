import { useState } from "react";

import { CustomerRelationForm } from "../../../../../../../../shared/schemas/relation";
import { Customer } from "../../../../../../../types";
import { SectionState } from "../types";

export function useRelationSectionState(
  data: CustomerRelationForm[] = [],
  linkedRelations: Customer[] = []
) {
  const [showEditModal, setShowEditModal] =
    useState<CustomerRelationForm | null>(null);
  const [openExistingCustomer, setOpenExistingCustomer] =
    useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const state: SectionState = {
    relations: data,
    linkedRelations,
    showEditModal,
    isExpanded,
  };

  return {
    state,
    setShowEditModal,
    openExistingCustomer,
    setOpenExistingCustomer,
    toggleExpanded,
  };
}
