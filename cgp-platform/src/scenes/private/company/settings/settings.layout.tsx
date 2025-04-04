import { Link, useParams } from "@tanstack/react-router";
import clsx from "clsx";
import { TFunction } from "i18next";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCurrentRoute } from "../../../../hooks/useCurrentRoute";

export function SettingsLayout() {
  const route = useCurrentRoute();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => setVisible(!visible);

  const pathname = route.routeId;

  const currentTabName = useMemo(() => {
    switch (pathname) {
      case "/company/$companyId/settings/migration/":
      case "/company/$companyId/settings/migration/$migrator":
        return t("sidebar.menu.companySettings.migration");
      case "/company/$companyId/settings/documentModels":
        return t("sidebar.menu.companySettings.documentModels");
      case "/company/$companyId/settings/integration":
        return t("sidebar.menu.companySettings.integration");

      default:
        return t("sidebar.menu.companySettings.office");
    }
  }, [pathname]);

  return (
    <div className="flex w-full items-center justify-between gap-x-6">
      <nav
        className="flex w-full shrink flex-col overflow-x-auto rounded-xl bg-blue-1000 lg:w-fit lg:flex-row lg:overflow-hidden"
        aria-label="Tabs"
      >
        <div
          className="relative flex cursor-pointer items-center justify-between p-3 lg:hidden"
          onClick={toggleVisible}
        >
          <p className="w-full font-bold text-lg text-white">
            {currentTabName}
          </p>

          <i className="pi pi-angle-down flex text-white"></i>
        </div>
        <Menu visible={visible} t={t} />
      </nav>
    </div>
  );
}
interface MenuProps {
  visible: boolean;
  t: TFunction;
}
function Menu({ visible, t }: MenuProps) {
  const params = useParams({
    from: "/company/$companyId/settings/migration/$migrator",
  });

  return (
    <ul
      className={clsx(
        "flex flex-col lg:flex-row",
        !visible && "hidden lg:flex"
      )}
    >
      <li className="cursor-pointer items-center lg:text-center font-bold text-lg lg:flex p-[2px] rounded-xl">
        <Link
          to="/company/$companyId/settings/"
          params={params}
          className="block px-5 py-1 rounded-[10px] text-white hover:text-white [&.active]:bg-white [&.active]:text-blue-1000 [&.active]:hover:text-blue-1000"
        >
          {t("sidebar.menu.companySettings.office")}
        </Link>
      </li>
      <li className="cursor-pointer items-center lg:text-center font-bold text-lg lg:flex p-[2px] rounded-xl">
        <Link
          to="/company/$companyId/settings/documentModels"
          params={params}
          className="block px-5 py-1 rounded-[10px] text-white hover:text-white [&.active]:bg-white [&.active]:text-blue-1000 [&.active]:hover:text-blue-1000"
        >
          {t("sidebar.menu.companySettings.documentModels")}
        </Link>
      </li>
      <li className="cursor-pointer items-center lg:text-center font-bold text-lg lg:flex p-[2px] rounded-xl">
        <Link
          to="/company/$companyId/settings/migration/"
          params={params}
          className="block px-5 py-1 rounded-[10px] text-white hover:text-white [&.active]:bg-white [&.active]:text-blue-1000 [&.active]:hover:text-blue-1000"
        >
          {t("sidebar.menu.companySettings.migration")}
        </Link>
      </li>
      <li className="cursor-pointer items-center lg:text-center font-bold text-lg lg:flex p-[2px] rounded-xl">
        <Link
          to="/company/$companyId/settings/integration"
          params={params}
          className="block px-5 py-1 rounded-[10px] text-white hover:text-white [&.active]:bg-white [&.active]:text-blue-1000 [&.active]:hover:text-blue-1000"
        >
          {t("sidebar.menu.companySettings.integration")}
        </Link>
      </li>
    </ul>
  );
}
