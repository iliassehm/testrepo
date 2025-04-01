import { Cross2Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { useParams } from "@tanstack/react-router";
import React, { useCallback, useState } from "react";

import { Button, Icon } from "../../../../../../components";
import ContentWithLineBreaks from "../../../../../../components/ContentWithLineBreaks/ContentWithLineBreaks";
import { Text } from "../../../../../../components/Text";
import { formatIsoDateToShortDateTime } from "../../../../../../helpers/date";
import { useCurrentRoute } from "../../../../../../hooks/useCurrentRoute";
import { FieldTextarea } from "../../../../../../UIComponents/FieldTextarea/FieldTextarea";
import { useNotes } from "./useNotes";

export interface NoteState {
  text: string;
  id: string;
  edit: boolean;
}
const Notes = () => {
  const currentRoute = useCurrentRoute();
  const { companyId, customerId } = useParams({
    from: currentRoute.routeId,
  }) as { companyId: string; customerId: string };
  const [noteState, setNoteState] = useState({ text: "", id: "", edit: false });
  const {
    listNote,
    exportNotes,
    isExportingNotes,
    handleAddNote,
    handleDeleteNote,
    handleUpdateNote,
    submitUpdateNote,
  } = useNotes(companyId, customerId, noteState, setNoteState);

  const handleChangeNoteText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNoteState((prevState) => ({ ...prevState, text: e.target.value }));
    },
    []
  );

  return (
    <div className="min-h-[300px] max-h-[300px] xl:max-h-none flex flex-col gap-4 pt-4 w-full">
      <div className="flex justify-between w-full">
        <Text as="label" label="forms.note" className="text-xl font-bold" />
        <Button
          loading={isExportingNotes}
          label=""
          variant="bordered"
          className="flex items-center justify-center px-3 rounded-md"
          onClick={() => exportNotes()}
        >
          <Icon type="download" className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto max-h-[300px] gap-1.5 flex flex-col mt-4 max-w-full">
        {listNote?.map((item, index) => (
          <div
            className="flex gap-2 border rounded-lg border-stone-100 bg-stone-100"
            key={index}
          >
            <div className="flex items-center justify-between rounded-lg w-full px-4 h-min-14 max-w-full">
              <div className="flex flex-col w-5/6 max-w-5/6">
                <div>
                  <ContentWithLineBreaks content={item.content ?? ""} />
                </div>
                <div>
                  <label className="text-xs xl-w:text-sm  text-gray-400">
                    {formatIsoDateToShortDateTime(item.created)}
                  </label>
                </div>
              </div>
              <div className="flex items-center w-1/6">
                <Cross2Icon
                  className="w-5 h-5 cursor-pointer mr-2"
                  onClick={() => handleDeleteNote(item.id)}
                />
                <Pencil1Icon
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => handleUpdateNote(item)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex relative">
        <FieldTextarea
          name="note"
          value={noteState.text}
          onChange={handleChangeNoteText}
          style={{ resize: "none" }}
        />
        <div
          className="absolute cursor-pointer right-0 bottom-0 top-0 h-full flex items-center justify-center"
          onClick={() => {
            if (noteState.text === "") return;

            noteState.edit ? submitUpdateNote() : handleAddNote();
          }}
        >
          <i className="mr-2 pi pi-send text-sm text-blue-800" />
        </div>
      </div>
    </div>
  );
};

export default Notes;
