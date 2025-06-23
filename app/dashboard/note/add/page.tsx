import { NoteForm } from '@/components/note/noteForm';
import { db } from "@/db/drizzle";
import { note } from "@/db/schema";
import { noteSchema } from '@/app/api/note/noteSchema';
import { randomUUID } from 'crypto';
import { redirect } from 'next/navigation';

export default function NewNotePage() {
  async function createNote(data: noteSchema) {
    'use server';
    await db.insert(note).values({ id: randomUUID(), ...data });
    redirect('/dashboard/note');
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl mb-4">Nova Nota</h1>
      <NoteForm onSubmit={createNote} />
    </main>
  );
}
