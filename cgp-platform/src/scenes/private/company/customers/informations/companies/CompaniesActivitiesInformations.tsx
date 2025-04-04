import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import {
  CompanyActivitiesSchema,
  companyActivitiesSchema,
} from "../../../../../../../shared/schemas/companyHolding";
import { Button } from "../../../../../../components";
import { useDebounce } from "../../../../../../hooks/useDebounce";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import { Customer } from "../../../../../../types";
import { SelectedBusiness } from "../informations";
import { CompanyCustomersInformationsLogic } from "../informations.logic";
import { ActivitiesForm } from "./holdingForm/activitiesForm";
import { SelectBusiness } from "./holdingForm/selectBusiness";

const defaultCompanyActivities: CompanyActivitiesSchema = {
  mainActivities: "",
  secondaryActivities: "",
  clients: "",
  suppliers: "",
  competitors: "",
};

type Props = {
  activities: CompanyActivitiesSchema;
  setSelectedBusiness: Dispatch<SetStateAction<SelectedBusiness | undefined>>;
  selectedBusiness: SelectedBusiness | undefined;
  displaySelectBusiness: boolean;
  businessList: Customer[];
  createCustomerFromBusiness: (input: {
    id: string;
    addToCustomerReference: boolean;
  }) => void;
};

export const CompaniesActivitiesInformations = (props: Props) => {
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/informations",
  });
  const toast = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const businessUpdate = useMutation(
    async (activities: CompanyActivitiesSchema) => {
      await gql.client.request(
        CompanyCustomersInformationsLogic.businessUpdate(),
        {
          companyID: params.companyId as string,
          id: props.selectedBusiness?.id ?? (params.customerId as string),
          activities: activities || defaultCompanyActivities,
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

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(companyActivitiesSchema),
    values: props.activities,
    // mode: "all",
  });

  const debouncedOnSubmit = useDebounce(
    () => handleSubmit((data) => businessUpdate.mutate(data))(),
    3000
  );

  const handleBlur = () => {
    debouncedOnSubmit();
  };

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
          <ActivitiesForm control={control} handleBlur={handleBlur} />
        </div>
      </form>
    </div>
  );
};
