import type { NoteData, Tag } from "@/App";
import NoteForm from "./NoteForm";
type NewNoteProps = {
    onSubmit: (data: NoteData) => void;
    onAddTag: (tag: Tag) => void;
    availableTags: Tag[];
};
export default function NewNote({
    onSubmit,
    onAddTag,
    availableTags,
}: NewNoteProps) {
    return (
        <>
            <header>
                <h1 className="title">یادداشت جدید</h1>
            </header>
            <NoteForm
                onSubmit={onSubmit}
                onAddTag={onAddTag}
                availableTags={availableTags}
            />
        </>
    );
}
