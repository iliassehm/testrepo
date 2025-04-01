import { useSearch } from "@tanstack/react-router";
import i18next, { t } from "i18next";
import {  ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useMutation, useQuery } from "react-query";

import { config } from "../../../config/configuration";
import { useToast } from "../../../hooks/useToast";
import { gql } from "../../../service/client";

import { PublicForm } from "./form.logic";
import {  publicGoalsFormScene } from "./route";
import { GoalsForm, ObjectivesFormDataType } from "../../private/company/customers/conformity/goals/form";
import { Text } from "../../../components";
import { InvestorProfileFormInputs } from "../../../../shared/schemas/investorProfileFormSchema";

export const PublicGoalsForm = () => {
  // Hooks
  const toast = useToast();

  const { token } = useSearch({
    from: publicGoalsFormScene.id,
  });

  // Query
  const queryKey = ["publicGoals", token];
  const { data, isLoading } = useQuery(queryKey, () =>
    gql.client.request(PublicForm.getPubliFormFilling(), {
      token,
    })
  );

  // Mutation

  const mutation = useMutation(
    (input: InvestorProfileFormInputs) =>
      gql.client.request(PublicForm.submitPubliFormFilling(), {
        token: token as string,
        input,
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
          confirmDialog({
            message: t("scenes.public.form.goals.confirm.text"),
            acceptLabel: t("forms.confirm.ok") as string,
            rejectClassName: "hidden",
            icon: "pi pi-send",
            className: "max-w-[500px]",
            accept: () => {
              window.location.href = config.b2cAppUrl;
            },
          });

          clearTimeout(timeout);
        }, 1000);
      },
    }
  );


  const goals = data?.existingFormData ?? {};

  return <div className="flex flex-col gap-8 p-2 md:px-[10%]">
    <ConfirmDialog />
    <div className="flex flex-col gap-2">
        <Text
          as="h1"
          label="scenes.public.form.goals.title"
          className="underline text-blue-800"
        />
        <Text
          as="h2"
          label="scenes.public.form.goals.informations"
          className="underline"
        />
        <div className="mt-2">
          <Text
            as="h3"
            label="scenes.public.form.goals.yourAdvisor"
            className="font-bold"
          />
          <Text
            label="scenes.public.form.goals.yourAdvisorText"
            className="whitespace-pre-line"
          />
        </div>
        <div className="mt-2">
          <Text
            as="h3"
            label="scenes.public.form.goals.rgpd"
            className="font-bold"
          />
          <Text
            label="scenes.public.form.goals.rgpdText"
            className="whitespace-pre-line"
          />
        </div>
      </div>
    <GoalsForm
      defaultValues={goals}
      isLoading={isLoading}
      submitPosition="end"
      onSubmit={mutation.mutate as unknown as (data: ObjectivesFormDataType) => void}
  />
  </div>
};
