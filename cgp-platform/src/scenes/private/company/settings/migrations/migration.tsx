import { useNavigate, useParams } from "@tanstack/react-router";
import type { FC } from "react";
import { useQuery } from "react-query";

import { Loading } from "../../../../../components";
import { ConnectorList } from "../../../../../components/ConnectorList";
import { MigrationLogic } from "../../../../../components/Settings/migrations/migration.logic";
import { Widget } from "../../../../../components/Widget";
import { gql } from "../../../../../service/client";

export const CompanyMigration: FC = () => {
  // Hooks
  const params = useParams({
    from: "/company/$companyId/settings/migration/",
  });
  const navigate = useNavigate();

  // Queries
  const migratorListQuery = useQuery("migratorList", () =>
    gql.client.request(MigrationLogic.migratorListQuery())
  );

  if (migratorListQuery.isLoading) return <Loading />;

  return (
    <Widget
      title="scenes.wealthConnection.add.chooseBank"
      className="max-w-4xl"
    >
      <ConnectorList
        className="grid-cols-2"
        list={migratorListQuery.data?.migratorList ?? []}
        onClick={(migrator) =>
          navigate({
            from: "/company/$companyId/settings/migration/",
            to: "/company/$companyId/settings/migration/$migrator",
            params: { ...params, migrator: migrator.key },
          })
        }
      />
    </Widget>
  );
};
