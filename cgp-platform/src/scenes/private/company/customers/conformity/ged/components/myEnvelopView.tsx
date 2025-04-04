import { useSearch } from "@tanstack/react-router";
import { useState } from "react";

import type { GedTabParams } from "..";
import { useEnvelopeFlow } from "../../../../../../../hooks/useEnvelopeFlow";
import ConfirmityCreationV2 from "../../conformityCreation/confirmityCreationV2";
import { GedContentV2 } from "./GedContentV2";

export function GedEnvelops({ companyId, customerId }: GedTabParams) {
  const [showDialog, setShowDialog] = useState<
    boolean | { key: string; name: string; customerVisibility: boolean }
  >(false);

  const searchParams = useSearch({
    from: "/company/$companyId/customer/$customerId/conformity",
  });

  const {
    deleteCategoryMutation,
    documentAddMutation,
    categoryUpdateMutation,
    categoryCreationMutation,
    ...documentFlow
  } = useEnvelopeFlow({
    companyID: companyId as string,
    customerID: customerId as string,
    defaultCategoryKey: searchParams.envelopeId,
    defaultDocumentId: searchParams.envelopeDocumentId,
  });

  const hideDialog = () => {
    setShowDialog(false);
  };

  return (
    <>
      <GedContentV2
        isEnvelopeView
        onCategoryEdit={setShowDialog}
        onCategoryDelete={(data) =>
          deleteCategoryMutation.mutate(
            (
              data as {
                key: string;
              }
            ).key
          )
        }
        onDocumentSubmit={console.log}
        onCategoryClick={() => setShowDialog(true)}
        {...documentFlow}
      />
      {showDialog && (
        <ConfirmityCreationV2
          showDialog
          hideDialog={hideDialog}
          onSuccess={() => {
            documentFlow.refetchCategories();
          }}
        />
      )}
    </>
  );
}
