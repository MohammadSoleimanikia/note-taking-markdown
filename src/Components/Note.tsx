import { Link, useNavigate } from "react-router-dom";
import { useNote } from "./NoteLayout";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";
type NoteProps = {
    onDelete: (id: string) => void;
};
export default function Note({ onDelete }: NoteProps) {
    const note = useNote();
    const navigate = useNavigate();
    return (
        <>
            <header className=" mb-4 flex justify-between items-center">
                <div>
                    <h1 className="title">{note.title}</h1>
                    <div className=" flex gap-1 flex-wrap">
                        {note.tags?.map((tag) => {
                            return (
                                <Badge className="truncate" key={tag.id}>
                                    {tag.label}
                                </Badge>
                            );
                        })}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link to={`/${note.id}/edit`}>
                        <Button>ویرایش</Button>
                    </Link>
                    <Button
                        onClick={() => {
                            onDelete(note.id);
                            navigate("/");
                        }}
                        variant={"destructive"}
                    >
                        حذف
                    </Button>
                    <Link to={".."}>
                        <Button variant={"secondary"}>بازگشت</Button>
                    </Link>
                </div>
            </header>
            <div
                className="prose max-w-none"
                style={{
                    // add for support one line break
                    whiteSpace: "pre-wrap",
                }}
            >
                <ReactMarkdown>
                    {note.markdown}
                </ReactMarkdown>
            </div>
        </>
    );
}
