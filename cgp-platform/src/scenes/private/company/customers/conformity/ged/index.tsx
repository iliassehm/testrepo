import { useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Button } from "../../../../../../components";
import { type Tab, Tabs } from "../../../../../../components/Tabs";
import ConfirmityCreationV2 from "../conformityCreation/confirmityCreationV2";
import { GedDocuments } from "./components/myDocuments";
import { GedEnvelops } from "./components/myEnvelopView";

export type GedTabParams = {
  companyId: string;
  customerId: string;
};

export function Ged() {
  const [showDialog, setShowDialog] = useState(false);
  const [tab, setTab] = useState<Tab["id"]>("ged");
  const navigate = useNavigate();
  const params = useParams({
    from: "/company/$companyId/customer/$customerId/conformity",
  });

  const onChange = (tab: Tab["id"]) => {
    setTab(tab);
    navigate({
      to: "/company/$companyId/customer/$customerId/conformity",
      params: params,
      search: {
        tab: "ged",
      },
    });
  };

  // add tab in memory
  const tabs = useMemo(
    () => [
      {
        id: "ged",
        label: "scenes.customers.conformity.tabs.myDocuments",
        component: <GedDocuments {...params} />,
      },
      {
        id: "conformity",
        label: "scenes.customers.conformity.tabs.sendDocuments",
        component: <GedEnvelops {...params} />,
      },
    ],
    [params]
  );

  return (
    <>
      <div className="flex items-center justify-end w-full gap-4 mb-4">
        <Button
          label="scenes.customers.conformity.tabs.documentsSend"
          onClick={() => setShowDialog(true)}
        />
      </div>
      <Tabs tabs={tabs} defaultTab={tab} onChange={onChange} />
      {showDialog && (
        <ConfirmityCreationV2
          showDialog={showDialog}
          hideDialog={() => setShowDialog(false)}
        />
      )}
    </>
  );
}
