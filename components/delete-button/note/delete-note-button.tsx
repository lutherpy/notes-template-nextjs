"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr"; // ✅ importado para forçar revalidação

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { deleteNote } from "@/services/note";

interface DeleteNoteButtonProps {
  noteId: string;
  endpoint?: string; // ✅ usado para determinar qual cache atualizar
}

export default function DeleteNoteButton({
  noteId,
  endpoint = "/api/note", // valor por padrão
}: DeleteNoteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteNote(noteId);
      toast.success("Nota eliminada com sucesso.");

      // ✅ Força revalidação do SWR para esse endpoint
      await mutate(
        (key) => typeof key === "string" && key.startsWith(endpoint),
        undefined,
        { revalidate: true }
      );

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao eliminar a nota.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Trash2 className="size-4 mr-1" />
          Eliminar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tem certeza absoluta?</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. A nota será permanentemente
            removida do sistema.
          </DialogDescription>

          <Button
            disabled={isLoading}
            variant="destructive"
            onClick={handleDelete}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
