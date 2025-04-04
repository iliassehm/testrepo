import { graphql } from "../../../../../../types";

export namespace TaskLogic {
  export function queries() {
    return graphql(`
      query listCustomerTask($companyID: ID!, $customerID: ID!) {
        listCustomerTask(companyID: $companyID, customerID: $customerID) {
          id
          title
          category
          contractNumber
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
    `);
  }

  export function listCompanyTaskByType() {
    return graphql(`
      query ListCompanyTaskByType($companyID: ID!, $filter: CompanyTaskFilter) {
        listCompanyTaskByType(companyID: $companyID, filter: $filter) {
          categories {
            type
            count
            tasks {
              id
              title
              category
              contractNumber
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
            }
          }
          managers {
            type
            count
            tasks {
              id
              title
              category
              contractNumber
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
            }
          }
        }
      }
    `);
  }
  export function fetchSingleTask() {
    return graphql(`
      query Task($id: ID!, $companyID: ID!) {
        fetchSingleTask(id: $id, companyID: $companyID) {
          id
          title
          category
          contractNumber
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
        }
      }
    `);
  }
  export function companyTaskSearch() {
    return graphql(`
      query CompanyTaskSearch($companyID: ID!, $filter: CompanyTaskFilter) {
        companyTaskSearch(companyID: $companyID, filter: $filter) {
          count
          tasks {
            id
            title
            category
            contractNumber
            content
            updated
            schedule
            created
            completed
            managerName
            customerName
            customerId
          }
        }
      }
    `);
  }
  export function companyTaskCountByStatus() {
    return graphql(`
      query CompanyTaskCountByStatus(
        $companyID: ID!
        $filter: CompanyTaskFilter
      ) {
        companyTaskCountByStatus(companyID: $companyID, filter: $filter) {
          status
          count
        }
      }
    `);
  }
  export function companyTaskCountByCategories() {
    return graphql(`
      query CompanyTaskCountByCategories(
        $companyID: ID!
        $filter: CompanyTaskFilter
      ) {
        companyTaskCountByCategories(companyID: $companyID, filter: $filter) {
          category
          count
        }
      }
    `);
  }
  export function companyTaskCountByManagers() {
    return graphql(`
      query CompanyTaskCountByManagers(
        $companyID: ID!
        $filter: CompanyTaskFilter
      ) {
        companyTaskCountByManagers(companyID: $companyID, filter: $filter) {
          id
          name
          count
        }
      }
    `);
  }

  export function taskCategoryList() {
    return graphql(`
      query TaskCategoryList($companyID: ID!) {
        taskCategoryList(companyID: $companyID) {
          key
          name
          default
        }
      }
    `);
  }

  export function createTaskCategory() {
    return graphql(`
      mutation CreateTaskCategory($companyID: ID!, $input: TaskCategoryInput!) {
        createTaskCategory(companyID: $companyID, input: $input) {
          key
          name
          default
        }
      }
    `);
  }

  export function assetsAccountNumbers() {
    return graphql(`
      query AssetsAccountNumbers($companyID: ID!, $customerID: ID!) {
        accountNumbers: assetsAccountNumbers(
          companyID: $companyID
          customerID: $customerID
        ) {
          value
          label
        }
      }
    `);
  }

  export function CustomersList() {
    return graphql(`
      query CustomersList($companyID: ID!, $input: CustomersInput) {
        company(id: $companyID) {
          id
          customerList(input: $input) {
            totalCount
            edges {
              node {
                id
                name
                lastName
                firstName
              }
            }
          }
        }
      }
    `);
  }

  export function exportTasks() {
    return graphql(`
      mutation exportTasks($companyID: ID!, $customerID: ID) {
        url: exportTasks(companyID: $companyID, customerID: $customerID)
      }
    `);
  }

  export function completedTask() {
    return graphql(`
      mutation completedTask($taskId: ID!) {
        completedTask(taskId: $taskId) {
          id
          content
          updated
          schedule
          created
          completed
        }
      }
    `);
  }

  export function createTask() {
    return graphql(`
      mutation createTask(
        $companyID: ID!
        $customerID: ID!
        $input: TaskInput!
      ) {
        createTask(
          companyID: $companyID
          customerID: $customerID
          input: $input
        ) {
          id
          title
          category
          contractNumber
          content
          updated
          schedule
          created
          completed
        }
      }
    `);
  }

  export function updateTask() {
    return graphql(`
      mutation updateTask($taskId: ID!, $companyID: ID!, $input: TaskInput!) {
        updateTask(taskId: $taskId, companyID: $companyID, input: $input) {
          id
          title
          category
          contractNumber
          content
          created
          updated
        }
      }
    `);
  }
}
