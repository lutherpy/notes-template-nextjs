"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Pencil, MoreHorizontal } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DeleteDepartmentButton from "@/components/delete-button/department/delete-department-button";
import DepartmentForm from "@/components/forms/department/department-form";
import { Department } from "@/db/schema";

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const value = row.original.createdAt;
      return value ? new Date(value).toLocaleString() : "—";
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const value = row.original.createdAt;
      return value ? new Date(value).toLocaleString() : "—";
    },
  },

  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const department = row.original;

      return (
        <div className="flex justify-end">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <DialogTrigger asChild>
                    <button className="w-full flex items-center gap-2 text-sm">
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                  </DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <DeleteDepartmentButton departmentId={department.id} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Department</DialogTitle>
                <DepartmentForm department={department} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
