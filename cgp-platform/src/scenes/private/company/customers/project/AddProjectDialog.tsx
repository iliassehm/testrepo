import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "@tanstack/react-router";
import { RadioButton } from "primereact/radiobutton";
import { Slider } from "primereact/slider";
import type { FC } from "react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { z } from "zod";

import { Button, Dialog, Select } from "../../../../../components";
import { gql } from "../../../../../service/client";
import { AssetGroup, ProjectType } from "../../../../../types";
import { FieldText } from "../../../../../UIComponents/FieldText/FieldText";
import { companyCustomersWealthIndexRoute } from "../wealth/route";
import { WealthLogic } from "../wealth/wealth.logic";
import {
  ProductCategory,
  projectObjectives,
  projectProducts,
  projectProductsSelectList,
  projectTypes,
} from "./projectConstants";

const projectChoiceSchema = z
  .object({
    name: z.string().min(1),
    type: z.union([
      z.literal(ProjectType.SubscriptionCif),
      z.literal(ProjectType.SubscriptionLifeInsurance),
    ]),
    // assetType: z.nativeEnum(AssetType),
    product: z.string(),
    objectives: z.string(),
    horizon: z.number(),
  })
  .or(
    z.object({
      name: z.string().min(1),
      type: z.union([
        z.literal(ProjectType.ArbitrageCif),
        z.literal(ProjectType.ArbitrageLifeInsurance),
        z.literal(ProjectType.Redemption),
        z.literal(ProjectType.ComplementaryCif),
        z.literal(ProjectType.ComplementaryLifeInsurance),
      ]),
      // assetType: z.nativeEnum(AssetType),
      contractID: z.string(),
    })
  );

type ProjectChoiceFormValues = z.infer<typeof projectChoiceSchema>;

export const AddProjectDialog: FC<{
  visible: boolean;
  setVisible: (val: boolean) => void;
}> = ({ visible, setVisible }) => {
  const { t } = useTranslation();
  const {
    setValue,
    setError,
    clearErrors,
    watch,
    unregister,
    handleSubmit,
    formState: { isValid },
  } = useForm<ProjectChoiceFormValues>({
    resolver: zodResolver(projectChoiceSchema),
    defaultValues: {
      type: undefined,
      name: "",
      // assetType: AssetType.Financial,
      product: projectProducts[1].id, // 1 because 0 is "all"
      objectives: projectObjectives[0].id,
      horizon: 4,
    },
  });

  // const selectedAssetType = watch("assetType");
  const selectedType = watch("type");
  const selectedContractID = watch("contractID");
  const selectedHorizon = watch("horizon");
  const navigate = useNavigate();
  const params = useParams({
    from: companyCustomersWealthIndexRoute.id,
  });
  const isSubscription = useMemo(
    () =>
      selectedType === ProjectType.SubscriptionCif ||
      selectedType === ProjectType.SubscriptionLifeInsurance ||
      (selectedType as unknown as string) === "subscription",
    [selectedType]
  );

  // Queries
  const walletQuery = useQuery(
    ["customerAssets", params.companyId, params.customerId],
    () =>
      gql.client.request(WealthLogic.customerAssets(), {
        companyID: params.companyId ?? "",
        id: params.customerId ?? "",
        groups: [
          AssetGroup.LifeInsuranceCapitalization,
          AssetGroup.RetirementEmployee,
          AssetGroup.Securities,
          AssetGroup.RockPaper,
        ],
      })
  );

  const navigateToProject = (search: z.infer<typeof projectChoiceSchema>) => {
    navigate({
      to: "/company/$companyId/customer/$customerId/projects/add",
      params: {
        companyId: params.companyId,
        customerId: params.customerId,
      },
      search: search,
    });
  };

  const onSubmit = (data: ProjectChoiceFormValues) => {
    if (
      data.type === ProjectType.SubscriptionCif ||
      data.type === ProjectType.SubscriptionLifeInsurance
    ) {
      navigateToProject({
        type: data.type,
        name: data.name,
        // assetType: data.assetType,
        product: data.product,
        objectives: data.objectives,
        horizon: data.horizon,
      });
    } else if (
      data.type === ProjectType.ArbitrageCif ||
      data.type === ProjectType.ArbitrageLifeInsurance ||
      data.type === ProjectType.Redemption ||
      data.type === ProjectType.ComplementaryCif ||
      data.type === ProjectType.ComplementaryLifeInsurance
    ) {
      navigateToProject({
        type: data.type,
        name: data.name,
        // assetType: data.assetType,
        contractID: data.contractID,
      });
    }
  };

  useEffect(() => {
    if (isSubscription && !selectedContractID) {
      setError("contractID", {
        message: "Le contrat est obligatoire",
        type: "required",
      });
    } else {
      clearErrors("contractID");
    }
  }, [selectedType]);

  return (
    <Dialog
      header={t("scenes.customers.projects.addProject.title")}
      open={visible}
      onOpenChange={() => {
        unregister("type");
        setVisible(false);
      }}
      className="min-w-[500px]"
    >
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-[#4761C8] font-medium text-xl self-start">
          {t("scenes.customers.projects.addProject.projectType")}
        </h1>
        <div className="pr-4 flex flex-col gap-2 w-full">
          <Select
            name="type"
            placeholder={t("scenes.customers.projects.types.placeholder")}
            options={projectTypes.map((value) => ({
              value: value.id,
              label: t("scenes.customers.projects.types." + value.id),
            }))}
            defaultValue=""
            className="min-w-[150px]"
            onChange={(value) => {
              if (value === "subscription") {
                const product = projectProducts.find(
                  (v) => v.id === watch("product")
                );
                const type =
                  product?.category === ProductCategory.LifeInsurance
                    ? ProjectType.SubscriptionLifeInsurance
                    : ProjectType.SubscriptionCif;
                setValue("type", type, {
                  shouldValidate: true,
                });
                return;
              } else if (value === "complementary") {
                const type = ProjectType.ComplementaryLifeInsurance;
                setValue("type", type, {
                  shouldValidate: true,
                });
                return;
              } else if (value === "arbitrage") {
                const type = ProjectType.ArbitrageLifeInsurance;
                setValue("type", type, {
                  shouldValidate: true,
                });
                return;
              }
              setValue("type", value as ProjectType, {
                shouldValidate: true,
              });
            }}
          />
        </div>
        <h1 className="text-[#4761C8] font-medium text-xl self-start">
          {t("scenes.customers.projects.addProject.projectName")}
        </h1>
        <div className="flex flex-col gap-2 w-full">
          <FieldText
            name="name"
            onChange={(e) =>
              setValue("name", e.target.value, {
                shouldValidate: true,
              })
            }
          />
        </div>
        {/* <h1 className="text-[#4761C8] font-medium text-xl self-start">
          {t("scenes.customers.projects.addProject.assetChoice")}
        </h1>
        <div className="pr-4 flex flex-row gap-10 w-full justify-center">
          {radioAssetType.map((option) => (
            <div key={option.key} className="flex items-center gap-2">
              <RadioButton
                inputId={option.key}
                name="type"
                value={option.key}
                onChange={(e) =>
                  setValue("assetType", e.value, {
                    shouldValidate: true,
                  })
                }
                checked={option.key === selectedAssetType}
              />
              <label htmlFor={option.key} className="ml-2">
                {t(option.name)}
              </label>
            </div>
          ))}
        </div> */}

        {selectedType && isSubscription && (
          <>
            <div className="border-b w-full px-2" />
            <h1 className="text-[#4761C8] font-medium text-xl self-start">
              {t("scenes.customers.projects.addProject.projectProduct")}
            </h1>
            <div className="pr-4 flex flex-col gap-2 w-full">
              <Select
                name="product"
                options={projectProductsSelectList}
                className="min-w-[150px]"
                onChange={(value) => {
                  setValue("product", value, {
                    shouldValidate: true,
                  });
                  if (
                    projectProducts.find((v) => v.id === value)?.category ===
                    ProductCategory.LifeInsurance
                  ) {
                    setValue("type", ProjectType.SubscriptionLifeInsurance, {
                      shouldValidate: true,
                    });
                  } else {
                    setValue("type", ProjectType.SubscriptionCif, {
                      shouldValidate: true,
                    });
                  }
                }}
              />
            </div>

            <h1 className="text-[#4761C8] font-medium text-xl self-start">
              {t("scenes.customers.projects.addProject.objectivesChoice")}
            </h1>
            <div className="pr-4 flex flex-col gap-2 w-full">
              <Select
                name="type"
                options={projectObjectives.map((value) => ({
                  value: value.id,
                  label: t("scenes.customers.projects.objectives." + value.id),
                }))}
                className="min-w-[150px]"
                onChange={(value) => {
                  setValue("objectives", value, {
                    shouldValidate: true,
                  });
                }}
              />
            </div>

            <div className="w-full flex flex-row justify-between">
              <h1 className="text-[#4761C8] font-medium text-xl self-start">
                {t("scenes.customers.projects.addProject.projectHorizon")}
              </h1>
              <span className="text-[#4761C8] font-medium text-xl self-start">
                {selectedHorizon}{" "}
                {t(
                  `scenes.customers.projects.addProject.projectHorizonYear${
                    selectedHorizon > 1 ? "s" : ""
                  }`
                )}
              </span>
            </div>

            <Slider
              className="w-full"
              value={selectedHorizon}
              min={1}
              max={10}
              step={1}
              onChange={(e) =>
                setValue(
                  "horizon",
                  Array.isArray(e.value) ? e.value[0] : e.value,
                  {
                    shouldValidate: true,
                  }
                )
              }
            />
          </>
        )}
        {selectedType && !isSubscription && (
          <>
            <div className="border-b w-full px-2" />
            <h1 className="text-[#4761C8] font-medium text-xl self-start">
              {t("scenes.customers.projects.addProject.contractChoice")}
            </h1>

            <div className="px-4 flex flex-col gap-2 w-full">
              {walletQuery.data?.customerAssets?.map((asset) => (
                <div key={asset.id} className="flex items-center gap-2">
                  <RadioButton
                    inputId={asset.id}
                    name="contractID"
                    value={asset.id}
                    onChange={(e) =>
                      setValue("contractID", e.value, {
                        shouldValidate: true,
                      })
                    }
                    checked={asset.id === selectedContractID}
                  />
                  <label htmlFor={asset.id} className="ml-2">
                    {asset.name}
                  </label>
                </div>
              ))}
            </div>
          </>
        )}

        <Button
          label="scenes.customers.projects.valider"
          type="submit"
          disabled={!isValid} //|| !!errors.contractID}
        />
      </form>
    </Dialog>
  );
};
