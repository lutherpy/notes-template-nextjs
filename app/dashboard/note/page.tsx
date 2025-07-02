// app/dashboard/note/page.tsx
"use client";

import NoteDialog from "@/components/forms/note/note-form-dialog";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/note/columns";
import { useNotes } from "@/hooks/useNotes";
import { Loader2 } from "lucide-react";
import Loading from "@/components/loading/loading";

export default function Home() {
  const { notes, isLoading, isError } = useNotes();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
        {/* Uncomment the line below to show a spinning loader icon */}
        {/* <Loader2 className="size-4 animate-spin" /> */}
      </div>
    );
  if (isError)
    return (
      <p className="flex items-center justify-center h-screen">
        Erro ao carregar notas.
      </p>
    );

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Notes</h1>

      <div className="flex justify-start">
        <NoteDialog />
      </div>

      <DataTable columns={columns} data={notes} />
    </main>
  );
}
