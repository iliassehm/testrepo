import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";

import { Text } from "../../../../components";
import { clsx } from "../../../../helpers";
import { useCurrentRoute } from "../../../../hooks/useCurrentRoute";
import { gql } from "../../../../service/client";
import { GlobalSearchParams, WealthCreationParams } from "../../../../types";
import { AssetCreation } from "../customers/wealth";
import { GlobalAddWealthLogic } from "./AddWealth.logic";

export function AddWealth() {
  const { t } = useTranslation();
  const currentRoute = useCurrentRoute();
  const search = currentRoute.search as GlobalSearchParams &
    WealthCreationParams;
  const { companyId, customerId } = useParams({
    from: "/company/$companyId/global-wealth/add-under-management/",
  }) as Record<string, string>;
  const [manual, setManual] = useState(false);
  const navigate = useNavigate({
    from: "/company/$companyId/global-wealth/add-under-management/",
  });

  useEffect(() => {
    if (search.assetType) setManual(true);
  }, [search]);

  const { mutate: assetUnderManagement } = useMutation(
    "synchronizeAssetUnderManagement",
    () =>
      gql.client.request(GlobalAddWealthLogic.globalAddWealthMutation(), {
        companyID: companyId as string,
      }),
    {
      onSuccess() {
        navigate({
          to: "/company/$companyId/global-wealth/add-under-management/automatic-wealth",
          params: { companyId },
        });
      },
    }
  );

  let manualBlock: JSX.Element | null = null;
  if (customerId)
    manualBlock = (
      <div
        className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-white p-5 drop-shadow-md md:w-1/2"
        onClick={() => setManual(!manual)}
      >
        <div className="flex items-center gap-x-2">
          <Text
            label={t("scenes.wealthConnection.add.manual")}
            as="h3"
            className="font-bold text-grey-800 group-hover:text-blue-1100"
          />
        </div>
        <i
          className={clsx(
            "pi pi-angle-right text-grey-600 group-hover:text-grey-800",
            manual ? "rotate-90" : "rotate-0"
          )}
        />
      </div>
    );

  return (
    <div>
      <div className="mb-10 flex w-full flex-col justify-between gap-x-18 gap-y-4 px-0 md:flex-row xl:px-18">
        <div
          className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-white p-5 drop-shadow-md md:w-1/2"
          onClick={() => assetUnderManagement()}
        >
          <div className="flex items-center gap-x-2">
            <Text
              label={t("scenes.wealthConnection.add.auto")}
              as="h3"
              className="font-bold text-grey-800 group-hover:text-blue-1100"
            />
            <img src="/svg/badge.svg" />
          </div>
          <i className="pi pi-angle-right text-grey-700 group-hover:text-blue-1100" />
        </div>
        {manualBlock}
      </div>
      <AssetCreation visible={manual} onHide={() => setManual(false)} />
    </div>
  );
}
