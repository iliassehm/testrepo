import { t } from "i18next";
import type { z } from "zod";

import type {
  InvestorProfileFormInputs,
  investorProfileFormVersionType,
} from "@shared-schemas/investorProfileFormSchema";
import { InvestorProfileFormFirstVersion } from "./version/FirstVersion";
import { InvestorProfileFormSecondVersion } from "./version/SecondVersion";

export type InvestorProfilVersion = {
  value: z.infer<typeof investorProfileFormVersionType>;
  label: string;
};

export const investorProfileVersionList: InvestorProfilVersion[] = [
  {
    value: "1",
    label: t("scenes.customers.conformity.investorProfile.form.version.1"),
  },
  {
    value: "2",
    label: t("scenes.customers.conformity.investorProfile.form.version.2"),
  },
];

export interface InvestorProfileForm {
  isLoading?: boolean;
  defaultValue: InvestorProfileFormInputs;
  version?: InvestorProfilVersion;
  onSubmit: (data: {
    input: InvestorProfileFormInputs;
    hideNotification?: boolean;
    scrollToTop?: boolean;
  }) => void;
  disableAutoSubmit?: boolean;
  handleSyncBudget?: () => void;
}

export function InvestorProfileForm({ ...props }: InvestorProfileForm) {
  const hasPreviousVersion = props.defaultValue?.q1 !== undefined;
  const version = props.version?.value || props.defaultValue.version;

  let Component = InvestorProfileFormSecondVersion;

  if (version === "1" || (!version && hasPreviousVersion)) {
    Component = InvestorProfileFormFirstVersion;
  }

  return <div>{Component && <Component {...props} />}</div>;
}
