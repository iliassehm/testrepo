import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import { Dispatch, SetStateAction, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import {
  HoldingManagerSchema,
  holdingManagerSchema,
  NbHoldingManagerSchema,
} from "../../../../../../../shared/schemas/companyHolding";
import { Button, Dialog, Loading } from "../../../../../../components";
import { useDebounce } from "../../../../../../hooks/useDebounce";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { Customer } from "../../../../../../types";
import { CustomersConformityLogic } from "../../conformity/conformity.logic";
import { DocumentGedSelection } from "../../conformity/conformityCreation/UploadStep";
import { SelectedBusiness } from "../informations";
import { CompanyCustomersInformationsLogic } from "../informations.logic";
import { ManagerForm } from "./holdingForm/managerForm";
// import { NbManagerForm } from "./holdingForm/nbManagerForm";
import { SelectBusiness } from "./holdingForm/selectBusiness";

const defaultHoldingManager: HoldingManagerSchema = {
  function: "",
  lastNameFirstName: "",
  birthDate: undefined,
  nationality: "",
  personalAddress: "",
  personalPhoneNumber: "",
  personalEmailAddress: "",
  shareholderInformation: "",
};

type Props = {
  managers: HoldingManagerSchema;
  nbManager: NbHoldingManagerSchema;
  setSelectedBusiness: Dispatch<SetStateAction<SelectedBusiness | undefined>>;
  selectedBusiness: SelectedBusiness | undefined;
  displaySelectBusiness: boolean;
  businessList: Customer[];
  createCustomerFromBusiness: (input: {
    id: string;
    addToCustomerReference: boolean;
  }) => void;
};

export const CompaniesManagersInformations = (props: Props) => {
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/informations",
  });
  const toast = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showDialogDocumentAdd, setShowDialogDocumentAdd] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const { handleSubmit, control, setValue, getValues, resetField } = useForm({
    resolver: zodResolver(holdingManagerSchema),
    values: {
      ...props.managers,
      birthDate: props.managers?.birthDate || undefined,
    },
    // mode: "all",
  });

  // Queries
  const { isLoading } = useQuery(
    ["companyCustomersInformations", params.companyId, params.customerId],
    () =>
      gql.client.request(CompanyCustomersInformationsLogic.holdingQueries(), {
        companyID: params.companyId as string,
        customerId: params.customerId as string,
      })
  );

  const businessUpdate = useMutation(
    async (managers: HoldingManagerSchema) => {
      await gql.client.request(
        CompanyCustomersInformationsLogic.businessUpdate(),
        {
          companyID: params.companyId as string,
          id: props.selectedBusiness?.id ?? (params.customerId as string),
          managers: managers || defaultHoldingManager,
        }
      );
    },
    {
      onSuccess: async () => {
        toast?.current?.show({
          severity: "success",
          summary: "Success",
          detail: t("forms.fields.notifications.success.save"),
        });
        await queryClient.invalidateQueries([
          "companyCustomersInformationsBusiness",
          params.companyId,
          params.customerId,
        ]);
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

  const idCardDocument = useQuery(
    "getDocument",
    () =>
      gql.client.request(CustomersConformityLogic.getDocument(), {
        companyID: params.companyId as string,
        customerID: params.customerId as string,
        id: getValues().idCard as string,
      }),
    { enabled: !!getValues().idCard, cacheTime: 0 }
  );

  const debouncedOnSubmit = useDebounce(
    () => handleSubmit((data) => businessUpdate.mutate(data))(),
    3000
  );

  const handleBlur = () => {
    debouncedOnSubmit();
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col pb-10">
      {props.displaySelectBusiness && (
        <SelectBusiness
          selectedBusiness={props.selectedBusiness}
          setSelectedBusiness={props.setSelectedBusiness}
          businessList={props.businessList}
          createCustomerFromBusiness={props.createCustomerFromBusiness}
        />
      )}
      <form
        className="flex w-full flex-col"
        onSubmit={handleSubmit((data) => businessUpdate.mutate(data))}
      >
        <Button
          label="forms.fields.actions.save"
          type="submit"
          className="absolute top-0 right-0 flex w-fit self-end"
        />
        <div className="flex w-full flex-col gap-y-10 gap-x-20">
          <ManagerForm
            control={control as Control<HoldingManagerSchema>}
            setShowDialogDocumentAdd={setShowDialogDocumentAdd}
            documentLoading={idCardDocument.isLoading}
            documentName={idCardDocument?.data?.document?.name}
            documentURL={
              idCardDocument?.data?.document?.url as string | undefined
            }
            onRemoveDocument={() => {
              idCardDocument.remove();
              resetField("idCard");
              setValue("idCard", undefined);
              handleBlur();
            }}
            handleBlur={handleBlur}
          />
          {/* <NbManagerForm control={control} nb={2} /> */}
        </div>
      </form>

      <Dialog
        open={showDialogDocumentAdd}
        onOpenChange={() => {
          setSelectedDocuments([]);
          setShowDialogDocumentAdd(false);
        }}
        className="flex flex-col gap-4 align-center justify-center"
      >
        <DocumentGedSelection
          selectedGedDocuments={selectedDocuments}
          setSelectedGedDocuments={setSelectedDocuments}
          envelopeFilter={false}
        />
        <Button
          label="actions.save"
          onClick={() => {
            if (selectedDocuments.length > 0) {
              setValue("idCard", selectedDocuments[0]);
            }
            setSelectedDocuments([]);
            setShowDialogDocumentAdd(false);
            handleBlur();
          }}
          className="w-full"
        />
      </Dialog>
    </div>
  );
};
