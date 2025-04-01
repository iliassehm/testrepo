import { useTranslation } from "react-i18next";
import { useMutation, UseMutationOptions } from "react-query";

import { CustomersConformityLogic } from "../scenes/private/company/customers/conformity/conformity.logic";
import { UploadHandlerProps } from "../scenes/private/company/customers/conformity/conformityCreation/commons";
import { gql } from "../service/client";
import { useToast } from "./useToast";

type CustomerUploadProps = {
  companyID: string;
  customerID: string;
};

type CustomerUploadReturn = {
  name: string;
  extension: string;
  url: string;
  file?: File;
}[];

type UseMutationProps = UseMutationOptions<
  CustomerUploadReturn,
  unknown,
  UploadHandlerProps
>;

export function useCustomerUpload(
  { companyID, customerID }: CustomerUploadProps,
  props?: Omit<UseMutationProps, "mutationFn">
) {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ files, uploadRequest }: UploadHandlerProps) => {
      const res = await gql.client.request(
        CustomersConformityLogic.customerUploadCreation(),
        {
          companyID,
          customerID,
          files: uploadRequest,
        }
      );

      const objectStored = res.customerUpload?.files;

      if (!objectStored) {
        throw new Error(t("forms.fields.errorUploadingDocuments"));
      }

      const s3Uploads = objectStored.map((object) => {
        const file = files.find((f) => f.name === object.name);

        if (!file) {
          throw new Error(t("forms.fields.errorUploadingDocuments"));
        }

        const response = fetch(object.url, {
          method: "PUT",
          body: file,
          headers: {
            "x-amz-acl": "public-read",
            "Content-Type": file.type,
          },
        });

        return response;
      });

      await Promise.all(s3Uploads);

      return objectStored.map((object) => {
        // get the name and  extension separately, should handle files with multiple dots
        const splitName = /(.+)(\.[^.]+)$/.exec(object.name);

        const name = splitName?.[1];
        const extension = splitName?.[2].substring(1);

        if (!name || !extension) {
          throw new Error(t("forms.fields.errorUploadingDocuments"));
        }

        return {
          name,
          extension,
          url: object.url.split("?")[0],
          file: files.find((f) => f.name === object.name),
        };
      });
    },
    onError: () => {
      toast.current?.show({
        severity: "error",
        summary: t("forms.fields.errorUploadingDocuments"),
        detail: t("forms.fields.errorUploadingDocumentsFormat"),
      });
    },
    ...props,
  });
}
