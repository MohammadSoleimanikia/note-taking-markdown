import type { Tag } from "@/App";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
type EditTagsModalProps = {
    availableTags: Tag[];
    updateTag:(id:string,label:string)=>void;
    deleteTag:(id:string)=>void;
};
export function EditModal({ availableTags,deleteTag,updateTag }: EditTagsModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button  variant="outline">اصلاح تگ ها</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-4">اصلاح تگ ها</DialogTitle>
                    <DialogDescription>
                        <form onSubmit={(e)=>e.preventDefault()} className="flex flex-col gap-3">
                            {availableTags.map((tag) => {
                                return (
                                    <div className="flex gap-3">
                                        <Input
                                            key={tag.id}
                                            defaultValue={tag.label}
                                            onChange={e=>updateTag(tag.id,e.target.value) }
                                        />
                                        <Button onClick={()=>deleteTag(tag.id)} className="text-red-500 border border-red-500 bg-white hover:bg-red-500 hover:text-white">
                                            &times;
                                        </Button>
                                    </div>
                                );
                            })}
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
            
        </Dialog>
    );
}
