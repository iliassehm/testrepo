import { useNavigate, useSearch } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";
import { Tooltip } from "primereact/tooltip";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Text } from "../../../../../../../components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../../../components/dropdown";
import { getTreatement } from "../../../../../../../constants";
import { clsx, DeleteConfirmationDialog } from "../../../../../../../helpers";
import type { Document, Treatement } from "../../../../../../../types";
import { GenDocumentView } from "./GedDocumentView";

const relativeDateFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

function formatDate(date: Date) {
  const diff = date.getTime() - Date.now();
  const day = diff / (86400 * 1000);
  if (day <= -7) return dateTimeFormatter.format(date);

  return relativeDateFormatter.format(Math.ceil(day), "days");
}

type IdOrName = { key: string } | { name: string };

export interface GedContentProps {
  isEnvelopeView?: boolean;
  list: {
    name: string;
    id: string;
    key: string;
    created?: string;
    documents: Document[];
    treatment?: Treatement;
  }[];
  refetch: () => void;
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
}

export function GedContent({
  list,
  isEnvelopeView = false,
  refetch,
  onCategoryEdit,
  onCategoryDelete,
  onCategoryClick,
  onDocumentAddClick,
  onDocumentSubmit,
}: GedContentProps) {
  const { t, i18n } = useTranslation();
  const { documentId, category } = useSearch({
    from: "/company/$companyId/customer/$customerId/conformity",
  });
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  });
  const navigate = useNavigate();

  const selectedCategory = useMemo(() => {
    const categoryMatch = category
      ? list.find((item) => item.key === category)
      : null;
    const documentMatch = list.find((item) =>
      item.documents.some((doc) => doc.id === documentId)
    );
    return categoryMatch ?? documentMatch ?? list[0];
  }, [category, documentId, list]);

  const selectedDocument = useMemo<Document>(() => {
    return (
      list
        .flatMap((item) => item?.documents)
        .find((doc) => doc.id === documentId) ?? selectedCategory?.documents[0]
    );
  }, [documentId, selectedCategory]);

  const [selectedDeleteCategory, setSelectedDeleteCategory] =
    useState<IdOrName>();

  const documents = useMemo<Document[]>(() => {
    return list
      .flatMap((item) =>
        (isEnvelopeView && item.id === selectedCategory?.id) ||
        (!isEnvelopeView && item.name === selectedCategory?.name)
          ? item?.documents
          : []
      )
      .sort((a, b) => {
        if (a.created && b.created) return b.created.localeCompare(a.created);
        return 0;
      });
  }, [isEnvelopeView, list, selectedCategory]);

  const foundDocument = useMemo(() => {
    return documents.find((doc) => doc.id === selectedDocument?.id);
  }, [isEnvelopeView, list, selectedCategory, selectedDocument]);

  const handleSelectDocument = (document: Document) => {
    navigate({
      to: "/company/$companyId/customer/$customerId/conformity",
      params: params,
      search: {
        tab: "ged",
        documentId: document.id,
        category: document.category.key,
      },
    });
  };

  // Update the selected category and reset the document in URL search params
  const handleSelectCategory = (category: {
    name: string;
    key: string;
    documents: Document[];
  }) => {
    navigate({
      to: "/company/$companyId/customer/$customerId/conformity",
      params: params,
      search: {
        tab: "ged",
        documentId: category.documents[0]?.id,
        category: category.key,
      },
    });
  };

  const envelopeDigital =
    selectedCategory?.documents?.find(
      (document) => document.signature?.digital === true
    ) !== undefined;

  return (
    <>
      <div className="flex md:flex-row flex-col border-2 rounded-lg h-[650px]">
        <div className="md:w-65 shrink-0 bg-stone-100 rounded-lg overflow-auto">
          <Title
            label={
              isEnvelopeView
                ? "scenes.customers.conformity.tabs.envelope"
                : "scenes.customers.conformity.tabs.categories"
            }
            onAdd={onCategoryClick}
          />

          <div className="h-1" />

          <List
            isCategory={!isEnvelopeView}
            items={list}
            selectedKey={isEnvelopeView ? "id" : "name"}
            selected={selectedCategory}
            showTreatement={isEnvelopeView}
            showActions={!isEnvelopeView}
            onEdit={onCategoryEdit}
            onDelete={setSelectedDeleteCategory}
            onSelect={handleSelectCategory}
          />
        </div>

        {selectedCategory && (
          <div className="md:w-65 shrink-0 border-r-4 border-[#F0F0F0] overflow-auto">
            <Title
              label="scenes.customers.conformity.tabs.documents"
              onAdd={() =>
                onDocumentAddClick?.({ category: selectedCategory.key })
              }
            />

            <div className="h-1 bg-[#F0F0F0]" />

            <List
              selectedKey="id"
              selected={selectedDocument}
              showDate
              showTreatement
              items={documents}
              onSelect={handleSelectDocument}
            />
          </div>
        )}
        {foundDocument && (
          <GenDocumentView
            document={foundDocument}
            isEnvelopeView={isEnvelopeView}
            refetch={refetch}
            envelope={
              isEnvelopeView
                ? { digital: envelopeDigital, id: selectedCategory.id }
                : undefined
            }
            isLoading={false}
            categoryOptions={list.map((item) => ({
              value: item.key,
              label: i18n.exists(`documentsCategories.${item.name}`)
                ? t(`documentsCategories.${item.name}`)
                : item.name,
            }))}
            onDocumentSubmit={onDocumentSubmit}
          />
        )}
      </div>
      {!!selectedDeleteCategory && (
        <DeleteConfirmationDialog
          visible={!!selectedDeleteCategory}
          onDeleteConfirmation={() => {
            onCategoryDelete(selectedDeleteCategory);
            setSelectedDeleteCategory(undefined);
          }}
          onClose={() => setSelectedDeleteCategory(undefined)}
        />
      )}
    </>
  );
}

type ListProps<
  T extends Record<string, unknown> & { documents?: unknown[] },
  TKey extends keyof T,
> = {
  isCategory?: boolean;
  selected?: T;
  selectedKey: TKey;
  items: T[];
  showTreatement?: boolean;
  showDate?: boolean;
  conformity?: Treatement;
  showActions?: boolean;
  onSelect: (item: T) => void;
  onEdit?: GedContentProps["onCategoryEdit"];
  onDelete?: GedContentProps["onCategoryDelete"];
};

function List<
  T extends Record<string, unknown> & { documents?: unknown[] },
  TKey extends keyof T,
>({
  items,
  selected,
  selectedKey,
  isCategory = false,
  showTreatement = false,
  showDate = false,
  showActions = true,
  onEdit,
  onSelect,
  onDelete,
}: ListProps<T, TKey>) {
  const { t } = useTranslation();

  const knownCategories = (t("documentsCategories", {
    returnObjects: true,
  }) || {}) as Record<string, string>;

  const complianceCategoryName = useCallback(
    (category: string) => knownCategories[category] ?? category,
    [knownCategories]
  );

  if (isCategory)
    items.sort((a, b) => {
      if (
        complianceCategoryName(a.name as string) <
        complianceCategoryName(b.name as string)
      )
        return -1;
      if (
        complianceCategoryName(a.name as string) >
        complianceCategoryName(b.name as string)
      )
        return 1;
      return 0;
    });

  return (
    <ul className="p-4 flex flex-col gap-1">
      {items.map((item, i) => {
        let conformityComponent: JSX.Element | null = null;
        const name = complianceCategoryName(item.name as string);

        if (showTreatement && item.treatement) {
          conformityComponent = (
            <div className="w-5 h-5 rounded-full flex items-center justify-center mr-1">
              <img
                height={5}
                width={5}
                src={`/svg/treatment/${getTreatement(item as unknown as Document)}.svg`}
                alt={"treatment"}
                className="w-5 h-5"
              />
            </div>
          );
        }

        let dateComponent: JSX.Element | null = null;
        if (showDate && item.created && typeof item.created === "string") {
          dateComponent = (
            <span className="text-[11px] text-grey-600">
              {formatDate(new Date(Date.parse(item.created)))}
            </span>
          );
        }

        return (
          <li
            key={i}
            onClick={() => onSelect(item)}
            className={clsx(
              "flex items-center gap-1 cursor-pointer px-2 py-1 text-gray-400 p2 rounded-lg",
              selected?.[selectedKey] === item[selectedKey]
                ? isCategory
                  ? "text-black bg-white"
                  : "text-black bg-stone-100"
                : ""
            )}
          >
            {conformityComponent}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  {/* <Text as="span" className={"flex 1 truncate text-clip" } label={name} /> */}
                  <Text
                    as="span"
                    label={
                      name.length > 60 ? name.substring(0, 59) + "…" : name
                    }
                  />
                  {dateComponent}
                </div>
                {isCategory && item.name == name && showActions && (
                  <CrudActions
                    onDelete={onDelete && (() => onDelete(item as any))}
                    onEdit={
                      onEdit &&
                      (() =>
                        onEdit(
                          item as unknown as {
                            key: string;
                            name: string;
                            updatedName: string;
                            customerVisibility: boolean;
                          }
                        ))
                    }
                  />
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

interface TitleProps {
  label: string;
  onAdd?: () => void;
}
function Title({ label, onAdd }: TitleProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <Text as="h3" className="font-bold" label={label} />
      {onAdd && (
        <div
          className="flex justify-center items-center w-6 h-6 rounded-full bg-blue-800 text-white hover:!bg-blue-900 cursor-pointer"
          onClick={onAdd}
        >
          <Tooltip target=".pi-plus" />
          <i
            className="pi pi-plus text-xs"
            style={{ color: "white", fontWeight: "900" }}
            data-pr-position="left"
            data-pr-at="left-15 center"
            data-pr-my="right center"
          ></i>
        </div>
      )}
    </div>
  );
}

interface ActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}
export function CrudActions({ onEdit, onDelete }: ActionsProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer flex items-center h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        {onEdit && (
          <DropdownMenuItem
            onClick={onEdit}
            className="cursor-pointer hover:bg-slate-100"
          >
            <Text label="forms.fields.tables.edit" as="span" />
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem
            onClick={onDelete}
            className="cursor-pointer hover:bg-slate-100"
          >
            <Text label="forms.fields.tables.delete" as="span" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
