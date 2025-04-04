import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useSearch } from "@tanstack/react-router";
import { FirebaseError } from "firebase/app";
import { Checkbox } from "primereact/checkbox";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";

import { Button,  } from "../../../../components";
import { PASSWORD_MIN_LENGTH, getFormErrorMessage } from "../../../../constants";
import { useToast } from "../../../../hooks/useToast";
import { gql } from "../../../../service/client";
import { firebaseLogout } from "../../../../service/firebase";
import { AuthLayout } from "../components/authLayout";
import { invitationLogic } from "./invitation.logic";
import { invitationRoute } from "./route";
import { Label } from "../../../../UIComponents/Label/Label";
import { FieldText } from "../../../../UIComponents/FieldText/FieldText";

const validationSchema = z
  .object({
    password: z
      .string({ required_error: "forms.rules.required" })
      .min(PASSWORD_MIN_LENGTH, { message: "forms.rules.password" }),
    email: z.string().email({
      message: "forms.rules.email",
    }),
    confirmPassword: z.string(),
    newsletterSubscriber: z.boolean().optional(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "forms.rules.passwordMismatch",
    path: ["confirmPassword"],
  });

type ValidationSchema = z.infer<typeof validationSchema>;

export function Invitation() {
  // Hooks
  const from = invitationRoute.id;
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { email, sign_up, company_name, owner } = useSearch({ from });
  const { invitationId, companyId } = useParams({ from });

  useEffect(() => {
    const effect = async () => {
      try {
        await gql.client.request(invitationLogic.logout());
      } finally {
        await firebaseLogout();
      }
    };

    effect();
  }, []);

  // Form
  const {
    getValues,
    formState: { isValid, errors },
    control,
    handleSubmit,
  } = useForm<ValidationSchema>({
    mode: "onChange",
    defaultValues: { email },
    resolver: zodResolver(validationSchema),
  });

  // Mutations
  const { mutate: mutateAuthWithToken, isLoading } = useMutation(
    "invitation",
    async (token: string) => {
      const invitationResonse = await gql.client.request(
        invitationLogic.sendSignUpInvitation(),
        {
          id: invitationId as string,
          token,
        }
      );

      // (if newsletter button is present): update manager profile
      const { newsletterSubscriber } = getValues();
      if (newsletterSubscriber) {
        await gql.client.request(invitationLogic.subscribeToNewsletter(), {
          input: {
            newsletterSubscriber,
          },
        });
      }

      return invitationResonse;
    },
    {
      onSuccess: async (data) => {
        if (!data?.authenticationFirebase?.manager) return;

        await queryClient.invalidateQueries("authenticated");

        window.location.href = `/company/${companyId}`;
      },
    }
  );

  // Google auth with credentials (email + password)
  const { mutate: mutateAuthWithInvitation, isLoading: isLoadingAuth } =
    useMutation("authWithInvitation", invitationLogic.signUpWithFirebase, {
      onSuccess: async (data) => mutateAuthWithToken(data.token),
      onError: ({ code }: FirebaseError) => {
        if (toast.current)
          toast.current.show({
            severity: "error",
            summary: t("forms.fields.notifications.error.authentification"),
            detail: t(`firebase.${code}`),
            life: 3000,
          });
      },
    });

  return (
    <AuthLayout>
      <div className="my-4">
        {owner === true ? (
          <div className="mx-auto  max-w-[200px] text-center text-lg font-medium leading-normal text-blue-1100">
            <Trans
              i18nKey="scenes.authentification.finishOwnerRegistration"
              components={[<span className="font-bold text-blue-800" />]}
            />
          </div>
        ) : (
          <div className="text-center text-base">
            <Trans
              i18nKey="scenes.invitation.you_have_been_invited"
              values={{ company_name: company_name.replace("+", " ") }}
            />
          </div>
        )}
      </div>

      <form
        className="space-y-6"
        action="#"
        method="POST"
        onSubmit={handleSubmit((data) => mutateAuthWithInvitation(data))}
      >
        <div className="flex flex-col gap-y-4">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000">
                    {t(`scenes.authentification.emailAddress`)}
                </Label>
                <FieldText
                    id={field.name}
                    {...field}
                />
                {getFormErrorMessage(field.name, errors)}
              </div>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000">
                  {t(`scenes.authentification.password`)}
                </Label>
                <FieldText
                    id={field.name}
                    {...field}
                    type="password"
                    autoComplete="current-password"
                />
                {getFormErrorMessage(field.name, errors)}
                </div>
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="ml-3 font-medium text-xs text-blue-1000">
                    {t(`scenes.authentification.confirmPassword`)}
                </Label>
                <FieldText
                    id={field.name}
                    {...field}
                    type="password"
                    autoComplete="current-password"
                />
                {getFormErrorMessage(field.name, errors)}
                </div>
            )}
          />
          {!owner && sign_up && (
            <Controller
              name="newsletterSubscriber"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    inputId={field.name}
                    checked={!!field.value}
                    inputRef={field.ref}
                    onChange={(e) => field.onChange(e.checked)}
                  />
                  <Label
                    id={field.name}
                    className="cursor-pointer text-blue-1100"
                  >{t("scenes.authentification.newsletterSubscriber")}</Label>
                </div>
              )}
            />
          )}
        </div>

        <div>
          <Button
            label="scenes.authentification.login"
            data-testid="login"
            disabled={!isValid}
            type="submit"
            className="m-auto flex justify-center rounded-md bg-blue-800 px-14 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            loading={isLoading || isLoadingAuth}
          />
        </div>
      </form>
    </AuthLayout>
  );
}
