import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";

import { Button } from "../../../../components";
import { useToast } from "../../../../hooks/useToast";
import { gql } from "../../../../service/client";
import { AssetGroup, Campaign } from "../../../../types";
import { FieldText } from "../../../../UIComponents/FieldText/FieldText";
import { Label } from "../../../../UIComponents/Label/Label";
import Select from "../../../../UIComponents/Select/Select";
import { CampaignLogic } from "./campaigns.logic";

export type ConformityActionType = "create" | "update";

export type ModalActionType =
  | {
      type: "create";
    }
  | {
      type: "update";
      data: Pick<Campaign, "id" | "name" | "provider">;
    };

interface CampaignFormProps {
  companyID: string;
  showDialog?: ModalActionType;
  setShowDialog: Dispatch<SetStateAction<ModalActionType | undefined>>;
}

const validAssetTypes = [
  AssetGroup.Crowdfunding,
  AssetGroup.Crypto,
  AssetGroup.Securities,
  AssetGroup.HeritageRealEstate,
  AssetGroup.Exotic,
  AssetGroup.LifeInsuranceCapitalization,
];

const validationSchema = z.object({
  name: z.string({ required_error: "forms.rules.required" }),
  provider: z.string({ required_error: "forms.rules.required" }),
  assetType: z.nativeEnum(AssetGroup).optional(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export function CampaignForm({
  companyID,
  showDialog,
  setShowDialog,
}: CampaignFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { handleSubmit, control } = useForm<ValidationSchema>({
    defaultValues:
      showDialog?.type === "update"
        ? {
            name: showDialog.data.name ?? "",
            provider: showDialog.data.provider ?? "",
          }
        : undefined,
    resolver: zodResolver(validationSchema),
  });

  const campaignCreation = useMutation({
    mutationFn: (data: ValidationSchema) =>
      gql.client.request(CampaignLogic.create(), {
        companyID,
        input: {
          name: data.name,
          provider: data.provider,
          assetGroup: data.assetType as AssetGroup,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries("companyCampaigns");

      toast?.current?.show({
        severity: "success",
        summary: t("forms.fields.notifications.campaignCreation.success"),
      });
    },
    onError: () => {
      toast?.current?.show({
        severity: "error",
        summary: t("forms.fields.notifications.campaignCreation.error"),
      });
    },
  });

  const campaignUpdate = useMutation({
    mutationFn: (data: Partial<ValidationSchema>) => {
      if (showDialog?.type !== "update") {
        throw new Error("Invalid action");
      }

      return gql.client.request(CampaignLogic.update(), {
        companyID,
        campaignID: showDialog.data.id,
        update: {
          name: data.name,
          provider: data.provider,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("companyCampaigns");

      toast?.current?.show({
        severity: "success",
        summary: t("forms.fields.notifications.campaignUpdate.success"),
      });
    },
    onError: () => {
      toast?.current?.show({
        severity: "error",
        summary: t("forms.fields.notifications.campaignUpdate.error"),
      });
    },
  });

  const onSubmit = async (data: ValidationSchema) => {
    if (showDialog?.type === "create") {
      await campaignCreation.mutateAsync(data);
    } else if (showDialog?.type === "update") {
      await campaignUpdate.mutateAsync(data);
    }
    setShowDialog(undefined);
  };

  const validAssetOptions = validAssetTypes.map((value) => ({
    label: t(`asset_group.${value}`),
    value,
  }));

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <div>
            <Label htmlFor={field.name}>
              {t(`forms.fields.campaignCreation.campaignName`)}
            </Label>
            <FieldText id={field.name} {...field} />
          </div>
        )}
      />
      <Controller
        name="provider"
        control={control}
        render={({ field }) => (
          <div>
            <Label htmlFor={field.name}>
              {t(`forms.fields.campaignCreation.provider`)}
            </Label>
            <FieldText id={field.name} {...field} />
          </div>
        )}
      />
      {showDialog?.type === "create" && (
        <Controller
          name="assetType"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor={field.name}>
                {t(`forms.fields.campaignCreation.assetType`)}
              </Label>
              <Select
                id={field.name}
                {...field}
                value={validAssetOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => field.onChange(option?.value)}
                options={validAssetOptions}
                className="w-full"
              />
            </div>
          )}
        />
      )}
      <Button
        type="submit"
        label="forms.fields.actions.create"
        loading={false}
      />
    </form>
  );
}
