import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import { Text } from "../../../../../../components";
import Table from "../../../../../../components/Table";
import {
  DeleteConfirmationDialog,
  formatCurrency,
  formatDate,
  globalAmountFormatting,
} from "../../../../../../helpers";
import { useToast } from "../../../../../../hooks/useToast";
import { gql } from "../../../../../../service/client";
import {
  Amount,
  AssetGroup,
  UnderManagementAssetGroupsQuery,
} from "../../../../../../types";
import { AssetDetailLogic } from "../AssetDetail/assetDetail.logic";
import { CustomerWealthAssetSearch } from "../route";
import { DataType } from "./investmentTableUtils";

type QueryResult = NonNullable<
  UnderManagementAssetGroupsQuery["customerWealth"]
>;

type AssetQueryResult = NonNullable<QueryResult[number]["assets"]>;

interface Props {
  data: QueryResult[number]["assets"];
}

export const dataType: Record<string, DataType> = {
  openOwnershipModal: {
    type: "action",
    sortable: false,
    className: "bg-white",
  },
  accountNumber: { type: "string", sortable: true, className: "bg-white" },
  insuranceCompany: { type: "string", sortable: true, className: "bg-white" },
  name: { type: "string", sortable: true, className: "bg-white" },
  openDate: { type: "date", sortable: true, className: "bg-white" },
  owner: { type: "string", sortable: true, className: "bg-white" },
  ownershipMode: { type: "string", sortable: true, className: "bg-white" },
  transfersAmount: { type: "amount", sortable: true, className: "bg-white" },
  withdrawalAmount: { type: "amount", sortable: true, className: "bg-white" },
  risk: { type: "number", sortable: true, className: "bg-white" },
  activity: { type: "amount", sortable: true, className: "bg-white" },
  delete: { type: "action", sortable: false, className: "bg-white" },
};

export function WalletTable({ data }: Props) {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate({
    from: "/company/$companyId/customer/$customerId/wealth/",
  });
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/wealth/",
  });

  const [customerDeletion, setCustomerDeletion] = useState<string>();

  const queryClient = useQueryClient();

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
      },
      onError: () => {
        toast?.current?.show({
          severity: "error",
          summary: t("forms.fields.notifications.error.delete") as string,
        });
      },
    }
  );

  // Events
  const navigateToWallet = (asset: AssetQueryResult[number]) => {
    if (asset.group === AssetGroup.Crypto) {
      navigate({
        search: (current: CustomerWealthAssetSearch) => ({
          ...current,
          assetOwnershipID: asset.id,
        }),
      } as never);
    } else
      navigate({
        to: "/company/$companyId/customer/$customerId/wealth/$type/$investmentId",
        params: {
          ...params,
          investmentId: asset.id,
          type: asset.group,
        },
      });
  };

  if (!data) return null;

  const totalTransfersAmount = data.reduce(
    (acc, wallet) => acc + ((wallet.transfersAmount as Amount)?.value ?? 0),
    0
  );

  const totalWithdrawalAmount = data.reduce(
    (acc, wallet) => acc + ((wallet.withdrawalAmount as Amount)?.value ?? 0),
    0
  );

  const deleteBodyTemplate = (item: AssetQueryResult[number]) => {
    return (
      <button
        className="w-full flex justify-center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setCustomerDeletion(item.id);
        }}
      >
        <i className="notification-target-icon pi pi-trash text-red-500 h-4 w-4 cursor-pointer" />
      </button>
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

  const getOwnership = (item: AssetQueryResult[number]) => {
    const ownership = item.owners?.find(
      (owner) => owner.entity?.id === params.customerId
    )?.ownership;
    if (ownership) {
      return ownership * 100 + "%";
    }
    return null;
  };

  const getOwnershipMode = (item: AssetQueryResult[number]) => {
    const ownershipMode = item.owners?.find(
      (owner) => owner.entity?.id === params.customerId
    )?.mode;
    if (ownershipMode) {
      return t(`scenes.customers.wealth.ownershipModal.mode.${ownershipMode}`);
    }
    return null;
  };

  return (
    <Table data={data} dataType={dataType} className="shadow-none">
      <Table.Head translationPrefix="forms.fields.tables" />
      <Table.Body>
        {({ data }: { data: QueryResult[number]["assets"] }) =>
          data?.map((element, index) => (
            <Table.Row key={index} onClick={() => navigateToWallet(element)}>
              <Table.Cell
                type="action"
                value={openOwnershipModalBodyTemplate(element)}
              />
              <Table.Cell value={element.accountNumber} />
              <Table.Cell
                value={
                  element.metadata?.establishment?.name ??
                  element.metadata?.insuranceCompany ??
                  element.metadata?.bank
                }
              />
              <Table.Cell value={element.name} />
              <Table.Cell type="date" value={formatDate(element.openDate)} />
              <Table.Cell
                value={
                  getOwnership(element) ??
                  t(`forms.fields.wealth.ownership.common`)
                }
                className="truncate"
              />
              <Table.Cell
                value={
                  getOwnershipMode(element) ??
                  t(`forms.fields.wealth.ownership.common`)
                }
                className="truncate"
              />
              <Table.Cell
                type="amount"
                value={formatCurrency(element.transfersAmount)}
              />
              <Table.Cell
                type="amount"
                value={formatCurrency(element.withdrawalAmount)}
              />
              <Table.Cell
                type="number"
                value={element.sri && element.sri > 0 ? element.sri : "-"}
              />
              <Table.Cell
                type="amount"
                value={formatCurrency({ value: element.valuation })}
              />
              <Table.Cell type="action" value={deleteBodyTemplate(element)} />
            </Table.Row>
          ))
        }
      </Table.Body>
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
      <Table.Foot>
        <Table.Row className="font-bold text-black">
          <Table.Cell value="Total" className="font-bold text-black" />
          <Table.Cell value="" colSpan={6} />
          <Table.Cell
            type="amount"
            value={formatCurrency({
              value: totalTransfersAmount,
              instrument: "EUR",
            })}
            className="font-bold text-black"
          />
          <Table.Cell
            type="amount"
            value={formatCurrency({
              value: totalWithdrawalAmount,
              instrument: "EUR",
            })}
            className="font-bold text-black"
          />
          <Table.Cell value="" colSpan={2} />
        </Table.Row>
      </Table.Foot>
    </Table>
  );
}

function performanceBodyTemplate(asset: AssetQueryResult[number]) {
  return (
    <div className="inline-block text-right my-2">
      <Text
        label={Intl.NumberFormat(undefined, {
          ...globalAmountFormatting,
          currency: "EUR",
        }).format(asset.activity?.value ?? 0)}
        className="font-bold text-base text-grey-800"
      />
    </div>
  );
}

// const gainBodyTemplate = (wallet: CustomerWallet) => {
//   const value =
//     wallet.withdrawalAmount.value +
//     wallet.valuation.value -
//     wallet.transfersAmount.value;

//   return formatCurrency({ value, instrument: "EUR" });
// };
