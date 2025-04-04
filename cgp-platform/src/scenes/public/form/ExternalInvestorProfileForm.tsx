import { useParams,  } from "@tanstack/react-router";
import i18next from "i18next";
import { ConfirmDialog,  } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useMutation, useQuery } from "react-query";

import { Text } from "../../../components";
import { useToast } from "../../../hooks/useToast";
import { gql } from "../../../service/client";
import {
  InvestorProfileForm,
  investorProfileVersionList,
} from "../../private/company/customers/conformity/investorProfileForm/investorProfileForm";
import { PublicForm } from "./form.logic";
import { publicCustomerExternalInvestorProfileFormFormScene } from "./route";
import { newProfileInvestSchema, type InvestorProfileFormInputs } from "../../../../shared/schemas/investorProfileFormSchema";

export const ExternalInvestorProfileForm = () => {
  // Hooks
  const toast = useToast();

  const { customerId } = useParams({
    from: publicCustomerExternalInvestorProfileFormFormScene.id,
  });

  // Query
  const queryKey = ["ExternalInvestorProfileForm", customerId];
  const { data, isLoading } = useQuery(queryKey, () =>
    gql.client.request(PublicForm.getExternalInvestorProfileForm(), {
      customerID: customerId,
    })
  );

  // Mutation

  const { mutate: onInvestorProfileFormSubmit, ...mutationRest } = useMutation(
    (data: {
      input: InvestorProfileFormInputs;
    }) =>
      gql.client.request(PublicForm.submitExternalInvestorProfileForm(), {
        customerID: customerId as string,
        input: data.input,
      }),
    {
      onSuccess: () => {
        // Show toast
        toast.current?.show({
          severity: "success",
          detail: i18next.t("forms.fields.notifications.success.send"),
        });

        // Redirect to B2C
        const timeout = setTimeout(() => {
          window.history.back()

          clearTimeout(timeout);
        }, 1000);
      },
    }
  );

  const partialSchema = newProfileInvestSchema.partial();
  const investorProfileForm = {...data?.externalInvestorProfileForm ?? {}}
  
  const defaultValue = partialSchema.parse(
    investorProfileForm
  )

  return (
    <div className="flex flex-col gap-8 p-2 md:px-[10%]">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="flex flex-col gap-2">
        <Text
          as="h1"
          label="scenes.public.form.investorProfile.title"
          className="underline text-blue-800"
        />
        <Text
          as="h2"
          label="scenes.public.form.investorProfile.informations"
          className="underline"
        />
        <div className="mt-2">
          <Text
            as="h3"
            label="scenes.public.form.investorProfile.yourAdvisor"
            className="font-bold"
          />
          <Text
            label="scenes.public.form.investorProfile.yourAdvisorText"
            className="whitespace-pre-line"
          />
        </div>
        <div className="mt-2">
          <Text
            as="h3"
            label="scenes.public.form.investorProfile.rgpd"
            className="font-bold"
          />
          <Text
            label="scenes.public.form.investorProfile.rgpdText"
            className="whitespace-pre-line"
          />
        </div>
      </div>
      {!isLoading && (
        <InvestorProfileForm
          version={investorProfileVersionList[1]}
          isLoading={mutationRest.isLoading}
          defaultValue={defaultValue as InvestorProfileFormInputs}
          onSubmit={onInvestorProfileFormSubmit}
        />
      )}
    </div>
  );
};
