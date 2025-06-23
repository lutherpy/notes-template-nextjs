'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { noteSchema, NoteInput } from '@/app/api/note/noteSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface NoteFormProps {
  onSubmit: (data: NoteInput) => void;
  defaultValues?: NoteInput;
}

export function NoteForm({ onSubmit, defaultValues }: NoteFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register('title')} placeholder="Título" />
      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

      <Textarea {...register('content')} placeholder="Conteúdo" />
      {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}

      <Button type="submit">Salvar</Button>
    </form>
  );
}