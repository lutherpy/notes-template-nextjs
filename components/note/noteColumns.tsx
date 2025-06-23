// components/NoteTableColumns.tsx
// ================================

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Note {
  id: string;
  title: string;
  content: string;
}

export function columns(onDelete: (id: string) => void): ColumnDef<Note>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Título',
    },
    {
      accessorKey: 'content',
      header: 'Conteúdo',
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link href={`/edit/${row.original.id}`} className="text-blue-500">Editar</Link>
          <Button variant="destructive" onClick={() => onDelete(row.original.id)}>Excluir</Button>
        </div>
      ),
    },
  ];
}