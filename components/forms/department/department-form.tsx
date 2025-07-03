"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
import { createDepartment, updateDepartment } from "@/services/department";
import { Department } from "@/db/schema";

// ✅ Esquema de validação
const formSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(50),
  description: z.string().min(2, "Mínimo 2 caracteres").max(100),
});

interface DepartmentFormProps {
  department?: Department;
  endpoint?: string; // opcional, para uso com mutate
}

export default function DepartmentForm({
  department,
  endpoint = "/api/department",
}: DepartmentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: department?.name || "",
      description: department?.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      if (department) {
        await updateDepartment({
          id: department.id,
          ...values,
        });
      } else {
        await createDepartment(values);
      }

      // ✅ Força revalidação do SWR
      await mutate(
        (key) => typeof key === "string" && key.startsWith(endpoint),
        undefined,
        { revalidate: true }
      );

      form.reset();
      toast.success(
        `Departamento ${department ? "actualizado" : "adicionado"} com sucesso`
      );
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        `Erro ao ${department ? "actualizar" : "adicionar"} departamento`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Departamento de Tecnologia"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Descrição do departamento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            `${department ? "Actualizar" : "Adicionar"} Departamento`
          )}
        </Button>
      </form>
    </Form>
  );
}
