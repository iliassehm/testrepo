import { graphql } from "../../../../../../types";

export namespace NoteLogic {
  export function queries() {
    return graphql(`
      query listNote($companyID: ID!, $customerID: ID!) {
        listNote(companyID: $companyID, customerID: $customerID) {
          id
          content
          created
          updated
        }
      }
    `);
  }

  export function exportNotes() {
    return graphql(`
      mutation exportNotes($companyID: ID!, $customerID: ID!) {
        url: exportNotes(companyID: $companyID, customerID: $customerID)
      }
    `);
  }

  export function deleteNote() {
    return graphql(`
      mutation deleteNote($noteId: ID!) {
        deleteNote(noteId: $noteId) {
          id
          content
          created
          updated
        }
      }
    `);
  }

  export function createNote() {
    return graphql(`
      mutation createNote(
        $companyID: ID!
        $customerID: ID!
        $content: String!
      ) {
        createNote(
          companyID: $companyID
          customerID: $customerID
          content: $content
        ) {
          id
          content
          created
          updated
        }
      }
    `);
  }

  export function updateNote() {
    return graphql(`
      mutation updateNote($noteId: ID!, $content: String!) {
        updateNote(noteId: $noteId, content: $content) {
          id
          content
          created
          updated
        }
      }
    `);
  }
}
