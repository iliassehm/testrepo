import { zodResolver } from "@hookform/resolvers/zod";
import { ClientError } from "graphql-request";
import { Skeleton } from "primereact/skeleton";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { z } from "zod";

import { Button, Text } from "../../../../../components";
import { Page404 } from "../../../../../components/404";
import { Widget } from "../../../../../components/Widget";
import { getFormErrorMessage } from "../../../../../constants";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import { Scalars } from "../../../../../types";
import { FieldText } from "../../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../../UIComponents/Label/Label";
import { GlobalAddWealthLogic } from "../AddWealth.logic";

const validationSchema = z
  .object({
    username: z.string().min(1, { message: "forms.rules.required" }),
    secret: z
      .string({ required_error: "forms.rules.required" })
      .min(1, { message: "forms.rules.password" })
      .optional(),
  })
  .catchall(z.string().min(1, { message: "forms.rules.required" }));
type ValidationSchema = z.infer<typeof validationSchema>;

function Loading() {
  return (
    <div>
      <div className="h-screen w-full">
        <Skeleton height="60%" className="mb-2 rounded-3xl"></Skeleton>
      </div>
    </div>
  );
}

type CredentialsComponentParams = {
  companyId: string;
  connectorId: string;
  mode: "add" | "update";
  connectionId?: string;
  identifier?: string;
  onSuccess: (res: any) => void;
};

export function CredentialsComponent({
  companyId,
  connectorId,
  mode,
  connectionId,
  identifier,
  onSuccess,
}: CredentialsComponentParams) {
  const toast = useToast();
  const { t, i18n } = useTranslation();

  const {
    formState: { isValid, errors },
    control,
    handleSubmit,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues:
      mode === "update" && identifier ? { username: identifier } : undefined,
  });
  const connectorQuery = useQuery("connector", () =>
    gql.client.request(GlobalAddWealthLogic.connectorQuery(), {
      connectorID: connectorId,
    })
  );
  const mutation = useMutation(
    mode === "add" ? "synchronizeConnector" : "changeConnectionCredentials",
    (metadata: Scalars["ConnectionMetadata"]) =>
      mode === "add"
        ? gql.client.request(
            GlobalAddWealthLogic.synchronizeConnectorMutation(),
            {
              companyID: companyId,
              connectorID: connectorId,
              metadata,
            }
          )
        : gql.client.request(
            GlobalAddWealthLogic.changeConnectionCredentialsMutation(),
            {
              connectionID: connectionId ?? "",
              credentials: metadata,
            }
          ),
    {
      onSuccess,
      onError: (error: ClientError) => {
        const message = error.response.errors?.[0]?.message;

        toast?.current?.show({
          severity: "error",
          detail:
            message &&
            i18n.exists(`scenes.wealthConnection.${mode}.error.${message}`)
              ? t(`scenes.wealthConnection.${mode}.error.${message}`)
              : t(`scenes.wealthConnection.${mode}.error.ERROR`),
        });
      },
    }
  );

  if (connectorQuery.isLoading) return <Loading />;
  if (connectorQuery.isError) return <Page404 />;

  const connector = connectorQuery.data?.connector;

  const customerSubHead = t(
    `scenes.wealthConnection.${mode}.subHead.${connectorId}`,
    {
      returnObjects: true,
    }
  ) as { title: string } | undefined;

  return (
    <Widget className="mx-auto max-w-4xl p-4">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mt-4 flex flex-col items-center gap-y-7">
          <p className="font-bold text-3xl">{connector?.name}</p>
          <img src={connector?.logo} className="aspect-auto h-10" />
          {!!customerSubHead && (
            <div
              className="mt-4 text-base external-link-parent text-center text-red-400"
              dangerouslySetInnerHTML={{ __html: customerSubHead.title }}
            />
          )}
        </div>
        <form
          className="mt-24 flex w-10/12 flex-col items-center whitespace-pre-line gap-y-2"
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
        >
          {/* TODO should be fix in database */}
          {Object.entries(connector?.labels || {}).sort(([a], [b]) => a === 'username' ? -1 : b === 'username' ? 1 : 0).map(([key, label]) => (
            <Controller
              key={key}
              name={key}
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="w-full">
                  <Label htmlFor={field.name}>
                    {t(`scenes.wealthConnection.${key}.${label}`)}
                  </Label>
                  <FieldText
                    id={field.name}
                    {...field}
                    type={key === "secret" ? "password" : "text"}
                    autoComplete={key === "secret" ? "current-password" : "off"}
                  />
                  {getFormErrorMessage(field.name, errors)}
                </div>
              )}
            />
          ))}
          <div className="relative mb-11 flex items-start justify-center gap-x-4 text-10 tracking-tighter text-blue-1000">
            <i
              className="pi pi-info-circle absolute -left-2 -translate-x-full"
              style={{ fontSize: "1.25rem" }}
            />
            <div className="flex flex-col items-center">
              <Text
                label={`scenes.wealthConnection.securedCredentials`}
                as="span"
              />
              <Text label={`scenes.wealthConnection.seeMore`} as="span" />
            </div>
          </div>
          <Button
            label={`scenes.wealthConnection.${mode}.submit`}
            disabled={!isValid}
            type="submit"
            loading={mutation.isLoading}
          />
          <Text
            label={`scenes.wealthConnection.termsOfUseAgreement`}
            as="span"
            className="mt-3 text-center text-10 tracking-tighter"
          />
        </form>
      </div>
    </Widget>
  );
}
