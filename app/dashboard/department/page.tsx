import DepartmentDialog from "@/components/forms/department/department-form-dialog";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/department/columns";
import { getDepartments } from "@/services/department";

export default async function Department() {
  const departments = await getDepartments();
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Departments</h1>

      <div className="flex justify-end">
        <DepartmentDialog />
      </div>
      <DataTable columns={columns} data={departments} />
    </main>
  );
}
