"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { mutate } from "swr";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Note } from "@/db/schema";

import { createNote, updateNote } from "@/services/note";

// ✅ Esquema de validação
const formSchema = z.object({
  title: z.string().min(2, "Mínimo 2 caracteres").max(50),
  content: z.string().min(2, "Mínimo 2 caracteres").max(100),
});

interface NoteFormProps {
  note?: Note;
  endpoint?: string; // Adicionado para saber qual mutate usar
}

export default function NoteForm({
  note,
  endpoint = "/api/note",
}: NoteFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      if (note) {
        await updateNote({ ...values, id: note.id, userId: note.userId ?? "" });
      } else {
        await createNote(values);
      }

      // ✅ Força revalidação do SWR com prefixo
      await mutate(
        (key) => typeof key === "string" && key.startsWith(endpoint),
        undefined,
        { revalidate: true }
      );

      form.reset();
      toast.success(`Nota ${note ? "actualizada" : "adicionada"} com sucesso`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(`Falha ao ${note ? "actualizar" : "adicionar"} nota`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Instalar NextJS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Usar create-next-app" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            `${note ? "Actualizar" : "Adicionar"} Nota`
          )}
        </Button>
      </form>
    </Form>
  );
}
