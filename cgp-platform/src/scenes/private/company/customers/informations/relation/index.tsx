import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import {
  CustomerRelationForm,
  CustomerRelationFormDataType,
} from "../../../../../../../shared/schemas/relation";
import { Dialog, Loading } from "../../../../../../components";
import { Label } from "../../../../../../components/Label";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { Customer } from "../../../../../../types";
import { AssetDetailLogic } from "../../wealth/AssetDetail/assetDetail.logic";
import { CompanyCustomersInformationsLogic } from "../informations.logic";
import { RelationForm } from "./relationForm";
import { RelationMember } from "./relationMember";

export function Relation() {
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/informations",
  });
  const toast = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<CustomerRelationForm | null>(null);

  const { data, isLoading } = useQuery(
    ["relation", params.companyId, params.customerId],
    () =>
      gql.client.request(CompanyCustomersInformationsLogic.relationQuery(), {
        companyID: params.companyId as string,
        customerID: params.customerId as string,
      }),
    {
      select: (data) => data?.customerRelation,
    }
  );

  const { data: usersInCustomerReferenceData } = useQuery(
    ["users_in_customer_reference", params.companyId, params.customerId],
    () =>
      gql.client.request<{ users: Customer[] }>(
        AssetDetailLogic.getUsersInCustomerReference(),
        {
          companyId: params.companyId,
          customerId: params.customerId,
        }
      )
  );

  const onSuccess = () => {
    if (showModal) setShowModal(null);

    queryClient.invalidateQueries([
      "relation",
      params.companyId,
      params.customerId,
    ]);
    queryClient.invalidateQueries([
      "users_in_customer_reference",
      params.companyId,
      params.customerId,
    ]);

    toast?.current?.show({
      severity: "success",
      summary: "Success",
      detail: t("forms.fields.notifications.success.save"),
    });
  };

  // Mutation
  const relationCreation = useMutation(
    (input: CustomerRelationForm) =>
      gql.client.request(
        CompanyCustomersInformationsLogic.customerRelations(),
        {
          companyID: params.companyId as string,
          id: params.customerId as string,
          input,
        }
      ),
    {
      onSuccess,
    }
  );
  const relationUpdate = useMutation(
    (input: CustomerRelationFormDataType) =>
      gql.client.request(CompanyCustomersInformationsLogic.relationUpdate(), {
        companyID: params.companyId as string,
        customerID: params.customerId as string,
        id: showModal?.id as string,
        input: input as unknown as CustomerRelationForm,
      }),
    {
      onSuccess: () => {
        setShowModal(null);
        onSuccess();
      },
    }
  );
  const relationDelete = useMutation(
    (id: string) =>
      gql.client.request(CompanyCustomersInformationsLogic.relationDelete(), {
        companyID: params.companyId as string,
        customerID: params.customerId as string,
        id,
      }),
    {
      onSuccess,
    }
  );
  const createUserFromRelation = useMutation(
    (input: { id: string; addToCustomerReference: boolean }) =>
      gql.client.request(
        CompanyCustomersInformationsLogic.createUserFromRelation(),
        {
          companyID: params.companyId as string,
          customerID: params.customerId as string,
          id: input.id,
          addToCustomerReference: input.addToCustomerReference,
        }
      ),
    {
      onSuccess: () => {
        onSuccess();
      },
    }
  );

  const unlinkFromCustomerReference = useMutation(
    (input: { id: string }) =>
      gql.client.request(
        CompanyCustomersInformationsLogic.unlinkFromCustomerReference(),
        {
          id: input.id,
          companyID: params.companyId as string,
        }
      ),
    {
      onSuccess: () => {
        onSuccess();
      },
    }
  );

  if (isLoading) return <Loading />;

  const relations = data?.list?.filter(
    (relation) => params.customerId !== relation.id
  );

  // Create merged relations with users in customer reference
  const mergedRelations = [
    ...(relations ?? []).filter(
      (dataItem) =>
        !usersInCustomerReferenceData?.users.some(
          (user) => user.id === dataItem.id
        )
    ),
    ...(usersInCustomerReferenceData?.users
      .filter((e) => e.id !== params.customerId)
      .map((e) => ({
        ...e,
        birthDate: new Date(),
        denomination: "",
        email: e.email ?? "",
        firstName: e.firstName ?? "",
        lastName: e.lastName ?? "",
        birthPlace: "",
        nationality: "",
        countryOfBirth: "",
        maritalStatus: "",
        phone: "",
      })) ?? []),
  ];

  return (
    <div className="flex flex-col gap-10">
      {(!!relations?.length ||
        (usersInCustomerReferenceData?.users &&
          usersInCustomerReferenceData?.users?.length > 1)) && (
        <div>
          <RelationMember
            data={relations ?? []}
            usersInCustomerReferenceData={usersInCustomerReferenceData?.users}
            onUpdate={setShowModal}
            onDelete={relationDelete.mutate}
            createUserFromRelation={createUserFromRelation.mutate}
            unlinkFromCustomerReference={unlinkFromCustomerReference.mutate}
          />
        </div>
      )}

      <RelationForm
        onSubmit={relationCreation.mutate}
        isLoading={relationCreation.isLoading}
      />

      <Dialog
        header={<Label label="scenes.company.settings.relation.updateModal" />}
        open={!!showModal}
        onOpenChange={() => setShowModal(null)}
        className="w-[70vw]"
      >
        <RelationForm
          defaultValues={(showModal as CustomerRelationForm) || {}}
          onSubmit={relationUpdate.mutate}
          isUpdate
          isLoading={relationCreation.isLoading}
        />
      </Dialog>
    </div>
  );
}
