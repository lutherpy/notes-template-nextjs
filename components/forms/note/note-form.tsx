"use client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.string().min(2).max(100),
});

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
import { createNote, updateNote } from "@/app/api/note/route";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Note } from "@/db/schema";

interface NoteFormProps {
  note?: Note;
}

export default function NoteForm({ note }: NoteFormProps) {
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
      const noteData = {
        ...values,
      };

      if (note) {
        await updateNote({
          ...noteData,
          id: note.id,
          userId: note.userId,
        });
      } else {
        await createNote(noteData);
      }

      form.reset();

      toast.success(`Note ${note ? "updated" : "added"} successfully`);
      router.refresh();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${note ? "update" : "add"} note`);
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
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Install NextJS" {...field} />
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
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input placeholder="Note Content" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            `${note ? "Update" : "Add"} Note`
          )}
        </Button>
      </form>
    </Form>
  );
}
