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
import ReactMarkdown from "react-markdown";

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
    const [isMarkDown, setIsMarkDown] = useState(false);
    const [markDownText, setMarkDownText] = useState(markdown);
    const [titleText, setTitleText] = useState(title);

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
    const togglePreview = () => {
        if (markdownRef.current) {
            setMarkDownText(markdownRef.current.value);
        }
        setIsMarkDown((prevIsMarkDown) => !prevIsMarkDown);
    };
    return (
        <div>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <Label className="mb-2" htmlFor="title">
                            title
                        </Label>
                        <Input
                            ref={titleRef}
                            id="title"
                            required
                            defaultValue={titleText}
                        />
                    </div>
                    <div>
                        <Label className="mb-2" htmlFor="tag">
                            Tags
                        </Label>
                        <CreatableSelect
                            // add new tag
                            onCreateOption={(label) => {
                                const newTag = { id: uuidv4(), label };
                                onAddTag(newTag);
                                setSelectedTags((prev) => [...prev, newTag]);
                            }}
                            placeholder="Select tag "
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
                                    }),
                                );
                            }}
                        />
                    </div>
                </div>
                <div className="mb-3 ">
                    {isMarkDown && (
                        <>
                            <Label htmlFor="preview" className="mb-4">
                               Preview{" "}
                            </Label>
                            <div className="prose max-w-none h-52 overflow-x-auto bg-slate-100 rounded-sm p-1">
                                <ReactMarkdown>{markDownText}</ReactMarkdown>
                            </div>
                        </>
                    )}
                    {!isMarkDown && (
                        <div>
                            <Label htmlFor="body" className="mb-4">
                                MarkDown
                            </Label>
                            <Textarea
                                ref={markdownRef}
                                id="body"
                                className="h-52"
                                required
                                defaultValue={markDownText}
                            />
                        </div>
                    )}
                    <div className="flex-1"></div>
                </div>
                <div className="flex gap-5">
                    <Button type="submit">Save</Button>
                    <Link to="..">
                        <Button variant={"outline"}>Cancel</Button>
                    </Link>
                    <Button
                        onClick={togglePreview}
                        type="button"
                        variant={"outline"}
                    >
                        {isMarkDown && "MarkDown"}
                        {!isMarkDown && "Preview"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
