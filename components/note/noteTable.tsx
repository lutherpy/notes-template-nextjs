// components/NoteTable.tsx
// ================================
'use client';

import { DataTable } from '@/components/data-table';
import { columns } from './noteColumns';

interface Note {
  id: string;
  title: string;
  content: string;
}

interface NoteTableProps {
  data: Note[];
  onDelete: (id: string) => void;
}

export function NoteTable({ data, onDelete }: NoteTableProps) {
  return (
    <div className="mt-4">
      <DataTable columns={columns(onDelete)} data={data} />
    </div>
  );
}