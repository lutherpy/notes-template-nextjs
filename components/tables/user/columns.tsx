"use client";
import { ColumnDef } from "@tanstack/react-table";

import { User } from "@/db/schema";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const value = row.original.createdAt;
      return value ? new Date(value).toLocaleString() : "—";
    },
  },
];
