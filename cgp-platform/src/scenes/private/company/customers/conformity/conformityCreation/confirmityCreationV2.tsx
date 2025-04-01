import { useParams } from "@tanstack/react-router";
import { Dialog } from "primereact/dialog";
import { Steps } from "primereact/steps";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import { clsx } from "../../../../../../helpers";
import { useCustomerUpload } from "../../../../../../hooks/useCustomerUpload";
import { useScrollBlock } from "../../../../../../hooks/useScrollBlock";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import {
  Campaign,
  DocumentAction,
  DocumentTemplate,
  EnvelopeAccess,
  EnvelopeCreation,
  NotificationRequest,
  NotificationTransport,
} from "../../../../../../types";
import { CustomersConformityLogic } from "../conformity.logic";
import { ConformityCreationRecap } from "./ConformityCreationRecap";
import { DocConfiguration } from "./DocConfiguration";
import { DocUpdate } from "./DocUpdate";
import { EnvelopStep } from "./EnvelopStep";
import { UploadStep } from "./UploadStep";

type ArrayBufferToFileProps = {
  arrayBuffer: ArrayBuffer;
  name: string;
  type: string;
  extension: string;
};

export function arrayBufferToFile(props: ArrayBufferToFileProps) {
  const blob = new Blob([props.arrayBuffer], { type: props.type });
  const file = new File([blob], `${props.name}.${props.extension}`, {
    type: blob.type,
  });
  return file;
}

type ConformityFile = {
  type: "upload" | "template" | "ged";
  file: ArrayBuffer;
  name: string;
  extension: string;
  category: string;
  digitalAction: boolean;
};

type ConformityFileWithSigners = ConformityFile & {
  signers?: {
    name: string;
    signer: DocumentAction;
  }[];
};

export type ConformityStepper = {
  step1: {
    name: string;
    expiration: Date;
    campaignId?: string | null | undefined;
  };
  step2: {
    selectedGedDocuments: string[];
    selectedDocumentTemplate: DocumentTemplate[];
    filesUpload: File[];
    outputFiles: ConformityFile[];
    defaultCategory?: string;
    errors: {
      document: string;
      type: "template" | "ged";
    }[];
  };
  step3: {
    outputFiles: ConformityFile[];
  };
  step4: {
    outputFiles: ConformityFileWithSigners[];
  };
};

export type ConformityForm = {
  envelope: {
    name: string;
    expiration: Date;
    campaignId?: string | null | undefined;
    delayUntil?: Date;
  };
  reminder?: {
    times: number;
    interval: number;
    periodicity: number;
  };
  files: ConformityFileWithSigners[];
  transports: Set<NotificationTransport>;
  showRepeatEvery?: boolean;
  repeatEvery?: number;
};

type ConfirmityCreationV2Props = {
  showDialog: boolean;
  hideDialog: () => void;
  initialValues?: ConformityForm;
  initialValuesStepper?: Partial<ConformityStepper>;
  initialStep?: number;
  projectID?: string;
  onSuccess?: () => void;
};

const ConfirmityCreationV2: FC<ConfirmityCreationV2Props> = ({
  hideDialog,
  showDialog,
  initialValues,
  initialValuesStepper,
  initialStep = 0,
  projectID,
  onSuccess,
}) => {
  const { t } = useTranslation();

  const scroll = useScrollBlock();
  useEffect(() => {
    if (showDialog) return scroll.block();
  }, [showDialog]);
  useEffect(() => {
    return scroll.block();
  }, []);

  const steps = [
    {
      label: t("forms.fields.steps.envelop") as string,
    },
    {
      label: t("forms.fields.steps.download") as string,
    },
    {
      label: "Configuration",
    },
    {
      label: t("forms.fields.steps.update") as string,
    },
    {
      label: t("forms.fields.steps.validation") as string,
    },
  ];

  const [activeStep, setActiveStep] = useState(initialStep);
  const [initialFiles, setInitialFiles] = useState<ConformityForm["files"]>([]);
  const [addParagraphs, setAddParagraphs] = useState<boolean>(false);

  const toast = useToast();

  const { setValue: setStepValue, watch: stepWatch } =
    useForm<ConformityStepper>({
      defaultValues: initialValuesStepper,
    });
  const conformityForm = useForm<ConformityForm>({
    defaultValues: initialValues ?? {
      transports: new Set(),
    },
  });
  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  });

  const queryClient = useQueryClient();

  const customerUpload = useCustomerUpload({
    companyID: companyId as string,
    customerID: customerId as string,
  });

  const envelopeCreation = useMutation(
    ["envelopeCreation", companyId, customerId],
    async ({
      input,
      notificationRequests,
      campaignID,
      addParagraphs,
    }: {
      input: EnvelopeCreation;
      campaignID?: Campaign["id"] | null;
      notificationRequests: NotificationRequest[];
      addParagraphs: boolean;
    }) => {
      const res = await gql.client.request(
        CustomersConformityLogic.envelopeCreation(),
        {
          companyID: companyId as string,
          customerID: customerId as string,
          input,
          notificationRequests,
          addParagraphs,
        }
      );

      if (res.envelopeCreation?.id && campaignID) {
        return gql.client.request(
          CustomersConformityLogic.envelopeAffectation(),
          {
            companyID: companyId as string,
            customerID: customerId as string,
            envelopeID: res.envelopeCreation?.id as string,
            campaignID: campaignID,
          }
        );
      }

      return res;
    }
  );

  const submitMutation = useMutation({
    mutationFn: async (data: ConformityForm) => {
      await customerUpload.mutateAsync({
        uploadRequest: data.files.map((file) => ({
          MIME: "application/pdf",
          name: `${file.name}.${file.extension}`,
        })),
        files: data.files.map((file) =>
          arrayBufferToFile({
            arrayBuffer: file.file,
            name: file.name,
            type: "application/pdf",
            extension: file.extension,
          })
        ),
      });

      await envelopeCreation.mutateAsync({
        addParagraphs,
        notificationRequests: new Array(...data.transports).map(
          (transport) => ({
            transport: transport,
            delayUntil: data.envelope.delayUntil,
          })
        ),
        campaignID: data.envelope.campaignId,
        input: {
          name: data.envelope.name,
          access: EnvelopeAccess.Shared,
          expiration: data.envelope.expiration,
          documents: data.files.map((file) => ({
            name: file.name,
            extension: file.extension,
            digitalAction: file.digitalAction,
            actions: file.signers?.flatMap((s) => s.signer) ?? [],
            category: file.category,
          })),
          reminder: data.reminder
            ? {
                interval: data.reminder.interval * data.reminder.periodicity,
                times: data.reminder.times,
              }
            : undefined,
          repeatEvery: data.repeatEvery,
        },
      });
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries([
        "customersConformity",
        companyId,
        customerId,
      ]);
      queryClient.invalidateQueries("documentList");
      queryClient.invalidateQueries("gedDocumentList");
      queryClient.invalidateQueries("companyCampaigns");

      hideDialog();
      toast?.current?.show({
        severity: "success",
        summary: "Success",
        detail: t("forms.fields.notifications.success.save"),
      });
    },
  });

  const previousStep = () => {
    if (activeStep === 0) return;
    if (activeStep === 3) {
      conformityForm.setValue("files", initialFiles);
    }

    setActiveStep(activeStep - 1);
  };

  const stepForm = stepWatch();
  const conformityValues = conformityForm.watch();

  const Component = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <EnvelopStep
            defaultValues={conformityValues.envelope}
            onSubmit={(data) => {
              conformityForm.setValue("envelope.expiration", data.expiration);
              conformityForm.setValue("envelope.name", data.name);
              conformityForm.setValue("envelope.campaignId", data.campaignId);
              setActiveStep(activeStep + 1);
            }}
          />
        );
      case 1:
        return (
          <UploadStep
            defaultValues={stepForm.step2}
            goBack={previousStep}
            onSubmit={(data) => {
              conformityForm.setValue("files", data.outputFiles);
              setStepValue("step2", data);
              setActiveStep(activeStep + 1);
              setInitialFiles(data.outputFiles);
            }}
          />
        );
      case 2:
        return (
          <DocConfiguration
            goBack={initialStep < 2 ? previousStep : undefined}
            onSubmit={(data) => {
              conformityForm.setValue("files", data.outputFiles);
              setActiveStep(activeStep + 1);
            }}
            files={conformityValues.files}
            projectID={projectID}
            setAddParagraphs={setAddParagraphs}
          />
        );
      case 3:
        return (
          <DocUpdate
            goBack={previousStep}
            onSubmit={(data) => {
              conformityForm.setValue("files", data.outputFiles);
              setActiveStep(activeStep + 1);
            }}
            files={conformityValues.files}
            defaultValues={{
              outputFiles: conformityValues.files,
            }}
          />
        );
      case 4:
        return (
          <ConformityCreationRecap
            goBack={previousStep}
            form={conformityForm}
            isLoading={submitMutation.isLoading}
            onSubmit={submitMutation.mutate}
          />
        );
    }
  }, [
    activeStep,
    setStepValue,
    t,
    submitMutation.isLoading,
    conformityValues,
    stepForm,
  ]);

  return (
    <Dialog
      visible={!!showDialog}
      onHide={() => hideDialog()}
      className={clsx(
        "min-w-[80vw] relative",
        activeStep === 2
          ? "fixed inset-0 overflow-hidden max-h-none rounded-none"
          : ""
      )}
      contentClassName={
        activeStep === 2 ? "!p-0 flex flex-col" : "!pb-16 rounded-t-lg"
      }
      showHeader={activeStep !== 2}
      headerClassName="absolute top-0 right-0"
    >
      <Steps
        id="conformity-creation-v2"
        className={activeStep === 2 ? "w-full !my-4" : "w-full !mb-8 !mt-16"}
        model={steps}
        activeIndex={activeStep}
        onSelect={(e) => setActiveStep(e.index)}
        readOnly
      />
      {Component}
    </Dialog>
  );
};

export default ConfirmityCreationV2;
