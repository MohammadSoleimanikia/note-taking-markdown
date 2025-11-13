import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "react-select";
import { useMemo, useState } from "react";
import type { Tag } from "@/App";

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { EditModal } from "./EditTagsModal";



type SimplifiedNote = {
    tags: Tag[];
    title: string;
    id: string;
};
type NoteListProps = {
    availableTags: Tag[];
    notes: SimplifiedNote[];
    updateTag:(id:string,label:string)=>void;
    deleteTag:(id:string)=>void;
};

export default function NoteList({ availableTags, notes,updateTag,deleteTag }: NoteListProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState("");

    const filteredNotes = useMemo(() => {
        return notes.filter((note) => {
            return (
                (title === "" ||
                    note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.length === 0 ||
                    selectedTags.every((tag) =>
                        note.tags.some((noteTag) => noteTag.id == tag.id)
                    ))
            );
        });
    }, [title, selectedTags, notes]);

    return (
        <>
            <header className="flex justify-between items-baseline mb-4">
                <h1 className="title">یادداشت ها</h1>

                <div className="flex gap-3">
                    <Link to={"/new"}>
                        <Button>ایجاد</Button>
                    </Link>
                    <EditModal updateTag={updateTag} deleteTag={deleteTag} availableTags={availableTags} />
                </div>
            </header>

            <form className="flex flex-col mb-5 gap-5 sm:flex-row sm:items-end">
                <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
                    <Label htmlFor="title">عنوان</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />
                </div>

                <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
                    <Label htmlFor="tag">تگ</Label>
                    <Select
                        placeholder="انتخاب تگ "
                        id="tag"
                        isMulti
                        value={selectedTags.map((tag) => {
                            return { label: tag.label, value: tag.id };
                        })}
                        options={availableTags.map((tag) => {
                            return { label: tag.label, value: tag.id };
                        })}
                        onChange={(tags) => {
                            setSelectedTags(
                                tags.map((tag) => {
                                    // creatable select values are saved in an array of objects {value,label}
                                    return {
                                        label: tag.label,
                                        id: tag.value,
                                    };
                                })
                            );
                        }}
                    />
                </div>
            </form>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredNotes.map((note) => (
                    <NoteCard
                        key={note.id}
                        id={note.id}
                        title={note.title}
                        tags={note.tags}
                    />
                ))}
            </div>
        </>
    );
}

export function NoteCard({ id, title, tags }: SimplifiedNote) {
    return (
        <Link to={`/${id}`}>
            <Card className="flex flex-col justify-between transition duration-500 hover:-translate-y-2 hover:shadow-xl min-h-48">
                <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent className=" flex justify-center gap-1 flex-wrap">
                    {tags.map((tag) => {
                        return (
                            <Badge className="truncate" key={tag.id}>
                                {tag.label}
                            </Badge>
                        );
                    })}
                </CardContent>
            </Card>
        </Link>
    );
}


