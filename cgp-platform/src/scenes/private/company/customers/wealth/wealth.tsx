import { useNavigate, useSearch } from "@tanstack/react-router";

import { Button } from "../../../../../components";
import { Tab, Tabs } from "../../../../../components/Tabs";
import { WealthFilter } from "../../../../../types";
import { GlobalWealthTab } from "./globalWealthTab";
import { CustomerWealthAssetSearch } from "./route";
import { WalletTab } from "./WalletTab/walletTab";

export const CompanyCustomersWealth = () => {
  // Hooks
  const navigate = useNavigate({
    from: "/company/$companyId/customer/$customerId/wealth/",
  });
  const { wealthFilter } = useSearch({
    from: "/company/$companyId/customer/$customerId/wealth/",
  });

  const onChange = (tab: Tab["id"]) => {
    const entries = Object.entries(WealthFilter);
    let filter: WealthFilter | undefined = undefined;
    const key = entries.find(([, value]) => value === tab)?.[0];
    if (key) filter = WealthFilter[key as keyof typeof WealthFilter];
    if (tab === "default") {
      filter = undefined;
    }
    navigate({
      search: (current: CustomerWealthAssetSearch) => ({
        ...current,
        wealthFilter: filter,
      }),
    } as never);
  };

  return <WealthTabs defaultTab={wealthFilter} onChange={onChange} />;
};

interface WalletTabProps {
  defaultTab?: WealthFilter | "default";
  onNavigateBack?: () => void;
  onChange?: (tab: Tab["id"]) => void;
}
export function WealthTabs({
  defaultTab = "default",
  onChange,
  onNavigateBack,
}: WalletTabProps) {
  return (
    <div className="relative max-w-8xl bg-transparent">
      <Tabs
        tabs={[
          {
            id: "default",
            label: "scenes.customers.wealth.tabs.globalWealth",
            component: <GlobalWealthTab />,
          },
          {
            id: WealthFilter.UnderManagements,
            label: "scenes.customers.wealth.tabs.wallet",
            component: <WalletTab />,
          },
          {
            id: WealthFilter.Customers,
            label: "scenes.customers.wealth.tabs.customer_wealth",
            component: <GlobalWealthTab computing={WealthFilter.Customers} />,
          },
        ]}
        defaultTab={defaultTab}
        onChange={onChange}
        hideTabContent={!!onNavigateBack}
      />
      {onNavigateBack && (
        <div className="absolute right-0 top-0">
          <Button
            size="small"
            icon="pi pi-chevron-left"
            label="forms.fields.actions.back"
            onClick={onNavigateBack}
          />
        </div>
      )}
    </div>
  );
}
