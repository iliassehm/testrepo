import { Dispatch, SetStateAction, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { downloadFile } from "../../../../../../helpers/downloadFile";
import { gql } from "../../../../../../service/client";
import { NoteState } from "./note";
import { NoteLogic } from "./note.logic";

export const useNotes = (
  companyId: string,
  customerId: string,
  noteState: NoteState,
  setNoteState: Dispatch<SetStateAction<NoteState>>
) => {
  const queryClient = useQueryClient();
  const queryKey = ["listNote", companyId, customerId];

  const { data: notesData, refetch } = useQuery(queryKey, () =>
    gql.client.request(NoteLogic.queries(), {
      companyID: companyId,
      customerID: customerId,
    })
  );

  const { mutate: exportNotes, isLoading: isExportingNotes } = useMutation(
    () =>
      gql.client.request(NoteLogic.exportNotes(), {
        companyID: companyId,
        customerID: customerId,
      }),
    {
      onSuccess: (response) => {
        if (response?.url) {
          downloadFile(response.url, `notes`);
        }
        queryClient.invalidateQueries(queryKey);
      },
    }
  );

  const createNote = useMutation(
    ({ content }: { content: string }) =>
      gql.client.request(NoteLogic.createNote(), { content, companyID: companyId, customerID: customerId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
        setNoteState({ ...noteState, text: "", id: "", edit: false });
      },
    }
  );

  const deleteNote = useMutation(
    ({ noteId }: { noteId: string }) =>
      gql.client.request(NoteLogic.deleteNote(), { noteId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );

  const updateNote = useMutation(
    ({ noteId, content }: { noteId: string; content: string }) =>
      gql.client.request(NoteLogic.updateNote(), { noteId, content }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
        setNoteState({ ...noteState, text: "", id: "", edit: false });
      },
    }
  );

  const handleAddNote = () => {
    createNote.mutate({ content: noteState.text });
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote.mutate({ noteId });
  };

  const handleUpdateNote = (note: any) => {
    setNoteState({ ...noteState, text: note.content, id: note.id, edit: true });
  };

  const submitUpdateNote = () => {
    updateNote.mutate({ content: noteState.text, noteId: noteState.id });
  };

  return {
    listNote: notesData?.listNote,
    exportNotes,
    isExportingNotes,
    handleAddNote,
    handleDeleteNote,
    handleUpdateNote,
    submitUpdateNote,
  };
};
