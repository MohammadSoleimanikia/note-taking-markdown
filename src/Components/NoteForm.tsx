import { Input } from "./ui/input";
import { Label } from "./ui/label";
import CreatableSelect from "react-select/creatable";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useRef, useState, type FormEvent } from "react";
import { type Tag, type NoteData } from "@/App";

type NoteFormProp = {
    onSubmit: (data: NoteData) => void;
    onAddTag: (tag: Tag) => void;
    availableTags: Tag[];
    // add partial to make the properties on Note Data optional cause we only need then in editNote
} & Partial<NoteData>;
export default function NoteForm({
    onSubmit,
    onAddTag,
    availableTags,
    title = "",
    markdown = "",
    tags = [],
}: NoteFormProp) {
    const navigate = useNavigate();
    const titleRef = useRef<HTMLInputElement>(null);
    const markdownRef = useRef<HTMLTextAreaElement>(null);

    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({
            // use ! to say we handle null with using required on input
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags,
        });
        // navigate to prev page
        navigate("..");
    };
    
    return (
        <div>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <Label className="mb-2" htmlFor="title">
                            عنوان
                        </Label>
                        <Input
                            ref={titleRef}
                            id="title"
                            required
                            defaultValue={title}
                        />
                    </div>
                    <div>
                        <Label className="mb-2" htmlFor="tag">
                            تگ ها
                        </Label>
                        <CreatableSelect
                            // add new tag
                            onCreateOption={(label) => {
                                const newTag = { id: uuidv4(), label };
                                onAddTag(newTag);
                                setSelectedTags((prev) => [...prev, newTag]);
                            }}
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
                </div>
                <div>
                    <Label className="mb-2" htmlFor="body">
                        متن{" "}
                    </Label>
                    <Textarea
                        ref={markdownRef}
                        id="body"
                        className="h-52"
                        required
                        defaultValue={markdown}
                    />
                </div>
                <div className="flex gap-5">
                    <Button type="submit">ذخیره</Button>
                    <Link to="..">
                        <Button variant={"outline"}>انصراف</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
