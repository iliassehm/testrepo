import type { Control } from "react-hook-form";
import type { TFunction } from "react-i18next";

import type { AggregationEntitiesForms } from "../../../../../../../shared/schemas/customerInfo";

export interface GeneralInformationsFormProps {
  control: Control<NonNullable<AggregationEntitiesForms["generalForm"]>>;
  t: TFunction;
}
