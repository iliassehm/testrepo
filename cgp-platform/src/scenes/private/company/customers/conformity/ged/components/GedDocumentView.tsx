import { Skeleton } from "primereact/skeleton";
import { type FC, isValidElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Icon, Loading, Text } from "../../../../../../../components";
import { getTreatement, treatementStyle } from "../../../../../../../constants";
import { clsx, formatDate } from "../../../../../../../helpers";
import {
  type Document,
  NotificationTransport,
  Treatement,
} from "../../../../../../../types";
import { FieldTextarea } from "../../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { DocumentActions, useDocumentActions } from "./DocumentActions";
import type { GedV2ContentProps } from "./GedContentV2";

type StateTagProps = {
  state: Document["treatement"];
  className?: string;
};

export const StateTag: FC<StateTagProps> = ({ state, className }) => {
  const { t } = useTranslation();

  if (!state) return null;

  let label: string;

  switch (state) {
    case Treatement.Valid:
      label = "scenes.customers.conformity.conformity.done";
      break;
    case Treatement.Unvalid:
      label = "scenes.customers.conformity.conformity.progress";
      break;
    case Treatement.Waiting:
      label = "scenes.customers.conformity.conformity.todo";
      break;
    default:
      label = state;
  }

  return (
    <p
      className={clsx(
        "w-fit rounded-xl px-3 py-1 text-xs text-white font-medium",
        treatementStyle.bg[state],
        className
      )}
    >
      {t(label)}
    </p>
  );
};

type GedDocumentViewProps = {
  document: Document;
};

type GedCategorieDocumentViewProps = GedDocumentViewProps & {
  notes: string | null;
  setNotes: (notes: string) => void;
};

const GedCategorieDocumentView: FC<GedCategorieDocumentViewProps> = ({
  document,
  notes,
  setNotes,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col mt-4" data-testid="document-view-category">
        <DocumentViewLine
          label="scenes.customers.conformity.conformity.importedThe"
          value={formatDate(document.created)}
          data-testid="document-view-imported-date"
        />

        {document.expiration && (
          <DocumentViewLine
            label="forms.fields.tables.validityDate"
            value={formatDate(document.expiration)}
            data-testid="document-view-expiration-date"
          />
        )}

        {document.signature?.signed && (
          <DocumentViewLine
            label="scenes.customers.conformity.conformity.signedThe"
            value={formatDate(document.signature.signed)}
            data-testid="document-view-signed-date"
          />
        )}
        {document.signature?.validated && (
          <DocumentViewLine
            label="scenes.customers.conformity.conformity.validatedThe"
            value={formatDate(document.signature.validated)}
            data-testid="document-view-validated-date"
          />
        )}

        <DocumentViewLine
          label="scenes.customers.conformity.conformity.state"
          value={<StateTag state={getTreatement(document)} />}
          data-testid="document-view-state"
        />

        {document.envelope && (
          <DocumentViewLine
            label="scenes.customers.conformity.conformity.ratchedToEnvelope"
            value={
              <p
                className="font-bold"
                data-testid="document-view-envelope-name"
              >
                {document.envelope?.name || "-"}
              </p>
            }
            data-testid="document-view-envelope"
          />
        )}

        {document.signature && (
          <DocumentViewLine
            label="scenes.customers.conformity.conformity.signature_type"
            value={
              <p data-testid="document-view-signature-type">
                {t(
                  document.signature?.digital
                    ? "scenes.customers.conformity.conformity.signature_type_digital"
                    : "scenes.customers.conformity.conformity.signature_type_manual"
                )}
              </p>
            }
            data-testid="document-view-signature"
          />
        )}
      </div>

      <Text
        as="h3"
        label="forms.fields.tables.notes"
        className="font-medium text-xl mt-4"
        data-testid="document-view-notes-title"
      />

      <FieldTextarea
        placeholder="Note...."
        value={notes || ""}
        onChange={(e) => setNotes(e.target.value)}
        data-testid="document-view-notes-input"
      />
    </>
  );
};

const GedEnvelopDocumentView: FC<GedDocumentViewProps> = ({ document }) => {
  const { t } = useTranslation();
  return (
    <>
      <div
        className="flex flex-col mt-4"
        data-testid="document-view-envelope-section"
      >
        <DocumentViewLine
          label="scenes.customers.conformity.conformity.sendThe"
          value={formatDate(document.created)}
          data-testid="document-view-sent-date"
        />

        <DocumentViewLine
          label="scenes.customers.conformity.conformity.validityDate"
          value={formatDate(document.expiration)}
          data-testid="document-view-validity-date"
        />

        <DocumentViewLine
          label="Categorie"
          value={
            <p data-testid="document-view-category-name">
              {t(
                `documentsCategories.${document.category.name}`,
                document.category.name
              )}
            </p>
          }
          data-testid="document-view-category-line"
        />

        <DocumentViewLine
          label="scenes.customers.conformity.conformity.state"
          value={<StateTag state={getTreatement(document)} />}
          data-testid="document-view-state"
        />

        {document.signature && (
          <DocumentViewLine
            label="scenes.customers.conformity.conformity.signature_type"
            value={
              <p data-testid="document-view-signature-type">
                {t(
                  document.signature?.digital
                    ? "scenes.customers.conformity.conformity.signature_type_digital"
                    : "scenes.customers.conformity.conformity.signature_type_manual"
                )}
              </p>
            }
            data-testid="document-view-signature"
          />
        )}
      </div>
    </>
  );
};

interface DocumentViewLineProps {
  label: string;
  value: string | JSX.Element;
  "data-testid"?: string;
}
function DocumentViewLine({
  label,
  value,
  "data-testid": dataTestId,
}: DocumentViewLineProps) {
  return (
    <div className="flex border-b py-1.5 text-sm" data-testid={dataTestId}>
      <Text label={label} className="text-[#9DA1AB] font-medium grow text-sm" />
      {isValidElement(value) ? value : <p>{value}</p>}
    </div>
  );
}

interface GenDocumentViewProps {
  document?: Document;
  isEnvelopeView?: boolean;
  envelope?: { digital: boolean; id: string };
  refetch: () => void;
  isLoading: boolean;
  categoryOptions: { label: string; value: string }[];
  onDocumentSubmit: GedV2ContentProps["onDocumentSubmit"];
}

export function GenDocumentView({
  document,
  refetch,
  categoryOptions,
  envelope,
  isLoading,
  isEnvelopeView = false,
}: GenDocumentViewProps) {
  const [notes, setNotes] = useState<string | null>(document?.notes || "");
  const { t } = useTranslation();

  const { documentUpdate, documentNotification } = useDocumentActions({
    document,
    t,
    refetch,
    setShowDialog: () => null,
  });

  const onSubmit = () => {
    if (isEnvelopeView) {
      documentNotification.mutate({
        documentId: document?.id as string,
        requests: [
          {
            transport: NotificationTransport.Mail,
          },
        ],
      });
    } else {
      documentUpdate.mutate({
        id: document?.id as string,
        update: {
          notes,
        },
      });
    }
  };

  useEffect(() => {
    setNotes(document?.notes || "");
  }, [document?.notes]);

  if (isLoading) return <LoadingSkeleton />;
  if (!document) return null;

  return (
    <div
      className="relative grow flex flex-col items-center p-8 pb-2 gap-4"
      data-testid="document-view"
    >
      <div
        className="absolute right-2 top-2"
        data-testid="document-view-actions"
      >
        <DocumentActions
          document={document}
          refetch={refetch}
          envelope={envelope}
          categoryOptions={categoryOptions}
        />
      </div>
      <div
        className="flex items-center justify-between"
        data-testid="document-view-header"
      >
        {document.signature ? (
          <Icon
            type="pdf-signed"
            className="w-24 h-24 mr-4"
            data-testid="document-view-pdf-signed"
          />
        ) : (
          <Icon
            type="pdf"
            className="w-24 h-24 mr-4"
            data-testid="document-view-pdf"
          />
        )}
        <h2
          className="font-medium text-3xl max-h-full"
          data-testid="document-view-name"
        >
          {document?.name?.length > 60
            ? `${document?.name?.substring(0, 59)}…`
            : document?.name}
        </h2>
      </div>
      <div className="flex flex-col w-full">
        <h3
          className="font-medium text-xl"
          data-testid="document-view-informations"
        >
          Informations
        </h3>
        {isEnvelopeView ? (
          <GedEnvelopDocumentView document={document} />
        ) : (
          <GedCategorieDocumentView
            document={document}
            notes={notes}
            setNotes={setNotes}
          />
        )}
      </div>
      <Button
        type="submit"
        id="document-view-submit"
        label={
          isEnvelopeView
            ? "forms.fields.actions.sendBack"
            : "forms.fields.actions.save"
        }
        className="m-auto mt-7"
        onClick={onSubmit}
        loading={documentUpdate.isLoading || documentNotification.isLoading}
      />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div
      className="flex flex-1 flex-col items-center p-8 pb-2 gap-4"
      data-testid="document-view-skeleton"
    >
      <div className="flex items-center justify-between w-full">
        <Skeleton width="96px" height="96px" className="mr-4" />
        <Skeleton width="70%" height="3rem" />
      </div>

      <div className="flex flex-col w-full">
        <Skeleton width="150px" height="2rem" className="mb-4" />

        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center py-1.5">
              <Skeleton width="30%" height="1.5rem" />
              <Skeleton width="40%" height="1.5rem" />
            </div>
          ))}
        </div>

        <Skeleton width="150px" height="2rem" className="mt-4 mb-2" />
        <Skeleton width="100%" height="100px" />
      </div>

      <Skeleton width="120px" height="2.5rem" className="mt-7" />
    </div>
  );
}
