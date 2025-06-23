import { z } from 'zod';

export const noteSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  content: z.string().min(1, 'O conteúdo é obrigatório'),
});

export type NoteInput = z.infer<typeof noteSchema>;