// app/(applications)/page.tsx

import { columns } from "@/components/note/noteColumns";
import { DataTable } from "@/components/data-table";
import { Note } from "@/utils/types";
import { NoteForm } from "@/components/note/noteForm";

async function getNotes(): Promise<Note[]> {
  const res = await fetch("http://localhost:3000/api/note/note", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default async function NotePage() {
  const apps = await getNotes();

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Aplicações</h1>
      <NoteForm />
      <DataTable columns={columns} data={apps} />
    </main>
  );
}