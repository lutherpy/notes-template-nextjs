import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/user/columns";
import { getUsers } from "@/services/user"; // ✅ Importação correta

export default async function Home() {
  const users = await getUsers(); // ✅ Sem fetch()

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>

      <DataTable columns={columns} data={users} />
    </main>
  );
}
