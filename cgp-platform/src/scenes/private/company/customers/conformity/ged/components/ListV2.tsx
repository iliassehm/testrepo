import { MoreHorizontal } from "lucide-react";
import { Skeleton } from "primereact/skeleton";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Loading, Text } from "../../../../../../../components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../../../components/dropdown";
import { getTreatement } from "../../../../../../../constants";
import { clsx } from "../../../../../../../helpers";
import type {
  CategoryDocumentsListQuery,
  Document,
  DocumentCategoryV2,
  Treatement,
} from "../../../../../../../types";
import type { GedV2ContentProps, IdOrName } from "./GedContentV2";

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

export type GedListItemV2Item = NonNullable<
  NonNullable<CategoryDocumentsListQuery["documentCategory"]>["documents"]
>[number];

type ListProps<
  T extends GedListItemV2Item | DocumentCategoryV2,
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
  isLoading?: boolean;
  onSelect: (item: T) => void;
  onEdit?: GedV2ContentProps["onCategoryEdit"];
  onDelete?: GedV2ContentProps["onCategoryDelete"];
};

export function GedListV2<
  T extends GedListItemV2Item | DocumentCategoryV2,
  TKey extends keyof T,
>({
  items = [],
  selected,
  selectedKey,
  isCategory = false,
  showTreatement = false,
  showDate = false,
  showActions = true,
  isLoading = false,
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
    items?.sort((a, b) => {
      const _a: DocumentCategoryV2 = a as DocumentCategoryV2;
      const _b: DocumentCategoryV2 = b as DocumentCategoryV2;

      if (
        complianceCategoryName(_a.name as string) <
        complianceCategoryName(_b.name as string)
      )
        return -1;
      if (
        complianceCategoryName(_a.name as string) >
        complianceCategoryName(_b.name as string)
      )
        return 1;
      return 0;
    });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <ul className="p-4 flex flex-1 flex-col gap-1 overflow-auto">
      {items?.map((item, i) => {
        let conformityComponent: JSX.Element | null = null;
        const name = complianceCategoryName(item?.name as string);

        if (showTreatement && (item as GedListItemV2Item)?.treatement) {
          const treatment = getTreatement(item as unknown as Document);
          conformityComponent = (
            <div className="w-5 h-5 rounded-full flex items-center justify-center mr-1">
              <img
                height={5}
                width={5}
                src={`/svg/treatment/${treatment}.svg`}
                alt={"treatment"}
                className="w-5 h-5"
                data-testid={`treatment-${treatment}`}
              />
            </div>
          );
        }

        let dateComponent: JSX.Element | null = null;
        if (
          showDate &&
          (item as GedListItemV2Item)?.created &&
          typeof (item as GedListItemV2Item).created === "string"
        ) {
          const date = new Date(
            Date.parse((item as GedListItemV2Item).created)
          );
          dateComponent = (
            <span
              className="text-[11px] text-grey-600"
              data-testid={`date-${date.toISOString()}`}
            >
              {formatDate(date)}
            </span>
          );
        }
        const key = item?.[selectedKey];

        return (
          <li
            key={key as string}
            data-testid={`list-item-${key}`}
            onClick={() => onSelect(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelect(item);
              }
            }}
            className={clsx(
              "flex items-center gap-1 cursor-pointer px-2 py-1 text-gray-400 p2 rounded-lg break-all",
              selected?.[selectedKey] === item?.[selectedKey]
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
                      name?.length > 60 ? `${name.substring(0, 59)}…` : name
                    }
                  />
                  {dateComponent}
                </div>
                {isCategory && item?.name === name && showActions && (
                  <CrudActions
                    data-testid={`${isCategory ? "category" : "document"}-list-item-actions-${key}`}
                    onDelete={
                      onDelete && (() => onDelete(item as unknown as IdOrName))
                    }
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

interface ActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  "data-testid"?: string;
}
export function CrudActions({
  onEdit,
  onDelete,
  "data-testid": dataTestId,
}: ActionsProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <div
          className="cursor-pointer flex items-center h-8 w-8 p-0"
          data-testid={`${dataTestId}-trigger`}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        {onEdit && (
          <DropdownMenuItem
            onClick={onEdit}
            className="cursor-pointer hover:bg-slate-100"
            data-testid={`${dataTestId}-edit`}
          >
            <Text label="forms.fields.tables.edit" as="span" />
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem
            onClick={onDelete}
            className="cursor-pointer hover:bg-slate-100"
            data-testid={`${dataTestId}-delete`}
          >
            <Text label="forms.fields.tables.delete" as="span" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-4 flex flex-1 flex-col gap-2 overflow-auto">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg overflow-hidden"
          data-testid="list-item-skeleton"
        >
          <Skeleton shape="circle" size="2rem" className="flex-shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <Skeleton width="200px" height="1.2rem" />
                <Skeleton width="100px" height="0.8rem" />
              </div>
              <Skeleton width="2rem" height="2rem" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
