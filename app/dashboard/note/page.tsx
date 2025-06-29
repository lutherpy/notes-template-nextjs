import NoteDialog from "@/components/forms/note/note-form-dialog";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/note/columns";
import { getNotes } from "@/services/note"; // ✅ Importação correta

export default async function Home() {
  const notes = await getNotes(); // ✅ Sem fetch()

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
