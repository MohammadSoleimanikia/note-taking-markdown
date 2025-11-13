import { Navigate, Route, Routes } from "react-router-dom";
import NewNote from "./Components/NewNote";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "./useLocalStorage";
import { useMemo } from "react";
import NoteList from "./Components/NoteList";
import NoteLayout from "./Components/NoteLayout";
import Note from "./Components/Note";
import EditNote from "./Components/EditNote";
export type Note = {
    id: string;
} & NoteData;
export type RawNote = {
    id: string;
} & RawNoteData;
export type RawNoteData = {
    title: string;
    markdown: string;
    tagIds: string[];
};
export type NoteData = {
    title: string;
    markdown: string;
    tags: Tag[];
};
export type Tag = {
    id: string;
    label: string;
};
function App() {
    const [notes, setNotes] = useLocalStorage<RawNote[]>("Notes", []);
    const [tags, setTags] = useLocalStorage<Tag[]>("Tags", []);
    // convert raw notes to actual notes
    const notesWithTags = useMemo(() => {
        return notes.map((note) => {
            return {
                ...note,
                tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
            };
        });
    }, [notes, tags]);
    function onCreateNote({ tags, ...data }: NoteData) {
        setNotes((prevNotes) => {
            return [
                ...prevNotes,
                { ...data, id: uuidv4(), tagIds: tags.map((tag) => tag.id) },
            ];
        });
    }

    function onUpdateNote(id: string, { tags, ...data }: NoteData) {
        setNotes((prevNotes) => {
            return prevNotes.map((note) => {
                if (note.id === id) {
                    return {
                        ...note,
                        ...data,
                        tagIds: tags.map((tag) => tag.id),
                    };
                } else {
                    return note;
                }
            });
        });
    }

    function onDelete(id: string) {
        setNotes((prevNotes) => {
            return prevNotes.filter((note) => note.id !== id);
        });
    }

    function addTag(tag: Tag) {
        setTags((prev) => [...prev, tag]);
    }

    function updateTag(id: string, label: string) {
        setTags((prevTags) => {
            return prevTags.map((tag) => {
                if (tag.id === id) {
                    return { ...tag, label };
                } else {
                    return tag;
                }
            });
        });
    }

    function deleteTag(id: string) {
        setTags((prevTags) => {
            return prevTags.filter((tag) => tag.id !== id);
        });
    }
    return (
        <div className="container my-4 px-1 mx-auto text-nowrap ">
            <Routes>
                <Route
                    path="/"
                    element={
                        <NoteList
                            notes={notesWithTags}
                            availableTags={tags}
                            updateTag={updateTag}
                            deleteTag={deleteTag}
                        />
                    }
                />
                <Route
                    path="/new"
                    element={
                        <NewNote
                            onSubmit={onCreateNote}
                            onAddTag={addTag}
                            availableTags={tags}
                        />
                    }
                />
                {/* layout is same for show and edit pages */}
                <Route
                    path="/:id"
                    element={<NoteLayout notes={notesWithTags} />}
                >
                    <Route index element={<Note onDelete={onDelete} />} />
                    <Route
                        path="edit"
                        element={
                            <EditNote
                                onSubmit={onUpdateNote}
                                onAddTag={addTag}
                                availableTags={tags}
                            />
                        }
                    />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;
