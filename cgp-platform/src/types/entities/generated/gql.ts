/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

import * as types from "./graphql";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
  "\n      query Authenticated {\n        authenticated {\n          id\n          manager {\n            id\n            name\n            email\n            phone\n            disabledFeatures\n            companyList {\n              id\n              name\n              logo\n              parentCompanyId\n              isParentCompany\n            }\n            parentCompany {\n              id\n              name\n              logo\n            }\n          }\n        }\n      }\n    ":
    types.AuthenticatedDocument,
  "\n      query ManagerClaims($companyID: ID!) {\n        authenticated {\n          manager {\n            claims(companyID: $companyID)\n          }\n        }\n      }\n    ":
    types.ManagerClaimsDocument,
  "\n        query ParentCompanyDocumentTemplateList(\n          $companyID: ID!\n          $available: Boolean!\n        ) {\n          parentCompanyDocumentTemplateList(companyID: $companyID) {\n            id\n            name\n            category\n            creator\n            status\n            url\n            extension\n            properties {\n              type\n            }\n            productType\n          }\n          favorites: parentCompanyDocumentTemplateList(\n            companyID: $companyID\n            available: $available\n          ) {\n            id\n          }\n        }\n      ":
    types.ParentCompanyDocumentTemplateListDocument,
  "\n      query DocumentTemplateList($companyID: ID!, $available: Boolean!) {\n        documentTemplateList(companyID: $companyID) {\n          id\n          name\n          category\n          creator\n          status\n          url\n          extension\n          properties {\n            type\n          }\n          productType\n        }\n        favorites: documentTemplateList(\n          companyID: $companyID\n          available: $available\n        ) {\n          id\n        }\n      }\n    ":
    types.DocumentTemplateListDocument,
  "\n        mutation ParentCompanyAvailableTemplateUpdate(\n          $IDs: [ID!]!\n          $companyID: ID!\n        ) {\n          parentCompanyAvailableTemplateUpdate(\n            IDs: $IDs\n            companyID: $companyID\n          ) {\n            id\n          }\n        }\n      ":
    types.ParentCompanyAvailableTemplateUpdateDocument,
  "\n      mutation AvailableTemplateUpdate($IDs: [ID!]!, $companyID: ID!) {\n        availableTemplateUpdate(IDs: $IDs, companyID: $companyID) {\n          id\n        }\n      }\n    ":
    types.AvailableTemplateUpdateDocument,
  "\n        mutation ParentCompanyDocumentTemplateCreation(\n          $companyID: ID!\n          $input: DocumentTemplateCreation!\n        ) {\n          parentCompanyDocumentTemplateCreation(\n            companyID: $companyID\n            input: $input\n          ) {\n            id\n            name\n            url\n            description\n          }\n        }\n      ":
    types.ParentCompanyDocumentTemplateCreationDocument,
  "\n      mutation DocumentTemplateCreation(\n        $companyID: ID!\n        $input: DocumentTemplateCreation!\n      ) {\n        documentTemplateCreation(companyID: $companyID, input: $input) {\n          id\n          name\n          url\n          description\n        }\n      }\n    ":
    types.DocumentTemplateCreationDocument,
  "\n        mutation ParentDocumentCustomTemplateCreation(\n          $companyID: ID!\n          $input: DocumentTemplateCreation!\n        ) {\n          parentCompanyDocumentCustomTemplateCreation(\n            companyID: $companyID\n            input: $input\n          ) {\n            id\n            name\n            url\n            description\n          }\n        }\n      ":
    types.ParentDocumentCustomTemplateCreationDocument,
  "\n      mutation DocumentCustomTemplateCreation(\n        $companyID: ID!\n        $input: DocumentTemplateCreation!\n      ) {\n        documentCustomTemplateCreation(companyID: $companyID, input: $input) {\n          id\n          name\n          url\n          description\n        }\n      }\n    ":
    types.DocumentCustomTemplateCreationDocument,
  "\n        mutation ParentCompanyDocumentTemplateUpdate(\n          $companyID: ID!\n          $id: ID!\n          $input: DocumentTemplateUpdate!\n        ) {\n          parentCompanyDocumentTemplateUpdate(\n            companyID: $companyID\n            id: $id\n            input: $input\n          ) {\n            id\n          }\n        }\n      ":
    types.ParentCompanyDocumentTemplateUpdateDocument,
  "\n      mutation DocumentTemplateUpdate(\n        $companyID: ID!\n        $id: ID!\n        $input: DocumentTemplateUpdate!\n      ) {\n        documentTemplateUpdate(companyID: $companyID, id: $id, input: $input) {\n          id\n        }\n      }\n    ":
    types.DocumentTemplateUpdateDocument,
  "\n        mutation ParentCompanyDocumentTemplateDelete(\n          $companyID: ID!\n          $id: ID!\n        ) {\n          parentCompanyDocumentTemplateDeletion(companyID: $companyID, id: $id)\n        }\n      ":
    types.ParentCompanyDocumentTemplateDeleteDocument,
  "\n      mutation DocumentTemplateDelete($companyID: ID!, $id: ID!) {\n        documentTemplateDeletion(companyID: $companyID, id: $id)\n      }\n    ":
    types.DocumentTemplateDeleteDocument,
  "\n        mutation mutateParentCompanyDocumentTemplateDeletionMultiple(\n          $companyID: ID!\n          $ids: [ID!]!\n        ) {\n          parentCompanyDocumentTemplateDeletionMultiple(\n            companyID: $companyID\n            ids: $ids\n          )\n        }\n      ":
    types.MutateParentCompanyDocumentTemplateDeletionMultipleDocument,
  "\n      mutation mutateDocumentTemplateDeletionMultiple(\n        $companyID: ID!\n        $ids: [ID!]!\n      ) {\n        documentTemplateDeletionMultiple(companyID: $companyID, ids: $ids)\n      }\n    ":
    types.MutateDocumentTemplateDeletionMultipleDocument,
  "\n        query AvailableIntegrationsList($companyID: ID!) {\n          list: availableIntegrations(companyID: $companyID)\n        }\n      ":
    types.AvailableIntegrationsListDocument,
  "\n          query ParentCompanyInstalledIntegrationsList($companyID: ID!) {\n            list: parentCompanyIntegrationInstalledList(companyID: $companyID) {\n              key\n              added\n              state\n              manager {\n                id\n                name\n                email\n              }\n              access\n              configuration {\n                url\n              }\n            }\n          }\n        ":
    types.ParentCompanyInstalledIntegrationsListDocument,
  "\n        query InstalledIntegrationsList($companyID: ID!) {\n          list: integrationInstalledList(companyID: $companyID) {\n            key\n            added\n            state\n            manager {\n              id\n              name\n              email\n            }\n            access\n            configuration {\n              url\n            }\n          }\n        }\n      ":
    types.InstalledIntegrationsListDocument,
  "\n        query IntegrationDetails($companyID: ID!, $key: IntegrationKey!) {\n          integration: integrationDetails(companyID: $companyID, key: $key) {\n            key\n            added\n            state\n            manager {\n              id\n              name\n              email\n            }\n            access\n            configuration {\n              url\n            }\n          }\n        }\n      ":
    types.IntegrationDetailsDocument,
  "\n          mutation ParentCompanyIntegrationInstallation(\n            $companyID: ID!\n            $key: IntegrationKey!\n          ) {\n            installed: parentCompanyIntegrationInstallation(\n              companyID: $companyID\n              key: $key\n            ) {\n              key\n              state\n            }\n          }\n        ":
    types.ParentCompanyIntegrationInstallationDocument,
  "\n        mutation IntegrationInstallation(\n          $companyID: ID!\n          $key: IntegrationKey!\n        ) {\n          installed: integrationInstallation(companyID: $companyID, key: $key) {\n            key\n            state\n          }\n        }\n      ":
    types.IntegrationInstallationDocument,
  "\n          mutation ParentCompanyIntegrationDeletion(\n            $companyID: ID!\n            $key: IntegrationKey!\n          ) {\n            uninstalled: parentCompanyIntegrationDeletion(\n              companyID: $companyID\n              key: $key\n            ) {\n              key\n              state\n            }\n          }\n        ":
    types.ParentCompanyIntegrationDeletionDocument,
  "\n        mutation IntegrationDeletion($companyID: ID!, $key: IntegrationKey!) {\n          uninstalled: integrationDeletion(companyID: $companyID, key: $key) {\n            key\n            state\n          }\n        }\n      ":
    types.IntegrationDeletionDocument,
  "\n        mutation IntegrationAccessConfiguration(\n          $companyID: ID!\n          $key: IntegrationKey!\n          $access: [IntegrationAccess!]!\n        ) {\n          configured: integrationAccessConfiguration(\n            companyID: $companyID\n            key: $key\n            access: $access\n          ) {\n            key\n            state\n            access\n          }\n        }\n      ":
    types.IntegrationAccessConfigurationDocument,
  "\n      query Migrator($migratorID: ID!) {\n        migrator(migratorID: $migratorID) {\n          key\n          name\n          logo\n        }\n      }\n    ":
    types.MigratorDocument,
  "\n      query MigratorList {\n        migratorList {\n          key\n          name\n          logo\n        }\n      }\n    ":
    types.MigratorListDocument,
  "\n        mutation ParentSynchronizeMigrator(\n          $migratorID: ID!\n          $companyID: ID!\n          $metadata: MigrationMetadata!\n        ) {\n          parentSynchronizeMigrator(\n            companyID: $companyID\n            migratorID: $migratorID\n            metadata: $metadata\n          ) {\n            id\n            state\n          }\n        }\n      ":
    types.ParentSynchronizeMigratorDocument,
  "\n      mutation SynchronizeMigrator(\n        $migratorID: ID!\n        $companyID: ID!\n        $metadata: MigrationMetadata!\n      ) {\n        synchronizeMigrator(\n          companyID: $companyID\n          migratorID: $migratorID\n          metadata: $metadata\n        ) {\n          id\n          state\n        }\n      }\n    ":
    types.SynchronizeMigratorDocument,
  "\n        query CompanyTeamList($companyID: ID!) {\n          list: teamsList(companyID: $companyID) {\n            name\n            description\n            statistics {\n              subordinate\n              contracts\n            }\n          }\n        }\n      ":
    types.CompanyTeamListDocument,
  "\n        query CompanyManagersList($id: ID!) {\n          company(id: $id) {\n            list: managerList {\n              id\n              name\n              email\n            }\n          }\n        }\n      ":
    types.CompanyManagersListDocument,
  "\n        query CompanyTeamDetails($companyID: ID!, $name: String!) {\n          team(companyID: $companyID, name: $name) {\n            name\n            created\n            description\n            statistics {\n              customers\n              contracts\n            }\n            leaderList {\n              id\n              name\n              email\n            }\n            subordinateList {\n              id\n              name\n              email\n            }\n          }\n        }\n      ":
    types.CompanyTeamDetailsDocument,
  "\n        mutation TeamCreation($companyID: ID!, $input: TeamValues!) {\n          created: teamCreation(companyID: $companyID, input: $input) {\n            name\n          }\n        }\n      ":
    types.TeamCreationDocument,
  "\n        mutation TeamUpdate(\n          $companyID: ID!\n          $name: String!\n          $input: TeamValues!\n        ) {\n          updated: teamUpdate(\n            companyID: $companyID\n            name: $name\n            input: $input\n          ) {\n            name\n          }\n        }\n      ":
    types.TeamUpdateDocument,
  "\n        mutation TeamDeletion($companyID: ID!, $name: String!) {\n          deleted: teamDeletion(companyID: $companyID, name: $name) {\n            name\n          }\n        }\n      ":
    types.TeamDeletionDocument,
  "\n        mutation TeamMemberAdd(\n          $companyID: ID!\n          $teamName: String!\n          $values: [TeamMember!]\n        ) {\n          added: teamMemberAdd(\n            companyID: $companyID\n            teamName: $teamName\n            values: $values\n          ) {\n            name\n          }\n        }\n      ":
    types.TeamMemberAddDocument,
  "\n        mutation TeamMemberRemove(\n          $companyID: ID!\n          $teamName: String!\n          $values: [ID!]\n        ) {\n          removed: teamMemberRemove(\n            companyID: $companyID\n            teamName: $teamName\n            values: $values\n          ) {\n            name\n          }\n        }\n      ":
    types.TeamMemberRemoveDocument,
  "\n      query InstrumentListing(\n        $filters: InstrumentFilters!\n        $pagination: Pagination!\n      ) {\n        instrumentListing(filters: $filters, pagination: $pagination) {\n          totalCount\n          totalPages\n          instruments {\n            code\n            label\n            valuation\n            category\n            subcategory\n            managementCompany\n            riskIndicator\n            dic\n            prospectus\n          }\n        }\n      }\n    ":
    types.InstrumentListingDocument,
  "\n      query InstrumentFilters($group: AssetGroup) {\n        instrumentFilters {\n          categories(group: $group)\n          subcategories(group: $group)\n          riskIndicators(group: $group)\n          managementCompanies(group: $group)\n        }\n      }\n    ":
    types.InstrumentFiltersDocument,
  "\n      mutation InstrumentSriUpdate($id: ID!, $riskIndicator: Int!) {\n        instrumentSriUpdate(id: $id, riskIndicator: $riskIndicator) {\n          code\n        }\n      }\n    ":
    types.InstrumentSriUpdateDocument,
  "\n      mutation UpdateCustomerAccess(\n        $companyID: ID!\n        $customerID: ID!\n        $update: CustomerUpdate!\n        $inviteCreation: CustomerInviteCreation!\n        $sendInvite: Boolean!\n      ) {\n        customerUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          update: $update\n        ) {\n          plan\n          id\n        }\n        invite: inviteCustomer(companyID: $companyID, input: $inviteCreation)\n          @include(if: $sendInvite) {\n          id\n          code\n          email\n        }\n      }\n    ":
    types.UpdateCustomerAccessDocument,
  "\n      mutation ReportingCreation(\n        $companyID: ID!\n        $customerID: ID!\n        $documentTypes: [String!]!\n        $period: Int!\n        $contains: [String!]\n        $assetsList: [String!]\n      ) {\n        reportingCreation(\n          companyID: $companyID\n          customerID: $customerID\n          documentTypes: $documentTypes\n          period: $period\n          contains: $contains\n          assetsList: $assetsList\n        ) {\n          type\n          name\n          url\n        }\n      }\n    ":
    types.ReportingCreationDocument,
  "\n      query ReportingCustomerWealthAssets(\n        $id: ID!\n        $companyID: ID!\n        $computing: WealthFilter\n        $groups: [AssetGroup!]\n      ) {\n        customerWealth(\n          id: $id\n          companyID: $companyID\n          groups: $groups\n          computing: $computing\n        ) {\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            metadata\n          }\n        }\n      }\n    ":
    types.ReportingCustomerWealthAssetsDocument,
  "\n      query Manager($companyID: ID!) {\n        authenticated {\n          id\n          manager {\n            id\n            name\n            email\n            phone\n            companyList {\n              id\n              name\n              logo\n            }\n            claims(companyID: $companyID)\n          }\n        }\n      }\n    ":
    types.ManagerDocument,
  "\n      query ManagerInvitePendingList {\n        managerInvitePendingList {\n          id\n          created\n          company {\n            id\n            name\n          }\n        }\n      }\n    ":
    types.ManagerInvitePendingListDocument,
  "\n      mutation ProfileUpdate($input: ProfileUpdate!) {\n        profileUpdate(input: $input) {\n          id\n        }\n      }\n    ":
    types.ProfileUpdateDocument,
  "\n      mutation ManagerInviteAccept($id: ID!) {\n        managerInviteAccept(id: $id) {\n          id\n        }\n      }\n    ":
    types.ManagerInviteAcceptDocument,
  "\n      mutation ManagerInviteReject($id: ID!) {\n        managerInviteReject(id: $id) {\n          id\n        }\n      }\n    ":
    types.ManagerInviteRejectDocument,
  "\n      query Layout($companyID: ID!) {\n        authenticated {\n          manager {\n            claims(companyID: $companyID)\n          }\n        }\n        categories: companyConformityCategories(companyID: $companyID) {\n          key\n          name\n          customerVisibility\n        }\n      }\n    ":
    types.LayoutDocument,
  "\n      query WealthAndPerformance($companyID: ID!, $computing: WealthFilter) {\n        company(id: $companyID) {\n          wealth(computing: $computing)\n        }\n      }\n    ":
    types.WealthAndPerformanceDocument,
  "\n      query LayoutSubWealth($company: ID!) {\n        customersAssetsTypes: companyWealth(\n          id: $company\n          computing: customers\n        ) {\n          name: group\n        }\n        underManagementsAssetsTypes: companyWealth(\n          id: $company\n          computing: under_managements\n        ) {\n          name: group\n        }\n      }\n    ":
    types.LayoutSubWealthDocument,
  "\n      query LayoutCustomer(\n        $customerID: ID!\n        $companyID: ID!\n        $computing: WealthFilter\n      ) {\n        authenticated {\n          manager {\n            claims(companyID: $companyID)\n          }\n        }\n        # customer\n        customer(id: $customerID, companyID: $companyID) {\n          id\n          firstName\n          lastName\n          name\n          email\n          plan\n          hasB2CAccount\n          pendingInvitations {\n            id\n            code\n            created\n            email\n            status\n            updated\n          }\n          informations {\n            details\n            general\n          }\n          valuation: wealth(companyID: $companyID, computing: $computing)\n        }\n      }\n    ":
    types.LayoutCustomerDocument,
  "\n      query Company($id: ID!) {\n        connectionList(companyID: $id) {\n          state\n        }\n      }\n    ":
    types.CompanyDocument,
  "\n      mutation Logout {\n        logoutAuthentication {\n          id\n        }\n      }\n    ":
    types.LogoutDocument,
  "\n      mutation InviteCustomer(\n        $companyID: ID!\n        $input: CustomerInviteCreation!\n      ) {\n        inviteCustomer(companyID: $companyID, input: $input) {\n          id\n          email\n        }\n      }\n    ":
    types.InviteCustomerDocument,
  "\n      mutation CreateCustomer($companyID: ID!, $input: CustomerCreation!) {\n        customer: customerCreation(companyID: $companyID, input: $input) {\n          id\n          name\n        }\n      }\n    ":
    types.CreateCustomerDocument,
  "\n      mutation CreateCustomerReference(\n        $companyID: ID!\n        $input: [CustomerCreation!]!\n        $addCustomerSheet: Boolean\n      ) {\n        customer: customerReferenceCreation(\n          companyID: $companyID\n          input: $input\n          addCustomerSheet: $addCustomerSheet\n        ) {\n          id\n          name\n        }\n      }\n    ":
    types.CreateCustomerReferenceDocument,
  "\n      mutation CompanyCreation($input: CompanyCreation!) {\n        companyCreation(input: $input) {\n          id\n          name\n        }\n      }\n    ":
    types.CompanyCreationDocument,
  "\n        mutation ParentCompanyUpload(\n          $companyID: ID!\n          $files: [UploadRequest!]!\n        ) {\n          parentCompanyUpload(companyID: $companyID, files: $files) {\n            files {\n              url\n              name\n            }\n            expiration\n          }\n        }\n      ":
    types.ParentCompanyUploadDocument,
  "\n      mutation CompanyUpload($companyID: ID!, $files: [UploadRequest!]!) {\n        companyUpload(companyID: $companyID, files: $files) {\n          files {\n            url\n            name\n          }\n          expiration\n        }\n      }\n    ":
    types.CompanyUploadDocument,
  "\n      mutation CustomerCreationMultiple(\n        $companyID: ID!\n        $file: String!\n        $invite: Boolean!\n      ) {\n        customerCreationMultiple(\n          companyID: $companyID\n          file: $file\n          invite: $invite\n        ) {\n          id\n          delayedUntil\n        }\n      }\n    ":
    types.CustomerCreationMultipleDocument,
  "\n      query NewCustomers($companyID: ID!, $input: CustomersInput) {\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                email\n                phoneNumber\n                informations {\n                  details\n                  general\n                }\n                underManagement: wealth(\n                  companyID: $companyID\n                  computing: under_managements\n                )\n              }\n            }\n          }\n        }\n      }\n    ":
    types.NewCustomersDocument,
  "\n      query NewCustomersCount($companyID: ID!, $input: CustomersInput) {\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n          }\n        }\n      }\n    ":
    types.NewCustomersCountDocument,
  "\n      query Assets(\n        $company: ID!\n        $filters: AssetFilters\n        $computing: WealthFilter\n        $group: AssetGroup\n      ) {\n        company(id: $company) {\n          list: assetsUnderManagement(\n            group: $group\n            filters: $filters\n            computing: $computing\n          ) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                group\n                categoryName\n                valuation\n                accountNumber\n                openDate\n                metadata\n                customer {\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    ":
    types.AssetsDocument,
  "\n      query AssetsNumber(\n        $company: ID!\n        $computing: WealthFilter\n        $group: AssetGroup\n        $filters: AssetFilters\n      ) {\n        company(id: $company) {\n          list: assetsUnderManagement(\n            group: $group\n            computing: $computing\n            filters: $filters\n          ) {\n            totalCount\n          }\n        }\n      }\n    ":
    types.AssetsNumberDocument,
  "\n      query NewTransactions(\n        $companyID: ID!\n        $filters: AccountingAnalyticsFilters!\n        $pagination: Pagination!\n      ) {\n        list: accountingTransactionList(\n          companyID: $companyID\n          filters: $filters\n          pagination: $pagination\n        ) {\n          totalCount\n          edges {\n            node {\n              id\n              date\n              amount\n              name\n              entityName\n              assetName\n            }\n          }\n        }\n      }\n    ":
    types.NewTransactionsDocument,
  "\n      query ProviderStatistics(\n        $companyID: ID!\n        $filters: AccountingAnalyticsFilters!\n      ) {\n        list: accountingProviderStatistics(\n          companyID: $companyID\n          filters: $filters\n        ) {\n          name\n          key\n          logo\n          total\n        }\n      }\n    ":
    types.ProviderStatisticsDocument,
  "\n        query AccountingManagersList($id: ID!) {\n          company(id: $id) {\n            list: managerList {\n              id\n              name\n            }\n          }\n        }\n      ":
    types.AccountingManagersListDocument,
  "\n      query AssetList($companyID: ID!, $filters: AccountingAnalyticsFilters!) {\n        accountingAssets(companyID: $companyID, filters: $filters)\n      }\n    ":
    types.AssetListDocument,
  "\n      query Connector($connectorID: ID!) {\n        connector(connectorID: $connectorID) {\n          name\n          logo\n          labels\n        }\n      }\n    ":
    types.ConnectorDocument,
  "\n      query ConnectorList {\n        connectorList {\n          key\n          name\n          logo\n          provider\n        }\n      }\n    ":
    types.ConnectorListDocument,
  "\n      mutation SynchronizePowensConnector($connectorID: ID!, $companyID: ID!) {\n        synchronizePowensConnector(\n          companyID: $companyID\n          connectorID: $connectorID\n        )\n      }\n    ":
    types.SynchronizePowensConnectorDocument,
  "\n      mutation SynchronizeConnector(\n        $connectorID: ID!\n        $companyID: ID!\n        $metadata: ConnectionMetadata!\n      ) {\n        synchronizeConnector(\n          connectorID: $connectorID\n          companyID: $companyID\n          metadata: $metadata\n        ) {\n          connection {\n            id\n            state\n          }\n          synchronization {\n            id\n          }\n        }\n      }\n    ":
    types.SynchronizeConnectorDocument,
  "\n      mutation ChangeConnectionCredentials(\n        $connectionID: ID!\n        $credentials: ConnectionMetadata!\n      ) {\n        changeConnectionCredentials(\n          connectionID: $connectionID\n          credentials: $credentials\n        ) {\n          connection {\n            id\n            state\n          }\n          synchronization {\n            id\n          }\n        }\n      }\n    ":
    types.ChangeConnectionCredentialsDocument,
  "\n      mutation ValidateConnectionOTP($connectionID: ID!, $otp: String!) {\n        validateConnectionOTP(connectionID: $connectionID, otp: $otp) {\n          id\n          state\n        }\n      }\n    ":
    types.ValidateConnectionOtpDocument,
  "\n      mutation GlobalAddWealth($companyID: ID!) {\n        url: synchronizeAssetUnderManagement(companyID: $companyID)\n      }\n    ":
    types.GlobalAddWealthDocument,
  "\n      query Campaigns($companyID: ID!) {\n        campaignList(companyID: $companyID) {\n          id\n          name\n          assetGroup\n          provider\n          customersCount\n          totalInvestment\n          contractList {\n            id\n            investment\n            status\n            customer {\n              id\n              name\n            }\n          }\n        }\n      }\n    ":
    types.CampaignsDocument,
  "\n      query CampaignsDocumentList(\n        $companyID: ID!\n        $contractID: ID!\n        $customerID: ID!\n      ) {\n        documentList(\n          companyID: $companyID\n          contractID: $contractID\n          customerID: $customerID\n        ) {\n          id\n          name\n          expiration\n          treatement\n        }\n      }\n    ":
    types.CampaignsDocumentListDocument,
  "\n      mutation CampaignCreation($companyID: ID!, $input: CampaignCreation!) {\n        campaignCreation(companyID: $companyID, input: $input) {\n          id\n          name\n        }\n      }\n    ":
    types.CampaignCreationDocument,
  "\n      mutation CampaignModification(\n        $campaignID: ID!\n        $companyID: ID!\n        $update: CampaignModification\n      ) {\n        campaignModification(\n          companyID: $companyID\n          campaignID: $campaignID\n          update: $update\n        ) {\n          id\n          name\n        }\n      }\n    ":
    types.CampaignModificationDocument,
  "\n      mutation CampaignContractModification(\n        $contractID: ID!\n        $companyID: ID!\n        $update: CampaignContractModification\n      ) {\n        campaignContractModification(\n          companyID: $companyID\n          contractID: $contractID\n          update: $update\n        ) {\n          id\n        }\n      }\n    ":
    types.CampaignContractModificationDocument,
  "\n      query DocumentCustomerList(\n        $company: String!\n        $documentCategory: String\n        $input: DocumentCustomer\n      ) {\n        documentCustomerList(\n          company: $company\n          documentCategory: $documentCategory\n          input: $input\n        ) {\n          category {\n            key\n            name\n          }\n          totalCount\n          edges {\n            node {\n              id\n              name\n              expiration\n              signature {\n                signed\n                validated\n                digital\n                customer\n                manager\n                signatories\n              }\n              customer {\n                id\n                name\n              }\n            }\n          }\n        }\n      }\n    ":
    types.DocumentCustomerListDocument,
  "\n      mutation DocumentNotification(\n        $documentID: ID!\n        $requests: [NotificationRequest!]!\n      ) {\n        notifyDocumentStatus(documentID: $documentID, requests: $requests) {\n          id\n        }\n      }\n    ":
    types.DocumentNotificationDocument,
  "\n      query CompanyCompliance($company: ID!) {\n        customersCompliance(company: $company) {\n          category {\n            key\n            name\n          }\n          levels {\n            valid\n            unvalid\n            waiting\n          }\n        }\n        globalCompliance(companyID: $company) {\n          valid\n          unvalid\n          waiting\n        }\n      }\n    ":
    types.CompanyComplianceDocument,
  "\n      query Budget($customerID: ID!, $companyID: ID!) {\n        budgetList(customerID: $customerID, companyID: $companyID) {\n          id\n          name\n          type\n          amount\n          libelle\n        }\n        customer(id: $customerID, companyID: $companyID) {\n          availableLiquidity(companyID: $companyID)\n        }\n      }\n    ":
    types.BudgetDocument,
  "\n      mutation BudgetCreation(\n        $customerID: ID!\n        $companyID: ID!\n        $input: BudgetCreationInput!\n        $budgetID: ID\n      ) {\n        created: budgetCreation(\n          customerID: $customerID\n          companyID: $companyID\n          input: $input\n          budgetID: $budgetID\n        ) {\n          libelle\n          name\n          type\n        }\n      }\n    ":
    types.BudgetCreationDocument,
  "\n      mutation BudgetItemDeletion(\n        $companyID: ID!\n        $customerID: ID!\n        $budgetID: ID!\n      ) {\n        budgetItemDeletion(\n          customerID: $customerID\n          companyID: $companyID\n          budgetID: $budgetID\n        )\n      }\n    ":
    types.BudgetItemDeletionDocument,
  "\n      mutation UpdateLCB($companyID: ID!, $customerId: ID!, $input: LCBForm!) {\n        updateLCB(companyID: $companyID, customerId: $customerId, input: $input)\n      }\n    ":
    types.UpdateLcbDocument,
  "\n      query CustomerLcb($companyID: ID!, $customerID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          informations {\n            lcbLab\n          }\n        }\n      }\n    ":
    types.CustomerLcbDocument,
  "\n      query CustomerConformityObjectives($customerID: ID!, $companyID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          conformityObjectives\n        }\n      }\n    ":
    types.CustomerConformityObjectivesDocument,
  "\n      query EnvelopDocumentTemplateList($companyID: ID!, $available: Boolean!) {\n        documentTemplateList(companyID: $companyID, available: $available) {\n          id\n          name\n          category\n          creator\n          productType\n        }\n      }\n    ":
    types.EnvelopDocumentTemplateListDocument,
  "\n      query CustomerConformity(\n        $companyID: ID!\n        $customerID: ID!\n        $officialCategories: [String!]\n        $legalCategories: [String!]\n        $arbitraryCategories: [String!]\n      ) {\n        officialList: documentList(\n          companyID: $companyID\n          customerID: $customerID\n          categories: $officialCategories\n        ) {\n          id\n          name\n          category {\n            key\n            name\n          }\n          treatement\n          expiration\n        }\n        legalList: documentList(\n          companyID: $companyID\n          customerID: $customerID\n          categories: $legalCategories\n        ) {\n          id\n          name\n          category {\n            key\n            name\n          }\n          treatement\n          expiration\n        }\n        envelopeList(\n          companyID: $companyID\n          customerID: $customerID\n          categories: $arbitraryCategories\n        ) {\n          id\n          name\n          access\n          expiration\n          conformity\n          documentList(categories: $arbitraryCategories) {\n            id\n            name\n            category {\n              key\n              name\n            }\n            treatement\n            expiration\n          }\n        }\n      }\n    ":
    types.CustomerConformityDocument,
  "\n      query ConformityDocument($companyID: ID!, $customerID: ID!, $id: ID!) {\n        document(companyID: $companyID, customerID: $customerID, id: $id) {\n          url\n          name\n        }\n      }\n    ":
    types.ConformityDocumentDocument,
  "\n      query SearchCampaign($companyID: ID!, $text: String) {\n        searchCampaign(companyID: $companyID, text: $text) {\n          id\n          name\n          assetGroup\n        }\n      }\n    ":
    types.SearchCampaignDocument,
  "\n      query InvestorProfile($companyID: ID!, $customerID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          investorProfile\n          informations {\n            details\n            general\n          }\n        }\n        investorProfileForm(companyID: $companyID, customerID: $customerID)\n        budgetList(customerID: $customerID, companyID: $companyID) {\n          id\n          name\n          type\n          amount\n          libelle\n        }\n      }\n    ":
    types.InvestorProfileDocument,
  "\n      query InvestorProfileStats($companyID: ID!, $customerID: ID!) {\n        investorProfileStats(companyID: $companyID, customerID: $customerID) {\n          knowledge\n          riskProfile\n          nonFinancialSensitivity\n        }\n        investorEnvironmentalStats(\n          companyID: $companyID\n          customerID: $customerID\n        ) {\n          activities\n          negativeImpacts\n          socialObjectives\n        }\n        investorProfileForm(companyID: $companyID, customerID: $customerID)\n      }\n    ":
    types.InvestorProfileStatsDocument,
  "\n      query templateVariables(\n        $companyID: ID!\n        $customerID: ID!\n        $projectID: ID\n      ) {\n        templateVariables(\n          companyID: $companyID\n          customerID: $customerID\n          projectID: $projectID\n        ) {\n          key\n          value\n        }\n      }\n    ":
    types.TemplateVariablesDocument,
  "\n      mutation CreateFilesFromTemplate(\n        $companyID: ID!\n        $customerID: ID!\n        $templates: [FileFromTemplateInput!]!\n      ) {\n        createFilesFromTemplate(\n          companyID: $companyID\n          customerID: $customerID\n          templates: $templates\n        ) {\n          id\n          url\n          name\n          category\n          extension\n        }\n      }\n    ":
    types.CreateFilesFromTemplateDocument,
  "\n      mutation CreateFilesFromGED(\n        $companyID: ID!\n        $customerID: ID!\n        $gedDocumentsID: [String!]!\n      ) {\n        createFilesFromGedDocuments(\n          companyID: $companyID\n          customerID: $customerID\n          gedDocumentsID: $gedDocumentsID\n        ) {\n          url\n          name\n          category\n          extension\n        }\n      }\n    ":
    types.CreateFilesFromGedDocument,
  "\n      mutation CustomerConformityObjectivesUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: ConformityObjectives!\n      ) {\n        conformityObjectivesUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    ":
    types.CustomerConformityObjectivesUpdateDocument,
  "\n      mutation CustomerUploadCreation(\n        $companyID: ID!\n        $customerID: ID!\n        $files: [UploadRequest!]!\n      ) {\n        customerUpload(\n          companyID: $companyID\n          customerID: $customerID\n          files: $files\n        ) {\n          files {\n            url\n            name\n          }\n          expiration\n        }\n      }\n    ":
    types.CustomerUploadCreationDocument,
  "\n      mutation EnvelopeCreation(\n        $companyID: ID!\n        $customerID: ID!\n        $input: EnvelopeCreation!\n        $notificationRequests: [NotificationRequest!]\n        $addParagraphs: Boolean\n      ) {\n        envelopeCreation(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n          notificationRequests: $notificationRequests\n          addParagraphs: $addParagraphs\n        ) {\n          id\n          name\n        }\n      }\n    ":
    types.EnvelopeCreationDocument,
  "\n      mutation EnvelopeAffectation(\n        $companyID: ID!\n        $customerID: ID!\n        $envelopeID: ID!\n        $campaignID: ID!\n      ) {\n        envelopeAffectation(\n          companyID: $companyID\n          customerID: $customerID\n          envelopeID: $envelopeID\n          campaignID: $campaignID\n        ) {\n          id\n          name\n        }\n      }\n    ":
    types.EnvelopeAffectationDocument,
  "\n      mutation NotifyDocumentStatus(\n        $documentID: ID!\n        $requests: [NotificationRequest!]!\n      ) {\n        notifyDocumentStatus(documentID: $documentID, requests: $requests) {\n          id\n        }\n      }\n    ":
    types.NotifyDocumentStatusDocument,
  "\n      mutation InvestorProfileUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: InvestorProfile!\n      ) {\n        investorProfileUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    ":
    types.InvestorProfileUpdateDocument,
  "\n      mutation DocumentDeletion(\n        $companyID: ID!\n        $customerID: ID!\n        $documentID: [ID!]!\n      ) {\n        documentDeletion(\n          companyID: $companyID\n          customerID: $customerID\n          documentID: $documentID\n        )\n      }\n    ":
    types.DocumentDeletionDocument,
  "\n      mutation DocumentUpdate(\n        $id: ID!\n        $companyID: ID!\n        $update: DocumentUpdate\n      ) {\n        documentUpdate(id: $id, companyID: $companyID, update: $update) {\n          id\n        }\n      }\n    ":
    types.DocumentUpdateDocument,
  "\n      mutation InvestorProfileFormUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: InvestorProfileForm!\n      ) {\n        investorProfileFormUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    ":
    types.InvestorProfileFormUpdateDocument,
  "\n      mutation RequestFormFilling(\n        $companyID: ID!\n        $customerID: ID!\n        $form: Form!\n      ) {\n        requestFormFilling(\n          companyID: $companyID\n          customerID: $customerID\n          form: $form\n        ) {\n          id\n        }\n      }\n    ":
    types.RequestFormFillingDocument,
  "\n      mutation SendToSign($companyID: ID!, $customerID: ID!, $form: Form!) {\n        sendToSign(\n          companyID: $companyID\n          customerID: $customerID\n          form: $form\n        ) {\n          id\n        }\n      }\n    ":
    types.SendToSignDocument,
  "\n      mutation ConvertDocumentToPdf(\n        $companyID: ID!\n        $customerID: ID!\n        $fileUrl: String!\n      ) {\n        convertDocumentToPdf(\n          companyID: $companyID\n          customerID: $customerID\n          fileUrl: $fileUrl\n        )\n      }\n    ":
    types.ConvertDocumentToPdfDocument,
  "\n      query EnvelopeURL($id: ID!, $companyURL: Boolean!, $customerID: ID!) {\n        envelope(id: $id) {\n          companyURL @include(if: $companyURL)\n          customerURL(customerID: $customerID) @skip(if: $companyURL)\n        }\n      }\n    ":
    types.EnvelopeUrlDocument,
  "\n      query EnvelopeList($companyID: ID!, $customerID: ID!) {\n        envelopeList(companyID: $companyID, customerID: $customerID) {\n          name\n          id\n          created\n          treatement: conformity\n          documents: documentList {\n            id\n            created\n            name\n            url\n            expiration\n            extension\n            category {\n              key\n              name\n            }\n            notes\n            treatement\n            signature {\n              digital\n              signatories\n            }\n          }\n        }\n      }\n    ":
    types.EnvelopeListDocument,
  "\n      mutation EnvelopeDeletion(\n        $companyID: ID!\n        $customerID: ID!\n        $envelopeID: ID!\n      ) {\n        envelopeDeletion(\n          companyID: $companyID\n          customerID: $customerID\n          envelopeID: $envelopeID\n        ) {\n          id\n        }\n      }\n    ":
    types.EnvelopeDeletionDocument,
  "\n      mutation EnvelopeUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: EnvelopeAccess!\n      ) {\n        envelopeUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        ) {\n          id\n        }\n      }\n    ":
    types.EnvelopeUpdateDocument,
  "\n      query EnvelopeListOnly($companyID: ID!, $customerID: ID!) {\n        envelopeList(companyID: $companyID, customerID: $customerID) {\n          name\n          id\n          created\n          treatement: conformity\n        }\n      }\n    ":
    types.EnvelopeListOnlyDocument,
  "\n      query EnvelopeCategoryDocumentsList($id: ID!) {\n        envelope(id: $id) {\n          documentList {\n            id\n            name\n            created\n            treatement\n          }\n        }\n      }\n    ":
    types.EnvelopeCategoryDocumentsListDocument,
  "\n      mutation DocumentCategoryCreation(\n        $companyID: ID!\n        $name: String!\n        $customerVisibility: Boolean!\n      ) {\n        documentCategoryCreation(\n          companyID: $companyID\n          name: $name\n          customerVisibility: $customerVisibility\n        ) {\n          name\n        }\n      }\n    ":
    types.DocumentCategoryCreationDocument,
  "\n      query GedDocumentCategoryList($companyID: ID!, $customerID: ID!) {\n        documentCategoryList(companyID: $companyID) {\n          key\n          name\n          documents(companyID: $companyID, customerID: $customerID) {\n            id\n            name\n            envelope {\n              name\n            }\n          }\n        }\n      }\n    ":
    types.GedDocumentCategoryListDocument,
  "\n      mutation DocumentAdd(\n        $companyID: ID!\n        $customerID: ID!\n        $input: DocumentAdd!\n      ) {\n        documentAdd(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        ) {\n          id\n        }\n      }\n    ":
    types.DocumentAddDocument,
  "\n      mutation DocumentCategoryUpdate(\n        $companyID: ID!\n        $key: String!\n        $updatedName: String!\n        $customerVisibility: Boolean!\n      ) {\n        documentCategoryUpdate(\n          companyID: $companyID\n          key: $key\n          updatedName: $updatedName\n          customerVisibility: $customerVisibility\n        ) {\n          name\n        }\n      }\n    ":
    types.DocumentCategoryUpdateDocument,
  "\n      mutation DocumentCategoryDeletion($companyID: ID!, $key: String!) {\n        documentCategoryDeletion(companyID: $companyID, key: $key) {\n          name\n        }\n      }\n    ":
    types.DocumentCategoryDeletionDocument,
  "\n      query documentList(\n        $companyID: ID!\n        $customerID: ID!\n        $categories: [String!]\n      ) {\n        documentList(\n          companyID: $companyID\n          customerID: $customerID\n          categories: $categories\n        ) {\n          name\n          created\n        }\n      }\n    ":
    types.DocumentListDocument,
  "\n      query DocumentCategoryListOnly($companyID: ID!) {\n        documentCategoryList(companyID: $companyID) {\n          key\n          name\n          customerVisibility\n        }\n      }\n    ":
    types.DocumentCategoryListOnlyDocument,
  "\n      query CategoryDocumentsList(\n        $companyID: ID!\n        $customerID: ID!\n        $categoryKey: String!\n      ) {\n        documentCategory(companyID: $companyID, categoryKey: $categoryKey) {\n          documents(companyID: $companyID, customerID: $customerID) {\n            id\n            name\n            created\n            treatement\n          }\n        }\n      }\n    ":
    types.CategoryDocumentsListDocument,
  "\n      query DocumentInfo($companyID: ID!, $customerID: ID!, $id: ID!) {\n        document(companyID: $companyID, customerID: $customerID, id: $id) {\n          id\n          created\n          name\n          expiration\n          category {\n            key\n            name\n          }\n          treatement\n          notes\n          extension\n          signature {\n            signed\n            validated\n            digital\n            customer\n            manager\n            signatories\n          }\n          envelope {\n            id\n            name\n          }\n        }\n      }\n    ":
    types.DocumentInfoDocument,
  "\n      query DocumentUrl($companyID: ID!, $customerID: ID!, $id: ID!) {\n        document(companyID: $companyID, customerID: $customerID, id: $id) {\n          url\n        }\n      }\n    ":
    types.DocumentUrlDocument,
  "\n      query Customers($companyID: ID!, $input: CustomersInput) {\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                lastName\n                firstName\n                email\n                type\n                plan\n                phoneNumber\n                hasB2CAccount\n                informations {\n                  details\n                  general\n                }\n                wealth(companyID: $companyID)\n                conformity(companyID: $companyID)\n                manager(companyID: $companyID) {\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    ":
    types.CustomersDocument,
  "\n      query CustomerDetails($companyID: ID!) {\n        company(id: $companyID) {\n          wealth\n        }\n        customerDetails(companyID: $companyID) {\n          count\n          managedWealth\n          averageWealth\n        }\n      }\n    ":
    types.CustomerDetailsDocument,
  "\n      mutation exportCustomerList($companyID: ID!, $input: CustomersInput!) {\n        url: exportCustomerList(companyID: $companyID, input: $input)\n      }\n    ":
    types.ExportCustomerListDocument,
  "\n      mutation CustomerDetailsUpdate(\n        $companyID: ID!\n        $input: CustomerDetailsUpdateInput!\n      ) {\n        customerDetailsUpdate(companyID: $companyID, input: $input) {\n          count\n        }\n      }\n    ":
    types.CustomerDetailsUpdateDocument,
  "\n      mutation CustomerDeletion($companyID: ID!, $customerID: ID!) {\n        customerDeletion(companyID: $companyID, customerID: $customerID)\n      }\n    ":
    types.CustomerDeletionDocument,
  "\n      query CustomerManager($id: ID!, $companyID: ID!) {\n        customer(id: $id, companyID: $companyID) {\n          manager(companyID: $companyID) {\n            id\n            name\n            email\n            phone\n            providerCode\n          }\n        }\n      }\n    ":
    types.CustomerManagerDocument,
  "\n      query CustomerFiscality($customerID: ID!, $companyID: ID!, $year: Int!) {\n        customer(id: $customerID, companyID: $companyID) {\n          fiscality(year: $year)\n        }\n      }\n    ":
    types.CustomerFiscalityDocument,
  "\n      mutation UpdateFiscality(\n        $companyID: ID!\n        $customerID: ID!\n        $input: FiscalityInformations!\n        $year: Int!\n      ) {\n        customerFiscality(\n          companyID: $companyID\n          id: $customerID\n          input: $input\n          year: $year\n        )\n      }\n    ":
    types.UpdateFiscalityDocument,
  "\n      query listNote($companyID: ID!, $customerID: ID!) {\n        listNote(companyID: $companyID, customerID: $customerID) {\n          id\n          content\n          created\n          updated\n        }\n      }\n    ":
    types.ListNoteDocument,
  "\n      mutation exportNotes($companyID: ID!, $customerID: ID!) {\n        url: exportNotes(companyID: $companyID, customerID: $customerID)\n      }\n    ":
    types.ExportNotesDocument,
  "\n      mutation deleteNote($noteId: ID!) {\n        deleteNote(noteId: $noteId) {\n          id\n          content\n          created\n          updated\n        }\n      }\n    ":
    types.DeleteNoteDocument,
  "\n      mutation createNote(\n        $companyID: ID!\n        $customerID: ID!\n        $content: String!\n      ) {\n        createNote(\n          companyID: $companyID\n          customerID: $customerID\n          content: $content\n        ) {\n          id\n          content\n          created\n          updated\n        }\n      }\n    ":
    types.CreateNoteDocument,
  "\n      mutation updateNote($noteId: ID!, $content: String!) {\n        updateNote(noteId: $noteId, content: $content) {\n          id\n          content\n          created\n          updated\n        }\n      }\n    ":
    types.UpdateNoteDocument,
  "\n      query conformityStatus($companyID: ID!, $customerID: ID!) {\n        conformityStatus(companyID: $companyID, customerID: $customerID) {\n          conformityId\n          engagementLetter {\n            date\n            status\n            info\n            documentId\n          }\n          officialDocuments {\n            date\n            status\n            info\n          }\n          informationCollections {\n            date\n            status\n            info\n          }\n          investorProfile {\n            date\n            status\n            info\n            documentId\n          }\n          LCB {\n            date\n            status\n            info\n          }\n          DER {\n            date\n            status\n            info\n            documentId\n          }\n          objectivesHeritage {\n            date\n            status\n            info\n            documentId\n          }\n        }\n      }\n    ":
    types.ConformityStatusDocument,
  "\n      mutation addDocumentToConformity(\n        $companyID: ID!\n        $customerID: ID!\n        $conformityID: ID\n        $input: DocumentToConformityInput!\n      ) {\n        addDocumentToConformity(\n          companyID: $companyID\n          customerID: $customerID\n          conformityID: $conformityID\n          input: $input\n        ) {\n          conformityId\n          engagementLetter {\n            date\n            status\n            info\n          }\n          officialDocuments {\n            date\n            status\n            info\n          }\n          informationCollections {\n            date\n            status\n            info\n          }\n          investorProfile {\n            date\n            status\n            info\n          }\n          LCB {\n            date\n            status\n            info\n          }\n          DER {\n            date\n            status\n            info\n          }\n        }\n      }\n    ":
    types.AddDocumentToConformityDocument,
  "\n      query listCustomerTask($companyID: ID!, $customerID: ID!) {\n        listCustomerTask(companyID: $companyID, customerID: $customerID) {\n          id\n          title\n          category\n          contractNumber\n          content\n          updated\n          schedule\n          created\n          completed\n          customer {\n            id\n            name\n          }\n          company {\n            id\n            name\n          }\n          assigned_manager {\n            id\n            name\n          }\n          entityRelatedId\n          entityRelatedType\n        }\n      }\n    ":
    types.ListCustomerTaskDocument,
  "\n      query ListCompanyTaskByType($companyID: ID!, $filter: CompanyTaskFilter) {\n        listCompanyTaskByType(companyID: $companyID, filter: $filter) {\n          categories {\n            type\n            count\n            tasks {\n              id\n              title\n              category\n              contractNumber\n              content\n              updated\n              schedule\n              created\n              completed\n              customer {\n                id\n                name\n              }\n              company {\n                id\n                name\n              }\n              assigned_manager {\n                id\n                name\n              }\n            }\n          }\n          managers {\n            type\n            count\n            tasks {\n              id\n              title\n              category\n              contractNumber\n              content\n              updated\n              schedule\n              created\n              completed\n              customer {\n                id\n                name\n              }\n              company {\n                id\n                name\n              }\n              assigned_manager {\n                id\n                name\n              }\n            }\n          }\n        }\n      }\n    ":
    types.ListCompanyTaskByTypeDocument,
  "\n      query Task($id: ID!, $companyID: ID!) {\n        fetchSingleTask(id: $id, companyID: $companyID) {\n          id\n          title\n          category\n          contractNumber\n          content\n          updated\n          schedule\n          created\n          completed\n          customer {\n            id\n            name\n          }\n          company {\n            id\n            name\n          }\n          assigned_manager {\n            id\n            name\n          }\n        }\n      }\n    ":
    types.TaskDocument,
  "\n      query CompanyTaskSearch($companyID: ID!, $filter: CompanyTaskFilter) {\n        companyTaskSearch(companyID: $companyID, filter: $filter) {\n          count\n          tasks {\n            id\n            title\n            category\n            contractNumber\n            content\n            updated\n            schedule\n            created\n            completed\n            managerName\n            customerName\n            customerId\n          }\n        }\n      }\n    ":
    types.CompanyTaskSearchDocument,
  "\n      query CompanyTaskCountByStatus(\n        $companyID: ID!\n        $filter: CompanyTaskFilter\n      ) {\n        companyTaskCountByStatus(companyID: $companyID, filter: $filter) {\n          status\n          count\n        }\n      }\n    ":
    types.CompanyTaskCountByStatusDocument,
  "\n      query CompanyTaskCountByCategories(\n        $companyID: ID!\n        $filter: CompanyTaskFilter\n      ) {\n        companyTaskCountByCategories(companyID: $companyID, filter: $filter) {\n          category\n          count\n        }\n      }\n    ":
    types.CompanyTaskCountByCategoriesDocument,
  "\n      query CompanyTaskCountByManagers(\n        $companyID: ID!\n        $filter: CompanyTaskFilter\n      ) {\n        companyTaskCountByManagers(companyID: $companyID, filter: $filter) {\n          id\n          name\n          count\n        }\n      }\n    ":
    types.CompanyTaskCountByManagersDocument,
  "\n      query TaskCategoryList($companyID: ID!) {\n        taskCategoryList(companyID: $companyID) {\n          key\n          name\n          default\n        }\n      }\n    ":
    types.TaskCategoryListDocument,
  "\n      mutation CreateTaskCategory($companyID: ID!, $input: TaskCategoryInput!) {\n        createTaskCategory(companyID: $companyID, input: $input) {\n          key\n          name\n          default\n        }\n      }\n    ":
    types.CreateTaskCategoryDocument,
  "\n      query AssetsAccountNumbers($companyID: ID!, $customerID: ID!) {\n        accountNumbers: assetsAccountNumbers(\n          companyID: $companyID\n          customerID: $customerID\n        ) {\n          value\n          label\n        }\n      }\n    ":
    types.AssetsAccountNumbersDocument,
  "\n      query CustomersList($companyID: ID!, $input: CustomersInput) {\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                lastName\n                firstName\n              }\n            }\n          }\n        }\n      }\n    ":
    types.CustomersListDocument,
  "\n      mutation exportTasks($companyID: ID!, $customerID: ID) {\n        url: exportTasks(companyID: $companyID, customerID: $customerID)\n      }\n    ":
    types.ExportTasksDocument,
  "\n      mutation completedTask($taskId: ID!) {\n        completedTask(taskId: $taskId) {\n          id\n          content\n          updated\n          schedule\n          created\n          completed\n        }\n      }\n    ":
    types.CompletedTaskDocument,
  "\n      mutation createTask(\n        $companyID: ID!\n        $customerID: ID!\n        $input: TaskInput!\n      ) {\n        createTask(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        ) {\n          id\n          title\n          category\n          contractNumber\n          content\n          updated\n          schedule\n          created\n          completed\n        }\n      }\n    ":
    types.CreateTaskDocument,
  "\n      mutation updateTask($taskId: ID!, $companyID: ID!, $input: TaskInput!) {\n        updateTask(taskId: $taskId, companyID: $companyID, input: $input) {\n          id\n          title\n          category\n          contractNumber\n          content\n          created\n          updated\n        }\n      }\n    ":
    types.UpdateTaskDocument,
  "\n      query CustomerWidgetWealth(\n        $id: ID!\n        $companyID: ID!\n        $financialIgnoredGroup: [AssetGroup!]\n        $passiveIgnoredGroup: [AssetGroup!]\n        $nonFinancialIgnoredGroup: [AssetGroup!]\n        $othersIgnoredGroup: [AssetGroup!]\n        $totalIgnoredGroup: [AssetGroup!]\n        $start: DateTime\n        $end: DateTime\n      ) {\n        customer(id: $id, companyID: $companyID) {\n          totalWealth: wealth(\n            companyID: $companyID\n            ignoring: $totalIgnoredGroup\n          )\n\n          financialWealth: wealth(\n            companyID: $companyID\n            ignoring: $financialIgnoredGroup\n          )\n          financialPerformance: performance(\n            ignoring: $financialIgnoredGroup\n            companyID: $companyID\n            start: $start\n            end: $end\n          ) {\n            gain\n            evolution\n          }\n\n          nonFinancialWealth: wealth(\n            companyID: $companyID\n            ignoring: $nonFinancialIgnoredGroup\n          )\n          nonFinancialPerformance: performance(\n            ignoring: $nonFinancialIgnoredGroup\n            companyID: $companyID\n            start: $start\n            end: $end\n          ) {\n            gain\n            evolution\n          }\n\n          othersWealth: wealth(\n            companyID: $companyID\n            ignoring: $othersIgnoredGroup\n          )\n\n          passiveWealth: wealth(\n            companyID: $companyID\n            ignoring: $passiveIgnoredGroup\n          )\n\n          underManagement: wealth(\n            companyID: $companyID\n            computing: under_managements\n          )\n          underManagementPerformance: performance(\n            companyID: $companyID\n            start: $start\n            end: $end\n            computing: under_managements\n          ) {\n            gain\n            evolution\n          }\n        }\n      }\n    ":
    types.CustomerWidgetWealthDocument,
  "\n      query CustomerInformations($customerID: ID!, $companyID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          name\n          email\n          phoneNumber\n          plan\n          type\n          tag\n          informations {\n            details\n            general\n          }\n          hasB2CAccount\n          pendingInvitations {\n            id\n            code\n            created\n            email\n          }\n        }\n      }\n    ":
    types.CustomerInformationsDocument,
  "\n      query CustomerInformationsFullFields($customerID: ID!, $companyID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          name\n          firstName\n          lastName\n          email\n          phoneNumber\n          plan\n          type\n          tag\n          investorProfile\n          informations {\n            details\n            general\n            lcbLab\n          }\n          hasB2CAccount\n          pendingInvitations {\n            id\n            code\n            created\n            email\n          }\n        }\n        investorProfileForm(companyID: $companyID, customerID: $customerID)\n      }\n    ":
    types.CustomerInformationsFullFieldsDocument,
  "\n      query HoldingQueries($companyID: ID!, $customerId: ID!) {\n        holdingList(companyID: $companyID, customerId: $customerId) {\n          id\n          name\n          form\n          companies {\n            id\n            name\n            # form\n            ownerName\n            created\n          }\n        }\n        businessList(companyID: $companyID, customerId: $customerId) {\n          id\n          name\n          informations {\n            general\n          }\n        }\n      }\n    ":
    types.HoldingQueriesDocument,
  "\n      query HoldingList($companyID: ID!, $customerId: ID!) {\n        holdingList(companyID: $companyID, customerId: $customerId) {\n          id\n          name\n          form\n          companies {\n            id\n            name\n            # form\n            ownerName\n            created\n          }\n        }\n      }\n    ":
    types.HoldingListDocument,
  "\n      query BusinessList($companyID: ID!, $customerId: ID!) {\n        businessList(companyID: $companyID, customerId: $customerId) {\n          id\n          name\n          informations {\n            general\n          }\n        }\n      }\n    ":
    types.BusinessListDocument,
  "\n      mutation UpdateCustomerInformationsGeneral(\n        $companyID: ID!\n        $customerID: ID!\n        $input: GeneralInformations!\n      ) {\n        customerInformationsGeneral(\n          companyID: $companyID\n          id: $customerID\n          input: $input\n        )\n      }\n    ":
    types.UpdateCustomerInformationsGeneralDocument,
  "\n      mutation customerReferencesAccessUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $values: [ReferenceAccessValue!]!\n      ) {\n        customerReferencesAccessUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          values: $values\n        ) {\n          manager {\n            id\n            name\n          }\n          primary\n          customer {\n            id\n            name\n            email\n          }\n        }\n      }\n    ":
    types.CustomerReferencesAccessUpdateDocument,
  "\n      mutation UpdateCustomerInformationsDetail(\n        $companyID: ID!\n        $customerID: ID!\n        $input: DetailsInformations!\n      ) {\n        customerInformationsDetail(\n          companyID: $companyID\n          id: $customerID\n          input: $input\n        )\n      }\n    ":
    types.UpdateCustomerInformationsDetailDocument,
  "\n      mutation HoldingCreation(\n        $companyID: ID!\n        $customerId: ID!\n        $name: String!\n        $input: HoldingForm!\n      ) {\n        holdingCreation(\n          companyID: $companyID\n          customerId: $customerId\n          name: $name\n          input: $input\n        ) {\n          id\n        }\n      }\n    ":
    types.HoldingCreationDocument,
  "\n      mutation HoldingUpdate(\n        $companyID: ID!\n        $id: ID!\n        $name: String!\n        $input: HoldingForm!\n      ) {\n        holdingUpdate(\n          companyID: $companyID\n          id: $id\n          name: $name\n          input: $input\n        ) {\n          id\n        }\n      }\n    ":
    types.HoldingUpdateDocument,
  "\n      mutation HoldingDeletion($companyID: ID!, $IDs: [ID!]!) {\n        holdingDeletion(companyID: $companyID, IDs: $IDs) {\n          name\n        }\n      }\n    ":
    types.HoldingDeletionDocument,
  "\n      mutation AssignHoldingsToBusiness(\n        $companyID: ID!\n        $businessID: ID!\n        $customerId: ID!\n        $holdingIds: [ID!]!\n      ) {\n        assignHoldingsToBusiness(\n          companyID: $companyID\n          businessID: $businessID\n          customerId: $customerId\n          holdingIds: $holdingIds\n        ) {\n          id\n          name\n        }\n      }\n    ":
    types.AssignHoldingsToBusinessDocument,
  "\n      mutation BusinessCreate(\n        $companyID: ID!\n        $customerId: ID!\n        $input: HoldingCompanyInfo!\n      ) {\n        businessCreate(\n          companyID: $companyID\n          customerId: $customerId\n          input: $input\n        ) {\n          id\n        }\n      }\n    ":
    types.BusinessCreateDocument,
  "\n      mutation BusinessUpdate(\n        $companyID: ID!\n        $id: ID!\n        $information: HoldingCompanyInfo\n        $managers: HoldingManagerSchema\n        $nbManagers: NbHoldingManagerSchema\n        $bankAccounts: CompanyFinancialSchema\n        $activities: CompanyActivitiesSchema\n        $tag: String\n      ) {\n        businessUpdate(\n          companyID: $companyID\n          id: $id\n          information: $information\n          managers: $managers\n          nbManagers: $nbManagers\n          bankAccounts: $bankAccounts\n          activities: $activities\n          tag: $tag\n        ) {\n          id\n        }\n      }\n    ":
    types.BusinessUpdateDocument,
  "\n      mutation BusinessDeletion($companyID: ID!, $IDs: [ID!]!) {\n        businessDeletion(companyID: $companyID, IDs: $IDs) {\n          id\n        }\n      }\n    ":
    types.BusinessDeletionDocument,
  "\n      mutation createCustomerFromBusiness(\n        $companyID: ID!\n        $customerID: ID!\n        $businessID: ID!\n        $addToCustomerReference: Boolean\n      ) {\n        createCustomerFromBusiness(\n          companyID: $companyID\n          customerID: $customerID\n          businessID: $businessID\n          addToCustomerReference: $addToCustomerReference\n        )\n      }\n    ":
    types.CreateCustomerFromBusinessDocument,
  "\n      query CustomerRelation($companyID: ID!, $customerID: ID!) {\n        customerRelation(companyID: $companyID, customerID: $customerID) {\n          list\n        }\n      }\n    ":
    types.CustomerRelationDocument,
  "\n      mutation CustomerRelationCreate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: CustomerRelationForm!\n      ) {\n        customerRelationCreate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    ":
    types.CustomerRelationCreateDocument,
  "\n      mutation CustomerRelationUpdate(\n        $id: ID!\n        $companyID: ID!\n        $customerID: ID!\n        $input: CustomerRelationForm!\n      ) {\n        customerRelationUpdate(\n          id: $id\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    ":
    types.CustomerRelationUpdateDocument,
  "\n      mutation CreateUserFromRelation(\n        $id: ID!\n        $companyID: ID!\n        $customerID: ID!\n        $addToCustomerReference: Boolean!\n      ) {\n        createUserFromRelation(\n          id: $id\n          companyID: $companyID\n          customerID: $customerID\n          addToCustomerReference: $addToCustomerReference\n        )\n      }\n    ":
    types.CreateUserFromRelationDocument,
  "\n      mutation CreateRelationFromExistingCustomer(\n        $companyID: ID!\n        $customerID: ID!\n        $existingCustomerID: ID!\n      ) {\n        createRelationFromExistingCustomer(\n          companyID: $companyID\n          customerID: $customerID\n          existingCustomerID: $existingCustomerID\n        ) {\n          id\n          firstName\n          lastName\n          email\n          informations {\n            details\n            general\n          }\n        }\n      }\n    ":
    types.CreateRelationFromExistingCustomerDocument,
  "\n      mutation UnlinkFromCustomerReference($id: ID!, $companyID: ID!) {\n        unlinkFromCustomerReference(id: $id, companyID: $companyID)\n      }\n    ":
    types.UnlinkFromCustomerReferenceDocument,
  "\n      mutation CustomerRelationDelete(\n        $companyID: ID!\n        $id: ID!\n        $customerID: ID!\n      ) {\n        customerRelationDelete(\n          companyID: $companyID\n          id: $id\n          customerID: $customerID\n        )\n      }\n    ":
    types.CustomerRelationDeleteDocument,
  "\n      mutation CustomerRelations(\n        $companyID: ID!\n        $id: ID!\n        $input: CustomerRelationForm!\n      ) {\n        customerRelations(companyID: $companyID, id: $id, input: $input)\n      }\n    ":
    types.CustomerRelationsDocument,
  "\n      mutation CustomerManagerUpdate(\n        $customerID: ID!\n        $companyID: ID!\n        $providerCode: String\n        $managerID: ID\n      ) {\n        updateCustomerManager(\n          customerID: $customerID\n          companyID: $companyID\n          providerCode: $providerCode\n          managerID: $managerID\n        ) {\n          id\n        }\n      }\n    ":
    types.CustomerManagerUpdateDocument,
  "\n      query ContractList(\n        $filters: ContractFilters!\n        $pagination: Pagination!\n        $companyID: ID!\n      ) {\n        contractListing(\n          companyID: $companyID\n          filters: $filters\n          pagination: $pagination\n        ) {\n          totalCount\n          totalPages\n          contracts {\n            id\n            isSelected(companyID: $companyID)\n            name\n            type\n            insuranceCompany\n            intermediary\n            performance\n            accountUnits\n            managed\n            metadata(companyID: $companyID)\n            managedModes\n            fundsOrigin\n            minTransferAmount\n            maxTransferFees\n            arbitrageFees\n            yearlyFees\n          }\n        }\n      }\n    ":
    types.ContractListDocument,
  "\n      query ContractFilters {\n        contractFilters {\n          insuranceCompanies\n          types\n          managedModes\n          fundsOrigins\n        }\n      }\n    ":
    types.ContractFiltersDocument,
  "\n      mutation AutomaticContractCompare($input: CompareContract!) {\n        automaticContractCompare(input: $input) {\n          id\n          name\n          type\n          insuranceCompany\n          intermediary\n          performance\n          accountUnits\n          managed\n          managedModes\n          fundsOrigin\n          minTransferAmount\n          maxTransferFees\n          arbitrageFees\n          yearlyFees\n        }\n      }\n    ":
    types.AutomaticContractCompareDocument,
  "\n      mutation linkContractToCompany($contractId: ID!, $companyId: ID!) {\n        linkContractToCompany(contractId: $contractId, companyId: $companyId) {\n          id\n          name\n          type\n          insuranceCompany\n          intermediary\n          performance\n          accountUnits\n          managed\n          managedModes\n          fundsOrigin\n          minTransferAmount\n          maxTransferFees\n          arbitrageFees\n          yearlyFees\n        }\n      }\n    ":
    types.LinkContractToCompanyDocument,
  "\n      mutation unlinkContractFromCompany($contractId: ID!, $companyId: ID!) {\n        unlinkContractFromCompany(\n          contractId: $contractId\n          companyId: $companyId\n        ) {\n          id\n          name\n          type\n          insuranceCompany\n          intermediary\n          performance\n          accountUnits\n          managed\n          managedModes\n          fundsOrigin\n          minTransferAmount\n          maxTransferFees\n          arbitrageFees\n          yearlyFees\n        }\n      }\n    ":
    types.UnlinkContractFromCompanyDocument,
  "\n      mutation UpdateFavoriteContractMetadata(\n        $contractID: ID!\n        $companyID: ID!\n        $input: FavoriteContractMetadata!\n      ) {\n        updateFavoriteContractMetadata(\n          companyID: $companyID\n          contractID: $contractID\n          input: $input\n        )\n      }\n    ":
    types.UpdateFavoriteContractMetadataDocument,
  "\n      query InstrumentsList(\n        $filters: FavoriteInstrumentsFilters!\n        $pagination: Pagination!\n      ) {\n        instrumentListingWithFavorites(\n          filters: $filters\n          pagination: $pagination\n        ) {\n          totalCount\n          totalPages\n          instruments {\n            code\n            category\n            label\n            managementCompany\n            isFavorite\n            valuation\n          }\n        }\n      }\n    ":
    types.InstrumentsListDocument,
  "\n      query FavoriteInstrumentsList(\n        $filters: FavoriteInstrumentsFilters!\n        $pagination: Pagination!\n      ) {\n        instrumentFavorites(filters: $filters, pagination: $pagination) {\n          totalCount\n          totalPages\n          instruments {\n            code\n            category\n            label\n            managementCompany\n            isFavorite\n            valuation\n          }\n        }\n      }\n    ":
    types.FavoriteInstrumentsListDocument,
  "\n      query InstrumentFiltersQuery {\n        instrumentFavoriteFilters {\n          categories\n          managementCompanies\n        }\n      }\n    ":
    types.InstrumentFiltersQueryDocument,
  "\n      mutation setInstrumentFavorite(\n        $code: ID!\n        $isFavorite: Boolean!\n        $companyID: ID!\n      ) {\n        setInstrumentFavorite(\n          code: $code\n          isFavorite: $isFavorite\n          companyID: $companyID\n        ) {\n          code\n        }\n      }\n    ":
    types.SetInstrumentFavoriteDocument,
  "\n      query Project($id: ID!) {\n        project(id: $id) {\n          id\n          created\n          validated\n          archived\n          name\n          type\n          metadata\n        }\n      }\n    ":
    types.ProjectDocument,
  "\n      query ProjectList(\n        $customerID: ID!\n        $companyID: ID!\n        $range: TimeRange!\n        $type: ProjectType\n        $productType: String\n      ) {\n        projectList(\n          customerID: $customerID\n          companyID: $companyID\n          range: $range\n          type: $type\n          productType: $productType\n        ) {\n          id\n          created\n          validated\n          archived\n          name\n          type\n          metadata\n        }\n      }\n    ":
    types.ProjectListDocument,
  "\n      mutation ProjectDeletion($id: ID!) {\n        projectDeletion(id: $id) {\n          id\n        }\n      }\n    ":
    types.ProjectDeletionDocument,
  "\n      mutation ProjectValidation($id: ID!, $customerID: ID!, $companyID: ID!) {\n        projectValidation(\n          id: $id\n          customerID: $customerID\n          companyID: $companyID\n        ) {\n          id\n        }\n      }\n    ":
    types.ProjectValidationDocument,
  "\n      mutation ProjectCreation(\n        $customerID: ID!\n        $companyID: ID!\n        $type: ProjectType!\n        $name: String!\n        $metadata: ProjectMetadata!\n      ) {\n        projectCreation(\n          customerID: $customerID\n          companyID: $companyID\n          type: $type\n          name: $name\n          metadata: $metadata\n        ) {\n          id\n        }\n      }\n    ":
    types.ProjectCreationDocument,
  "\n      mutation ProjectUpdate($id: ID!, $metadata: ProjectMetadata!) {\n        projectUpdate(id: $id, metadata: $metadata) {\n          id\n        }\n      }\n    ":
    types.ProjectUpdateDocument,
  "\n      query ProjectProductTypes($companyID: ID!, $customerID: ID!) {\n        projectProductTypes(companyID: $companyID, customerID: $customerID)\n      }\n    ":
    types.ProjectProductTypesDocument,
  "\n      mutation GenerateAdequacy($projectID: ID!, $customerID: ID!) {\n        generateAdequacy(projectID: $projectID, customerID: $customerID) {\n          name\n          url\n          extension\n        }\n      }\n    ":
    types.GenerateAdequacyDocument,
  "\n      query SearchCustomers($companyID: ID!, $schema: CustomerSearchSchema!) {\n        searchCustomers(companyID: $companyID, schema: $schema) {\n          id\n        }\n      }\n    ":
    types.SearchCustomersDocument,
  "\n      query CustomersSearchFilters($companyID: ID!, $underManagement: Boolean) {\n        customersSearchFilters(\n          companyID: $companyID\n          underManagement: $underManagement\n        ) {\n          insuranceCompany\n          category\n          group\n\n          investmentType\n          investmentManagementCompany\n          tags\n        }\n      }\n    ":
    types.CustomersSearchFiltersDocument,
  "\n      query SearchCustomersResult($companyID: ID!, $id: ID!) {\n        getSearchResult(companyID: $companyID, id: $id) {\n          id\n          result {\n            ... on CustomerAsset {\n              __typename\n              id\n              customer {\n                id\n                name\n              }\n              performance {\n                gain\n                evolution\n              }\n\n              mixedData\n              accountNumber\n              openDate\n              group\n              name\n              valuation\n\n              investmentCode\n              investmentLabel\n              investmentValuation\n              investmentPerformance\n            }\n\n            ... on Customer {\n              __typename\n              id\n              name\n              underManagementWealth: wealth(\n                companyID: $companyID\n                computing: under_managements\n              )\n              wealth(companyID: $companyID)\n              informations {\n                details\n                general\n              }\n            }\n          }\n          schema\n        }\n      }\n    ":
    types.SearchCustomersResultDocument,
  "\n      mutation exportSearchResult(\n        $companyID: ID!\n        $id: ID!\n        $hasInvestQuery: Boolean\n      ) {\n        url: exportSearchResult(\n          companyID: $companyID\n          id: $id\n          hasInvestQuery: $hasInvestQuery\n        )\n      }\n    ":
    types.ExportSearchResultDocument,
  "\n      query GetFavoriteSearches {\n        favoriteSearchQueries {\n          id\n          schema\n        }\n      }\n    ":
    types.GetFavoriteSearchesDocument,
  "\n      mutation SaveFavoriteSearch($schema: CustomerSearchSchema!) {\n        saveFavoriteSearchQuery(schema: $schema) {\n          id\n        }\n      }\n    ":
    types.SaveFavoriteSearchDocument,
  "\n      mutation DeleteFavoriteSearch($id: ID!) {\n        deleteFavoriteSearchQuery(id: $id) {\n          id\n        }\n      }\n    ":
    types.DeleteFavoriteSearchDocument,
  "\n      query CustomerWalletActivitiesGraph($assetId: ID!, $from: DateTime) {\n        customerWalletActivitiesGraph(assetId: $assetId, from: $from) {\n          id\n          value\n          start\n        }\n      }\n    ":
    types.CustomerWalletActivitiesGraphDocument,
  "\n      query CustomerWalletActivitiesByYear($assetId: ID!) {\n        customerWalletActivitiesByYear(assetId: $assetId) {\n          year\n          startValue\n          endValue\n          performance {\n            gain\n            evolution\n          }\n        }\n      }\n    ":
    types.CustomerWalletActivitiesByYearDocument,
  "\n      mutation CustomerWalletAddActivityYearHistory(\n        $companyID: ID!\n        $customerID: ID!\n        $assetID: ID!\n        $input: ActivityYearHistoryCreationInput!\n      ) {\n        customerWalletAddActivityYearHistory(\n          companyID: $companyID\n          customerID: $customerID\n          assetID: $assetID\n          input: $input\n        ) {\n          year\n        }\n      }\n    ":
    types.CustomerWalletAddActivityYearHistoryDocument,
  "\n      mutation CustomerWalletUpdateActivityYearHistory(\n        $companyID: ID!\n        $customerID: ID!\n        $assetID: ID!\n        $input: ActivityYearHistoryCreationInput!\n      ) {\n        customerWalletUpdateActivityYearHistory(\n          companyID: $companyID\n          customerID: $customerID\n          assetID: $assetID\n          input: $input\n        ) {\n          year\n        }\n      }\n    ":
    types.CustomerWalletUpdateActivityYearHistoryDocument,
  "\n      query SCPIList($name: String!) {\n        SCPIList(name: $name) {\n          name\n          subscription_price\n        }\n      }\n    ":
    types.ScpiListDocument,
  "\n      mutation AssetCreation(\n        $customerID: ID!\n        $companyID: ID!\n        $name: String!\n        $group: AssetGroup!\n        $values: CustomerAssetCreationValues!\n        $investments: [InvestmentValues!]\n      ) {\n        created: assetCreation(\n          customerID: $customerID\n          companyID: $companyID\n          name: $name\n          group: $group\n          values: $values\n          investments: $investments\n        ) {\n          id\n          name\n        }\n      }\n    ":
    types.AssetCreationDocument,
  "\n      mutation AssetUpdate(\n        $customerID: ID!\n        $companyID: ID!\n        $assetID: ID!\n        $name: String!\n        $group: AssetGroup!\n        $values: CustomerAssetCreationValues!\n        $investments: [InvestmentValues!]\n      ) {\n        updated: assetUpdate(\n          customerID: $customerID\n          companyID: $companyID\n          assetID: $assetID\n          name: $name\n          group: $group\n          values: $values\n          investments: $investments\n        ) {\n          id\n          name\n        }\n      }\n    ":
    types.AssetUpdateDocument,
  "\n      mutation AssetUpdateDatesAndStatus(\n        $customerID: ID!\n        $companyID: ID!\n        $assetID: ID!\n        $openDate: DateTime!\n        $closeDate: DateTime\n        $status: String!\n      ) {\n        updated: assetUpdateDatesAndStatus(\n          customerID: $customerID\n          companyID: $companyID\n          assetID: $assetID\n          openDate: $openDate\n          closeDate: $closeDate\n          status: $status\n        ) {\n          id\n          name\n        }\n      }\n    ":
    types.AssetUpdateDatesAndStatusDocument,
  "\n      mutation AssetUpdateGroup(\n        $companyID: ID!\n        $assets: [ID!]!\n        $group: AssetGroup!\n        $categoryName: String\n      ) {\n        updated: assetUpdateGroup(\n          companyID: $companyID\n          assets: $assets\n          group: $group\n          categoryName: $categoryName\n        ) {\n          id\n          name\n          group\n          categoryName\n        }\n      }\n    ":
    types.AssetUpdateGroupDocument,
  "\n      mutation CustomerAssetInvestmentUpdate(\n        $customerID: ID!\n        $companyID: ID!\n        $assetID: ID!\n        $update: [InvestmentValues!]!\n      ) {\n        customerAssetInvestmentUpdate(\n          customerID: $customerID\n          companyID: $companyID\n          assetID: $assetID\n          update: $update\n        ) {\n          id\n        }\n      }\n    ":
    types.CustomerAssetInvestmentUpdateDocument,
  "\n      query SearchInstrument($name: String!, $group: AssetGroup!) {\n        searchInstrument(name: $name, group: $group) {\n          name\n          code\n          price\n        }\n      }\n    ":
    types.SearchInstrumentDocument,
  "\n      mutation CustomerInvestmentCreation(\n        $companyID: ID!\n        $customerID: ID!\n        $assetID: ID!\n        $input: CustomerInvestmentCreation!\n      ) {\n        customerInvestmentCreation(\n          companyID: $companyID\n          customerID: $customerID\n          assetID: $assetID\n          input: $input\n        ) {\n          name\n        }\n      }\n    ":
    types.CustomerInvestmentCreationDocument,
  "\n      query AssetDetail($id: ID!) {\n        asset: customerAsset(id: $id) {\n          id\n          name\n          group\n          activity\n          underManagement\n          categoryName\n          accountNumber\n          isManual\n          metadata\n          openDate\n          owners {\n            entity {\n              id\n            }\n            ownership\n          }\n          # performance(start: $start, end: $end) {\n          performance {\n            gain\n            evolution\n          }\n          investmentList {\n            logo\n            code\n            name\n            category\n            managementCompany\n            unitPrice\n            unitValue\n            created\n            quantity\n            valuation\n            riskIndicator\n            # performance(start: $start, end: $end) {\n            performance {\n              gain\n              evolution\n            }\n          }\n        }\n      }\n    ":
    types.AssetDetailDocument,
  "\n      query RetrieveOtherOwner($assetId: ID!, $currentOwnerId: ID!) {\n        otherOwner: retrieveOtherOwner(\n          assetId: $assetId\n          currentOwnerId: $currentOwnerId\n        ) {\n          id\n          name\n          firstName\n          lastName\n        }\n      }\n    ":
    types.RetrieveOtherOwnerDocument,
  "\n      query GetUsersInCustomerReference($companyId: ID!, $customerId: ID!) {\n        users: getUsersInCustomerReference(\n          companyId: $companyId\n          customerId: $customerId\n        ) {\n          id\n          name\n          firstName\n          lastName\n          type\n        }\n      }\n    ":
    types.GetUsersInCustomerReferenceDocument,
  "\n      mutation AssetDeletion($companyID: ID!, $assetID: ID!) {\n        assetDeletion(companyID: $companyID, id: $assetID) {\n          id\n        }\n      }\n    ":
    types.AssetDeletionDocument,
  "\n      query InstrumentDetail($id: ID!) {\n        instrumentDetails(id: $id) {\n          code\n          label\n          category\n          managementCompany\n          subcategory\n          riskIndicator\n          dic\n          prospectus\n          location\n          closePrice\n          closePriceDate\n          currency\n          sfdr\n          pea\n          peaPme\n          esg\n          indiceReference\n          minimumInvestissement\n          frequenceValorisation\n          nombreParts\n          fraisPriips\n          fraisCourants\n          fraisGestion\n          fraisSouscription\n          fraisRachat\n\n          perfCalendaire {\n            year\n            value\n          }\n        }\n      }\n    ":
    types.InstrumentDetailDocument,
  "\n      query searchInvestmentsByInstrumentCodeInAssets(\n        $companyID: ID!\n        $code: ID!\n        $page: Int\n        $limit: Int\n      ) {\n        searchInvestmentsByInstrumentCodeInAssets(\n          companyID: $companyID\n          code: $code\n          page: $page\n          limit: $limit\n        ) {\n          totalCount\n          edges {\n            assetId\n            assetName\n            assetGroup\n            customerId\n            customerName\n            amount\n            detentions\n            performance {\n              amount\n              percentage\n            }\n          }\n        }\n      }\n    ":
    types.SearchInvestmentsByInstrumentCodeInAssetsDocument,
  "\n      query instrumentIsFavorite($companyID: ID!, $code: ID!) {\n        instrumentIsFavorite(companyID: $companyID, code: $code)\n      }\n    ":
    types.InstrumentIsFavoriteDocument,
  "\n      mutation InstrumentUpdate(\n        $companyID: ID!\n        $code: ID!\n        $input: InstrumentsDataInput!\n      ) {\n        instrumentUpdate(companyID: $companyID, code: $code, input: $input) {\n          code\n        }\n      }\n    ":
    types.InstrumentUpdateDocument,
  "\n      query CustomerWalletTransactions(\n        $assetId: ID!\n        $pagination: Pagination!\n        $search: String\n        $dateRange: DateRange\n      ) {\n        customerWalletTransactions(\n          assetId: $assetId\n          pagination: $pagination\n          search: $search\n          dateRange: $dateRange\n        ) {\n          transactions {\n            id\n            name\n            date\n            dateBO\n            value\n            comment\n            typeOperation\n            manager\n            metadata\n            statusBO\n            statusValidation\n            managerBO\n          }\n          totalCount\n          totalPages\n        }\n      }\n    ":
    types.CustomerWalletTransactionsDocument,
  "\n      mutation CreateTransaction(\n        $companyID: ID!\n        $customerID: ID!\n        $assetID: ID!\n        $input: TransactionCreationInput!\n      ) {\n        customerWalletAddTransaction(\n          companyID: $companyID\n          customerID: $customerID\n          assetID: $assetID\n          input: $input\n        ) {\n          id\n        }\n      }\n    ":
    types.CreateTransactionDocument,
  "\n      mutation TransactionUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $transactionID: ID!\n        $input: TransactionCreationInput!\n      ) {\n        customerWalletTransactionUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          transactionID: $transactionID\n          input: $input\n        ) {\n          id\n        }\n      }\n    ":
    types.TransactionUpdateDocument,
  "\n      mutation TransactionDelete(\n        $companyID: ID!\n        $customerID: ID!\n        $transactionID: ID!\n      ) {\n        customerWalletTransactionDeletion(\n          companyID: $companyID\n          customerID: $customerID\n          transactionID: $transactionID\n        )\n      }\n    ":
    types.TransactionDeleteDocument,
  "\n      query RelatedEntities($companyID: ID!, $assetID: ID!, $customerID: ID!) {\n        referenceEntities: getUsersInCustomerReference(\n          companyId: $companyID\n          customerId: $customerID\n        ) {\n          id\n          name\n        }\n        asset: customerAsset(id: $assetID) {\n          owners {\n            entity {\n              id\n              name\n            }\n            ownership\n            mode\n          }\n        }\n      }\n    ":
    types.RelatedEntitiesDocument,
  "\n      mutation updateAssetOwnership(\n        $companyID: ID!\n        $assetID: ID!\n        $values: [AssetOwnerInput!]!\n      ) {\n        updated: assetsUpdateOwners(\n          companyID: $companyID\n          assetID: $assetID\n          values: $values\n        ) {\n          id\n          owners {\n            entity {\n              id\n            }\n            ownership\n            mode\n          }\n        }\n      }\n    ":
    types.UpdateAssetOwnershipDocument,
  "\n      query CustomerWealth(\n        $id: ID!\n        $company: ID!\n        $financialTypes: [AssetGroup!]\n        $passiveTypes: [AssetGroup!]\n        $nonFinancialTypes: [AssetGroup!]\n        $benefitsTypes: [AssetGroup!]\n        $repartitionTypes: [AssetGroup!]\n        $othersTypes: [AssetGroup!]\n        $computing: WealthFilter\n      ) {\n        financialWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $financialTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            metadata\n            valuation\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        nonfinancialWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $nonFinancialTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        othersWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $othersTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        passiveWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $passiveTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            underManagement\n            isManual\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        benefitsWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $benefitsTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            underManagement\n            isManual\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        repartition: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $repartitionTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n        }\n      }\n    ":
    types.CustomerWealthDocument,
  "\n      query WealthUnderManagment($company: ID!, $computing: WealthFilter) {\n        assetsTypes: companyWealth(id: $company, computing: $computing) {\n          name: group\n          amount: valuation\n          assetsUnderManagement(computing: $computing) {\n            id\n            name\n            valuation\n            customer {\n              id\n              name\n            }\n          }\n        }\n      }\n    ":
    types.WealthUnderManagmentDocument,
  "\n      query CustomerWallet($companyID: ID!, $id: ID!) {\n        customerWallet(companyID: $companyID, id: $id) {\n          id\n          accountNumber\n          group\n          insuranceCompany\n          name\n          openDate\n          transfersAmount\n          withdrawalAmount\n          valuation\n          risk\n          metadata\n          mixedData\n          sri\n          irr\n          initialValuation\n          investments {\n            id\n            code\n            label\n            quantity\n            unitPrice\n            unitValue\n            dateValue\n            valuation\n            dateValuation\n            instrument\n            riskIndicator\n            category: subcategory\n            buyingDate\n            investmentInstrument {\n              dic\n              prospectus\n              metadata\n            }\n          }\n        }\n      }\n    ":
    types.CustomerWalletDocument,
  "\n      query UnderManagementAssetGroups(\n        $customerID: ID!\n        $companyID: ID!\n        $groups: [AssetGroup!]\n        $computing: WealthFilter\n      ) {\n        customerWealth(\n          id: $customerID\n          companyID: $companyID\n          groups: $groups\n          computing: $computing\n        ) {\n          group\n          valuation\n          assets(computing: $computing) {\n            id\n            name\n            group\n            activity\n            accountNumber\n            openDate\n            categoryName\n            transfersAmount\n            withdrawalAmount\n            metadata\n            sri\n            valuation\n            owners {\n              entity {\n                id\n              }\n              ownership\n              mode\n            }\n          }\n        }\n      }\n    ":
    types.UnderManagementAssetGroupsDocument,
  "\n      query CustomerAssets($id: ID!, $companyID: ID!, $groups: [AssetGroup!]) {\n        customerAssets(id: $id, companyID: $companyID, groups: $groups) {\n          id\n          name\n          group\n        }\n      }\n    ":
    types.CustomerAssetsDocument,
  "\n      mutation CustomerWalletInvestmentSriUpdate(\n        $id: ID!\n        $riskIndicator: Int!\n      ) {\n        customerWalletInvestmentSriUpdate(\n          id: $id\n          riskIndicator: $riskIndicator\n        ) {\n          id\n        }\n      }\n    ":
    types.CustomerWalletInvestmentSriUpdateDocument,
  "\n      query GlobalWealth(\n        $company: ID!\n        $start: DateTime\n        $end: DateTime\n        $options: AssetPerformanceOrder!\n        $computing: WealthFilter\n        $ignoring: [AssetGroup!]\n        $campaignLimit: Int\n      ) {\n        companyWealth(id: $company, computing: $computing) {\n          name: group\n          amount: valuation\n          performance(start: $start, end: $end, computing: $computing) {\n            gain\n            evolution\n          }\n        }\n        assets: companiesManagedAsset(\n          companyID: $company\n          start: $start\n          end: $end\n          options: $options\n          ignoring: $ignoring\n        ) {\n          id\n          name\n          group\n          amount: activity\n          isManual\n          # performance(start: $start, end: $end) {\n          performance {\n            gain\n            evolution\n          }\n        }\n        liquidity: globalLiquidity(companyID: $company, computing: $computing)\n        mostOccuring: mostOccuringAssetType(companyID: $company) {\n          group\n          count\n        }\n        company(id: $company) {\n          wealth\n          metadata\n        }\n        details: customerDetails(companyID: $company) {\n          managedWealth\n        }\n\n        campaigns: campaignList(companyID: $company, limit: $campaignLimit) {\n          name\n        }\n      }\n    ":
    types.GlobalWealthDocument,
  "\n        mutation AssetManagementSwitch(\n          $id: ID!\n          $companyID: ID!\n          $customerID: ID!\n          $domain: WealthFilter!\n        ) {\n          asset: switchAssetManagement(\n            id: $id\n            companyID: $companyID\n            customerID: $customerID\n            management: $domain\n          ) {\n            id\n            name\n            underManagement\n            isManual\n          }\n        }\n      ":
    types.AssetManagementSwitchDocument,
  "\n      query CustomerSearch(\n        $companyID: ID!\n        $text: String\n        $suggestionsTokens: [String!]\n      ) {\n        searchCustomer(\n          companyID: $companyID\n          text: $text\n          suggestionsTokens: $suggestionsTokens\n        ) {\n          id\n          name\n          email\n        }\n      }\n    ":
    types.CustomerSearchDocument,
  "\n      mutation AssetAffectation(\n        $companyID: ID!\n        $selectedCustomerID: ID!\n        $assets: [ID!]!\n      ) {\n        assetsAffectation(\n          companyID: $companyID\n          customerID: $selectedCustomerID\n          assets: $assets\n        ) {\n          id\n        }\n      }\n    ":
    types.AssetAffectationDocument,
  "\n      query assetTypeWealth(\n        $id: ID!\n        $filters: AssetFilters\n        $group: AssetGroup!\n        $computing: WealthFilter\n      ) {\n        company(id: $id) {\n          id\n          assets: assetsUnderManagement(\n            group: $group\n            filters: $filters\n            computing: $computing\n          ) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                valuation\n                accountNumber\n                customer {\n                  id\n                  name\n                }\n                sri\n              }\n            }\n          }\n        }\n      }\n    ":
    types.AssetTypeWealthDocument,
  "\n      mutation exportAssets(\n        $companyID: ID!\n        $group: AssetGroup!\n        $filters: AssetFilters\n        $computing: WealthFilter\n      ) {\n        url: exportAssets(\n          companyID: $companyID\n          group: $group\n          filters: $filters\n          computing: $computing\n        )\n      }\n    ":
    types.ExportAssetsDocument,
  "\n      query SubWealth(\n        $company: ID!\n        $start: DateTime\n        $end: DateTime\n        $limit: Int!\n        $computing: WealthFilter\n      ) {\n        assetsTypes: companyWealth(id: $company, computing: $computing) {\n          name: group\n          amount: valuation\n          performance(start: $start, end: $end, computing: $computing) {\n            gain\n            evolution\n          }\n          assetsUnderManagement(limit: $limit, computing: $computing) {\n            id\n            name\n            valuation\n            customer {\n              id\n              name\n            }\n          }\n        }\n      }\n    ":
    types.SubWealthDocument,
  "\n      query Home(\n        $companyID: ID!\n        $input: CustomersInput\n        $campaignLimit: Int\n        $projectRange: TimeRange!\n        $taskFilter: CompanyTaskFilter\n        $projectValidated: Boolean\n        $projectLimit: Int\n      ) {\n        listCompanyTask(companyID: $companyID, filter: $taskFilter) {\n          lateCount\n          edges {\n            id\n            title\n            category\n            content\n            updated\n            schedule\n            created\n            completed\n            customer {\n              id\n              name\n            }\n            company {\n              id\n              name\n            }\n            assigned_manager {\n              id\n              name\n            }\n            entityRelatedId\n            entityRelatedType\n          }\n        }\n        projectCompanyList(\n          companyID: $companyID\n          range: $projectRange\n          validated: $projectValidated\n          limit: $projectLimit\n        ) {\n          id\n          created\n          validated\n          archived\n          name\n          type\n          metadata\n          customer {\n            id\n            name\n          }\n        }\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                firstName\n                lastName\n                email\n                type\n                wealth(companyID: $companyID)\n                underManagement: wealth(\n                  companyID: $companyID\n                  computing: under_managements\n                )\n              }\n            }\n          }\n        }\n        customersCompliance(company: $companyID) {\n          category {\n            key\n            name\n          }\n          levels {\n            valid\n            unvalid\n            waiting\n          }\n        }\n\n        campaigns: campaignList(companyID: $companyID, limit: $campaignLimit) {\n          name\n        }\n\n        liquidity: globalLiquidity(companyID: $companyID)\n        mostOccuringAssetType(companyID: $companyID) {\n          group\n          count\n        }\n      }\n    ":
    types.HomeDocument,
  "\n      query NotificationList($companyID: ID!, $filter: NotificationFilter) {\n        notificationList(companyID: $companyID, filter: $filter) {\n          id\n          type\n          data\n          updated\n          company {\n            id\n            name\n          }\n        }\n      }\n    ":
    types.NotificationListDocument,
  "\n      query NotificationListByType(\n        $companyID: ID!\n        $filter: NotificationFilter\n      ) {\n        notificationListByType(companyID: $companyID, filter: $filter) {\n          type\n          count\n          read\n          notifications {\n            id\n            type\n            data\n            read\n            created\n          }\n        }\n      }\n    ":
    types.NotificationListByTypeDocument,
  "\n      mutation NotificationRead($companyID: ID!, $id: ID!) {\n        notificationRead(companyID: $companyID, id: $id) {\n          id\n        }\n      }\n    ":
    types.NotificationReadDocument,
  "\n      query GetAggregationList($companyID: ID!) {\n        connectionList(companyID: $companyID) {\n          id\n          state\n          updated\n          identifier\n          manager {\n            id\n            name\n          }\n          connector {\n            key\n            name\n            logo\n            provider\n          }\n        }\n      }\n    ":
    types.GetAggregationListDocument,
  "\n        query ParentConnectionsHasInvalidCreds($companyID: ID!) {\n          parentCompanyConnectionsHasInvalidCreds(companyID: $companyID)\n        }\n      ":
    types.ParentConnectionsHasInvalidCredsDocument,
  "\n      query ConnectionsHasInvalidCreds($companyID: ID!) {\n        connectionsHasInvalidCreds(companyID: $companyID)\n      }\n    ":
    types.ConnectionsHasInvalidCredsDocument,
  "\n      mutation DeleteConnection($connectionID: ID!) {\n        deleteConnection(connectionID: $connectionID)\n      }\n    ":
    types.DeleteConnectionDocument,
  "\n          query ParentCompanyManagerData($companyID: ID!, $managerID: ID!) {\n            parentCompanyManagerData(\n              companyID: $companyID\n              managerID: $managerID\n            ) {\n              name\n              email\n              claims\n            }\n          }\n        ":
    types.ParentCompanyManagerDataDocument,
  "\n        query ManagerData($companyID: ID!, $managerID: ID!) {\n          managerData(companyID: $companyID, managerID: $managerID) {\n            name\n            email\n            claims\n          }\n        }\n      ":
    types.ManagerDataDocument,
  "\n        mutation ParentCompanyManagerUpdate(\n          $companyID: ID!\n          $managerID: ID!\n          $input: ManagerDataInput!\n          $claims: [ManagerClaims!]\n        ) {\n          parentCompanyManagerUpdate(\n            companyID: $companyID\n            managerID: $managerID\n            input: $input\n            claims: $claims\n          ) {\n            id\n          }\n        }\n      ":
    types.ParentCompanyManagerUpdateDocument,
  "\n      mutation ManagerUpdate(\n        $companyID: ID!\n        $managerID: ID!\n        $input: ManagerDataInput!\n        $claims: [ManagerClaims!]\n      ) {\n        managerUpdate(\n          companyID: $companyID\n          managerID: $managerID\n          input: $input\n          claims: $claims\n        ) {\n          id\n        }\n      }\n    ":
    types.ManagerUpdateDocument,
  "\n          query ParentCompanyGeneralForm($companyID: ID!) {\n            parentCompanyInfos(id: $companyID) {\n              general\n              logo\n            }\n          }\n        ":
    types.ParentCompanyGeneralFormDocument,
  "\n        query CompanyGeneralForm($companyID: ID!) {\n          company(id: $companyID) {\n            general\n            logo\n          }\n        }\n      ":
    types.CompanyGeneralFormDocument,
  "\n          mutation ParentCompanyGeneralFormUpdate(\n            $companyID: ID!\n            $generalInput: CompanyGeneralForm!\n          ) {\n            updated: parentCompanyUpdate(\n              companyID: $companyID\n              generalInput: $generalInput\n            ) {\n              id\n              general\n            }\n          }\n        ":
    types.ParentCompanyGeneralFormUpdateDocument,
  "\n        mutation CompanyGeneralFormUpdate(\n          $companyID: ID!\n          $generalInput: CompanyGeneralForm!\n        ) {\n          updated: companyUpdate(\n            companyID: $companyID\n            generalInput: $generalInput\n          ) {\n            id\n            general\n          }\n        }\n      ":
    types.CompanyGeneralFormUpdateDocument,
  "\n        query ManagerList($id: ID!) {\n          companyManagersStats(companyID: $id) {\n            id\n            name\n            email\n            claims\n            nbClients\n            nbContracts\n            lastActive\n            providerCode\n          }\n        }\n      ":
    types.ManagerListDocument,
  "\n        query customerReferenceAccessList($companyID: ID!, $customerID: ID!) {\n          customerReferenceAccessList(\n            companyID: $companyID\n            customerID: $customerID\n          ) {\n            manager {\n              id\n              name\n            }\n            primary\n            customer {\n              id\n              name\n              email\n            }\n          }\n        }\n      ":
    types.CustomerReferenceAccessListDocument,
  "\n      mutation ManagerCreation(\n        $companyID: ID!\n        $input: ManagerCreation!\n        $claims: [ManagerClaims!]\n      ) {\n        managerCreation(companyID: $companyID, input: $input, claims: $claims) {\n          id\n        }\n      }\n    ":
    types.ManagerCreationDocument,
  "\n      mutation ManagerDeletion($companyID: ID!, $managerID: [ID!]!) {\n        managerDeletion(companyID: $companyID, managerID: $managerID)\n      }\n    ":
    types.ManagerDeletionDocument,
  "\n      mutation UpdateManagerProviderCode(\n        $companyID: ID!\n        $managerID: ID!\n        $input: String!\n      ) {\n        updateManagerProviderCode(\n          companyID: $companyID\n          managerID: $managerID\n          providerCode: $input\n        ) {\n          providerCode\n        }\n      }\n    ":
    types.UpdateManagerProviderCodeDocument,
  "\n          query ParentCompanyIntermediationForm($companyID: ID!) {\n            parentCompanyInfos(id: $companyID) {\n              intermediation\n            }\n          }\n        ":
    types.ParentCompanyIntermediationFormDocument,
  "\n        query CompanyIntermediationForm($companyID: ID!) {\n          company(id: $companyID) {\n            intermediation\n          }\n        }\n      ":
    types.CompanyIntermediationFormDocument,
  "\n          mutation ParentCompanyIntermediationFormUpdate(\n            $companyID: ID!\n            $intermediationInput: CompanyIntermediationForm!\n          ) {\n            updated: parentCompanyUpdate(\n              companyID: $companyID\n              intermediationInput: $intermediationInput\n            ) {\n              id\n              intermediation\n            }\n          }\n        ":
    types.ParentCompanyIntermediationFormUpdateDocument,
  "\n        mutation CompanyIntermediationFormUpdate(\n          $companyID: ID!\n          $intermediationInput: CompanyIntermediationForm!\n        ) {\n          updated: companyUpdate(\n            companyID: $companyID\n            intermediationInput: $intermediationInput\n          ) {\n            id\n            intermediation\n          }\n        }\n      ":
    types.CompanyIntermediationFormUpdateDocument,
  "\n          query ParentCompanyLegalForm($companyID: ID!) {\n            parentCompanyInfos(id: $companyID) {\n              legal\n            }\n          }\n        ":
    types.ParentCompanyLegalFormDocument,
  "\n        query CompanyLegalForm($companyID: ID!) {\n          company(id: $companyID) {\n            legal\n          }\n        }\n      ":
    types.CompanyLegalFormDocument,
  "\n          mutation ParentCompanyLegalFormUpdate(\n            $companyID: ID!\n            $legalInput: CompanyLegalForm!\n          ) {\n            updated: parentCompanyUpdate(\n              companyID: $companyID\n              legalInput: $legalInput\n            ) {\n              id\n              legal\n            }\n          }\n        ":
    types.ParentCompanyLegalFormUpdateDocument,
  "\n        mutation CompanyLegalFormUpdate(\n          $companyID: ID!\n          $legalInput: CompanyLegalForm!\n        ) {\n          updated: companyUpdate(\n            companyID: $companyID\n            legalInput: $legalInput\n          ) {\n            id\n            legal\n          }\n        }\n      ":
    types.CompanyLegalFormUpdateDocument,
  "\n      query CompanySettings($companyID: ID!) {\n        company(id: $companyID) {\n          managerList {\n            id\n            name\n            email\n            phone\n          }\n          logo\n        }\n        authenticated {\n          id\n          manager {\n            id\n            name\n            email\n            companyList {\n              id\n              name\n              logo\n            }\n          }\n        }\n        companyManagersStats(companyID: $companyID) {\n          id\n          name\n          email\n          claims\n          nbClients\n          nbContracts\n          lastActive\n        }\n      }\n    ":
    types.CompanySettingsDocument,
  "\n      mutation CompanyDeletion($companyID: ID!) {\n        companyDeletion(companyID: $companyID)\n      }\n    ":
    types.CompanyDeletionDocument,
  "\n      query ParentCompanySubsidiaries($id: ID!) {\n        parentCompany(id: $id) {\n          companies {\n            id\n            name\n          }\n        }\n      }\n    ":
    types.ParentCompanySubsidiariesDocument,
  "\n      query ParentCompanyWealth($id: ID!) {\n        parentCompany(id: $id) {\n          wealth\n          # performance(computing: under_managements) {\n          #   gain\n          #   evolution\n          # }\n        }\n      }\n    ":
    types.ParentCompanyWealthDocument,
  "\n      query ParentCompanyAdmins($id: ID!) {\n        parentCompany(id: $id) {\n          admins {\n            id\n            email\n            name\n          }\n        }\n      }\n    ":
    types.ParentCompanyAdminsDocument,
  "\n      query ParentCompanyHome(\n        $id: ID!\n        $filter: NotificationFilter\n        $taskFilter: CompanyTaskFilter\n      ) {\n        parentCompany(id: $id) {\n          tasks(filter: $taskFilter) {\n            lateCount\n            edges {\n              id\n              title\n              category\n              content\n              updated\n              schedule\n              created\n              completed\n              customer {\n                id\n                name\n              }\n              company {\n                id\n                name\n              }\n              manager {\n                id\n                name\n              }\n            }\n          }\n          notifications(filter: $filter) {\n            id\n            type\n            data\n            updated\n            company {\n              id\n              name\n            }\n          }\n          wealth\n          managedWealth: wealth(computing: under_managements)\n          liquidity\n          mostOccuringAssetType {\n            group\n            count\n          }\n          stats {\n            customersCount\n          }\n        }\n      }\n    ":
    types.ParentCompanyHomeDocument,
  "\n      query ParentCompanyHomeCustomers($id: ID!) {\n        parentCompany(id: $id) {\n          customers(input: { take: 10 }) {\n            edges {\n              node {\n                customer {\n                  id\n                  name\n                  email\n                  type\n                }\n                wealth\n                underManagement: wealth(computing: under_managements)\n                company {\n                  id\n                }\n              }\n            }\n          }\n        }\n      }\n    ":
    types.ParentCompanyHomeCustomersDocument,
  "\n      query ParentCompanyClients(\n        $id: ID!\n        $input: ParentCompanyCustomersInput\n      ) {\n        parentCompany(id: $id) {\n          customers(input: $input) {\n            totalCount\n            edges {\n              node {\n                customer {\n                  id\n                  name\n                  firstName\n                  lastName\n                  email\n                }\n                wealth(computing: under_managements)\n                company {\n                  id\n                  name\n                }\n                manager {\n                  id\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    ":
    types.ParentCompanyClientsDocument,
  "\n      query ParentCompanyManagers($id: ID!) {\n        parentCompany(id: $id) {\n          companies {\n            id\n            name\n          }\n          managers {\n            manager {\n              id\n              name\n            }\n            company {\n              id\n            }\n          }\n        }\n      }\n    ":
    types.ParentCompanyManagersDocument,
  "\n      mutation exportCustomersParentCompany($id: ID!) {\n        url: exportCustomersParentCompany(id: $id)\n      }\n    ":
    types.ExportCustomersParentCompanyDocument,
  "\n      query ParentCompanyCustomer($id: ID!, $customerID: ID!) {\n        parentCompany(id: $id) {\n          customer(id: $customerID) {\n            assets {\n              name\n              group\n              accountNumber\n              activity\n              connection {\n                connector {\n                  key\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    ":
    types.ParentCompanyCustomerDocument,
  "\n      mutation AssignCustomersToCompany(\n        $customersID: [ID!]!\n        $parentCompanyID: ID!\n        $companyID: ID!\n        $managerID: ID!\n      ) {\n        assignCustomersToCompany(\n          customersID: $customersID\n          parentCompanyID: $parentCompanyID\n          companyID: $companyID\n          managerID: $managerID\n        )\n      }\n    ":
    types.AssignCustomersToCompanyDocument,
  "\n      mutation Login($token: String!) {\n        authenticationFirebase(token: $token) {\n          id\n          manager {\n            id\n            name\n            companyList {\n              id\n              name\n            }\n            parentCompany {\n              id\n            }\n          }\n        }\n      }\n    ":
    types.LoginDocument,
  "\n      mutation InviteManager(\n        $input: ManagerCreation!\n        $company: CompanyCreation!\n      ) {\n        inviteManager(input: $input, company: $company) {\n          id\n        }\n      }\n    ":
    types.InviteManagerDocument,
  "\n      mutation SignUpInvite($token: String!, $id: ID!) {\n        authenticationFirebase(token: $token) {\n          id\n          provider\n          manager {\n            id\n            name\n            email\n          }\n        }\n        managerInviteAccept(id: $id) {\n          id\n        }\n      }\n    ":
    types.SignUpInviteDocument,
  "\n      mutation SubscribeToNewsletter($input: ProfileUpdate!) {\n        profileUpdate(input: $input) {\n          id\n        }\n      }\n    ":
    types.SubscribeToNewsletterDocument,
  "\n      query GetPubliFormFilling($token: String!) {\n        existingFormData(token: $token)\n      }\n    ":
    types.GetPubliFormFillingDocument,
  "\n      query GetExternalInvestorProfileForm($customerID: ID!) {\n        externalInvestorProfileForm(customerID: $customerID)\n      }\n    ":
    types.GetExternalInvestorProfileFormDocument,
  "\n      mutation SubmitExternalInvestorProfileForm(\n        $input: PublicFormSubmit!\n        $customerID: ID!\n      ) {\n        externalInvestorProfileForm(input: $input, customerID: $customerID)\n      }\n    ":
    types.SubmitExternalInvestorProfileFormDocument,
  "\n      mutation SubmitPubliFormFilling(\n        $input: PublicFormSubmit!\n        $token: String!\n        $isSyncing: Boolean\n      ) {\n        formFilling(input: $input, token: $token, isSyncing: $isSyncing)\n      }\n    ":
    types.SubmitPubliFormFillingDocument,
  "\n      query PublicCustomerWealth(\n        $token: String!\n        $financialTypes: [AssetGroup!]\n        $passiveTypes: [AssetGroup!]\n        $nonFinancialTypes: [AssetGroup!]\n        $benefitsTypes: [AssetGroup!]\n        $repartitionTypes: [AssetGroup!]\n        $othersTypes: [AssetGroup!]\n        $computing: WealthFilter\n      ) {\n        financialWealth: publicCustomerWealth(\n          token: $token\n          groups: $financialTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            metadata\n            valuation\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        nonfinancialWealth: publicCustomerWealth(\n          token: $token\n          groups: $nonFinancialTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        othersWealth: publicCustomerWealth(\n          token: $token\n          groups: $othersTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        passiveWealth: publicCustomerWealth(\n          token: $token\n          groups: $passiveTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            underManagement\n            isManual\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        benefitsWealth: publicCustomerWealth(\n          token: $token\n          groups: $benefitsTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            underManagement\n            isManual\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        repartition: publicCustomerWealth(\n          token: $token\n          groups: $repartitionTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n        }\n      }\n    ":
    types.PublicCustomerWealthDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query Authenticated {\n        authenticated {\n          id\n          manager {\n            id\n            name\n            email\n            phone\n            disabledFeatures\n            companyList {\n              id\n              name\n              logo\n              parentCompanyId\n              isParentCompany\n            }\n            parentCompany {\n              id\n              name\n              logo\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query Authenticated {\n        authenticated {\n          id\n          manager {\n            id\n            name\n            email\n            phone\n            disabledFeatures\n            companyList {\n              id\n              name\n              logo\n              parentCompanyId\n              isParentCompany\n            }\n            parentCompany {\n              id\n              name\n              logo\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ManagerClaims($companyID: ID!) {\n        authenticated {\n          manager {\n            claims(companyID: $companyID)\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query ManagerClaims($companyID: ID!) {\n        authenticated {\n          manager {\n            claims(companyID: $companyID)\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query ParentCompanyDocumentTemplateList(\n          $companyID: ID!\n          $available: Boolean!\n        ) {\n          parentCompanyDocumentTemplateList(companyID: $companyID) {\n            id\n            name\n            category\n            creator\n            status\n            url\n            extension\n            properties {\n              type\n            }\n            productType\n          }\n          favorites: parentCompanyDocumentTemplateList(\n            companyID: $companyID\n            available: $available\n          ) {\n            id\n          }\n        }\n      "
): (typeof documents)["\n        query ParentCompanyDocumentTemplateList(\n          $companyID: ID!\n          $available: Boolean!\n        ) {\n          parentCompanyDocumentTemplateList(companyID: $companyID) {\n            id\n            name\n            category\n            creator\n            status\n            url\n            extension\n            properties {\n              type\n            }\n            productType\n          }\n          favorites: parentCompanyDocumentTemplateList(\n            companyID: $companyID\n            available: $available\n          ) {\n            id\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query DocumentTemplateList($companyID: ID!, $available: Boolean!) {\n        documentTemplateList(companyID: $companyID) {\n          id\n          name\n          category\n          creator\n          status\n          url\n          extension\n          properties {\n            type\n          }\n          productType\n        }\n        favorites: documentTemplateList(\n          companyID: $companyID\n          available: $available\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      query DocumentTemplateList($companyID: ID!, $available: Boolean!) {\n        documentTemplateList(companyID: $companyID) {\n          id\n          name\n          category\n          creator\n          status\n          url\n          extension\n          properties {\n            type\n          }\n          productType\n        }\n        favorites: documentTemplateList(\n          companyID: $companyID\n          available: $available\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation ParentCompanyAvailableTemplateUpdate(\n          $IDs: [ID!]!\n          $companyID: ID!\n        ) {\n          parentCompanyAvailableTemplateUpdate(\n            IDs: $IDs\n            companyID: $companyID\n          ) {\n            id\n          }\n        }\n      "
): (typeof documents)["\n        mutation ParentCompanyAvailableTemplateUpdate(\n          $IDs: [ID!]!\n          $companyID: ID!\n        ) {\n          parentCompanyAvailableTemplateUpdate(\n            IDs: $IDs\n            companyID: $companyID\n          ) {\n            id\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation AvailableTemplateUpdate($IDs: [ID!]!, $companyID: ID!) {\n        availableTemplateUpdate(IDs: $IDs, companyID: $companyID) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation AvailableTemplateUpdate($IDs: [ID!]!, $companyID: ID!) {\n        availableTemplateUpdate(IDs: $IDs, companyID: $companyID) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation ParentCompanyDocumentTemplateCreation(\n          $companyID: ID!\n          $input: DocumentTemplateCreation!\n        ) {\n          parentCompanyDocumentTemplateCreation(\n            companyID: $companyID\n            input: $input\n          ) {\n            id\n            name\n            url\n            description\n          }\n        }\n      "
): (typeof documents)["\n        mutation ParentCompanyDocumentTemplateCreation(\n          $companyID: ID!\n          $input: DocumentTemplateCreation!\n        ) {\n          parentCompanyDocumentTemplateCreation(\n            companyID: $companyID\n            input: $input\n          ) {\n            id\n            name\n            url\n            description\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation DocumentTemplateCreation(\n        $companyID: ID!\n        $input: DocumentTemplateCreation!\n      ) {\n        documentTemplateCreation(companyID: $companyID, input: $input) {\n          id\n          name\n          url\n          description\n        }\n      }\n    "
): (typeof documents)["\n      mutation DocumentTemplateCreation(\n        $companyID: ID!\n        $input: DocumentTemplateCreation!\n      ) {\n        documentTemplateCreation(companyID: $companyID, input: $input) {\n          id\n          name\n          url\n          description\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation ParentDocumentCustomTemplateCreation(\n          $companyID: ID!\n          $input: DocumentTemplateCreation!\n        ) {\n          parentCompanyDocumentCustomTemplateCreation(\n            companyID: $companyID\n            input: $input\n          ) {\n            id\n            name\n            url\n            description\n          }\n        }\n      "
): (typeof documents)["\n        mutation ParentDocumentCustomTemplateCreation(\n          $companyID: ID!\n          $input: DocumentTemplateCreation!\n        ) {\n          parentCompanyDocumentCustomTemplateCreation(\n            companyID: $companyID\n            input: $input\n          ) {\n            id\n            name\n            url\n            description\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation DocumentCustomTemplateCreation(\n        $companyID: ID!\n        $input: DocumentTemplateCreation!\n      ) {\n        documentCustomTemplateCreation(companyID: $companyID, input: $input) {\n          id\n          name\n          url\n          description\n        }\n      }\n    "
): (typeof documents)["\n      mutation DocumentCustomTemplateCreation(\n        $companyID: ID!\n        $input: DocumentTemplateCreation!\n      ) {\n        documentCustomTemplateCreation(companyID: $companyID, input: $input) {\n          id\n          name\n          url\n          description\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation ParentCompanyDocumentTemplateUpdate(\n          $companyID: ID!\n          $id: ID!\n          $input: DocumentTemplateUpdate!\n        ) {\n          parentCompanyDocumentTemplateUpdate(\n            companyID: $companyID\n            id: $id\n            input: $input\n          ) {\n            id\n          }\n        }\n      "
): (typeof documents)["\n        mutation ParentCompanyDocumentTemplateUpdate(\n          $companyID: ID!\n          $id: ID!\n          $input: DocumentTemplateUpdate!\n        ) {\n          parentCompanyDocumentTemplateUpdate(\n            companyID: $companyID\n            id: $id\n            input: $input\n          ) {\n            id\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation DocumentTemplateUpdate(\n        $companyID: ID!\n        $id: ID!\n        $input: DocumentTemplateUpdate!\n      ) {\n        documentTemplateUpdate(companyID: $companyID, id: $id, input: $input) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation DocumentTemplateUpdate(\n        $companyID: ID!\n        $id: ID!\n        $input: DocumentTemplateUpdate!\n      ) {\n        documentTemplateUpdate(companyID: $companyID, id: $id, input: $input) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation ParentCompanyDocumentTemplateDelete(\n          $companyID: ID!\n          $id: ID!\n        ) {\n          parentCompanyDocumentTemplateDeletion(companyID: $companyID, id: $id)\n        }\n      "
): (typeof documents)["\n        mutation ParentCompanyDocumentTemplateDelete(\n          $companyID: ID!\n          $id: ID!\n        ) {\n          parentCompanyDocumentTemplateDeletion(companyID: $companyID, id: $id)\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation DocumentTemplateDelete($companyID: ID!, $id: ID!) {\n        documentTemplateDeletion(companyID: $companyID, id: $id)\n      }\n    "
): (typeof documents)["\n      mutation DocumentTemplateDelete($companyID: ID!, $id: ID!) {\n        documentTemplateDeletion(companyID: $companyID, id: $id)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation mutateParentCompanyDocumentTemplateDeletionMultiple(\n          $companyID: ID!\n          $ids: [ID!]!\n        ) {\n          parentCompanyDocumentTemplateDeletionMultiple(\n            companyID: $companyID\n            ids: $ids\n          )\n        }\n      "
): (typeof documents)["\n        mutation mutateParentCompanyDocumentTemplateDeletionMultiple(\n          $companyID: ID!\n          $ids: [ID!]!\n        ) {\n          parentCompanyDocumentTemplateDeletionMultiple(\n            companyID: $companyID\n            ids: $ids\n          )\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation mutateDocumentTemplateDeletionMultiple(\n        $companyID: ID!\n        $ids: [ID!]!\n      ) {\n        documentTemplateDeletionMultiple(companyID: $companyID, ids: $ids)\n      }\n    "
): (typeof documents)["\n      mutation mutateDocumentTemplateDeletionMultiple(\n        $companyID: ID!\n        $ids: [ID!]!\n      ) {\n        documentTemplateDeletionMultiple(companyID: $companyID, ids: $ids)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query AvailableIntegrationsList($companyID: ID!) {\n          list: availableIntegrations(companyID: $companyID)\n        }\n      "
): (typeof documents)["\n        query AvailableIntegrationsList($companyID: ID!) {\n          list: availableIntegrations(companyID: $companyID)\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query ParentCompanyInstalledIntegrationsList($companyID: ID!) {\n            list: parentCompanyIntegrationInstalledList(companyID: $companyID) {\n              key\n              added\n              state\n              manager {\n                id\n                name\n                email\n              }\n              access\n              configuration {\n                url\n              }\n            }\n          }\n        "
): (typeof documents)["\n          query ParentCompanyInstalledIntegrationsList($companyID: ID!) {\n            list: parentCompanyIntegrationInstalledList(companyID: $companyID) {\n              key\n              added\n              state\n              manager {\n                id\n                name\n                email\n              }\n              access\n              configuration {\n                url\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query InstalledIntegrationsList($companyID: ID!) {\n          list: integrationInstalledList(companyID: $companyID) {\n            key\n            added\n            state\n            manager {\n              id\n              name\n              email\n            }\n            access\n            configuration {\n              url\n            }\n          }\n        }\n      "
): (typeof documents)["\n        query InstalledIntegrationsList($companyID: ID!) {\n          list: integrationInstalledList(companyID: $companyID) {\n            key\n            added\n            state\n            manager {\n              id\n              name\n              email\n            }\n            access\n            configuration {\n              url\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query IntegrationDetails($companyID: ID!, $key: IntegrationKey!) {\n          integration: integrationDetails(companyID: $companyID, key: $key) {\n            key\n            added\n            state\n            manager {\n              id\n              name\n              email\n            }\n            access\n            configuration {\n              url\n            }\n          }\n        }\n      "
): (typeof documents)["\n        query IntegrationDetails($companyID: ID!, $key: IntegrationKey!) {\n          integration: integrationDetails(companyID: $companyID, key: $key) {\n            key\n            added\n            state\n            manager {\n              id\n              name\n              email\n            }\n            access\n            configuration {\n              url\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation ParentCompanyIntegrationInstallation(\n            $companyID: ID!\n            $key: IntegrationKey!\n          ) {\n            installed: parentCompanyIntegrationInstallation(\n              companyID: $companyID\n              key: $key\n            ) {\n              key\n              state\n            }\n          }\n        "
): (typeof documents)["\n          mutation ParentCompanyIntegrationInstallation(\n            $companyID: ID!\n            $key: IntegrationKey!\n          ) {\n            installed: parentCompanyIntegrationInstallation(\n              companyID: $companyID\n              key: $key\n            ) {\n              key\n              state\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation IntegrationInstallation(\n          $companyID: ID!\n          $key: IntegrationKey!\n        ) {\n          installed: integrationInstallation(companyID: $companyID, key: $key) {\n            key\n            state\n          }\n        }\n      "
): (typeof documents)["\n        mutation IntegrationInstallation(\n          $companyID: ID!\n          $key: IntegrationKey!\n        ) {\n          installed: integrationInstallation(companyID: $companyID, key: $key) {\n            key\n            state\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation ParentCompanyIntegrationDeletion(\n            $companyID: ID!\n            $key: IntegrationKey!\n          ) {\n            uninstalled: parentCompanyIntegrationDeletion(\n              companyID: $companyID\n              key: $key\n            ) {\n              key\n              state\n            }\n          }\n        "
): (typeof documents)["\n          mutation ParentCompanyIntegrationDeletion(\n            $companyID: ID!\n            $key: IntegrationKey!\n          ) {\n            uninstalled: parentCompanyIntegrationDeletion(\n              companyID: $companyID\n              key: $key\n            ) {\n              key\n              state\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation IntegrationDeletion($companyID: ID!, $key: IntegrationKey!) {\n          uninstalled: integrationDeletion(companyID: $companyID, key: $key) {\n            key\n            state\n          }\n        }\n      "
): (typeof documents)["\n        mutation IntegrationDeletion($companyID: ID!, $key: IntegrationKey!) {\n          uninstalled: integrationDeletion(companyID: $companyID, key: $key) {\n            key\n            state\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation IntegrationAccessConfiguration(\n          $companyID: ID!\n          $key: IntegrationKey!\n          $access: [IntegrationAccess!]!\n        ) {\n          configured: integrationAccessConfiguration(\n            companyID: $companyID\n            key: $key\n            access: $access\n          ) {\n            key\n            state\n            access\n          }\n        }\n      "
): (typeof documents)["\n        mutation IntegrationAccessConfiguration(\n          $companyID: ID!\n          $key: IntegrationKey!\n          $access: [IntegrationAccess!]!\n        ) {\n          configured: integrationAccessConfiguration(\n            companyID: $companyID\n            key: $key\n            access: $access\n          ) {\n            key\n            state\n            access\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query Migrator($migratorID: ID!) {\n        migrator(migratorID: $migratorID) {\n          key\n          name\n          logo\n        }\n      }\n    "
): (typeof documents)["\n      query Migrator($migratorID: ID!) {\n        migrator(migratorID: $migratorID) {\n          key\n          name\n          logo\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query MigratorList {\n        migratorList {\n          key\n          name\n          logo\n        }\n      }\n    "
): (typeof documents)["\n      query MigratorList {\n        migratorList {\n          key\n          name\n          logo\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation ParentSynchronizeMigrator(\n          $migratorID: ID!\n          $companyID: ID!\n          $metadata: MigrationMetadata!\n        ) {\n          parentSynchronizeMigrator(\n            companyID: $companyID\n            migratorID: $migratorID\n            metadata: $metadata\n          ) {\n            id\n            state\n          }\n        }\n      "
): (typeof documents)["\n        mutation ParentSynchronizeMigrator(\n          $migratorID: ID!\n          $companyID: ID!\n          $metadata: MigrationMetadata!\n        ) {\n          parentSynchronizeMigrator(\n            companyID: $companyID\n            migratorID: $migratorID\n            metadata: $metadata\n          ) {\n            id\n            state\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation SynchronizeMigrator(\n        $migratorID: ID!\n        $companyID: ID!\n        $metadata: MigrationMetadata!\n      ) {\n        synchronizeMigrator(\n          companyID: $companyID\n          migratorID: $migratorID\n          metadata: $metadata\n        ) {\n          id\n          state\n        }\n      }\n    "
): (typeof documents)["\n      mutation SynchronizeMigrator(\n        $migratorID: ID!\n        $companyID: ID!\n        $metadata: MigrationMetadata!\n      ) {\n        synchronizeMigrator(\n          companyID: $companyID\n          migratorID: $migratorID\n          metadata: $metadata\n        ) {\n          id\n          state\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query CompanyTeamList($companyID: ID!) {\n          list: teamsList(companyID: $companyID) {\n            name\n            description\n            statistics {\n              subordinate\n              contracts\n            }\n          }\n        }\n      "
): (typeof documents)["\n        query CompanyTeamList($companyID: ID!) {\n          list: teamsList(companyID: $companyID) {\n            name\n            description\n            statistics {\n              subordinate\n              contracts\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query CompanyManagersList($id: ID!) {\n          company(id: $id) {\n            list: managerList {\n              id\n              name\n              email\n            }\n          }\n        }\n      "
): (typeof documents)["\n        query CompanyManagersList($id: ID!) {\n          company(id: $id) {\n            list: managerList {\n              id\n              name\n              email\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query CompanyTeamDetails($companyID: ID!, $name: String!) {\n          team(companyID: $companyID, name: $name) {\n            name\n            created\n            description\n            statistics {\n              customers\n              contracts\n            }\n            leaderList {\n              id\n              name\n              email\n            }\n            subordinateList {\n              id\n              name\n              email\n            }\n          }\n        }\n      "
): (typeof documents)["\n        query CompanyTeamDetails($companyID: ID!, $name: String!) {\n          team(companyID: $companyID, name: $name) {\n            name\n            created\n            description\n            statistics {\n              customers\n              contracts\n            }\n            leaderList {\n              id\n              name\n              email\n            }\n            subordinateList {\n              id\n              name\n              email\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation TeamCreation($companyID: ID!, $input: TeamValues!) {\n          created: teamCreation(companyID: $companyID, input: $input) {\n            name\n          }\n        }\n      "
): (typeof documents)["\n        mutation TeamCreation($companyID: ID!, $input: TeamValues!) {\n          created: teamCreation(companyID: $companyID, input: $input) {\n            name\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation TeamUpdate(\n          $companyID: ID!\n          $name: String!\n          $input: TeamValues!\n        ) {\n          updated: teamUpdate(\n            companyID: $companyID\n            name: $name\n            input: $input\n          ) {\n            name\n          }\n        }\n      "
): (typeof documents)["\n        mutation TeamUpdate(\n          $companyID: ID!\n          $name: String!\n          $input: TeamValues!\n        ) {\n          updated: teamUpdate(\n            companyID: $companyID\n            name: $name\n            input: $input\n          ) {\n            name\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation TeamDeletion($companyID: ID!, $name: String!) {\n          deleted: teamDeletion(companyID: $companyID, name: $name) {\n            name\n          }\n        }\n      "
): (typeof documents)["\n        mutation TeamDeletion($companyID: ID!, $name: String!) {\n          deleted: teamDeletion(companyID: $companyID, name: $name) {\n            name\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation TeamMemberAdd(\n          $companyID: ID!\n          $teamName: String!\n          $values: [TeamMember!]\n        ) {\n          added: teamMemberAdd(\n            companyID: $companyID\n            teamName: $teamName\n            values: $values\n          ) {\n            name\n          }\n        }\n      "
): (typeof documents)["\n        mutation TeamMemberAdd(\n          $companyID: ID!\n          $teamName: String!\n          $values: [TeamMember!]\n        ) {\n          added: teamMemberAdd(\n            companyID: $companyID\n            teamName: $teamName\n            values: $values\n          ) {\n            name\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation TeamMemberRemove(\n          $companyID: ID!\n          $teamName: String!\n          $values: [ID!]\n        ) {\n          removed: teamMemberRemove(\n            companyID: $companyID\n            teamName: $teamName\n            values: $values\n          ) {\n            name\n          }\n        }\n      "
): (typeof documents)["\n        mutation TeamMemberRemove(\n          $companyID: ID!\n          $teamName: String!\n          $values: [ID!]\n        ) {\n          removed: teamMemberRemove(\n            companyID: $companyID\n            teamName: $teamName\n            values: $values\n          ) {\n            name\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query InstrumentListing(\n        $filters: InstrumentFilters!\n        $pagination: Pagination!\n      ) {\n        instrumentListing(filters: $filters, pagination: $pagination) {\n          totalCount\n          totalPages\n          instruments {\n            code\n            label\n            valuation\n            category\n            subcategory\n            managementCompany\n            riskIndicator\n            dic\n            prospectus\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query InstrumentListing(\n        $filters: InstrumentFilters!\n        $pagination: Pagination!\n      ) {\n        instrumentListing(filters: $filters, pagination: $pagination) {\n          totalCount\n          totalPages\n          instruments {\n            code\n            label\n            valuation\n            category\n            subcategory\n            managementCompany\n            riskIndicator\n            dic\n            prospectus\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query InstrumentFilters($group: AssetGroup) {\n        instrumentFilters {\n          categories(group: $group)\n          subcategories(group: $group)\n          riskIndicators(group: $group)\n          managementCompanies(group: $group)\n        }\n      }\n    "
): (typeof documents)["\n      query InstrumentFilters($group: AssetGroup) {\n        instrumentFilters {\n          categories(group: $group)\n          subcategories(group: $group)\n          riskIndicators(group: $group)\n          managementCompanies(group: $group)\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation InstrumentSriUpdate($id: ID!, $riskIndicator: Int!) {\n        instrumentSriUpdate(id: $id, riskIndicator: $riskIndicator) {\n          code\n        }\n      }\n    "
): (typeof documents)["\n      mutation InstrumentSriUpdate($id: ID!, $riskIndicator: Int!) {\n        instrumentSriUpdate(id: $id, riskIndicator: $riskIndicator) {\n          code\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation UpdateCustomerAccess(\n        $companyID: ID!\n        $customerID: ID!\n        $update: CustomerUpdate!\n        $inviteCreation: CustomerInviteCreation!\n        $sendInvite: Boolean!\n      ) {\n        customerUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          update: $update\n        ) {\n          plan\n          id\n        }\n        invite: inviteCustomer(companyID: $companyID, input: $inviteCreation)\n          @include(if: $sendInvite) {\n          id\n          code\n          email\n        }\n      }\n    "
): (typeof documents)["\n      mutation UpdateCustomerAccess(\n        $companyID: ID!\n        $customerID: ID!\n        $update: CustomerUpdate!\n        $inviteCreation: CustomerInviteCreation!\n        $sendInvite: Boolean!\n      ) {\n        customerUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          update: $update\n        ) {\n          plan\n          id\n        }\n        invite: inviteCustomer(companyID: $companyID, input: $inviteCreation)\n          @include(if: $sendInvite) {\n          id\n          code\n          email\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation ReportingCreation(\n        $companyID: ID!\n        $customerID: ID!\n        $documentTypes: [String!]!\n        $period: Int!\n        $contains: [String!]\n        $assetsList: [String!]\n      ) {\n        reportingCreation(\n          companyID: $companyID\n          customerID: $customerID\n          documentTypes: $documentTypes\n          period: $period\n          contains: $contains\n          assetsList: $assetsList\n        ) {\n          type\n          name\n          url\n        }\n      }\n    "
): (typeof documents)["\n      mutation ReportingCreation(\n        $companyID: ID!\n        $customerID: ID!\n        $documentTypes: [String!]!\n        $period: Int!\n        $contains: [String!]\n        $assetsList: [String!]\n      ) {\n        reportingCreation(\n          companyID: $companyID\n          customerID: $customerID\n          documentTypes: $documentTypes\n          period: $period\n          contains: $contains\n          assetsList: $assetsList\n        ) {\n          type\n          name\n          url\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ReportingCustomerWealthAssets(\n        $id: ID!\n        $companyID: ID!\n        $computing: WealthFilter\n        $groups: [AssetGroup!]\n      ) {\n        customerWealth(\n          id: $id\n          companyID: $companyID\n          groups: $groups\n          computing: $computing\n        ) {\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            metadata\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query ReportingCustomerWealthAssets(\n        $id: ID!\n        $companyID: ID!\n        $computing: WealthFilter\n        $groups: [AssetGroup!]\n      ) {\n        customerWealth(\n          id: $id\n          companyID: $companyID\n          groups: $groups\n          computing: $computing\n        ) {\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            metadata\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query Manager($companyID: ID!) {\n        authenticated {\n          id\n          manager {\n            id\n            name\n            email\n            phone\n            companyList {\n              id\n              name\n              logo\n            }\n            claims(companyID: $companyID)\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query Manager($companyID: ID!) {\n        authenticated {\n          id\n          manager {\n            id\n            name\n            email\n            phone\n            companyList {\n              id\n              name\n              logo\n            }\n            claims(companyID: $companyID)\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ManagerInvitePendingList {\n        managerInvitePendingList {\n          id\n          created\n          company {\n            id\n            name\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query ManagerInvitePendingList {\n        managerInvitePendingList {\n          id\n          created\n          company {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation ProfileUpdate($input: ProfileUpdate!) {\n        profileUpdate(input: $input) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation ProfileUpdate($input: ProfileUpdate!) {\n        profileUpdate(input: $input) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation ManagerInviteAccept($id: ID!) {\n        managerInviteAccept(id: $id) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation ManagerInviteAccept($id: ID!) {\n        managerInviteAccept(id: $id) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation ManagerInviteReject($id: ID!) {\n        managerInviteReject(id: $id) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation ManagerInviteReject($id: ID!) {\n        managerInviteReject(id: $id) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query Layout($companyID: ID!) {\n        authenticated {\n          manager {\n            claims(companyID: $companyID)\n          }\n        }\n        categories: companyConformityCategories(companyID: $companyID) {\n          key\n          name\n          customerVisibility\n        }\n      }\n    "
): (typeof documents)["\n      query Layout($companyID: ID!) {\n        authenticated {\n          manager {\n            claims(companyID: $companyID)\n          }\n        }\n        categories: companyConformityCategories(companyID: $companyID) {\n          key\n          name\n          customerVisibility\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query WealthAndPerformance($companyID: ID!, $computing: WealthFilter) {\n        company(id: $companyID) {\n          wealth(computing: $computing)\n        }\n      }\n    "
): (typeof documents)["\n      query WealthAndPerformance($companyID: ID!, $computing: WealthFilter) {\n        company(id: $companyID) {\n          wealth(computing: $computing)\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query LayoutSubWealth($company: ID!) {\n        customersAssetsTypes: companyWealth(\n          id: $company\n          computing: customers\n        ) {\n          name: group\n        }\n        underManagementsAssetsTypes: companyWealth(\n          id: $company\n          computing: under_managements\n        ) {\n          name: group\n        }\n      }\n    "
): (typeof documents)["\n      query LayoutSubWealth($company: ID!) {\n        customersAssetsTypes: companyWealth(\n          id: $company\n          computing: customers\n        ) {\n          name: group\n        }\n        underManagementsAssetsTypes: companyWealth(\n          id: $company\n          computing: under_managements\n        ) {\n          name: group\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query LayoutCustomer(\n        $customerID: ID!\n        $companyID: ID!\n        $computing: WealthFilter\n      ) {\n        authenticated {\n          manager {\n            claims(companyID: $companyID)\n          }\n        }\n        # customer\n        customer(id: $customerID, companyID: $companyID) {\n          id\n          firstName\n          lastName\n          name\n          email\n          plan\n          hasB2CAccount\n          pendingInvitations {\n            id\n            code\n            created\n            email\n            status\n            updated\n          }\n          informations {\n            details\n            general\n          }\n          valuation: wealth(companyID: $companyID, computing: $computing)\n        }\n      }\n    "
): (typeof documents)["\n      query LayoutCustomer(\n        $customerID: ID!\n        $companyID: ID!\n        $computing: WealthFilter\n      ) {\n        authenticated {\n          manager {\n            claims(companyID: $companyID)\n          }\n        }\n        # customer\n        customer(id: $customerID, companyID: $companyID) {\n          id\n          firstName\n          lastName\n          name\n          email\n          plan\n          hasB2CAccount\n          pendingInvitations {\n            id\n            code\n            created\n            email\n            status\n            updated\n          }\n          informations {\n            details\n            general\n          }\n          valuation: wealth(companyID: $companyID, computing: $computing)\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query Company($id: ID!) {\n        connectionList(companyID: $id) {\n          state\n        }\n      }\n    "
): (typeof documents)["\n      query Company($id: ID!) {\n        connectionList(companyID: $id) {\n          state\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation Logout {\n        logoutAuthentication {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation Logout {\n        logoutAuthentication {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation InviteCustomer(\n        $companyID: ID!\n        $input: CustomerInviteCreation!\n      ) {\n        inviteCustomer(companyID: $companyID, input: $input) {\n          id\n          email\n        }\n      }\n    "
): (typeof documents)["\n      mutation InviteCustomer(\n        $companyID: ID!\n        $input: CustomerInviteCreation!\n      ) {\n        inviteCustomer(companyID: $companyID, input: $input) {\n          id\n          email\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CreateCustomer($companyID: ID!, $input: CustomerCreation!) {\n        customer: customerCreation(companyID: $companyID, input: $input) {\n          id\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation CreateCustomer($companyID: ID!, $input: CustomerCreation!) {\n        customer: customerCreation(companyID: $companyID, input: $input) {\n          id\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CreateCustomerReference(\n        $companyID: ID!\n        $input: [CustomerCreation!]!\n        $addCustomerSheet: Boolean\n      ) {\n        customer: customerReferenceCreation(\n          companyID: $companyID\n          input: $input\n          addCustomerSheet: $addCustomerSheet\n        ) {\n          id\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation CreateCustomerReference(\n        $companyID: ID!\n        $input: [CustomerCreation!]!\n        $addCustomerSheet: Boolean\n      ) {\n        customer: customerReferenceCreation(\n          companyID: $companyID\n          input: $input\n          addCustomerSheet: $addCustomerSheet\n        ) {\n          id\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CompanyCreation($input: CompanyCreation!) {\n        companyCreation(input: $input) {\n          id\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation CompanyCreation($input: CompanyCreation!) {\n        companyCreation(input: $input) {\n          id\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation ParentCompanyUpload(\n          $companyID: ID!\n          $files: [UploadRequest!]!\n        ) {\n          parentCompanyUpload(companyID: $companyID, files: $files) {\n            files {\n              url\n              name\n            }\n            expiration\n          }\n        }\n      "
): (typeof documents)["\n        mutation ParentCompanyUpload(\n          $companyID: ID!\n          $files: [UploadRequest!]!\n        ) {\n          parentCompanyUpload(companyID: $companyID, files: $files) {\n            files {\n              url\n              name\n            }\n            expiration\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CompanyUpload($companyID: ID!, $files: [UploadRequest!]!) {\n        companyUpload(companyID: $companyID, files: $files) {\n          files {\n            url\n            name\n          }\n          expiration\n        }\n      }\n    "
): (typeof documents)["\n      mutation CompanyUpload($companyID: ID!, $files: [UploadRequest!]!) {\n        companyUpload(companyID: $companyID, files: $files) {\n          files {\n            url\n            name\n          }\n          expiration\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerCreationMultiple(\n        $companyID: ID!\n        $file: String!\n        $invite: Boolean!\n      ) {\n        customerCreationMultiple(\n          companyID: $companyID\n          file: $file\n          invite: $invite\n        ) {\n          id\n          delayedUntil\n        }\n      }\n    "
): (typeof documents)["\n      mutation CustomerCreationMultiple(\n        $companyID: ID!\n        $file: String!\n        $invite: Boolean!\n      ) {\n        customerCreationMultiple(\n          companyID: $companyID\n          file: $file\n          invite: $invite\n        ) {\n          id\n          delayedUntil\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query NewCustomers($companyID: ID!, $input: CustomersInput) {\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                email\n                phoneNumber\n                informations {\n                  details\n                  general\n                }\n                underManagement: wealth(\n                  companyID: $companyID\n                  computing: under_managements\n                )\n              }\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query NewCustomers($companyID: ID!, $input: CustomersInput) {\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                email\n                phoneNumber\n                informations {\n                  details\n                  general\n                }\n                underManagement: wealth(\n                  companyID: $companyID\n                  computing: under_managements\n                )\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query NewCustomersCount($companyID: ID!, $input: CustomersInput) {\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query NewCustomersCount($companyID: ID!, $input: CustomersInput) {\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query Assets(\n        $company: ID!\n        $filters: AssetFilters\n        $computing: WealthFilter\n        $group: AssetGroup\n      ) {\n        company(id: $company) {\n          list: assetsUnderManagement(\n            group: $group\n            filters: $filters\n            computing: $computing\n          ) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                group\n                categoryName\n                valuation\n                accountNumber\n                openDate\n                metadata\n                customer {\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query Assets(\n        $company: ID!\n        $filters: AssetFilters\n        $computing: WealthFilter\n        $group: AssetGroup\n      ) {\n        company(id: $company) {\n          list: assetsUnderManagement(\n            group: $group\n            filters: $filters\n            computing: $computing\n          ) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                group\n                categoryName\n                valuation\n                accountNumber\n                openDate\n                metadata\n                customer {\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query AssetsNumber(\n        $company: ID!\n        $computing: WealthFilter\n        $group: AssetGroup\n        $filters: AssetFilters\n      ) {\n        company(id: $company) {\n          list: assetsUnderManagement(\n            group: $group\n            computing: $computing\n            filters: $filters\n          ) {\n            totalCount\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query AssetsNumber(\n        $company: ID!\n        $computing: WealthFilter\n        $group: AssetGroup\n        $filters: AssetFilters\n      ) {\n        company(id: $company) {\n          list: assetsUnderManagement(\n            group: $group\n            computing: $computing\n            filters: $filters\n          ) {\n            totalCount\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query NewTransactions(\n        $companyID: ID!\n        $filters: AccountingAnalyticsFilters!\n        $pagination: Pagination!\n      ) {\n        list: accountingTransactionList(\n          companyID: $companyID\n          filters: $filters\n          pagination: $pagination\n        ) {\n          totalCount\n          edges {\n            node {\n              id\n              date\n              amount\n              name\n              entityName\n              assetName\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query NewTransactions(\n        $companyID: ID!\n        $filters: AccountingAnalyticsFilters!\n        $pagination: Pagination!\n      ) {\n        list: accountingTransactionList(\n          companyID: $companyID\n          filters: $filters\n          pagination: $pagination\n        ) {\n          totalCount\n          edges {\n            node {\n              id\n              date\n              amount\n              name\n              entityName\n              assetName\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ProviderStatistics(\n        $companyID: ID!\n        $filters: AccountingAnalyticsFilters!\n      ) {\n        list: accountingProviderStatistics(\n          companyID: $companyID\n          filters: $filters\n        ) {\n          name\n          key\n          logo\n          total\n        }\n      }\n    "
): (typeof documents)["\n      query ProviderStatistics(\n        $companyID: ID!\n        $filters: AccountingAnalyticsFilters!\n      ) {\n        list: accountingProviderStatistics(\n          companyID: $companyID\n          filters: $filters\n        ) {\n          name\n          key\n          logo\n          total\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query AccountingManagersList($id: ID!) {\n          company(id: $id) {\n            list: managerList {\n              id\n              name\n            }\n          }\n        }\n      "
): (typeof documents)["\n        query AccountingManagersList($id: ID!) {\n          company(id: $id) {\n            list: managerList {\n              id\n              name\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query AssetList($companyID: ID!, $filters: AccountingAnalyticsFilters!) {\n        accountingAssets(companyID: $companyID, filters: $filters)\n      }\n    "
): (typeof documents)["\n      query AssetList($companyID: ID!, $filters: AccountingAnalyticsFilters!) {\n        accountingAssets(companyID: $companyID, filters: $filters)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query Connector($connectorID: ID!) {\n        connector(connectorID: $connectorID) {\n          name\n          logo\n          labels\n        }\n      }\n    "
): (typeof documents)["\n      query Connector($connectorID: ID!) {\n        connector(connectorID: $connectorID) {\n          name\n          logo\n          labels\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ConnectorList {\n        connectorList {\n          key\n          name\n          logo\n          provider\n        }\n      }\n    "
): (typeof documents)["\n      query ConnectorList {\n        connectorList {\n          key\n          name\n          logo\n          provider\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation SynchronizePowensConnector($connectorID: ID!, $companyID: ID!) {\n        synchronizePowensConnector(\n          companyID: $companyID\n          connectorID: $connectorID\n        )\n      }\n    "
): (typeof documents)["\n      mutation SynchronizePowensConnector($connectorID: ID!, $companyID: ID!) {\n        synchronizePowensConnector(\n          companyID: $companyID\n          connectorID: $connectorID\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation SynchronizeConnector(\n        $connectorID: ID!\n        $companyID: ID!\n        $metadata: ConnectionMetadata!\n      ) {\n        synchronizeConnector(\n          connectorID: $connectorID\n          companyID: $companyID\n          metadata: $metadata\n        ) {\n          connection {\n            id\n            state\n          }\n          synchronization {\n            id\n          }\n        }\n      }\n    "
): (typeof documents)["\n      mutation SynchronizeConnector(\n        $connectorID: ID!\n        $companyID: ID!\n        $metadata: ConnectionMetadata!\n      ) {\n        synchronizeConnector(\n          connectorID: $connectorID\n          companyID: $companyID\n          metadata: $metadata\n        ) {\n          connection {\n            id\n            state\n          }\n          synchronization {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation ChangeConnectionCredentials(\n        $connectionID: ID!\n        $credentials: ConnectionMetadata!\n      ) {\n        changeConnectionCredentials(\n          connectionID: $connectionID\n          credentials: $credentials\n        ) {\n          connection {\n            id\n            state\n          }\n          synchronization {\n            id\n          }\n        }\n      }\n    "
): (typeof documents)["\n      mutation ChangeConnectionCredentials(\n        $connectionID: ID!\n        $credentials: ConnectionMetadata!\n      ) {\n        changeConnectionCredentials(\n          connectionID: $connectionID\n          credentials: $credentials\n        ) {\n          connection {\n            id\n            state\n          }\n          synchronization {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation ValidateConnectionOTP($connectionID: ID!, $otp: String!) {\n        validateConnectionOTP(connectionID: $connectionID, otp: $otp) {\n          id\n          state\n        }\n      }\n    "
): (typeof documents)["\n      mutation ValidateConnectionOTP($connectionID: ID!, $otp: String!) {\n        validateConnectionOTP(connectionID: $connectionID, otp: $otp) {\n          id\n          state\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation GlobalAddWealth($companyID: ID!) {\n        url: synchronizeAssetUnderManagement(companyID: $companyID)\n      }\n    "
): (typeof documents)["\n      mutation GlobalAddWealth($companyID: ID!) {\n        url: synchronizeAssetUnderManagement(companyID: $companyID)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query Campaigns($companyID: ID!) {\n        campaignList(companyID: $companyID) {\n          id\n          name\n          assetGroup\n          provider\n          customersCount\n          totalInvestment\n          contractList {\n            id\n            investment\n            status\n            customer {\n              id\n              name\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query Campaigns($companyID: ID!) {\n        campaignList(companyID: $companyID) {\n          id\n          name\n          assetGroup\n          provider\n          customersCount\n          totalInvestment\n          contractList {\n            id\n            investment\n            status\n            customer {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CampaignsDocumentList(\n        $companyID: ID!\n        $contractID: ID!\n        $customerID: ID!\n      ) {\n        documentList(\n          companyID: $companyID\n          contractID: $contractID\n          customerID: $customerID\n        ) {\n          id\n          name\n          expiration\n          treatement\n        }\n      }\n    "
): (typeof documents)["\n      query CampaignsDocumentList(\n        $companyID: ID!\n        $contractID: ID!\n        $customerID: ID!\n      ) {\n        documentList(\n          companyID: $companyID\n          contractID: $contractID\n          customerID: $customerID\n        ) {\n          id\n          name\n          expiration\n          treatement\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CampaignCreation($companyID: ID!, $input: CampaignCreation!) {\n        campaignCreation(companyID: $companyID, input: $input) {\n          id\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation CampaignCreation($companyID: ID!, $input: CampaignCreation!) {\n        campaignCreation(companyID: $companyID, input: $input) {\n          id\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CampaignModification(\n        $campaignID: ID!\n        $companyID: ID!\n        $update: CampaignModification\n      ) {\n        campaignModification(\n          companyID: $companyID\n          campaignID: $campaignID\n          update: $update\n        ) {\n          id\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation CampaignModification(\n        $campaignID: ID!\n        $companyID: ID!\n        $update: CampaignModification\n      ) {\n        campaignModification(\n          companyID: $companyID\n          campaignID: $campaignID\n          update: $update\n        ) {\n          id\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CampaignContractModification(\n        $contractID: ID!\n        $companyID: ID!\n        $update: CampaignContractModification\n      ) {\n        campaignContractModification(\n          companyID: $companyID\n          contractID: $contractID\n          update: $update\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation CampaignContractModification(\n        $contractID: ID!\n        $companyID: ID!\n        $update: CampaignContractModification\n      ) {\n        campaignContractModification(\n          companyID: $companyID\n          contractID: $contractID\n          update: $update\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query DocumentCustomerList(\n        $company: String!\n        $documentCategory: String\n        $input: DocumentCustomer\n      ) {\n        documentCustomerList(\n          company: $company\n          documentCategory: $documentCategory\n          input: $input\n        ) {\n          category {\n            key\n            name\n          }\n          totalCount\n          edges {\n            node {\n              id\n              name\n              expiration\n              signature {\n                signed\n                validated\n                digital\n                customer\n                manager\n                signatories\n              }\n              customer {\n                id\n                name\n              }\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query DocumentCustomerList(\n        $company: String!\n        $documentCategory: String\n        $input: DocumentCustomer\n      ) {\n        documentCustomerList(\n          company: $company\n          documentCategory: $documentCategory\n          input: $input\n        ) {\n          category {\n            key\n            name\n          }\n          totalCount\n          edges {\n            node {\n              id\n              name\n              expiration\n              signature {\n                signed\n                validated\n                digital\n                customer\n                manager\n                signatories\n              }\n              customer {\n                id\n                name\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation DocumentNotification(\n        $documentID: ID!\n        $requests: [NotificationRequest!]!\n      ) {\n        notifyDocumentStatus(documentID: $documentID, requests: $requests) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation DocumentNotification(\n        $documentID: ID!\n        $requests: [NotificationRequest!]!\n      ) {\n        notifyDocumentStatus(documentID: $documentID, requests: $requests) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CompanyCompliance($company: ID!) {\n        customersCompliance(company: $company) {\n          category {\n            key\n            name\n          }\n          levels {\n            valid\n            unvalid\n            waiting\n          }\n        }\n        globalCompliance(companyID: $company) {\n          valid\n          unvalid\n          waiting\n        }\n      }\n    "
): (typeof documents)["\n      query CompanyCompliance($company: ID!) {\n        customersCompliance(company: $company) {\n          category {\n            key\n            name\n          }\n          levels {\n            valid\n            unvalid\n            waiting\n          }\n        }\n        globalCompliance(companyID: $company) {\n          valid\n          unvalid\n          waiting\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query Budget($customerID: ID!, $companyID: ID!) {\n        budgetList(customerID: $customerID, companyID: $companyID) {\n          id\n          name\n          type\n          amount\n          libelle\n        }\n        customer(id: $customerID, companyID: $companyID) {\n          availableLiquidity(companyID: $companyID)\n        }\n      }\n    "
): (typeof documents)["\n      query Budget($customerID: ID!, $companyID: ID!) {\n        budgetList(customerID: $customerID, companyID: $companyID) {\n          id\n          name\n          type\n          amount\n          libelle\n        }\n        customer(id: $customerID, companyID: $companyID) {\n          availableLiquidity(companyID: $companyID)\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation BudgetCreation(\n        $customerID: ID!\n        $companyID: ID!\n        $input: BudgetCreationInput!\n        $budgetID: ID\n      ) {\n        created: budgetCreation(\n          customerID: $customerID\n          companyID: $companyID\n          input: $input\n          budgetID: $budgetID\n        ) {\n          libelle\n          name\n          type\n        }\n      }\n    "
): (typeof documents)["\n      mutation BudgetCreation(\n        $customerID: ID!\n        $companyID: ID!\n        $input: BudgetCreationInput!\n        $budgetID: ID\n      ) {\n        created: budgetCreation(\n          customerID: $customerID\n          companyID: $companyID\n          input: $input\n          budgetID: $budgetID\n        ) {\n          libelle\n          name\n          type\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation BudgetItemDeletion(\n        $companyID: ID!\n        $customerID: ID!\n        $budgetID: ID!\n      ) {\n        budgetItemDeletion(\n          customerID: $customerID\n          companyID: $companyID\n          budgetID: $budgetID\n        )\n      }\n    "
): (typeof documents)["\n      mutation BudgetItemDeletion(\n        $companyID: ID!\n        $customerID: ID!\n        $budgetID: ID!\n      ) {\n        budgetItemDeletion(\n          customerID: $customerID\n          companyID: $companyID\n          budgetID: $budgetID\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation UpdateLCB($companyID: ID!, $customerId: ID!, $input: LCBForm!) {\n        updateLCB(companyID: $companyID, customerId: $customerId, input: $input)\n      }\n    "
): (typeof documents)["\n      mutation UpdateLCB($companyID: ID!, $customerId: ID!, $input: LCBForm!) {\n        updateLCB(companyID: $companyID, customerId: $customerId, input: $input)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerLcb($companyID: ID!, $customerID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          informations {\n            lcbLab\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerLcb($companyID: ID!, $customerID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          informations {\n            lcbLab\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerConformityObjectives($customerID: ID!, $companyID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          conformityObjectives\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerConformityObjectives($customerID: ID!, $companyID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          conformityObjectives\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query EnvelopDocumentTemplateList($companyID: ID!, $available: Boolean!) {\n        documentTemplateList(companyID: $companyID, available: $available) {\n          id\n          name\n          category\n          creator\n          productType\n        }\n      }\n    "
): (typeof documents)["\n      query EnvelopDocumentTemplateList($companyID: ID!, $available: Boolean!) {\n        documentTemplateList(companyID: $companyID, available: $available) {\n          id\n          name\n          category\n          creator\n          productType\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerConformity(\n        $companyID: ID!\n        $customerID: ID!\n        $officialCategories: [String!]\n        $legalCategories: [String!]\n        $arbitraryCategories: [String!]\n      ) {\n        officialList: documentList(\n          companyID: $companyID\n          customerID: $customerID\n          categories: $officialCategories\n        ) {\n          id\n          name\n          category {\n            key\n            name\n          }\n          treatement\n          expiration\n        }\n        legalList: documentList(\n          companyID: $companyID\n          customerID: $customerID\n          categories: $legalCategories\n        ) {\n          id\n          name\n          category {\n            key\n            name\n          }\n          treatement\n          expiration\n        }\n        envelopeList(\n          companyID: $companyID\n          customerID: $customerID\n          categories: $arbitraryCategories\n        ) {\n          id\n          name\n          access\n          expiration\n          conformity\n          documentList(categories: $arbitraryCategories) {\n            id\n            name\n            category {\n              key\n              name\n            }\n            treatement\n            expiration\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerConformity(\n        $companyID: ID!\n        $customerID: ID!\n        $officialCategories: [String!]\n        $legalCategories: [String!]\n        $arbitraryCategories: [String!]\n      ) {\n        officialList: documentList(\n          companyID: $companyID\n          customerID: $customerID\n          categories: $officialCategories\n        ) {\n          id\n          name\n          category {\n            key\n            name\n          }\n          treatement\n          expiration\n        }\n        legalList: documentList(\n          companyID: $companyID\n          customerID: $customerID\n          categories: $legalCategories\n        ) {\n          id\n          name\n          category {\n            key\n            name\n          }\n          treatement\n          expiration\n        }\n        envelopeList(\n          companyID: $companyID\n          customerID: $customerID\n          categories: $arbitraryCategories\n        ) {\n          id\n          name\n          access\n          expiration\n          conformity\n          documentList(categories: $arbitraryCategories) {\n            id\n            name\n            category {\n              key\n              name\n            }\n            treatement\n            expiration\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ConformityDocument($companyID: ID!, $customerID: ID!, $id: ID!) {\n        document(companyID: $companyID, customerID: $customerID, id: $id) {\n          url\n          name\n        }\n      }\n    "
): (typeof documents)["\n      query ConformityDocument($companyID: ID!, $customerID: ID!, $id: ID!) {\n        document(companyID: $companyID, customerID: $customerID, id: $id) {\n          url\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query SearchCampaign($companyID: ID!, $text: String) {\n        searchCampaign(companyID: $companyID, text: $text) {\n          id\n          name\n          assetGroup\n        }\n      }\n    "
): (typeof documents)["\n      query SearchCampaign($companyID: ID!, $text: String) {\n        searchCampaign(companyID: $companyID, text: $text) {\n          id\n          name\n          assetGroup\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query InvestorProfile($companyID: ID!, $customerID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          investorProfile\n          informations {\n            details\n            general\n          }\n        }\n        investorProfileForm(companyID: $companyID, customerID: $customerID)\n        budgetList(customerID: $customerID, companyID: $companyID) {\n          id\n          name\n          type\n          amount\n          libelle\n        }\n      }\n    "
): (typeof documents)["\n      query InvestorProfile($companyID: ID!, $customerID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          investorProfile\n          informations {\n            details\n            general\n          }\n        }\n        investorProfileForm(companyID: $companyID, customerID: $customerID)\n        budgetList(customerID: $customerID, companyID: $companyID) {\n          id\n          name\n          type\n          amount\n          libelle\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query InvestorProfileStats($companyID: ID!, $customerID: ID!) {\n        investorProfileStats(companyID: $companyID, customerID: $customerID) {\n          knowledge\n          riskProfile\n          nonFinancialSensitivity\n        }\n        investorEnvironmentalStats(\n          companyID: $companyID\n          customerID: $customerID\n        ) {\n          activities\n          negativeImpacts\n          socialObjectives\n        }\n        investorProfileForm(companyID: $companyID, customerID: $customerID)\n      }\n    "
): (typeof documents)["\n      query InvestorProfileStats($companyID: ID!, $customerID: ID!) {\n        investorProfileStats(companyID: $companyID, customerID: $customerID) {\n          knowledge\n          riskProfile\n          nonFinancialSensitivity\n        }\n        investorEnvironmentalStats(\n          companyID: $companyID\n          customerID: $customerID\n        ) {\n          activities\n          negativeImpacts\n          socialObjectives\n        }\n        investorProfileForm(companyID: $companyID, customerID: $customerID)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query templateVariables(\n        $companyID: ID!\n        $customerID: ID!\n        $projectID: ID\n      ) {\n        templateVariables(\n          companyID: $companyID\n          customerID: $customerID\n          projectID: $projectID\n        ) {\n          key\n          value\n        }\n      }\n    "
): (typeof documents)["\n      query templateVariables(\n        $companyID: ID!\n        $customerID: ID!\n        $projectID: ID\n      ) {\n        templateVariables(\n          companyID: $companyID\n          customerID: $customerID\n          projectID: $projectID\n        ) {\n          key\n          value\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CreateFilesFromTemplate(\n        $companyID: ID!\n        $customerID: ID!\n        $templates: [FileFromTemplateInput!]!\n      ) {\n        createFilesFromTemplate(\n          companyID: $companyID\n          customerID: $customerID\n          templates: $templates\n        ) {\n          id\n          url\n          name\n          category\n          extension\n        }\n      }\n    "
): (typeof documents)["\n      mutation CreateFilesFromTemplate(\n        $companyID: ID!\n        $customerID: ID!\n        $templates: [FileFromTemplateInput!]!\n      ) {\n        createFilesFromTemplate(\n          companyID: $companyID\n          customerID: $customerID\n          templates: $templates\n        ) {\n          id\n          url\n          name\n          category\n          extension\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CreateFilesFromGED(\n        $companyID: ID!\n        $customerID: ID!\n        $gedDocumentsID: [String!]!\n      ) {\n        createFilesFromGedDocuments(\n          companyID: $companyID\n          customerID: $customerID\n          gedDocumentsID: $gedDocumentsID\n        ) {\n          url\n          name\n          category\n          extension\n        }\n      }\n    "
): (typeof documents)["\n      mutation CreateFilesFromGED(\n        $companyID: ID!\n        $customerID: ID!\n        $gedDocumentsID: [String!]!\n      ) {\n        createFilesFromGedDocuments(\n          companyID: $companyID\n          customerID: $customerID\n          gedDocumentsID: $gedDocumentsID\n        ) {\n          url\n          name\n          category\n          extension\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerConformityObjectivesUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: ConformityObjectives!\n      ) {\n        conformityObjectivesUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    "
): (typeof documents)["\n      mutation CustomerConformityObjectivesUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: ConformityObjectives!\n      ) {\n        conformityObjectivesUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerUploadCreation(\n        $companyID: ID!\n        $customerID: ID!\n        $files: [UploadRequest!]!\n      ) {\n        customerUpload(\n          companyID: $companyID\n          customerID: $customerID\n          files: $files\n        ) {\n          files {\n            url\n            name\n          }\n          expiration\n        }\n      }\n    "
): (typeof documents)["\n      mutation CustomerUploadCreation(\n        $companyID: ID!\n        $customerID: ID!\n        $files: [UploadRequest!]!\n      ) {\n        customerUpload(\n          companyID: $companyID\n          customerID: $customerID\n          files: $files\n        ) {\n          files {\n            url\n            name\n          }\n          expiration\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation EnvelopeCreation(\n        $companyID: ID!\n        $customerID: ID!\n        $input: EnvelopeCreation!\n        $notificationRequests: [NotificationRequest!]\n        $addParagraphs: Boolean\n      ) {\n        envelopeCreation(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n          notificationRequests: $notificationRequests\n          addParagraphs: $addParagraphs\n        ) {\n          id\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation EnvelopeCreation(\n        $companyID: ID!\n        $customerID: ID!\n        $input: EnvelopeCreation!\n        $notificationRequests: [NotificationRequest!]\n        $addParagraphs: Boolean\n      ) {\n        envelopeCreation(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n          notificationRequests: $notificationRequests\n          addParagraphs: $addParagraphs\n        ) {\n          id\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation EnvelopeAffectation(\n        $companyID: ID!\n        $customerID: ID!\n        $envelopeID: ID!\n        $campaignID: ID!\n      ) {\n        envelopeAffectation(\n          companyID: $companyID\n          customerID: $customerID\n          envelopeID: $envelopeID\n          campaignID: $campaignID\n        ) {\n          id\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation EnvelopeAffectation(\n        $companyID: ID!\n        $customerID: ID!\n        $envelopeID: ID!\n        $campaignID: ID!\n      ) {\n        envelopeAffectation(\n          companyID: $companyID\n          customerID: $customerID\n          envelopeID: $envelopeID\n          campaignID: $campaignID\n        ) {\n          id\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation NotifyDocumentStatus(\n        $documentID: ID!\n        $requests: [NotificationRequest!]!\n      ) {\n        notifyDocumentStatus(documentID: $documentID, requests: $requests) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation NotifyDocumentStatus(\n        $documentID: ID!\n        $requests: [NotificationRequest!]!\n      ) {\n        notifyDocumentStatus(documentID: $documentID, requests: $requests) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation InvestorProfileUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: InvestorProfile!\n      ) {\n        investorProfileUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    "
): (typeof documents)["\n      mutation InvestorProfileUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: InvestorProfile!\n      ) {\n        investorProfileUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation DocumentDeletion(\n        $companyID: ID!\n        $customerID: ID!\n        $documentID: [ID!]!\n      ) {\n        documentDeletion(\n          companyID: $companyID\n          customerID: $customerID\n          documentID: $documentID\n        )\n      }\n    "
): (typeof documents)["\n      mutation DocumentDeletion(\n        $companyID: ID!\n        $customerID: ID!\n        $documentID: [ID!]!\n      ) {\n        documentDeletion(\n          companyID: $companyID\n          customerID: $customerID\n          documentID: $documentID\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation DocumentUpdate(\n        $id: ID!\n        $companyID: ID!\n        $update: DocumentUpdate\n      ) {\n        documentUpdate(id: $id, companyID: $companyID, update: $update) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation DocumentUpdate(\n        $id: ID!\n        $companyID: ID!\n        $update: DocumentUpdate\n      ) {\n        documentUpdate(id: $id, companyID: $companyID, update: $update) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation InvestorProfileFormUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: InvestorProfileForm!\n      ) {\n        investorProfileFormUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    "
): (typeof documents)["\n      mutation InvestorProfileFormUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: InvestorProfileForm!\n      ) {\n        investorProfileFormUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation RequestFormFilling(\n        $companyID: ID!\n        $customerID: ID!\n        $form: Form!\n      ) {\n        requestFormFilling(\n          companyID: $companyID\n          customerID: $customerID\n          form: $form\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation RequestFormFilling(\n        $companyID: ID!\n        $customerID: ID!\n        $form: Form!\n      ) {\n        requestFormFilling(\n          companyID: $companyID\n          customerID: $customerID\n          form: $form\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation SendToSign($companyID: ID!, $customerID: ID!, $form: Form!) {\n        sendToSign(\n          companyID: $companyID\n          customerID: $customerID\n          form: $form\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation SendToSign($companyID: ID!, $customerID: ID!, $form: Form!) {\n        sendToSign(\n          companyID: $companyID\n          customerID: $customerID\n          form: $form\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation ConvertDocumentToPdf(\n        $companyID: ID!\n        $customerID: ID!\n        $fileUrl: String!\n      ) {\n        convertDocumentToPdf(\n          companyID: $companyID\n          customerID: $customerID\n          fileUrl: $fileUrl\n        )\n      }\n    "
): (typeof documents)["\n      mutation ConvertDocumentToPdf(\n        $companyID: ID!\n        $customerID: ID!\n        $fileUrl: String!\n      ) {\n        convertDocumentToPdf(\n          companyID: $companyID\n          customerID: $customerID\n          fileUrl: $fileUrl\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query EnvelopeURL($id: ID!, $companyURL: Boolean!, $customerID: ID!) {\n        envelope(id: $id) {\n          companyURL @include(if: $companyURL)\n          customerURL(customerID: $customerID) @skip(if: $companyURL)\n        }\n      }\n    "
): (typeof documents)["\n      query EnvelopeURL($id: ID!, $companyURL: Boolean!, $customerID: ID!) {\n        envelope(id: $id) {\n          companyURL @include(if: $companyURL)\n          customerURL(customerID: $customerID) @skip(if: $companyURL)\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query EnvelopeList($companyID: ID!, $customerID: ID!) {\n        envelopeList(companyID: $companyID, customerID: $customerID) {\n          name\n          id\n          created\n          treatement: conformity\n          documents: documentList {\n            id\n            created\n            name\n            url\n            expiration\n            extension\n            category {\n              key\n              name\n            }\n            notes\n            treatement\n            signature {\n              digital\n              signatories\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query EnvelopeList($companyID: ID!, $customerID: ID!) {\n        envelopeList(companyID: $companyID, customerID: $customerID) {\n          name\n          id\n          created\n          treatement: conformity\n          documents: documentList {\n            id\n            created\n            name\n            url\n            expiration\n            extension\n            category {\n              key\n              name\n            }\n            notes\n            treatement\n            signature {\n              digital\n              signatories\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation EnvelopeDeletion(\n        $companyID: ID!\n        $customerID: ID!\n        $envelopeID: ID!\n      ) {\n        envelopeDeletion(\n          companyID: $companyID\n          customerID: $customerID\n          envelopeID: $envelopeID\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation EnvelopeDeletion(\n        $companyID: ID!\n        $customerID: ID!\n        $envelopeID: ID!\n      ) {\n        envelopeDeletion(\n          companyID: $companyID\n          customerID: $customerID\n          envelopeID: $envelopeID\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation EnvelopeUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: EnvelopeAccess!\n      ) {\n        envelopeUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation EnvelopeUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: EnvelopeAccess!\n      ) {\n        envelopeUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query EnvelopeListOnly($companyID: ID!, $customerID: ID!) {\n        envelopeList(companyID: $companyID, customerID: $customerID) {\n          name\n          id\n          created\n          treatement: conformity\n        }\n      }\n    "
): (typeof documents)["\n      query EnvelopeListOnly($companyID: ID!, $customerID: ID!) {\n        envelopeList(companyID: $companyID, customerID: $customerID) {\n          name\n          id\n          created\n          treatement: conformity\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query EnvelopeCategoryDocumentsList($id: ID!) {\n        envelope(id: $id) {\n          documentList {\n            id\n            name\n            created\n            treatement\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query EnvelopeCategoryDocumentsList($id: ID!) {\n        envelope(id: $id) {\n          documentList {\n            id\n            name\n            created\n            treatement\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation DocumentCategoryCreation(\n        $companyID: ID!\n        $name: String!\n        $customerVisibility: Boolean!\n      ) {\n        documentCategoryCreation(\n          companyID: $companyID\n          name: $name\n          customerVisibility: $customerVisibility\n        ) {\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation DocumentCategoryCreation(\n        $companyID: ID!\n        $name: String!\n        $customerVisibility: Boolean!\n      ) {\n        documentCategoryCreation(\n          companyID: $companyID\n          name: $name\n          customerVisibility: $customerVisibility\n        ) {\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query GedDocumentCategoryList($companyID: ID!, $customerID: ID!) {\n        documentCategoryList(companyID: $companyID) {\n          key\n          name\n          documents(companyID: $companyID, customerID: $customerID) {\n            id\n            name\n            envelope {\n              name\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query GedDocumentCategoryList($companyID: ID!, $customerID: ID!) {\n        documentCategoryList(companyID: $companyID) {\n          key\n          name\n          documents(companyID: $companyID, customerID: $customerID) {\n            id\n            name\n            envelope {\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation DocumentAdd(\n        $companyID: ID!\n        $customerID: ID!\n        $input: DocumentAdd!\n      ) {\n        documentAdd(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation DocumentAdd(\n        $companyID: ID!\n        $customerID: ID!\n        $input: DocumentAdd!\n      ) {\n        documentAdd(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation DocumentCategoryUpdate(\n        $companyID: ID!\n        $key: String!\n        $updatedName: String!\n        $customerVisibility: Boolean!\n      ) {\n        documentCategoryUpdate(\n          companyID: $companyID\n          key: $key\n          updatedName: $updatedName\n          customerVisibility: $customerVisibility\n        ) {\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation DocumentCategoryUpdate(\n        $companyID: ID!\n        $key: String!\n        $updatedName: String!\n        $customerVisibility: Boolean!\n      ) {\n        documentCategoryUpdate(\n          companyID: $companyID\n          key: $key\n          updatedName: $updatedName\n          customerVisibility: $customerVisibility\n        ) {\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation DocumentCategoryDeletion($companyID: ID!, $key: String!) {\n        documentCategoryDeletion(companyID: $companyID, key: $key) {\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation DocumentCategoryDeletion($companyID: ID!, $key: String!) {\n        documentCategoryDeletion(companyID: $companyID, key: $key) {\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query documentList(\n        $companyID: ID!\n        $customerID: ID!\n        $categories: [String!]\n      ) {\n        documentList(\n          companyID: $companyID\n          customerID: $customerID\n          categories: $categories\n        ) {\n          name\n          created\n        }\n      }\n    "
): (typeof documents)["\n      query documentList(\n        $companyID: ID!\n        $customerID: ID!\n        $categories: [String!]\n      ) {\n        documentList(\n          companyID: $companyID\n          customerID: $customerID\n          categories: $categories\n        ) {\n          name\n          created\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query DocumentCategoryListOnly($companyID: ID!) {\n        documentCategoryList(companyID: $companyID) {\n          key\n          name\n          customerVisibility\n        }\n      }\n    "
): (typeof documents)["\n      query DocumentCategoryListOnly($companyID: ID!) {\n        documentCategoryList(companyID: $companyID) {\n          key\n          name\n          customerVisibility\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CategoryDocumentsList(\n        $companyID: ID!\n        $customerID: ID!\n        $categoryKey: String!\n      ) {\n        documentCategory(companyID: $companyID, categoryKey: $categoryKey) {\n          documents(companyID: $companyID, customerID: $customerID) {\n            id\n            name\n            created\n            treatement\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query CategoryDocumentsList(\n        $companyID: ID!\n        $customerID: ID!\n        $categoryKey: String!\n      ) {\n        documentCategory(companyID: $companyID, categoryKey: $categoryKey) {\n          documents(companyID: $companyID, customerID: $customerID) {\n            id\n            name\n            created\n            treatement\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query DocumentInfo($companyID: ID!, $customerID: ID!, $id: ID!) {\n        document(companyID: $companyID, customerID: $customerID, id: $id) {\n          id\n          created\n          name\n          expiration\n          category {\n            key\n            name\n          }\n          treatement\n          notes\n          extension\n          signature {\n            signed\n            validated\n            digital\n            customer\n            manager\n            signatories\n          }\n          envelope {\n            id\n            name\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query DocumentInfo($companyID: ID!, $customerID: ID!, $id: ID!) {\n        document(companyID: $companyID, customerID: $customerID, id: $id) {\n          id\n          created\n          name\n          expiration\n          category {\n            key\n            name\n          }\n          treatement\n          notes\n          extension\n          signature {\n            signed\n            validated\n            digital\n            customer\n            manager\n            signatories\n          }\n          envelope {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query DocumentUrl($companyID: ID!, $customerID: ID!, $id: ID!) {\n        document(companyID: $companyID, customerID: $customerID, id: $id) {\n          url\n        }\n      }\n    "
): (typeof documents)["\n      query DocumentUrl($companyID: ID!, $customerID: ID!, $id: ID!) {\n        document(companyID: $companyID, customerID: $customerID, id: $id) {\n          url\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query Customers($companyID: ID!, $input: CustomersInput) {\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                lastName\n                firstName\n                email\n                type\n                plan\n                phoneNumber\n                hasB2CAccount\n                informations {\n                  details\n                  general\n                }\n                wealth(companyID: $companyID)\n                conformity(companyID: $companyID)\n                manager(companyID: $companyID) {\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query Customers($companyID: ID!, $input: CustomersInput) {\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                lastName\n                firstName\n                email\n                type\n                plan\n                phoneNumber\n                hasB2CAccount\n                informations {\n                  details\n                  general\n                }\n                wealth(companyID: $companyID)\n                conformity(companyID: $companyID)\n                manager(companyID: $companyID) {\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerDetails($companyID: ID!) {\n        company(id: $companyID) {\n          wealth\n        }\n        customerDetails(companyID: $companyID) {\n          count\n          managedWealth\n          averageWealth\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerDetails($companyID: ID!) {\n        company(id: $companyID) {\n          wealth\n        }\n        customerDetails(companyID: $companyID) {\n          count\n          managedWealth\n          averageWealth\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation exportCustomerList($companyID: ID!, $input: CustomersInput!) {\n        url: exportCustomerList(companyID: $companyID, input: $input)\n      }\n    "
): (typeof documents)["\n      mutation exportCustomerList($companyID: ID!, $input: CustomersInput!) {\n        url: exportCustomerList(companyID: $companyID, input: $input)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerDetailsUpdate(\n        $companyID: ID!\n        $input: CustomerDetailsUpdateInput!\n      ) {\n        customerDetailsUpdate(companyID: $companyID, input: $input) {\n          count\n        }\n      }\n    "
): (typeof documents)["\n      mutation CustomerDetailsUpdate(\n        $companyID: ID!\n        $input: CustomerDetailsUpdateInput!\n      ) {\n        customerDetailsUpdate(companyID: $companyID, input: $input) {\n          count\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerDeletion($companyID: ID!, $customerID: ID!) {\n        customerDeletion(companyID: $companyID, customerID: $customerID)\n      }\n    "
): (typeof documents)["\n      mutation CustomerDeletion($companyID: ID!, $customerID: ID!) {\n        customerDeletion(companyID: $companyID, customerID: $customerID)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerManager($id: ID!, $companyID: ID!) {\n        customer(id: $id, companyID: $companyID) {\n          manager(companyID: $companyID) {\n            id\n            name\n            email\n            phone\n            providerCode\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerManager($id: ID!, $companyID: ID!) {\n        customer(id: $id, companyID: $companyID) {\n          manager(companyID: $companyID) {\n            id\n            name\n            email\n            phone\n            providerCode\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerFiscality($customerID: ID!, $companyID: ID!, $year: Int!) {\n        customer(id: $customerID, companyID: $companyID) {\n          fiscality(year: $year)\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerFiscality($customerID: ID!, $companyID: ID!, $year: Int!) {\n        customer(id: $customerID, companyID: $companyID) {\n          fiscality(year: $year)\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation UpdateFiscality(\n        $companyID: ID!\n        $customerID: ID!\n        $input: FiscalityInformations!\n        $year: Int!\n      ) {\n        customerFiscality(\n          companyID: $companyID\n          id: $customerID\n          input: $input\n          year: $year\n        )\n      }\n    "
): (typeof documents)["\n      mutation UpdateFiscality(\n        $companyID: ID!\n        $customerID: ID!\n        $input: FiscalityInformations!\n        $year: Int!\n      ) {\n        customerFiscality(\n          companyID: $companyID\n          id: $customerID\n          input: $input\n          year: $year\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query listNote($companyID: ID!, $customerID: ID!) {\n        listNote(companyID: $companyID, customerID: $customerID) {\n          id\n          content\n          created\n          updated\n        }\n      }\n    "
): (typeof documents)["\n      query listNote($companyID: ID!, $customerID: ID!) {\n        listNote(companyID: $companyID, customerID: $customerID) {\n          id\n          content\n          created\n          updated\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation exportNotes($companyID: ID!, $customerID: ID!) {\n        url: exportNotes(companyID: $companyID, customerID: $customerID)\n      }\n    "
): (typeof documents)["\n      mutation exportNotes($companyID: ID!, $customerID: ID!) {\n        url: exportNotes(companyID: $companyID, customerID: $customerID)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation deleteNote($noteId: ID!) {\n        deleteNote(noteId: $noteId) {\n          id\n          content\n          created\n          updated\n        }\n      }\n    "
): (typeof documents)["\n      mutation deleteNote($noteId: ID!) {\n        deleteNote(noteId: $noteId) {\n          id\n          content\n          created\n          updated\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation createNote(\n        $companyID: ID!\n        $customerID: ID!\n        $content: String!\n      ) {\n        createNote(\n          companyID: $companyID\n          customerID: $customerID\n          content: $content\n        ) {\n          id\n          content\n          created\n          updated\n        }\n      }\n    "
): (typeof documents)["\n      mutation createNote(\n        $companyID: ID!\n        $customerID: ID!\n        $content: String!\n      ) {\n        createNote(\n          companyID: $companyID\n          customerID: $customerID\n          content: $content\n        ) {\n          id\n          content\n          created\n          updated\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation updateNote($noteId: ID!, $content: String!) {\n        updateNote(noteId: $noteId, content: $content) {\n          id\n          content\n          created\n          updated\n        }\n      }\n    "
): (typeof documents)["\n      mutation updateNote($noteId: ID!, $content: String!) {\n        updateNote(noteId: $noteId, content: $content) {\n          id\n          content\n          created\n          updated\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query conformityStatus($companyID: ID!, $customerID: ID!) {\n        conformityStatus(companyID: $companyID, customerID: $customerID) {\n          conformityId\n          engagementLetter {\n            date\n            status\n            info\n            documentId\n          }\n          officialDocuments {\n            date\n            status\n            info\n          }\n          informationCollections {\n            date\n            status\n            info\n          }\n          investorProfile {\n            date\n            status\n            info\n            documentId\n          }\n          LCB {\n            date\n            status\n            info\n          }\n          DER {\n            date\n            status\n            info\n            documentId\n          }\n          objectivesHeritage {\n            date\n            status\n            info\n            documentId\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query conformityStatus($companyID: ID!, $customerID: ID!) {\n        conformityStatus(companyID: $companyID, customerID: $customerID) {\n          conformityId\n          engagementLetter {\n            date\n            status\n            info\n            documentId\n          }\n          officialDocuments {\n            date\n            status\n            info\n          }\n          informationCollections {\n            date\n            status\n            info\n          }\n          investorProfile {\n            date\n            status\n            info\n            documentId\n          }\n          LCB {\n            date\n            status\n            info\n          }\n          DER {\n            date\n            status\n            info\n            documentId\n          }\n          objectivesHeritage {\n            date\n            status\n            info\n            documentId\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation addDocumentToConformity(\n        $companyID: ID!\n        $customerID: ID!\n        $conformityID: ID\n        $input: DocumentToConformityInput!\n      ) {\n        addDocumentToConformity(\n          companyID: $companyID\n          customerID: $customerID\n          conformityID: $conformityID\n          input: $input\n        ) {\n          conformityId\n          engagementLetter {\n            date\n            status\n            info\n          }\n          officialDocuments {\n            date\n            status\n            info\n          }\n          informationCollections {\n            date\n            status\n            info\n          }\n          investorProfile {\n            date\n            status\n            info\n          }\n          LCB {\n            date\n            status\n            info\n          }\n          DER {\n            date\n            status\n            info\n          }\n        }\n      }\n    "
): (typeof documents)["\n      mutation addDocumentToConformity(\n        $companyID: ID!\n        $customerID: ID!\n        $conformityID: ID\n        $input: DocumentToConformityInput!\n      ) {\n        addDocumentToConformity(\n          companyID: $companyID\n          customerID: $customerID\n          conformityID: $conformityID\n          input: $input\n        ) {\n          conformityId\n          engagementLetter {\n            date\n            status\n            info\n          }\n          officialDocuments {\n            date\n            status\n            info\n          }\n          informationCollections {\n            date\n            status\n            info\n          }\n          investorProfile {\n            date\n            status\n            info\n          }\n          LCB {\n            date\n            status\n            info\n          }\n          DER {\n            date\n            status\n            info\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query listCustomerTask($companyID: ID!, $customerID: ID!) {\n        listCustomerTask(companyID: $companyID, customerID: $customerID) {\n          id\n          title\n          category\n          contractNumber\n          content\n          updated\n          schedule\n          created\n          completed\n          customer {\n            id\n            name\n          }\n          company {\n            id\n            name\n          }\n          assigned_manager {\n            id\n            name\n          }\n          entityRelatedId\n          entityRelatedType\n        }\n      }\n    "
): (typeof documents)["\n      query listCustomerTask($companyID: ID!, $customerID: ID!) {\n        listCustomerTask(companyID: $companyID, customerID: $customerID) {\n          id\n          title\n          category\n          contractNumber\n          content\n          updated\n          schedule\n          created\n          completed\n          customer {\n            id\n            name\n          }\n          company {\n            id\n            name\n          }\n          assigned_manager {\n            id\n            name\n          }\n          entityRelatedId\n          entityRelatedType\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ListCompanyTaskByType($companyID: ID!, $filter: CompanyTaskFilter) {\n        listCompanyTaskByType(companyID: $companyID, filter: $filter) {\n          categories {\n            type\n            count\n            tasks {\n              id\n              title\n              category\n              contractNumber\n              content\n              updated\n              schedule\n              created\n              completed\n              customer {\n                id\n                name\n              }\n              company {\n                id\n                name\n              }\n              assigned_manager {\n                id\n                name\n              }\n            }\n          }\n          managers {\n            type\n            count\n            tasks {\n              id\n              title\n              category\n              contractNumber\n              content\n              updated\n              schedule\n              created\n              completed\n              customer {\n                id\n                name\n              }\n              company {\n                id\n                name\n              }\n              assigned_manager {\n                id\n                name\n              }\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query ListCompanyTaskByType($companyID: ID!, $filter: CompanyTaskFilter) {\n        listCompanyTaskByType(companyID: $companyID, filter: $filter) {\n          categories {\n            type\n            count\n            tasks {\n              id\n              title\n              category\n              contractNumber\n              content\n              updated\n              schedule\n              created\n              completed\n              customer {\n                id\n                name\n              }\n              company {\n                id\n                name\n              }\n              assigned_manager {\n                id\n                name\n              }\n            }\n          }\n          managers {\n            type\n            count\n            tasks {\n              id\n              title\n              category\n              contractNumber\n              content\n              updated\n              schedule\n              created\n              completed\n              customer {\n                id\n                name\n              }\n              company {\n                id\n                name\n              }\n              assigned_manager {\n                id\n                name\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query Task($id: ID!, $companyID: ID!) {\n        fetchSingleTask(id: $id, companyID: $companyID) {\n          id\n          title\n          category\n          contractNumber\n          content\n          updated\n          schedule\n          created\n          completed\n          customer {\n            id\n            name\n          }\n          company {\n            id\n            name\n          }\n          assigned_manager {\n            id\n            name\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query Task($id: ID!, $companyID: ID!) {\n        fetchSingleTask(id: $id, companyID: $companyID) {\n          id\n          title\n          category\n          contractNumber\n          content\n          updated\n          schedule\n          created\n          completed\n          customer {\n            id\n            name\n          }\n          company {\n            id\n            name\n          }\n          assigned_manager {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CompanyTaskSearch($companyID: ID!, $filter: CompanyTaskFilter) {\n        companyTaskSearch(companyID: $companyID, filter: $filter) {\n          count\n          tasks {\n            id\n            title\n            category\n            contractNumber\n            content\n            updated\n            schedule\n            created\n            completed\n            managerName\n            customerName\n            customerId\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query CompanyTaskSearch($companyID: ID!, $filter: CompanyTaskFilter) {\n        companyTaskSearch(companyID: $companyID, filter: $filter) {\n          count\n          tasks {\n            id\n            title\n            category\n            contractNumber\n            content\n            updated\n            schedule\n            created\n            completed\n            managerName\n            customerName\n            customerId\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CompanyTaskCountByStatus(\n        $companyID: ID!\n        $filter: CompanyTaskFilter\n      ) {\n        companyTaskCountByStatus(companyID: $companyID, filter: $filter) {\n          status\n          count\n        }\n      }\n    "
): (typeof documents)["\n      query CompanyTaskCountByStatus(\n        $companyID: ID!\n        $filter: CompanyTaskFilter\n      ) {\n        companyTaskCountByStatus(companyID: $companyID, filter: $filter) {\n          status\n          count\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CompanyTaskCountByCategories(\n        $companyID: ID!\n        $filter: CompanyTaskFilter\n      ) {\n        companyTaskCountByCategories(companyID: $companyID, filter: $filter) {\n          category\n          count\n        }\n      }\n    "
): (typeof documents)["\n      query CompanyTaskCountByCategories(\n        $companyID: ID!\n        $filter: CompanyTaskFilter\n      ) {\n        companyTaskCountByCategories(companyID: $companyID, filter: $filter) {\n          category\n          count\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CompanyTaskCountByManagers(\n        $companyID: ID!\n        $filter: CompanyTaskFilter\n      ) {\n        companyTaskCountByManagers(companyID: $companyID, filter: $filter) {\n          id\n          name\n          count\n        }\n      }\n    "
): (typeof documents)["\n      query CompanyTaskCountByManagers(\n        $companyID: ID!\n        $filter: CompanyTaskFilter\n      ) {\n        companyTaskCountByManagers(companyID: $companyID, filter: $filter) {\n          id\n          name\n          count\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query TaskCategoryList($companyID: ID!) {\n        taskCategoryList(companyID: $companyID) {\n          key\n          name\n          default\n        }\n      }\n    "
): (typeof documents)["\n      query TaskCategoryList($companyID: ID!) {\n        taskCategoryList(companyID: $companyID) {\n          key\n          name\n          default\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CreateTaskCategory($companyID: ID!, $input: TaskCategoryInput!) {\n        createTaskCategory(companyID: $companyID, input: $input) {\n          key\n          name\n          default\n        }\n      }\n    "
): (typeof documents)["\n      mutation CreateTaskCategory($companyID: ID!, $input: TaskCategoryInput!) {\n        createTaskCategory(companyID: $companyID, input: $input) {\n          key\n          name\n          default\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query AssetsAccountNumbers($companyID: ID!, $customerID: ID!) {\n        accountNumbers: assetsAccountNumbers(\n          companyID: $companyID\n          customerID: $customerID\n        ) {\n          value\n          label\n        }\n      }\n    "
): (typeof documents)["\n      query AssetsAccountNumbers($companyID: ID!, $customerID: ID!) {\n        accountNumbers: assetsAccountNumbers(\n          companyID: $companyID\n          customerID: $customerID\n        ) {\n          value\n          label\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomersList($companyID: ID!, $input: CustomersInput) {\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                lastName\n                firstName\n              }\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query CustomersList($companyID: ID!, $input: CustomersInput) {\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                lastName\n                firstName\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation exportTasks($companyID: ID!, $customerID: ID) {\n        url: exportTasks(companyID: $companyID, customerID: $customerID)\n      }\n    "
): (typeof documents)["\n      mutation exportTasks($companyID: ID!, $customerID: ID) {\n        url: exportTasks(companyID: $companyID, customerID: $customerID)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation completedTask($taskId: ID!) {\n        completedTask(taskId: $taskId) {\n          id\n          content\n          updated\n          schedule\n          created\n          completed\n        }\n      }\n    "
): (typeof documents)["\n      mutation completedTask($taskId: ID!) {\n        completedTask(taskId: $taskId) {\n          id\n          content\n          updated\n          schedule\n          created\n          completed\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation createTask(\n        $companyID: ID!\n        $customerID: ID!\n        $input: TaskInput!\n      ) {\n        createTask(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        ) {\n          id\n          title\n          category\n          contractNumber\n          content\n          updated\n          schedule\n          created\n          completed\n        }\n      }\n    "
): (typeof documents)["\n      mutation createTask(\n        $companyID: ID!\n        $customerID: ID!\n        $input: TaskInput!\n      ) {\n        createTask(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        ) {\n          id\n          title\n          category\n          contractNumber\n          content\n          updated\n          schedule\n          created\n          completed\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation updateTask($taskId: ID!, $companyID: ID!, $input: TaskInput!) {\n        updateTask(taskId: $taskId, companyID: $companyID, input: $input) {\n          id\n          title\n          category\n          contractNumber\n          content\n          created\n          updated\n        }\n      }\n    "
): (typeof documents)["\n      mutation updateTask($taskId: ID!, $companyID: ID!, $input: TaskInput!) {\n        updateTask(taskId: $taskId, companyID: $companyID, input: $input) {\n          id\n          title\n          category\n          contractNumber\n          content\n          created\n          updated\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerWidgetWealth(\n        $id: ID!\n        $companyID: ID!\n        $financialIgnoredGroup: [AssetGroup!]\n        $passiveIgnoredGroup: [AssetGroup!]\n        $nonFinancialIgnoredGroup: [AssetGroup!]\n        $othersIgnoredGroup: [AssetGroup!]\n        $totalIgnoredGroup: [AssetGroup!]\n        $start: DateTime\n        $end: DateTime\n      ) {\n        customer(id: $id, companyID: $companyID) {\n          totalWealth: wealth(\n            companyID: $companyID\n            ignoring: $totalIgnoredGroup\n          )\n\n          financialWealth: wealth(\n            companyID: $companyID\n            ignoring: $financialIgnoredGroup\n          )\n          financialPerformance: performance(\n            ignoring: $financialIgnoredGroup\n            companyID: $companyID\n            start: $start\n            end: $end\n          ) {\n            gain\n            evolution\n          }\n\n          nonFinancialWealth: wealth(\n            companyID: $companyID\n            ignoring: $nonFinancialIgnoredGroup\n          )\n          nonFinancialPerformance: performance(\n            ignoring: $nonFinancialIgnoredGroup\n            companyID: $companyID\n            start: $start\n            end: $end\n          ) {\n            gain\n            evolution\n          }\n\n          othersWealth: wealth(\n            companyID: $companyID\n            ignoring: $othersIgnoredGroup\n          )\n\n          passiveWealth: wealth(\n            companyID: $companyID\n            ignoring: $passiveIgnoredGroup\n          )\n\n          underManagement: wealth(\n            companyID: $companyID\n            computing: under_managements\n          )\n          underManagementPerformance: performance(\n            companyID: $companyID\n            start: $start\n            end: $end\n            computing: under_managements\n          ) {\n            gain\n            evolution\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerWidgetWealth(\n        $id: ID!\n        $companyID: ID!\n        $financialIgnoredGroup: [AssetGroup!]\n        $passiveIgnoredGroup: [AssetGroup!]\n        $nonFinancialIgnoredGroup: [AssetGroup!]\n        $othersIgnoredGroup: [AssetGroup!]\n        $totalIgnoredGroup: [AssetGroup!]\n        $start: DateTime\n        $end: DateTime\n      ) {\n        customer(id: $id, companyID: $companyID) {\n          totalWealth: wealth(\n            companyID: $companyID\n            ignoring: $totalIgnoredGroup\n          )\n\n          financialWealth: wealth(\n            companyID: $companyID\n            ignoring: $financialIgnoredGroup\n          )\n          financialPerformance: performance(\n            ignoring: $financialIgnoredGroup\n            companyID: $companyID\n            start: $start\n            end: $end\n          ) {\n            gain\n            evolution\n          }\n\n          nonFinancialWealth: wealth(\n            companyID: $companyID\n            ignoring: $nonFinancialIgnoredGroup\n          )\n          nonFinancialPerformance: performance(\n            ignoring: $nonFinancialIgnoredGroup\n            companyID: $companyID\n            start: $start\n            end: $end\n          ) {\n            gain\n            evolution\n          }\n\n          othersWealth: wealth(\n            companyID: $companyID\n            ignoring: $othersIgnoredGroup\n          )\n\n          passiveWealth: wealth(\n            companyID: $companyID\n            ignoring: $passiveIgnoredGroup\n          )\n\n          underManagement: wealth(\n            companyID: $companyID\n            computing: under_managements\n          )\n          underManagementPerformance: performance(\n            companyID: $companyID\n            start: $start\n            end: $end\n            computing: under_managements\n          ) {\n            gain\n            evolution\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerInformations($customerID: ID!, $companyID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          name\n          email\n          phoneNumber\n          plan\n          type\n          tag\n          informations {\n            details\n            general\n          }\n          hasB2CAccount\n          pendingInvitations {\n            id\n            code\n            created\n            email\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerInformations($customerID: ID!, $companyID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          name\n          email\n          phoneNumber\n          plan\n          type\n          tag\n          informations {\n            details\n            general\n          }\n          hasB2CAccount\n          pendingInvitations {\n            id\n            code\n            created\n            email\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerInformationsFullFields($customerID: ID!, $companyID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          name\n          firstName\n          lastName\n          email\n          phoneNumber\n          plan\n          type\n          tag\n          investorProfile\n          informations {\n            details\n            general\n            lcbLab\n          }\n          hasB2CAccount\n          pendingInvitations {\n            id\n            code\n            created\n            email\n          }\n        }\n        investorProfileForm(companyID: $companyID, customerID: $customerID)\n      }\n    "
): (typeof documents)["\n      query CustomerInformationsFullFields($customerID: ID!, $companyID: ID!) {\n        customer(id: $customerID, companyID: $companyID) {\n          name\n          firstName\n          lastName\n          email\n          phoneNumber\n          plan\n          type\n          tag\n          investorProfile\n          informations {\n            details\n            general\n            lcbLab\n          }\n          hasB2CAccount\n          pendingInvitations {\n            id\n            code\n            created\n            email\n          }\n        }\n        investorProfileForm(companyID: $companyID, customerID: $customerID)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query HoldingQueries($companyID: ID!, $customerId: ID!) {\n        holdingList(companyID: $companyID, customerId: $customerId) {\n          id\n          name\n          form\n          companies {\n            id\n            name\n            # form\n            ownerName\n            created\n          }\n        }\n        businessList(companyID: $companyID, customerId: $customerId) {\n          id\n          name\n          informations {\n            general\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query HoldingQueries($companyID: ID!, $customerId: ID!) {\n        holdingList(companyID: $companyID, customerId: $customerId) {\n          id\n          name\n          form\n          companies {\n            id\n            name\n            # form\n            ownerName\n            created\n          }\n        }\n        businessList(companyID: $companyID, customerId: $customerId) {\n          id\n          name\n          informations {\n            general\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query HoldingList($companyID: ID!, $customerId: ID!) {\n        holdingList(companyID: $companyID, customerId: $customerId) {\n          id\n          name\n          form\n          companies {\n            id\n            name\n            # form\n            ownerName\n            created\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query HoldingList($companyID: ID!, $customerId: ID!) {\n        holdingList(companyID: $companyID, customerId: $customerId) {\n          id\n          name\n          form\n          companies {\n            id\n            name\n            # form\n            ownerName\n            created\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query BusinessList($companyID: ID!, $customerId: ID!) {\n        businessList(companyID: $companyID, customerId: $customerId) {\n          id\n          name\n          informations {\n            general\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query BusinessList($companyID: ID!, $customerId: ID!) {\n        businessList(companyID: $companyID, customerId: $customerId) {\n          id\n          name\n          informations {\n            general\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation UpdateCustomerInformationsGeneral(\n        $companyID: ID!\n        $customerID: ID!\n        $input: GeneralInformations!\n      ) {\n        customerInformationsGeneral(\n          companyID: $companyID\n          id: $customerID\n          input: $input\n        )\n      }\n    "
): (typeof documents)["\n      mutation UpdateCustomerInformationsGeneral(\n        $companyID: ID!\n        $customerID: ID!\n        $input: GeneralInformations!\n      ) {\n        customerInformationsGeneral(\n          companyID: $companyID\n          id: $customerID\n          input: $input\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation customerReferencesAccessUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $values: [ReferenceAccessValue!]!\n      ) {\n        customerReferencesAccessUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          values: $values\n        ) {\n          manager {\n            id\n            name\n          }\n          primary\n          customer {\n            id\n            name\n            email\n          }\n        }\n      }\n    "
): (typeof documents)["\n      mutation customerReferencesAccessUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $values: [ReferenceAccessValue!]!\n      ) {\n        customerReferencesAccessUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          values: $values\n        ) {\n          manager {\n            id\n            name\n          }\n          primary\n          customer {\n            id\n            name\n            email\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation UpdateCustomerInformationsDetail(\n        $companyID: ID!\n        $customerID: ID!\n        $input: DetailsInformations!\n      ) {\n        customerInformationsDetail(\n          companyID: $companyID\n          id: $customerID\n          input: $input\n        )\n      }\n    "
): (typeof documents)["\n      mutation UpdateCustomerInformationsDetail(\n        $companyID: ID!\n        $customerID: ID!\n        $input: DetailsInformations!\n      ) {\n        customerInformationsDetail(\n          companyID: $companyID\n          id: $customerID\n          input: $input\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation HoldingCreation(\n        $companyID: ID!\n        $customerId: ID!\n        $name: String!\n        $input: HoldingForm!\n      ) {\n        holdingCreation(\n          companyID: $companyID\n          customerId: $customerId\n          name: $name\n          input: $input\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation HoldingCreation(\n        $companyID: ID!\n        $customerId: ID!\n        $name: String!\n        $input: HoldingForm!\n      ) {\n        holdingCreation(\n          companyID: $companyID\n          customerId: $customerId\n          name: $name\n          input: $input\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation HoldingUpdate(\n        $companyID: ID!\n        $id: ID!\n        $name: String!\n        $input: HoldingForm!\n      ) {\n        holdingUpdate(\n          companyID: $companyID\n          id: $id\n          name: $name\n          input: $input\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation HoldingUpdate(\n        $companyID: ID!\n        $id: ID!\n        $name: String!\n        $input: HoldingForm!\n      ) {\n        holdingUpdate(\n          companyID: $companyID\n          id: $id\n          name: $name\n          input: $input\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation HoldingDeletion($companyID: ID!, $IDs: [ID!]!) {\n        holdingDeletion(companyID: $companyID, IDs: $IDs) {\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation HoldingDeletion($companyID: ID!, $IDs: [ID!]!) {\n        holdingDeletion(companyID: $companyID, IDs: $IDs) {\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation AssignHoldingsToBusiness(\n        $companyID: ID!\n        $businessID: ID!\n        $customerId: ID!\n        $holdingIds: [ID!]!\n      ) {\n        assignHoldingsToBusiness(\n          companyID: $companyID\n          businessID: $businessID\n          customerId: $customerId\n          holdingIds: $holdingIds\n        ) {\n          id\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation AssignHoldingsToBusiness(\n        $companyID: ID!\n        $businessID: ID!\n        $customerId: ID!\n        $holdingIds: [ID!]!\n      ) {\n        assignHoldingsToBusiness(\n          companyID: $companyID\n          businessID: $businessID\n          customerId: $customerId\n          holdingIds: $holdingIds\n        ) {\n          id\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation BusinessCreate(\n        $companyID: ID!\n        $customerId: ID!\n        $input: HoldingCompanyInfo!\n      ) {\n        businessCreate(\n          companyID: $companyID\n          customerId: $customerId\n          input: $input\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation BusinessCreate(\n        $companyID: ID!\n        $customerId: ID!\n        $input: HoldingCompanyInfo!\n      ) {\n        businessCreate(\n          companyID: $companyID\n          customerId: $customerId\n          input: $input\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation BusinessUpdate(\n        $companyID: ID!\n        $id: ID!\n        $information: HoldingCompanyInfo\n        $managers: HoldingManagerSchema\n        $nbManagers: NbHoldingManagerSchema\n        $bankAccounts: CompanyFinancialSchema\n        $activities: CompanyActivitiesSchema\n        $tag: String\n      ) {\n        businessUpdate(\n          companyID: $companyID\n          id: $id\n          information: $information\n          managers: $managers\n          nbManagers: $nbManagers\n          bankAccounts: $bankAccounts\n          activities: $activities\n          tag: $tag\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation BusinessUpdate(\n        $companyID: ID!\n        $id: ID!\n        $information: HoldingCompanyInfo\n        $managers: HoldingManagerSchema\n        $nbManagers: NbHoldingManagerSchema\n        $bankAccounts: CompanyFinancialSchema\n        $activities: CompanyActivitiesSchema\n        $tag: String\n      ) {\n        businessUpdate(\n          companyID: $companyID\n          id: $id\n          information: $information\n          managers: $managers\n          nbManagers: $nbManagers\n          bankAccounts: $bankAccounts\n          activities: $activities\n          tag: $tag\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation BusinessDeletion($companyID: ID!, $IDs: [ID!]!) {\n        businessDeletion(companyID: $companyID, IDs: $IDs) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation BusinessDeletion($companyID: ID!, $IDs: [ID!]!) {\n        businessDeletion(companyID: $companyID, IDs: $IDs) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation createCustomerFromBusiness(\n        $companyID: ID!\n        $customerID: ID!\n        $businessID: ID!\n        $addToCustomerReference: Boolean\n      ) {\n        createCustomerFromBusiness(\n          companyID: $companyID\n          customerID: $customerID\n          businessID: $businessID\n          addToCustomerReference: $addToCustomerReference\n        )\n      }\n    "
): (typeof documents)["\n      mutation createCustomerFromBusiness(\n        $companyID: ID!\n        $customerID: ID!\n        $businessID: ID!\n        $addToCustomerReference: Boolean\n      ) {\n        createCustomerFromBusiness(\n          companyID: $companyID\n          customerID: $customerID\n          businessID: $businessID\n          addToCustomerReference: $addToCustomerReference\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerRelation($companyID: ID!, $customerID: ID!) {\n        customerRelation(companyID: $companyID, customerID: $customerID) {\n          list\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerRelation($companyID: ID!, $customerID: ID!) {\n        customerRelation(companyID: $companyID, customerID: $customerID) {\n          list\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerRelationCreate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: CustomerRelationForm!\n      ) {\n        customerRelationCreate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    "
): (typeof documents)["\n      mutation CustomerRelationCreate(\n        $companyID: ID!\n        $customerID: ID!\n        $input: CustomerRelationForm!\n      ) {\n        customerRelationCreate(\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerRelationUpdate(\n        $id: ID!\n        $companyID: ID!\n        $customerID: ID!\n        $input: CustomerRelationForm!\n      ) {\n        customerRelationUpdate(\n          id: $id\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    "
): (typeof documents)["\n      mutation CustomerRelationUpdate(\n        $id: ID!\n        $companyID: ID!\n        $customerID: ID!\n        $input: CustomerRelationForm!\n      ) {\n        customerRelationUpdate(\n          id: $id\n          companyID: $companyID\n          customerID: $customerID\n          input: $input\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CreateUserFromRelation(\n        $id: ID!\n        $companyID: ID!\n        $customerID: ID!\n        $addToCustomerReference: Boolean!\n      ) {\n        createUserFromRelation(\n          id: $id\n          companyID: $companyID\n          customerID: $customerID\n          addToCustomerReference: $addToCustomerReference\n        )\n      }\n    "
): (typeof documents)["\n      mutation CreateUserFromRelation(\n        $id: ID!\n        $companyID: ID!\n        $customerID: ID!\n        $addToCustomerReference: Boolean!\n      ) {\n        createUserFromRelation(\n          id: $id\n          companyID: $companyID\n          customerID: $customerID\n          addToCustomerReference: $addToCustomerReference\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CreateRelationFromExistingCustomer(\n        $companyID: ID!\n        $customerID: ID!\n        $existingCustomerID: ID!\n      ) {\n        createRelationFromExistingCustomer(\n          companyID: $companyID\n          customerID: $customerID\n          existingCustomerID: $existingCustomerID\n        ) {\n          id\n          firstName\n          lastName\n          email\n          informations {\n            details\n            general\n          }\n        }\n      }\n    "
): (typeof documents)["\n      mutation CreateRelationFromExistingCustomer(\n        $companyID: ID!\n        $customerID: ID!\n        $existingCustomerID: ID!\n      ) {\n        createRelationFromExistingCustomer(\n          companyID: $companyID\n          customerID: $customerID\n          existingCustomerID: $existingCustomerID\n        ) {\n          id\n          firstName\n          lastName\n          email\n          informations {\n            details\n            general\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation UnlinkFromCustomerReference($id: ID!, $companyID: ID!) {\n        unlinkFromCustomerReference(id: $id, companyID: $companyID)\n      }\n    "
): (typeof documents)["\n      mutation UnlinkFromCustomerReference($id: ID!, $companyID: ID!) {\n        unlinkFromCustomerReference(id: $id, companyID: $companyID)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerRelationDelete(\n        $companyID: ID!\n        $id: ID!\n        $customerID: ID!\n      ) {\n        customerRelationDelete(\n          companyID: $companyID\n          id: $id\n          customerID: $customerID\n        )\n      }\n    "
): (typeof documents)["\n      mutation CustomerRelationDelete(\n        $companyID: ID!\n        $id: ID!\n        $customerID: ID!\n      ) {\n        customerRelationDelete(\n          companyID: $companyID\n          id: $id\n          customerID: $customerID\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerRelations(\n        $companyID: ID!\n        $id: ID!\n        $input: CustomerRelationForm!\n      ) {\n        customerRelations(companyID: $companyID, id: $id, input: $input)\n      }\n    "
): (typeof documents)["\n      mutation CustomerRelations(\n        $companyID: ID!\n        $id: ID!\n        $input: CustomerRelationForm!\n      ) {\n        customerRelations(companyID: $companyID, id: $id, input: $input)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerManagerUpdate(\n        $customerID: ID!\n        $companyID: ID!\n        $providerCode: String\n        $managerID: ID\n      ) {\n        updateCustomerManager(\n          customerID: $customerID\n          companyID: $companyID\n          providerCode: $providerCode\n          managerID: $managerID\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation CustomerManagerUpdate(\n        $customerID: ID!\n        $companyID: ID!\n        $providerCode: String\n        $managerID: ID\n      ) {\n        updateCustomerManager(\n          customerID: $customerID\n          companyID: $companyID\n          providerCode: $providerCode\n          managerID: $managerID\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ContractList(\n        $filters: ContractFilters!\n        $pagination: Pagination!\n        $companyID: ID!\n      ) {\n        contractListing(\n          companyID: $companyID\n          filters: $filters\n          pagination: $pagination\n        ) {\n          totalCount\n          totalPages\n          contracts {\n            id\n            isSelected(companyID: $companyID)\n            name\n            type\n            insuranceCompany\n            intermediary\n            performance\n            accountUnits\n            managed\n            metadata(companyID: $companyID)\n            managedModes\n            fundsOrigin\n            minTransferAmount\n            maxTransferFees\n            arbitrageFees\n            yearlyFees\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query ContractList(\n        $filters: ContractFilters!\n        $pagination: Pagination!\n        $companyID: ID!\n      ) {\n        contractListing(\n          companyID: $companyID\n          filters: $filters\n          pagination: $pagination\n        ) {\n          totalCount\n          totalPages\n          contracts {\n            id\n            isSelected(companyID: $companyID)\n            name\n            type\n            insuranceCompany\n            intermediary\n            performance\n            accountUnits\n            managed\n            metadata(companyID: $companyID)\n            managedModes\n            fundsOrigin\n            minTransferAmount\n            maxTransferFees\n            arbitrageFees\n            yearlyFees\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ContractFilters {\n        contractFilters {\n          insuranceCompanies\n          types\n          managedModes\n          fundsOrigins\n        }\n      }\n    "
): (typeof documents)["\n      query ContractFilters {\n        contractFilters {\n          insuranceCompanies\n          types\n          managedModes\n          fundsOrigins\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation AutomaticContractCompare($input: CompareContract!) {\n        automaticContractCompare(input: $input) {\n          id\n          name\n          type\n          insuranceCompany\n          intermediary\n          performance\n          accountUnits\n          managed\n          managedModes\n          fundsOrigin\n          minTransferAmount\n          maxTransferFees\n          arbitrageFees\n          yearlyFees\n        }\n      }\n    "
): (typeof documents)["\n      mutation AutomaticContractCompare($input: CompareContract!) {\n        automaticContractCompare(input: $input) {\n          id\n          name\n          type\n          insuranceCompany\n          intermediary\n          performance\n          accountUnits\n          managed\n          managedModes\n          fundsOrigin\n          minTransferAmount\n          maxTransferFees\n          arbitrageFees\n          yearlyFees\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation linkContractToCompany($contractId: ID!, $companyId: ID!) {\n        linkContractToCompany(contractId: $contractId, companyId: $companyId) {\n          id\n          name\n          type\n          insuranceCompany\n          intermediary\n          performance\n          accountUnits\n          managed\n          managedModes\n          fundsOrigin\n          minTransferAmount\n          maxTransferFees\n          arbitrageFees\n          yearlyFees\n        }\n      }\n    "
): (typeof documents)["\n      mutation linkContractToCompany($contractId: ID!, $companyId: ID!) {\n        linkContractToCompany(contractId: $contractId, companyId: $companyId) {\n          id\n          name\n          type\n          insuranceCompany\n          intermediary\n          performance\n          accountUnits\n          managed\n          managedModes\n          fundsOrigin\n          minTransferAmount\n          maxTransferFees\n          arbitrageFees\n          yearlyFees\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation unlinkContractFromCompany($contractId: ID!, $companyId: ID!) {\n        unlinkContractFromCompany(\n          contractId: $contractId\n          companyId: $companyId\n        ) {\n          id\n          name\n          type\n          insuranceCompany\n          intermediary\n          performance\n          accountUnits\n          managed\n          managedModes\n          fundsOrigin\n          minTransferAmount\n          maxTransferFees\n          arbitrageFees\n          yearlyFees\n        }\n      }\n    "
): (typeof documents)["\n      mutation unlinkContractFromCompany($contractId: ID!, $companyId: ID!) {\n        unlinkContractFromCompany(\n          contractId: $contractId\n          companyId: $companyId\n        ) {\n          id\n          name\n          type\n          insuranceCompany\n          intermediary\n          performance\n          accountUnits\n          managed\n          managedModes\n          fundsOrigin\n          minTransferAmount\n          maxTransferFees\n          arbitrageFees\n          yearlyFees\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation UpdateFavoriteContractMetadata(\n        $contractID: ID!\n        $companyID: ID!\n        $input: FavoriteContractMetadata!\n      ) {\n        updateFavoriteContractMetadata(\n          companyID: $companyID\n          contractID: $contractID\n          input: $input\n        )\n      }\n    "
): (typeof documents)["\n      mutation UpdateFavoriteContractMetadata(\n        $contractID: ID!\n        $companyID: ID!\n        $input: FavoriteContractMetadata!\n      ) {\n        updateFavoriteContractMetadata(\n          companyID: $companyID\n          contractID: $contractID\n          input: $input\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query InstrumentsList(\n        $filters: FavoriteInstrumentsFilters!\n        $pagination: Pagination!\n      ) {\n        instrumentListingWithFavorites(\n          filters: $filters\n          pagination: $pagination\n        ) {\n          totalCount\n          totalPages\n          instruments {\n            code\n            category\n            label\n            managementCompany\n            isFavorite\n            valuation\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query InstrumentsList(\n        $filters: FavoriteInstrumentsFilters!\n        $pagination: Pagination!\n      ) {\n        instrumentListingWithFavorites(\n          filters: $filters\n          pagination: $pagination\n        ) {\n          totalCount\n          totalPages\n          instruments {\n            code\n            category\n            label\n            managementCompany\n            isFavorite\n            valuation\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query FavoriteInstrumentsList(\n        $filters: FavoriteInstrumentsFilters!\n        $pagination: Pagination!\n      ) {\n        instrumentFavorites(filters: $filters, pagination: $pagination) {\n          totalCount\n          totalPages\n          instruments {\n            code\n            category\n            label\n            managementCompany\n            isFavorite\n            valuation\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query FavoriteInstrumentsList(\n        $filters: FavoriteInstrumentsFilters!\n        $pagination: Pagination!\n      ) {\n        instrumentFavorites(filters: $filters, pagination: $pagination) {\n          totalCount\n          totalPages\n          instruments {\n            code\n            category\n            label\n            managementCompany\n            isFavorite\n            valuation\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query InstrumentFiltersQuery {\n        instrumentFavoriteFilters {\n          categories\n          managementCompanies\n        }\n      }\n    "
): (typeof documents)["\n      query InstrumentFiltersQuery {\n        instrumentFavoriteFilters {\n          categories\n          managementCompanies\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation setInstrumentFavorite(\n        $code: ID!\n        $isFavorite: Boolean!\n        $companyID: ID!\n      ) {\n        setInstrumentFavorite(\n          code: $code\n          isFavorite: $isFavorite\n          companyID: $companyID\n        ) {\n          code\n        }\n      }\n    "
): (typeof documents)["\n      mutation setInstrumentFavorite(\n        $code: ID!\n        $isFavorite: Boolean!\n        $companyID: ID!\n      ) {\n        setInstrumentFavorite(\n          code: $code\n          isFavorite: $isFavorite\n          companyID: $companyID\n        ) {\n          code\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query Project($id: ID!) {\n        project(id: $id) {\n          id\n          created\n          validated\n          archived\n          name\n          type\n          metadata\n        }\n      }\n    "
): (typeof documents)["\n      query Project($id: ID!) {\n        project(id: $id) {\n          id\n          created\n          validated\n          archived\n          name\n          type\n          metadata\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ProjectList(\n        $customerID: ID!\n        $companyID: ID!\n        $range: TimeRange!\n        $type: ProjectType\n        $productType: String\n      ) {\n        projectList(\n          customerID: $customerID\n          companyID: $companyID\n          range: $range\n          type: $type\n          productType: $productType\n        ) {\n          id\n          created\n          validated\n          archived\n          name\n          type\n          metadata\n        }\n      }\n    "
): (typeof documents)["\n      query ProjectList(\n        $customerID: ID!\n        $companyID: ID!\n        $range: TimeRange!\n        $type: ProjectType\n        $productType: String\n      ) {\n        projectList(\n          customerID: $customerID\n          companyID: $companyID\n          range: $range\n          type: $type\n          productType: $productType\n        ) {\n          id\n          created\n          validated\n          archived\n          name\n          type\n          metadata\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation ProjectDeletion($id: ID!) {\n        projectDeletion(id: $id) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation ProjectDeletion($id: ID!) {\n        projectDeletion(id: $id) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation ProjectValidation($id: ID!, $customerID: ID!, $companyID: ID!) {\n        projectValidation(\n          id: $id\n          customerID: $customerID\n          companyID: $companyID\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation ProjectValidation($id: ID!, $customerID: ID!, $companyID: ID!) {\n        projectValidation(\n          id: $id\n          customerID: $customerID\n          companyID: $companyID\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation ProjectCreation(\n        $customerID: ID!\n        $companyID: ID!\n        $type: ProjectType!\n        $name: String!\n        $metadata: ProjectMetadata!\n      ) {\n        projectCreation(\n          customerID: $customerID\n          companyID: $companyID\n          type: $type\n          name: $name\n          metadata: $metadata\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation ProjectCreation(\n        $customerID: ID!\n        $companyID: ID!\n        $type: ProjectType!\n        $name: String!\n        $metadata: ProjectMetadata!\n      ) {\n        projectCreation(\n          customerID: $customerID\n          companyID: $companyID\n          type: $type\n          name: $name\n          metadata: $metadata\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation ProjectUpdate($id: ID!, $metadata: ProjectMetadata!) {\n        projectUpdate(id: $id, metadata: $metadata) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation ProjectUpdate($id: ID!, $metadata: ProjectMetadata!) {\n        projectUpdate(id: $id, metadata: $metadata) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ProjectProductTypes($companyID: ID!, $customerID: ID!) {\n        projectProductTypes(companyID: $companyID, customerID: $customerID)\n      }\n    "
): (typeof documents)["\n      query ProjectProductTypes($companyID: ID!, $customerID: ID!) {\n        projectProductTypes(companyID: $companyID, customerID: $customerID)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation GenerateAdequacy($projectID: ID!, $customerID: ID!) {\n        generateAdequacy(projectID: $projectID, customerID: $customerID) {\n          name\n          url\n          extension\n        }\n      }\n    "
): (typeof documents)["\n      mutation GenerateAdequacy($projectID: ID!, $customerID: ID!) {\n        generateAdequacy(projectID: $projectID, customerID: $customerID) {\n          name\n          url\n          extension\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query SearchCustomers($companyID: ID!, $schema: CustomerSearchSchema!) {\n        searchCustomers(companyID: $companyID, schema: $schema) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      query SearchCustomers($companyID: ID!, $schema: CustomerSearchSchema!) {\n        searchCustomers(companyID: $companyID, schema: $schema) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomersSearchFilters($companyID: ID!, $underManagement: Boolean) {\n        customersSearchFilters(\n          companyID: $companyID\n          underManagement: $underManagement\n        ) {\n          insuranceCompany\n          category\n          group\n\n          investmentType\n          investmentManagementCompany\n          tags\n        }\n      }\n    "
): (typeof documents)["\n      query CustomersSearchFilters($companyID: ID!, $underManagement: Boolean) {\n        customersSearchFilters(\n          companyID: $companyID\n          underManagement: $underManagement\n        ) {\n          insuranceCompany\n          category\n          group\n\n          investmentType\n          investmentManagementCompany\n          tags\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query SearchCustomersResult($companyID: ID!, $id: ID!) {\n        getSearchResult(companyID: $companyID, id: $id) {\n          id\n          result {\n            ... on CustomerAsset {\n              __typename\n              id\n              customer {\n                id\n                name\n              }\n              performance {\n                gain\n                evolution\n              }\n\n              mixedData\n              accountNumber\n              openDate\n              group\n              name\n              valuation\n\n              investmentCode\n              investmentLabel\n              investmentValuation\n              investmentPerformance\n            }\n\n            ... on Customer {\n              __typename\n              id\n              name\n              underManagementWealth: wealth(\n                companyID: $companyID\n                computing: under_managements\n              )\n              wealth(companyID: $companyID)\n              informations {\n                details\n                general\n              }\n            }\n          }\n          schema\n        }\n      }\n    "
): (typeof documents)["\n      query SearchCustomersResult($companyID: ID!, $id: ID!) {\n        getSearchResult(companyID: $companyID, id: $id) {\n          id\n          result {\n            ... on CustomerAsset {\n              __typename\n              id\n              customer {\n                id\n                name\n              }\n              performance {\n                gain\n                evolution\n              }\n\n              mixedData\n              accountNumber\n              openDate\n              group\n              name\n              valuation\n\n              investmentCode\n              investmentLabel\n              investmentValuation\n              investmentPerformance\n            }\n\n            ... on Customer {\n              __typename\n              id\n              name\n              underManagementWealth: wealth(\n                companyID: $companyID\n                computing: under_managements\n              )\n              wealth(companyID: $companyID)\n              informations {\n                details\n                general\n              }\n            }\n          }\n          schema\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation exportSearchResult(\n        $companyID: ID!\n        $id: ID!\n        $hasInvestQuery: Boolean\n      ) {\n        url: exportSearchResult(\n          companyID: $companyID\n          id: $id\n          hasInvestQuery: $hasInvestQuery\n        )\n      }\n    "
): (typeof documents)["\n      mutation exportSearchResult(\n        $companyID: ID!\n        $id: ID!\n        $hasInvestQuery: Boolean\n      ) {\n        url: exportSearchResult(\n          companyID: $companyID\n          id: $id\n          hasInvestQuery: $hasInvestQuery\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query GetFavoriteSearches {\n        favoriteSearchQueries {\n          id\n          schema\n        }\n      }\n    "
): (typeof documents)["\n      query GetFavoriteSearches {\n        favoriteSearchQueries {\n          id\n          schema\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation SaveFavoriteSearch($schema: CustomerSearchSchema!) {\n        saveFavoriteSearchQuery(schema: $schema) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation SaveFavoriteSearch($schema: CustomerSearchSchema!) {\n        saveFavoriteSearchQuery(schema: $schema) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation DeleteFavoriteSearch($id: ID!) {\n        deleteFavoriteSearchQuery(id: $id) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation DeleteFavoriteSearch($id: ID!) {\n        deleteFavoriteSearchQuery(id: $id) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerWalletActivitiesGraph($assetId: ID!, $from: DateTime) {\n        customerWalletActivitiesGraph(assetId: $assetId, from: $from) {\n          id\n          value\n          start\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerWalletActivitiesGraph($assetId: ID!, $from: DateTime) {\n        customerWalletActivitiesGraph(assetId: $assetId, from: $from) {\n          id\n          value\n          start\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerWalletActivitiesByYear($assetId: ID!) {\n        customerWalletActivitiesByYear(assetId: $assetId) {\n          year\n          startValue\n          endValue\n          performance {\n            gain\n            evolution\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerWalletActivitiesByYear($assetId: ID!) {\n        customerWalletActivitiesByYear(assetId: $assetId) {\n          year\n          startValue\n          endValue\n          performance {\n            gain\n            evolution\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerWalletAddActivityYearHistory(\n        $companyID: ID!\n        $customerID: ID!\n        $assetID: ID!\n        $input: ActivityYearHistoryCreationInput!\n      ) {\n        customerWalletAddActivityYearHistory(\n          companyID: $companyID\n          customerID: $customerID\n          assetID: $assetID\n          input: $input\n        ) {\n          year\n        }\n      }\n    "
): (typeof documents)["\n      mutation CustomerWalletAddActivityYearHistory(\n        $companyID: ID!\n        $customerID: ID!\n        $assetID: ID!\n        $input: ActivityYearHistoryCreationInput!\n      ) {\n        customerWalletAddActivityYearHistory(\n          companyID: $companyID\n          customerID: $customerID\n          assetID: $assetID\n          input: $input\n        ) {\n          year\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerWalletUpdateActivityYearHistory(\n        $companyID: ID!\n        $customerID: ID!\n        $assetID: ID!\n        $input: ActivityYearHistoryCreationInput!\n      ) {\n        customerWalletUpdateActivityYearHistory(\n          companyID: $companyID\n          customerID: $customerID\n          assetID: $assetID\n          input: $input\n        ) {\n          year\n        }\n      }\n    "
): (typeof documents)["\n      mutation CustomerWalletUpdateActivityYearHistory(\n        $companyID: ID!\n        $customerID: ID!\n        $assetID: ID!\n        $input: ActivityYearHistoryCreationInput!\n      ) {\n        customerWalletUpdateActivityYearHistory(\n          companyID: $companyID\n          customerID: $customerID\n          assetID: $assetID\n          input: $input\n        ) {\n          year\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query SCPIList($name: String!) {\n        SCPIList(name: $name) {\n          name\n          subscription_price\n        }\n      }\n    "
): (typeof documents)["\n      query SCPIList($name: String!) {\n        SCPIList(name: $name) {\n          name\n          subscription_price\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation AssetCreation(\n        $customerID: ID!\n        $companyID: ID!\n        $name: String!\n        $group: AssetGroup!\n        $values: CustomerAssetCreationValues!\n        $investments: [InvestmentValues!]\n      ) {\n        created: assetCreation(\n          customerID: $customerID\n          companyID: $companyID\n          name: $name\n          group: $group\n          values: $values\n          investments: $investments\n        ) {\n          id\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation AssetCreation(\n        $customerID: ID!\n        $companyID: ID!\n        $name: String!\n        $group: AssetGroup!\n        $values: CustomerAssetCreationValues!\n        $investments: [InvestmentValues!]\n      ) {\n        created: assetCreation(\n          customerID: $customerID\n          companyID: $companyID\n          name: $name\n          group: $group\n          values: $values\n          investments: $investments\n        ) {\n          id\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation AssetUpdate(\n        $customerID: ID!\n        $companyID: ID!\n        $assetID: ID!\n        $name: String!\n        $group: AssetGroup!\n        $values: CustomerAssetCreationValues!\n        $investments: [InvestmentValues!]\n      ) {\n        updated: assetUpdate(\n          customerID: $customerID\n          companyID: $companyID\n          assetID: $assetID\n          name: $name\n          group: $group\n          values: $values\n          investments: $investments\n        ) {\n          id\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation AssetUpdate(\n        $customerID: ID!\n        $companyID: ID!\n        $assetID: ID!\n        $name: String!\n        $group: AssetGroup!\n        $values: CustomerAssetCreationValues!\n        $investments: [InvestmentValues!]\n      ) {\n        updated: assetUpdate(\n          customerID: $customerID\n          companyID: $companyID\n          assetID: $assetID\n          name: $name\n          group: $group\n          values: $values\n          investments: $investments\n        ) {\n          id\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation AssetUpdateDatesAndStatus(\n        $customerID: ID!\n        $companyID: ID!\n        $assetID: ID!\n        $openDate: DateTime!\n        $closeDate: DateTime\n        $status: String!\n      ) {\n        updated: assetUpdateDatesAndStatus(\n          customerID: $customerID\n          companyID: $companyID\n          assetID: $assetID\n          openDate: $openDate\n          closeDate: $closeDate\n          status: $status\n        ) {\n          id\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation AssetUpdateDatesAndStatus(\n        $customerID: ID!\n        $companyID: ID!\n        $assetID: ID!\n        $openDate: DateTime!\n        $closeDate: DateTime\n        $status: String!\n      ) {\n        updated: assetUpdateDatesAndStatus(\n          customerID: $customerID\n          companyID: $companyID\n          assetID: $assetID\n          openDate: $openDate\n          closeDate: $closeDate\n          status: $status\n        ) {\n          id\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation AssetUpdateGroup(\n        $companyID: ID!\n        $assets: [ID!]!\n        $group: AssetGroup!\n        $categoryName: String\n      ) {\n        updated: assetUpdateGroup(\n          companyID: $companyID\n          assets: $assets\n          group: $group\n          categoryName: $categoryName\n        ) {\n          id\n          name\n          group\n          categoryName\n        }\n      }\n    "
): (typeof documents)["\n      mutation AssetUpdateGroup(\n        $companyID: ID!\n        $assets: [ID!]!\n        $group: AssetGroup!\n        $categoryName: String\n      ) {\n        updated: assetUpdateGroup(\n          companyID: $companyID\n          assets: $assets\n          group: $group\n          categoryName: $categoryName\n        ) {\n          id\n          name\n          group\n          categoryName\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerAssetInvestmentUpdate(\n        $customerID: ID!\n        $companyID: ID!\n        $assetID: ID!\n        $update: [InvestmentValues!]!\n      ) {\n        customerAssetInvestmentUpdate(\n          customerID: $customerID\n          companyID: $companyID\n          assetID: $assetID\n          update: $update\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation CustomerAssetInvestmentUpdate(\n        $customerID: ID!\n        $companyID: ID!\n        $assetID: ID!\n        $update: [InvestmentValues!]!\n      ) {\n        customerAssetInvestmentUpdate(\n          customerID: $customerID\n          companyID: $companyID\n          assetID: $assetID\n          update: $update\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query SearchInstrument($name: String!, $group: AssetGroup!) {\n        searchInstrument(name: $name, group: $group) {\n          name\n          code\n          price\n        }\n      }\n    "
): (typeof documents)["\n      query SearchInstrument($name: String!, $group: AssetGroup!) {\n        searchInstrument(name: $name, group: $group) {\n          name\n          code\n          price\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerInvestmentCreation(\n        $companyID: ID!\n        $customerID: ID!\n        $assetID: ID!\n        $input: CustomerInvestmentCreation!\n      ) {\n        customerInvestmentCreation(\n          companyID: $companyID\n          customerID: $customerID\n          assetID: $assetID\n          input: $input\n        ) {\n          name\n        }\n      }\n    "
): (typeof documents)["\n      mutation CustomerInvestmentCreation(\n        $companyID: ID!\n        $customerID: ID!\n        $assetID: ID!\n        $input: CustomerInvestmentCreation!\n      ) {\n        customerInvestmentCreation(\n          companyID: $companyID\n          customerID: $customerID\n          assetID: $assetID\n          input: $input\n        ) {\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query AssetDetail($id: ID!) {\n        asset: customerAsset(id: $id) {\n          id\n          name\n          group\n          activity\n          underManagement\n          categoryName\n          accountNumber\n          isManual\n          metadata\n          openDate\n          owners {\n            entity {\n              id\n            }\n            ownership\n          }\n          # performance(start: $start, end: $end) {\n          performance {\n            gain\n            evolution\n          }\n          investmentList {\n            logo\n            code\n            name\n            category\n            managementCompany\n            unitPrice\n            unitValue\n            created\n            quantity\n            valuation\n            riskIndicator\n            # performance(start: $start, end: $end) {\n            performance {\n              gain\n              evolution\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query AssetDetail($id: ID!) {\n        asset: customerAsset(id: $id) {\n          id\n          name\n          group\n          activity\n          underManagement\n          categoryName\n          accountNumber\n          isManual\n          metadata\n          openDate\n          owners {\n            entity {\n              id\n            }\n            ownership\n          }\n          # performance(start: $start, end: $end) {\n          performance {\n            gain\n            evolution\n          }\n          investmentList {\n            logo\n            code\n            name\n            category\n            managementCompany\n            unitPrice\n            unitValue\n            created\n            quantity\n            valuation\n            riskIndicator\n            # performance(start: $start, end: $end) {\n            performance {\n              gain\n              evolution\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query RetrieveOtherOwner($assetId: ID!, $currentOwnerId: ID!) {\n        otherOwner: retrieveOtherOwner(\n          assetId: $assetId\n          currentOwnerId: $currentOwnerId\n        ) {\n          id\n          name\n          firstName\n          lastName\n        }\n      }\n    "
): (typeof documents)["\n      query RetrieveOtherOwner($assetId: ID!, $currentOwnerId: ID!) {\n        otherOwner: retrieveOtherOwner(\n          assetId: $assetId\n          currentOwnerId: $currentOwnerId\n        ) {\n          id\n          name\n          firstName\n          lastName\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query GetUsersInCustomerReference($companyId: ID!, $customerId: ID!) {\n        users: getUsersInCustomerReference(\n          companyId: $companyId\n          customerId: $customerId\n        ) {\n          id\n          name\n          firstName\n          lastName\n          type\n        }\n      }\n    "
): (typeof documents)["\n      query GetUsersInCustomerReference($companyId: ID!, $customerId: ID!) {\n        users: getUsersInCustomerReference(\n          companyId: $companyId\n          customerId: $customerId\n        ) {\n          id\n          name\n          firstName\n          lastName\n          type\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation AssetDeletion($companyID: ID!, $assetID: ID!) {\n        assetDeletion(companyID: $companyID, id: $assetID) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation AssetDeletion($companyID: ID!, $assetID: ID!) {\n        assetDeletion(companyID: $companyID, id: $assetID) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query InstrumentDetail($id: ID!) {\n        instrumentDetails(id: $id) {\n          code\n          label\n          category\n          managementCompany\n          subcategory\n          riskIndicator\n          dic\n          prospectus\n          location\n          closePrice\n          closePriceDate\n          currency\n          sfdr\n          pea\n          peaPme\n          esg\n          indiceReference\n          minimumInvestissement\n          frequenceValorisation\n          nombreParts\n          fraisPriips\n          fraisCourants\n          fraisGestion\n          fraisSouscription\n          fraisRachat\n\n          perfCalendaire {\n            year\n            value\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query InstrumentDetail($id: ID!) {\n        instrumentDetails(id: $id) {\n          code\n          label\n          category\n          managementCompany\n          subcategory\n          riskIndicator\n          dic\n          prospectus\n          location\n          closePrice\n          closePriceDate\n          currency\n          sfdr\n          pea\n          peaPme\n          esg\n          indiceReference\n          minimumInvestissement\n          frequenceValorisation\n          nombreParts\n          fraisPriips\n          fraisCourants\n          fraisGestion\n          fraisSouscription\n          fraisRachat\n\n          perfCalendaire {\n            year\n            value\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query searchInvestmentsByInstrumentCodeInAssets(\n        $companyID: ID!\n        $code: ID!\n        $page: Int\n        $limit: Int\n      ) {\n        searchInvestmentsByInstrumentCodeInAssets(\n          companyID: $companyID\n          code: $code\n          page: $page\n          limit: $limit\n        ) {\n          totalCount\n          edges {\n            assetId\n            assetName\n            assetGroup\n            customerId\n            customerName\n            amount\n            detentions\n            performance {\n              amount\n              percentage\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query searchInvestmentsByInstrumentCodeInAssets(\n        $companyID: ID!\n        $code: ID!\n        $page: Int\n        $limit: Int\n      ) {\n        searchInvestmentsByInstrumentCodeInAssets(\n          companyID: $companyID\n          code: $code\n          page: $page\n          limit: $limit\n        ) {\n          totalCount\n          edges {\n            assetId\n            assetName\n            assetGroup\n            customerId\n            customerName\n            amount\n            detentions\n            performance {\n              amount\n              percentage\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query instrumentIsFavorite($companyID: ID!, $code: ID!) {\n        instrumentIsFavorite(companyID: $companyID, code: $code)\n      }\n    "
): (typeof documents)["\n      query instrumentIsFavorite($companyID: ID!, $code: ID!) {\n        instrumentIsFavorite(companyID: $companyID, code: $code)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation InstrumentUpdate(\n        $companyID: ID!\n        $code: ID!\n        $input: InstrumentsDataInput!\n      ) {\n        instrumentUpdate(companyID: $companyID, code: $code, input: $input) {\n          code\n        }\n      }\n    "
): (typeof documents)["\n      mutation InstrumentUpdate(\n        $companyID: ID!\n        $code: ID!\n        $input: InstrumentsDataInput!\n      ) {\n        instrumentUpdate(companyID: $companyID, code: $code, input: $input) {\n          code\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerWalletTransactions(\n        $assetId: ID!\n        $pagination: Pagination!\n        $search: String\n        $dateRange: DateRange\n      ) {\n        customerWalletTransactions(\n          assetId: $assetId\n          pagination: $pagination\n          search: $search\n          dateRange: $dateRange\n        ) {\n          transactions {\n            id\n            name\n            date\n            dateBO\n            value\n            comment\n            typeOperation\n            manager\n            metadata\n            statusBO\n            statusValidation\n            managerBO\n          }\n          totalCount\n          totalPages\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerWalletTransactions(\n        $assetId: ID!\n        $pagination: Pagination!\n        $search: String\n        $dateRange: DateRange\n      ) {\n        customerWalletTransactions(\n          assetId: $assetId\n          pagination: $pagination\n          search: $search\n          dateRange: $dateRange\n        ) {\n          transactions {\n            id\n            name\n            date\n            dateBO\n            value\n            comment\n            typeOperation\n            manager\n            metadata\n            statusBO\n            statusValidation\n            managerBO\n          }\n          totalCount\n          totalPages\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CreateTransaction(\n        $companyID: ID!\n        $customerID: ID!\n        $assetID: ID!\n        $input: TransactionCreationInput!\n      ) {\n        customerWalletAddTransaction(\n          companyID: $companyID\n          customerID: $customerID\n          assetID: $assetID\n          input: $input\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation CreateTransaction(\n        $companyID: ID!\n        $customerID: ID!\n        $assetID: ID!\n        $input: TransactionCreationInput!\n      ) {\n        customerWalletAddTransaction(\n          companyID: $companyID\n          customerID: $customerID\n          assetID: $assetID\n          input: $input\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation TransactionUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $transactionID: ID!\n        $input: TransactionCreationInput!\n      ) {\n        customerWalletTransactionUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          transactionID: $transactionID\n          input: $input\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation TransactionUpdate(\n        $companyID: ID!\n        $customerID: ID!\n        $transactionID: ID!\n        $input: TransactionCreationInput!\n      ) {\n        customerWalletTransactionUpdate(\n          companyID: $companyID\n          customerID: $customerID\n          transactionID: $transactionID\n          input: $input\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation TransactionDelete(\n        $companyID: ID!\n        $customerID: ID!\n        $transactionID: ID!\n      ) {\n        customerWalletTransactionDeletion(\n          companyID: $companyID\n          customerID: $customerID\n          transactionID: $transactionID\n        )\n      }\n    "
): (typeof documents)["\n      mutation TransactionDelete(\n        $companyID: ID!\n        $customerID: ID!\n        $transactionID: ID!\n      ) {\n        customerWalletTransactionDeletion(\n          companyID: $companyID\n          customerID: $customerID\n          transactionID: $transactionID\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query RelatedEntities($companyID: ID!, $assetID: ID!, $customerID: ID!) {\n        referenceEntities: getUsersInCustomerReference(\n          companyId: $companyID\n          customerId: $customerID\n        ) {\n          id\n          name\n        }\n        asset: customerAsset(id: $assetID) {\n          owners {\n            entity {\n              id\n              name\n            }\n            ownership\n            mode\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query RelatedEntities($companyID: ID!, $assetID: ID!, $customerID: ID!) {\n        referenceEntities: getUsersInCustomerReference(\n          companyId: $companyID\n          customerId: $customerID\n        ) {\n          id\n          name\n        }\n        asset: customerAsset(id: $assetID) {\n          owners {\n            entity {\n              id\n              name\n            }\n            ownership\n            mode\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation updateAssetOwnership(\n        $companyID: ID!\n        $assetID: ID!\n        $values: [AssetOwnerInput!]!\n      ) {\n        updated: assetsUpdateOwners(\n          companyID: $companyID\n          assetID: $assetID\n          values: $values\n        ) {\n          id\n          owners {\n            entity {\n              id\n            }\n            ownership\n            mode\n          }\n        }\n      }\n    "
): (typeof documents)["\n      mutation updateAssetOwnership(\n        $companyID: ID!\n        $assetID: ID!\n        $values: [AssetOwnerInput!]!\n      ) {\n        updated: assetsUpdateOwners(\n          companyID: $companyID\n          assetID: $assetID\n          values: $values\n        ) {\n          id\n          owners {\n            entity {\n              id\n            }\n            ownership\n            mode\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerWealth(\n        $id: ID!\n        $company: ID!\n        $financialTypes: [AssetGroup!]\n        $passiveTypes: [AssetGroup!]\n        $nonFinancialTypes: [AssetGroup!]\n        $benefitsTypes: [AssetGroup!]\n        $repartitionTypes: [AssetGroup!]\n        $othersTypes: [AssetGroup!]\n        $computing: WealthFilter\n      ) {\n        financialWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $financialTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            metadata\n            valuation\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        nonfinancialWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $nonFinancialTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        othersWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $othersTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        passiveWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $passiveTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            underManagement\n            isManual\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        benefitsWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $benefitsTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            underManagement\n            isManual\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        repartition: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $repartitionTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerWealth(\n        $id: ID!\n        $company: ID!\n        $financialTypes: [AssetGroup!]\n        $passiveTypes: [AssetGroup!]\n        $nonFinancialTypes: [AssetGroup!]\n        $benefitsTypes: [AssetGroup!]\n        $repartitionTypes: [AssetGroup!]\n        $othersTypes: [AssetGroup!]\n        $computing: WealthFilter\n      ) {\n        financialWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $financialTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            metadata\n            valuation\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        nonfinancialWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $nonFinancialTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        othersWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $othersTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        passiveWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $passiveTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            underManagement\n            isManual\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        benefitsWealth: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $benefitsTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            underManagement\n            isManual\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        repartition: customerWealth(\n          id: $id\n          companyID: $company\n          groups: $repartitionTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query WealthUnderManagment($company: ID!, $computing: WealthFilter) {\n        assetsTypes: companyWealth(id: $company, computing: $computing) {\n          name: group\n          amount: valuation\n          assetsUnderManagement(computing: $computing) {\n            id\n            name\n            valuation\n            customer {\n              id\n              name\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query WealthUnderManagment($company: ID!, $computing: WealthFilter) {\n        assetsTypes: companyWealth(id: $company, computing: $computing) {\n          name: group\n          amount: valuation\n          assetsUnderManagement(computing: $computing) {\n            id\n            name\n            valuation\n            customer {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerWallet($companyID: ID!, $id: ID!) {\n        customerWallet(companyID: $companyID, id: $id) {\n          id\n          accountNumber\n          group\n          insuranceCompany\n          name\n          openDate\n          transfersAmount\n          withdrawalAmount\n          valuation\n          risk\n          metadata\n          mixedData\n          sri\n          irr\n          initialValuation\n          investments {\n            id\n            code\n            label\n            quantity\n            unitPrice\n            unitValue\n            dateValue\n            valuation\n            dateValuation\n            instrument\n            riskIndicator\n            category: subcategory\n            buyingDate\n            investmentInstrument {\n              dic\n              prospectus\n              metadata\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerWallet($companyID: ID!, $id: ID!) {\n        customerWallet(companyID: $companyID, id: $id) {\n          id\n          accountNumber\n          group\n          insuranceCompany\n          name\n          openDate\n          transfersAmount\n          withdrawalAmount\n          valuation\n          risk\n          metadata\n          mixedData\n          sri\n          irr\n          initialValuation\n          investments {\n            id\n            code\n            label\n            quantity\n            unitPrice\n            unitValue\n            dateValue\n            valuation\n            dateValuation\n            instrument\n            riskIndicator\n            category: subcategory\n            buyingDate\n            investmentInstrument {\n              dic\n              prospectus\n              metadata\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query UnderManagementAssetGroups(\n        $customerID: ID!\n        $companyID: ID!\n        $groups: [AssetGroup!]\n        $computing: WealthFilter\n      ) {\n        customerWealth(\n          id: $customerID\n          companyID: $companyID\n          groups: $groups\n          computing: $computing\n        ) {\n          group\n          valuation\n          assets(computing: $computing) {\n            id\n            name\n            group\n            activity\n            accountNumber\n            openDate\n            categoryName\n            transfersAmount\n            withdrawalAmount\n            metadata\n            sri\n            valuation\n            owners {\n              entity {\n                id\n              }\n              ownership\n              mode\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query UnderManagementAssetGroups(\n        $customerID: ID!\n        $companyID: ID!\n        $groups: [AssetGroup!]\n        $computing: WealthFilter\n      ) {\n        customerWealth(\n          id: $customerID\n          companyID: $companyID\n          groups: $groups\n          computing: $computing\n        ) {\n          group\n          valuation\n          assets(computing: $computing) {\n            id\n            name\n            group\n            activity\n            accountNumber\n            openDate\n            categoryName\n            transfersAmount\n            withdrawalAmount\n            metadata\n            sri\n            valuation\n            owners {\n              entity {\n                id\n              }\n              ownership\n              mode\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerAssets($id: ID!, $companyID: ID!, $groups: [AssetGroup!]) {\n        customerAssets(id: $id, companyID: $companyID, groups: $groups) {\n          id\n          name\n          group\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerAssets($id: ID!, $companyID: ID!, $groups: [AssetGroup!]) {\n        customerAssets(id: $id, companyID: $companyID, groups: $groups) {\n          id\n          name\n          group\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CustomerWalletInvestmentSriUpdate(\n        $id: ID!\n        $riskIndicator: Int!\n      ) {\n        customerWalletInvestmentSriUpdate(\n          id: $id\n          riskIndicator: $riskIndicator\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation CustomerWalletInvestmentSriUpdate(\n        $id: ID!\n        $riskIndicator: Int!\n      ) {\n        customerWalletInvestmentSriUpdate(\n          id: $id\n          riskIndicator: $riskIndicator\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query GlobalWealth(\n        $company: ID!\n        $start: DateTime\n        $end: DateTime\n        $options: AssetPerformanceOrder!\n        $computing: WealthFilter\n        $ignoring: [AssetGroup!]\n        $campaignLimit: Int\n      ) {\n        companyWealth(id: $company, computing: $computing) {\n          name: group\n          amount: valuation\n          performance(start: $start, end: $end, computing: $computing) {\n            gain\n            evolution\n          }\n        }\n        assets: companiesManagedAsset(\n          companyID: $company\n          start: $start\n          end: $end\n          options: $options\n          ignoring: $ignoring\n        ) {\n          id\n          name\n          group\n          amount: activity\n          isManual\n          # performance(start: $start, end: $end) {\n          performance {\n            gain\n            evolution\n          }\n        }\n        liquidity: globalLiquidity(companyID: $company, computing: $computing)\n        mostOccuring: mostOccuringAssetType(companyID: $company) {\n          group\n          count\n        }\n        company(id: $company) {\n          wealth\n          metadata\n        }\n        details: customerDetails(companyID: $company) {\n          managedWealth\n        }\n\n        campaigns: campaignList(companyID: $company, limit: $campaignLimit) {\n          name\n        }\n      }\n    "
): (typeof documents)["\n      query GlobalWealth(\n        $company: ID!\n        $start: DateTime\n        $end: DateTime\n        $options: AssetPerformanceOrder!\n        $computing: WealthFilter\n        $ignoring: [AssetGroup!]\n        $campaignLimit: Int\n      ) {\n        companyWealth(id: $company, computing: $computing) {\n          name: group\n          amount: valuation\n          performance(start: $start, end: $end, computing: $computing) {\n            gain\n            evolution\n          }\n        }\n        assets: companiesManagedAsset(\n          companyID: $company\n          start: $start\n          end: $end\n          options: $options\n          ignoring: $ignoring\n        ) {\n          id\n          name\n          group\n          amount: activity\n          isManual\n          # performance(start: $start, end: $end) {\n          performance {\n            gain\n            evolution\n          }\n        }\n        liquidity: globalLiquidity(companyID: $company, computing: $computing)\n        mostOccuring: mostOccuringAssetType(companyID: $company) {\n          group\n          count\n        }\n        company(id: $company) {\n          wealth\n          metadata\n        }\n        details: customerDetails(companyID: $company) {\n          managedWealth\n        }\n\n        campaigns: campaignList(companyID: $company, limit: $campaignLimit) {\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation AssetManagementSwitch(\n          $id: ID!\n          $companyID: ID!\n          $customerID: ID!\n          $domain: WealthFilter!\n        ) {\n          asset: switchAssetManagement(\n            id: $id\n            companyID: $companyID\n            customerID: $customerID\n            management: $domain\n          ) {\n            id\n            name\n            underManagement\n            isManual\n          }\n        }\n      "
): (typeof documents)["\n        mutation AssetManagementSwitch(\n          $id: ID!\n          $companyID: ID!\n          $customerID: ID!\n          $domain: WealthFilter!\n        ) {\n          asset: switchAssetManagement(\n            id: $id\n            companyID: $companyID\n            customerID: $customerID\n            management: $domain\n          ) {\n            id\n            name\n            underManagement\n            isManual\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CustomerSearch(\n        $companyID: ID!\n        $text: String\n        $suggestionsTokens: [String!]\n      ) {\n        searchCustomer(\n          companyID: $companyID\n          text: $text\n          suggestionsTokens: $suggestionsTokens\n        ) {\n          id\n          name\n          email\n        }\n      }\n    "
): (typeof documents)["\n      query CustomerSearch(\n        $companyID: ID!\n        $text: String\n        $suggestionsTokens: [String!]\n      ) {\n        searchCustomer(\n          companyID: $companyID\n          text: $text\n          suggestionsTokens: $suggestionsTokens\n        ) {\n          id\n          name\n          email\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation AssetAffectation(\n        $companyID: ID!\n        $selectedCustomerID: ID!\n        $assets: [ID!]!\n      ) {\n        assetsAffectation(\n          companyID: $companyID\n          customerID: $selectedCustomerID\n          assets: $assets\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation AssetAffectation(\n        $companyID: ID!\n        $selectedCustomerID: ID!\n        $assets: [ID!]!\n      ) {\n        assetsAffectation(\n          companyID: $companyID\n          customerID: $selectedCustomerID\n          assets: $assets\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query assetTypeWealth(\n        $id: ID!\n        $filters: AssetFilters\n        $group: AssetGroup!\n        $computing: WealthFilter\n      ) {\n        company(id: $id) {\n          id\n          assets: assetsUnderManagement(\n            group: $group\n            filters: $filters\n            computing: $computing\n          ) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                valuation\n                accountNumber\n                customer {\n                  id\n                  name\n                }\n                sri\n              }\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query assetTypeWealth(\n        $id: ID!\n        $filters: AssetFilters\n        $group: AssetGroup!\n        $computing: WealthFilter\n      ) {\n        company(id: $id) {\n          id\n          assets: assetsUnderManagement(\n            group: $group\n            filters: $filters\n            computing: $computing\n          ) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                valuation\n                accountNumber\n                customer {\n                  id\n                  name\n                }\n                sri\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation exportAssets(\n        $companyID: ID!\n        $group: AssetGroup!\n        $filters: AssetFilters\n        $computing: WealthFilter\n      ) {\n        url: exportAssets(\n          companyID: $companyID\n          group: $group\n          filters: $filters\n          computing: $computing\n        )\n      }\n    "
): (typeof documents)["\n      mutation exportAssets(\n        $companyID: ID!\n        $group: AssetGroup!\n        $filters: AssetFilters\n        $computing: WealthFilter\n      ) {\n        url: exportAssets(\n          companyID: $companyID\n          group: $group\n          filters: $filters\n          computing: $computing\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query SubWealth(\n        $company: ID!\n        $start: DateTime\n        $end: DateTime\n        $limit: Int!\n        $computing: WealthFilter\n      ) {\n        assetsTypes: companyWealth(id: $company, computing: $computing) {\n          name: group\n          amount: valuation\n          performance(start: $start, end: $end, computing: $computing) {\n            gain\n            evolution\n          }\n          assetsUnderManagement(limit: $limit, computing: $computing) {\n            id\n            name\n            valuation\n            customer {\n              id\n              name\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query SubWealth(\n        $company: ID!\n        $start: DateTime\n        $end: DateTime\n        $limit: Int!\n        $computing: WealthFilter\n      ) {\n        assetsTypes: companyWealth(id: $company, computing: $computing) {\n          name: group\n          amount: valuation\n          performance(start: $start, end: $end, computing: $computing) {\n            gain\n            evolution\n          }\n          assetsUnderManagement(limit: $limit, computing: $computing) {\n            id\n            name\n            valuation\n            customer {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query Home(\n        $companyID: ID!\n        $input: CustomersInput\n        $campaignLimit: Int\n        $projectRange: TimeRange!\n        $taskFilter: CompanyTaskFilter\n        $projectValidated: Boolean\n        $projectLimit: Int\n      ) {\n        listCompanyTask(companyID: $companyID, filter: $taskFilter) {\n          lateCount\n          edges {\n            id\n            title\n            category\n            content\n            updated\n            schedule\n            created\n            completed\n            customer {\n              id\n              name\n            }\n            company {\n              id\n              name\n            }\n            assigned_manager {\n              id\n              name\n            }\n            entityRelatedId\n            entityRelatedType\n          }\n        }\n        projectCompanyList(\n          companyID: $companyID\n          range: $projectRange\n          validated: $projectValidated\n          limit: $projectLimit\n        ) {\n          id\n          created\n          validated\n          archived\n          name\n          type\n          metadata\n          customer {\n            id\n            name\n          }\n        }\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                firstName\n                lastName\n                email\n                type\n                wealth(companyID: $companyID)\n                underManagement: wealth(\n                  companyID: $companyID\n                  computing: under_managements\n                )\n              }\n            }\n          }\n        }\n        customersCompliance(company: $companyID) {\n          category {\n            key\n            name\n          }\n          levels {\n            valid\n            unvalid\n            waiting\n          }\n        }\n\n        campaigns: campaignList(companyID: $companyID, limit: $campaignLimit) {\n          name\n        }\n\n        liquidity: globalLiquidity(companyID: $companyID)\n        mostOccuringAssetType(companyID: $companyID) {\n          group\n          count\n        }\n      }\n    "
): (typeof documents)["\n      query Home(\n        $companyID: ID!\n        $input: CustomersInput\n        $campaignLimit: Int\n        $projectRange: TimeRange!\n        $taskFilter: CompanyTaskFilter\n        $projectValidated: Boolean\n        $projectLimit: Int\n      ) {\n        listCompanyTask(companyID: $companyID, filter: $taskFilter) {\n          lateCount\n          edges {\n            id\n            title\n            category\n            content\n            updated\n            schedule\n            created\n            completed\n            customer {\n              id\n              name\n            }\n            company {\n              id\n              name\n            }\n            assigned_manager {\n              id\n              name\n            }\n            entityRelatedId\n            entityRelatedType\n          }\n        }\n        projectCompanyList(\n          companyID: $companyID\n          range: $projectRange\n          validated: $projectValidated\n          limit: $projectLimit\n        ) {\n          id\n          created\n          validated\n          archived\n          name\n          type\n          metadata\n          customer {\n            id\n            name\n          }\n        }\n        company(id: $companyID) {\n          id\n          customerList(input: $input) {\n            totalCount\n            edges {\n              node {\n                id\n                name\n                firstName\n                lastName\n                email\n                type\n                wealth(companyID: $companyID)\n                underManagement: wealth(\n                  companyID: $companyID\n                  computing: under_managements\n                )\n              }\n            }\n          }\n        }\n        customersCompliance(company: $companyID) {\n          category {\n            key\n            name\n          }\n          levels {\n            valid\n            unvalid\n            waiting\n          }\n        }\n\n        campaigns: campaignList(companyID: $companyID, limit: $campaignLimit) {\n          name\n        }\n\n        liquidity: globalLiquidity(companyID: $companyID)\n        mostOccuringAssetType(companyID: $companyID) {\n          group\n          count\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query NotificationList($companyID: ID!, $filter: NotificationFilter) {\n        notificationList(companyID: $companyID, filter: $filter) {\n          id\n          type\n          data\n          updated\n          company {\n            id\n            name\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query NotificationList($companyID: ID!, $filter: NotificationFilter) {\n        notificationList(companyID: $companyID, filter: $filter) {\n          id\n          type\n          data\n          updated\n          company {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query NotificationListByType(\n        $companyID: ID!\n        $filter: NotificationFilter\n      ) {\n        notificationListByType(companyID: $companyID, filter: $filter) {\n          type\n          count\n          read\n          notifications {\n            id\n            type\n            data\n            read\n            created\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query NotificationListByType(\n        $companyID: ID!\n        $filter: NotificationFilter\n      ) {\n        notificationListByType(companyID: $companyID, filter: $filter) {\n          type\n          count\n          read\n          notifications {\n            id\n            type\n            data\n            read\n            created\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation NotificationRead($companyID: ID!, $id: ID!) {\n        notificationRead(companyID: $companyID, id: $id) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation NotificationRead($companyID: ID!, $id: ID!) {\n        notificationRead(companyID: $companyID, id: $id) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query GetAggregationList($companyID: ID!) {\n        connectionList(companyID: $companyID) {\n          id\n          state\n          updated\n          identifier\n          manager {\n            id\n            name\n          }\n          connector {\n            key\n            name\n            logo\n            provider\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query GetAggregationList($companyID: ID!) {\n        connectionList(companyID: $companyID) {\n          id\n          state\n          updated\n          identifier\n          manager {\n            id\n            name\n          }\n          connector {\n            key\n            name\n            logo\n            provider\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query ParentConnectionsHasInvalidCreds($companyID: ID!) {\n          parentCompanyConnectionsHasInvalidCreds(companyID: $companyID)\n        }\n      "
): (typeof documents)["\n        query ParentConnectionsHasInvalidCreds($companyID: ID!) {\n          parentCompanyConnectionsHasInvalidCreds(companyID: $companyID)\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ConnectionsHasInvalidCreds($companyID: ID!) {\n        connectionsHasInvalidCreds(companyID: $companyID)\n      }\n    "
): (typeof documents)["\n      query ConnectionsHasInvalidCreds($companyID: ID!) {\n        connectionsHasInvalidCreds(companyID: $companyID)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation DeleteConnection($connectionID: ID!) {\n        deleteConnection(connectionID: $connectionID)\n      }\n    "
): (typeof documents)["\n      mutation DeleteConnection($connectionID: ID!) {\n        deleteConnection(connectionID: $connectionID)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query ParentCompanyManagerData($companyID: ID!, $managerID: ID!) {\n            parentCompanyManagerData(\n              companyID: $companyID\n              managerID: $managerID\n            ) {\n              name\n              email\n              claims\n            }\n          }\n        "
): (typeof documents)["\n          query ParentCompanyManagerData($companyID: ID!, $managerID: ID!) {\n            parentCompanyManagerData(\n              companyID: $companyID\n              managerID: $managerID\n            ) {\n              name\n              email\n              claims\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query ManagerData($companyID: ID!, $managerID: ID!) {\n          managerData(companyID: $companyID, managerID: $managerID) {\n            name\n            email\n            claims\n          }\n        }\n      "
): (typeof documents)["\n        query ManagerData($companyID: ID!, $managerID: ID!) {\n          managerData(companyID: $companyID, managerID: $managerID) {\n            name\n            email\n            claims\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation ParentCompanyManagerUpdate(\n          $companyID: ID!\n          $managerID: ID!\n          $input: ManagerDataInput!\n          $claims: [ManagerClaims!]\n        ) {\n          parentCompanyManagerUpdate(\n            companyID: $companyID\n            managerID: $managerID\n            input: $input\n            claims: $claims\n          ) {\n            id\n          }\n        }\n      "
): (typeof documents)["\n        mutation ParentCompanyManagerUpdate(\n          $companyID: ID!\n          $managerID: ID!\n          $input: ManagerDataInput!\n          $claims: [ManagerClaims!]\n        ) {\n          parentCompanyManagerUpdate(\n            companyID: $companyID\n            managerID: $managerID\n            input: $input\n            claims: $claims\n          ) {\n            id\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation ManagerUpdate(\n        $companyID: ID!\n        $managerID: ID!\n        $input: ManagerDataInput!\n        $claims: [ManagerClaims!]\n      ) {\n        managerUpdate(\n          companyID: $companyID\n          managerID: $managerID\n          input: $input\n          claims: $claims\n        ) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation ManagerUpdate(\n        $companyID: ID!\n        $managerID: ID!\n        $input: ManagerDataInput!\n        $claims: [ManagerClaims!]\n      ) {\n        managerUpdate(\n          companyID: $companyID\n          managerID: $managerID\n          input: $input\n          claims: $claims\n        ) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query ParentCompanyGeneralForm($companyID: ID!) {\n            parentCompanyInfos(id: $companyID) {\n              general\n              logo\n            }\n          }\n        "
): (typeof documents)["\n          query ParentCompanyGeneralForm($companyID: ID!) {\n            parentCompanyInfos(id: $companyID) {\n              general\n              logo\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query CompanyGeneralForm($companyID: ID!) {\n          company(id: $companyID) {\n            general\n            logo\n          }\n        }\n      "
): (typeof documents)["\n        query CompanyGeneralForm($companyID: ID!) {\n          company(id: $companyID) {\n            general\n            logo\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation ParentCompanyGeneralFormUpdate(\n            $companyID: ID!\n            $generalInput: CompanyGeneralForm!\n          ) {\n            updated: parentCompanyUpdate(\n              companyID: $companyID\n              generalInput: $generalInput\n            ) {\n              id\n              general\n            }\n          }\n        "
): (typeof documents)["\n          mutation ParentCompanyGeneralFormUpdate(\n            $companyID: ID!\n            $generalInput: CompanyGeneralForm!\n          ) {\n            updated: parentCompanyUpdate(\n              companyID: $companyID\n              generalInput: $generalInput\n            ) {\n              id\n              general\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation CompanyGeneralFormUpdate(\n          $companyID: ID!\n          $generalInput: CompanyGeneralForm!\n        ) {\n          updated: companyUpdate(\n            companyID: $companyID\n            generalInput: $generalInput\n          ) {\n            id\n            general\n          }\n        }\n      "
): (typeof documents)["\n        mutation CompanyGeneralFormUpdate(\n          $companyID: ID!\n          $generalInput: CompanyGeneralForm!\n        ) {\n          updated: companyUpdate(\n            companyID: $companyID\n            generalInput: $generalInput\n          ) {\n            id\n            general\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query ManagerList($id: ID!) {\n          companyManagersStats(companyID: $id) {\n            id\n            name\n            email\n            claims\n            nbClients\n            nbContracts\n            lastActive\n            providerCode\n          }\n        }\n      "
): (typeof documents)["\n        query ManagerList($id: ID!) {\n          companyManagersStats(companyID: $id) {\n            id\n            name\n            email\n            claims\n            nbClients\n            nbContracts\n            lastActive\n            providerCode\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query customerReferenceAccessList($companyID: ID!, $customerID: ID!) {\n          customerReferenceAccessList(\n            companyID: $companyID\n            customerID: $customerID\n          ) {\n            manager {\n              id\n              name\n            }\n            primary\n            customer {\n              id\n              name\n              email\n            }\n          }\n        }\n      "
): (typeof documents)["\n        query customerReferenceAccessList($companyID: ID!, $customerID: ID!) {\n          customerReferenceAccessList(\n            companyID: $companyID\n            customerID: $customerID\n          ) {\n            manager {\n              id\n              name\n            }\n            primary\n            customer {\n              id\n              name\n              email\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation ManagerCreation(\n        $companyID: ID!\n        $input: ManagerCreation!\n        $claims: [ManagerClaims!]\n      ) {\n        managerCreation(companyID: $companyID, input: $input, claims: $claims) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation ManagerCreation(\n        $companyID: ID!\n        $input: ManagerCreation!\n        $claims: [ManagerClaims!]\n      ) {\n        managerCreation(companyID: $companyID, input: $input, claims: $claims) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation ManagerDeletion($companyID: ID!, $managerID: [ID!]!) {\n        managerDeletion(companyID: $companyID, managerID: $managerID)\n      }\n    "
): (typeof documents)["\n      mutation ManagerDeletion($companyID: ID!, $managerID: [ID!]!) {\n        managerDeletion(companyID: $companyID, managerID: $managerID)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation UpdateManagerProviderCode(\n        $companyID: ID!\n        $managerID: ID!\n        $input: String!\n      ) {\n        updateManagerProviderCode(\n          companyID: $companyID\n          managerID: $managerID\n          providerCode: $input\n        ) {\n          providerCode\n        }\n      }\n    "
): (typeof documents)["\n      mutation UpdateManagerProviderCode(\n        $companyID: ID!\n        $managerID: ID!\n        $input: String!\n      ) {\n        updateManagerProviderCode(\n          companyID: $companyID\n          managerID: $managerID\n          providerCode: $input\n        ) {\n          providerCode\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query ParentCompanyIntermediationForm($companyID: ID!) {\n            parentCompanyInfos(id: $companyID) {\n              intermediation\n            }\n          }\n        "
): (typeof documents)["\n          query ParentCompanyIntermediationForm($companyID: ID!) {\n            parentCompanyInfos(id: $companyID) {\n              intermediation\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query CompanyIntermediationForm($companyID: ID!) {\n          company(id: $companyID) {\n            intermediation\n          }\n        }\n      "
): (typeof documents)["\n        query CompanyIntermediationForm($companyID: ID!) {\n          company(id: $companyID) {\n            intermediation\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation ParentCompanyIntermediationFormUpdate(\n            $companyID: ID!\n            $intermediationInput: CompanyIntermediationForm!\n          ) {\n            updated: parentCompanyUpdate(\n              companyID: $companyID\n              intermediationInput: $intermediationInput\n            ) {\n              id\n              intermediation\n            }\n          }\n        "
): (typeof documents)["\n          mutation ParentCompanyIntermediationFormUpdate(\n            $companyID: ID!\n            $intermediationInput: CompanyIntermediationForm!\n          ) {\n            updated: parentCompanyUpdate(\n              companyID: $companyID\n              intermediationInput: $intermediationInput\n            ) {\n              id\n              intermediation\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation CompanyIntermediationFormUpdate(\n          $companyID: ID!\n          $intermediationInput: CompanyIntermediationForm!\n        ) {\n          updated: companyUpdate(\n            companyID: $companyID\n            intermediationInput: $intermediationInput\n          ) {\n            id\n            intermediation\n          }\n        }\n      "
): (typeof documents)["\n        mutation CompanyIntermediationFormUpdate(\n          $companyID: ID!\n          $intermediationInput: CompanyIntermediationForm!\n        ) {\n          updated: companyUpdate(\n            companyID: $companyID\n            intermediationInput: $intermediationInput\n          ) {\n            id\n            intermediation\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          query ParentCompanyLegalForm($companyID: ID!) {\n            parentCompanyInfos(id: $companyID) {\n              legal\n            }\n          }\n        "
): (typeof documents)["\n          query ParentCompanyLegalForm($companyID: ID!) {\n            parentCompanyInfos(id: $companyID) {\n              legal\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        query CompanyLegalForm($companyID: ID!) {\n          company(id: $companyID) {\n            legal\n          }\n        }\n      "
): (typeof documents)["\n        query CompanyLegalForm($companyID: ID!) {\n          company(id: $companyID) {\n            legal\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n          mutation ParentCompanyLegalFormUpdate(\n            $companyID: ID!\n            $legalInput: CompanyLegalForm!\n          ) {\n            updated: parentCompanyUpdate(\n              companyID: $companyID\n              legalInput: $legalInput\n            ) {\n              id\n              legal\n            }\n          }\n        "
): (typeof documents)["\n          mutation ParentCompanyLegalFormUpdate(\n            $companyID: ID!\n            $legalInput: CompanyLegalForm!\n          ) {\n            updated: parentCompanyUpdate(\n              companyID: $companyID\n              legalInput: $legalInput\n            ) {\n              id\n              legal\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n        mutation CompanyLegalFormUpdate(\n          $companyID: ID!\n          $legalInput: CompanyLegalForm!\n        ) {\n          updated: companyUpdate(\n            companyID: $companyID\n            legalInput: $legalInput\n          ) {\n            id\n            legal\n          }\n        }\n      "
): (typeof documents)["\n        mutation CompanyLegalFormUpdate(\n          $companyID: ID!\n          $legalInput: CompanyLegalForm!\n        ) {\n          updated: companyUpdate(\n            companyID: $companyID\n            legalInput: $legalInput\n          ) {\n            id\n            legal\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query CompanySettings($companyID: ID!) {\n        company(id: $companyID) {\n          managerList {\n            id\n            name\n            email\n            phone\n          }\n          logo\n        }\n        authenticated {\n          id\n          manager {\n            id\n            name\n            email\n            companyList {\n              id\n              name\n              logo\n            }\n          }\n        }\n        companyManagersStats(companyID: $companyID) {\n          id\n          name\n          email\n          claims\n          nbClients\n          nbContracts\n          lastActive\n        }\n      }\n    "
): (typeof documents)["\n      query CompanySettings($companyID: ID!) {\n        company(id: $companyID) {\n          managerList {\n            id\n            name\n            email\n            phone\n          }\n          logo\n        }\n        authenticated {\n          id\n          manager {\n            id\n            name\n            email\n            companyList {\n              id\n              name\n              logo\n            }\n          }\n        }\n        companyManagersStats(companyID: $companyID) {\n          id\n          name\n          email\n          claims\n          nbClients\n          nbContracts\n          lastActive\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation CompanyDeletion($companyID: ID!) {\n        companyDeletion(companyID: $companyID)\n      }\n    "
): (typeof documents)["\n      mutation CompanyDeletion($companyID: ID!) {\n        companyDeletion(companyID: $companyID)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ParentCompanySubsidiaries($id: ID!) {\n        parentCompany(id: $id) {\n          companies {\n            id\n            name\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query ParentCompanySubsidiaries($id: ID!) {\n        parentCompany(id: $id) {\n          companies {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ParentCompanyWealth($id: ID!) {\n        parentCompany(id: $id) {\n          wealth\n          # performance(computing: under_managements) {\n          #   gain\n          #   evolution\n          # }\n        }\n      }\n    "
): (typeof documents)["\n      query ParentCompanyWealth($id: ID!) {\n        parentCompany(id: $id) {\n          wealth\n          # performance(computing: under_managements) {\n          #   gain\n          #   evolution\n          # }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ParentCompanyAdmins($id: ID!) {\n        parentCompany(id: $id) {\n          admins {\n            id\n            email\n            name\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query ParentCompanyAdmins($id: ID!) {\n        parentCompany(id: $id) {\n          admins {\n            id\n            email\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ParentCompanyHome(\n        $id: ID!\n        $filter: NotificationFilter\n        $taskFilter: CompanyTaskFilter\n      ) {\n        parentCompany(id: $id) {\n          tasks(filter: $taskFilter) {\n            lateCount\n            edges {\n              id\n              title\n              category\n              content\n              updated\n              schedule\n              created\n              completed\n              customer {\n                id\n                name\n              }\n              company {\n                id\n                name\n              }\n              manager {\n                id\n                name\n              }\n            }\n          }\n          notifications(filter: $filter) {\n            id\n            type\n            data\n            updated\n            company {\n              id\n              name\n            }\n          }\n          wealth\n          managedWealth: wealth(computing: under_managements)\n          liquidity\n          mostOccuringAssetType {\n            group\n            count\n          }\n          stats {\n            customersCount\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query ParentCompanyHome(\n        $id: ID!\n        $filter: NotificationFilter\n        $taskFilter: CompanyTaskFilter\n      ) {\n        parentCompany(id: $id) {\n          tasks(filter: $taskFilter) {\n            lateCount\n            edges {\n              id\n              title\n              category\n              content\n              updated\n              schedule\n              created\n              completed\n              customer {\n                id\n                name\n              }\n              company {\n                id\n                name\n              }\n              manager {\n                id\n                name\n              }\n            }\n          }\n          notifications(filter: $filter) {\n            id\n            type\n            data\n            updated\n            company {\n              id\n              name\n            }\n          }\n          wealth\n          managedWealth: wealth(computing: under_managements)\n          liquidity\n          mostOccuringAssetType {\n            group\n            count\n          }\n          stats {\n            customersCount\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ParentCompanyHomeCustomers($id: ID!) {\n        parentCompany(id: $id) {\n          customers(input: { take: 10 }) {\n            edges {\n              node {\n                customer {\n                  id\n                  name\n                  email\n                  type\n                }\n                wealth\n                underManagement: wealth(computing: under_managements)\n                company {\n                  id\n                }\n              }\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query ParentCompanyHomeCustomers($id: ID!) {\n        parentCompany(id: $id) {\n          customers(input: { take: 10 }) {\n            edges {\n              node {\n                customer {\n                  id\n                  name\n                  email\n                  type\n                }\n                wealth\n                underManagement: wealth(computing: under_managements)\n                company {\n                  id\n                }\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ParentCompanyClients(\n        $id: ID!\n        $input: ParentCompanyCustomersInput\n      ) {\n        parentCompany(id: $id) {\n          customers(input: $input) {\n            totalCount\n            edges {\n              node {\n                customer {\n                  id\n                  name\n                  firstName\n                  lastName\n                  email\n                }\n                wealth(computing: under_managements)\n                company {\n                  id\n                  name\n                }\n                manager {\n                  id\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query ParentCompanyClients(\n        $id: ID!\n        $input: ParentCompanyCustomersInput\n      ) {\n        parentCompany(id: $id) {\n          customers(input: $input) {\n            totalCount\n            edges {\n              node {\n                customer {\n                  id\n                  name\n                  firstName\n                  lastName\n                  email\n                }\n                wealth(computing: under_managements)\n                company {\n                  id\n                  name\n                }\n                manager {\n                  id\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ParentCompanyManagers($id: ID!) {\n        parentCompany(id: $id) {\n          companies {\n            id\n            name\n          }\n          managers {\n            manager {\n              id\n              name\n            }\n            company {\n              id\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query ParentCompanyManagers($id: ID!) {\n        parentCompany(id: $id) {\n          companies {\n            id\n            name\n          }\n          managers {\n            manager {\n              id\n              name\n            }\n            company {\n              id\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation exportCustomersParentCompany($id: ID!) {\n        url: exportCustomersParentCompany(id: $id)\n      }\n    "
): (typeof documents)["\n      mutation exportCustomersParentCompany($id: ID!) {\n        url: exportCustomersParentCompany(id: $id)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query ParentCompanyCustomer($id: ID!, $customerID: ID!) {\n        parentCompany(id: $id) {\n          customer(id: $customerID) {\n            assets {\n              name\n              group\n              accountNumber\n              activity\n              connection {\n                connector {\n                  key\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query ParentCompanyCustomer($id: ID!, $customerID: ID!) {\n        parentCompany(id: $id) {\n          customer(id: $customerID) {\n            assets {\n              name\n              group\n              accountNumber\n              activity\n              connection {\n                connector {\n                  key\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation AssignCustomersToCompany(\n        $customersID: [ID!]!\n        $parentCompanyID: ID!\n        $companyID: ID!\n        $managerID: ID!\n      ) {\n        assignCustomersToCompany(\n          customersID: $customersID\n          parentCompanyID: $parentCompanyID\n          companyID: $companyID\n          managerID: $managerID\n        )\n      }\n    "
): (typeof documents)["\n      mutation AssignCustomersToCompany(\n        $customersID: [ID!]!\n        $parentCompanyID: ID!\n        $companyID: ID!\n        $managerID: ID!\n      ) {\n        assignCustomersToCompany(\n          customersID: $customersID\n          parentCompanyID: $parentCompanyID\n          companyID: $companyID\n          managerID: $managerID\n        )\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation Login($token: String!) {\n        authenticationFirebase(token: $token) {\n          id\n          manager {\n            id\n            name\n            companyList {\n              id\n              name\n            }\n            parentCompany {\n              id\n            }\n          }\n        }\n      }\n    "
): (typeof documents)["\n      mutation Login($token: String!) {\n        authenticationFirebase(token: $token) {\n          id\n          manager {\n            id\n            name\n            companyList {\n              id\n              name\n            }\n            parentCompany {\n              id\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation InviteManager(\n        $input: ManagerCreation!\n        $company: CompanyCreation!\n      ) {\n        inviteManager(input: $input, company: $company) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation InviteManager(\n        $input: ManagerCreation!\n        $company: CompanyCreation!\n      ) {\n        inviteManager(input: $input, company: $company) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation SignUpInvite($token: String!, $id: ID!) {\n        authenticationFirebase(token: $token) {\n          id\n          provider\n          manager {\n            id\n            name\n            email\n          }\n        }\n        managerInviteAccept(id: $id) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation SignUpInvite($token: String!, $id: ID!) {\n        authenticationFirebase(token: $token) {\n          id\n          provider\n          manager {\n            id\n            name\n            email\n          }\n        }\n        managerInviteAccept(id: $id) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation SubscribeToNewsletter($input: ProfileUpdate!) {\n        profileUpdate(input: $input) {\n          id\n        }\n      }\n    "
): (typeof documents)["\n      mutation SubscribeToNewsletter($input: ProfileUpdate!) {\n        profileUpdate(input: $input) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query GetPubliFormFilling($token: String!) {\n        existingFormData(token: $token)\n      }\n    "
): (typeof documents)["\n      query GetPubliFormFilling($token: String!) {\n        existingFormData(token: $token)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query GetExternalInvestorProfileForm($customerID: ID!) {\n        externalInvestorProfileForm(customerID: $customerID)\n      }\n    "
): (typeof documents)["\n      query GetExternalInvestorProfileForm($customerID: ID!) {\n        externalInvestorProfileForm(customerID: $customerID)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation SubmitExternalInvestorProfileForm(\n        $input: PublicFormSubmit!\n        $customerID: ID!\n      ) {\n        externalInvestorProfileForm(input: $input, customerID: $customerID)\n      }\n    "
): (typeof documents)["\n      mutation SubmitExternalInvestorProfileForm(\n        $input: PublicFormSubmit!\n        $customerID: ID!\n      ) {\n        externalInvestorProfileForm(input: $input, customerID: $customerID)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      mutation SubmitPubliFormFilling(\n        $input: PublicFormSubmit!\n        $token: String!\n        $isSyncing: Boolean\n      ) {\n        formFilling(input: $input, token: $token, isSyncing: $isSyncing)\n      }\n    "
): (typeof documents)["\n      mutation SubmitPubliFormFilling(\n        $input: PublicFormSubmit!\n        $token: String!\n        $isSyncing: Boolean\n      ) {\n        formFilling(input: $input, token: $token, isSyncing: $isSyncing)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query PublicCustomerWealth(\n        $token: String!\n        $financialTypes: [AssetGroup!]\n        $passiveTypes: [AssetGroup!]\n        $nonFinancialTypes: [AssetGroup!]\n        $benefitsTypes: [AssetGroup!]\n        $repartitionTypes: [AssetGroup!]\n        $othersTypes: [AssetGroup!]\n        $computing: WealthFilter\n      ) {\n        financialWealth: publicCustomerWealth(\n          token: $token\n          groups: $financialTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            metadata\n            valuation\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        nonfinancialWealth: publicCustomerWealth(\n          token: $token\n          groups: $nonFinancialTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        othersWealth: publicCustomerWealth(\n          token: $token\n          groups: $othersTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        passiveWealth: publicCustomerWealth(\n          token: $token\n          groups: $passiveTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            underManagement\n            isManual\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        benefitsWealth: publicCustomerWealth(\n          token: $token\n          groups: $benefitsTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            underManagement\n            isManual\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        repartition: publicCustomerWealth(\n          token: $token\n          groups: $repartitionTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n        }\n      }\n    "
): (typeof documents)["\n      query PublicCustomerWealth(\n        $token: String!\n        $financialTypes: [AssetGroup!]\n        $passiveTypes: [AssetGroup!]\n        $nonFinancialTypes: [AssetGroup!]\n        $benefitsTypes: [AssetGroup!]\n        $repartitionTypes: [AssetGroup!]\n        $othersTypes: [AssetGroup!]\n        $computing: WealthFilter\n      ) {\n        financialWealth: publicCustomerWealth(\n          token: $token\n          groups: $financialTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            metadata\n            valuation\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        nonfinancialWealth: publicCustomerWealth(\n          token: $token\n          groups: $nonFinancialTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        othersWealth: publicCustomerWealth(\n          token: $token\n          groups: $othersTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            valuation\n            underManagement\n            isManual\n            sri\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        passiveWealth: publicCustomerWealth(\n          token: $token\n          groups: $passiveTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            underManagement\n            isManual\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        benefitsWealth: publicCustomerWealth(\n          token: $token\n          groups: $benefitsTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n          data: assets(computing: $computing) {\n            id\n            name\n            group\n            categoryName\n            underManagement\n            isManual\n            valuation\n            metadata\n            owners {\n              entity {\n                id\n              }\n              ownership\n            }\n          }\n        }\n        repartition: publicCustomerWealth(\n          token: $token\n          groups: $repartitionTypes\n          computing: $computing\n        ) {\n          name: group\n          amount: valuation\n        }\n      }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
