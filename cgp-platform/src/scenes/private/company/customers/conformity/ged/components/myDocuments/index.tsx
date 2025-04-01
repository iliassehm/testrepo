import { useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import type { GedTabParams } from "../..";
import { Loading } from "../../../../../../../../components/Loading";
import { defaultCategories } from "../../../../../../../../constants";
import { useCustomerUpload } from "../../../../../../../../hooks/useCustomerUpload";
import { useDocumentFlow } from "../../../../../../../../hooks/useDocumentFlow";
import { GedContentV2 } from "../GedContentV2";
import { GedDialog } from "../GedDialog";
import { GedDialogAdd } from "../GedDialogAdd";

export type DialogDocumentAdd = {
  category: string;
};

export function GedDocuments({ companyId, customerId }: GedTabParams) {
  const [showDialogDocumentAdd, setShowDialogDocumentAdd] =
    useState<DialogDocumentAdd>();

  const [showDialog, setShowDialog] = useState<
    boolean | { key: string; name: string; customerVisibility: boolean }
  >(false);

  const searchParams = useSearch({
    from: "/company/$companyId/customer/$customerId/conformity",
  });

  const customerUpload = useCustomerUpload({
    companyID: companyId as string,
    customerID: customerId as string,
  });

  const {
    deleteCategoryMutation,
    documentAddMutation,
    categoryUpdateMutation,
    categoryCreationMutation,
    ...documentFlow
  } = useDocumentFlow({
    companyID: companyId as string,
    customerID: customerId as string,
    defaultCategoryKey: searchParams.category,
    defaultDocumentId: searchParams.documentId,
  });

  const categories = documentFlow.categories;

  const allCategories = useMemo(() => {
    const existing = defaultCategories.filter(
      (category) => !categories?.some((c) => c.key === category.key)
    );

    return [...existing, ...(categories ?? [])];
  }, [categories]);

  const showDialogHasName = typeof showDialog === "object";

  return (
    <>
      <GedContentV2
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
        onDocumentAddClick={setShowDialogDocumentAdd}
        {...documentFlow}
      />
      {showDialogDocumentAdd && (
        <GedDialogAdd
          visible={!!showDialogDocumentAdd}
          onSubmit={async (data) => {
            const newUploads = await customerUpload.mutateAsync({
              uploadRequest: [
                {
                  name: data.file.name,
                  MIME: data.file.type,
                },
              ],
              files: [data.file],
            });

            if (!newUploads[0]) throw new Error("Upload failed");

            await documentAddMutation.mutate({
              input: {
                category: data.category,
                extension: newUploads[0].extension,
                name: newUploads[0].name,
              },
            });
          }}
          title="scenes.customers.conformity.tabs.addDocument"
          isLoading={customerUpload.isLoading || documentAddMutation.isLoading}
          defaultCategory={showDialogDocumentAdd?.category}
          categories={allCategories}
          setVisible={() => setShowDialogDocumentAdd(undefined)}
        />
      )}
      {showDialog && (
        <GedDialog
          visible={!!showDialog}
          isLoading={categoryCreationMutation.isLoading}
          setVisible={setShowDialog}
          title={
            showDialogHasName
              ? "scenes.customers.conformity.tabs.editCategory"
              : "scenes.customers.conformity.tabs.addCategory"
          }
          defaultValues={
            showDialogHasName
              ? {
                  name: showDialog.name,
                  customerVisibility: showDialog.customerVisibility,
                }
              : { name: "", customerVisibility: true }
          }
          onSubmit={(data) =>
            showDialogHasName
              ? categoryUpdateMutation.mutate({
                  key: showDialog.key,
                  updatedName: data.name,
                  customerVisibility: data.customerVisibility,
                })
              : categoryCreationMutation.mutate(data)
          }
        />
      )}
    </>
  );
}
