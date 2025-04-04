import { useParams } from "@tanstack/react-router";
import { t } from "i18next";

import { CustomerRelationForm } from "../../../../../../../../shared/schemas/relation";
import { Customer } from "../../../../../../../types";
import { useRelationMutations } from "../hooks/useRelationMutations";
import { useRelationSectionState } from "../hooks/useRelationSectionState";
import RelationSectionWrapper from "./RelationSectionWrapper";

interface GrandChildrenSectionProps {
  data?: CustomerRelationForm[];
  refetchRelationData: () => void;
  linkedRelations?: Customer[];
}

export default function GrandChildrenSection({
  data = [],
  refetchRelationData,
  linkedRelations,
}: GrandChildrenSectionProps) {
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/kyc",
  });
  const {
    state,
    setShowEditModal,
    openExistingCustomer,
    setOpenExistingCustomer,
    toggleExpanded,
  } = useRelationSectionState(data, linkedRelations);

  const {
    relationCreation,
    relationDelete,
    relationUpdate,
    unlinkFromCustomerReference,
    createUserFromRelation,
  } = useRelationMutations(
    params.companyId,
    params.customerId,
    refetchRelationData,
    state.showEditModal,
    () => setShowEditModal(null)
  );

  return (
    <RelationSectionWrapper
      title={t("scenes.customers.kyc.formsTitle.grandChildrens")}
      sectionName="grandChildrens"
      state={state}
      onToggleExpanded={toggleExpanded}
      onShowEditModal={setShowEditModal}
      openExistingCustomer={openExistingCustomer}
      setOpenExistingCustomer={setOpenExistingCustomer}
      onSubmit={
        state.showEditModal ? relationUpdate.mutate : relationCreation.mutate
      }
      onDelete={relationDelete.mutate}
      unlinkFromCustomerReference={unlinkFromCustomerReference.mutate}
      createUserFromRelation={createUserFromRelation.mutate}
      isLoading={
        relationCreation.isLoading ||
        relationDelete.isLoading ||
        relationUpdate.isLoading
      }
    />
  );
}
