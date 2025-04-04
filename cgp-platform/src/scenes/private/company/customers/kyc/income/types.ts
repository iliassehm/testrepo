import { BudgetCreationInput } from "../../../../../../types";

export interface Income {
  _typename?: string;
  amount: {
    value: number;
    instrument: string;
  };
  id: string;
  libelle?: string | null;
  name: string;
  type: string;
}

export interface BudgetCreationInputForm extends BudgetCreationInput {
  id: string;
}
