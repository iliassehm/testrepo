import { useParams } from "@tanstack/react-router";
import { TFunction } from "i18next";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";

import { Dialog } from "../../../../../../../components";
import { DeleteWithConfirmationDialog } from "../../../../../../../helpers";
import { gql } from "../../../../../../../service/client";
import { Holding } from "../../../../../../../types";
import { CompanyCustomersInformationsLogic } from "../../informations.logic";
import {
  HoldingCreationForm,
  HoldingCreationFormData,
} from "../holdingForm/holdingCreationForm";
import { BusinessList } from "./businessList";

interface HoldingListProps {
  data: Holding[];
  refetchHolding: () => void;
}
export function HoldingList({ data = [], refetchHolding }: HoldingListProps) {
  const { t } = useTranslation();
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/informations",
  });
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState<Holding | false>(false);

  function onSuccess() {
    queryClient.invalidateQueries([
      "companyCustomersInformations",
      params.companyId,
      params.customerId,
    ]);
  }

  const deleteBusiness = useMutation(
    (IDs: string[]) =>
      gql.client.request(CompanyCustomersInformationsLogic.businessDeletion(), {
        companyID: params.companyId as string,
        IDs,
      }),
    {
      onSuccess,
    }
  );

  const deleteHolding = useMutation(
    (IDs: string[]) =>
      gql.client.request(CompanyCustomersInformationsLogic.holdingDeletion(), {
        companyID: params.companyId as string,
        IDs,
      }),
    {
      onSuccess,
    }
  );

  const updateHolding = useMutation(
    ({
      id,
      ...input
    }: HoldingCreationFormData & {
      id: Holding["id"];
    }) =>
      gql.client.request(CompanyCustomersInformationsLogic.holdingUpdate(), {
        companyID: params.companyId as string,
        name: input.name,
        id,
        input,
      }),
    {
      onSuccess: () => {
        refetchHolding();
        setShowModal(false);
        onSuccess();
      },
    }
  );

  return (
    <div>
      <Accordion
        multiple
        activeIndex={[0]}
        className="accordion-with-table-header"
      >
        {data.map((holding) => (
          <AccordionTab
            key={holding.id}
            header={
              <HoldingAccordionHeader
                holding={holding}
                t={t}
                onDelete={deleteHolding.mutate}
                setShowModal={setShowModal}
              />
            }
          >
            <BusinessList
              data={holding.companies}
              deleteCompany={deleteBusiness.mutate}
            />
          </AccordionTab>
        ))}
      </Accordion>
      <Dialog
        open={showModal !== false}
        onOpenChange={() => setShowModal(false)}
      >
        <HoldingCreationForm
          defaultValues={(showModal as Holding).form}
          onSubmit={(data) =>
            updateHolding.mutate({
              ...data,
              id: (showModal as Holding)?.id,
            })
          }
        />
      </Dialog>
    </div>
  );
}

interface HoldingAccordionHeaderProps {
  holding: Holding;
  setShowModal: (data: Holding) => void;
  onDelete: (id: string[]) => void;
  t: TFunction;
}
export function HoldingAccordionHeader({
  holding,
  setShowModal,
  onDelete,
  t,
}: HoldingAccordionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 px-2">
        {t("scenes.company.holding.listHeader.holding", {
          name: holding.name,
        })}
      </div>
      <div className="flex-1 px-2">
        {t("scenes.company.holding.listHeader.company", {
          count: holding.companies.length,
        })}
      </div>
      <div className="flex-1 px-2">
        <div className="flex justify-end items-center gap-x-2">
          <div>
            <i
              className="notification-target-icon pi pi-pencil h-4 w-4 cursor-pointer"
              data-pr-tooltip={t("forms.fields.tables.edit") as string}
              onClick={() => setShowModal(holding)}
            />
          </div>
          <DeleteWithConfirmationDialog
            buttonClassName="p-0 !w-fit"
            onClick={() => onDelete([holding.id])}
          />
        </div>
      </div>
    </div>
  );
}
