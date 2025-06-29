"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { createUserDetails } from "@/services/user-details"; // ajuste o caminho conforme necessário
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

// ✅ Schema de validação
const formSchema = z.object({
  address: z.string().min(5, "Informe a morada completa"),
  identificationNumber: z.string().min(5, "Número inválido"),
  country: z.string().min(2, "Informe o país"),
  province: z.string().min(2, "Informe a província"),
});

type FormData = z.infer<typeof formSchema>;

export function UserDetailsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      identificationNumber: "",
      country: "",
      province: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    if (isSubmitting) return; // Evita submissões duplicadas

    try {
      setIsSubmitting(true);
      await createUserDetails(values);
      console.log("Detalhes do usuário salvos:", values);
      toast.success("Detalhes salvos com sucesso!");
      router.push("/dashboard"); // redireciona após salvar
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Erro ao salvar detalhes.");
      } else {
        toast.error("Erro ao salvar detalhes.");
      }
    } finally {
      setIsSubmitting(false); // Garante reabilitação do botão
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto"
      >
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Morada</FormLabel>
              <FormControl>
                <Input placeholder="Rua, bairro, nº..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="identificationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nº de Identificação</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 123456789LA034" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>País</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Angola" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Província</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Luanda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Detalhes"}
        </Button>
      </form>
    </Form>
  );
}
