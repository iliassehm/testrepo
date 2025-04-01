import { useParams } from "@tanstack/react-router";

import { Loading } from "../../../../../../components";
import FamilySituationForm from "./forms/FamilySituationForm";
import MaritalSituationForm from "./forms/MaritalSituationForm";
import { useClientMutations } from "./hooks/useClientMutations";
import { useClientQueries } from "./hooks/useClientQueries";
import ChildrenSection from "./sections/ChildrenSection";
import GrandChildrenSection from "./sections/GrandChildrenSection";
import MaternalParentsSection from "./sections/MaternalParentsSection";
import PaternalParentsSection from "./sections/PaternalParentsSection";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import PersonalInfoSpouseSection from "./sections/PersonalInfoSpouseSection";

export default function Client() {
  // Hooks
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/kyc",
  });

  const {
    customerInfoData,
    isCustomerInfoQueryLoading,
    relationData,
    isRelationQueryLoading,
    refetchRelationData,
    spouse,
    refetchCustomerInfoData,
    isRelationQueryError,
    linkedRelationsData,
  } = useClientQueries(params.companyId, params.customerId);

  const { updateGeneralInformations, personalInfoMutationsLoading } =
    useClientMutations(
      params.companyId,
      params.customerId,
      refetchCustomerInfoData
    );

  if (
    isCustomerInfoQueryLoading ||
    isRelationQueryLoading ||
    !customerInfoData?.customer
  )
    return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100 w-[90%] mx-auto flex flex-col space-y-8 py-3">
      <PersonalInfoSection
        data={{
          ...customerInfoData?.customer?.informations?.general,
          ...customerInfoData?.customer?.informations?.details,
          usPerson:
            customerInfoData?.customer?.informations?.general.usPerson === true
              ? true
              : false,
        }}
        updateGeneralInformations={updateGeneralInformations.mutate}
        isLoading={personalInfoMutationsLoading || isCustomerInfoQueryLoading}
      />
      <FamilySituationForm
        familySituationValue={
          customerInfoData?.customer?.informations?.general.familySituation
        }
        onSubmit={(e) =>
          updateGeneralInformations.mutate({
            ...e,
            matrimonialRegime:
              customerInfoData?.customer?.informations?.general
                .matrimonialRegime,
          })
        }
      />

      {["married", "civilUnion", "cohabitation"].includes(
        customerInfoData?.customer?.informations?.general.familySituation
      ) && (
        <>
          <PersonalInfoSpouseSection
            spouse={spouse}
            isLoading={
              personalInfoMutationsLoading ||
              isCustomerInfoQueryLoading ||
              isRelationQueryLoading
            }
          />
          <MaritalSituationForm
            maritalSituationValue={
              customerInfoData?.customer?.informations?.general
                .matrimonialRegime ?? undefined
            }
            onSubmit={(e) =>
              updateGeneralInformations.mutate({
                ...e,
                familySituation:
                  customerInfoData?.customer?.informations?.general
                    .familySituation,
              })
            }
          />
        </>
      )}

      {!isRelationQueryError && (
        <>
          <ChildrenSection
            data={relationData?.list}
            refetchRelationData={refetchRelationData}
            linkedRelations={linkedRelationsData?.users}
          />
          <GrandChildrenSection
            data={relationData?.list}
            refetchRelationData={refetchRelationData}
            linkedRelations={linkedRelationsData?.users}
          />
          <MaternalParentsSection
            data={relationData?.list}
            refetchRelationData={refetchRelationData}
            linkedRelations={linkedRelationsData?.users}
          />
          <PaternalParentsSection
            data={relationData?.list}
            refetchRelationData={refetchRelationData}
            linkedRelations={linkedRelationsData?.users}
          />
        </>
      )}
    </div>
  );
}
