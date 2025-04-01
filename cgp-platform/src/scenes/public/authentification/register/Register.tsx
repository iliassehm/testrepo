import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Checkbox } from "primereact/checkbox";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { z } from "zod";

import { Button } from "../../../../components/Button";
import {
  FileInfoZodSchema, // FileUpload,
} from "../../../../components/upload";
import { tracker } from "../../../../helpers/tracker";
import { useToast } from "../../../../hooks/useToast";
import { gql } from "../../../../service/client";
import { AuthentificationLogic } from "../authentification.logic";
import { AuthLayout } from "../components/authLayout";
import { registerConfirmationScene, registerRoute } from "../route";
import { Label } from "../../../../UIComponents/Label/Label";
import { FieldText } from "../../../../UIComponents/FieldText/FieldText";
import { getFormErrorMessage } from "../../../../constants";

const validationSchema = z.object({
  name: z.string({
    required_error: "forms.rules.required",
  }).min(1),
  firstName: z.string({
    required_error: "forms.rules.required",
  }).min(1),
  companyName: z.string({
    required_error: "forms.rules.required",
  }).min(1),
  phone: z.string().optional(),
  email: z.string().email({
    message: "forms.rules.email",
  }),
  logo: FileInfoZodSchema.nullable().optional(),
  newsletterSubscriber: z.boolean().optional(),
  terms: z.boolean({ required_error: "forms.rules.required" }),
});
type ValidationSchema = z.infer<typeof validationSchema>;

export function RegisterPage() {
  // Hooks
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate({
    from: registerRoute.id,
  });

  // Api call
  const { mutate: inviteManagerMutation, isLoading: inviteManagerIsLoading } =
    useMutation(
      "inviteManager",
      async ({
        logo,
        name,
        firstName,
        companyName,
        ...input
      }: ValidationSchema) => {
        const invitationResponse = await gql.client.request(
          AuthentificationLogic.inviteManager(),
          {
            input: {
              email: input.email,
              phone: input.phone,
              name: `${firstName} ${name}`,
              newsletterSubscriber: input.newsletterSubscriber,
            },
            company: { name: companyName },
          }
        );

        if (logo) {
          // add logo loginc
        }

        return invitationResponse;
      },
      {
        onSuccess: () => {
          tracker.log("sign", { operation: "success" });
          navigate({ to: registerConfirmationScene.id });
        },
        onError: (error) => {
          const errorType = (error as any)?.response?.errors[0]?.message;
          const errorMessage = errorType && i18n.exists(`scenes.authentification.errors.${errorType}`)
            ? t(`scenes.authentification.errors.${errorType}`)
            : t("forms.fields.notifications.error.generic");

          tracker.log("sign", { operation: "failure" });
          toast?.current?.show({
            severity: "error",
            summary: t("forms.fields.notifications.error.success"),
            detail: errorMessage,
          });
        },
      }
    );

  const {
    control,
    formState: { isValid, errors },
    handleSubmit,
  } = useForm<ValidationSchema>({
    mode: "onBlur",
    resolver: zodResolver(validationSchema),
  });
  
  return (
    <AuthLayout title="scenes.authentification.connect" redirectTo="login">
      <form
        className="space-y-6"
        action="#"
        method="POST"
        onSubmit={handleSubmit((data) => inviteManagerMutation(data))}
      >
        <div className="flex flex-col gap-2">
        <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <>
                  <Label
                        htmlFor={field.name}
                        className="ml-3 font-medium text-xs text-blue-1000"
                      >
                      {t(`forms.fields.name`)}
                  </Label>
                  <FieldText
                  placeholder="test"
                      id={field.name}
                      {...field}
                  />
                  {getFormErrorMessage(field.name, errors)}
                  </>
              )}
            />
        <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <>
                  <Label
                        htmlFor={field.name}
                        className="ml-3 font-medium text-xs text-blue-1000"
                      >
                      {t(`forms.fields.firstName`)}
                  </Label>
                  <FieldText
                      id={field.name}
                      {...field}
                  />
                  {getFormErrorMessage(field.name, errors)}
                  </>
              )}
            />
        <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <>
                  <Label
                        htmlFor={field.name}
                        className="ml-3 font-medium text-xs text-blue-1000"
                      >
                      {t(`forms.fields.companyName`)}
                  </Label>
                  <FieldText
                      id={field.name}
                      {...field}
                  />
                  {getFormErrorMessage(field.name, errors)}
                  </>
              )}
            />
        <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <>
                  <Label
                        htmlFor={field.name}
                        className="ml-3 font-medium text-xs text-blue-1000"
                      >
                      {t(`forms.fields.phone`)}
                  </Label>
                  <FieldText
                      id={field.name}
                      {...field}
                      type="tel"
                      placeholder="06 01 02 03 04"
                      autoComplete="phone"
                  />
                  {getFormErrorMessage(field.name, errors)}
                  </>
              )}
            />
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
                      type="email"
                  />
                  {getFormErrorMessage(field.name, errors)}
                  </>
              )}
            />
        </div>
        <div>
          <Controller
            name="newsletterSubscriber"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  inputId={field.name}
                  checked={!!field.value}
                  inputRef={field.ref}
                  data-testid={field.name}
                  onChange={(e) => field.onChange(e.checked)}
                />
                <Label
                  id={field.name}
                  className="cursor-pointer text-blue-1100"
                >{t("scenes.authentification.newsletterSubscriber")}</Label>
              </div>
            )}
          />
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  inputId={field.name}
                  data-testid={field.name}
                  checked={!!field.value}
                  inputRef={field.ref}
                  onChange={(e) => field.onChange(e.checked)}
                />
                <Label
                  id={field.name}
                  className="cursor-pointer text-blue-1100"
                >{t("scenes.authentification.terms")}</Label>
              </div>
            )}
          />
        </div>
        <div>
          <Button
            type="submit"
            data-testid="subscribe"
            label="scenes.authentification.subscribe"
            className="m-auto flex justify-center rounded-md bg-blue-800 px-14 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            disabled={!isValid}
            loading={inviteManagerIsLoading}
          />
        </div>
      </form>
    </AuthLayout>
  );
}
