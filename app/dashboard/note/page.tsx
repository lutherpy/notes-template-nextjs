import NotesTable from "@/components/tables/note/notes-table";

import NoteDialog from "@/components/forms/note/note-form-dialog";

export default async function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Notes</h1>

      <div className="flex justify-end">
        <NoteDialog />
      </div>

      <NotesTable />
    </main>
  );
}
