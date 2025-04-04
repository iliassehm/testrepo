import clsx from "clsx";
import { Tooltip } from "primereact/tooltip";
import { useTranslation } from "react-i18next";

import { Text } from "../../../../../components";

interface CategoryListItem {
  id: string;
  label: string;
  count: number;
}

interface CategoryListProps {
  categoryName: string;
  items: CategoryListItem[];
  onSelect: (item?: CategoryListItem["id"]) => void;
  selected?: CategoryListItem["id"];
  prefix?: string;
  addCategory?: () => void;
}

export function CategoryList({
  categoryName,
  items,
  onSelect,
  selected,
  prefix = "",
  addCategory,
}: CategoryListProps) {
  const { t, i18n } = useTranslation();
  return (
    <div className="w-full mb-4 space-y-2">
      <div className="flex items-center">
        <Text
          as="h3"
          className="font-bold text-blue-800"
          label={categoryName}
        />
        {addCategory && (
          <div
            className="flex justify-center items-center w-5 h-5 rounded-full bg-blue-800 text-white hover:!bg-blue-900 cursor-pointer ml-2"
            id="addTaskCategoryButton"
            onClick={() => addCategory()}
          >
            <Tooltip target="#addTaskCategoryButton" position="top">
              {t("forms.taskForm.category.add")}
            </Tooltip>
            <i
              className={`pi pi-plus text-xs`}
              style={{ color: "white", fontWeight: "900" }}
              data-pr-position="left"
              data-pr-at="left-15 center"
              data-pr-my="right center"
            ></i>
          </div>
        )}
      </div>
      <ul className="list-none w-full -space-y-1">
        {items
          .filter((item) => item.label)
          .map((item, index) => (
            <li
              key={index}
              onClick={() => onSelect(item.id)}
              className={clsx(
                "flex justify-between items-center select-none p-1 pl-3 rounded-md cursor-pointer border border-transparent hover:border-gray-200",
                selected === item.id ? "bg-white !border-gray-200" : ""
              )}
            >
              <Text as="span" className="mr-4 text-sm text-[#9DA1AB]">
                {item.label
                  ? item.label ===
                    "wealthcome.internal.task.category.no_category"
                    ? `${prefix}no_category`
                    : i18n.exists("forms.taskForm.categories." + item.label)
                      ? `${prefix}${item.label}`
                      : item.label
                  : ""}
              </Text>
              {item.count && (
                <div
                  className={clsx(
                    "flex shrink-0 justify-center items-center text-xs text-white rounded w-[25px] h-[20px] text-center",
                    selected === item.id
                      ? "bg-blue-800 border border-blue-800"
                      : "bg-[#919cd2] border border-[#919cd2]"
                  )}
                >
                  {item.count}
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
