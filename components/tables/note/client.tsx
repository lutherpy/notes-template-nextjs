import { getNotes } from "@/services/note";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import DeleteNoteButton from "@/components/delete-button/note/delete-note-button";
import NoteForm from "@/components/forms/note/note-form";
import { Note } from "@/db/schema";

export default async function NotesTable() {
  const notes = await getNotes();

  return (
    <Table>
      <TableCaption>A list notes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Title</TableHead>
          <TableHead>Notename</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>User ID</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notes.map((note: Note) => (
          <TableRow key={note.id}>
            <TableCell className="font-medium">{note.title}</TableCell>
            <TableCell>{note.content}</TableCell>
            <TableCell>{note.createdAt?.toLocaleString()}</TableCell>
            <TableCell>{note.userId}</TableCell>
            <TableCell className="text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost">
                    <Pencil className="size-4" />
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Note</DialogTitle>
                    <NoteForm note={note} />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <DeleteNoteButton noteId={note.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
