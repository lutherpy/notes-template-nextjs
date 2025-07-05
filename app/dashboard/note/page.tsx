import { columns } from "@/components/tables/note/columns";
import { DataTableServer } from "@/components/data-table-server";
import NoteDialog from "@/components/forms/note/note-form-dialog";

export default function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Notas</h1>
      <div className="flex justify-start">
        <NoteDialog />
      </div>
      <DataTableServer
        endpoint="/api/note"
        columns={columns}
        titleColumn="title"
        titleLabel="Nome"
      />
    </main>
  );
}
