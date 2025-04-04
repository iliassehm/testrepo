import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { z } from "zod";

import { Button, Loading, Text } from "../../../../../components";
import { Page404 } from "../../../../../components/404";
import { Widget } from "../../../../../components/Widget";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import { ValidateConnectionOtpMutation } from "../../../../../types";
import { FieldText } from "../../../../../UIComponents/FieldText/FieldText";
import { GlobalAddWealthLogic } from "../AddWealth.logic";

const validateOtpForm = z.object({
  otp: z.string().min(1),
});

type AutomaticVerificationParams = {
  connectorId: string;
  connectionId: string;
  synchronizationId: string;
  onSuccess: (res: ValidateConnectionOtpMutation) => void;
};

export function AutomaticVerification(params: AutomaticVerificationParams) {
  const { t } = useTranslation();
  const toast = useToast();

  const connectorQuery = useQuery("connector", () =>
    gql.client.request(GlobalAddWealthLogic.connectorQuery(), {
      connectorID: params.connectorId,
    })
  );

  const validateOtpMutation = useMutation({
    mutationFn: ({ otp }: z.infer<typeof validateOtpForm>) => {
      return gql.client.request(
        GlobalAddWealthLogic.validateConnectionOtpMutation(),
        {
          connectionID: params.connectionId,
          synchronizationID: params.synchronizationId,
          otp,
        }
      );
    },
    onSettled: () => {
      form.reset();
    },
    onSuccess: params.onSuccess,
    onError: (err) => {
      if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
        toast?.current?.show({
          severity: "error",
          summary: "Error",
          detail: t("forms.fields.notifications.error.authentification"),
        });
      } else {
        toast?.current?.show({
          severity: "error",
          summary: "Error",
          detail: t("forms.fields.notifications.error.generic"),
        });
      }
    },
  });

  const form = useForm<z.infer<typeof validateOtpForm>>({
    resolver: zodResolver(validateOtpForm),
  });

  if (connectorQuery.isLoading) return <Loading />;
  if (connectorQuery.isError) return <Page404 />;

  const connector = connectorQuery.data?.connector;

  return (
    <Widget className="mx-auto max-w-4xl p-4">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mt-4 flex flex-col items-center gap-y-7">
          <p className="font-bold text-3xl">{connector?.name}</p>
          <img src={connector?.logo} className="aspect-auto h-10" />
        </div>
        <form
          className="mt-24 flex w-10/12 flex-col items-center whitespace-pre-line"
          onSubmit={form.handleSubmit((data) =>
            validateOtpMutation.mutate(data)
          )}
        >
          <FieldText
            {...form.register("otp")}
            placeholder={t("scenes.wealthConnection.add.verificationCode")}
            className="mb-6 w-full"
          />
          <Button
            label="scenes.wealthConnection.add.confirm"
            type="submit"
            loading={validateOtpMutation.isLoading}
          />
          <Text
            label="scenes.wealthConnection.termsOfUseAgreement"
            as="span"
            className="mt-3 text-center text-10 tracking-tighter"
          />
        </form>
      </div>
    </Widget>
  );
}
