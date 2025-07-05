"use client";

import { columns } from "@/components/tables/department/columns";
import { DataTableServer } from "@/components/data-table-server";
import DepartmentDialog from "@/components/forms/department/department-form-dialog";

export default function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Departamentos</h1>
      <div className="flex justify-start">
        <DepartmentDialog />
      </div>
      <DataTableServer
        endpoint="/api/department"
        columns={columns}
        titleColumn="title"
        titleLabel="Nome"
      />
    </main>
  );
}
