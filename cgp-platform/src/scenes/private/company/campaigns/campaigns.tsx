import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useParams, useSearch } from "@tanstack/react-router";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTableExpandedRows,
  DataTableValueArray,
} from "primereact/datatable";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";

import { AssetIcon, Button, Dialog, Loading } from "../../../../components";
import {
  campaignContractStatusBodyTemplate,
  formatCurrency,
} from "../../../../helpers";
import { useToast } from "../../../../hooks/useToast";
import { gql } from "../../../../service/client";
import {
  CampaignContract,
  CampaignContractStatus,
  Customer,
} from "../../../../types";
import FieldAmount from "../../../../UIComponents/FieldAmount/FieldAmount";
import { Label } from "../../../../UIComponents/Label/Label";
import { CampaignLogic } from "./campaigns.logic";
import { CampaignsDocumentTable } from "./campaignsDocuments";
import { CampaignForm, ModalActionType } from "./campaignsForm";

interface CampaignTableProps {
  contractList: Partial<
    Omit<CampaignContract, "customer"> & {
      customer: Pick<Customer, "id" | "name">;
    }
  >[];
}

function CampaignTableRow({
  contractID: campaignID,
  customerID,
}: {
  contractID: string;
  customerID: string;
}) {
  const params = useParams({
    from: "/company/$companyId/campaigns",
  });

  if (!params.companyId) throw new Error("No company ID provided");

  const { t } = useTranslation();

  const { data, isLoading } = useQuery(
    ["documentList", campaignID, params.companyId],
    () =>
      gql.client.request(CampaignLogic.documentList(), {
        companyID: params.companyId as string,
        contractID: campaignID,
        customerID,
      })
  );

  if (isLoading) return <Loading />;

  return (
    <CampaignsDocumentTable documentList={data?.documentList || []} t={t} />
  );
}

const validationSchema = z.object({
  investment: z.coerce.number().nullish(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

function CampaignCustomerUpdateForm({
  campaignContract,
  onSubmit,
}: {
  campaignContract: CampaignContract;
  onSubmit: (data: ValidationSchema) => void;
}) {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<ValidationSchema>({
    defaultValues: {
      investment: campaignContract.investment.value ?? "",
    },
    resolver: zodResolver(validationSchema),
  });

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="rounded-xl  bg-white">
        <Controller
          name="investment"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t("forms.fields.campaignContractUpdate.investment")}
              </Label>
              <FieldAmount
                id={field.name}
                {...field}
                value={field.value as number}
              />
            </div>
          )}
        />
      </div>
      <Button
        type="submit"
        label="forms.fields.actions.update"
        loading={false}
      />
    </form>
  );
}

function CampaignCustomerAction({
  campaignContract,
  companyID,
}: {
  campaignContract: CampaignContract;
  companyID: string;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showVisible, setShowVisible] = useState(false);
  const toast = useToast();

  const updateCampaignContract = useMutation({
    mutationFn: (data: ValidationSchema & { markAsValid?: boolean }) =>
      gql.client.request(CampaignLogic.updateContract(), {
        contractID: campaignContract.id,
        companyID,
        update: {
          investment: data.investment
            ? { value: data.investment, instrument: "EUR" }
            : undefined,
          markAsValid: data.markAsValid,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries("companyCampaigns");

      toast?.current?.show({
        severity: "success",
        summary: t("forms.fields.notifications.campaignContractUpdate.success"),
      });
    },
    onError: () => {
      toast?.current?.show({
        severity: "error",
        summary: t("forms.fields.notifications.campaignContractUpdate.error"),
      });
    },
  });

  return (
    <div className="flex flex-row justify-end gap-4 self-end">
      {campaignContract.status !== CampaignContractStatus.Valid &&
        campaignContract.status !== CampaignContractStatus.Unused && (
          <button onClick={() => setShowVisible(true)}>
            <i
              className="pi pi-pencil h-4 w-4 cursor-pointer"
              data-pr-tooltip={t("forms.fields.tables.sendByEmail") as string}
            />
          </button>
        )}
      {campaignContract.status === CampaignContractStatus.Unused && (
        <button
          onClick={() => {
            updateCampaignContract.mutate({
              markAsValid: true,
            });
            setShowVisible(false);
          }}
        >
          <i
            className="pi pi-check h-4 w-4 cursor-pointer"
            data-pr-tooltip={t("forms.fields.tables.sendByEmail") as string}
          />
        </button>
      )}
      <Dialog open={showVisible} onOpenChange={() => setShowVisible(false)}>
        <CampaignCustomerUpdateForm
          campaignContract={campaignContract}
          onSubmit={(data) => {
            updateCampaignContract.mutate({
              investment: data.investment,
            });
            setShowVisible(false);
          }}
        />
      </Dialog>
    </div>
  );
}

function CampaignTable({ contractList }: CampaignTableProps) {
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined);
  const params = useParams({
    from: "/company/$companyId/campaigns",
  });
  const { t } = useTranslation();

  if (!contractList) return null;

  return (
    <DataTable
      value={contractList}
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data)}
      rowExpansionTemplate={(contract) => (
        <CampaignTableRow
          contractID={contract.id as string}
          customerID={contract.customer?.id as string}
        />
      )}
      emptyMessage={t(`emptyMessage.noClient`)}
    >
      <Column expander={true} style={{ width: "60px" }} />
      <Column
        field="customer.name"
        sortable
        header={t("forms.fields.tables.name") as string}
        style={{ width: "50%" }}
        body={(data: CampaignContract) => (
          <Link
            to="/company/$companyId/customer/$customerId/wealth/"
            params={(oldParams) => ({
              ...oldParams,
              companyId: params.companyId as string,
              customerId: data.customer?.id,
            })}
          >
            {data.customer?.name}
          </Link>
        )}
      />
      <Column
        field="status"
        sortable
        header={t("scenes.campaigns.state")}
        style={{ width: "20%" }}
        body={campaignContractStatusBodyTemplate}
      />
      <Column
        field="investment.value"
        sortable
        body={(data: CampaignContract) => (
          <p>{formatCurrency(data.investment)}</p>
        )}
        header={t("scenes.campaigns.underManagement")}
        style={{ width: "20%" }}
      />
      <Column
        field="status"
        style={{ width: "48px" }}
        body={(data: CampaignContract) => (
          <CampaignCustomerAction
            campaignContract={data}
            companyID={params.companyId as string}
          />
        )}
      />
    </DataTable>
  );
}

export function Companycampaign() {
  const params = useParams({
    from: "/company/$companyId/campaigns",
  });
  const searchParams = useSearch({
    from: "/company/$companyId/campaigns",
  });
  const [showDialog, setShowDialog] = useState<ModalActionType | undefined>(
    searchParams.open ? { type: "create" } : undefined
  );
  const { t } = useTranslation();

  if (!params.companyId) throw new Error("No company ID provided");

  const { data, isLoading } = useQuery("companyCampaigns", () =>
    gql.client.request(CampaignLogic.queries(), {
      companyID: params.companyId as string,
    })
  );

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col flex-wrap gap-4">
      <button
        className="mb-2 ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-800 drop-shadow-xl hover:bg-blue-1000"
        onClick={() => setShowDialog({ type: "create" })}
      >
        <Tooltip target=".pi-plus" />
        <i
          className="pi pi-plus"
          style={{ color: "white", fontWeight: "900" }}
          data-pr-tooltip={t("forms.fields.actions.createShipment") as string}
          data-pr-position="left"
          data-pr-at="left-15 center"
          data-pr-my="right center"
        />
      </button>
      <Accordion multiple>
        {data?.campaignList?.map((campagn) => (
          <AccordionTab
            key={campagn.id}
            pt={{
              // @ts-expect-error FIXME: Typings are wrong
              headertitle: {
                className: "w-full",
              },
            }}
            header={
              <div className="flex w-full shrink grow flex-row items-center justify-between px-4">
                <div className="flex w-4/12 flex-row items-center gap-4">
                  <AssetIcon assetName={campagn.assetGroup} />
                  <p>{campagn.name}</p>
                </div>
                <p className="w-2/12">
                  {t("scenes.campaigns.totalUnderManagement")}:{" "}
                  {formatCurrency(campagn.totalInvestment)}
                </p>
                <p className="w-2/12">
                  {t("scenes.campaigns.provider")}: {campagn.provider}
                </p>
                <p className="w-2/12">
                  {t("scenes.campaigns.subscriber")}: {campagn.customersCount}
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowDialog({
                      type: "update",
                      data: {
                        id: campagn.id,
                        name: campagn.name,
                        provider: campagn.provider,
                      },
                    });
                  }}
                >
                  <i
                    className="notification-target-icon pi pi-pencil h-4 w-4 cursor-pointer"
                    data-pr-tooltip={t("forms.fields.tables.edit") as string}
                  />
                </button>
              </div>
            }
          >
            <CampaignTable contractList={campagn.contractList ?? []} />
          </AccordionTab>
        ))}
      </Accordion>

      <Dialog open={!!showDialog} onOpenChange={() => setShowDialog(undefined)}>
        <CampaignForm
          companyID={params.companyId}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      </Dialog>
    </div>
  );
}
