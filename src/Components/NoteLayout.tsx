import type { Note } from "@/App"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"

type NoteLayoutProps={
    notes:Note[]
}
export default function NoteLayout({notes}:NoteLayoutProps){
    const {id}=useParams()
    const note=notes.find(note=> note.id=== id)
    // use replace for when we hit back btn it doesn't back us to page that didn't exists
    if(note==null) return <Navigate to="/" replace/>
    // pass note as  context to child routes (edit and show)
    return <Outlet context={note}/>
}

export function useNote (){
    return useOutletContext <Note> ()
}