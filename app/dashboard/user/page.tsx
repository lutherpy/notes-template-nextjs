import UsersTable from "@/components/users-table";

import UserDialog from "@/components/forms/user/user-form-dialog";

export default async function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="flex justify-end">
        <UserDialog />
      </div>

      <UsersTable />
    </main>
  );
}
