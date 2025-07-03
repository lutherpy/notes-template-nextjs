"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { deleteDepartment } from "@/services/department";

interface DeleteDepartmentButtonProps {
  departmentId: string;
  endpoint?: string; // ✅ Para SWR mutate seletiva
}

export default function DeleteDepartmentButton({
  departmentId,
  endpoint = "/api/department",
}: DeleteDepartmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteDepartment(departmentId);
      toast.success("Departamento eliminado com sucesso.");

      // ✅ Atualiza cache do SWR com base no endpoint
      await mutate(
        (key) => typeof key === "string" && key.startsWith(endpoint),
        undefined,
        { revalidate: true }
      );

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao eliminar departamento.");
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
            Esta ação não pode ser desfeita. O departamento será permanentemente
            removido do sistema.
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
