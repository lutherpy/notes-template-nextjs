import { getDepartments } from "@/services/department";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import DeleteDepartmentButton from "@/components/delete-button/department/delete-department-button";
import DepartmentForm from "@/components/forms/department/department-form";
import { Department } from "@/db/schema";

export default async function DepartmentTable() {
  const departments = await getDepartments();

  return (
    <Table>
      <TableCaption>A list departments.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Title</TableHead>
          <TableHead>Departmentname</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>User ID</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.map((department: Department) => (
          <TableRow key={department.id}>
            <TableCell className="font-medium">{department.name}</TableCell>
            <TableCell>{department.description}</TableCell>
            <TableCell>{department.createdAt?.toLocaleString()}</TableCell>

            <TableCell className="text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost">
                    <Pencil className="size-4" />
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Department</DialogTitle>
                    <DepartmentForm department={department} />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <DeleteDepartmentButton departmentId={department.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
