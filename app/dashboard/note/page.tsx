import NoteDialog from "@/components/forms/note/note-form-dialog";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/note/columns";
import { getNotes } from "@/app/api/note/route";

export default async function Home() {
  const notes = await getNotes();
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Notes</h1>

      <div className="flex justify-end">
        <NoteDialog />
      </div>
      <DataTable columns={columns} data={notes} />
    </main>
  );
}
