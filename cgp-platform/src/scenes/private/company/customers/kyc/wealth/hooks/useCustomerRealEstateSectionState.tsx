import { useState } from "react";

import { CustomerAsset } from "../../../../../../../types";
import { CustomerRealEstateSectionState } from "../types";

export function useCustomerRealEstateSectionState(data: CustomerAsset[] = []) {
  const [showModal, setShowModal] = useState<CustomerAsset | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const state: CustomerRealEstateSectionState = {
    assets: data,
    showModal,
    isExpanded,
  };

  return {
    state,
    setShowModal,
    toggleExpanded,
  };
}
