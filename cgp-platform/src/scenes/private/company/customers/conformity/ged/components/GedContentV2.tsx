import { Tooltip } from "primereact/tooltip";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Text } from "../../../../../../../components";
import { DeleteConfirmationDialog } from "../../../../../../../helpers/dialog";
import type { useDocumentFlow } from "../../../../../../../hooks/useDocumentFlow";
import type { useEnvelopeFlow } from "../../../../../../../hooks/useEnvelopeFlow";
import type { EnvelopeCategory } from "../../../../../../../hooks/useEnvelopeFlow";
import type { Document, DocumentCategoryV2 } from "../../../../../../../types";
import { GenDocumentView } from "./GedDocumentView";
import { GedListV2 } from "./ListV2";
import type { GedListItemV2Item } from "./ListV2";

export type IdOrName = { key: string } | { name: string };

type ExtendDocumentFlow = ReturnType<typeof useDocumentFlow>;
type ExtendEnvelopeFlow = ReturnType<typeof useEnvelopeFlow>;

export interface GedV2ContentProps
  extends Omit<
    ExtendDocumentFlow | ExtendEnvelopeFlow,
    | "deleteCategoryMutation"
    | "documentAddMutation"
    | "categoryUpdateMutation"
    | "categoryCreationMutation"
    | "selectedCategory"
  > {
  isEnvelopeView?: boolean;
  onCategoryEdit?: (params: {
    key: string;
    name: string;
    updatedName: string;
    customerVisibility: boolean;
  }) => void;
  onCategoryClick: () => void;
  onDocumentSubmit: (data: { name: string }) => void;
  onDocumentAddClick?: (data: { category: string }) => void;
  onCategoryDelete: (params: IdOrName) => void;
  selectedCategory: DocumentCategoryV2 | EnvelopeCategory | null;
}

export function GedContentV2({
  documents,
  categories,
  documentUrl,
  documentInfo,
  selectedDocument,
  selectedCategory,
  isCategoriesLoading,
  isDocumentsLoading,
  isDocumentInfoLoading,
  isEnvelopeView = false,
  onCategoryEdit,
  onCategoryClick,
  onDocumentSubmit,
  refetchDocuments,
  onCategoryDelete,
  onDocumentAddClick,
  refetchDocumentInfo,
  handleCategorySelect,
  handleDocumentSelect,
}: GedV2ContentProps) {
  const { t, i18n } = useTranslation();
  const [selectedDeleteCategory, setSelectedDeleteCategory] =
    useState<IdOrName | null>(null);

  const documentsSorted = useMemo(() => {
    return (documents as GedListItemV2Item[])?.sort((a, b) => {
      if (a.created && b.created) return b.created.localeCompare(a.created);
      return 0;
    });
  }, [documents]);

  return (
    <>
      <div className="flex md:flex-row flex-col border-2 rounded-lg h-[650px]">
        <div className="flex flex-col md:w-65 shrink-0 bg-stone-100 rounded-lg overflow-auto">
          <Title
            dataTestId={isEnvelopeView ? "envelope-title" : "categories-title"}
            label={
              isEnvelopeView
                ? "scenes.customers.conformity.tabs.envelope"
                : "scenes.customers.conformity.tabs.categories"
            }
            onAdd={onCategoryClick}
          />

          <div className="h-1" />

          <GedListV2
            isCategory={!isEnvelopeView}
            items={categories as DocumentCategoryV2[]}
            selectedKey={
              (isEnvelopeView ? "id" : "key") as keyof DocumentCategoryV2
            }
            selected={selectedCategory as DocumentCategoryV2}
            showTreatement={isEnvelopeView}
            showActions={!isEnvelopeView}
            onEdit={onCategoryEdit}
            onDelete={setSelectedDeleteCategory}
            isLoading={isCategoriesLoading}
            onSelect={
              handleCategorySelect as (
                item: GedListItemV2Item | DocumentCategoryV2
              ) => void
            }
          />
        </div>

        <div className="flex flex-col md:w-65 shrink-0 border-r-4 border-[#F0F0F0] overflow-auto">
          <Title
            label="scenes.customers.conformity.tabs.documents"
            {...(onDocumentAddClick && {
              onAdd: () =>
                onDocumentAddClick?.({
                  category: isEnvelopeView
                    ? (selectedCategory as EnvelopeCategory).id
                    : (selectedCategory as DocumentCategoryV2).key,
                }),
            })}
          />

          <div className="h-1 bg-[#F0F0F0]" />

          <GedListV2
            selectedKey="id"
            selected={selectedDocument as GedListItemV2Item}
            showDate
            showTreatement
            items={documentsSorted}
            isLoading={isCategoriesLoading || isDocumentsLoading}
            onSelect={handleDocumentSelect as (item: GedListItemV2Item) => void}
          />
        </div>
        <GenDocumentView
          document={
            documentInfo
              ? ({ ...documentInfo, url: documentUrl } as Document)
              : undefined
          }
          isEnvelopeView={isEnvelopeView}
          isLoading={
            isCategoriesLoading || isDocumentsLoading || isDocumentInfoLoading
          }
          // isLoading
          refetch={() => {
            refetchDocuments();
            refetchDocumentInfo();
          }}
          envelope={
            isEnvelopeView
              ? {
                  digital: documentInfo?.signature?.digital === true,
                  id: documentInfo?.envelope?.id as string,
                }
              : undefined
          }
          categoryOptions={
            categories?.map((item) => ({
              value: (item as DocumentCategoryV2).key,
              label: i18n.exists(`documentsCategories.${item.name}`)
                ? t(`documentsCategories.${item.name}`)
                : item.name,
            })) ?? []
          }
          onDocumentSubmit={onDocumentSubmit}
        />
      </div>
      {!!selectedDeleteCategory && (
        <DeleteConfirmationDialog
          visible={!!selectedDeleteCategory}
          onDeleteConfirmation={() => {
            onCategoryDelete(selectedDeleteCategory);
            setSelectedDeleteCategory(null);
          }}
          onClose={() => setSelectedDeleteCategory(null)}
        />
      )}
    </>
  );
}

interface TitleProps {
  label: string;
  onAdd?: () => void;
  dataTestId?: string;
}
function Title({ label, onAdd, dataTestId }: TitleProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <Text
        as="h3"
        className="font-bold"
        label={label}
        data-testid={dataTestId}
      />
      {onAdd && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          className="flex justify-center items-center w-6 h-6 rounded-full bg-blue-800 text-white hover:!bg-blue-900 cursor-pointer"
          data-testid={`${dataTestId}-add-button`}
          onClick={onAdd}
        >
          <Tooltip target=".pi-plus" />
          <i
            className="pi pi-plus text-xs"
            style={{ color: "white", fontWeight: "900" }}
            data-pr-position="left"
            data-pr-at="left-15 center"
            data-pr-my="right center"
          />
        </div>
      )}
    </div>
  );
}
