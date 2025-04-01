import { graphql } from "../../../../types";

export namespace CompanyHomeLogic {
  export function queries() {
    return graphql(`
      query Home(
        $companyID: ID!
        $input: CustomersInput
        $campaignLimit: Int
        $projectRange: TimeRange!
        $taskFilter: CompanyTaskFilter
        $projectValidated: Boolean
        $projectLimit: Int
      ) {
        listCompanyTask(companyID: $companyID, filter: $taskFilter) {
          lateCount
          edges {
            id
            title
            category
            content
            updated
            schedule
            created
            completed
            customer {
              id
              name
            }
            company {
              id
              name
            }
            assigned_manager {
              id
              name
            }
            entityRelatedId
            entityRelatedType
          }
        }
        projectCompanyList(
          companyID: $companyID
          range: $projectRange
          validated: $projectValidated
          limit: $projectLimit
        ) {
          id
          created
          validated
          archived
          name
          type
          metadata
          customer {
            id
            name
          }
        }
        company(id: $companyID) {
          id
          customerList(input: $input) {
            totalCount
            edges {
              node {
                id
                name
                firstName
                lastName
                email
                type
                wealth(companyID: $companyID)
                underManagement: wealth(
                  companyID: $companyID
                  computing: under_managements
                )
              }
            }
          }
        }
        customersCompliance(company: $companyID) {
          category {
            key
            name
          }
          levels {
            valid
            unvalid
            waiting
          }
        }

        campaigns: campaignList(companyID: $companyID, limit: $campaignLimit) {
          name
        }

        liquidity: globalLiquidity(companyID: $companyID)
        mostOccuringAssetType(companyID: $companyID) {
          group
          count
        }
      }
    `);
  }
  export function notificationList() {
    return graphql(`
      query NotificationList($companyID: ID!, $filter: NotificationFilter) {
        notificationList(companyID: $companyID, filter: $filter) {
          id
          type
          data
          updated
          company {
            id
            name
          }
        }
      }
    `);
  }
}
