import { useParams } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Dialog, Loading, Text } from "../../../../../../components";
import { BudgetCreationInput } from "../../../../../../types";
import Checkbox from "../../../../../../UIComponents/Checkbox/Checkbox";
import { Label } from "../../../../../../UIComponents/Label/Label";
import { annualIncomesNames } from "../../budget/budgetPerson";
import IncomeForm from "./IncomeForm";
import IncomeList from "./incomeTable";
import { Income } from "./types";
import { useIncomeMutations } from "./useIncomeMutations";
import { useIncomeQueries } from "./useIncomeQueries";

export default function Revenue() {
  /* Hooks */
  const { companyId, customerId } = useParams({
    from: "/company/$companyId/customer/$customerId/kyc/income",
  });
  const [selectedIncomes, setSelectedIncomes] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<Income | null>(null);

  const { incomes, isBudgetQueryLoading } = useIncomeQueries(
    companyId,
    customerId
  );
  const { budgetCreation, budgetDelete, mutationsLoading } = useIncomeMutations(
    companyId,
    customerId,
    setShowModal
  );

  useEffect(() => {
    const newSelectedIncomes: string[] = [];
    if (incomes && selectedIncomes.length === 0) {
      incomes.forEach((income) => {
        if (
          !newSelectedIncomes.includes(income.type) &&
          annualIncomesNames.find((item) => item.label === income.type)
        ) {
          newSelectedIncomes.push(income.type);
        }
      });
      setSelectedIncomes(
        newSelectedIncomes.sort((a, b) => {
          const indexA = annualIncomesNames.findIndex(
            (item) => item.label === a
          );
          const indexB = annualIncomesNames.findIndex(
            (item) => item.label === b
          );
          return indexA - indexB;
        })
      );
    }
  }, [incomes]);

  /* Helpers */

  const toggleIncome = (income: string) => {
    if (selectedIncomes.includes(income)) {
      setSelectedIncomes(selectedIncomes.filter((i) => i !== income));
    } else {
      setSelectedIncomes(
        [...selectedIncomes, income].sort((a, b) => {
          const indexA = annualIncomesNames.findIndex(
            (item) => item.label === a
          );
          const indexB = annualIncomesNames.findIndex(
            (item) => item.label === b
          );
          return indexA - indexB;
        })
      );
    }
    toggleInExpanded(income);
  };

  const toggleInExpanded = (income: string) => {
    if (isExpanded.includes(income)) {
      setIsExpanded(isExpanded.filter((i) => i !== income));
    } else {
      setIsExpanded([...isExpanded, income]);
    }
  };

  if (isBudgetQueryLoading) return <Loading />;
  return (
    <RevenueComponent
      incomes={incomes}
      setShowModal={setShowModal}
      showModal={showModal}
      selectedIncomes={selectedIncomes}
      toggleIncome={toggleIncome}
      toggleInExpanded={toggleInExpanded}
      isExpanded={isExpanded}
      budgetCreation={budgetCreation.mutate}
      budgetDelete={budgetDelete.mutate}
      mutationsLoading={mutationsLoading}
    />
  );
}
interface RevenueComponentProps {
  incomes: Income[];
  setShowModal: (income: Income | null) => void;
  showModal: Income | null;
  selectedIncomes: string[];
  toggleIncome: (income: string) => void;
  toggleInExpanded: (income: string) => void;
  isExpanded: string[];
  budgetCreation: (data: {
    input: BudgetCreationInput;
    budgetID?: string;
  }) => void;
  budgetDelete: (id: Income["id"]) => void;
  mutationsLoading: boolean;
}

export const RevenueComponent = ({
  incomes,
  setShowModal,
  showModal,
  selectedIncomes,
  toggleIncome,
  toggleInExpanded,
  isExpanded,
  budgetCreation,
  budgetDelete,
  mutationsLoading,
}: RevenueComponentProps) => {
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
          <IncomeForm
            defaultValues={{
              id: showModal?.id,
              amount: showModal?.amount.value,
              name: showModal?.name,
              type: showModal?.type,
            }}
            onSubmit={budgetCreation}
            isLoading={mutationsLoading}
            incomeType={showModal.type}
          />
        </Dialog>
      )}

      <div className="w-[90%] mx-auto flex flex-col space-y-8">
        <div>
          <Text
            as="h3"
            className="font-bold text-blue-800 mb-4"
            label={t("scenes.customers.kyc.formsTitle.selectIncomes")}
          />
          <div className="flex flex-wrap gap-4">
            {annualIncomesNames.map((income) => (
              <div
                key={income.label}
                className="inline-flex items-center cursor-pointer"
                onClick={() => toggleIncome(income.label)}
                data-testid={`income-checkbox-${income.label}`}
              >
                <Checkbox
                  id={income.label}
                  checked={selectedIncomes.includes(income.label)}
                  className="border-[#04182B] bg-white rounded-md data-[state=checked]:bg-blue-800"
                />
                <Label className="ml-2 text-xs text-gray-700 cursor-pointer">
                  {t(`forms.fields.budget.${income.label}`)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {selectedIncomes.map((income) => (
          <div
            key={income}
            className="form-section-collapsible"
            data-testid={`income-section-${income}`}
          >
            <div
              className="cursor-pointer"
              onClick={() => toggleInExpanded(income)}
            >
              <div className="form-header-section-collapsible">
                <div className="flex items-center gap-2">
                  <Text
                    as="h3"
                    className="font-bold text-blue-800"
                    label={t(`forms.fields.budget.${income}`)}
                  />
                </div>
                <ChevronDown
                  className={`chevron ${
                    isExpanded.includes(income) ? "" : "-rotate-180"
                  }`}
                />
              </div>
            </div>

            <div
              className={`transition-all duration-200 ${
                isExpanded.includes(income)
                  ? "opacity-100 transition-all h-auto"
                  : "transition-all h-0 py-0 opacity-0 overflow-hidden"
              }`}
            >
              <div className="p-4">
                <IncomeForm
                  incomeType={income}
                  onSubmit={budgetCreation}
                  isLoading={mutationsLoading}
                  defaultValues={{ amount: 0, name: "", type: "", id: "" }}
                />

                <IncomeList
                  incomes={incomes}
                  setShowModal={setShowModal}
                  onDelete={budgetDelete}
                  incomeType={income}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
