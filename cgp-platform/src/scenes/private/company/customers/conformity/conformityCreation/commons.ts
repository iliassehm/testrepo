import { TFunction } from "i18next";
import { IFileWithMeta } from "react-dropzone-uploader";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { z } from "zod";



import {
  Company,
  Document,
  DocumentAction,
  DocumentTemplate,
  DocumentUpdate,
  NotificationTransport,
  UploadRequest,
} from "../../../../../../types";


export const conformityCreationValidationSchema = z.object({
  name: z.string({ required_error: "forms.rules.required" }),
  expiration: z.date(),
  campaignId: z.string().nullish(),
});

export type ConformtityCreationValidationSchema = z.infer<
  typeof conformityCreationValidationSchema
>;
export interface FormProps {
  errors: FieldErrors<ConformtityCreationValidationSchema>;
  control: Control<ConformtityCreationValidationSchema>;
  t: TFunction<"translation", undefined, "translation">;
  setValue: UseFormSetValue<ConformtityCreationValidationSchema>;
  register: UseFormRegister<ConformtityCreationValidationSchema>;
}
interface Signarote {
  name: string;
  signer: DocumentAction[];
}

export interface ISignatore {
  [key: string]: Signarote[];
}

export interface DocumentUpdateProps {
  id: Document["id"];
  files?: File[];
  update: DocumentUpdate;
}
export interface UploadHandlerProps {
  files: File[];
  update?: DocumentUpdateProps;
  uploadRequest: UploadRequest[];
}
export interface ConformityFormCreationProps {
  companyId: Company["id"];
  onUpload: (params: UploadHandlerProps) => Promise<void>;
  onSubmit: (params: {
    files: IFileWithMeta[];
    signatories: ISignatore;
    filesDigitalAction: Record<string, boolean>;
    envelop: ConformtityCreationValidationSchema;
    selectedDocumentTemplate: DocumentTemplate[];
    filesCategory: Record<string, string>;
  }) => Promise<void>;
  envelopeCreationLoading?: boolean;
}