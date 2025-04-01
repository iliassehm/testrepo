import { zodResolver } from "@hookform/resolvers/zod";
import {
  HoldingCompanyFormDataType,
  HoldingCompanyInfo,
  holdingCompanyInfoSchema,
} from "@shared-schemas/companyHolding";
import debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Button, Dialog } from "../../../../../../components";
import { Label } from "../../../../../../components/Label";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { Customer, Holding } from "../../../../../../types";
import { useCustomerContext } from "../../customerContext";
import { SelectedBusiness } from "../informations";
import { CompanyCustomersInformationsLogic } from "../informations.logic";
import { AddToHolding } from "./holdingForm/AddToHoldingForm";
import {
  HoldingCreationForm,
  HoldingCreationFormData,
} from "./holdingForm/holdingCreationForm";
import { InformationForm } from "./holdingForm/informationForm";
import { SelectBusiness } from "./holdingForm/selectBusiness";
import { HoldingList } from "./holdingList";

const defaultHoldingCompanyInfo: HoldingCompanyInfo = {
  socialReason: "",
  holdingId: "",
  siren: "",
  siret: "",
  ape: "",
  creationDate: new Date(),
  legalForm: "",
  socialCapital: 3000,
  headOfficeAddress: "",
  phone: "",
  email: "",
  managers: [],
  seniorAdvisor: "",
  secondaryAdvisor: "",
  entryDateIntoRelationship: undefined,
  originCustomerRelationship: "",
  remoteOpening: undefined,
  entryIntoRelationshipNote: "",
  dateLastMeeting: undefined,
  ownership: undefined,
  valuation: undefined,
};

type ModalAction = "create" | "addToHolding";

type CompaniesInformationsProps = {
  defaultValues: HoldingCompanyInfo;
  displaySelectBusiness: boolean;
  businessList: Customer[];
};

export const CompaniesInformations: React.FC<CompaniesInformationsProps> = ({
  defaultValues,
  displaySelectBusiness,
  businessList,
}) => {
  const [showModal, setShowModal] = useState<ModalAction | false>(false);
  const [isAddNewCompany, setIsAddNewCompany] = useState<boolean>(false);
  const [selectedBusiness, setSelectedBusiness] = useState<
    SelectedBusiness | undefined
  >(undefined);

  const { customerId, companyId } = useCustomerContext();

  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data, refetch } = useQuery(
    ["companyCustomersInformationsHolding", customerId],
    () =>
      gql.client.request(CompanyCustomersInformationsLogic.holdingListQuery(), {
        companyID: companyId,
        customerId: customerId,
      })
  );

  const businessCreateOrUpdate = useMutation(
    async (information: HoldingCompanyInfo) => {
      if (isAddNewCompany) {
        await gql.client.request(
          CompanyCustomersInformationsLogic.businessCreate(),
          {
            companyID: companyId,
            customerId: customerId,
            input: information || defaultHoldingCompanyInfo,
          }
        );
      } else {
        await gql.client.request(
          CompanyCustomersInformationsLogic.businessUpdate(),
          {
            companyID: companyId,
            id: selectedBusiness?.id ?? customerId,
            information: information || defaultHoldingCompanyInfo,
          }
        );
      }
    },
    {
      onSuccess: async () => {
        isAddNewCompany && setIsAddNewCompany(false);
        toast?.current?.show({
          severity: "success",
          summary: "Success",
          detail: t("forms.fields.notifications.success.save"),
        });
        await queryClient.invalidateQueries([
          "companyCustomersInformationsBusiness",
          companyId,
          customerId,
        ]);

        queryClient.invalidateQueries([
          "companyCustomersInformations",
          customerId,
        ]);
        queryClient.invalidateQueries([
          "layout_customer",
          companyId,
          customerId,
        ]);
        queryClient.invalidateQueries(["lcbForm", companyId, customerId]);
      },
      onError: () => {
        toast?.current?.show({
          severity: "error",
          summary: t("forms.fields.notifications.error.success"),
          detail: t("forms.fields.notifications.error.save"),
        });
      },
    }
  );

  const createCustomerFromBusiness = useMutation(
    (input: { id: string; addToCustomerReference: boolean }) =>
      gql.client.request(
        CompanyCustomersInformationsLogic.createCustomerFromBusiness(),
        {
          companyID: companyId as string,
          customerID: customerId as string,
          businessID: input.id,
          addToCustomerReference: input.addToCustomerReference,
        }
      ),
    {
      onSuccess: () => {
        onSuccess();
      },
    }
  );

  const deleteBusiness = useMutation(
    (IDs: string[]) =>
      gql.client.request(CompanyCustomersInformationsLogic.businessDeletion(), {
        companyID: companyId as string,
        IDs,
      }),
    {
      onSuccess,
    }
  );

  const form = useForm({
    resolver: zodResolver(holdingCompanyInfoSchema),
    values: isAddNewCompany ? defaultHoldingCompanyInfo : defaultValues,
  });

  const holdingListQueryKey = [
    "companyCustomersInformations",
    companyId,
    customerId,
  ];

  function onSuccess() {
    queryClient.invalidateQueries(holdingListQueryKey);

    if (showModal) setShowModal(false);

    toast?.current?.show({
      severity: "success",
      summary: "Success",
      detail: t("forms.fields.notifications.success.save"),
    });

    queryClient.invalidateQueries("layout_customer");

    queryClient.invalidateQueries([
      "companyCustomersInformationsBusiness",
      companyId,
      customerId,
    ]);
  }

  function onError() {
    toast?.current?.show({
      severity: "error",
      summary: t("forms.fields.notifications.error.success"),
      detail: t("forms.fields.notifications.error.save"),
    });
  }

  // Mutations
  const holdingUpdate = useMutation(
    (data: HoldingCompanyFormDataType) =>
      gql.client.request(CompanyCustomersInformationsLogic.holdingUpdate(), {
        id: "holdingId",
        name: "holdingName",
        input: data,
        companyID: companyId,
      }),
    {
      onSuccess,
      onError,
    }
  );

  const holdingCreation = useMutation(
    (input: HoldingCreationFormData) =>
      gql.client.request(CompanyCustomersInformationsLogic.holdingCreation(), {
        companyID: companyId,
        customerId: customerId,
        name: input.name,
        input: input,
      }),
    {
      onSuccess,
      onError,
    }
  );

  const assignHoldingsToCompany = useMutation(
    (holdingIds: Holding["id"][]) =>
      gql.client.request(
        CompanyCustomersInformationsLogic.assignHoldingsToBusiness(),
        {
          companyID: companyId,
          customerId: customerId,
          businessID: selectedBusiness?.id ?? customerId,
          holdingIds,
        }
      ),
    {
      onSuccess,
      onError,
    }
  );

  const defaultHoldings = data?.holdingList
    ? data?.holdingList.filter((holding) =>
        holding.companies.find((company) => company.id === selectedBusiness?.id)
      )
    : [];

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    form.handleSubmit((data) => {
      businessCreateOrUpdate.mutate(data);
    })();
  };

  const debounceSubmit = debounce(onSubmit, 3000);

  useEffect(() => {
    const watchSubscription = form.watch(() => {
      debounceSubmit();
    });

    return () => {
      watchSubscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="flex flex-col pb-10">
        {displaySelectBusiness && (
          <SelectBusiness
            isAddNewCompany={isAddNewCompany}
            selectedBusiness={selectedBusiness}
            setSelectedBusiness={setSelectedBusiness}
            businessList={businessList}
            setAddNewCompany={setIsAddNewCompany}
            createCustomerFromBusiness={createCustomerFromBusiness.mutate}
            deleteBusiness={deleteBusiness.mutate}
          />
        )}
        <FormProvider {...form}>
          <form className="flex w-full flex-col" onSubmit={onSubmit}>
            <Button
              label={
                isAddNewCompany
                  ? "forms.fields.actions.save"
                  : "forms.fields.actions.update"
              }
              type="submit"
              className="absolute top-0 right-0 flex w-fit self-end"
              loading={holdingUpdate.isLoading}
            />
            <div className="flex w-full flex-col gap-y-10 gap-x-20">
              <InformationForm displaySelectBusiness={displaySelectBusiness} />
            </div>
          </form>
        </FormProvider>

        {data?.holdingList != null && (
          <>
            {/* Actions  */}
            <div className="flex justify-center gap-10 mt-10">
              {!!data?.holdingList.length && !!businessList?.length && (
                <Button
                  label="forms.fields.actions.addToHolding"
                  onClick={() => setShowModal("addToHolding")}
                  className="py-1"
                />
              )}
              <Button
                variant="bordered"
                label="forms.fields.actions.createHolding"
                onClick={() => setShowModal("create")}
                className="py-1 border"
              />
            </div>

            {/* Company Creation Modal  */}
            <Dialog
              header={
                <Label label="scenes.customers.details.companies.holdingCreation" />
              }
              open={showModal === "create"}
              onOpenChange={() => setShowModal(false)}
            >
              <HoldingCreationForm onSubmit={holdingCreation.mutate} />
            </Dialog>

            {/* Holding selection Modal  */}
            <Dialog
              header={
                <Label label="scenes.customers.details.companies.addToHolding" />
              }
              open={showModal === "addToHolding"}
              onOpenChange={() => setShowModal(false)}
            >
              <AddToHolding
                data={data?.holdingList}
                defaultSelected={defaultHoldings.map((holding) => holding.id)}
                onSubmit={assignHoldingsToCompany.mutate}
              />
            </Dialog>
          </>
        )}
      </div>
      <HoldingList
        data={data?.holdingList ?? []}
        refetchHolding={() => {
          refetch();
        }}
      />
    </>
  );
};
