"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Pencil, MoreHorizontal } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DeleteNoteButton from "@/components/delete-button/note/delete-note-button";
import NoteForm from "@/components/forms/note/note-form";
import { Note } from "@/db/schema";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<Note>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "content",
    header: "Content",
  },

  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => formatDate(row.original.updatedAt),
  },

  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const note = row.original;

      return (
        <div className="flex justify-end">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <DialogTrigger asChild>
                    <button className="w-full flex items-center gap-2 text-sm">
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                  </DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <DeleteNoteButton noteId={note.id} endpoint="/api/note" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Note</DialogTitle>
                <NoteForm note={note} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
