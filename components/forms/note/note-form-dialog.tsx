"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";
import NoteForm from "./note-form";

export default function NoteDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild className="justify-end">
        <Button>
          Add Note <PlusCircleIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription>Add a new note to the database.</DialogDescription>
          <NoteForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
