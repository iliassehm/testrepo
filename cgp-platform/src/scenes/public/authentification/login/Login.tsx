import { zodResolver } from "@hookform/resolvers/zod";
import { useSearch } from "@tanstack/react-router";
import { FirebaseError } from "firebase/app";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";

import {  Loading, Text } from "../../../../components";
import { Button } from "../../../../components/Button";
import { PASSWORD_MIN_LENGTH, getFormErrorMessage } from "../../../../constants";
import { tracker } from "../../../../helpers/tracker";
import { useToast } from "../../../../hooks/useToast";
import { gql } from "../../../../service/client";
import { AuthentificationLogic } from "../authentification.logic";
import { AuthLayout } from "../components/authLayout";
import { resetPasswordScene } from "../resetPassword";
import { loginScene } from "../route";
import { Label } from "../../../../UIComponents/Label/Label";
import { FieldText } from "../../../../UIComponents/FieldText/FieldText";

const validationSchema = z.object({
  password: z
    .string({ required_error: "forms.rules.required" })
    .min(PASSWORD_MIN_LENGTH, { message: "forms.rules.password" }),
  email: z.string().email({
    message: "forms.rules.email",
  }),
});

type ValidationSchema = z.infer<typeof validationSchema>;
export function LoginPage() {
  // Hooks
  const toast = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const search = useSearch({ from: loginScene.id });

  const onError = ({ code }: FirebaseError) => {
    if (!toast.current) return;

    toast.current.show({
      severity: "error",
      summary: t("forms.fields.notifications.error.authentification"),
      detail: t(`firebase.${code}`),
      life: 3000,
    });
  };

  // Server auth
  const { isLoading, mutate: mutateAuthWithToken } = useMutation(
    "Login",
    (token: string) =>
      gql.client.request(AuthentificationLogic.authWithToken(), {
        token,
      }),
    {
      onSuccess: async (data) => {
        const manager = data?.authenticationFirebase?.manager;
        const parentCompany = manager?.parentCompany;

        if (manager)
          tracker.registerUser(manager.id);

        tracker.log("login", { operation: "success" });

        await queryClient.invalidateQueries();

        if (parentCompany) {
          window.location.href = "/";
          return;
        }

        if (!manager?.companyList?.length) return;

        const hasCompany =
          manager?.companyList && manager?.companyList?.length > 0;

        if (!hasCompany) return console.error("No company found");

        window.location.href = search.callbackUrl ?? '/';
      },
      onError: () => tracker.log("login", { operation: "failure" }),
    }
  );

  // Google auth with credentials (email + password)
  const { mutate: mutateAuthWithCredentials, isLoading: credentialsIsLoading } =
    useMutation(
      "authWithCredentials",
      AuthentificationLogic.authWithCredentials,
      {
        onSuccess: async (data) => mutateAuthWithToken(data.token),
        onError,
      }
    );

    const {
      formState: { isValid, errors },
      handleSubmit,
      control
    } = useForm<ValidationSchema>({
      mode: "onBlur",
      resolver: zodResolver(validationSchema),
    });

    if (isLoading) return <Loading />;
    
  return (
    <AuthLayout title="scenes.authentification.connect" redirectTo="register">
      <form
        className="space-y-6"
        action="#"
        method="POST"
        onSubmit={handleSubmit((data) => mutateAuthWithCredentials(data))}
      >
        <div>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <>
                  <Label
                        htmlFor={field.name}
                        className="ml-3 font-medium text-xs text-blue-1000"
                      >
                      {t(`scenes.authentification.emailAddress`)}
                  </Label>
                  <FieldText
                      id={field.name}
                      {...field}
                  />
                  {getFormErrorMessage(field.name, errors)}
                  </>
              )}
            />
        </div>
        <div>
          <div className="mt-2">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <>
                  <Label
                        htmlFor={field.name}
                        className="ml-3 font-medium text-xs text-blue-1000"
                      >
                      {t(`scenes.authentification.password`)}
                  </Label>
                  <FieldText
                      id={field.name}
                      {...field}
                      type="password"
                      autoComplete="current-password"
                  />
                  {getFormErrorMessage(field.name, errors)}
                  </>
              )}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Text
            to={resetPasswordScene.fullPath}
            label="scenes.authentification.forgotPassword"
            className="font-medium text-blue-800"
            data-testid="forgot-password"
          />
        </div>
        <div>
          <Button
            type="submit"
            data-testid="login"
            label="scenes.authentification.login"
            className="m-auto flex justify-center rounded-md bg-blue-800 px-14 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            disabled={!isValid}
            loading={credentialsIsLoading}
          />
        </div>
      </form>
    </AuthLayout>
  );
}
