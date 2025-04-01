import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { FirebaseError } from "firebase/app";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { z } from "zod";

import { Button } from "../../../../components";
import { useToast } from "../../../../hooks/useToast";
import { AuthentificationLogic } from "../authentification.logic";
import { AuthLayout } from "../components/authLayout";
import { loginScene } from "../route";
import { FieldText } from "../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../UIComponents/Label/Label";
import { getFormErrorMessage } from "../../../../constants";

const validationSchema = z.object({
  email: z.string().email({
    message: "forms.rules.email",
  }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export function ResetPassword() {
  const toast = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(
    "resetPassword",
    AuthentificationLogic.resetPassword,
    {
      onSuccess: () => {
        toast.current?.show({
          severity: "info",
          summary: t("forms.fields.notifications.resetPassword.success"),
          life: 3000,
        });
        navigate({
          to: loginScene.id,
        });
      },
      onError: ({ code }: FirebaseError) => {
        toast.current?.show({
          severity: "error",
          summary: t("forms.fields.notifications.error.authentification"),
          detail: t(`firebase.${code}`),
          life: 3000,
        });
      },
    }
  );

  const {
    formState: { isValid, errors },
    control,
    handleSubmit,
  } = useForm<ValidationSchema>({
    mode: "onBlur",
    resolver: zodResolver(validationSchema),
  });

  return (
    <AuthLayout title="scenes.authentification.resetPassword">
      <form
        className="space-y-6"
        action="#"
        method="POST"
        onSubmit={handleSubmit((data) => mutate(data.email))}
      >
        <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <div>
                  <Label htmlFor={field.name}>
                      {t(`scenes.authentification.emailAddress`)}
                  </Label>
                  <FieldText
                      id={field.name}
                      {...field}
                      type="email"
                  />
                  {getFormErrorMessage(field.name, errors)}
                  </div>
              )}
            />
        <div>
          <Button
            label="scenes.authentification.confirm"
            disabled={!isValid}
            className="m-auto flex justify-center rounded-md bg-blue-800 px-14 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            loading={isLoading}
          />
        </div>
      </form>
    </AuthLayout>
  );
}
