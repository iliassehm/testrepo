import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CustomerRelationForm } from "../../../../../../../../shared/schemas/relation";
import { Button, Dialog, Text } from "../../../../../../../components";
import { Label } from "../../../../../../../components/Label";
import { Customer } from "../../../../../../../types";
import { AddToCustomerReferenceModal } from "../../../informations/relation/AddToCustomerReferenceModal";
import { ExistingCustomerModal } from "../../../informations/relation/ExistingCustomerModal";
import RelationForm from "../forms/RelationForm";
import RelationTable from "../tables/RelationTable";
import { SectionState } from "../types";

interface RelationSectionWrapperProps {
  title: string;
  sectionName: string;
  state: SectionState;
  onToggleExpanded: () => void;
  onShowEditModal: (relation: CustomerRelationForm | null) => void;
  openExistingCustomer: boolean;
  setOpenExistingCustomer: (value: boolean) => void;
  onSubmit: (data: CustomerRelationForm) => void;
  onDelete: (id: string) => void;
  unlinkFromCustomerReference: (input: { id: string }) => void;
  createUserFromRelation: (input: {
    id: string;
    addToCustomerReference: boolean;
  }) => void;
  isLoading: boolean;
}

export default function RelationSectionWrapper({
  title,
  sectionName,
  state,
  onToggleExpanded,
  onShowEditModal,
  openExistingCustomer,
  setOpenExistingCustomer,
  onSubmit,
  onDelete,
  unlinkFromCustomerReference,
  createUserFromRelation,
  isLoading,
}: RelationSectionWrapperProps) {
  const { t } = useTranslation();
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/kyc",
  });
  const navigate = useNavigate({
    from: "/company/$companyId/customer/$customerId/kyc",
  });

  const [userToCreate, setUserToCreate] = useState<string>();

  const getFilterRelations = () => {
    switch (sectionName) {
      case "childrens":
        return ["childOf", "sonOf", "daughterOf"];
      case "grandChildrens":
        return ["hasGrandmother", "hasGrandfather"];
      case "maternalParents":
        return ["hasMaternalParent"];
      case "paternalParents":
        return ["hasPaternalParent"];
      default:
        return [];
    }
  };

  const filterRelations = getFilterRelations();

  const onSuccessfulSubmit = (customer: Customer) =>
    onShowEditModal({
      id: customer.id,
      denomination: "",
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      email: customer.email ?? "",
      birthDate: customer.informations?.general?.birthDate
        ? customer.informations?.general?.birthDate
        : new Date(),
      birthPlace: customer.informations?.general?.birthCity
        ? customer.informations?.general?.birthCity
        : "",
      nationality: customer.informations?.general?.nationality
        ? customer.informations?.general?.nationality
        : "",
      countryOfBirth: customer.informations?.general?.country
        ? customer.informations?.general?.country
        : "",
      maritalStatus: customer.informations?.general?.familySituation
        ? customer.informations?.general?.familySituation
        : "",
      phone: customer.informations?.details?.firstPhoneNumber
        ? customer.informations?.details?.firstPhoneNumber
        : "",
    });

  return (
    <div className="form-section-collapsible">
      <Dialog
        header={<Label label="scenes.company.settings.relation.updateModal" />}
        open={!!state.showEditModal}
        onOpenChange={() => onShowEditModal(null)}
        className="w-[70vw] overflow-visible"
      >
        <>
          {!state.linkedRelations.some(
            (lr) => lr.id === state.showEditModal?.id
          ) ? (
            <div className="flex items-center">
              <Button
                label={"scenes.customers.details.companies.createCustomerSheet"}
                type="submit"
                className="py-1"
                onClick={() => setUserToCreate(state.showEditModal?.id ?? "")}
              />
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              <Button
                label={"scenes.customers.details.companies.seeCustomerSheet"}
                type="submit"
                className="py-1"
                size="small"
                onClick={async () => {
                  await navigate({
                    to: "/company/$companyId/customer/$customerId",
                    params: {
                      companyId: params.companyId,
                      customerId: state.showEditModal?.id,
                    },
                  });
                }}
              />
              <Button
                label={"scenes.customers.details.companies.unlinkSheet"}
                type="submit"
                className="py-1"
                size="small"
                onClick={() => {
                  unlinkFromCustomerReference({
                    id: state.showEditModal?.id ?? "",
                  });
                }}
              />
            </div>
          )}

          <RelationForm
            sectionName={sectionName}
            defaultValues={(state.showEditModal as CustomerRelationForm) || {}}
            onSubmit={onSubmit}
            isLoading={isLoading}
            isUpdate
          />
        </>
      </Dialog>
      <ExistingCustomerModal
        open={openExistingCustomer}
        setOpen={() => setOpenExistingCustomer(!openExistingCustomer)}
        t={t}
        onSuccessfulSubmit={(customer: Customer | null) => {
          if (customer) onSuccessfulSubmit(customer);
        }}
      />
      <AddToCustomerReferenceModal
        visible={!!userToCreate}
        onConfirmation={(addToCustomerReference) => {
          !!userToCreate &&
            createUserFromRelation({
              id: userToCreate,
              addToCustomerReference,
            });
          setUserToCreate(undefined);
        }}
        onClose={() => setUserToCreate(undefined)}
      />
      <div className="cursor-pointer" onClick={onToggleExpanded}>
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
        className={`transition-all duration-200 p-4 ${
          state.isExpanded
            ? "opacity-100 transition-all h-auto"
            : "transition-all h-0 py-0 opacity-0 overflow-hidden"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          className="py-1 my-2"
          label={t("scenes.customers.details.companies.linkExistingCustomer")}
          onClick={() => setOpenExistingCustomer(true)}
        />
        <RelationForm
          sectionName={sectionName}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />

        <RelationTable
          relations={state.relations.filter((relation) =>
            filterRelations.includes(relation.denomination)
          )}
          linkedRelations={state.linkedRelations}
          setShowEditModal={onShowEditModal}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
