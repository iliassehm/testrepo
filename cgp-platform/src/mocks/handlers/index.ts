import type { GraphQLHandler } from "msw";

import * as m from "./mutations";
import * as q from "./queries";
import { IntegrationMock } from "../../components/Settings/integrations/integrations.mock";
import { MigrationMock } from "../../components/Settings/migrations/migration.mock";
import { CompanyGeneralMock } from "../../components/Settings/office/generalOffice/general.mock";
import { CompanyIntermediationMock } from "../../components/Settings/office/intermediationOffice/intermediation.mock";
import { CompanyLegalMock } from "../../components/Settings/office/legalOffice/legal.mock";
import { OfficeMock } from "../../components/Settings/office/office.mock";
import { TeamMock } from "../../components/Settings/office/workforce/teams/teams.mock";
import { AccountingLogicMock } from "../../scenes/private/company/accounting/accounting.mock";
import { GedLogic } from "../../scenes/private/company/customers/conformity/ged/ged.logic";
import { TransactionsWidgetLogic } from "../../scenes/private/company/customers/wealth/MovementsWidget/transactionsWidget.logic";
import { NotificationLogic } from "../../scenes/private/company/notifications/notifications.logic";
import { CompanyAggregationLogic } from "../../scenes/private/company/settings/office/administrationOffice/aggregation/aggregation.logic";

const queryResults = Object.entries(q)
  .filter(([key]) => key !== "default")
  .filter(([, queryFunction]) => typeof queryFunction === "function")
  .map(([, queryFunction]) => (queryFunction as () => GraphQLHandler)());

const mutationResults = Object.entries(m)
  .filter(([key]) => key !== "default")
  .filter(([, mutationFunction]) => typeof mutationFunction === "function")
  .map(([, mutationFunction]) => (mutationFunction as () => GraphQLHandler)());

export const handlers = [
  ...mutationResults,
  ...queryResults,
  ...CompanyGeneralMock.handlers,
  ...CompanyLegalMock.handlers,
  ...CompanyIntermediationMock.handlers,
  ...NotificationLogic.handlers,
  ...CompanyAggregationLogic.handlers,
  ...TransactionsWidgetLogic.handlers,
  ...TeamMock.handlers,
  ...AccountingLogicMock.handlers,
  ...IntegrationMock.handlers,
  ...GedLogic.handlers,
  ...MigrationMock.handlers,
  ...OfficeMock.handlers,
];
