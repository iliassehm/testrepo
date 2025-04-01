import clsx from "clsx";



import { Text } from "../../../../../components";
import { NotificationByType, NotificationType } from "../../../../../types";
import { CategoryList } from "./CategoryList";

export const regulationTypes = [
  NotificationType.DocumentSend,
  NotificationType.ReportingSend,
  NotificationType.DocumentSignature,
  NotificationType.InformationFill,
  NotificationType.TaskReminder,
  NotificationType.DocumentExpiration,
  NotificationType.RegulationKitUpdate,
  NotificationType.AutomaticReminder,
  NotificationType.InvestProfileUpdate,
  NotificationType.OtherRegulation,
  NotificationType.EnvelopeReminder,
];
export const aggregationTypes = [
  NotificationType.DocumentSend,
  NotificationType.AggregationCgp,
  NotificationType.AggregationClient,
  NotificationType.AggregationBlocked,
  NotificationType.OtherAggregation,
];

export const projectTypes = [
  NotificationType.Arbitrage,
  NotificationType.Redemption,
  NotificationType.Subscription,
  NotificationType.NewProject,
  NotificationType.OtherProject,
];

export const commercialTypes = [
  NotificationType.FundMovement,
  NotificationType.Campaign,
  NotificationType.CustomerResponse,
];

export const NotificationCategoriesEnum = {
  regulation: "regulation",
  aggregation: "aggregation",
  project: "project",
  commercial: "commercial",
} as const;

export type NotificationCategories = keyof typeof NotificationCategoriesEnum;

export function getNotificationCategoryFromType(type: NotificationType) {
  if (regulationTypes.includes(type)) return "regulation";
  if (aggregationTypes.includes(type)) return "aggregation";
  if (projectTypes.includes(type)) return "project";
  if (commercialTypes.includes(type)) return "commercial";
  return "regulation";
}

interface GroupListProps extends GeneralSectionProps {
  categoryList: Record<string, NotificationByType[]>;
  selectedItem: NotificationByType | null;
  onCategorySelect: (item: NotificationByType) => void;
}

export function GroupList({
  count,
  showAll,
  categoryList,
  selectedItem,
  onAllSelect,
  onCategorySelect,
}: GroupListProps) {
  return (
    <div className="md:w-65 shrink-0 bg-stone-100 rounded-lg overflow-auto">
      <div className="p-4">
        <GeneralSection
          count={count}
          showAll={showAll}
          onAllSelect={onAllSelect}
        />

        <CategoryList
          category="regulation"
          prefix="notifications.list."
          onSelect={onCategorySelect}
          items={categoryList.regulation.sort(sortByTypeOrder(regulationTypes))}
          selectedItem={selectedItem}
        />

        <CategoryList
          category="aggregation"
          prefix="notifications.list."
          onSelect={onCategorySelect}
          items={categoryList.aggregation.sort(
            sortByTypeOrder(aggregationTypes)
          )}
          selectedItem={selectedItem}
        />

        <CategoryList
          category="project"
          prefix="notifications.list.projects."
          onSelect={onCategorySelect}
          items={categoryList.project.sort(sortByTypeOrder(projectTypes))}
          selectedItem={selectedItem}
        />

        <CategoryList
          category="commercial"
          prefix="notifications.list."
          onSelect={onCategorySelect}
          items={categoryList.commercial.sort(sortByTypeOrder(commercialTypes))}
          selectedItem={selectedItem}
        />
      </div>
      <div className="h-1" />
    </div>
  );
}

function sortByTypeOrder(typesOrder: NotificationType[]) {
  return (a: NotificationByType, b: NotificationByType): number => {
    const orderA = typesOrder.indexOf(a.type);
    const orderB = typesOrder.indexOf(b.type);

    return (
      (orderA !== -1 ? orderA : typesOrder.length) -
      (orderB !== -1 ? orderB : typesOrder.length)
    );
  };
}

interface GeneralSectionProps {
  showAll: boolean;
  count: number;
  onAllSelect: () => void;
}
function GeneralSection({ count, showAll, onAllSelect }: GeneralSectionProps) {
  return (
    <div className="mb-5">
      <Text
        as="h3"
        className="font-bold text-blue-800"
        label="notifications.group.general.title"
      />
      <div
        className={clsx(
          "flex justify-between items-center pl-3 cursor-pointer",
          showAll && "bg-white"
        )}
        onClick={onAllSelect}
      >
        <Text
          as="span"
          className="mr-4 text-sm text-[#9DA1AB]"
          label="notifications.group.general.all"
        />

        <div
          className={clsx(
            "flex justify-center items-center text-xs text-white rounded w-[25px] h-[20px] text-center",
            showAll
              ? "bg-blue-800 border border-blue-800"
              : "bg-[#919cd2] border border-[#919cd2]"
          )}
        >
          {count}
        </div>
      </div>
    </div>
  );
}