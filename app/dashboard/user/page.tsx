import { columns } from "@/components/tables/user/columns";
import { DataTableServer } from "@/components/data-table-server";

export default function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="flex justify-start"></div>
      <DataTableServer
        endpoint="/api/user"
        columns={columns}
        titleColumn="name"
        titleLabel="Nome"
      />
    </main>
  );
}
