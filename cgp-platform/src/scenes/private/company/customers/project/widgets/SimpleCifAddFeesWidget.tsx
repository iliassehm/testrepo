import { use } from "i18next";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button, Dialog } from "../../../../../../components";
import { RadioSelect } from "../../../../../../components/RadioSelect";
import { Label } from "../../../../../../UIComponents/Label/Label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../../UIComponents/RadioGroup/RadioGroup";
import { RadioList } from "../../conformity/investorProfileForm/utils";

export enum LinkTypes {
  servicesFees = "services",
  productsFees = "products",
}
enum FeesTypes {
  enterFees = "enter",
  variableFees = "variable",
}

enum ArbitrationValueTypes {
  complementary = "complementary",
  desinvest = "desinvest",
  both = "both",
}

interface CustomFees {
  label: string;
  amount: number;
  percentage: number;
  feesLink: string;
  feesType: string;
  arbitrationValueType: string;

  totalPercentage: number;
  totalAmount: number;
  contractPercentage: number;
  contractAmount: number;
  companyPercentage: number;
  companyAmount: number;
}

interface FeesWidgetProps {
  form: ReturnType<typeof useForm<any>>;
  linkType: LinkTypes;
  i18nKey: string;
  type:
    | "arbitration"
    | "redemption"
    | "insurance"
    | "insuranceArbitration"
    | "other";
}
export const SimpleCifAddFeesWidget: React.FC<FeesWidgetProps> = ({
  form,
  linkType,
  i18nKey,
  type = "other",
}) => {
  const { t } = useTranslation();
  const [visibleNewFees, setVisibleNewFees] = useState(false);

  const formCustomFees = useForm<CustomFees>({
    mode: "onChange",
    defaultValues: {
      label: "",
      amount: 0,
      percentage: 0,
      feesLink: linkType,
      feesType: FeesTypes.enterFees,
      arbitrationValueType: ArbitrationValueTypes.complementary,

      totalPercentage: 0,
      totalAmount: 0,
      contractPercentage: 0,
      contractAmount: 0,
      companyPercentage: 0,
      companyAmount: 0,
    },
  });

  const { isValid } = formCustomFees.formState;

  const resetForm = () => {
    formCustomFees.reset();
  };

  return (
    <div
      className={type === "redemption" ? "flex ml-2 mt-4" : "flex ml-6 mt-4"}
    >
      <div
        className="flex justify-center items-center w-6 h-6 rounded-full bg-blue-800 text-white hover:!bg-blue-900 cursor-pointer"
        onClick={() => {
          type === "redemption"
            ? form.setValue("customFees", [
                ...form.getValues("customFees"),
                {
                  label: formCustomFees.getValues("label"),
                  totalPercentage: formCustomFees.getValues("totalPercentage"),
                  totalAmount: formCustomFees.getValues("totalAmount"),
                  contractPercentage:
                    formCustomFees.getValues("contractPercentage"),
                  contractAmount: formCustomFees.getValues("contractAmount"),
                  companyPercentage:
                    formCustomFees.getValues("companyPercentage"),
                  companyAmount: formCustomFees.getValues("companyAmount"),
                },
              ])
            : setVisibleNewFees(true);
          resetForm();
        }}
      >
        <Tooltip target=".pi-plus" />
        <i
          className="pi pi-plus text-xs"
          style={{ color: "white", fontWeight: "900" }}
          data-pr-position="left"
          data-pr-at="left-15 center"
          data-pr-my="right center"
        />
      </div>
      <div className="ml-2">
        {t(`scenes.customers.projects.addProject.cif.fees.addFees.${i18nKey}`)}
      </div>

      {visibleNewFees && (
        <Dialog
          header={t(
            "scenes.customers.projects.addProject.cif.fees.addFees.title"
          )}
          open={visibleNewFees}
          onOpenChange={() => {
            setVisibleNewFees(false);
          }}
          className="min-w-[500px] p-6"
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold">
              {t(
                "scenes.customers.projects.addProject.cif.fees.addFees.chooseFeesType"
              )}
            </h1>

            <RadioGroup
              onValueChange={(value) => {
                formCustomFees.setValue("feesType", value);
              }}
              defaultValue={FeesTypes.enterFees}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  id="horizontal-fixedFees"
                  value={FeesTypes.enterFees}
                  className="h-5 w-5"
                />
                <Label
                  htmlFor="horizontal-fixedFees"
                  className="cursor-pointer text-base"
                >
                  {t("scenes.customers.projects.addProject.cif.fees.fixedFees")}
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  id="horizontal-variableFees"
                  value={FeesTypes.variableFees}
                  className="h-5 w-5"
                />
                <Label
                  htmlFor="horizontal-variableFees"
                  className="cursor-pointer text-base"
                >
                  {t(
                    "scenes.customers.projects.addProject.cif.fees.variableFees"
                  )}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {(type === "arbitration" || type === "insuranceArbitration") && (
            <div className="flex flex-col gap-4">
              <h1 className="text-lg font-semibold">
                {t(
                  "scenes.customers.projects.addProject.cif.fees.addFees.chooseBasedAmount"
                )}
              </h1>

              <RadioGroup
                onValueChange={(value) => {
                  formCustomFees.setValue("arbitrationValueType", value);
                }}
                defaultValue={
                  type === "arbitration" || type === "insuranceArbitration"
                    ? ArbitrationValueTypes.complementary
                    : undefined
                }
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    id="horizontal-complementary"
                    value={ArbitrationValueTypes.complementary}
                    className="h-5 w-5"
                  />
                  <Label
                    htmlFor="horizontal-complementary"
                    className="cursor-pointer text-base"
                  >
                    {t(
                      "scenes.customers.projects.addProject.cif.fees.addFees.complementary"
                    )}
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    id="horizontal-desinvest"
                    value={ArbitrationValueTypes.desinvest}
                    className="h-5 w-5"
                  />
                  <Label
                    htmlFor="horizontal-desinvest"
                    className="cursor-pointer text-base"
                  >
                    {t(
                      "scenes.customers.projects.addProject.cif.fees.addFees.desinvestment"
                    )}
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    id="horizontal-both"
                    value={ArbitrationValueTypes.both}
                    className="h-5 w-5"
                  />
                  <Label
                    htmlFor="horizontal-both"
                    className="cursor-pointer text-base"
                  >
                    {t(
                      "scenes.customers.projects.addProject.cif.fees.addFees.both"
                    )}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <Button
            label="scenes.customers.projects.valider"
            type="button"
            className="w-full"
            disabled={!isValid}
            onClick={() => {
              type === "arbitration"
                ? form.setValue("fees.customFees", [
                    ...form.getValues("fees.customFees"),
                    {
                      label: formCustomFees.getValues("label"),
                      amount: formCustomFees.getValues("amount"),
                      percentage: formCustomFees.getValues("percentage"),
                      feesLink: formCustomFees.getValues("feesLink"),
                      feesType: formCustomFees.getValues("feesType"),
                      arbitrationValueType: formCustomFees.getValues(
                        "arbitrationValueType"
                      ),
                    },
                  ])
                : type === "insurance"
                  ? form.setValue("customFees", [
                      ...form.getValues("customFees"),
                      {
                        label: formCustomFees.getValues("label"),
                        totalPercentage:
                          formCustomFees.getValues("totalPercentage"),
                        totalAmount: formCustomFees.getValues("totalAmount"),
                        contractPercentage:
                          formCustomFees.getValues("contractPercentage"),
                        contractAmount:
                          formCustomFees.getValues("contractAmount"),
                        companyPercentage:
                          formCustomFees.getValues("companyPercentage"),
                        companyAmount:
                          formCustomFees.getValues("companyAmount"),
                        feesType: formCustomFees.getValues("feesType"),
                      },
                    ])
                  : type === "insuranceArbitration"
                    ? form.setValue("customFees", [
                        ...form.getValues("customFees"),
                        {
                          label: formCustomFees.getValues("label"),
                          totalPercentage:
                            formCustomFees.getValues("totalPercentage"),
                          totalAmount: formCustomFees.getValues("totalAmount"),
                          contractPercentage:
                            formCustomFees.getValues("contractPercentage"),
                          contractAmount:
                            formCustomFees.getValues("contractAmount"),
                          companyPercentage:
                            formCustomFees.getValues("companyPercentage"),
                          companyAmount:
                            formCustomFees.getValues("companyAmount"),
                          feesType: formCustomFees.getValues("feesType"),
                          arbitrationValueType: formCustomFees.getValues(
                            "arbitrationValueType"
                          ),
                        },
                      ])
                    : form.setValue("fees.customFees", [
                        ...form.getValues("fees.customFees"),
                        {
                          label: formCustomFees.getValues("label"),
                          amount: formCustomFees.getValues("amount"),
                          percentage: formCustomFees.getValues("percentage"),
                          feesLink: formCustomFees.getValues("feesLink"),
                          feesType: formCustomFees.getValues("feesType"),
                        },
                      ]);
              setVisibleNewFees(false);
            }}
          />
        </Dialog>
      )}
    </div>
  );
};
