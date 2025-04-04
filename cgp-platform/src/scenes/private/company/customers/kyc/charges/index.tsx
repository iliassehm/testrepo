import { useParams } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Dialog, Loading, Text } from "../../../../../../components";
import { Budget, BudgetCreationInput } from "../../../../../../types";
import Checkbox from "../../../../../../UIComponents/Checkbox/Checkbox";
import { Label } from "../../../../../../UIComponents/Label/Label";
import { annualExpensesNames } from "../../budget/budgetPerson";
import ChargeForm from "./ChargeForm";
import ChargeTable from "./ChargeTable";
import { Charge } from "./types";
import { useChargeMutations } from "./useChargeMutations";
import { useChargeQueries } from "./useChargeQueries";

export default function Charges() {
  /* Hooks */
  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/kyc/expense",
  });
  const [selectedCharges, setSelectedCharges] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<Budget | null>(null);

  const { charges, isBudgetQueryLoading } = useChargeQueries(
    companyId,
    customerId
  );
  const { budgetCreation, budgetDelete, mutationsLoading } = useChargeMutations(
    companyId,
    customerId,
    setShowModal
  );

  useEffect(() => {
    const newSelectedCharges: string[] = [];
    if (charges && selectedCharges.length === 0) {
      charges.forEach((charge) => {
        if (
          !newSelectedCharges.includes(charge.type) &&
          annualExpensesNames.find((item) => item.label === charge.type)
        ) {
          newSelectedCharges.push(charge.type);
        }
      });
      setSelectedCharges(
        newSelectedCharges.sort((a, b) => {
          const indexA = annualExpensesNames.findIndex(
            (item) => item.label === a
          );
          const indexB = annualExpensesNames.findIndex(
            (item) => item.label === b
          );
          return indexA - indexB;
        })
      );
    }
  }, [charges]);

  /* Helpers */

  const toggleCharge = (charge: string) => {
    if (selectedCharges.includes(charge)) {
      setSelectedCharges(selectedCharges.filter((i) => i !== charge));
    } else {
      setSelectedCharges(
        [...selectedCharges, charge].sort((a, b) => {
          const indexA = annualExpensesNames.findIndex(
            (item) => item.label === a
          );
          const indexB = annualExpensesNames.findIndex(
            (item) => item.label === b
          );
          return indexA - indexB;
        })
      );
    }
    toggleInExpanded(charge);
  };

  const toggleInExpanded = (charge: string) => {
    if (isExpanded.includes(charge)) {
      setIsExpanded(isExpanded.filter((i) => i !== charge));
    } else {
      setIsExpanded([...isExpanded, charge]);
    }
  };

  if (isBudgetQueryLoading) return <Loading />;
  return (
    <ChargeComponent
      charges={charges}
      setShowModal={setShowModal}
      showModal={showModal}
      selectedCharges={selectedCharges}
      toggleCharge={toggleCharge}
      toggleInExpanded={toggleInExpanded}
      isExpanded={isExpanded}
      budgetCreation={budgetCreation.mutate}
      budgetDelete={budgetDelete.mutate}
      mutationsLoading={mutationsLoading}
    />
  );
}

interface ChargeComponentProps {
  charges: Charge[];
  setShowModal: (charge: Charge | null) => void;
  showModal: Charge | null;
  selectedCharges: string[];
  toggleCharge: (charge: string) => void;
  toggleInExpanded: (charge: string) => void;
  isExpanded: string[];
  budgetCreation: (data: {
    input: BudgetCreationInput;
    budgetID?: string;
  }) => void;
  budgetDelete: ({
    budgetID,
    budgetName,
  }: {
    budgetID: Charge["id"];
    budgetName?: Charge["name"];
  }) => void;
  mutationsLoading: boolean;
}

export const ChargeComponent = ({
  charges,
  setShowModal,
  showModal,
  selectedCharges,
  toggleCharge,
  toggleInExpanded,
  isExpanded,
  budgetCreation,
  budgetDelete,
  mutationsLoading,
}: ChargeComponentProps) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-100">
      {showModal && (
        <Dialog
          header={t(`scenes.wealth.budgetEdit`)}
          open={!!showModal}
          onOpenChange={() => setShowModal(null)}
          className="w-1/3 overflow-visible"
        >
          <ChargeForm
            defaultValues={{
              id: showModal?.id,
              amount: showModal?.amount.value,
              name: showModal?.name,
              type: showModal?.type,
            }}
            onSubmit={budgetCreation}
            isLoading={mutationsLoading}
            chargeType={showModal.type}
          />
        </Dialog>
      )}

      <div className="w-[90%] mx-auto flex flex-col space-y-8">
        <div>
          <Text
            as="h3"
            className="font-bold text-blue-800 mb-4"
            label={t("scenes.customers.kyc.formsTitle.expenses")}
          />
          <div className="flex flex-wrap gap-4">
            {annualExpensesNames.map((charge) => (
              <div
                key={charge.label}
                className="inline-flex items-center cursor-pointer"
                onClick={() => toggleCharge(charge.label)}
                data-testid={`charge-checkbox-${charge.label}`}
              >
                <Checkbox
                  id={charge.label}
                  checked={selectedCharges.includes(charge.label)}
                  className="border-[#04182B] bg-white rounded-md data-[state=checked]:bg-blue-800"
                />
                <Label className="ml-2 text-xs text-gray-700 cursor-pointer">
                  {t(`forms.fields.budget.${charge.label}`)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {selectedCharges.map((charge) => (
          <div
            key={charge}
            className="form-section-collapsible"
            data-testid={`charge-section-${charge}`}
          >
            <div
              className="cursor-pointer"
              onClick={() => toggleInExpanded(charge)}
            >
              <div className="form-header-section-collapsible">
                <div className="flex items-center gap-2">
                  <Text
                    as="h3"
                    className="font-bold text-blue-800"
                    label={t(`forms.fields.budget.${charge}`)}
                  />
                </div>
                <ChevronDown
                  className={`chevron ${
                    isExpanded.includes(charge) ? "" : "-rotate-180"
                  }`}
                />
              </div>
            </div>

            <div
              className={`transition-all duration-200 ${
                isExpanded.includes(charge)
                  ? "opacity-100 transition-all h-auto"
                  : "transition-all h-0 py-0 opacity-0 overflow-hidden"
              }`}
            >
              <div className="p-4">
                <ChargeForm
                  chargeType={charge}
                  onSubmit={budgetCreation}
                  isLoading={mutationsLoading}
                  defaultValues={{ amount: 0, name: "", type: "", id: "" }}
                />

                <ChargeTable
                  charges={charges}
                  setShowModal={setShowModal}
                  onDelete={({ budgetID, budgetName }) =>
                    budgetDelete({ budgetID, budgetName })
                  }
                  chargeType={charge}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
