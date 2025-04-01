import { useParams } from "@tanstack/react-router";
import { Button as PrimereacButton } from "primereact/button";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import { Button, Select, Text } from "../../../../../../../components";
import { DeleteWithConfirmationDialog } from "../../../../../../../helpers/dialog";
import { gql } from "../../../../../../../service/client";
import { Customer } from "../../../../../../../types";
import { AssetDetailLogic } from "../../../wealth/AssetDetail/assetDetail.logic";
import { SelectedBusiness } from "../../informations";
import { AddToCustomerReferenceModal } from "../../relation/AddToCustomerReferenceModal";

interface Props {
  selectedBusiness: SelectedBusiness | undefined;
  setSelectedBusiness: Dispatch<SetStateAction<SelectedBusiness | undefined>>;
  businessList: Customer[];
  isAddNewCompany?: boolean;
  setAddNewCompany?: Dispatch<SetStateAction<boolean>>;
  createCustomerFromBusiness: (input: {
    id: string;
    addToCustomerReference: boolean;
  }) => void;
  deleteBusiness?: (id: string[]) => void;
}

export function SelectBusiness(props: Props) {
  const [userToCreate, setUserToCreate] = useState<string>("");
  const { t } = useTranslation();

  const params = useParams({
    from: "/company/$companyId/customer/$customerId/informations",
  });

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
  return (
    <div className="flex w-full flex-col">
      {props.selectedBusiness !== null && (
        <div className="flex gap-2 items-center mb-9">
          <Text
            as="p"
            className="font-bold mr-2"
            label="scenes.customers.details.companies.choice"
          />
          <Select
            defaultValue={
              props.isAddNewCompany ? "" : props.selectedBusiness?.id
            }
            options={props.businessList.map((business) => ({
              label: business.name,
              value: business.id,
            }))}
            name="yearsOptions"
            onChange={(option) => {
              const business = props.businessList.find(
                (business) => business.id === option
              );
              if (business) {
                props.setSelectedBusiness({
                  id: business.id,
                  name: business.name,
                });
              }
              if (props.setAddNewCompany) {
                props.setAddNewCompany(false);
              }
            }}
            className="bg-blue-800 pl-1 pr-2 font-bold text-white"
          />
          {props.setAddNewCompany && (
            <PrimereacButton
              size="small"
              type="button"
              icon="pi pi-plus"
              className="rounded-full !w-5 !h-5 !p-0 bg-blue-800"
              onClick={() => {
                props.setSelectedBusiness(undefined);
                if (props.setAddNewCompany) {
                  props.setAddNewCompany(true);
                }
                document.getElementById("socialReason")?.focus();
              }}
            />
          )}
          {props.selectedBusiness?.id &&
            !usersInCustomerReferenceData?.users?.some(
              (user) => user.id === props.selectedBusiness?.id
            ) && (
              <>
                {props.deleteBusiness && (
                  <DeleteWithConfirmationDialog
                    buttonClassName="!py-1 !w-10"
                    text={false}
                    onClick={() => {
                      props.deleteBusiness?.([
                        props.selectedBusiness?.id as string,
                      ]);
                    }}
                  />
                )}
                <Button
                  label={
                    "scenes.customers.details.companies.createCompanySheet"
                  }
                  type="submit"
                  className="py-1 ml-4"
                  onClick={() =>
                    setUserToCreate(props.selectedBusiness?.id as string)
                  }
                />
              </>
            )}
        </div>
      )}
      <AddToCustomerReferenceModal
        visible={!!userToCreate}
        onConfirmation={(addToCustomerReference) => {
          !!userToCreate &&
            props.createCustomerFromBusiness({
              id: userToCreate,
              addToCustomerReference,
            });
          setUserToCreate("");
        }}
        onClose={() => setUserToCreate("")}
      />
    </div>
  );
}
