import { useNavigate, useParams } from "@tanstack/react-router";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { Tooltip } from "primereact/tooltip";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import Table from "../../../../../components/Table";
import { DataType } from "../../../../../components/Table/tableTypes";
import {
  DeleteConfirmationDialog,
  formatCurrency,
  globalAmountFormatting,
} from "../../../../../helpers";
import { useCurrentRoute } from "../../../../../hooks/useCurrentRoute";
import { useToast } from "../../../../../hooks/useToast";
import { gql } from "../../../../../service/client";
import {
  AssetGroup,
  CustomerAsset,
  UnderManagementAssetGroupsQuery,
  WealthFilter,
} from "../../../../../types";
import { customerEditRoute } from "../route";
import { AssetDetailLogic } from "./AssetDetail/assetDetail.logic";
import { FinancialItem } from "./globalWealthTab";
import { CustomerWealthAssetSearch } from "./route";

type QueryResult = NonNullable<
  UnderManagementAssetGroupsQuery["customerWealth"]
>;

type AssetQueryResult = NonNullable<QueryResult[number]["assets"]>;

const dataTypeValue: Record<string, DataType> = {
  openOwnershipModal: {
    type: "action",
    sortable: false,
    className: "w-[40px]",
  },
  underManagement: {
    type: "boolean",
    sortable: true,
    className: "w-14",
    header: (
      <>
        <Tooltip target=".custom-target-icon" className="text-sm" />
        <i
          className="pi pi-flag-fill custom-target-icon mx-2 cursor-pointer text-slate-600"
          data-pr-position="right"
          data-pr-at="right+5 top"
          data-pr-my="left center-2"
        />
      </>
    ),
  },
  name: {
    type: "string",
    sortable: true,
  },
  category: {
    type: "string",
    sortable: true,
  },
  owner: {
    type: "string",
    sortable: true,
  },
  valuation: {
    type: "amount",
    sortable: true,
    field: "amount.value",
    className: "w-32",
  },
  delete: {
    type: "action",
    sortable: false,
    className: "w-14",
  },
};
const dataTypeWithRisk: Record<string, DataType> = {
  openOwnershipModal: {
    type: "action",
    sortable: false,
    className: "w-[40px]",
  },
  underManagement: {
    type: "boolean",
    sortable: true,
    className: "w-14",
    header: (
      <>
        <Tooltip target=".custom-target-icon" className="text-sm" />
        <i
          className="pi pi-flag-fill custom-target-icon mx-2 cursor-pointer text-slate-600"
          data-pr-position="right"
          data-pr-at="right+5 top"
          data-pr-my="left center-2"
        />
      </>
    ),
  },
  name: {
    type: "string",
    sortable: true,
  },
  category: {
    type: "string",
    sortable: true,
  },
  owner: {
    type: "string",
    sortable: true,
  },
  risk: {
    type: "string",
    sortable: true,
    className: "w-14",
  },
  valuation: {
    type: "amount",
    sortable: true,
    field: "amount.value",
    className: "w-32",
  },
  delete: {
    type: "action",
    sortable: false,
    className: "w-14",
  },
};
const dataTypeBenefits: Record<string, DataType> = {
  openOwnershipModal: {
    type: "action",
    sortable: false,
    className: "w-[40px]",
  },
  underManagement: {
    type: "boolean",
    sortable: true,
    className: "w-14",
    header: (
      <>
        <Tooltip target=".custom-target-icon" className="text-sm" />
        <i
          className="pi pi-flag-fill custom-target-icon mx-2 cursor-pointer text-slate-600"
          data-pr-position="right"
          data-pr-at="right+5 top"
          data-pr-my="left center-2"
        />
      </>
    ),
  },
  name: {
    type: "string",
    sortable: true,
  },
  category: {
    type: "string",
    sortable: true,
  },
  delete: {
    type: "action",
    sortable: false,
    className: "w-14",
  },
};
interface AssetTableProps {
  value: FinancialItem[];
  showValuation?: boolean;
  passiveAsset: CustomerAsset;
  onRowClick: (asset: CustomerAsset) => void;
  managementSwitch?: (item: FinancialItem, toDomain: WealthFilter) => void;
}

const UnderManagementSwitch = ({
  financialItem,
  managementSwitch,
}: {
  financialItem: FinancialItem;
  managementSwitch?: (item: FinancialItem, toDomain: WealthFilter) => void;
}) => {
  const isUnderManagement = financialItem.underManagement;
  const menuLeft = useRef<Menu>(null);
  const { t } = useTranslation();

  const switchToDomain = isUnderManagement
    ? WealthFilter.Customers
    : WealthFilter.UnderManagements;

  const items: MenuItem[] = [];
  if (financialItem.isManual) {
    items.push({
      label: t("components.asset_table.management_menu.title"),
      items: [
        {
          label: t(
            `components.asset_table.management_menu.items.mark_${switchToDomain}`
          ),
          icon: "pi pi-angle-double-right",
          command: () => managementSwitch?.(financialItem, switchToDomain),
        },
      ],
    });
  } else {
    items.push({
      label: t(`components.asset_table.management_update_not_allowed.title`),
      className: "py-1 font-semibold",
      icon: "pi pi-lock",
      disabled: true,
    });
  }

  return (
    <>
      <Tooltip target=".custom-target-icon" className="text-sm" />
      {items.length > 0 ? (
        <Menu model={items} popup ref={menuLeft} id="management_menu" />
      ) : null}
      <i
        className="pi pi-flag-fill custom-target-icon mx-2 cursor-pointer"
        data-pr-tooltip={t(
          isUnderManagement
            ? "scenes.wealth.isUnderManagement"
            : "scenes.wealth.isNotUnderManagement"
        )}
        onClick={(e) => menuLeft?.current?.toggle(e)}
        data-pr-position="right"
        data-pr-at="right+5 top"
        data-pr-my="left center-2"
        aria-controls="management_menu"
        style={{ color: isUnderManagement ? "#4761C8" : "#de4545" }}
      ></i>
    </>
  );
};

export function AssetTable({
  value,
  passiveAsset,
  showValuation = true,
  onRowClick,
  managementSwitch,
}: AssetTableProps) {
  const { t } = useTranslation();
  const [customerDeletion, setCustomerDeletion] = useState<string>();
  const queryClient = useQueryClient();
  const toast = useToast();

  const currentRoute = useCurrentRoute();
  const navigate = useNavigate({
    from: currentRoute.routeId,
  });
  const params = useParams({
    from: "/company/$companyId/customer/$customerId",
  });
  const deletionMutation = useMutation(
    "asset_delete",
    ({ assetID }: { assetID: string }) =>
      gql.client.request(AssetDetailLogic.deletion(), {
        assetID,
        companyID: params.companyId,
      }),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["underManagementAssetGroups"]);
        queryClient.invalidateQueries([res.assetDeletion?.id]);
        queryClient.invalidateQueries(["customer_wealth"]);

        toast?.current?.show({
          severity: "success",
          summary: t("forms.fields.notifications.success.delete") as string,
        });
      },
      onError: () => {
        toast?.current?.show({
          severity: "error",
          summary: t("forms.fields.notifications.error.delete") as string,
        });
      },
    }
  );

  const nameBodyTemplate = (financialItem: FinancialItem) => {
    return (
      <div
        className="flex items-center rounded-l-xl pl-1 pr-3 text-left text-sm text-grey-700"
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
        onClick={() => onRowClick(financialItem)}
      >
        {financialItem.group === AssetGroup.Banking
          ? financialItem.metadata?.bank ?? financialItem.name
          : financialItem.name}
      </div>
    );
  };

  const subcateBodyTemplate = (financialItem: FinancialItem) => {
    return (
      <div
        className="flex items-center rounded-l-xl pl-1 pr-3 text-left text-sm text-grey-700"
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
        onClick={() => onRowClick(financialItem)}
      >
        {t(
          financialItem.categoryName
            ? financialItem.group === AssetGroup.Exotic
              ? `asset_categories_exotic.${financialItem.categoryName}`
              : `asset_categories.${financialItem.categoryName}`
            : "-"
        )}
      </div>
    );
  };

  const valuationBodyTemplate = (financialItem: FinancialItem) => {
    if (!showValuation) {
      return Intl.NumberFormat(undefined, {
        ...globalAmountFormatting,
        currency: "EUR",
      }).format(Math.abs(financialItem.amount?.value ?? 0));
    }

    // const showPerformance =
    //   financialItem?.performance && passiveAsset.name !== AssetGroup.Banking;

    return (
      <div
        className="my-1 flex flex-col items-end justify-end"
        onClick={() => onRowClick(financialItem)}
      >
        <span className="font-bold text-sm text-grey-800">
          {Intl.NumberFormat(undefined, {
            ...globalAmountFormatting,
            currency: "EUR",
          }).format(financialItem.valuation ?? 0)}
        </span>
        {/* {showPerformance ? (
          <DoubleLabel
            data={financialItem.performance as Performance}
            displayValue="evolution"
          />
        ) : null} */}
      </div>
    );
  };

  const sriBodyTemplate = (financialItem: FinancialItem) => {
    return (
      <div
        className="my-1 flex flex-col items-end justify-end w-1/2"
        onClick={() => onRowClick(financialItem)}
      >
        <span className="font-bold text-sm text-grey-800">
          {financialItem.sri ?? "-"}
        </span>
      </div>
    );
  };

  const ownerBodyTemplate = (financialItem: FinancialItem) => {
    let ownership =
      financialItem.owners?.find(
        (owner) => owner.entity?.id === params.customerId
      )?.ownership ?? financialItem?.metadata?.ownership;

    if (ownership) ownership = ownership > 1 ? ownership : ownership * 100;
    return (
      <div
        className="flex items-center rounded-l-xl pl-1 pr-3 text-left text-sm text-grey-700"
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
        onClick={() => onRowClick(financialItem)}
      >
        {ownership
          ? ownership + "%"
          : t(`forms.fields.wealth.ownership.common`)}
      </div>
    );
  };

  const openOwnershipModalBodyTemplate = (item: AssetQueryResult[number]) => {
    return (
      <button
        className="w-full flex justify-center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate({
            search: (current: CustomerWealthAssetSearch) => ({
              ...current,
              assetOwnershipID: item.id,
            }),
          } as never);
        }}
      >
        <i className="notification-target-icon pi pi-ellipsis-h h-4 w-4 cursor-pointer" />
      </button>
    );
  };

  const ActionBodyTemplate = (financialItem: FinancialItem) => {
    return (
      <div className="w-full flex justify-center">
        {editBodyTemplate(financialItem)}
        {deleteBodyTemplate(financialItem)}
      </div>
    );
  };

  const editBodyTemplate = (financialItem: FinancialItem) => {
    return (
      <button
        className="mr-1"
        onClick={() =>
          navigate({
            to: customerEditRoute.id,
            params: {
              companyId: params.companyId as string,
              customerId: params.customerId as string,
              assetId: financialItem.id,
            },
          })
        }
      >
        <i
          className="notification-target-icon pi pi-pencil h-4 w-4 cursor-pointer"
          data-pr-tooltip={t("forms.fields.tables.edit") as string}
        />
      </button>
    );
  };

  const deleteBodyTemplate = (financialItem: FinancialItem) => {
    return (
      <button
        className=""
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setCustomerDeletion(financialItem.id);
        }}
      >
        <i className="notification-target-icon pi pi-trash text-red-500 h-4 w-4 cursor-pointer" />
      </button>
    );
  };

  return (
    <>
      <Table
        data={value}
        dataType={
          value[0]?.group === AssetGroup.Benefits
            ? dataTypeBenefits
            : value[0]?.group === AssetGroup.LifeInsuranceCapitalization ||
                value[0]?.group === AssetGroup.RetirementEmployee ||
                value[0]?.group === AssetGroup.RockPaper ||
                value[0]?.group === AssetGroup.Securities
              ? dataTypeWithRisk
              : dataTypeValue
        }
        className="shadow-none table-fixed"
        defaultSort="name"
      >
        <Table.Head translationPrefix="forms.fields.tables" />
        <Table.Body>
          {({ data }: { data: FinancialItem[] }) =>
            data?.map((element, index) => (
              <Table.Row key={index}>
                <Table.Cell
                  type="action"
                  value={openOwnershipModalBodyTemplate(element)}
                />
                <Table.Cell className="w-5">
                  <UnderManagementSwitch
                    financialItem={element}
                    managementSwitch={managementSwitch}
                  />
                </Table.Cell>
                <Table.Cell
                  value={nameBodyTemplate(element)}
                  className="truncate"
                />
                <Table.Cell
                  value={subcateBodyTemplate(element)}
                  className="truncate"
                />
                <Table.Cell
                  value={ownerBodyTemplate(element)}
                  className="truncate"
                />
                {element.group === AssetGroup.LifeInsuranceCapitalization ||
                element.group === AssetGroup.RetirementEmployee ||
                element.group === AssetGroup.RockPaper ||
                element.group === AssetGroup.Securities ? (
                  <Table.Cell
                    value={sriBodyTemplate(element)}
                    className="truncate"
                  />
                ) : null}
                {!(element.group === AssetGroup.Benefits) ? (
                  <Table.Cell
                    type="amount"
                    value={formatCurrency({ value: element.valuation })}
                    className="truncate"
                  />
                ) : null}

                <Table.Cell type="action" value={ActionBodyTemplate(element)} />
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
      <DeleteConfirmationDialog
        visible={!!customerDeletion}
        loading={deletionMutation.isLoading}
        onDeleteConfirmation={() => {
          !!customerDeletion &&
            deletionMutation.mutate({ assetID: customerDeletion });
          setCustomerDeletion(undefined);
        }}
        onClose={() => setCustomerDeletion(undefined)}
      />
    </>
  );
}
