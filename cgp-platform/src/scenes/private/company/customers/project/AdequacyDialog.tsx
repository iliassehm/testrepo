import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import { type FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { z } from "zod";

import { Button, Dialog } from "../../../../../components";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import { FieldDate } from "../../../../../UIComponents/FieldDate/FieldDate";
import { FieldText } from "../../../../../UIComponents/FieldText/FieldText";
import ConfirmityCreationV2, {
  type ConformityForm,
  type ConformityStepper,
} from "../conformity/conformityCreation/confirmityCreationV2";
import { ProjectLogic } from "./project.logic";

const adequacyDialogForm = z.object({
  name: z.string().min(1),
  expiration: z.date(),
});

type Props = {
  project:
    | {
        projectID: string;
        type: "adequacy" | "report";
      }
    | false;
  setVisible: (projectID: string | false) => void;
};

export const AdequacyDialog: FC<Props> = ({ project, setVisible }) => {
  const { t } = useTranslation();
  const [showGED, setShowGED] = useState(false);
  const [initialGED, setInitialGED] = useState<ConformityForm>();
  const [projectID, setProjectID] = useState<string | undefined>(
    project ? project.projectID : undefined
  );
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/projects/",
  });
  const [initialGEDStepper, setInitialGEDStepper] =
    useState<Partial<ConformityStepper>>();

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<z.infer<typeof adequacyDialogForm>>({
    resolver: zodResolver(adequacyDialogForm),
    defaultValues: {
      name: "",
    },
  });

  const toast = useToast();

  const generateAdequacy = useMutation({
    mutationFn: async (
      args: { projectID: string } & z.infer<typeof adequacyDialogForm>
    ) => {
      return gql.client.request(ProjectLogic.generateAdequacy(), {
        projectID: args.projectID,
        customerID: params.customerId as string,
      });
    },
    onSuccess: async (file, variables) => {
      if (
        file.generateAdequacy === undefined ||
        file.generateAdequacy === null
      ) {
        toast.current?.show({
          severity: "error",
          summary: t("scenes.customers.projects.declareAdequacy.error"),
          detail: t("scenes.customers.projects.declareAdequacy.errorDetail"),
        });
        return;
      }
      const res = await fetch(file.generateAdequacy.url);
      const arrayBuffer = await res.arrayBuffer();
      const fileAdequacy: File = new File(
        [arrayBuffer],
        `${file.generateAdequacy.name}.${file.generateAdequacy.extension}`,
        {
          type: "application/pdf",
        }
      );

      setInitialGED({
        envelope: {
          name: variables.name,
          expiration: variables.expiration,
        },
        files: [],
        transports: new Set(),
      });
      setInitialGEDStepper({
        step2: {
          errors: [],
          selectedDocumentTemplate: [],
          selectedGedDocuments: [],
          outputFiles: [],
          defaultCategory: "adéquations",
          filesUpload: [fileAdequacy],
        },
      });
      setVisible(false);
      setShowGED(true);
    },
  });

  useEffect(() => {
    if (project) setProjectID(project.projectID);
  }, [project]);

  return (
    <>
      {project && (
        <Dialog
          open={!!project}
          header={
            project.type === "adequacy"
              ? t("scenes.customers.projects.declareAdequacy.adequacy")
              : t("scenes.customers.projects.declareAdequacy.report")
          }
          className="w-[800px] font-bold overflow-visible"
          onOpenChange={() => setVisible(false)}
        >
          <form
            onSubmit={handleSubmit((data) =>
              generateAdequacy.mutate({
                projectID: project.projectID,
                ...data,
              })
            )}
            className="flex flex-col items-center gap-4 mt-4"
          >
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <FieldText
                  placeholder={t(
                    "scenes.customers.projects.declareAdequacy.envelopePlaceholder"
                  )}
                  className="w-full px-10"
                  name={field.name}
                  onBlur={field.onBlur}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="expiration"
              render={({ field }) => (
                <div className="w-full flex items-center px-10">
                  <label
                    className="text-base text-blue-1000 min-w-[100px]"
                    htmlFor={field.name}
                  >
                    {t("forms.fields.tables.validityDate")}
                  </label>
                  <FieldDate
                    placeholder={"Expiration de l'envelope"}
                    className="w-full px-10"
                    {...field}
                    onValueChange={field.onChange}
                    required
                  />
                </div>
              )}
            />

            <Button
              type="submit"
              label="scenes.customers.projects.declareAdequacy.submit"
              className="w-44"
              loading={generateAdequacy.isLoading}
              disabled={!isValid}
            />
          </form>
        </Dialog>
      )}
      {showGED && (
        <ConfirmityCreationV2
          showDialog={showGED}
          hideDialog={() => setShowGED(false)}
          initialValues={initialGED}
          initialValuesStepper={initialGEDStepper}
          initialStep={1}
          projectID={projectID}
        />
      )}
    </>
  );
};
